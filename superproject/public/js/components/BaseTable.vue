<template>
  <div
    class="tw-relative tw-border tw-border-gray-100 tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-4 sm:tw-p-6 tw-text-sm tw-flex tw-flex-col tw-h-full">

    <a-spin :spinning="loading" size="large" class="tw-w-full tw-h-full">

      <div class="fade-left" v-show="scrollLeft > 5"></div>
      <div class="fade-right" v-show="scrollRight > 5"></div>

      <div ref="scrollWrapper" class="tw-flex-1 tw-overflow-x-auto tw-overflow-y-auto tw-max-h-[70vh] tw-relative"
        @scroll="handleScroll">
        <table class="tw-min-w-max tw-border-collapse tw-w-full" ref="tableRef">
          <thead class="tw-sticky tw-top-0 tw-z-20">

            <tr class="tw-bg-blue-50 tw-border-b tw-border-gray-300 tw-text-gray-700 tw-text-[13px]">
              <th
                class="tw-sticky sticky-left-fade tw-left-0 tw-top-0 tw-z-40 tw-bg-pink-100 tw-w-[50px] tw-text-center tw-border">
                STT
              </th>

              <th
                class="tw-sticky sticky-left-fade tw-left-[50px] tw-top-0 tw-z-40 tw-bg-pink-100 tw-w-[45px] tw-text-center tw-border">
                <input type="checkbox" ref="selectAllRef" v-model="selectAll" @change="toggleSelectAll" />
              </th>

              <th v-for="col in columns || []" :key="col.key"
                class="tw-relative tw-border tw-border-gray-200 tw-font-semibold tw-text-center tw-px-3 tw-py-2 tw-group"
                :class="[
                  {
                    'tw-sticky tw-right-0 tw-z-40 tw-bg-pink-100 tw-shadow-[-4px_0_6px_rgba(0,0,0,0.15)]':
                      col.key === 'actions',
                    'tw-bg-pink-100 tw-text-pink-800':
                      /(can|kdai|ktrung|ktieu|mahz|malh|mavt)/i.test(col.key)
                  }
                ]" :style="{
                  width: colWidths[col.key] + 'px',
                  minWidth: col.key === 'actions' ? '130px' : '150px',
                }">
                <div class="tw-flex tw-items-center tw-justify-center tw-gap-1">
                  <a-tooltip :title="col.title">
                    <span class="tw-truncate tw-font-semibold">{{ col.title }}</span>
                  </a-tooltip>
                  <img v-if="col.key !== 'actions'" src="/assets/tahp/hello_vue/assets/icons/filter.svg" alt="filter"
                    class="tw-w-3 tw-h-3 tw-opacity-70 tw-cursor-pointer hover:tw-opacity-100" />
                </div>

                <div
                  class="resizer tw-absolute tw-top-0 tw-right-0 tw-w-[6px] tw-h-full tw-cursor-col-resize tw-bg-transparent hover:tw-bg-blue-300 tw-opacity-0 group-hover:tw-opacity-100"
                  @mousedown="startResize($event, col.key)"></div>
              </th>
            </tr>

            <tr class="tw-bg-white tw-border-b tw-border-gray-200">
              <th class="tw-sticky tw-left-0 tw-top-[33px] tw-z-30 tw-bg-pink-100 tw-border"></th>
              <th class="tw-sticky tw-left-[50px] tw-top-[33px] tw-z-30 tw-bg-pink-100 tw-border"></th>

              <th v-for="col in columns || []" :key="col.key" class="tw-px-2 tw-py-1 tw-border tw-bg-white" :class="{
                'tw-sticky tw-right-0 tw-z-30 tw-bg-pink-100':
                  col.key === 'actions',
              }" :style="{ width: colWidths[col.key] + 'px' }">
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
                    <img src="/assets/tahp/hello_vue/assets/icons/search.svg" alt="search"
                      class="tw-w-3 tw-h-3 tw-mr-1 tw-opacity-70" />
                    <input v-model="filters[col.key]" type="text"
                      class="tw-w-full tw-border-none focus:tw-outline-none tw-text-[12px] tw-bg-transparent" />
                  </div>
                </template>
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-if="filteredRows.length">
              <tr v-for="(row, i) in filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :key="i"
                :class="[
                  'tw-text-[13px] tw-cursor-pointer',
                  selectedRows.has(row) ? 'tw-bg-blue-50' : 'hover:tw-bg-gray-50',
                ]" @click="handleRowClick($event, row)">
                <td
                  class="index-cell tw-sticky tw-left-0 tw-top-0 tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                  {{ i + 1 + (currentPage - 1) * pageSize }}
                </td>

                <td
                  class="checkbox-cell tw-sticky tw-left-[50px] tw-top-0 tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                  <input type="checkbox" :checked="selectedRows.has(row)" @change="toggleRow(null, row, $event)" />
                </td>

                <td v-for="col in columns || []" :key="col.key"
                  class="tw-border tw-px-2 tw-py-1 tw-text-center tw-relative" :class="{
                    'tw-sticky sticky-right-fade tw-right-0 tw-z-20 tw-bg-pink-100 tw-text-center':
                      col.key === 'actions',
                  }" :style="{ width: colWidths[col.key] + 'px' }">
                  <template v-if="col.key === 'status'">
                    <span :style="statusColors[row.status] || 'background-color:#e5e7eb; color:#374151;'"
                      class="tw-inline-block tw-rounded-lg tw-px-2 tw-py-[2px] tw-text-[12px] tw-font-medium">
                      {{ row.status }}
                    </span>

                  </template>

                  <template v-else-if="col.key === 'actions'">
                    <div v-if="doctypeActions && doctypeActions[props.doctype]?.rowActions"
                      class="actions-cell tw-flex tw-items-center tw-justify-center tw-gap-3">
                      <template v-for="(action, index) in doctypeActions[props.doctype].rowActions" :key="index">
                        <a-tooltip :title="action.label">
                          <component :is="action.icon"
                            class="tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-in-out" :style="{
                              color: action.color || '#6B7280',
                              fontSize: '15px'
                            }" @mouseenter="hoverColor = action.hoverColor" @mouseleave="hoverColor = null"
                            @click.stop="action.onClick(row)" />
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

            <tr v-else>
              <td :colspan="(columns?.length || 0) + 2"
                class="tw-text-center tw-py-6 tw-text-gray-500 tw-italic tw-border">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-center tw-py-2 tw-px-3 tw-border-gray-200 tw-bg-gray-50 tw-text-xs">
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
        class="tw-text-center tw-py-3 tw-border-t tw-border-gray-200 tw-bg-white tw-text-[13px] sm:tw-text-[14px] tw-font-[500] tw-tracking-wide tw-text-gray-600">
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
import { ref, computed, watch, shallowRef, onMounted } from "vue";
import dayjs from "dayjs";

import { Spin as ASpin } from "ant-design-vue";
import { statusColors } from "../utils/status-colors"
import { doctypeActions } from "../components/config/doctype-actions";


const props = defineProps({
  doctype: { type: String, required: true },
  nameKey: { type: String, default: "name" },
  groupBy: { type: String, default: null },
});

const emit = defineEmits(["rowClick", "view", "edit", "delete", "selection-change"]);

const loading = ref(false);
const columns = ref([]);
const rows = ref([]);

async function fetchData() {
  loading.value = true;
  try {
    const meta = await frappe.get_meta(props.doctype);
    let visibleFields = meta.fields
      .filter(f => f.in_list_view)
      .map(f => ({ title: f.label || f.fieldname, key: f.fieldname, fieldtype: f.fieldtype }));

    let firstCol = meta.title_field ? visibleFields.find(f => f.key === meta.title_field) : null;
    if (firstCol) visibleFields = visibleFields.filter(f => f.key !== firstCol.key);
    visibleFields.push({ title: 'Thao tác', key: 'actions' });
    columns.value = visibleFields;

    visibleFields.forEach(f => {
      if (!colWidths.value[f.key]) colWidths.value[f.key] = 160;
    });

    const fieldNames = [
      'name',
      ...visibleFields
        .filter(f => f.key !== 'actions' && f.key !== 'name')
        .map(f => f.key),
    ];

    const data = await frappe.db.get_list(props.doctype, {
      fields: fieldNames,
      limit: 100,
    });

    rows.value = data;
  } catch (err) {
    console.error('fetchData error:', err);
  } finally {
    loading.value = false;
  }
}


onMounted(fetchData);
watch(() => props.doctype, fetchData);

const allRows = shallowRef(rows.value || []);
watch(rows, (val) => (allRows.value = val || []));

const openForm = (row) => {
  emit("rowClick", row);
  if (!props.doctype || !row) return;
  const docName = row[props.nameKey] || row.name || row.id || null;

  if (docName) frappe.set_route("Form", props.doctype, docName);
};

const handleRowClick = (event, row) => {
  const inActionCell =
    event.target.closest(".actions-cell") ||
    event.target.closest(".checkbox-cell") ||
    event.target.closest(".index-cell");
  if (!inActionCell) openForm(row);
};

const isProductionCell = (key) => !!key && /(can|kdai|ktrung|ktieu|mahz|malh|mavt)/i.test(key);

const getProgressWidth = (v) => {
  if (!v || typeof v !== "string" || !v.includes("/")) return 0;
  const [done, total] = v.split("/").map(Number);
  return total ? Math.min(100, (done / total) * 100) : 0;
};

const getStatusColor = (v) => {
  if (!v) return "#9ca3af";
  const s = v.toString().toLowerCase();
  if (s.includes("chờ")) return "#a07855";
  if (s.includes("đang")) return "#3b82f6";
  if (s.includes("tạm")) return "#fbbf24";
  if (s.includes("kết")) return "#22c55e";
  if (s.includes("huỷ") || s.includes("hủy")) return "#ef4444";
  if (v.includes("/")) {
    const [done, total] = v.split("/").map(Number);
    const p = total ? (done / total) * 100 : 0;
    if (p === 0) return "#a07855";
    if (p < 50) return "#3b82f6";
    if (p < 99) return "#fbbf24";
    return "#22c55e";
  }
  return "#9ca3af";
};

const groupedRows = computed(() => {
  if (!props.groupBy) return [];
  const map = new Map();
  (allRows.value || []).forEach((r) => {
    const k = r[props.groupBy] || "Không xác định";
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
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

  if (!props.groupBy) return;
  const g = groupedRows.value.find((x) => x.key === gk);
  if (!g) return;
  const all = g.rows.every((r) => selectedRows.value.has(r));
  if (all && !selectedGroups.value.includes(gk)) selectedGroups.value.push(gk);
  if (!all) selectedGroups.value = selectedGroups.value.filter((x) => x !== gk);
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    if (props.groupBy) {
      groupedRows.value.forEach((g) => {
        if (!selectedGroups.value.includes(g.key))
          selectedGroups.value.push(g.key);
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
  const total = props.groupBy
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

const statusOptions = Object.keys(statusColors).map((x) => ({ label: x, value: x }));
const filterOption = (input, option) =>
  option.label.toLowerCase().includes(input.toLowerCase());

const filteredRows = computed(() =>
  (allRows.value || []).filter((r) =>
    (columns.value || []).every((c) => {
      if (c.key === "actions") return true;
      if (c.key === "status" && statusFilter.value)
        return r[c.key] === statusFilter.value;
      if (c.fieldtype === "Date") {
        const range = dateFilters.value[c.key];
        if (!range || range?.length !== 2) return true;
        const d = dayjs(r[c.key], "DD-MM-YYYY");
        return d.isAfter(dayjs(range[0]).startOf("day")) &&
          d.isBefore(dayjs(range[1]).endOf("day"));
      }
      const val = (r[c.key] || "").toString().toLowerCase();
      const f = (filters.value[c.key] || "").toString().toLowerCase();
      return val.includes(f);
    })
  )
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

const pagedGroups = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  const flat = filteredRows.value.slice(start, end);
  if (!props.groupBy) return [];
  const map = new Map();
  flat.forEach((r) => {
    const k = r[props.groupBy] || "Không xác định";
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  });
  return [...map].map(([key, rows]) => ({ key, rows }));
});

const colWidths = ref({});
watch(columns, (cols) => {
  cols?.forEach((c) => {
    if (!colWidths.value[c.key]) colWidths.value[c.key] = 160;
  });
}, { immediate: true });

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
</script>


<style scoped>

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
    background: white !important;
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
  background: linear-gradient(to right, white, transparent);
}

.fade-right {
  right: 0;
  background: linear-gradient(to left, white, transparent);
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
  font-size: 12px !important;
}
</style>