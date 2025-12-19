// Copyright (c) 2025, FaceNet and contributors
// For license information, please see license.txt

frappe.ui.form.on("List View Action Config", {
  onload(frm) {
    frm.set_query("doctype", () => {
      return {
        query: "frappe.core.doctype.doctype.doctype.get_doctypes",
        filters: {
          issingle: 0,
          istable: 0,
        },
      };
    });
  },
});
