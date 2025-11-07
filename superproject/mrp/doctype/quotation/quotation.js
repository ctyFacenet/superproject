// Copyright (c) 2025, FaceNet and contributors
// For license information, please see license.txt

frappe.ui.form.on("Quotation", {
	refresh: async function(frm) {
        await frm.add_custom_button("Tạo Đơn mua hàng", () => {}, group=null, doctype_name="Sales Order")
	},
});