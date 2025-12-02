<template>
  <div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-4 tw-p-1 tw-min-h-screen tw-overflow-auto">
    <Transition name="slide-left">
      <div v-if="!state.hide_tree && !config.hideTree" class="tw-flex-shrink-0 tw-sticky lg:tw-left-0">
        <slot name="tree">
          <div v-if="showFilter"
            class="tree-filter lg:tw-w-[250px] tw-bg-white tw-rounded-sm tw-shadow tw-p-3 tw-h-full tw-overflow-y-auto">
            <TreeFilter :doctype="props.doctype" @change="onFilterChange" v-model:filters="activeFilters" />
          </div>
        </slot>
      </div>
    </Transition>

    <div class="tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
      <Transition name="slide-up">
        <div v-if="!state.hide_flex" class="tw-flex-shrink-0">
          <slot name="flex">
            <div class="tw-flex tw-flex-col tw-gap-2">
              <h2 class="tw-text-base md:tw-text-lg tw-text-center tw-font-semibold tw-text-gray-900 tw-uppercase">
                {{ currentTitle }}
              </h2>

              <div v-if="props.doctype === DocType.WORK_ORDER_APPROVED"
                class="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-end tw-gap-2 tw-w-full">

                <div
                  class="tw-flex tw-flex-wrap tw-items-center tw-justify-center sm:tw-justify-start tw-gap-x-3 tw-gap-y-2 tw-w-full sm:tw-w-auto">
                  <div v-for="s in statusColor" :key="s.text" class="tw-flex tw-items-center tw-gap-1">
                    <span class="tw-inline-block tw-w-3 tw-h-3 tw-rounded-lg"
                      :style="{ backgroundColor: s.color }"></span>
                    <span class="tw-text-[12px] sm:tw-text-[13px] tw-text-gray-700">{{ s.text }}</span>
                  </div>
                </div>

                <div
                  class="tw-flex tw-items-center tw-justify-center sm:tw-justify-end tw-gap-1 tw-text-[13px] sm:tw-text-xs tw-text-gray-500">
                  <span class="tw-font-semibold">Cập nhật: {{ currentTime }}</span>
                  <a-tooltip title="Làm mới">
                    <ReloadOutlined class="tw-text-[#2490ef] tw-cursor-pointer hover:tw-text-[#1677c8]"
                      @click="refreshData" />
                  </a-tooltip>
                </div>

              </div>

              <div v-if="showScadaCharts"
                class="lg:tw-col-span-4 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-border-gray-200 tw-rounded-md">
                <div class="tw-p-2 tw-border tw-rounded tw-bg-white tw-shadow">
                  <BaseChart type="bar" :data="scadaBarData" :options="scadaBarOptions" />
                </div>

                <div
                  class="tw-p-2 tw-border tw-rounded tw-bg-white tw-shadow tw-flex tw-flex-col lg:tw-flex-row tw-justify-around tw-items-center tw-gap-4">
                  <BaseChart type="doughnut" :data="scadaDonutData" :options="scadaDonutOptions" />
                </div>
              </div>

              <div v-else-if="showCharts"
                class="lg:tw-col-span-4 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-border-gray-200 tw-rounded-md">
                <div class="tw-p-2 tw-border tw-rounded tw-bg-white tw-shadow">
                  <BaseChart type="bar" :data="barChartData" :options="barChartOptions" />
                </div>
                <div
                  class="tw-p-2 tw-border tw-rounded tw-bg-white tw-shadow tw-flex tw-flex-col lg:tw-flex-row tw-justify-around tw-items-center tw-gap-4">
                  <BaseChart type="doughnut" :data="donutChartData1" :options="donutChartOptions('07/2025')" />
                  <BaseChart type="doughnut" :data="donutChartData2" :options="donutChartOptions('08/2025')" />
                </div>
              </div>

              <div
                class="tw-flex tw-items-center tw-justify-end tw-gap-3 tw-overflow-x-auto tw-max-w-full tw-pb-1 hide-scrollbar">
                <div class="tw-flex tw-items-center tw-gap-2 tw-flex-nowrap">
                  <template v-for="btn in currentActions" :key="btn.label">
                    <a-button type="link"
                      class="tw-flex tw-items-center tw-text-[#0ba5ec] hover:tw-text-[#0987c1] tw-font-medium tw-px-1 tw-whitespace-nowrap"
                      @click="btn.onClick">
                      <IconRenderer :icon="btn.icon" customClass="tw-mr-1" :size="18" :color="btn.color" />
                      {{ btn.label }}
                    </a-button>
                  </template>
                </div>

                <a-input v-if="!config.hideSearchFullText" placeholder="Nhập thông tin để tìm kiếm"
                  class="sm:tw-w-[220px] md:tw-w-[260px] lg:tw-w-[300px] tw-h-[30px] tw-text-[13px] tw-rounded-sm focus:tw-shadow-none tw-flex-shrink-0"
                  size="small" allowClear>
                  <template #prefix>
                    <SearchOutlined class="tw-text-gray-400" />
                  </template>
                </a-input>
              </div>

            </div>
          </slot>
        </div>
      </Transition>

      <div v-if="!state.hide_records"
        class="tw-rounded-sm tw-flex-1 tw-min-h-[50vh] tw-bg-white tw-overflow-x-auto tw-overflow-y-auto">
        <slot name="records">
          <BaseTable :key="props.doctype" :doctype="props.doctype" :hide-select="config.hideSelect"
            :filters="activeFilters" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import TreeFilter from "./TreeFilter.vue";
import BaseTable from "./BaseTable.vue";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { getDoctypeConfig } from "./config/doctype-configs";
import BaseChart from "../components/BaseChart.vue";
import IconRenderer from "../components/IconRenderer.vue";
import {
  barChartData,
  barChartOptions,
  donutChartData1,
  donutChartData2,
  donutChartOptions,
  scadaDonutData,
  scadaDonutOptions,
  scadaBarData,
  scadaBarOptions
} from "../utils/chart-data.js"
import { DocType } from "../utils/consts.js";
import dayjs from "dayjs";
import { statusColor } from "../utils/status-colors.js";


const currentTime = ref("");

const refreshData = () => {
  if (frappe?.listview?.refresh) frappe.listview.refresh();
  currentTime.value = dayjs().format("HH:mm:ss DD/MM/YYYY");
};

onMounted(() => refreshData());

const props = defineProps({
  hide_tree: Boolean,
  hide_flex: Boolean,
  hide_records: Boolean,
  doctype: String,
  showDateFilter: Boolean,
  title: String,
});
const activeFilters = ref({});
const config = computed(() => getDoctypeConfig(props.doctype));

const showFilter = ref(true);
function onFilterChange(keys) {
  activeFilters.value = { treeKeys: keys };
}

const state = reactive({
  hide_tree: props.hide_tree,
  hide_flex: props.hide_flex,
  hide_records: props.hide_records ?? false,
});

const showCharts = computed(() => props.doctype === DocType.STATISTICAL_REPORT);
const showScadaCharts = computed(() => props.doctype === DocType.SCADA_STATISTICAL_REPORT);


const currentActions = computed(() => config.value?.actions || []);
const currentTitle = computed(() => config.value?.title || "");

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
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
