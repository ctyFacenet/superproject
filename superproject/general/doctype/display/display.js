// Copyright (c) 2025, FaceNet and contributors
// For license information, please see license.txt

frappe.ui.form.on("Display", {
	refresh(frm) {

		frm.fields_dict.items.grid.get_field('link_to').get_query = function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            let filters = { module: row.module };
            if (row.type === "Doctype") filters.istable = 0
            return { filters: filters };
        };

        frm.fields_dict.items.grid.get_field('group').get_query = function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            let filters = { module: row.module };
            return { filters: filters };
        };

        frm.events.setup_ui(frm)
	},

    after_save: async function(frm) {
        frappe.show_alert("F5 trang để áp dụng thay đổi Menu Bar")
    },

    setup_ui(frm) {
        $wrapper = frm.fields_dict.wrapper.$wrapper
        let component = new superproject.ui.DisplayLayoutComponent({wrapper: $wrapper[0], frm: frm})
    }
});