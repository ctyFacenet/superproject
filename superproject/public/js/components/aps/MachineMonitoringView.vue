<template>
  <div class="machine-monitoring">

    <div class="mm-header">
      <div class="mm-header-row top">
        <div class="mm-left"></div>

        <div class="mm-center">
          <h3>GIÁM SÁT MÁY</h3>
        </div>

        <div class="mm-right">
          <div class="updated">
            Cập nhật: {{ lastUpdated }}
          </div>
        </div>
      </div>

      <div class="mm-header-row bottom">
        <div class="legend">
          <span class="plan">Đã được xếp lịch sản xuất</span>
          <span class="maintenance">Đã được xếp lịch bảo dưỡng</span>
          <span class="actual">Chạy thực tế</span>
        </div>
      </div>
    </div>

    <div class="time-scale">
      <button v-for="s in scales" :key="s" :class="{ active: currentScale === s }" @click="changeScale(s)">
        {{ s }}
      </button>
    </div>

    <div class="gantt-wrapper">
      <div ref="ganttEl" class="gantt-container"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";

const props = defineProps({
  listview: Object
});

const ganttEl = ref(null);
const lastUpdated = ref("");
const scales = ["Hourly", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
const currentScale = ref("Daily");

const getColumnWidth = (df) => {
  switch (df.fieldtype) {
    case "Check": return 60;
    case "Int":
    case "Float": return 80;
    case "Date": return 100;
    case "Datetime": return 140;
    case "Link": return 120;
    case "Data": return 150;
    case "Small Text": return 150;
    default: return "*";
  }
};

const buildColumnsFromListView = (listview) => {
  const columns = [
    {
      name: "index",
      label: "STT",
      width: 50,
      align: "center",
      template: task => task.index || ""
    }
  ];

  if (!listview || !Array.isArray(listview.columns)) {
    return columns;
  }

  listview.columns.forEach(col => {
    if (col.type === "Subject") {
      columns.push({
        name: "subject",
        label: col.df?.label || "ID",
        width: 160,
        template: task => task.subject || task.name || ""
      });
      return;
    }

    if (col.type === "Field" && col.df) {
      columns.push({
        name: col.df.fieldname,
        label: col.df.label || col.df.fieldname,
        width: getColumnWidth(col.df),
        template: task => task[col.df.fieldname] ?? ""
      });
    }
  });

  return columns;
};


const applyScale = (scale) => {
  switch (scale) {
    case "Hourly":
      gantt.config.scale_unit = "day";
      gantt.config.date_scale = "%d %M";
      gantt.config.subscales = [
        { unit: "hour", step: 1, date: "%H" }
      ];
      break;

    case "Daily":
      gantt.config.scale_unit = "day";
      gantt.config.date_scale = "%d %M";
      gantt.config.subscales = [];
      break;

    case "Weekly":
      gantt.config.scale_unit = "week";
      gantt.config.date_scale = "Tuần %W";
      gantt.config.subscales = [
        { unit: "day", step: 1, date: "%d" }
      ];
      break;

    case "Monthly":
      gantt.config.scale_unit = "month";
      gantt.config.date_scale = "%M %Y";
      gantt.config.subscales = [
        { unit: "week", step: 1 }
      ];
      break;

    case "Quarterly":
      gantt.config.scale_unit = "month";
      gantt.config.date_scale = "Q%q %Y";
      gantt.config.subscales = [];
      break;

    case "Yearly":
      gantt.config.scale_unit = "year";
      gantt.config.date_scale = "%Y";
      gantt.config.subscales = [];
      break;

    default:
      console.warn("Unknown scale:", scale);
      return;
  }
  gantt.render();
};


const initGantt = (columns) => {
  gantt.plugins({ tooltip: true });

  gantt.templates.tooltip_date_format =
    gantt.date.date_to_str("%H:%i %d/%m/%Y");

  gantt.templates.tooltip_text = (start, end, task) => `
    <div style="padding:6px 15px; line-height:1.6">
      <b>Lệnh sản xuất:</b><br/>
      ${task.work_order || task.text || ""}<br/><br/>
      <b>Ngày bắt đầu:</b><br/>
      ${gantt.templates.tooltip_date_format(start)}<br/>
      <b>Ngày kết thúc:</b><br/>
      ${gantt.templates.tooltip_date_format(end)}
    </div>
  `;

  gantt.config.xml_date = "%Y-%m-%d %H:%i";
  gantt.config.readonly = true;
  gantt.config.autosize = "y";
  gantt.config.row_height = 42;
  gantt.config.bar_height = 20;
  gantt.config.grid_width = 320;
  gantt.config.columns = columns;

  gantt.templates.task_class = (_, __, task) => {
    if (task.type === "plan") return "gantt-plan";
    if (task.type === "actual") return "gantt-actual";
    if (task.type === "maintenance") return "gantt-maintenance";
    return "";
  };

  applyScale(currentScale.value);
  gantt.init(ganttEl.value);
};

const loadDataFromListView = () => {
  if (!props.listview?.data) return;

  const tasks = props.listview.data.map((row, i) => ({
    id: row.name,
    index: i + 1,
    subject: row.name,
    item_code: row.item_code,
    line_group: row.line_group,
    text: row.item_code,
    work_order: row.work_order || row.item_code,
    start_date: row.start_date,
    end_date: row.end_date,
    type: "actual"
  }));

  gantt.clearAll();
  gantt.parse({ data: tasks });
};

const changeScale = (scale) => {
  currentScale.value = scale;
  applyScale(scale);
};

onMounted(() => {
  lastUpdated.value = new Date().toLocaleString("vi-VN");

  const columns = buildColumnsFromListView(props.listview);
  initGantt(columns);
  loadDataFromListView();
});

onBeforeUnmount(() => {
  gantt.clearAll();
});
</script>

<style scoped>
.machine-monitoring {
  font-family: Inter, Arial, sans-serif;
}

.mm-header {
  padding: 12px 16px;
}

.mm-header-row {
  display: flex;
  align-items: center;
}

.mm-header-row.top {
  position: relative;
  height: 36px;
}

.mm-left {
  flex: 1;
}

.mm-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.mm-center h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.mm-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.updated {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.mm-header-row.bottom {
  margin-top: 6px;
  justify-content: flex-end;
}

.legend {
  display: flex;
  align-items: center;
}

.legend span {
  margin-left: 14px;
  font-size: 13px;
  white-space: nowrap;
}

.legend span::before {
  content: "";
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 6px;
  border-radius: 50%;
}

.legend .plan::before {
  background: #ff8a34;
}

.legend .maintenance::before {
  background: #7b61ff;
}

.legend .actual::before {
  background: #1aa3e8;
}


.time-scale {
  padding: 6px 16px;
  border: 1px solid #eee;
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}

.time-scale button {
  padding: 4px 10px;
  border-right: 1px solid #eee;
}

.time-scale .active {
  color: #1677ff;
  border: 1px solid #1677ff;
}

.gantt-wrapper {
  margin: 0 15px 15px 15px;
  background: #fff;
  overflow: hidden;
}


.gantt-container {
  width: 100%;
  height: calc(100vh - 260px);
}


.gantt-plan .gantt_task_content {
  background: #ff8a34;
}

.gantt-actual .gantt_task_content {
  background: #1aa3e8;
}

.gantt-maintenance .gantt_task_content {
  background: #7b61ff;
}

:deep(.gantt_task_bg) {
  background-color: #ffffff;
  background-image: radial-gradient(circle,
      rgba(0, 0, 0, 0.12) 1px,
      transparent 1px);
  background-size: 18px 18px;
  background-position: center;
}

:deep(.gantt_task_row) {
  background: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

:deep(.gantt_task_cell) {
  border-right: 1px dashed rgba(0, 0, 0, 0.035);
}

</style>
