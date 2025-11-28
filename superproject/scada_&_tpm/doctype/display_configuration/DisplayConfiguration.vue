<template>
  <div class="tw-flex tw-items-center tw-gap-3 tw-p-3 tw-flex-wrap">
    <span class="tw-text-sm tw-font-medium">Chọn line</span>

    <a-select v-model="selectedLine" show-search allowClear placeholder="Chọn line" class="tw-w-48 sm:tw-w-56"
      @change="onLineChange">
      <a-select-option v-for="line in Object.keys(lines)" :key="line" :value="line">
        {{ line }}
      </a-select-option>
    </a-select>
  </div>

  <div class="tw-flex tw-gap-4 tw-p-4 tw-flex-col md:tw-flex-row">

    <div
      class="tw-w-full md:tw-w-64 tw-border tw-rounded-lg tw-p-3 tw-bg-white tw-flex tw-flex-col tw-order-2 md:tw-order-1">
      <div class="tw-font-bold tw-text-[16px] tw-mb-2 tw-text-center">Các thông số</div>

      <a-input v-model="search" placeholder="Tìm kiếm thuộc tính" size="small"
        class="tw-mb-3 tw-rounded-sm tw-p-2" allowClear>
        <template #suffix>
          <SearchOutlined class="tw-text-gray-400" />
        </template>
      </a-input>

      <div class="tw-space-y-1 tw-overflow-y-auto tw-flex-1">
        <div v-for="item in filteredParams" :key="item" @click="scrollToParam(item)"
          class="tw-px-3 tw-py-2 tw-rounded-sm tw-transition tw-cursor-pointer"
          :class="selectedParam === item ? 'tw-bg-blue-100 tw-text-blue-600' : 'tw-hover:bg-gray-100'">
          {{ item }}
        </div>
      </div>
    </div>

    <div
      class="tw-flex-1 tw-space-y-6 tw-h-auto md:tw-h-[85vh] tw-overflow-y-auto tw-pr-0 md:tw-pr-2 tw-order-1 md:tw-order-2">

      <div v-for="(conf, idx) in configs" :key="idx" :ref="el => (configRefs[idx] = el)" :class="[
        'tw-border tw-rounded-lg tw-p-4 tw-space-y-4 tw-transition-all tw-duration-500',
        highlightIndex === idx ? 'tw-bg-yellow-100 tw-shadow-md' : 'tw-bg-white'
      ]">
        <div class="tw-font-bold tw-text-center tw-text-[16px]">Cấu hình thông tin hiển thị</div>

        <div class="tw-flex tw-items-center tw-gap-6 tw-flex-wrap">
          <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[200px]">
            <span class="tw-text-sm tw-font-medium">Tên</span>
            <a-input v-model="conf.name" class="tw-flex-1" />
          </div>

          <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[140px]">
            <span class="tw-text-sm tw-font-medium">Đơn vị</span>
            <a-input v-model="conf.unit" class="tw-flex-1" />
          </div>

          <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[120px]">
            <span class="tw-text-sm tw-font-medium">Hàng</span>
            <a-input-number v-model:value="conf.row" class="tw-w-full" />
          </div>

          <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[120px]">
            <span class="tw-text-sm tw-font-medium">Cột</span>
            <a-input-number v-model:value="conf.col" class="tw-w-full" />
          </div>
        </div>

        <div class="tw-border tw-rounded-lg tw-p-4 tw-bg-[#fafafa]">

          <div class="tw-font-bold tw-mb-3 tw-text-center tw-text-[16px]">Cấu hình màu sắc</div>

          <div class="tw-flex tw-justify-end tw-mb-3">
            <a-select v-model="conf.applyType" placeholder="Chọn Loại hàng áp dụng" class="tw-w-56" allowClear>
              <a-select-option value="all">Tất cả</a-select-option>
              <a-select-option value="odd">Hàng lẻ</a-select-option>
              <a-select-option value="even">Hàng chẵn</a-select-option>
            </a-select>
          </div>

          <draggable v-model="conf.colorConfigs" handle=".drag-handle" item-key="id" class="tw-space-y-3">
            <template #item="{ element, index }">
              <div class="tw-flex tw-items-center tw-gap-4 tw-bg-white tw-rounded tw-border tw-p-3 tw-flex-wrap">

                <a-tooltip title="Kéo thả để thay đổi thứ tự" placement="top" color="#333">
                  <div class="drag-handle tw-w-6 tw-flex tw-justify-center tw-items-center tw-cursor-pointer">
                    <IconRenderer :icon="DragOutlined" :size="20" />
                  </div>
                </a-tooltip>

                <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[200px]">
                  <span class="tw-text-sm tw-font-medium">Từ</span>
                  <a-input v-model="element.from" class="tw-w-36">
                    <template #suffix>{{ conf.unit }}</template>
                  </a-input>
                </div>

                <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[200px]">
                  <span class="tw-text-sm tw-font-medium">Đến</span>
                  <a-input v-model="element.to" class="tw-w-36">
                    <template #suffix>{{ conf.unit }}</template>
                  </a-input>
                </div>

                <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[150px]">
                  <span class="tw-text-sm tw-font-medium">Màu sắc</span>
                  <input type="color" v-model="element.color"
                    class="tw-w-10 tw-h-9 tw-rounded tw-border tw-cursor-pointer" />
                </div>

                <div class="tw-flex tw-items-center tw-gap-2 tw-min-w-[160px]">
                  <span class="tw-text-sm tw-font-medium">Mức độ</span>
                  <a-select v-model="element.level" class="tw-w-32">
                    <a-select-option value="Rủi ro">Rủi ro</a-select-option>
                    <a-select-option value="Bình thường">Bình thường</a-select-option>
                    <a-select-option value="Nguy hiểm">Nguy hiểm</a-select-option>
                  </a-select>
                </div>

                <a-button type="text" danger @click="removeColor(conf, index)">
                  <IconRenderer :icon="DeleteOutlined" :size="18" />
                </a-button>
              </div>
            </template>
          </draggable>

          <div class="tw-flex tw-items-center tw-justify-between tw-mt-4">
            <div @click="addColor(conf)"
              class="tw-text-blue-600 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-font-medium">
              <IconRenderer :icon="PlusCircleOutlined" /> Thêm màu mới
            </div>

            <div @click="removeConfig(idx)"
              class="tw-text-red-600 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-font-medium">
              <IconRenderer :icon="DeleteOutlined" /> Xóa cấu hình
            </div>
          </div>
        </div>
        <div @click="addConfig"
          class="tw-text-blue-600 tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-font-medium tw-justify-start">
          <IconRenderer :icon="PlusCircleOutlined" />
          Thêm cấu hình mới
        </div>
      </div>

      <div class="tw-text-right tw-mt-4">
        <a-button type="primary" @click="confirmApply">Áp dụng</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import draggable from "vuedraggable";
import IconRenderer from "../../../public/js/components/IconRenderer.vue";
import { DeleteOutlined, PlusCircleOutlined, SearchOutlined, DragOutlined } from "@ant-design/icons-vue";

const props = defineProps({ listview: Object });

const lines = {
  "VT5.1": ["Tốc độ quạt", "Nhiệt sấy ra", "Nhiệt ủ ra"],
  "VT5.2": ["Tốc độ DV", "Chiều dài dây", "Nhiệt sấy vào"],
  "VT5.3": ["Nhiệt sấy vào", "Tốc độ DV", "Tốc độ quạt", "Nhiệt sấy ra"],
};

const selectedLine = ref(null);
const selectedParam = ref(null);
const highlightIndex = ref(null);

const search = ref("");
const params = ref([]);

const filteredParams = computed(() =>
  params.value.filter(p => p.toLowerCase().includes(search.value.toLowerCase()))
);

const configs = ref([]);
const configRefs = ref([]);

function onLineChange(line) {
  params.value = line ? [...lines[line]] : [];
  selectedParam.value = null;
  configs.value = [];

  configs.value = params.value.map(param => ({
    name: param,
    unit: "RPM",
    row: 1,
    col: 1,
    applyType: null,
    colorConfigs: [
      {
        id: crypto.randomUUID(),
        from: -100000,
        to: 300,
        color: "#ff0000",
        level: "Rủi ro",
      },
    ],
  }));

  nextTick(() => (configRefs.value = []));
}

async function scrollToParam(param) {
  selectedParam.value = param;

  const idx = configs.value.findIndex(c => c.name === param);
  if (idx === -1) return;

  await nextTick();
  const el = configRefs.value[idx];

  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    highlightIndex.value = idx;

    setTimeout(() => {
      if (highlightIndex.value === idx) highlightIndex.value = null;
    }, 1000);
  }
}

function addColor(conf) {
  conf.colorConfigs.push({
    id: crypto.randomUUID(),
    from: "",
    to: "",
    color: "#000000",
    level: "Bình thường",
  });
}

function addConfig() {
  configs.value.push({
    name: "",
    unit: "",
    row: 1,
    col: 1,
    applyType: null,
    colorConfigs: [],
  });
}


function removeColor(conf, index) {
  conf.colorConfigs.splice(index, 1);
}

function removeConfig(index) {
  configs.value.splice(index, 1);
}

function validateRange(conf) {
  for (let i = 0; i < conf.colorConfigs.length; i++) {
    const r = conf.colorConfigs[i];
    if (!r.from || !r.to) return `Khoảng ${i + 1}: Vui lòng nhập đầy đủ`;
    if (isNaN(+r.from) || isNaN(+r.to)) return `Khoảng ${i + 1}: Giá trị phải là số`;
    if (+r.from >= +r.to) return `Khoảng ${i + 1}: 'Từ' phải nhỏ hơn 'Đến'`;
  }
  return null;
}

function apply() {
  for (const conf of configs.value) {
    const err = validateRange(conf);
    if (err) {
      frappe.msgprint({ message: err, title: "Lỗi", indicator: "red" });
      return;
    }
  }
  frappe.msgprint({ message: "Đã áp dụng cấu hình!", title: "Thành công", indicator: "green" });
}

function confirmApply() {
  customConfirmModal({
    title: "Xác nhận lưu cấu hình",
    message: "Bạn có chắc chắn muốn lưu cấu hình?",
    note: "Thông tin dữ liệu cũ sẽ được thay đổi trong cơ sở dữ liệu",
    type: "info",
    buttons: [
      {
        text: "Hủy bỏ",
        class: "btn-secondary",
        onClick: () => { }
      },
      {
        text: "Xác nhận",
        class: "btn-primary",
        onClick: () => {
          apply();
        }
      }
    ]
  });
}
</script>
