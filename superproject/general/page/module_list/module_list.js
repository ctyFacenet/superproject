frappe.pages['module-list'].on_page_load = async function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: '',
        single_column: true
    });

    let modules = await frappe.xcall('superproject.general.doctype.display.display.get_modules_display');

    $(frappe.render_template('module_list', { modules })).appendTo(page.body);
    $(".navbar-module").text('Trang chủ')

    // gắn click event
    page.body.find('.module-card').each(function() {
        const $card = $(this);
        const link_to = $card.data('link_to');
        const is_single = $card.data('is_single') === 'true';
        $card.on('click', async () => {
            if (is_single) {
                frappe.set_route('Form', link_to);
            } else {
                frappe.set_route('List', link_to);
            }
            frappe.ui.toolbar.setup_custom_menu_bar()
        });
    });
}
