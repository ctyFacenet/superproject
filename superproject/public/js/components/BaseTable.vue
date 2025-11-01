<template>
  <div
    class="tw-relative tw-border tw-border-gray-100 tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-4 sm:tw-p-6 tw-text-sm tw-flex tw-flex-col tw-h-full">

    <a-spin :spinning="loading" class="tw-w-full tw-h-full">
      <div class="fade-left" v-show="scrollLeft > 5"></div>
      <div class="fade-right" v-show="scrollRight > 5"></div>

      <div ref="scrollWrapper"
        class="tw-flex-1 tw-overflow-x-auto tw-overflow-y-auto tw-max-h-[70vh] tw-border tw-border-gray-100 tw-relative"
        @scroll="handleScroll">
        <table class="tw-min-w-max tw-border-collapse tw-w-full" ref="tableRef">
          <thead class="tw-sticky tw-top-0 tw-z-20">

            <!-- Header Row -->
            <tr class="tw-bg-blue-50 tw-border-b tw-border-gray-300 tw-text-gray-700 tw-text-[13px]">
              <th
                class="tw-sticky tw-left-0 tw-top-0 tw-z-40 tw-bg-pink-100 tw-w-[50px] tw-text-center tw-border tw-shadow-[3px_0_6px_rgba(0,0,0,0.12)]">
                STT
              </th>
              <th
                class="tw-sticky tw-left-[50px] tw-top-0 tw-z-40 tw-bg-pink-100 tw-w-[45px] tw-text-center tw-border tw-shadow-[3px_0_6px_rgba(0,0,0,0.12)]">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>

              <th v-for="col in columns" :key="col.key"
                class="tw-relative tw-border tw-border-gray-200 tw-font-semibold tw-text-center tw-px-3 tw-py-2 tw-group"
                :class="{
                  'tw-sticky tw-right-0 tw-z-40 tw-bg-pink-100 tw-shadow-[-4px_0_6px_rgba(0,0,0,0.15)]':
                    col.key === 'actions'
                }" :style="{ width: colWidths[col.key] + 'px', minWidth: col.key === 'actions' ? '130px' : '150px' }">
                <div class="tw-flex tw-items-center tw-justify-center tw-gap-1">
                  <span class="tw-truncate tw-font-semibold">{{ col.title }}</span>
                </div>

                <div
                  class="resizer tw-absolute tw-top-0 tw-right-0 tw-w-[6px] tw-h-full tw-cursor-col-resize tw-bg-transparent hover:tw-bg-blue-300 tw-opacity-0 group-hover:tw-opacity-100"
                  @mousedown="startResize($event, col.key)"></div>
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-if="rows.length">
              <tr v-for="(row, i) in rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                :key="i"
                class="tw-text-[13px] tw-cursor-pointer hover:tw-bg-gray-50"
                @click="handleRowClick($event, row)">

                <td
                  class="index-cell tw-sticky tw-left-0 tw-top-0 tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                  {{ i + 1 + (currentPage - 1) * pageSize }}
                </td>

                <td
                  class="checkbox-cell tw-sticky tw-left-[50px] tw-top-0 tw-bg-pink-100 tw-z-20 tw-text-center tw-border tw-py-1">
                  <input type="checkbox" :checked="selectedRows.has(row)" @change="toggleRow(row, $event)" />
                </td>

                <td v-for="col in columns" :key="col.key"
                  class="tw-border tw-px-2 tw-py-1 tw-text-center tw-relative"
                  :class="{
                    'tw-sticky tw-right-0 tw-z-20 tw-bg-pink-100 tw-shadow-[-4px_0_6px_rgba(0,0,0,0.15)]': col.key === 'actions'
                  }"
                  :style="{ width: colWidths[col.key] + 'px' }">

                  <template v-if="col.key === 'actions'">
                    <div class="tw-flex tw-items-center tw-justify-center tw-gap-2">
                      <a-tooltip title="Xem chi tiết">
                        <EyeOutlined class="hover:tw-text-gray-600 tw-text-blue-600 tw-cursor-pointer"
                          @click.stop="$emit('view', row)" />
                      </a-tooltip>
                      <a-tooltip title="Chỉnh sửa">
                        <EditOutlined class="hover:tw-text-gray-600 tw-text-green-600 tw-cursor-pointer"
                          @click.stop="$emit('edit', row)" />
                      </a-tooltip>
                      <a-tooltip title="Xóa">
                        <DeleteOutlined class="hover:tw-text-gray-600 tw-text-red-600 tw-cursor-pointer"
                          @click.stop="$emit('delete', row)" />
                      </a-tooltip>
                    </div>
                  </template>

                  <template v-else>
                    {{ row[col.key] || '' }}
                  </template>
                </td>
              </tr>
            </template>

            <tr v-else>
              <td :colspan="columns.length + 2"
                class="tw-text-center tw-py-6 tw-text-gray-500 tw-italic tw-border">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-center tw-py-2 tw-px-3 tw-border-gray-200 tw-bg-gray-50 tw-text-xs">
        <a-select v-model:value="pageSize" :options="pageSizeOptions" class="tw-hidden sm:tw-block tw-w-[110px]"
          @change="onPageSizeChange" />
        <div
          class="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center tw-gap-2 sm:tw-gap-3 tw-w-full sm:tw-w-auto">
          <span class="tw-hidden sm:tw-inline tw-text-gray-600 tw-font-medium">
            Trang số {{ currentPage }} của {{ totalPages }} ({{ rows.length }} bản ghi)
          </span>
          <a-pagination v-model:current="currentPage" :total="rows.length" :pageSize="pageSize"
            @change="onPageChange" :showSizeChanger="false" size="small" class="tw-my-1 sm:tw-my-0" />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { Spin as ASpin, Pagination as APagination, Select as ASelect, Tooltip as ATooltip } from "ant-design-vue";

const props = defineProps({
  doctype: { type: String, required: true }
});
const emit = defineEmits(["view", "edit", "delete"]);

const loading = ref(false);
const columns = ref([]);
const rows = ref([]);

const pageSize = ref(10);
const currentPage = ref(1);
const pageSizeOptions = [
  { label: "10 / Trang", value: 10 },
  { label: "20 / Trang", value: 20 },
  { label: "50 / Trang", value: 50 },
  { label: "100 / Trang", value: 100 },
];
const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / pageSize.value)));

const colWidths = ref({});
const resizing = ref({ active: false, k: null, x: 0, w: 0 });

const selectAll = ref(false);
const selectedRows = ref(new Set());

const toggleRow = (row, e) => {
  if (e.target.checked) selectedRows.value.add(row);
  else selectedRows.value.delete(row);
};

const toggleSelectAll = () => {
  if (selectAll.value) rows.value.forEach(r => selectedRows.value.add(r));
  else selectedRows.value.clear();
};

// Column resizing
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
  resizing.value.active = false;
  document.body.style.userSelect = "";
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
};

// Scroll fade
const scrollWrapper = ref(null);
const scrollLeft = ref(0);
const scrollRight = ref(0);
const handleScroll = () => {
  const el = scrollWrapper.value;
  if (!el) return;
  scrollLeft.value = el.scrollLeft;
  scrollRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft;
};

// Pagination
const onPageChange = (p) => currentPage.value = p;
const onPageSizeChange = (s) => { pageSize.value = s; currentPage.value = 1; };



// Fetch data
async function fetchData() {
  loading.value = true;
  try {
    const meta = await frappe.get_meta(props.doctype);
    let visibleFields = meta.fields
      .filter(f => f.in_list_view)
      .map(f => ({ title: f.label || f.fieldname, key: f.fieldname }));
    // First column
    let firstCol = meta.title_field ? visibleFields.find(f => f.key === meta.title_field) : null;
    if (firstCol) visibleFields = visibleFields.filter(f => f.key !== firstCol.key);
    if (!firstCol) firstCol = { title: 'Name', key: 'name' };
    visibleFields.unshift(firstCol);
    visibleFields.push({ title: 'Actions', key: 'actions' });
    columns.value = visibleFields;

    visibleFields.forEach(f => { if (!colWidths.value[f.key]) colWidths.value[f.key] = 160; });

    const fieldNames = visibleFields.filter(f => f.key !== 'actions').map(f => f.key);
    const data = await frappe.db.get_list(props.doctype, { fields: fieldNames, limit: 50 });
    rows.value = data;
  } catch (err) { console.error(err); }
  finally { loading.value = false; }
}

onMounted(fetchData);
watch(() => props.doctype, fetchData);
</script>

<style scoped>
/* Keep previous styles for table, sticky, fade-left/right, etc. */
</style>
