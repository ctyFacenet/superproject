# Copyright (c) 2025, FaceNet and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ListViewActionConfig(Document):
    """
    Doctype lưu cấu hình List View Actions
    """
    pass


@frappe.whitelist()
def run(doctype, action_key, names):
    """
    Entry point cho List View Actions
    """
    if isinstance(names, str):
        names = frappe.parse_json(names)

    if not names:
        frappe.throw("Không có bản ghi nào được chọn")

    handlers = {
        "approve": approve_docs,
        "custom_logic": do_something_custom,
        "cancel": cancel_docs,
    }

    if action_key not in handlers:
        frappe.throw(f"Unknown action: {action_key}")

    return handlers[action_key](doctype, names)


def approve_docs(doctype, names):
    """
    Action: duyệt chứng từ (KHÔNG submit chỉ set status)
    """
    for name in names:
        doc = frappe.get_doc(doctype, name)

        if hasattr(doc, "status"):
            doc.status = "Đã duyệt"
            doc.save(ignore_permissions=True)

    frappe.db.commit()

    return {
        "message": "Đã duyệt thành công",
        "count": len(names),
    }


def cancel_docs(doctype, names):
    """
    Action: huỷ chứng từ
    """
    for name in names:
        doc = frappe.get_doc(doctype, name)

        if doc.docstatus == 1:
            doc.cancel()

    frappe.db.commit()

    return {
        "message": "Đã huỷ thành công",
        "count": len(names),
    }


def do_something_custom(doctype, names):
    """
    Custom logic để mở rộng
    """
    frappe.logger().info(
        f"[ListViewAction] Custom logic on {doctype}: {names}"
    )

    return {
        "message": "Custom logic executed",
        "count": len(names),
    }
