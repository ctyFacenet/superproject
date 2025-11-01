<template>
  <div 
    class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-4 tw-w-full"
    style="height: calc(100vh - 200px);"
  >
    <!-- Column 1: Tree Section -->
    <Transition name="slide-left">
      <div
        v-if="!state.hide_tree"
        class="tw-rounded-lg tw-p-3 tw-w-full lg:tw-w-[220px] tw-flex-shrink-0 tw-overflow-auto"
        style="background-color: rgb(232, 243, 255);"
      >
        <slot name="tree">
          <div class="tw-text-center">Tree Map Section</div>
        </slot>
      </div>
    </Transition>

    <!-- Column 2: Flex + Records -->
    <div
      class="tw-flex tw-flex-col tw-gap-4 tw-flex-1 tw-min-h-0"
      :class="{ 'tw-w-full': state.hide_tree }"
    >
      <!-- Flex Section -->
      <Transition name="slide-up">
        <div
          v-if="!state.hide_flex"
          class="tw-rounded-lg tw-p-3 tw-min-h-[100px] tw-flex-shrink-0 tw-overflow-auto"
          style="background-color: rgb(232, 243, 255);"
        >
          <slot name="flex">
            <div class="tw-text-center">Flex Section</div>
          </slot>
        </div>
      </Transition>

      <!-- Record List Section -->
      <div
        v-if="!state.hide_records"
        class="tw-rounded-lg tw-p-3 tw-flex-1 tw-min-h-0 tw-overflow-auto"
        style="background-color: rgb(232, 243, 255);"
      >
        <slot name="records">
          <BaseTable :doctype="doctype" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseTable from "./BaseTable.vue"

const props = defineProps({
  hide_tree: Boolean,
  hide_flex: Boolean,
  hide_records: Boolean,
  doctype: String
})

const state = reactive({
  hide_tree: props.hide_tree,
  hide_flex: props.hide_flex,
  hide_records: props.hide_records ?? false,
})

function updateSetting(key, value) {
  if (key in state) {
    state[key] = value
  }
}

defineExpose({
  updateSetting
})
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}
.slide-left-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}
.slide-up-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
