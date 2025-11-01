# Copyright (c) 2025, FaceNet and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DisplayDoctypeSetting(Document):
	pass

@frappe.whitelist()
def open_settings(doctype, settings=None):
	doc = None
	if frappe.get_all("Display Doctype Setting", filters={"name": doctype}):
		doc = frappe.get_doc("Display Doctype Setting", doctype)
		if settings:
			doc.update(frappe.parse_json(settings))
			doc.save(ignore_permissions=True)
	else:
		doc = frappe.new_doc("Display Doctype Setting")
		doc.name = doctype
		doc.insert(ignore_permissions=True)
	return {"hide_tree": doc.hide_tree, "hide_flex": doc.hide_flex}
	