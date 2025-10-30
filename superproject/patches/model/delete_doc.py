import frappe
from frappe import _
from frappe.model.delete_doc import (
	is_virtual_doctype, 
	delete_all_passwords_for, 
	update_flags, 
	update_naming_series, 
	check_permission_and_not_submitted, 
	delete_from_table, 
	delete_controllers,
	check_if_doc_is_dynamically_linked,
	check_if_doc_is_linked,
	remove_all,
	delete_for_document,
	delete_tags_for_document,
	add_to_deleted_document,
	insert_feed)

def patched_delete_doc(
	doctype=None,
	name=None,
	force=0,
	ignore_doctypes=None,
	for_reload=False,
	ignore_permissions=False,
	flags=None,
	ignore_on_trash=False,
	ignore_missing=True,
	delete_permanently=False,
):
	"""
	Deletes a doc(dt, dn) and validates if it is not submitted and not linked in a live record
	"""
	if not ignore_doctypes:
		ignore_doctypes = []

	# get from form
	if not doctype:
		doctype = frappe.form_dict.get("dt")
		name = frappe.form_dict.get("dn")

	is_virtual = is_virtual_doctype(doctype)

	names = name
	if isinstance(name, str) or isinstance(name, int):
		names = [name]

	for name in names or []:
		if is_virtual:
			frappe.get_doc(doctype, name).delete()
			continue

		# already deleted..?
		if not frappe.db.exists(doctype, name):
			if not ignore_missing:
				raise frappe.DoesNotExistError(doctype=doctype)
			else:
				return False

		# delete passwords
		delete_all_passwords_for(doctype, name)

		doc = None
		if doctype == "DocType":
			if for_reload:
				try:
					doc = frappe.get_doc(doctype, name)
				except frappe.DoesNotExistError:
					pass
				else:
					doc.run_method("before_reload")

			else:
				doc = frappe.get_doc(doctype, name)
				if not (doc.custom or frappe.conf.developer_mode or frappe.flags.in_patch or force):
					frappe.throw(_("Standard DocType can not be deleted."))

				update_flags(doc, flags, ignore_permissions)
				check_permission_and_not_submitted(doc)
				# delete custom table fields using this doctype.
				frappe.db.delete(
					"Custom Field", {"options": name, "fieldtype": ("in", frappe.model.table_fields)}
				)
				frappe.db.delete("__global_search", {"doctype": name})

			delete_from_table(doctype, name, ignore_doctypes, None)
			doc.run_method("on_trash")

			if (
				frappe.conf.developer_mode
				and not doc.custom
				and not (
					for_reload
					or frappe.flags.in_migrate
					or frappe.flags.in_install
					or frappe.flags.in_uninstall
				)
			):
				try:
					delete_controllers(name, doc.module)
				except (OSError, KeyError):
					# in case a doctype doesnt have any controller code  nor any app and module
					pass

		else:
			# Lock the doc without waiting
			try:
				frappe.db.get_value(doctype, name, for_update=True, wait=False)
			except (frappe.QueryTimeoutError, frappe.QueryDeadlockError):
				frappe.throw(
					_(
						"This document can not be deleted right now as it's being modified by another user. Please try again after some time."
					),
					exc=frappe.QueryTimeoutError,
				)
			doc = frappe.get_doc(doctype, name)

			if not for_reload:
				update_flags(doc, flags, ignore_permissions)
				check_permission_and_not_submitted(doc)

				if not ignore_on_trash:
					doc.run_method("on_trash")
					doc.flags.in_delete = True
					doc.run_method("on_change")

				# check if links exist
				if not force:
					try:
						check_if_doc_is_linked(doc)
						check_if_doc_is_dynamically_linked(doc)
					except frappe.LinkExistsError as e:
						if doc.meta.has_field("enabled") or doc.meta.has_field("disabled"):
							frappe.throw(
								_("You can disable this {0} instead of deleting it.").format(_(doctype)),
								frappe.LinkExistsError,
							)
						else:
							raise e

			update_naming_series(doc)
			delete_from_table(doctype, name, ignore_doctypes, doc)
			doc.run_method("after_delete")

			# delete attachments
			remove_all(doctype, name, from_delete=True, delete_permanently=delete_permanently)

			if not for_reload:
				# Enqueued at the end, because it gets committed
				# All the linked docs should be checked beforehand
				frappe.enqueue(
					"frappe.model.delete_doc.delete_dynamic_links",
					doctype=doc.doctype,
					name=doc.name,
					now=frappe.flags.in_test,
					enqueue_after_commit=True,
				)

		# clear cache for Document
		doc.clear_cache()
		# delete global search entry
		delete_for_document(doc)
		# delete tag link entry
		delete_tags_for_document(doc)

		if for_reload:
			delete_permanently = True

		if not delete_permanently:
			add_to_deleted_document(doc)

		if doc and not for_reload:
			if not frappe.flags.in_patch:
				try:
					doc.notify_update()
					insert_feed(doc)
				except ImportError:
					pass


def apply_patch():
	frappe.model.delete_doc.delete_doc = patched_delete_doc