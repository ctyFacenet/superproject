<template>
  <div class="tw-border tw-rounded-lg tw-p-2 tw-max-h-[70vh] tw-overflow-y-auto">
    <a-tree checkable :tree-data="treeData" v-model:checkedKeys="checkedKeys" @check="emitChange" />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { DocType } from "../utils/consts.js";

const props = defineProps({
  doctype: { type: String, required: true },
  showDateFilter: { type: Boolean, default: false },
});

const emit = defineEmits(["change"]);
const checkedKeys = ref([]);

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const years = [currentYear, currentYear - 1];

const months = Array.from({ length: 12 }, (_, i) => i + 1);

const getDaysInMonth = (year, month) => {
  if (month === 2) return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
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
        { title: "Kho Cán", key: "warehouse-rolling" },
      ];

    default:
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
  }
});

function emitChange() {
  emit("change", checkedKeys.value);
}

watchEffect(() => {
  const newNow = new Date();
  if (
    newNow.getFullYear() !== currentYear ||
    newNow.getMonth() + 1 !== currentMonth
  ) {
    recentMonths.value = Array.from({ length: 4 }, (_, i) => {
      let m = newNow.getMonth() + 1 - i;
      let y = newNow.getFullYear();
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      return { year: y, month: m };
    });
  }
});
</script>

<style scoped>
.tw-border {
  border-color: #e5e7eb;
}
</style>
