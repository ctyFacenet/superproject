frappe.listview_settings["Realtime Production Progress"] = {
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
    ].forEach((selector) => {
      pageBody.querySelectorAll(selector).forEach((el) => el.remove());
    });

    if (listview.$result) listview.$result.hide();

    let wrapper = pageBody.querySelector("#realtime-production-progress");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "realtime-production-progress";
      pageBody.prepend(wrapper);
    }

    const renderVue = () => {
      if (listview.vue_app) {
        listview.vue_app.destroy?.();
        listview.vue_app = null;
      }

      listview.vue_app = new superproject.ui.RealtimeProductionProgressComponent({
        wrapper,
        listview,
      });
    };

    renderVue();

    if (!listview._patched) {
      const originalRefresh = listview.refresh;

      listview.refresh = function (...args) {
        const r = originalRefresh.apply(this, args);

        frappe.after_ajax(() => renderVue());

        return r;
      };

      listview._patched = true;
    }
  },
};
