document.addEventListener("DOMContentLoaded", () => {
    if (frappe.Application) {
        frappe.Application.prototype.redirect_to_login = function() {
            window.location.href = `/login?`
        };
    }
});