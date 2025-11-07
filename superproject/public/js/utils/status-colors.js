// src/utils/status-colors.js

const colorMap = {
  purple: "background-color: #a855f7; color: #ffffff;", // purple-500
  blue: "background-color: #3b82f6; color: #ffffff;",   // blue-500
  orange: "background-color: #fb923c; color: #ffffff;", // orange-400
  yellow: "background-color: #facc15; color: #ffffff;", // yellow-400
  green: "background-color: #22c55e; color: #ffffff;",  // green-500
  gray: "background-color: #d1d5db; color: #1f2937;",   // gray-300 / gray-800
  red: "background-color: #ef4444; color: #ffffff;",    // red-500
  neutral: "background-color: #6b7280; color: #ffffff;", // gray-500 
  pink: "background-color: #ec4899; color: #ffffff;",   // pink-500
};

export const statusColors = {
  "Chờ sản xuất": colorMap.purple,
  "Đã tạo lệnh sản xuất": colorMap.purple,
  "Đang sản xuất": colorMap.blue,
  "Đã tạo 1 phần lệnh sản xuất": colorMap.blue,
  "Sử dụng hàng tồn kho": colorMap.blue,
  "Đã duyệt": colorMap.orange,
  "Chờ tạo lệnh sản xuất": colorMap.orange,
  "Tạm dừng sản xuất": colorMap.yellow,
  "Kết thúc sản xuất": colorMap.green,
  "Đã hoàn thành": colorMap.green,
  "Hoàn thành": colorMap.green,
  "Đang hoàn thành": colorMap.green,
  "Bản nháp": colorMap.gray,
  "Đã huỷ": colorMap.red,
  "Bình thường": colorMap.neutral,
  "Chờ hủy": colorMap.pink,
  "Hủy do QC": colorMap.red,
};
