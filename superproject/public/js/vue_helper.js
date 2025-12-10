import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

export function mountVue(Component, props, wrapper) {
  const el = wrapper?.get ? wrapper.get(0) : wrapper;

  if (el.__vue_app__) {
    try {
      el.__vue_app__.app.unmount();
    } catch (e) {
      console.warn("Unmount failed:", e);
    }
    el.innerHTML = "";
  }

  const app = createApp(Component, props);
  app.use(Antd);
  SetVueGlobals(app);

  const vm = app.mount(el);
  el.__vue_app__ = { app, vm, el };

  return { app, vm, el };
}

export function unmountVue(mountedApp) {
  if (!mountedApp) return;

  try {
    mountedApp.app.unmount();
    mountedApp.el.innerHTML = "";
    delete mountedApp.el.__vue_app__;
  } catch (e) {
    console.warn("Unmount error:", e);
  }
}
