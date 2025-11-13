<template>
  <div
    class="tw-relative tw-border tw-border-gray-100 tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-4 sm:tw-p-6 tw-text-sm tw-flex tw-flex-col tw-h-full">

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


      <div class="fade-left" v-show="scrollLeft > 5"></div>
      <div class="fade-right" v-show="scrollRight > 5"></div>

      <div ref="scrollWrapper" class="tw-flex-1 tw-overflow-x-auto tw-overflow-y-auto tw-max-h-[70vh] tw-relative"
        @scroll="handleScroll">
        <table class="tw-min-w-max tw-border-collapse tw-w-full" ref="tableRef">
          <thead class="tw-sticky tw-top-0 tw-z-20">

            <tr class="tw-bg-blue-50 tw-border-b tw-border-gray-300 tw-text-gray-700 tw-text-[13px]">
              <th class="tw-sticky tw-left-0 tw-top-0 tw-z-40 tw-bg-pink-100 tw-w-[50px] tw-text-center tw-border">
                STT
              </th>

              <th v-if="!props.hideSelect"
                class="tw-sticky tw-left-[50px] tw-top-0 tw-z-40 tw-bg-pink-100 tw-w-[45px] tw-text-center tw-border">
                <input type="checkbox" ref="selectAllRef" v-model="selectAll" @change="toggleSelectAll" />
              </th>

              <th v-for="col in filteredColumns" :key="col.key"
                class="tw-relative tw-border tw-border-gray-200 tw-font-semibold tw-text-center tw-px-3 tw-py-2 tw-group"
                :class="[
                  { 'tw-sticky tw-right-0 tw-z-40 tw-bg-pink-100': col.key === 'actions' },
                  { 'tw-bg-pink-100 tw-text-pink-800': /(can|kdai|ktrung|ktieu|mahz|malh|mavt)/i.test(col.key) }
                ]" :style="{
                  width: colWidths[col.key] + 'px',
                  minWidth: col.key === 'actions' ? '130px' : '150px'
                }">
                <div class="tw-flex tw-items-center tw-justify-center tw-gap-1">
                  <a-tooltip :title="col.title">
                    <span class="tw-truncate tw-font-semibold">{{ col.title }}</span>
                  </a-tooltip>
                  <img v-if="col.key !== 'actions'" src="/assets/superproject/assets/icons/filter.svg" alt="filter"
                    class="tw-w-3 tw-h-3 tw-opacity-70 tw-cursor-pointer hover:tw-opacity-100" />
                </div>

                <div
                  class="resizer tw-absolute tw-top-0 tw-right-0 tw-w-[6px] tw-h-full tw-cursor-col-resize tw-bg-transparent hover:tw-bg-blue-300 tw-opacity-0 group-hover:tw-opacity-100"
                  @mousedown="startResize($event, col.key)"></div>
              </th>
            </tr>

            <tr class="tw-bg-white tw-border-b tw-border-gray-200">
              <th class="tw-sticky tw-left-0 tw-top-[33px] tw-z-30 tw-bg-pink-100 tw-border"></th>
              <th v-if="!props.hideSelect"
                class="tw-sticky tw-left-[50px] tw-top-[33px] tw-z-30 tw-bg-pink-100 tw-border">
              </th>

              <th v-for="col in filteredColumns" :key="col.key" class="tw-px-2 tw-py-1 tw-border tw-bg-white"
                :class="{ 'tw-sticky tw-right-0 tw-z-30 tw-bg-pink-100': col.key === 'actions' }"
                :style="{ width: colWidths[col.key] + 'px' }">
                <template v-if="col.fieldtype === 'Date'">
                  <a-range-picker v-model:value="dateFilters[col.key]" format="DD/MM/YYYY" size="small"
                    :placeholder="['Từ ngày', 'Đến ngày']" class="tw-w-full tw-text-xs" />
                </template>

                <template v-else-if="col.key === 'status'">
                  <a-select v-model:value="statusFilter" show-search allowClear placeholder="Chọn trạng thái"
                    style="width: 200px" :options="statusOptions" :filter-option="filterOption" />
                </template>

                <template v-else-if="col.key !== 'actions'">
                  <div class="tw-flex tw-items-center">
                    <img src="/assets/superproject/assets/icons/search.svg" alt="search"
                      class="tw-w-3 tw-h-3 tw-mr-1 tw-opacity-70" />
                    <input v-model="filters[col.key]" type="text"
                      class="tw-w-full tw-border-none focus:tw-outline-none tw-text-[12px] tw-bg-transparent" />
                  </div>
                </template>
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-if="groupByField && groupedRows.length">
              <template v-for="(group, gIndex) in groupedRows" :key="group.key">
                <tr class="tw-bg-pink-50 tw-font-semibold tw-text-red-600 tw-text-[13px]">
                  <td class="tw-sticky tw-left-0 tw-bg-pink-100 tw-z-10 tw-border"></td>
                  <td v-if="!props.hideSelect"
                    class="tw-sticky tw-left-[50px] tw-bg-pink-100 tw-z-10 tw-text-center tw-border">
                    <input type="checkbox" :checked="selectedGroups.includes(group.key)"
                      @change="toggleGroup(group.key, $event)" />
                  </td>
                  <td class="tw-border tw-bg-pink-50 tw-text-left tw-pl-3" :colspan="filteredColumns.length">
                    {{ group.key }}
                  </td>
                </tr>

                <tr v-for="(row, i) in group.rows" :key="row.name" :class="[
                  'tw-text-[13px] tw-cursor-pointer tw-transition-colors tw-duration-150',
                  selectedRows.has(row) ? 'tw-bg-blue-50' : 'hover:tw-bg-gray-50'
                ]" @click="handleRowClick($event, row)">
                  <td class="tw-sticky tw-left-0 tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                    {{ totalPreviousRows(gIndex) + i + 1 }}
                  </td>
                  <td v-if="!props.hideSelect"
                    class="tw-sticky tw-left-[50px] tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                    <input type="checkbox" :checked="selectedRows.has(row)"
                      @change="toggleRow(group.key, row, $event)" />
                  </td>
                  <td v-for="col in filteredColumns" :key="col.key"
                    class="tw-border tw-px-2 tw-py-1 tw-text-center tw-relative"
                    :class="{ 'tw-sticky tw-right-0 tw-bg-pink-100 tw-z-20': col.key === 'actions' }">
                    <template v-if="col.key === 'status'">
                      <span :style="statusColors[row.status] || 'background-color:#e5e7eb; color:#374151;'"
                        class="tw-inline-block tw-rounded-lg tw-px-2 tw-py-[2px] tw-text-[12px] tw-font-medium">
                        {{ row.status }}
                      </span>

                    </template>

                    <template v-else-if="col.key === 'actions'">
                      <div v-if="getDoctypeConfig(props.doctype)?.rowActions"
                        class="actions-cell tw-flex tw-items-center tw-justify-center tw-gap-3">
                        <template v-for="(action, index) in getDoctypeConfig(props.doctype).rowActions" :key="index">
                          <a-tooltip :title="action.label">
                            <component :is="action.icon"
                              class="tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-in-out"
                              :style="{ color: action.color, fontSize: '15px' }" @click.stop="action.onClick(row)" />
                          </a-tooltip>
                        </template>
                      </div>
                    </template>

                    <template v-else>
                      {{ row[col.key] || '' }}
                    </template>
                  </td>
                </tr>
              </template>
            </template>

            <template v-else>
              <tr v-for="(row, i) in filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :key="i"
                :class="[
                  'tw-text-[13px] tw-cursor-pointer',
                  selectedRows.has(row) ? 'tw-bg-blue-50' : 'hover:tw-bg-gray-50'
                ]" @click="handleRowClick($event, row)">
                <td class="index-cell tw-sticky tw-left-0 tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                  {{ i + 1 + (currentPage - 1) * pageSize }}
                </td>
                <td v-if="!props.hideSelect"
                  class="checkbox-cell tw-sticky tw-left-[50px] tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                  <input type="checkbox" :checked="selectedRows.has(row)" @change="toggleRow(null, row, $event)" />
                </td>
                <td v-for="col in filteredColumns" :key="col.key"
                  class="tw-border tw-px-2 tw-py-1 tw-text-center tw-relative"
                  :class="{ 'tw-sticky tw-right-0 tw-bg-pink-100 tw-z-20': col.key === 'actions' }">
                  <template v-if="col.key === 'status'">
                    <span :style="statusColors[row.status] || 'background-color:#e5e7eb; color:#374151;'"
                      class="tw-inline-block tw-rounded-lg tw-px-2 tw-py-[2px] tw-text-[12px] tw-font-medium">
                      {{ row.status }}
                    </span>

                  </template>

                  <template v-else-if="col.key === 'actions'">
                    <div v-if="getDoctypeConfig(props.doctype)?.rowActions"
                      class="actions-cell tw-flex tw-items-center tw-justify-center tw-gap-3">
                      <template v-for="(action, index) in getDoctypeConfig(props.doctype).rowActions" :key="index">
                        <a-tooltip :title="action.label">
                          <component :is="action.icon"
                            class="tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-in-out"
                            :style="{ color: action.color, fontSize: '15px' }" @click.stop="action.onClick(row)" />
                        </a-tooltip>
                      </template>
                    </div>
                  </template>

                  <template v-else>
                    {{ row[col.key] || '' }}
                  </template>
                </td>
              </tr>
            </template>

            <tr v-if="!filteredRows.length">
              <td :colspan="(columns?.length || 0) + (props.hideSelect ? 1 : 2)"
                class="tw-text-center tw-py-6 tw-text-gray-500 tw-italic tw-border">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-center tw-py-2 tw-px-3 tw-border-gray-200 tw-bg-gray-50 tw-text-[14px] tw-font-medium">
        <a-select v-model:value="pageSize" :options="pageSizeOptions" class="tw-hidden sm:tw-block tw-w-[110px]"
          @change="onPageSizeChange" />
        <div
          class="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center tw-gap-2 sm:tw-gap-3 tw-w-full sm:tw-w-auto">
          <span class="tw-hidden sm:tw-inline tw-text-gray-600 tw-font-medium">
            Trang số {{ currentPage }} của {{ totalPages }} ({{ filteredRows?.length || 0 }} bản ghi)
          </span>
          <a-pagination v-model:current="currentPage" :total="filteredRows?.length || 0" :pageSize="pageSize"
            @change="onPageChange" :showSizeChanger="false" size="small" class="tw-my-1 sm:tw-my-0" />
        </div>
        <div class="tw-hidden sm:tw-flex tw-items-center tw-gap-2">
          <span>Đi đến</span>
          <a-input-number v-model:value="goToPage" :min="1" :max="totalPages" @pressEnter="jumpToPage"
            style="width: 70px" size="small" />
        </div>
      </div>

      <div
        class="tw-text-center tw-border-t tw-border-gray-200 tw-bg-white tw-text-[13px] sm:tw-text-[14px] tw-font-[500] tw-tracking-wide tw-text-gray-600">
        © Copyright
        <a href="https://facenet.vn" target="_blank" rel="noopener noreferrer"
          class="tw-text-[#0066cc] tw-font-semibold tw-cursor-pointer hover:tw-underline">FaceNet</a>.
        All Rights Reserved,&nbsp;Designed by
        <a href="https://facenet.vn" target="_blank" rel="noopener noreferrer"
          class="tw-text-[#0066cc] tw-font-semibold tw-cursor-pointer hover:tw-underline">FaceNet</a>
      </div>
    </a-spin>
  </div>
</template>


<script setup>
import { ref, computed, watch, shallowRef, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import { getDoctypeConfig } from "./config/doctype-configs";
import { colorMap } from "../utils/status-colors";


const statusColors = ref({});

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

const visibleColumns = ref({});
const showColumnPicker = ref(false);

const storageKey = computed(() => `visibleColumns_${props.doctype}`);

onMounted(() => {
  const saved = localStorage.getItem(storageKey.value);
  if (saved) visibleColumns.value = JSON.parse(saved);
  else {
    columns.value.forEach((col) => (visibleColumns.value[col.key] = true));
  }

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
  (v) => {
    localStorage.setItem(storageKey.value, JSON.stringify(v));
  },
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

const config = computed(() => getDoctypeConfig(props.doctype));
const groupByField = computed(() => config.value.groupByField);

async function fetchData() {
  loading.value = true;
  try {
    const meta = await frappe.get_meta(props.doctype);

    let visibleFields = meta.fields
      .filter((f) => f.in_list_view)
      .map((f) => ({
        title: f.label || f.fieldname,
        key: f.fieldname,
        fieldtype: f.fieldtype,
      }));

    visibleFields.push({ title: "Thao tác", key: "actions" });
    columns.value = visibleFields;

    //Đặt chiều rộng mặc định cho các cột
    visibleFields.forEach((f) => {
      if (!colWidths.value[f.key]) colWidths.value[f.key] = 160;
    });

    const statusField = meta.fields.find((f) => f.fieldname === "status");
    if (statusField && statusField.options) {
      const options = statusField.options
        .split("\n")
        .map((opt) => opt.trim())
        .filter(Boolean);

      const palette = Object.values(colorMap);
      const dynamicMap = {};

      options.forEach((opt, i) => {
        if (/hoàn thành/i.test(opt)) dynamicMap[opt] = colorMap.green;
        else if (/duyệt/i.test(opt)) dynamicMap[opt] = colorMap.orange;
        else if (/bản nháp|nhap/i.test(opt)) dynamicMap[opt] = colorMap.gray;
        else if (/hủy|huỷ/i.test(opt)) dynamicMap[opt] = colorMap.red;
        else if (/chờ|đang/i.test(opt)) dynamicMap[opt] = colorMap.blue;
        else dynamicMap[opt] = palette[i % palette.length];
      });

      statusColors.value = dynamicMap;
    } else {
      statusColors.value = {};
    }

    const fieldNames = [
      "name",
      ...visibleFields
        .filter((f) => f.key !== "actions" && f.key !== "name")
        .map((f) => f.key),
    ];

    const data = await frappe.db.get_list(props.doctype, {
      fields: fieldNames,
      limit: 200,
    });

    rows.value = data;
  } catch (err) {
    console.error("fetchData error:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
watch(() => props.doctype, fetchData);

const filteredColumns = computed(() => {
  let cols = columns.value.filter((c) => visibleColumns.value[c.key] !== false);
  const hasActions = config.value?.rowActions && config.value.rowActions.length > 0;
  if (!hasActions) cols = cols.filter((col) => col.key !== "actions");
  return cols;
});

const allRows = shallowRef(rows.value || []);
watch(rows, (val) => (allRows.value = val || []));

const groupedRows = computed(() => {
  if (!groupByField.value) return [];
  const map = new Map();
  (filteredRows.value || []).forEach((r) => {
    const key = r[groupByField.value] || "Không xác định";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });
  return [...map].map(([key, rows]) => ({ key, rows }));
});

const totalPreviousRows = (idx) =>
  groupedRows.value.slice(0, idx).reduce((a, g) => a + (g.rows?.length || 0), 0);

const selectedGroups = ref([]);
const selectedRows = ref(new Set());
const selectAll = ref(false);
const selectAllRef = ref(null);

watch(selectedRows, (v) => emit("selection-change", Array.from(v)));

const toggleGroup = (key, e) => {
  const g = groupedRows.value.find((x) => x.key === key);
  if (!g) return;
  if (e.target.checked) {
    if (!selectedGroups.value.includes(key)) selectedGroups.value.push(key);
    g.rows.forEach((r) => selectedRows.value.add(r));
  } else {
    selectedGroups.value = selectedGroups.value.filter((x) => x !== key);
    g.rows.forEach((r) => selectedRows.value.delete(r));
  }
};

const toggleRow = (gk, row, e) => {
  if (e.target.checked) selectedRows.value.add(row);
  else selectedRows.value.delete(row);

  if (!groupByField.value) return;
  const g = groupedRows.value.find((x) => x.key === gk);
  if (!g) return;
  const all = g.rows.every((r) => selectedRows.value.has(r));
  if (all && !selectedGroups.value.includes(gk)) selectedGroups.value.push(gk);
  if (!all)
    selectedGroups.value = selectedGroups.value.filter((x) => x !== gk);
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    if (groupByField.value) {
      groupedRows.value.forEach((g) => {
        if (!selectedGroups.value.includes(g.key)) selectedGroups.value.push(g.key);
        g.rows.forEach((r) => selectedRows.value.add(r));
      });
    } else {
      (filteredRows.value || []).forEach((r) => selectedRows.value.add(r));
    }
  } else {
    selectedGroups.value = [];
    selectedRows.value.clear();
  }
};

watch(selectedRows, () => {
  const total = groupByField.value
    ? groupedRows.value.reduce((a, g) => a + (g.rows?.length || 0), 0)
    : filteredRows.value.length;
  const count = selectedRows.value.size;
  selectAll.value = count > 0 && count === total;
  if (selectAllRef.value)
    selectAllRef.value.indeterminate = count > 0 && count < total;
});

const filters = ref({});
const dateFilters = ref({});
const statusFilter = ref("");
const statusOptions = computed(() => {
  const colors = statusColors.value || {};
  return Object.keys(colors).map((x) => ({
    label: x,
    value: x,
  }));
});

const filterOption = (input, option) =>
  option.label.toLowerCase().includes(input.toLowerCase());

const filteredRows = computed(() => {

  let result = (allRows.value || []).filter((r, i) => {

    const pass = (columns.value || []).every((c) => {
      if (c.key === "actions") return true;
      if (c.key === "status" && statusFilter.value) {
        const ok = r[c.key] === statusFilter.value;
        return ok;
      }
      if (c.fieldtype === "Date") {
        const range = dateFilters.value[c.key];
        if (!range || range?.length !== 2) return true;
        const d = dayjs(r[c.key], "DD-MM-YYYY");
        const ok =
          d.isAfter(dayjs(range[0]).startOf("day")) &&
          d.isBefore(dayjs(range[1]).endOf("day"));
        return ok;
      }
      const val = (r[c.key] || "").toString().toLowerCase();
      const f = (filters.value[c.key] || "").toString().toLowerCase();
      const ok = val.includes(f);
      return ok;
    });

    console.groupEnd();
    return pass;
  });

  const treeKeys = props.filters?.treeKeys || [];
  if (treeKeys.length) {

    result = result.filter((r, idx) => {

      const dateColumn = (columns.value || []).find((c) => c.fieldtype === "Date");
      const dateKey = dateColumn?.key;

      if (!dateKey) {
        console.warn("⚠️ Không tìm thấy cột ngày trong columns!");
        console.groupEnd();
        return false;
      }

      const dateField = r[dateKey];
      if (!dateField) {
        console.warn("⚠️ Dòng này không có giá trị cho trường ngày:", dateKey);
        console.groupEnd();
        return false;
      }

      const d = dayjs(dateField, ["YYYY-MM-DD", "DD-MM-YYYY"]);
      if (!d.isValid()) {
        console.warn("⚠️ Không parse được ngày:", dateField);
        console.groupEnd();
        return false;
      }

      const month = d.month() + 1;
      const year = d.year();

      const hasMonth = treeKeys.some((k) => {
        if (!k.startsWith("month-")) return false;
        const [, y, m] = k.split("-");
        const ok = parseInt(y) === year && parseInt(m) === month;
        return ok;
      });

      const hasYear = treeKeys.some((k) => {
        if (!k.startsWith("year-")) return false;
        const [, y] = k.split("-");
        const ok = parseInt(y) === year;
        return ok;
      });

      const match =
        (treeKeys.some((k) => k.startsWith("month-")) ? hasMonth : true) &&
        (treeKeys.some((k) => k.startsWith("year-")) ? hasYear : true);
      console.groupEnd();
      return match;
    });

    console.groupEnd();
  }


  return result;
});

watch(
  () => props.filters,
  () => {
    console.log("🪄 Filter applied:", props.filters);
  },
  { deep: true }
);

watch(filteredRows, () => (currentPage.value = 1));

const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { label: "10 / Trang", value: 10 },
  { label: "20 / Trang", value: 20 },
  { label: "50 / Trang", value: 50 },
  { label: "100 / Trang", value: 100 },
];
const totalPages = computed(() =>
  Math.max(1, Math.ceil((filteredRows.value?.length || 0) / pageSize.value))
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

const colWidths = ref({});
watch(
  columns,
  (cols) => {
    cols?.forEach((c) => {
      if (!colWidths.value[c.key]) colWidths.value[c.key] = 160;
    });
  },
  { immediate: true }
);
const resizing = ref({ active: false, k: null, x: 0, w: 0 });
const startResize = (e, k) => {
  e.preventDefault();
  resizing.value = { active: true, k, x: e.pageX, w: colWidths.value[k] };
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
  document.body.style.userSelect = "none";
};
const handleResize = (e) => {
  if (!resizing.value.active) return;
  const d = e.pageX - resizing.value.x;
  colWidths.value[resizing.value.k] = Math.max(80, resizing.value.w + d);
};
const stopResize = () => {
  if (!resizing.value.active) return;
  resizing.value.active = false;
  document.body.style.userSelect = "";
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
};

const scrollWrapper = ref(null);
const scrollLeft = ref(0);
const scrollRight = ref(0);
const handleScroll = () => {
  const el = scrollWrapper.value;
  if (!el) return;
  scrollLeft.value = el.scrollLeft;
  scrollRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft;
};

const handleRowClick = (event, row) => {
  const inActionCell =
    event.target.closest(".actions-cell") ||
    event.target.closest(".checkbox-cell") ||
    event.target.closest(".index-cell");
  if (!inActionCell) {
    emit("rowClick", row);
    const docName = row[props.nameKey] || row.name || row.id || null;
    if (docName) frappe.set_route("Form", props.doctype, docName);
  }
};
</script>


<style scoped>
tr.tw-bg-pink-50 {
  background-color: #fff1f2 !important;
}

tr.tw-bg-pink-50 td {
  border-top: 1px solid #fb7185 !important;
}

.actions-cell svg {
  transition: transform 0.2s ease, color 0.2s ease;
}

.actions-cell svg:hover {
  transform: scale(1.15);
  filter: brightness(1.2);
}

.sticky-left-fade::after {
  content: "";
  position: absolute;
  top: 0;
  right: -2px;
  width: 2px;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
}

.sticky-right-fade::before {
  content: "";
  position: absolute;
  top: 0;
  left: -2px;
  width: 2px;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
}

:deep(.ant-pagination) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
}

:deep(.ant-pagination-item) {
  border-radius: 6px !important;
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
  border-radius: 6px;
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
  border-radius: 6px !important;
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

@media (max-width: 768px) {

  th.tw-sticky,
  td.tw-sticky {
    position: static !important;
    left: auto !important;
    right: auto !important;
    z-index: auto !important;
    box-shadow: none !important;
    background: #b4dbff !important;
  }

  .fade-left,
  .fade-right {
    display: none !important;
  }
}

.fade-left,
.fade-right {
  position: absolute;
  top: 0;
  bottom: 50px;
  width: 30px;
  z-index: 50;
  pointer-events: none;
}

.fade-left {
  left: 0;
  background: linear-gradient(to right, rgb(246, 231, 243), transparent);
}

.fade-right {
  right: 0;
  background: linear-gradient(to left, rgb(246, 231, 243), transparent);
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

tbody tr:nth-child(odd) {
  background-color: #f9fafb;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}

tbody tr:hover {
  background-color: rgb(232, 243, 255) !important;
}
</style>