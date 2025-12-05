<template>
  <div class="tw-flex tw-items-center tw-gap-3 tw-p-4 tw-bg-white tw-rounded-lg tw-shadow ">
    <input
      v-model="text"
      type="text"
      placeholder="Nhập nội dung..."
      class="tw-border tw-border-gray-300 tw-rounded-sm tw-px-3 tw-py-2 tw-w-60 focus:tw-border-blue-500 focus:tw-outline-none"
      allowClear
    />

    <button
      @click="notify"
      class="tw-bg-blue-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-sm hover:tw-bg-blue-700 tw-transition"
    >
      Gửi thông báo
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const text = ref("");

function notify() {
  if (!text.value.trim()) {
    frappe.msgprint("Vui lòng nhập nội dung trước!");
    return;
  }

  frappe.show_alert({
    message: "Bạn đã nhập: " + text.value,
    indicator: "green"
  });

  text.value = "";
}
</script>
