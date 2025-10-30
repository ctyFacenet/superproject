import { mountVue, unmountVue } from "./vue_helper.js";
import "./components.bundle.js"

frappe.provide("superproject.vue");
superproject.vue.mountVue = mountVue;
superproject.vue.unmountVue = unmountVue;