frappe.pages['module-list'].on_page_load = async function (wrapper) {
  var page = frappe.ui.make_app_page({
    parent: wrapper,
    title: '',
    single_column: true
  });

  $(".navbar-module").text('Trang chủ')
  // gắn click event
  let component = new superproject.ui.ModuleListComponent({ wrapper: page.body });

}
