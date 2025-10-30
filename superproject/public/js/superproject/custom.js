frappe.router.render = function () {
    if (this.current_route[0]) {
        this.render_page();
    } else {
        frappe.set_route(['app', 'module-list']);
    }

    if (frappe.get_route_str() === "module-list") {
        frappe.ui.toolbar.setup_custom_menu_bar(true)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (frappe.Application) {
        frappe.Application.prototype.redirect_to_login = function() {
            window.location.href = `/login?`
        };
    }
});