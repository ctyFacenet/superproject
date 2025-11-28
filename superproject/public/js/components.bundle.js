import { mountVue, unmountVue } from "./vue_helper.js";
import BaseLayout from "./components/BaseLayout.vue";
import DisplayLayout from "../../general/doctype/display/DisplayLayout.vue"
import ModuleList from "../../general/page/module_list/ModuleList.vue"
import DisplayConfiguration from "../../scada_&_tpm/doctype/display_configuration/DisplayConfiguration.vue";

frappe.provide("superproject.ui");
superproject.ui.mountVue = mountVue;
superproject.ui.unmountVue = unmountVue;

function createVueWrapper(name, component) {
  class VueWrapper {
    constructor({ wrapper, ...props }) {
      this.wrapper = wrapper;
      const mounted = mountVue(component, props, this.wrapper);

      this.app = mounted.app;
      this.vm = mounted.vm || mounted;

      Object.assign(this, this.vm);
    }

    destroy() {
      unmountVue(this.app || this.vm);
    }
  }

  superproject.ui[name + "Component"] = VueWrapper;
}

createVueWrapper("BaseLayout", BaseLayout);
createVueWrapper("DisplayLayout", DisplayLayout);
createVueWrapper("ModuleList", ModuleList);
createVueWrapper("DisplayConfiguration", DisplayConfiguration);