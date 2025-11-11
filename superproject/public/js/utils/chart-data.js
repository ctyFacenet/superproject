// src/utils/chart-data.js

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
