<template>
  <img
    v-if="isUrl"
    :src="icon"
    :style="{ width: size + 'px', height: size + 'px', ...colorStyle }"
    class="tw-object-contain"
    :class="customClass"
    alt="icon"
  />

  <component
    v-else
    :is="icon"
    :style="{ fontSize: size + 'px', ...colorStyle }"
    :class="customClass"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: [String, Object, Function],
  size: { type: Number, default: 16 }, 
  color: { type: String, default: null },
  customClass: { type: String, default: "" }
});

const isUrl = computed(() => typeof props.icon === "string");
const colorStyle = computed(() =>
  props.color ? { color: props.color, fill: props.color } : {}
);
</script>
