// Copyright (c) 2025, FaceNet and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sales Opportunity", {
	refresh: async function(frm) {
        if (!frm.is_new()) {
            await frm.add_custom_button("Tạo Báo giá", () => {}, group=null, doctype_name="Quotation")
            await frm.add_custom_button("Tạo Đơn mua hàng", () => {}, group=null, doctype_name="Sales Order")
        }
	},
});
