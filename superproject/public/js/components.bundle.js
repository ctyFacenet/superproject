import { mountVue, unmountVue } from "./vue_helper.js";
import Counter from "./components/Counter.vue";
import CounterNew from "./components/CounterNew.vue";

frappe.provide("superproject.ui");
superproject.ui.mountVue = mountVue;
superproject.ui.unmountVue = unmountVue;

function createVueWrapper(name, component) {
  class VueWrapper {
    constructor({ wrapper, ...props }) {
      this.wrapper = wrapper;
      this.mounted = mountVue(component, props, this.wrapper);
    }
    destroy() {
      unmountVue(this.mounted);
    }
  }
  superproject.ui[name + "Component"] = VueWrapper;
}

createVueWrapper("Counter", Counter);
createVueWrapper("CounterNew", CounterNew);