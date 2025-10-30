# Copyright (c) 2025, FaceNet and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Display(Document):
    pass

@frappe.whitelist()
def get_module_display(link_to_name):
    doc = frappe.get_single("Display")
    if not doc or not doc.items: return []
    target_module = None
    for r in doc.items:
        if r.link_to == link_to_name:
            target_module = r.module
            break    

    rows = [r for r in doc.items if r.module == target_module]
    if not rows: return []

    grouped = {}
    ungrouped = []

    for r in rows:
        if r.group:
            grouped.setdefault(r.group, []).append(r)
        else:
            ungrouped.append(r)

    result = []

    # group
    for group_name, group_rows in grouped.items():
        group_doc = frappe.get_doc("Display Group", group_name)
        result.append({
            "label": group_doc.group_name,
            "child": [
                {
                    "type": x.type,
                    "link_to": x.link_to,
                    **({"is_single": frappe.get_meta(x.link_to).issingle} if x.type == "DocType" else {}),
                    **({"title": frappe.db.get_value("Page", x.link_to, "title")} if x.type == "Page" else {})
                }
                for x in group_rows if x.link_to
            ]
        })

    # ungrouped
    for x in ungrouped:
        if x.link_to:
            result.append({
                "label": frappe.db.get_value("Page", x.link_to, "title") if x.type == "Page" else frappe._(x.link_to),
                "link_to": x.link_to,
                "type": x.type,
                **({"is_single": frappe.get_meta(x.link_to).issingle} if x.type == "DocType" else {})
            })

    return result

@frappe.whitelist()
def get_module_name(link_to_name):
    doc = frappe.get_single("Display")
    if not doc or not doc.items: return []
    target_module = None
    for r in doc.items:
        if r.link_to == link_to_name:
            target_module = r.module
            break
    return target_module

@frappe.whitelist()
def get_modules_display():
    doc = frappe.get_single("Display")
    if not doc or not doc.items: return []
    modules = {}
    
    for item in doc.items:
        module_name = item.module
        if module_name not in modules and item.link_to:
            modules[module_name] = {
                "module": module_name,
                "link_to": item.link_to,
                "type": item.type,
                "is_single": frappe.get_meta(item.link_to).issingle if item.link_to else False
            }

    return list(modules.values())

