import {
  FileTextOutlined,
  SearchOutlined,
  CalendarOutlined,
  PlusOutlined,
  UnlockOutlined,
  LockOutlined,
  FileDoneOutlined,
  DeleteOutlined,
  CopyOutlined,
  FileExcelOutlined,
  EyeOutlined,
  EditOutlined,
  PictureOutlined,
  CloseOutlined
} from "@ant-design/icons-vue";

export const doctypeActions = {
  "Sale Order": {
    title: "DANH SÁCH ĐƠN HÀNG TỔNG",
    actions: [
      {
        label: "Thêm mới",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc("Sale Order"),
      },
      {
        label: "",
        icon: CopyOutlined,
        color: "#6B7280",
        hoverColor: "#9CA3AF",
        onClick: () => { },
      },
    ],
    rowActions: [
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#3B82F6",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
      {
        label: "Chỉnh sửa",
        icon: EditOutlined,
        color: "#22C55E",
        hoverColor: "#4ADE80",
        onClick: (row) => frappe.msgprint(`Chỉnh sửa ${row.name}`),
      },
      {
        label: "Xóa",
        icon: DeleteOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
      },
    ],
  },

  "Sale Order Detail": {
    title: "CHI TIẾT ĐƠN HÀNG",
    actions: [
      {
        label: "Duyệt",
        icon: LockOutlined,
        color: "#2563EB",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Đã duyệt"),
      },
      {
        label: "Huỷ duyệt",
        icon: UnlockOutlined,
        color: "#F59E0B",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Huỷ duyệt"),
      },
      {
        label: "",
        icon: CopyOutlined,
        color: "#6B7280",
        hoverColor: "#9CA3AF",
        onClick: () => { },
      },
    ],
    rowActions: [
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#3B82F6",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
      {
        label: "Chỉnh sửa",
        icon: EditOutlined,
        color: "#22C55E",
        hoverColor: "#4ADE80",
        onClick: (row) => frappe.msgprint(`Chỉnh sửa ${row.name}`),
      },
      {
        label: "Xóa",
        icon: DeleteOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
      },
    ],
  },

  "Product Order": {
    title: "ĐƠN SẢN XUẤT NỘI BỘ",
    actions: [
      {
        label: "Tạo đơn sản xuất nội bộ",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.msgprint("Tạo đơn sản xuất nội bộ"),
      },
      {
        label: "Duyệt",
        icon: FileDoneOutlined,
        color: "#2563EB",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Duyệt"),
      },
      {
        label: "Huỷ duyệt",
        icon: UnlockOutlined,
        color: "#F59E0B",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Huỷ duyệt"),
      },
      {
        label: "Tạo lệnh sản xuất",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.msgprint("Tạo lệnh sản xuất"),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "",
        icon: CopyOutlined,
        color: "#6B7280",
        hoverColor: "#9CA3AF",
        onClick: () => { },
      },
    ],
    rowActions: [
      {
        label: "Chỉnh sửa",
        icon: EditOutlined,
        color: "#22C55E",
        hoverColor: "#4ADE80",
        onClick: (row) => frappe.msgprint(`Chỉnh sửa ${row.name}`),
      },
      {
        label: "Xem hình ảnh",
        icon: PictureOutlined,
        color: "#8B5CF6",
        hoverColor: "#A78BFA",
        onClick: (row) => frappe.msgprint(`Xem hình ảnh ${row.name}`),
      },
      {
        label: "Xóa",
        icon: DeleteOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
      },
    ],
  },

  "Work Order": {
    title: "LỆNH SẢN XUẤT",
    actions: [
      {
        label: "",
        icon: CopyOutlined,
        color: "#6B7280",
        hoverColor: "#9CA3AF",
        onClick: () => { },
      },
    ],
    rowActions: [
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#3B82F6",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
      {
        label: "Xem hình ảnh",
        icon: PictureOutlined,
        color: "#8B5CF6",
        hoverColor: "#A78BFA",
        onClick: (row) => frappe.msgprint(`Xem hình ảnh ${row.name}`),
      },
      {
        label: "Xóa",
        icon: DeleteOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
      },
    ],
  },

  "Work Order Approved": {
    title: "LỆNH SẢN XUẤT ĐÃ DUYỆT",
    actions: [
      {
        label: "",
        icon: CopyOutlined,
        color: "#6B7280",
        hoverColor: "#9CA3AF",
        onClick: () => { },
      },
    ],
    rowActions: [
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#3B82F6",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
      {
        label: "Hủy duyệt",
        icon: CloseOutlined,
        color: "#F59E0B",
        hoverColor: "#FBBF24",
        onClick: (row) => frappe.msgprint(`Hủy duyệt ${row.name}`),
      },
    ],
  },

  "In Process Inventory": {
    title: "TỒN KHO ĐANG SẢN XUẤT",
    actions: [
      {
        label: "Thống kê NVL thừa",
        icon: FileTextOutlined,
        color: "#3B82F6",
        hoverColor: "#60A5FA",
        onClick: () => frappe.msgprint("Thống kê NVL thừa"),
      },
      {
        label: "Kiểm kê tồn kho",
        icon: SearchOutlined,
        color: "#22C55E",
        hoverColor: "#4ADE80",
        onClick: () => frappe.msgprint("Kiểm kê tồn kho"),
      },
      {
        label: "Chốt số cuối kỳ",
        icon: CalendarOutlined,
        color: "#F59E0B",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Chốt số cuối kỳ"),
      },
      {
        label: "",
        icon: CopyOutlined,
        onClick: () => { },
      },
    ],
  },

  "Semi Finished Products": {
    title: "BÁN THÀNH PHẨM",
    actions: [
      {
        label: "Duyệt huỷ tem",
        icon: FileDoneOutlined,
        color: "#2563EB",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Duyệt huỷ tem"),
      },
      {
        label: "Xuất Excel",
        icon: FileExcelOutlined,
        color: "#16A34A",
        hoverColor: "#4ADE80",
        onClick: () => frappe.msgprint("Đang xuất Excel..."),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "",
        icon: CopyOutlined,
        color: "#6B7280",
        hoverColor: "#9CA3AF",
        onClick: () => { },
      },
    ],
    rowActions: [
      {
        label: "Chỉnh sửa",
        icon: EditOutlined,
        color: "#22C55E",
        hoverColor: "#4ADE80",
        onClick: (row) => frappe.msgprint(`Chỉnh sửa ${row.name}`),
      },
      {
        label: "Xem hình ảnh",
        icon: PictureOutlined,
        color: "#8B5CF6",
        hoverColor: "#A78BFA",
        onClick: (row) => frappe.msgprint(`Xem hình ảnh ${row.name}`),
      },
      {
        label: "Xóa",
        icon: DeleteOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
      },
    ],
  },
};
