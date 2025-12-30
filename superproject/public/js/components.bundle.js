import { mountVue, unmountVue } from "./vue_helper.js";

import BaseLayout from "./components/BaseLayout.vue";
import DisplayLayout from "../../general/doctype/display/DisplayLayout.vue";
import ModuleList from "../../general/page/module_list/ModuleList.vue";
import DisplayConfiguration from "../../scada_&_tpm/doctype/display_configuration/DisplayConfiguration.vue";
import DisplayAccountManagement from "../../mdm/doctype/account_management/DisplayAccountManagement.vue";
import MachinesStatusView from "../../public/js/components/TestMachinesCard/MachinesStatusView.vue";
import MachineFormView from "../../public/js/components/TestMachinesCard/MachineFormView.vue";
import RealtimeProductionProgress from "../../public/js/components/aps/RealtimeProductionProgress.vue";
import MachineMonitoringView from "../../public/js/components/aps/MachineMonitoringView.vue";
frappe.provide("superproject.ui");
superproject.ui.mountVue = mountVue;
superproject.ui.unmountVue = unmountVue;

function createVueWrapper(name, component) {
  class VueWrapper {
    constructor({ wrapper, ...props }) {
      this.wrapper = wrapper;

      this.mounted = mountVue(component, props, this.wrapper);

      this.app = this.mounted.app;
      this.vm = this.mounted.vm;
      this.el = this.mounted.el;
      this.destroyed = false;

      this._exposeMethods();
    }

    _exposeMethods() {
      if (!this.vm) return;

      const exposed = this.vm.$?.exposed;
      if (!exposed) return;

      for (const [key, value] of Object.entries(exposed)) {
        if (typeof value === "function") {
          this[key] = (...args) => {
            if (this.destroyed) {
              console.warn(`[${name}Component] Method "${key}" called after destroy().`);
              return;
            }
            return value(...args);
          };
        }
      }
    }

    destroy() {
      if (this.destroyed) return;

      this.destroyed = true;
      unmountVue(this.mounted);

      this.app = null;
      this.vm = null;
      this.el = null;
      this.mounted = null;
    }
  }

  superproject.ui[name + "Component"] = VueWrapper;
}

createVueWrapper("BaseLayout", BaseLayout);
createVueWrapper("DisplayLayout", DisplayLayout);
createVueWrapper("ModuleList", ModuleList);
createVueWrapper("DisplayConfiguration", DisplayConfiguration);
createVueWrapper("DisplayAccountManagement", DisplayAccountManagement);
createVueWrapper("MachinesStatusView", MachinesStatusView);
createVueWrapper("MachineFormView", MachineFormView);
createVueWrapper("RealtimeProductionProgress", RealtimeProductionProgress);
createVueWrapper("MachineMonitoringView", MachineMonitoringView);