// src/utils/chart-data.js

//Report APS
export const barChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    {
      label: "Số lượng hàng hóa yêu cầu",
      data: [6394, 6683, 7321, 5257, 6981, 7023, 7122, 1835],
      backgroundColor: "rgba(99, 102, 241, 0.6)",
      borderColor: "rgba(99, 102, 241, 1)",
      borderWidth: 1,
    },
    {
      label: "Số lượng hàng hóa trung bình",
      data: new Array(8).fill(6400),
      type: "line",
      borderColor: "red",
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
  ],
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { font: { size: 13 }, boxWidth: 10, boxHeight: 10 },
    },
    tooltip: { enabled: true },
    title: {
      display: true,
      text: `Biểu đồ số lượng hàng hóa yêu cầu theo tháng`,
      font: { size: 14, weight: "bold" },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: 8000,
      ticks: { stepSize: 1600 },
    },
  },
};

export const donutChartData1 = {
  datasets: [
    {
      data: [8740.16, 8616.67, 8213.12, 5237.25, 4314.73],
      backgroundColor: ["#6366f1", "#f87171", "#22c55e", "#a855f7", "#fbbf24"],
    },
  ],
};

export const donutChartData2 = {
  labels: ["EIAI_BT", "PEW", "2U", "EIAI_KPA", "Khác"],
  datasets: [
    {
      data: [3392.88, 6273.93, 2111.86, 2282.14, 2433.93],
      backgroundColor: ["#6366f1", "#f87171", "#22c55e", "#a855f7", "#fbbf24"],
    },
  ],
};

export const donutChartOptions = (monthLabel) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 5,
        boxHeight: 5,
        font: { size: 10 },
      },
    },
    title: {
      display: true,
      text: `Biểu đồ so sánh tỷ lệ nhóm hàng được đặt\n${monthLabel}`,
      font: { size: 14, weight: "bold" },
    },
    datalabels: { display: false },
    tooltip: {
      callbacks: {
        label(context) {
          const dataset = context.dataset;
          const value = dataset.data[context.dataIndex];
          const total = dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return `${value} (${percentage})`;
        },
      },
    },
  },
  cutout: "45%",
  radius: "60%",
});

//Report SCADA & TPM
export const scadaBarData = {
  labels: [
    "2024",
    "2025",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      type: "bar",
      label: "Hiệu suất thiết bị",
      data: [0, 14376, 0, 20739, 0, 0, 15739, 0, 0, 16999, 0, 0, 0, 24739],
      backgroundColor: "#7EB2FF",
      borderRadius: 1,
      barPercentage: 0.6,
    },
    {
      type: "line",
      label: "Mục tiêu",
      data: new Array(14).fill(0),
      borderColor: "#ff4d4f",
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 3,
    },
  ],
};

export const scadaBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ hiệu suất thiết bị",
      font: { size: 14, weight: "bold" },
      color: "#333",
    },
    legend: { position: "bottom" },
    datalabels: {
      color: "#333",
      anchor: "end",
      align: "top",
      formatter: (v) => (v ? v.toLocaleString() : ""),
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (v) => v.toLocaleString() + " %",
      },
    },
  },
};

export const scadaDonutData = {
  labels: ["CAN", "KDAI", "KTIEU", "KTRUNG", "MAHZ", "MALH", "MAVT"],
  datasets: [
    {
      data: [10, 5, 8, 12, 4, 6, 3],
      backgroundColor: [
        "#4E79A7", // CAN
        "#F28E2B", // KDAI
        "#E15759", // KTIEU
        "#76B7B2", // KTRUNG
        "#59A14F", // MAHZ
        "#EDC948", // MALH
        "#B07AA1", // MAVT
      ],
      borderColor: "#fff",
      borderWidth: 1,
    },
  ],
};

export const scadaDonutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%",
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ nguyên nhân dừng máy",
      font: { size: 14, weight: "bold" },
      color: "#333",
    },
    legend: { position: "bottom" },
    datalabels: { display: false },
  },
};

//Report QMS
export const defectRateData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Sản xuất",
      data: [0, 1.1, 3.3, 0, 0, 5.5, 0, 0, 0, 6.5, 7.2, 0],
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      borderWidth: 2,
      pointRadius: 4,
      tension: 0,
    },
    {
      label: "Thị trường",
      data: new Array(12).fill(0),
      borderColor: "#22c55e",
      backgroundColor: "#22c55e",
      borderWidth: 2,
      pointRadius: 3,
      tension: 0,
    },
  ],
};

export const defectRateOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 10,
        boxHeight: 10,
        font: { size: 12 },
      },
    },
    title: {
      display: true,
      text: "Biểu đồ tỉ lệ phế",
      font: { size: 15, weight: "bold" },
    },
    datalabels: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(ctx) {
          return `${ctx.dataset.label}: ${ctx.raw}%`;
        },
      },
    },
  },
  scales: {
    y: {
      min: 0,
      max: 8,
      ticks: {
        callback: (v) => v + " %",
      },
    },
  },
};

export const errorDonutData = {
  labels: [
    "Ngoại quan (phôi xước)",
    "Lỗi lỗ kim",
    "Ngoại quan (hai màu do nhiệt nổi hơi)",
    "Lỗi sổ dây do thanh gạt",
  ],
  datasets: [
    {
      data: [320, 680, 380, 148],
      backgroundColor: ["#4e73df", "#1cc88a", "#f6c23e", "#e74a3b"],
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};

export const errorDonutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "55%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 10,
        boxHeight: 10,
        font: { size: 12 },
      },
    },
    title: {
      display: true,
      text: "Biểu đồ số lượng hàng bị lỗi theo loại lỗi",
      font: { size: 15, weight: "bold" },
    },
    datalabels: { display: false },
    tooltip: {
      callbacks: {
        label(ctx) {
          const value = ctx.raw;
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          return `${value} (${((value / total) * 100).toFixed(2)}%)`;
        },
      },
    },
  },
};
