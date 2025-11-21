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

    # Xác định module mục tiêu
    target_module = None
    for r in doc.items:
        if r.link_to == link_to_name:
            target_module = r.module
            break

    rows = [r for r in doc.items if r.module == target_module]
    if not rows:
        return []

    result = []
    group_cache = {}  # Để gom các bản ghi theo group, nếu group đã được tạo

    for r in rows:
        if r.deactive: continue
        if not r.link_to:
            continue

        # Nếu có group
        if r.group:
            if r.group not in group_cache:
                group_entry = {
                    "label": r.group,
                    "child": []
                }
                group_cache[r.group] = group_entry
                result.append(group_entry)
            # Thêm vào group hiện tại
            group_cache[r.group]["child"].append({
                "type": r.type,
                "link_to": r.link_to,
                **({"is_single": frappe.get_meta(r.link_to).issingle} if r.type == "DocType" else {}),
                **({"title": frappe.db.get_value("Page", r.link_to, "title")} if r.type == "Page" else {})
            })
        else:
            # Không có group → thêm trực tiếp vào result
            result.append({
                "label": frappe.db.get_value("Page", r.link_to, "title") if r.type == "Page" else frappe._(r.link_to),
                "link_to": r.link_to,
                "type": r.type,
                **({"is_single": frappe.get_meta(r.link_to).issingle} if r.type == "DocType" else {})
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
                "direction": 0,  # default direction
            }
            # Gán description, icon, direction từ doc.modules
            for m in doc.modules:
                if m.module == module_name:
                    modules[module_name]["description"] = m.description
                    modules[module_name]["icon"] = m.icon
                    modules[module_name]["direction"] = m.direction or 0

    # Chuyển sang list và sort theo direction
    return sorted(modules.values(), key=lambda x: x["direction"])


