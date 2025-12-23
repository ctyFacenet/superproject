import frappe

@frappe.whitelist()
def get_groupable_fields(doctype: str):
    if not doctype:
        return []

    try:
        meta = frappe.get_meta(doctype)
    except Exception:
        return []

    allowed = {
        "Data", "Link", "Select", "Date", "Datetime",
        "Int", "Float", "Currency", "Small Text",
    }

    out = []
    for f in meta.fields:
        if f.hidden:
            continue
        if not f.fieldname:
            continue
        if f.fieldtype not in allowed:
            continue

        out.append({
            "fieldname": f.fieldname,
            "label": f.label or f.fieldname,
            "fieldtype": f.fieldtype,
        })

    return out
