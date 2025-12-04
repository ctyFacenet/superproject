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
        <table class="tw-min-w-max tw-border-collapse tw-w-full" ref="tableRef">
          <thead class="tw-sticky tw-top-0 tw-z-20">
            <tr class="tw-bg-blue-200 tw-border-b tw-border-gray-300 tw-text-gray-700 tw-text-[13px]">
              <th class="left-sticky tw-top-0 tw-z-40 tw-bg-blue-200 tw-w-[50px] tw-text-center tw-border">
                STT
              </th>

              <th v-if="!props.hideSelect"
                class="left-sticky-2 tw-top-0 tw-z-40 tw-bg-blue-200 tw-w-[45px] tw-text-center tw-border">
                <input type="checkbox" ref="selectAllRef" v-model="selectAll" @change="toggleSelectAll" />
              </th>

              <th v-for="col in filteredColumns" :key="col.key"
                class="tw-relative tw-border tw-border-gray-200 tw-font-semibold tw-text-center tw-px-3 tw-py-2 tw-group"
                :class="[
                  col.key === 'actions' ? 'actions-sticky th-sticky' : '',
                  {
                    'tw-bg-pink-100 tw-text-pink-800':
                      /(can|kdai|ktrung|ktieu|mahz|malh|mavt)/i.test(
                        col.key,
                      ),
                  },
                ]" :style="{
                  width: colWidths[col.key] + 'px',
                  minWidth: col.key === 'actions' ? '130px' : '150px',
                }">
                <div class="tw-flex tw-items-center tw-justify-center tw-gap-1">
                  <a-tooltip :title="col.title">
                    <span class="tw-truncate tw-font-semibold tw-text-[14px]">{{
                      col.title
                    }}</span>
                  </a-tooltip>
                  <IconRenderer v-if="col.key !== 'actions'" :icon="FilterOutlined" :size="14"
                    customClass="tw-cursor-pointer" />
                </div>

                <div
                  class="resizer tw-absolute tw-top-0 tw-right-0 tw-w-[6px] tw-h-full tw-cursor-col-resize tw-bg-transparent hover:tw-bg-blue-300 tw-opacity-0 group-hover:tw-opacity-100"
                  @mousedown="startResize($event, col.key)"></div>
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

                <template v-else-if="col.key && col.key.toLowerCase().endsWith('status')">
                  <a-select v-model:value="statusFilters[col.key]" show-search allowClear placeholder="Chọn trạng thái"
                    class="tw-w-full tw-shadow tw-bg-white tw-rounded-sm" :options="getStatusOptions(col.key)"
                    :filter-option="filterOption" />
                </template>

                <template v-else-if="col.key !== 'actions'">
                  <div class="tw-flex tw-items-center">
                    <a-input v-model:value="filters[col.key]" size="small"
                      class="tw-rounded-sm tw-p-1 tw-shadow tw-bg-white" allowClear>
                      <template #prefix>
                        <IconRenderer :icon="SearchOutlined" customClass="tw-opacity-30" />
                      </template>
                    </a-input>
                  </div>
                </template>
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-if="groupByField && groupedRows.length">
              <template v-for="(group, gIndex) in groupedRows" :key="group.key">

                <tr class="tw-font-semibold tw-text-red-600 tw-text-[13px]">
                  <td class="left-sticky tw-z-10 tw-border"></td>

                  <td v-if="!props.hideSelect" class="left-sticky-2 tw-z-10 tw-text-center tw-border">
                    <input type="checkbox" :checked="selectedGroups.includes(group.key)"
                      @change="toggleGroup(group.key, $event)" />
                  </td>

                  <td class="tw-border tw-pl-3 tw-py-1" :colspan="filteredColumns.length">
                    <div class="tw-flex tw-items-center tw-gap-2">

                      <button v-if="config.enableCollapse" class="tw-w-[18px] tw-h-[18px] tw-flex tw-items-center tw-justify-center
             tw-border tw-border-gray-100 tw-rounded-sm tw-bg-white
             hover:tw-bg-gray-100 hover:tw-border-green-300 tw-transition"
                        @click.stop="toggleCollapseGroup(group.key)">
                        <component :is="collapsedGroups.has(group.key) ? PlusOutlined : MinusOutlined"
                          class="tw-text-[12px]" />
                      </button>

                      <span class="tw-font-bold tw-text-red-600 tw-text-[13px] tw-leading-none tw-cursor-pointer"
                        @click="config.enableCollapse && toggleCollapseGroup(group.key)">
                        {{ group.key }}
                      </span>

                    </div>
                  </td>

                </tr>

                <tr v-for="(row, i) in group.rows" :key="row.name"
                  v-if="!config.enableCollapse || !collapsedGroups.has(group.key)" :class="[
                    'tw-text-[13px] tw-cursor-pointer tw-transition-colors tw-duration-150',
                    selectedRows.has(row) ? 'tw-bg-blue-50' : 'hover:tw-bg-gray-50',
                  ]" @click="handleRowClick($event, row)">
                  <td class="left-sticky tw-text-center tw-border tw-py-1">
                    {{ totalPreviousRows(gIndex) + i + 1 }}
                  </td>

                  <td v-if="!props.hideSelect" class="left-sticky-2 tw-text-center tw-border tw-py-1">
                    <input type="checkbox" :checked="selectedRows.has(row)"
                      @change="toggleRow(group.key, row, $event)" />
                  </td>

                  <td v-for="col in filteredColumns" :key="col.key" class="tw-border tw-text-center tw-relative"
                    :class="col.key === 'actions' ? 'actions-sticky td-sticky' : ''">
                    <template v-if="col.key && col.key.toLowerCase().endsWith('status')">
                      <span :style="statusColors[row[col.key]] || 'background-color:#e5e7eb; color:#374151;'"
                        class="status-badge">
                        {{ row[col.key] }}
                      </span>
                    </template>

                    <template v-else-if="col.key === 'actions'">
                      <div v-if="getDoctypeConfig(props.doctype)?.rowActions"
                        class="actions-cell tw-flex tw-items-center tw-justify-center tw-gap-3">
                        <template v-for="(action, index) in getDoctypeConfig(props.doctype).rowActions" :key="index">
                          <a-tooltip :title="action.label">
                            <IconRenderer :icon="action.icon" :color="action.color" customClass="tw-cursor-pointer"
                              @click.stop="action.onClick(row)" />
                          </a-tooltip>
                        </template>
                      </div>
                    </template>

                    <template v-else>
                      {{ row[col.key] || "" }}
                    </template>
                  </td>
                </tr>

              </template>
            </template>

            <template v-else>
              <tr v-for="(row, i) in filteredRows.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize,
              )" :key="i" :class="[
                'tw-text-[13px] tw-cursor-pointer',
                selectedRows.has(row) ? 'tw-bg-blue-50' : 'hover:tw-bg-gray-50',
              ]" @click="handleRowClick($event, row)">
                <td class="left-sticky tw-text-center tw-border tw-py-1">
                  {{ i + 1 + (currentPage - 1) * pageSize }}
                </td>

                <td v-if="!props.hideSelect" class="left-sticky-2 tw-text-center tw-border tw-py-1">
                  <input type="checkbox" :checked="selectedRows.has(row)" @change="toggleRow(null, row, $event)" />
                </td>

                <td v-for="col in filteredColumns" :key="col.key" class="tw-border tw-text-center tw-relative"
                  :class="col.key === 'actions' ? 'actions-sticky td-sticky' : ''">
                  <template v-if="col.key && col.key.toLowerCase().endsWith('status')">
                    <span :style="statusColors[row[col.key]] || 'background-color:#e5e7eb; color:#374151;'"
                      class="status-badge">
                      {{ row[col.key] }}
                    </span>
                  </template>

                  <template v-else-if="col.key === 'actions'">
                    <div v-if="getDoctypeConfig(props.doctype)?.rowActions"
                      class="actions-cell tw-flex tw-items-center tw-justify-center tw-gap-3">
                      <template v-for="(action, index) in getDoctypeConfig(props.doctype).rowActions" :key="index">
                        <a-tooltip :title="action.label">
                          <IconRenderer :icon="action.icon" :color="action.color" customClass="tw-cursor-pointer"
                            @click.stop="action.onClick(row)" />
                        </a-tooltip>
                      </template>
                    </div>
                  </template>

                  <template v-else>
                    {{ row[col.key] || "" }}
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
            Trang số {{ currentPage }} của {{ totalPages }} ({{
              filteredRows?.length || 0
            }}
            bản ghi)
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

      <div
        class="tw-text-center tw-border-t tw-border-gray-200 tw-bg-white tw-text-[13px] sm:tw-text-[14px] tw-font-[500] tw-tracking-wide tw-text-gray-600">
        © Copyright
        <a href="https://facenet.vn" target="_blank" rel="noopener noreferrer"
          class="tw-text-[#0066cc] tw-font-semibold tw-cursor-pointer hover:tw-underline">FaceNet</a>. All Rights
        Reserved,&nbsp;Designed by
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
import IconRenderer from "../components/IconRenderer.vue"
import { PlusOutlined, MinusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons-vue";

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
const statusFilters = ref({});
const metaFields = ref({});


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
  { deep: true },
);

const checkedColumns = computed(() =>
  Object.keys(visibleColumns.value).filter((k) => visibleColumns.value[k]),
);

function toggleColumn(key, e) {
  visibleColumns.value[key] = e.target.checked;
}

function resetColumns() {
  Object.keys(visibleColumns.value).forEach((k) => (visibleColumns.value[k] = true));
}

const config = computed(() => getDoctypeConfig(props.doctype));
const groupByField = computed(() => config.value.groupByField);

const collapsedGroups = ref(new Set());

const toggleCollapseGroup = (key) => {
  if (!config.value.enableCollapse) return;
  if (collapsedGroups.value.has(key)) collapsedGroups.value.delete(key);
  else collapsedGroups.value.add(key);
};


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


    meta.fields.forEach(f => {
      metaFields.value[f.fieldname] = f;
    });

    visibleFields.push({ title: "Thao tác", key: "actions" });
    columns.value = visibleFields;

    visibleFields.forEach(col => {
      if (col.key.toLowerCase().endsWith("status")) {
        if (!statusFilters.value[col.key]) statusFilters.value[col.key] = "";
      }
    });

    //Đặt chiều rộng mặc định cho các cột
    visibleFields.forEach((f) => {
      if (!colWidths.value[f.key]) colWidths.value[f.key] = 160;
    });

    const statusField = meta.fields.find((f) =>
      f.fieldname && f.fieldname.toLowerCase().endsWith("status")
    );

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
  if (!all) selectedGroups.value = selectedGroups.value.filter((x) => x !== gk);
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
  if (selectAllRef.value) selectAllRef.value.indeterminate = count > 0 && count < total;
});

const filters = ref({});
const dateFilters = ref({});

function getStatusOptions(fieldname) {
  const field = metaFields.value[fieldname];
  if (!field?.options) return [];

  return field.options
    .split("\n")
    .map(o => o.trim())
    .filter(Boolean)
    .map(o => ({ label: o, value: o }));
}

const filterOption = (input, option) => option.label.toLowerCase().includes(input.toLowerCase());

const filteredRows = computed(() => {
  let result = (allRows.value || []).filter((r, i) => {
    const pass = (columns.value || []).every((c) => {
      if (c.key === "actions") return true;

      if (c.key && c.key.toLowerCase().endsWith("status")) {
        const selected = statusFilters.value[c.key];
        if (selected) return r[c.key] === selected;
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

    return pass;
  });

  const treeKeys = props.filters?.treeKeys || [];
  if (treeKeys.length) {
    result = result.filter((r, idx) => {
      const dateColumn = (columns.value || []).find((c) => c.fieldtype === "Date");
      const dateKey = dateColumn?.key;

      if (!dateKey) {
        console.warn("⚠️ Không tìm thấy cột ngày trong columns!");
        return false;
      }

      const dateField = r[dateKey];
      if (!dateField) {
        console.warn("⚠️ Dòng này không có giá trị cho trường ngày:", dateKey);
        return false;
      }

      const d = dayjs(dateField, ["YYYY-MM-DD", "DD-MM-YYYY"]);
      if (!d.isValid()) {
        console.warn("⚠️ Không parse được ngày:", dateField);
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
      return match;
    });
  }

  return result;
});

watch(
  () => props.filters,
  () => {
    console.log("🪄 Filter applied:", props.filters);
  },
  { deep: true },
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
  Math.max(1, Math.ceil((filteredRows.value?.length || 0) / pageSize.value)),
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
  { immediate: true },
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
