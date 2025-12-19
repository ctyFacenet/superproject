import frappe


@frappe.whitelist()
def get_listview_action_config(doctype):
    """
    Trả về cấu hình List View Actions theo target_doctype
    """
    cfg = frappe.get_all(
        "List View Action Config",
        filters={"target_doctype": doctype},
        limit=1,
        pluck="name",
    )

    if not cfg:
        return {
            "bulk_actions": [],
            "row_actions": [],
        }

    doc = frappe.get_doc("List View Action Config", cfg[0])

    return {
        "bulk_actions": [
            {
                "label": a.label,
                "action_key": a.action_key,
                "icon": a.icon,
                "color": a.color,
                "confirm_message": a.confirm_message,
                "required_status": a.required_status,
            }
            for a in doc.bulk_actions
        ],
        "row_actions": [
            {
                "label": a.label,
                "action_key": a.action_key,
                "icon": a.icon,
                "color": a.color,
            }
            for a in doc.row_actions
        ],
    }
