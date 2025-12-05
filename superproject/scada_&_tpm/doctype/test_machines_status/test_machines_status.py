import frappe
from frappe.model.document import Document


class TestMachinesStatus(Document):

    def after_insert(self):
        publish_realtime_status()

    def on_update(self):
        publish_realtime_status()


def publish_realtime_status():
    """Đẩy toàn bộ danh sách máy lên WebSocket realtime"""
    data = get_all_machine_status()

    frappe.publish_realtime(
        "machine_status_update",
        data,
        after_commit=True
    )


@frappe.whitelist()
def get_all_machine_status():

    items = frappe.get_all(
        "Test Machines Status",
        fields=[
            "name",
            "machine_code",
            "machine_name",
            "status",
            "dv", "fan",
            "len", "tin", "tmid", "tout",
            "availability",
            "last_update"
        ],
        order_by="machine_code asc"
    )

    for m in items:
        s = (m.get("status") or "").lower()

        if "đang chạy" in s:
            m["status_class"] = "running"

        elif "dừng" in s:
            m["status_class"] = "stop"

        elif "máy lỗi" in s:
            m["status_class"] = "error"

        else:
            m["status_class"] = "stop"

    return items
