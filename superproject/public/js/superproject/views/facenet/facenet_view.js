frappe.provide("frappe.views");

frappe.views.FacenetView = class FacenetView extends frappe.views.ListView {
  get view_name() {
    return "FaceNet";
  }

  static no_sidebar = true;

  render() { }

  setup_defaults() {
    super.setup_defaults();
    this.page_title = __("FaceNet:") + " " + this.page_title;
    this.view = "FaceNet";
    return this.get_list_view_settings();
  }

  setup_page() {
    this.hide_filters = true;
    this.hide_sort_selector = true;

    super.setup_page();

    frappe.after_ajax(() => {
      const $label = $(".custom-btn-group-label");
      $label.text("FaceNet View");
      const $icon = $label.closest(".btn-group").find("svg use");
      $icon.attr("href", "#icon-list");
    });
  }

  setup_view() {
    this.setup_facenet_page();
    this.setup_settings();
  }

  async setup_facenet_page() {
    this.$frappe_list.html(`<div class="facenet-view"></div>`);
    this.wrapper = this.$frappe_list.find(".facenet-view");

    this.page.clear_secondary_action();
    this.page.main.removeClass("frappe-card");

    const display_settings = await frappe.xcall(
      "superproject.general.doctype.display_doctype_setting.display_doctype_setting.open_settings",
      { doctype: this.doctype }
    );

    this.hide_tree = Boolean(display_settings.hide_tree);
    this.hide_flex = Boolean(display_settings.hide_flex);

    let action_config = null;
    try {
      action_config = await frappe.xcall(
        "superproject.api.listview_actions.get_listview_action_config",
        { doctype: this.doctype }
      );
    } catch (e) {
      console.warn("No List View Action Config");
    }

    this.render_vue(action_config);
  }

  render_vue(action_config) {
    this.component = new superproject.ui.BaseLayoutComponent({
      wrapper: this.wrapper[0],
      hide_tree: this.hide_tree,
      hide_flex: this.hide_flex,
      doctype: this.doctype,
      action_config,
    });
  }

  setup_settings() {
    this.page.add_inner_button("Hide Sections", async () => {
      const settings = await frappe.xcall(
        "superproject.general.doctype.display_doctype_setting.display_doctype_setting.open_settings",
        { doctype: this.doctype }
      );

      const d = new frappe.ui.Dialog({
        title: "Hide Section Settings",
        size: "small",
        fields: [
          {
            fieldname: "hide_tree",
            label: __("Hide Tree Section?"),
            fieldtype: "Check",
            default: settings.hide_tree,
          },
          { fieldtype: "Column Break" },
          {
            fieldname: "hide_flex",
            label: __("Hide Flex Section?"),
            fieldtype: "Check",
            default: settings.hide_flex,
          },
        ],
        primary_action_label: "Lưu",
        primary_action: async (values) => {
          await frappe.xcall(
            "superproject.general.doctype.display_doctype_setting.display_doctype_setting.open_settings",
            { doctype: this.doctype, settings: JSON.stringify(values) }
          );

          d.hide();

          if (values.hide_tree !== this.hide_tree) {
            this.component.updateSetting("hide_tree", values.hide_tree);
          }
          if (values.hide_flex !== this.hide_flex) {
            this.component.updateSetting("hide_flex", values.hide_flex);
          }

          this.hide_tree = values.hide_tree;
          this.hide_flex = values.hide_flex;
        },
      });

      d.show();
    });
  }
};
