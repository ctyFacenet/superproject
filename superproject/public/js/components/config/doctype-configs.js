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
  CloseOutlined,
  HistoryOutlined,
} from "@ant-design/icons-vue";

const baseCopyAction = {
  label: "",
  icon: CopyOutlined,
  color: "#6B7280",
  hoverColor: "#9CA3AF",
  onClick: () => window.dispatchEvent(new CustomEvent("open-column-picker")),
};

const baseRowActions = (view = true) =>
  [
    view && {
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
  ].filter(Boolean);

export const doctypeConfigs = {
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
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },

  "Sale Order Detail": {
    title: "CHI TIẾT ĐƠN HÀNG",
    groupByField: "detailordercode",
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
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Duyệt",
        icon: PictureOutlined,
        color: "#3B82F6",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Duyệt ${row.name}`),
      },
      {
        label: "Huỷ duyệt",
        icon: LockOutlined,
        color: "#22C55E",
        hoverColor: "#4ADE80",
        onClick: (row) => frappe.msgprint(`Huỷ duyệt ${row.name}`),
      },
      {
        label: "Xem lịch sử",
        icon: HistoryOutlined,
        color: "#EF4444",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xem lịch sử ${row.name}`),
      },
    ],
  },

  "Product Order": {
    title: "ĐƠN SẢN XUẤT NỘI BỘ",
    groupByField: "itemcode",
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
      baseCopyAction,
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
        label: "Thêm mới",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc("Work Order"),
      },
      baseCopyAction,
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
        label: "Thêm mới",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc("Work Order Approved"),
      },
      baseCopyAction,
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
    groupByField: "materialgroup",
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
      baseCopyAction,
    ],
  },

  "Semi Finished Products": {
    title: "BÁN THÀNH PHẨM",
    groupByField: "lotnumber",
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
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },
  "Traceability": {
    title: "DANH SÁCH TRUY XUẤT NGUỒN GỐC SẢN PHẨM",
    hideTree: true,
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc("Traceability"),
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#3B82F6",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
    ],
  },
  "Period End Closing": {
    title: "DANH SÁCH CHỐT SỔ CUỐI KỲ",
    groupByField: "materialgroup",
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc("Period End Closing"),
      },
      baseCopyAction,
    ],
  },
  "Statistical Report": {
    title: "BÁO CÁO TỔNG QUAN ĐƠN HÀNG CHI TIẾT",
    groupByField: "detailordercode",
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusOutlined,
        color: "#0EA5E9",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc("Statistical Report"),
      },
      baseCopyAction,
    ],
  },
};

export const getDoctypeConfig = (doctype) =>
  doctypeConfigs[doctype] || {
    title: doctype?.toUpperCase() || "DANH SÁCH",
    actions: [baseCopyAction],
    rowActions: baseRowActions(),
  };
