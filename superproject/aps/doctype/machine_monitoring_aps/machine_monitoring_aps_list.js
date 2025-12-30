frappe.listview_settings["Machine Monitoring APS"] = {
  refresh(listview) {
    const pageBodyEl = listview.page.body?.[0];
    if (!pageBodyEl) return;

    const selectorsToRemove = [
      ".list-row-container",
      ".list-paging-area",
      ".listview-control",
      ".listview-header",
      ".result",
      ".page-form"
    ];

    selectorsToRemove.forEach(sel => {
      pageBodyEl.querySelectorAll(sel).forEach(el => el.remove());
    });

    listview.$result && listview.$result.hide();

    let wrapper = pageBodyEl.querySelector("#Machine Monitoring APS wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "Machine-Monitoring-APS-wrapper";
      pageBodyEl.prepend(wrapper);
    }

    const renderVue = () => {
      if (listview.vue_list) {
        listview.vue_list.destroy();
        listview.vue_list = null;
      }

      listview.vue_list = new superproject.ui.MachineMonitoringViewComponent({
        wrapper,
        listview
      });
    };

    renderVue();

    if (!listview._custom_refresh_patched) {
      const originalRefresh = listview.refresh;

      listview.refresh = function (...args) {
        const result = originalRefresh.apply(this, args);

        frappe.after_ajax(() => {
          if (wrapper && document.body.contains(wrapper)) {
            renderVue();
          }
        });

        return result;
      };

      listview._custom_refresh_patched = true;
    }
  }
};
