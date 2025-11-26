<template>
  <img
    v-if="isImageUrl"
    :src="icon"
    :style="{ width: size + 'px', height: size + 'px', ...colorStyle }"
    class="tw-object-contain"
    :class="customClass"
    alt="icon"
    @error="handleImgError"
  />

  <component
    v-else-if="isComponent"
    :is="icon"
    :style="{ fontSize: size + 'px', ...colorStyle }"
    :class="customClass"
  />
  
  <span v-else>
  <CloseCircleOutlined style="color: #ccc; font-size: 16px" />
</span>

</template>

<script setup>
import { computed} from "vue";
import {
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
const props = defineProps({
  icon: [String, Object, Function],
  size: { type: Number, default: 16 },
  color: { type: String, default: null },
  customClass: { type: String, default: "" }
});

const isImageUrl = computed(() => {
  if (typeof props.icon !== "string") return false;
  return /\.(svg|png|jpg|jpeg|gif)$/i.test(props.icon);
});

const isComponent = computed(() => {
  return typeof props.icon === "object" || typeof props.icon === "function";
});

const colorStyle = computed(() =>
  props.color ? { color: props.color, fill: props.color } : {}
);

const handleImgError = (e) => {
  e.target.style.display = "none";
};
</script>
