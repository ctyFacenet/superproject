# Copyright (c) 2025
# License: MIT

import frappe
from frappe.model.document import Document

class RealtimeProductionProgress(Document):
    pass


@frappe.whitelist()
def get_realtime_progress():
    """
    Trả về dữ liệu realtime progress dựa trên các field có in_list_view = 1
    """

    doctype = "Realtime Production Progress"
    meta = frappe.get_meta(doctype)

    visible_fields = []

    for f in meta.fields:
        if f.in_list_view and f.fieldname:
            visible_fields.append({
                "fieldname": f.fieldname,
                "label": f.label or f.fieldname,
                "fieldtype": f.fieldtype,
            })

    fieldnames = ["name"] + [f["fieldname"] for f in visible_fields]

    select_fields = ", ".join(f"`{f}`" for f in fieldnames)

    query = f"""
        SELECT {select_fields}
        FROM `tab{doctype}`
        ORDER BY name ASC
    """

    rows = frappe.db.sql(query, as_dict=True)

    for row in rows:
        try:
            plan = float(row.get("planned_qty") or 0)
            done = float(row.get("completed_qty") or 0)
            row["completion_rate"] = f"{(done / plan * 100):.2f}%" if plan else "0%"
        except:
            row["completion_rate"] = "0%"

    if not any(f["fieldname"] == "completion_rate" for f in visible_fields):
        visible_fields.append({
            "fieldname": "completion_rate",
            "label": "Tỷ lệ hoàn thành",
            "fieldtype": "Data"
        })

    return {
        "fields": visible_fields,
        "rows": rows
    }
