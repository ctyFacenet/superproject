# Copyright (c) 2025, FaceNet and contributors
# For license information, please see license.txt

import frappe
from difflib import SequenceMatcher
from frappe.model.document import Document


class WorkflowChain(Document):
    def on_update(self):
        if not (self.end_chain and self.chain_name): return

        fieldname = self.chain_name.strip().lower()
        doctype = self.end_chain

        if self.enabled:
            cf_name = frappe.db.exists("Custom Field", {"dt": doctype, "fieldname": fieldname})

            if not cf_name:
                cf_doc = frappe.get_doc({
                    "doctype": "Custom Field",
                    "dt": doctype,
                    "fieldname": fieldname,
                    "label": fieldname.replace("_", " ").title(),
                    "fieldtype": "Link",
                    "options": self.start_chain,
                    "insert_after": "modified",
                    "owner": frappe.session.user
                })
                cf_doc.insert(ignore_permissions=True)
            else:
                cf_doc = frappe.get_doc("Custom Field", cf_name)
                if cf_doc.hidden:
                    cf_doc.hidden = 0
                    cf_doc.save(ignore_permissions=True)

        else:
            cf_name = frappe.db.get_value("Custom Field", {"dt": doctype, "fieldname": fieldname}, "name")
            if cf_name:
                cf_doc = frappe.get_doc("Custom Field", cf_name)
                if not cf_doc.hidden:
                    cf_doc.hidden = 1
                    cf_doc.save(ignore_permissions=True)

        frappe.clear_cache(doctype=doctype)

@frappe.whitelist()
def get_chain(doctype):
    chains = frappe.db.get_all("Workflow Chain", filters={"start_chain": doctype, "enabled": 1}, fields=["name", "end_chain"])
    result = []
    for c in chains:
        result.append({"name": c.name, "title": f"Tạo {frappe._(c.end_chain)}", "doctype": c.end_chain})
    return result

@frappe.whitelist()
def set_chain(chain, docname):
    workflow = frappe.get_doc("Workflow Chain", chain)
    start_doc = frappe.get_doc(workflow.start_chain, docname)
    end_doc = frappe.new_doc(workflow.end_chain)

    for item in workflow.items:
        start_field, end_field = item.start_field, item.end_field

        # Child table check
        if ":" in start_field:
            start_child, start_child_field = start_field.split(":")
            end_child, end_child_field = end_field.split(":")
            setattr(
                end_doc,
                end_child,
                [{end_child_field: row.get(start_child_field)} for row in getattr(start_doc, start_child, [])]
            )
        else:
            setattr(end_doc, end_field, getattr(start_doc, start_field, None))

    setattr(end_doc, workflow.chain_name, docname)
    end_doc.insert()
    return end_doc.name

@frappe.whitelist()
def get_mapping_fields(start_chain, end_chain):
    """
    Tự động gợi ý mapping giữa các field của 2 Doctype:
    - So sánh field name giữa start_chain và end_chain
    - Nếu có child table, map theo format: <child_table>.<fieldname>
    """
    def get_fields(doctype):
        meta = frappe.get_meta(doctype)
        fields = []

        for df in meta.fields:
            if df.fieldtype == "Table" and df.options:
                child_meta = frappe.get_meta(df.options)
                for child_df in child_meta.fields:
                    if child_df.fieldtype not in ["Section Break", "Column Break"]:
                        fields.append(f"{df.fieldname}.{child_df.fieldname}")
            elif df.fieldtype not in ["Section Break", "Column Break"]:
                fields.append(df.fieldname)

        return fields

    start_fields = get_fields(start_chain)
    end_fields = get_fields(end_chain)

    mappings = []

    for s_field in start_fields:
        best_match = None
        highest_score = 0

        for e_field in end_fields:
            score = SequenceMatcher(None, s_field.lower(), e_field.lower()).ratio()
            if score > highest_score:
                best_match = e_field
                highest_score = score
        
        if highest_score >= 0.7:
            mappings.append({
                "start_field": s_field,
                "end_field": best_match
            })

    return mappings