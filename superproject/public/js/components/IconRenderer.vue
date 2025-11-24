<template>
  <img
    v-if="isUrl"
    :src="icon"
    :class="['tw-object-contain', customClass]"
    alt="icon"
  />

  <component
    v-else
    :is="icon"
    :class="customClass"
    :style="{ color: color }"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: {
    type: [String, Object, Function],
    required: true,
  },
  color: {
    type: String,
    default: null,
  },
  customClass: {
    type: String,
    default: "",
  },
});

const isUrl = computed(() => typeof props.icon === "string");
</script>
