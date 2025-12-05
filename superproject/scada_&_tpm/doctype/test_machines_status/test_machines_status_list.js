frappe.listview_settings["Test Machines Status"] = {
  refresh(listview) {
    const pageBody = listview.page.body?.[0];
    if (!pageBody) return;

    [
      ".list-row-container",
      ".list-paging-area",
      ".listview-control",
      ".listview-header",
      ".result",
      ".page-form",
    ].forEach((selector) => pageBody.querySelectorAll(selector).forEach((el) => el.remove()));

    listview.$result?.hide();

    let wrapper = pageBody.querySelector("#test-machine-status-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "test-machine-status-wrapper";
      pageBody.prepend(wrapper);
    }

    const renderVue = () => {
      if (listview.vue_app) listview.vue_app.destroy();

      listview.vue_app = new superproject.ui.MachinesStatusViewComponent({
        wrapper,
        listview,
      });
    };

    renderVue();

    if (!listview._patched) {
      const original = listview.refresh;

      listview.refresh = function (...args) {
        const r = original.apply(this, args);

        frappe.after_ajax(() => {
          renderVue();
        });

        return r;
      };

      listview._patched = true;
    }
  },
};
