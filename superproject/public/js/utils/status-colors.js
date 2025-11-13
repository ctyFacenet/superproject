// src/utils/status-colors.js

export const colorMap = {
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


export const statusColor = [
  { text: "Chờ sản xuất", color: "#a855f7", map: "purple" },
  { text: "Đang sản xuất", color: "#2563eb", map: "blue" },
  { text: "Tạm dừng sản xuất", color: "#facc15", map: "yellow" },
  { text: "Kết thúc sản xuất", color: "#22c55e", map: "green" },
  { text: "Đã huỷ", color: "#ef4444", map: "red" },
];