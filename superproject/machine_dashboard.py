import frappe

@frappe.whitelist()
def get_layout_by_type(machine_type=None):
    data = get_mock_data(machine_type)
    if not machine_type:
        machine_type = "default"

    template_path = f"superproject/templates/machine_templates/{machine_type.lower()}.html"

    return {
        "title": data.get("workstation_name"),
        "availability": data.get("availability"),
        "html": frappe.render_template(template_path, {"data": data}),
    }


def get_mock_data(machine_type):
    return {
        "workstation_name": f"MÁY {machine_type}" if machine_type else "MÁY KÉO",
        "availability": 91,

        "temperature_motor": 47,
        "temperature_oil": 45,
        "temperature_nhu_tuong": 45,
        "temperature_ui": 46,
        "temperature_water": 30,
        "temperature_fan": 42,

        "speed": 680,
        "dv_speed": 900,
        "kv_speed": 705,
        "fan_speed": 1000,
        "df_speed": 620,
        "wind_m3": 2200,

        "stop_time": "03:39:03",
        "running_time": "04:21:57",
        "planned_time": "08:00:00",

        "work_order": "WO_EIAWM050",
        "operation": "Kéo đai",
        "item_code": "EIAWM050_A.2S",
        "qty_plan": 100,
        "qty_actual": 98,
        "qty_ok": 80,
        "qty_ng": 12,
        "scrap_rate": 11.4,

        "standard_dv_min": 900,
        "standard_dv_max": 1000,

        "stop_men": 140,
        "stop_fan": 120,
        "stop_bobbin": 30,
    }
