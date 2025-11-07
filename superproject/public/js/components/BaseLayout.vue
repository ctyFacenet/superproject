<template>
  <div
    class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-4 tw-p-4 tw-bg-gray-50 tw-min-h-screen tw-overflow-auto">

    <Transition name="slide-left">
      <div v-if="!state.hide_tree" class="tw-flex-shrink-0 tw-sticky lg:tw-left-0">
        <slot name="tree">
          <div
            v-if="showFilter"
            class="tree-filter lg:tw-w-[250px] tw-bg-white tw-rounded-xl tw-shadow tw-p-3 tw-h-full tw-overflow-y-auto">
            <TreeFilter :showDateFilter="true" @change="onFilterChange" />
          </div>
        </slot>
      </div>
    </Transition>

    <div class="tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">

      <Transition name="slide-up">
        <div v-if="!state.hide_flex" class="tw-py-3 tw-flex-shrink-0">
          <slot name="flex">
            <div class="tw-flex tw-flex-col tw-gap-2">
              <h2 class="tw-text-base md:tw-text-lg tw-text-center tw-font-semibold tw-text-gray-900 tw-uppercase">
                {{ currentTitle }}
              </h2>

              <div
                class="tw-flex tw-items-center tw-justify-end tw-gap-3 tw-overflow-x-auto tw-max-w-full tw-pb-1 hide-scrollbar">
                <div class="tw-flex tw-items-center tw-gap-2 tw-flex-nowrap">
                  <template v-for="btn in currentActions" :key="btn.label">
                    <a-button
                      type="link"
                      class="tw-flex tw-items-center tw-gap-1 tw-text-[#0ba5ec] hover:tw-text-[#0987c1] tw-font-medium tw-px-1 tw-whitespace-nowrap"
                      @click="btn.onClick">
                      <component :is="btn.icon" v-if="btn.icon" />
                      {{ btn.label }}
                    </a-button>
                  </template>
                </div>

                <a-input
                  placeholder="Nhập thông tin để tìm kiếm"
                  class="tw-w-[250px] sm:tw-w-[220px] md:tw-w-[260px] lg:tw-w-[300px] tw-h-[30px] tw-text-[13px] tw-rounded-sm tw-border-[#0ba5ec] focus:tw-shadow-none tw-flex-shrink-0"
                  size="small"
                  allowClear>
                  <template #prefix>
                    <SearchOutlined class="tw-text-gray-400" />
                  </template>
                </a-input>
              </div>
            </div>
          </slot>
        </div>
      </Transition>

      <div
        v-if="!state.hide_records"
        class="tw-rounded-lg tw-flex-1 tw-min-h-[50vh] tw-bg-white tw-overflow-x-auto tw-overflow-y-auto tw-mt-2">
        <slot name="records">
          <BaseTable :doctype="props.doctype" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import TreeFilter from "./TreeFilter.vue";
import BaseTable from "./BaseTable.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getDoctypeConfig } from "./config/doctype-configs";

const props = defineProps({
  hide_tree: Boolean,
  hide_flex: Boolean,
  hide_records: Boolean,
  doctype: String,
  showDateFilter: Boolean,
  title: String,
});

const showFilter = ref(true);
const onFilterChange = () => {
  if (window.innerWidth < 1024) showFilter.value = false;
};

const state = reactive({
  hide_tree: props.hide_tree,
  hide_flex: props.hide_flex,
  hide_records: props.hide_records ?? false,
});

const currentActions = computed(() => getDoctypeConfig(props.doctype)?.actions || []);
const currentTitle = computed(() => getDoctypeConfig(props.doctype)?.title || "");

function updateSetting(key, value) {
  if (key in state) state[key] = value;
}

defineExpose({ updateSetting });
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .tree-filter {
    max-height: 40vh;
    overflow-y: auto;
  }
}

.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
