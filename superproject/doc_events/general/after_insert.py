import frappe
from frappe.model import delete_doc

def add_to_display(doc, method):
	display = frappe.get_single("Display")
	display.append("items", {
		"link_to": doc.name,
		"type":  doc.doctype,
		"module": doc.module
	})
	display.save(ignore_permissions=True)