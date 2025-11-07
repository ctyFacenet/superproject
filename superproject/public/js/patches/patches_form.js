
frappe.provide('frappe.ui.form');

frappe.ui.form.Form.prototype.add_custom_button = async function(label, fn, group, doctype_name=null) {

    if (doctype_name) {
        let display = await frappe.db.get_doc('Display');
        let deactive_items = display.items.filter(item => item.link_to === doctype_name && item.deactive);
        if (deactive_items.length > 0) return null
    }

    if (group && group.indexOf("fa fa-") !== -1) group = null;

    let btn = this.page.add_inner_button(label, fn, group);

    if (btn) {
        // Add actions as menu item in Mobile View
        let menu_item_label = group ? `${group} > ${label}` : label;
        let menu_item = this.page.add_menu_item(menu_item_label, fn, false);
        menu_item.parent().addClass("hidden-xl");

        this.custom_buttons[label] = btn;
    }
    return btn;
};