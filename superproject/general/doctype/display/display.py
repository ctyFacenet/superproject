# Copyright (c) 2025, FaceNet and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Display(Document):
    pass

@frappe.whitelist()
def get_module_display(link_to_name):
    doc = frappe.get_single("Display")
    if not doc or not doc.items:
        return []

    target_module = None
    for r in doc.items:
        if r.link_to == link_to_name:
            target_module = r.module
            break

    if not target_module:
        return []

    rows = [r for r in doc.items if r.module == target_module and not r.deactive]

    groups = {}
    items_no_group = []

    for r in rows:
        if r.group:
            groups.setdefault(r.group, {
                "label": r.group,
                "parent": getattr(r, "parent_group", None),
                "child": [],
                "type": "group"
            })

    for r in rows:
        if r.group and r.parent_group:
            if r.parent_group not in groups:
                groups[r.parent_group] = {
                    "label": r.parent_group,
                    "parent": None,
                    "child": [],
                    "type": "group"
                }

    for r in rows:
        if not r.link_to:
            continue

        item = {
            "label": (
                frappe.db.get_value("Page", r.link_to, "title")
                if r.type == "Page"
                else frappe._(r.link_to)
            ),
            "type": r.type,
            "link_to": r.link_to
        }

        if r.type == "DocType":
            item["is_single"] = frappe.get_meta(r.link_to).issingle

        if r.group and r.group in groups:
            groups[r.group]["child"].append(item)
        else:
            items_no_group.append(item)


    root = []

    for name, node in groups.items():
        parent = node.get("parent")
        if parent and parent in groups:
            groups[parent]["child"].append(node)

    for name, node in groups.items():
        parent = node.get("parent")
        if not parent or parent not in groups:
            root.append(node)

    root.extend(items_no_group)

    return root

@frappe.whitelist()
def get_module_name(link_to_name):
    doc = frappe.get_single("Display")
    if not doc or not doc.items:
        return None

    for r in doc.items:
        if r.link_to == link_to_name:
            return r.module

    return None


@frappe.whitelist()
def get_modules_display():
    doc = frappe.get_single("Display")
    if not doc or not doc.items:
        return []

    modules = {}
    
    for item in doc.items:
        module_name = item.module
        if module_name not in modules and item.link_to:
            modules[module_name] = {
                "module": frappe._(module_name),
                "link_to": item.link_to,
                "type": item.type,
                "is_single": frappe.get_meta(item.link_to).issingle if item.link_to else False,
                "description": "",
                "icon": "folder",
                "direction": 0,
            }

            for m in doc.modules:
                if m.module == module_name:
                    modules[module_name]["description"] = m.description
                    modules[module_name]["icon"] = m.icon
                    modules[module_name]["direction"] = m.direction or 0

    return sorted(modules.values(), key=lambda x: x["direction"])
