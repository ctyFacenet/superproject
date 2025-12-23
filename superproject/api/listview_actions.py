import frappe

@frappe.whitelist()
def get_listview_action_config(doctype):
    cfg = frappe.get_all(
        "List View Action Config",
        filters={"target_doctype": doctype},
        limit=1,
        pluck="name",
    )
    if not cfg:
        return None

    doc = frappe.get_doc("List View Action Config", cfg[0])

    group_by = []
    if getattr(doc, "group_by_field", None):
        rows = sorted(doc.group_by_field, key=lambda r: (r.idx or 0))
        group_by = [
            r.field_name
            for r in rows
            if getattr(r, "enabled", 0) and getattr(r, "field_name", None)
        ]

    return {
        "title": doc.title,
        "hide_tree": doc.hide_tree,
        "hide_select": doc.hide_select,
        "hide_search_full_text": doc.hide_search_full_text,
        "enable_collapse": doc.enable_collapse,

        "group_by_field": group_by,

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
