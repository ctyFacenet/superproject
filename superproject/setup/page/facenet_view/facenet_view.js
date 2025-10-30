frappe.pages['facenet-view'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'FaceNet',
		single_column: true
	});
}