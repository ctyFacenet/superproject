// Copyright (c) 2025, FaceNet and contributors
// For license information, please see license.txt

frappe.ui.form.on("Test Machines Status", {
  refresh(frm) {
    if (frm.vue_form && frm.vue_form.wrapper?.isConnected) {
      if (frm.vue_form.onFormRefresh) frm.vue_form.onFormRefresh(frm);
      return;
    }

    if (frm.vue_form) {
      frm.vue_form.destroy?.();
      frm.vue_form = null;
    }

    const wrapperId = "test-machines-status-form";
    let wrapper = frm.$wrapper.find(`#${wrapperId}`);
    if (!wrapper.length) {
      wrapper = $(`<div id="${wrapperId}" class="tw-mt-4"></div>`)
        .appendTo(frm.body);
    }

    frm.vue_form = new superproject.ui.MachineFormViewComponent({
      wrapper: wrapper[0],
      frm: frm,
    });

    frm.vue_form.wrapper = wrapper[0];
  },

  on_hide(frm) {
    if (frm.vue_form) {
      frm.vue_form.destroy?.();
      frm.vue_form = null;
    }
  }
});
