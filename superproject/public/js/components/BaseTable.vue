<template>
  <div
    class="tw-relative tw-border tw-border-gray-100 tw-bg-white tw-shadow-sm tw-text-sm tw-flex tw-flex-col tw-h-full tw-z-[5]">
    <a-spin :spinning="loading" size="large" class="tw-w-full tw-h-full">
      <a-popover :key="storageKey" v-model:open="showColumnPicker" trigger="click" placement="top">
        <template #content>
          <div class="tw-p-2 tw-w-[220px] tw-max-h-[300px] tw-overflow-y-auto">
            <a-checkbox-group v-model:value="checkedColumns" class="tw-flex tw-flex-col tw-gap-2">
              <a-checkbox v-for="col in columns" :key="col.key" :value="col.key"
                @change="toggleColumn(col.key, $event)">
                {{ col.title }}
              </a-checkbox>
            </a-checkbox-group>

            <div class="tw-mt-2 tw-text-right">
              <a-button type="link" size="small" @click="resetColumns">
                Reset all
              </a-button>
            </div>
          </div>
        </template>
      </a-popover>

      <div ref="scrollWrapper" class="tw-flex-1 tw-overflow-x-auto tw-overflow-y-auto tw-max-h-[70vh] tw-relative"
        @scroll="handleScroll">
        <table class="tw-min-w-max tw-border-collapse tw-w-full">
          <thead class="tw-sticky tw-top-0 tw-z-20">
            <tr class="tw-bg-blue-200 tw-border-b tw-border-gray-300 tw-text-gray-700 tw-text-[13px]">
              <th class="left-sticky tw-z-40 tw-bg-blue-200 tw-w-[50px] tw-text-center tw-border">
                STT
              </th>

              <th v-if="!props.hideSelect"
                class="left-sticky-2 tw-z-40 tw-bg-blue-200 tw-w-[45px] tw-text-center tw-border">
                <input type="checkbox" ref="selectAllRef" v-model="selectAll" @change="toggleSelectAll" />
              </th>

              <th v-for="col in filteredColumns" :key="col.key" class="tw-relative tw-border tw-border-gray-200 tw-font-semibold tw-text-center
                       tw-px-3 tw-py-2 tw-group" :class="[
                        col.key === 'actions' ? 'actions-sticky th-sticky' : '',
                        {
                          'tw-bg-pink-100 tw-text-pink-800':
                            /(can|kdai|ktrung|ktieu|mahz|malh|mavt)/i.test(col.key),
                        },
                      ]" :style="{
                        width: colWidths[col.key] + 'px',
                        minWidth: col.key === 'actions' ? '130px' : '150px',
                      }">
                <div class="tw-flex tw-items-center tw-justify-center tw-gap-1">
                  <a-tooltip :title="col.title">
                    <span class="tw-truncate tw-font-semibold tw-text-[14px]">
                      {{ col.title }}
                    </span>
                  </a-tooltip>
                  <IconRenderer v-if="col.key !== 'actions'" :icon="FilterOutlined" :size="14"
                    customClass="tw-cursor-pointer" />
                </div>

                <div class="resizer tw-absolute tw-top-0 tw-right-0 tw-w-[6px] tw-h-full
                         tw-cursor-col-resize tw-bg-transparent
                         hover:tw-bg-blue-300 tw-opacity-0 group-hover:tw-opacity-100"
                  @mousedown="startResize($event, col.key)" />
              </th>
            </tr>

            <tr class="tw-bg-white tw-border-b tw-border-gray-200">
              <th class="left-sticky tw-top-[33px] tw-z-30 tw-border"></th>
              <th v-if="!props.hideSelect" class="left-sticky-2 tw-top-[33px] tw-z-30 tw-border"></th>

              <th v-for="col in filteredColumns" :key="col.key" class="tw-border"
                :class="col.key === 'actions' ? 'actions-sticky th-sticky' : ''"
                :style="{ width: colWidths[col.key] + 'px' }">
                <template v-if="col.fieldtype === 'Date'">
                  <a-range-picker v-model:value="dateFilters[col.key]" :placeholder="['Từ ngày', 'Đến ngày']"
                    class="tw-w-full tw-rounded-sm tw-p-1 tw-shadow tw-bg-white" />
                </template>

                <template v-else-if="col.key?.toLowerCase().endsWith('status')">
                  <a-select v-model:value="statusFilters[col.key]" show-search allowClear placeholder="Chọn trạng thái"
                    class="tw-w-full tw-shadow tw-bg-white tw-rounded-sm" :options="getStatusOptions(col.key)"
                    :filter-option="filterOption" />
                </template>

                <template v-else-if="col.key !== 'actions'">
                  <a-input v-model:value="filters[col.key]" size="small"
                    class="tw-rounded-sm tw-p-1 tw-shadow tw-bg-white" allowClear>
                    <template #prefix>
                      <IconRenderer :icon="SearchOutlined" customClass="tw-opacity-30" />
                    </template>
                  </a-input>
                </template>
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(item, idx) in groupedFlatRows" :key="idx">

              <tr v-if="item.type === 'group'" class="tw-font-semibold tw-text-red-600 tw-text-[13px]">
                <td class="left-sticky tw-border"></td>
                <td v-if="!props.hideSelect" class="left-sticky-2 tw-border"></td>

                <td v-for="col in filteredColumns" :key="col.key" class="tw-border tw-py-1">
                  <template v-if="col.key === item.field">
                    <div class="tw-flex tw-items-center tw-gap-2 tw-ml-1">
                      <button v-if="config.enableCollapse" class="tw-w-[18px] tw-h-[18px] tw-flex tw-items-center tw-justify-center
                               tw-border tw-border-gray-200 tw-rounded-sm tw-bg-white"
                        @click.stop="toggleCollapse(item.pathKey)">
                        <component :is="collapsedGroups.has(item.pathKey) ? PlusOutlined : MinusOutlined"
                          class="tw-text-[12px]" />
                      </button>

                      <span class="tw-font-bold tw-cursor-pointer"
                        @click="config.enableCollapse && toggleCollapse(item.pathKey)">
                        {{ item.label }}
                      </span>
                    </div>
                  </template>
                </td>
              </tr>

              <tr v-else v-show="!isCollapsed(item.groupPath)" :class="[
                'tw-text-[13px] tw-cursor-pointer',
                selectedRows.has(item.row) ? 'tw-bg-blue-50' : 'hover:tw-bg-gray-50',
              ]" @click="handleRowClick($event, item.row)">
                <td class="left-sticky tw-text-center tw-border">
                  {{ item.index + 1 }}
                </td>

                <td v-if="!props.hideSelect" class="left-sticky-2 tw-text-center tw-border checkbox-cell">
                  <input type="checkbox" :checked="selectedRows.has(item.row)"
                    @change="toggleRow(null, item.row, $event)" />
                </td>

                <td v-for="col in filteredColumns" :key="col.key" class="tw-border tw-text-center"
                  :class="col.key === 'actions' ? 'actions-sticky td-sticky' : ''">
                  <template v-if="col.key?.toLowerCase().endsWith('status')">
                    <span :style="statusColors[item.row[col.key]]" class="status-badge">
                      {{ item.row[col.key] }}
                    </span>
                  </template>

                  <template v-else-if="col.key === 'actions'">
                    <div class="actions-cell tw-flex tw-justify-center tw-gap-3">
                      <template v-for="(action, i) in getDoctypeConfig(props.doctype).rowActions" :key="i">
                        <a-tooltip :title="action.label">
                          <IconRenderer :icon="action.icon" :color="action.color" customClass="tw-cursor-pointer"
                            @click.stop="action.onClick(item.row)" />
                        </a-tooltip>
                      </template>
                    </div>
                  </template>

                  <template v-else>
                    {{ item.row[col.key] || "" }}
                  </template>
                </td>
              </tr>
            </template>

            <tr v-if="!groupedFlatRows.length">
              <td :colspan="filteredColumns.length + (props.hideSelect ? 1 : 2)"
                class="tw-text-center tw-py-6 tw-text-gray-500 tw-italic tw-border">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-center
               tw-py-2 tw-px-3 tw-border-gray-200 tw-bg-gray-50 tw-text-[14px] tw-font-medium">
        <a-select v-model:value="pageSize" :options="pageSizeOptions" class="tw-hidden sm:tw-block tw-w-[110px]"
          @change="onPageSizeChange" />

        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center
                 tw-gap-2 sm:tw-gap-3 tw-w-full sm:tw-w-auto">
          <span class="tw-hidden sm:tw-inline tw-text-gray-600 tw-font-medium">
            Trang số {{ currentPage }} của {{ totalPages }}
            ({{ filteredRows?.length || 0 }} bản ghi)
          </span>

          <a-pagination v-model:current="currentPage" :total="filteredRows?.length || 0" :pageSize="pageSize"
            @change="onPageChange" :showSizeChanger="false" size="small" class="tw-my-1 sm:tw-my-0" />
        </div>

        <div class="tw-hidden sm:tw-flex tw-items-center tw-gap-2">
          <span>Đi đến</span>
          <a-input-number v-model:value="goToPage" :min="1" :max="totalPages" @pressEnter="jumpToPage"
            style="width: 110px; height: 30px" size="small" />
        </div>
      </div>

      <div class="tw-text-center tw-border-t tw-border-gray-200 tw-bg-white
               tw-text-[13px] sm:tw-text-[14px] tw-font-[500]
               tw-tracking-wide tw-text-gray-600">
        © Copyright
        <a href="https://facenet.vn" target="_blank" rel="noopener noreferrer"
          class="tw-text-[#0066cc] tw-font-semibold tw-cursor-pointer hover:tw-underline">
          FaceNet
        </a>.
        All Rights Reserved,&nbsp;Designed by
        <a href="https://facenet.vn" target="_blank" rel="noopener noreferrer"
          class="tw-text-[#0066cc] tw-font-semibold tw-cursor-pointer hover:tw-underline">
          FaceNet
        </a>
      </div>

    </a-spin>
  </div>
</template>



<script setup>
import { ref, computed, watch, shallowRef, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import { getDoctypeConfig } from "./config/doctype-configs";
import { colorMap } from "../utils/status-colors";
import IconRenderer from "../components/IconRenderer.vue";
import {
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";

const props = defineProps({
  doctype: { type: String, required: true },
  nameKey: { type: String, default: "name" },
  hideSelect: { type: Boolean, default: false },
  filters: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["rowClick", "selection-change"]);

const loading = ref(false);
const columns = ref([]);
const rows = ref([]);
const allRows = shallowRef([]);

const visibleColumns = ref({});
const showColumnPicker = ref(false);
const storageKey = computed(() => `visibleColumns_${props.doctype}`);

const metaFields = ref({});
const statusFilters = ref({});
const statusColors = ref({});
const filters = ref({});
const dateFilters = ref({});

const colWidths = ref({});

const config = computed(() => getDoctypeConfig(props.doctype));
const groupByField = computed(() => config.value.groupByField);

onMounted(() => {
  const saved = localStorage.getItem(storageKey.value);
  if (saved) visibleColumns.value = JSON.parse(saved);

  const handler = (e) => {
    const dt = e.detail?.doctype;
    if (!dt || dt === props.doctype) {
      showColumnPicker.value = !showColumnPicker.value;
    }
  };

  window[`_columnPickerHandler_${props.doctype}`] = handler;
  window.addEventListener("open-column-picker", handler);
});

onUnmounted(() => {
  const handler = window[`_columnPickerHandler_${props.doctype}`];
  if (handler) {
    window.removeEventListener("open-column-picker", handler);
    delete window[`_columnPickerHandler_${props.doctype}`];
  }
});

watch(
  visibleColumns,
  (v) => localStorage.setItem(storageKey.value, JSON.stringify(v)),
  { deep: true }
);

const checkedColumns = computed(() =>
  Object.keys(visibleColumns.value).filter((k) => visibleColumns.value[k])
);

function toggleColumn(key, e) {
  visibleColumns.value[key] = e.target.checked;
}

function resetColumns() {
  Object.keys(visibleColumns.value).forEach((k) => (visibleColumns.value[k] = true));
}

async function fetchData() {
  loading.value = true;
  try {
    const meta = await frappe.get_meta(props.doctype);

    meta.fields.forEach((f) => (metaFields.value[f.fieldname] = f));

    const visibleFields = meta.fields
      .filter((f) => f.in_list_view)
      .map((f) => ({
        title: f.label || f.fieldname,
        key: f.fieldname,
        fieldtype: f.fieldtype,
      }));

    visibleFields.push({ title: "Thao tác", key: "actions" });
    columns.value = visibleFields;

    visibleFields.forEach((f) => {
      if (!colWidths.value[f.key]) colWidths.value[f.key] = 160;
      if (f.key.toLowerCase().endsWith("status")) statusFilters.value[f.key] = "";
    });

    const statusField = meta.fields.find((f) =>
      f.fieldname?.toLowerCase().endsWith("status")
    );

    if (statusField?.options) {
      const opts = statusField.options.split("\n").filter(Boolean);
      const palette = Object.values(colorMap);
      const map = {};

      opts.forEach((opt, i) => {
        if (/hoàn thành/i.test(opt)) map[opt] = colorMap.green;
        else if (/duyệt/i.test(opt)) map[opt] = colorMap.orange;
        else if (/nháp/i.test(opt)) map[opt] = colorMap.gray;
        else if (/hủy|huỷ/i.test(opt)) map[opt] = colorMap.red;
        else map[opt] = palette[i % palette.length];
      });

      statusColors.value = map;
    }

    const fieldNames = [
      "name",
      ...visibleFields.filter((f) => f.key !== "actions").map((f) => f.key),
    ];

    rows.value = await frappe.db.get_list(props.doctype, {
      fields: fieldNames,
      limit: 1000,
    });

    allRows.value = rows.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
watch(() => props.doctype, fetchData);

const filteredColumns = computed(() => {
  let cols = columns.value.filter((c) => visibleColumns.value[c.key] !== false);
  if (!config.value?.rowActions?.length)
    cols = cols.filter((c) => c.key !== "actions");
  return cols;
});

const filteredRows = computed(() => {
  let result = allRows.value.filter((r) =>
    columns.value.every((c) => {
      if (c.key === "actions") return true;

      if (c.key.toLowerCase().endsWith("status")) {
        const v = statusFilters.value[c.key];
        if (v) return r[c.key] === v;
      }

      if (c.fieldtype === "Date") {
        const range = dateFilters.value[c.key];
        if (!range || range.length !== 2) return true;
        const d = dayjs(r[c.key]);
        return d.isAfter(range[0]) && d.isBefore(range[1]);
      }

      const val = (r[c.key] || "").toString().toLowerCase();
      const f = (filters.value[c.key] || "").toLowerCase();
      return val.includes(f);
    })
  );

  return result;
});

const collapsedGroups = ref(new Set());

function toggleCollapse(pathKey) {
  if (collapsedGroups.value.has(pathKey)) collapsedGroups.value.delete(pathKey);
  else collapsedGroups.value.add(pathKey);
}

function isCollapsed(path) {
  return path.some((p) => collapsedGroups.value.has(p));
}

const groupedFlatRows = computed(() => {
  if (!groupByField.value) {
    return filteredRows.value.map((row, index) => ({
      type: "row",
      row,
      index,
      groupPath: [],
    }));
  }

  const fields = Array.isArray(groupByField.value)
    ? groupByField.value
    : [groupByField.value];

  const result = [];
  let index = 0;

  function walk(rows, level, path) {
    if (level >= fields.length) {
      rows.forEach((r) =>
        result.push({
          type: "row",
          row: r,
          index: index++,
          groupPath: [...path],
        })
      );
      return;
    }

    const field = fields[level];
    const map = new Map();

    rows.forEach((r) => {
      const key = r[field] || "Không xác định";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });

    for (const [key, items] of map.entries()) {
      const pathKey = [...path, key].join(" / ");
      result.push({
        type: "group",
        label: key,
        field: field,
        level,
        pathKey,
        count: items.length,
      });


      walk(items, level + 1, [...path, pathKey]);
    }
  }

  walk(filteredRows.value, 0, []);
  return result;
});

const selectedRows = ref(new Set());
const selectAll = ref(false);
const selectAllRef = ref(null);

watch(selectedRows, () =>
  emit("selection-change", Array.from(selectedRows.value))
);

function toggleRow(_, row, e) {
  if (e.target.checked) selectedRows.value.add(row);
  else selectedRows.value.delete(row);
}

function toggleSelectAll() {
  if (selectAll.value) filteredRows.value.forEach((r) => selectedRows.value.add(r));
  else selectedRows.value.clear();
}

const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { label: "10 / Trang", value: 10 },
  { label: "20 / Trang", value: 20 },
  { label: "50 / Trang", value: 50 },
  { label: "100 / Trang", value: 100 },
];

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
);

const goToPage = ref(null);
const onPageChange = (p) => (currentPage.value = p);
const onPageSizeChange = (s) => {
  pageSize.value = s;
  currentPage.value = 1;
};
const jumpToPage = () => {
  if (goToPage.value >= 1 && goToPage.value <= totalPages.value)
    currentPage.value = goToPage.value;
};

const resizing = ref({ active: false });

function startResize(e, key) {
  resizing.value = { active: true, key, x: e.pageX, w: colWidths.value[key] };
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
}

function handleResize(e) {
  if (!resizing.value.active) return;
  colWidths.value[resizing.value.key] = Math.max(
    80,
    resizing.value.w + (e.pageX - resizing.value.x)
  );
}

function stopResize() {
  resizing.value.active = false;
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
}

const scrollWrapper = ref(null);
function handleScroll() { }

function handleRowClick(event, row) {
  if (event.target.closest(".actions-cell") || event.target.closest(".checkbox-cell")) return;
  emit("rowClick", row);
  const name = row[props.nameKey] || row.name;
  if (name) frappe.set_route("Form", props.doctype, name);
}

function getStatusOptions(fieldname) {
  const field = metaFields.value[fieldname];
  if (!field?.options) return [];
  return field.options
    .split("\n")
    .filter(Boolean)
    .map((o) => ({ label: o, value: o }));
}

const filterOption = (input, option) =>
  option.label.toLowerCase().includes(input.toLowerCase());
</script>


<style scoped>
table {
  border-collapse: separate !important;
  border-spacing: 0 !important;
}

table td,
table th {
  border: none !important;
  position: relative;
}

table td::after,
table th::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 174, 238, 0.1);
}

table td::before,
table th::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: rgba(0, 174, 238, 0.1);
}

@media (max-width: 768px) {

  table td::before,
  table th::before {
    display: none;
  }
}

.actions-sticky {
  position: sticky !important;
  right: 0 !important;
  z-index: 10 !important;
  background: white !important;
}

th.actions-sticky {
  background-color: rgb(191 219 254) !important;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.25);
}

td.actions-sticky {
  background: white !important;
  box-shadow: -4px 0 6px rgba(0, 0, 0, 0.15);
}

.left-sticky {
  position: sticky !important;
  left: 0 !important;
  z-index: 10 !important;
  background: white !important;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
}

th.left-sticky {
  background-color: rgb(191 219 254) !important;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.2);
}

.left-sticky-2 {
  position: sticky !important;
  left: 50px !important;
  z-index: 10 !important;
  background: white !important;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
}

th.left-sticky-2 {
  background-color: rgb(191 219 254) !important;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.2);
}

.actions-cell svg {
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.actions-cell svg:hover {
  transform: scale(1.15);
  filter: brightness(1.2);
}

:deep(.ant-pagination) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
}

:deep(.ant-pagination-item) {
  border-radius: 2px !important;
  border: 1px solid #e5e7eb !important;
  transition: all 0.2s ease;
  min-width: 28px !important;
  height: 28px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-pagination-item a) {
  color: #374151 !important;
  font-size: 13px;
  line-height: 1;
}

:deep(.ant-pagination-item-active) {
  border-color: #2490ef !important;
  background-color: #2490ef !important;
}

:deep(.ant-pagination-item-active a) {
  color: #fff !important;
}

:deep(.ant-pagination-item:hover) {
  border-color: #2490ef !important;
  color: #2490ef !important;
}

:deep(.ant-pagination-prev),
:deep(.ant-pagination-next) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px !important;
  height: 28px !important;
  border-radius: 2px !important;
  transition: all 0.2s ease;
}

:deep(.ant-pagination-prev:hover),
:deep(.ant-pagination-next:hover) {
  background-color: #f3f4f6 !important;
}

:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  color: #374151 !important;
  font-size: 13px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb !important;
  border-radius: 2px !important;
  height: 28px !important;
  width: 28px !important;
}

:deep(.ant-pagination-prev:hover .ant-pagination-item-link),
:deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  color: #2490ef !important;
  border-color: #2490ef !important;
}

:deep(.ant-pagination-item-ellipsis) {
  color: #9ca3af !important;
}

:deep(.ant-pagination) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
}

:deep(.ant-pagination-item),
:deep(.ant-select-selector),
:deep(.ant-input-number-input) {
  font-size: 14px !important;
}

:deep(.ant-select-single .ant-select-selector),
:deep(.ant-input-number-sm) {
  border-radius: 2px !important;
}

tbody tr:nth-child(odd) {
  background-color: #f9fafb;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}

tbody tr:hover {
  background-color: rgb(232, 243, 255) !important;
}

@media (max-width: 768px) {

  .actions-sticky,
  .th-sticky,
  .td-sticky {
    position: static !important;
    right: auto !important;
    box-shadow: none !important;
    background: inherit !important;
    z-index: auto !important;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  line-height: 1;
  width: 100%;
  min-width: unset !important;
  text-align: center;
  color: white;
}
</style>
