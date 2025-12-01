<template>
  <div class="tw-space-y-4">

    <template v-if="showMachineGroupFilter">
      <div class="tw-border tw-rounded-lg tw-p-3 tw-bg-white">
        <div class="tw-font-bold tw-mb-3">Chọn nhóm máy</div>

        <a-radio-group v-model:value="selectedGroup" class="tw-flex tw-flex-col tw-gap-2">
          <a-radio value="CAN">CAN</a-radio>
          <a-radio value="KDAI">KDAI</a-radio>
          <a-radio value="KTIEU">KTIEU</a-radio>
          <a-radio value="KTRUNG">KTRUNG</a-radio>
          <a-radio value="MAHZ">MAHZ</a-radio>
          <a-radio value="MALH">MALH</a-radio>
          <a-radio value="MAVT">MAVT</a-radio>
        </a-radio-group>
      </div>

      <div class="tw-border tw-rounded-lg tw-p-3 tw-bg-white">
        <div class="tw-font-bold tw-mb-3">Ngày bắt đầu - kết thúc</div>

        <a-range-picker v-model:value="dateRange" class="tw-w-full tw-mb-3" :placeholder="['Từ ngày', 'Đến ngày']" />
      </div>

    </template>

    <div class="tw-border tw-rounded-lg tw-p-2 tw-max-h-[70vh] tw-overflow-y-auto tw-bg-white">
      <a-tree checkable :tree-data="treeData" v-model:checkedKeys="checkedKeys" @check="emitChange" />
    </div>

  </div>
</template>


<script setup>
import { ref, computed } from "vue";
import { DocType } from "../utils/consts.js";

const selectedGroup = ref("CAN");
const dateRange = ref(null);

const props = defineProps({
  doctype: { type: String, required: true },
  showDateFilter: { type: Boolean, default: false },
});

const showMachineGroupFilter = computed(() => props.doctype === DocType.SCADA_STATISTICAL_REPORT);

const emit = defineEmits(["change", "update:filters"]);
const checkedKeys = ref([]);

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const years = [currentYear, currentYear - 1];
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const getDaysInMonth = (year, month) => {
  if (month === 2)
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const recentMonths = computed(() => {
  return Array.from({ length: 4 }, (_, i) => {
    let m = currentMonth - i;
    let y = currentYear;
    if (m <= 0) {
      m += 12;
      y -= 1;
    }
    return { year: y, month: m };
  });
});


const defaultTreeFilter = computed(() => {
  return years.map((year) => ({
    title: `Năm ${year}`,
    key: `year-${year}`,
    children: months.map((m) => ({
      title: `Tháng ${m}`,
      key: `month-${year}-${m}`,
      children: props.showDateFilter
        ? Array.from({ length: getDaysInMonth(year, m) }, (_, d) => ({
          title: `Ngày ${d + 1}`,
          key: `day-${year}-${m}-${d + 1}`,
        }))
        : undefined,
    })),
  }));
});

const treeData = computed(() => {
  switch (props.doctype) {
    case DocType.PRODUCT_ORDER:
      const groupedByYearPO = recentMonths.value.reduce((acc, { year, month }) => {
        acc[year] = acc[year] || [];
        acc[year].push({
          title: `Tháng ${month}`,
          key: `month-${year}-${month}`,
          children: [
            { title: "ĐSX nội bộ", key: `internal-production-${year}-${month}` },
            { title: "ĐSX kinh doanh", key: `business-production-${year}-${month}` },
          ],
        });
        return acc;
      }, {});
      return Object.entries(groupedByYearPO).map(([year, months]) => ({
        title: `Năm ${year}`,
        key: `year-${year}`,
        children: months,
      }));

    case DocType.SEMI_FINISHED_PRODUCTS:
      const groupedByYearSF = recentMonths.value.reduce((acc, { year, month }) => {
        acc[year] = acc[year] || [];
        acc[year].push({
          title: `Tháng ${month}`,
          key: `month-${year}-${month}`,
          children: [
            { title: "MALH", key: `malh-${year}-${month}` },
            { title: "MAHZ", key: `mahz-${year}-${month}` },
            { title: "Kéo trung", key: `ktrung-${year}-${month}` },
            { title: "Kéo đại", key: `kdai-${year}-${month}` },
            { title: "Cán", key: `can-${year}-${month}` },
          ],
        });
        return acc;
      }, {});
      return Object.entries(groupedByYearSF).map(([year, months]) => ({
        title: `Năm ${year}`,
        key: `year-${year}`,
        children: months,
      }));

    case DocType.IN_PROCESS_INVENTORY:
      return [
        { title: "Kho tráng đứng", key: "warehouse-coating-vertical" },
        { title: "Kho mạ LH", key: "warehouse-plating-lh" },
        { title: "Kho mạ HZ", key: "warehouse-plating-hz" },
        { title: "Kho kéo trung", key: "warehouse-drawing-medium" },
        { title: "Kho kéo tiểu", key: "warehouse-drawing-small" },
        { title: "Kho kéo đại", key: "warehouse-drawing-large" },
        { title: "Kho cán", key: "warehouse-rolling" },
      ];

    case DocType.SCADA_STATISTICAL_REPORT:
      return defaultTreeFilter.value;

    default:
      return defaultTreeFilter.value;
  }
});

function emitChange() {
  emit("update:filters", {
    treeKeys: checkedKeys.value,
    group: selectedGroup.value,
    dateRange: dateRange.value,
  });

  emit("change", checkedKeys.value);
}
</script>


<style scoped>
.tw-border {
  border-color: #e5e7eb;
}
</style>
