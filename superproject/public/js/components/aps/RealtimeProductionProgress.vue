<template>
  <div class="tw-p-4 tw-bg-white tw-rounded-lg tw-shadow-sm tw-text-[14px] tw-w-full tw-h-full">

    <div class="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-center tw-mb-3 tw-gap-2">
      <h2 class="tw-text-[18px] sm:tw-text-[20px] tw-font-bold tw-text-center tw-flex-1">
        TIẾN ĐỘ SẢN XUẤT THEO THỜI GIAN THỰC
      </h2>
    </div>

    <div class="tw-text-center sm:tw-text-right tw-text-gray-600 mb-2">
      Thời điểm cập nhật mới nhất: <b>{{ lastUpdated }}</b>
    </div>

    <div
      class="tw-flex tw-flex-wrap tw-gap-x-6 tw-gap-y-2 tw-mb-4 tw-font-medium tw-justify-center sm:tw-justify-start">
      <LegendDot color="#f6b3b3" label="Chậm" :count="legend.delayed" />
      <LegendDot color="#a4e2a4" label="Bình thường" :count="legend.normal" />
      <LegendDot color="#f5e79e" label="Chưa hoàn thành" :count="legend.incomplete" />
      <LegendDot color="#6bd16b" label="Hoàn thành" :count="legend.completed" />
      <LegendDot color="#ff9f40" label="Vượt mức" :count="legend.overrun" />
    </div>

    <div class="tw-overflow-x-auto tw-max-w-full">
      <table class="tw-w-full tw-border-collapse tw-text-[12px] sm:tw-text-[14px] tw-text-gray-700 min-w-[900px]">
        <thead>
          <tr class="tw-bg-blue-100 tw-text-gray-800 tw-font-semibold">
            <th class="th">STT</th>
            <th class="th" v-for="f in visibleFields" :key="f.fieldname">
              {{ f.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, i) in rows" :key="row.name" class="hover:tw-bg-gray-100 tw-transition"
            :style="{ backgroundColor: row.__row_color }">
            <td class="td text-center">{{ i + 1 }}</td>

            <td class="td text-center" v-for="f in visibleFields" :key="f.fieldname">
              <template v-if="f.fieldname === 'line_status'">
                <span class="status-badge" :class="getLineStatusClass(row[f.fieldname])">
                  {{ row[f.fieldname] }}
                </span>
              </template>

              <template v-else>
                {{ row[f.fieldname] }}
              </template>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td :colspan="visibleFields.length + 1" class="tw-text-center tw-py-6 tw-text-gray-500">
              Không có dữ liệu để hiển thị.
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { h } from "vue";

const LegendDot = {
  name: "LegendDot",
  props: { color: String, label: String, count: Number },
  render() {
    return h("div", { class: "tw-flex tw-items-center tw-gap-2" }, [
      h("span", {
        class: "tw-w-4 tw-h-4 tw-rounded-full",
        style: { background: this.color }
      }),
      h("span", {}, `${this.label}: ${this.count}`)
    ]);
  }
};

const visibleFields = ref([]);
const rows = ref([]);

const legend = ref({
  delayed: 0,
  normal: 0,
  incomplete: 0,
  completed: 0,
  overrun: 0,
});

const COLORS = {
  delayed: "#f6b3b3",
  incomplete: "#f5e79e",
  normal: "#a4e2a4",
  completed: "#6bd16b",
  overrun: "#ff9f40",
};

const lastUpdated = computed(() => {
  const now = new Date();
  return now.toLocaleTimeString() + " " + now.toLocaleDateString();
});

function getLineStatusClass(status) {
  if (!status) return "badge-default";

  const s = status.toLowerCase();
  if (["đang chạy", "running"].includes(s)) return "badge-running";
  if (["tạm dừng", "paused"].includes(s)) return "badge-paused";
  if (["dừng", "stopped"].includes(s)) return "badge-stopped";

  return "badge-default";
}

async function fetchData() {
  const res = await frappe.call({
    method:
      "superproject.aps.doctype.realtime_production_progress.realtime_production_progress.get_realtime_progress",
  });

  const raw = res.message.rows || [];
  visibleFields.value = res.message.fields || [];

  rows.value = raw.map((r) => {
    const plan = Number(r.planned_qty || 0);
    const done = Number(r.completed_qty || 0);
    const ratio = plan ? (done / plan) * 100 : 0;

    r.completion_rate = ratio.toFixed(2) + "%";

    const status =
      ratio >= 110 ? "overrun" :
        ratio >= 100 ? "completed" :
          ratio >= 80 ? "normal" :
            ratio >= 30 ? "incomplete" :
              "delayed";

    r.__status = status;
    r.__row_color = COLORS[status];

    return r;
  });

  legend.value = {
    delayed: rows.value.filter(x => x.__status === "delayed").length,
    normal: rows.value.filter(x => x.__status === "normal").length,
    incomplete: rows.value.filter(x => x.__status === "incomplete").length,
    completed: rows.value.filter(x => x.__status === "completed").length,
    overrun: rows.value.filter(x => x.__status === "overrun").length,
  };
}

fetchData();
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

.th,
.td {
  padding: 8px;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
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

.status-badge {
  padding: 6px 20px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid transparent;
}

.badge-running {
  background: #d1f7d1;
  border-color: #27ae60;
  color: #0e7a2f;
}

.badge-paused {
  background: #fff3c4;
  border-color: #f1c40f;
  color: #b8860b;
}

.badge-stopped {
  background: #f8d0d0;
  border-color: #e74c3c;
  color: #b71c1c;
}

.badge-default {
  background: #e5e7eb;
  border-color: #9ca3af;
  color: #374151;
}
</style>
