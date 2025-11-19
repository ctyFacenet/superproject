import frappe
import json

@frappe.whitelist()
def get_layout_by_type(data=None):
    """Get data from list view"""
    data = json.loads(data or "{}")

    machine_type = (data.get("machinecode") or "default").lower()

    template_path = f"superproject/templates/machine_templates/{machine_type}.html"

    return {
        "title": data.get("machinename", "MÁY"),
        "availability": data.get("availability", 0),
        "html": frappe.render_template(template_path, {"data": frappe._dict(data)}),
    }
