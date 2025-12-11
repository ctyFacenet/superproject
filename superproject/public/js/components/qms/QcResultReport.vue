<template>
  <div class="tw-w-full tw-mx-auto tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-items-start">

    <div class="tw-border tw-rounded-sm tw-bg-white tw-shadow">
      <BaseChart type="line" :data="passRateData" :options="passRateOptions" />
    </div>

    <div class="tw-border tw-rounded-sm tw-bg-white tw-shadow tw-overflow-hidden">
      <table class="tw-w-full tw-text-sm tw-border-collapse">
        <thead class="tw-bg-blue-100 tw-text-gray-700 tw-font-semibold">
          <tr>
            <th class="th">STT</th>
            <th class="th">Đầu mục</th>
            <th class="th">Số lượng bobbin</th>
            <th class="th">Tỷ lệ (%)</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, i) in tableRows" :key="i">
            <td class="td">{{ i + 1 }}</td>
            <td class="td">{{ row.label }}</td>
            <td class="td">{{ row.qty }}</td>
            <td class="td">{{ row.percent }}</td>
          </tr>

          <tr class="total-row">
            <td class="td">{{ tableRows.length + 1 }}</td>
            <td class="td">Total</td>
            <td class="td">{{ totalQty }}</td>
            <td class="td"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import BaseChart from "../BaseChart.vue";
import { passRateData, passRateOptions } from "../../utils/chart-data.js";

const tableRows = [
  { label: "BTP đã QC", qty: 35, percent: "100.00" },
  { label: "BTP chưa QC", qty: 0, percent: "0.00" },
  { label: "BTP QC PASS", qty: 30, percent: "85.71" },
  { label: "BTP QC FAIL", qty: 5, percent: "14.29" },
];

const totalQty = tableRows.reduce((a, b) => a + b.qty, 0);
</script>

<style>
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}

th.th {
  @apply tw-bg-blue-50 tw-text-gray-700 tw-font-semibold tw-text-sm;
  padding: 12px 14px !important;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  text-align: center;
}

th.th:last-child {
  border-right: none;
}

td.td {
  @apply tw-text-gray-700 tw-text-sm;
  padding: 14px 14px !important;
  border-right: 1px solid #e5e7eb;
  text-align: center;
}

td.td:last-child {
  border-right: none;
}

tr:nth-child(even) td {
  background-color: #f9fafb;
}

tr.total-row td {
  @apply tw-font-bold;
  background-color: #f3f4f6;
}
</style>
