// Copyright (c) 2025, FaceNet and contributors
// For license information, please see license.txt

frappe.ui.form.on("List View Action Config", {
  onload(frm) {
    frm.__doctype_selected = false;
  },

  target_doctype(frm) {
    if (!frm.doc.target_doctype) return;
    frm.__doctype_selected = true;
    window.load_groupable_fields(frm);
  },
});

window.load_groupable_fields = async function (frm) {
  if (!frm.__doctype_selected) return;

  frm.clear_table("group_by_field");
  frm.refresh_field("group_by_field");

  try {
    const r = await frappe.call({
      method: "superproject.api.listview_grouping.get_groupable_fields",
      args: { doctype: frm.doc.target_doctype },
      freeze: true,
      freeze_message: __("Loading groupable fields"),
    });

    const fields = r.message || [];
    if (!fields.length) return;

    fields.forEach((f, i) => {
      const row = frm.add_child("group_by_field");
      row.field_name = f.fieldname;
      row.field_label = f.label;
      row.enabled = 0;
      row.idx = i + 1;
    });

    frm.refresh_field("group_by_field");
  } catch (err) {
    frappe.msgprint({
      title: __("Group by Field error"),
      message: err.message || err,
      indicator: "red",
    });
  }
};
