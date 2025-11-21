
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

frappe.ui.form.Form.prototype.render_form = async function(switched) {
    if (!this.meta.istable) {
        this.layout.doc = this.doc;
        this.layout.attach_doc_and_docfields();

        if (frappe.boot.desk_settings.form_sidebar) {
            this.sidebar = new frappe.ui.form.Sidebar({
                frm: this,
                page: this.page,
            });
            this.sidebar.make();
        }

        // clear layout message
        this.layout.show_message();

        frappe.run_serially([
            // header must be refreshed before client methods
            // because add_custom_button
            () => this.refresh_header(switched),
            // trigger global trigger
            // to use this
            () => $(document).trigger("form-refresh", [this]),
            // fields
            () => this.refresh_fields(),
            // call trigger
            () => this.script_manager.trigger("refresh"),
            // call onload post render for callbacks to be fired
            () => {
                if (this.cscript.is_onload) {
                    this.onload_post_render();
                    return this.script_manager.trigger("onload_post_render");
                }
            },
            () => this.cscript.is_onload && this.is_new() && this.focus_on_first_input(),
            () => this.run_after_load_hook(),
            () => this.dashboard.after_refresh(),
        ]);
    } else {
        this.refresh_header(switched);
    }

    this.$wrapper.trigger("render_complete");

    frappe.after_ajax(() => {
        $(document).ready(async () => {
            this.scroll_to_element();

            if (!this.doctype) return;
            if (this.is_new()) return;
            let chains = await frappe.xcall('superproject.general.doctype.workflow_chain.workflow_chain.get_chain', {doctype: this.doctype});
            chains.forEach(c=> {
                this.add_custom_button(c.title, async () => {
                    let doc = await frappe.xcall('superproject.general.doctype.workflow_chain.workflow_chain.set_chain', { chain: c.name, docname: this.docname });
                    frappe.set_route('Form', c.doctype, doc)
                    frappe.show_alert({message: `Tạo thành công ${__(c.doctype)}`, indicator: "green"})
                })
            })
        });
    });
}