import {
  FileTextOutlined,
  CalendarOutlined,
  UnlockOutlined,
  LockOutlined,
  FileDoneOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  EyeOutlined,
  EditOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  ImportOutlined,
  SwitcherOutlined,
  BarChartOutlined,
  MonitorOutlined
} from "@ant-design/icons-vue";
import { DocType } from "../../utils/consts.js";

const baseCopyAction = {
  label: "",
  icon: SwitcherOutlined,
  color: "#01aba8",
  hoverColor: "#9CA3AF",
  onClick: () => window.dispatchEvent(
    new CustomEvent("open-column-picker", { detail: { doctype: frappe.get_route()[1] } })
  )
};

const baseRowActions = (view = true) =>
  [
    view && {
      label: "Xem chi tiết",
      icon: EyeOutlined,
      color: "#01ABA8",
      hoverColor: "#60A5FA",
      onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
    },
    {
      label: "Chỉnh sửa",
      icon: EditOutlined,
      color: "#01ABA8",
      hoverColor: "#4ADE80",
      onClick: (row) => frappe.msgprint(`Chỉnh sửa ${row.name}`),
    },
    {
      label: "Xóa",
      icon: DeleteOutlined,
      color: "#01ABA8",
      hoverColor: "#F87171",
      onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
    },
  ].filter(Boolean);

export const doctypeConfigs = {
  [DocType.SALE_ORDER]: {
    title: "DANH SÁCH ĐƠN HÀNG TỔNG",
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.SALE_ORDER),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },

  [DocType.SALE_ORDER_DETAIL]: {
    title: "CHI TIẾT ĐƠN HÀNG",
    groupByField: "detailordercode",
    actions: [
      {
        label: "Duyệt",
        icon: LockOutlined,
        color: "#00aeee",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Đã duyệt"),
      },
      {
        label: "Huỷ duyệt",
        icon: UnlockOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Huỷ duyệt"),
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Duyệt",
        icon: FileDoneOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Duyệt ${row.name}`),
      },
      {
        label: "Huỷ duyệt",
        icon: UnlockOutlined,
        color: "#01ABA8",
        hoverColor: "#4ADE80",
        onClick: (row) => frappe.msgprint(`Huỷ duyệt ${row.name}`),
      },
      {
        label: "Xem lịch sử",
        icon: HistoryOutlined,
        color: "#01ABA8",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xem lịch sử ${row.name}`),
      },
    ],
  },

  [DocType.PRODUCT_ORDER]: {
    title: "ĐƠN SẢN XUẤT NỘI BỘ",
    groupByField: "itemcode",
    actions: [
      {
        label: "Tạo đơn sản xuất nội bộ",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.msgprint("Tạo đơn sản xuất nội bộ"),
      },
      {
        label: "Duyệt",
        icon: FileDoneOutlined,
        color: "#00aeee",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Duyệt"),
      },
      {
        label: "Huỷ duyệt",
        icon: UnlockOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Huỷ duyệt"),
      },
      {
        label: "Tạo lệnh sản xuất",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.msgprint("Tạo lệnh sản xuất"),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#F87171",
        onClick: () => frappe.msgprint("Xoá"),
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Chỉnh sửa BOM",
        icon: EditOutlined,
        color: "#01ABA8",
        hoverColor: "#4ADE80",
        onClick: (row) => frappe.msgprint(`Chỉnh sửa ${row.name}`),
      },
      {
        label: "Duyệt",
        icon: FileDoneOutlined,
        color: "#01ABA8",
        hoverColor: "#A78BFA",
        onClick: (row) => frappe.msgprint(`Duyệt ${row.name}`),
      },
      {
        label: "Tạo lệnh sản xuất",
        icon: PlusCircleOutlined,
        color: "#01ABA8",
        hoverColor: "#A78BFA",
        onClick: (row) => frappe.msgprint(`Tạo lệnh sản xuất ${row.name}`),
      },
      {
        label: "Xóa",
        icon: DeleteOutlined,
        color: "#01ABA8",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
      },
    ],
  },

  [DocType.WORK_ORDER]: {
    title: "LỆNH SẢN XUẤT",
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.WORK_ORDER),
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Xem kế hoạch sản xuất",
        icon: EyeOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
      {
        label: "Lập kế hoạch sản xuất",
        icon: BarChartOutlined,
        color: "#01ABA8",
        hoverColor: "#A78BFA",
        onClick: (row) => frappe.msgprint(`Lập kế hoạch sản xuất ${row.name}`),
      },
      {
        label: "Phê duyệt",
        icon: FileDoneOutlined,
        color: "#01ABA8",
        hoverColor: "#A78BFA",
        onClick: (row) => frappe.msgprint(`Phê duyệt ${row.name}`),
      },
      {
        label: "Xóa",
        icon: DeleteOutlined,
        color: "#01ABA8",
        hoverColor: "#F87171",
        onClick: (row) => frappe.msgprint(`Xóa ${row.name}`),
      },
    ],
  },

  [DocType.WORK_ORDER_APPROVED]: {
    title: "LỆNH SẢN XUẤT ĐÃ DUYỆT",
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.WORK_ORDER_APPROVED),
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
      {
        label: "Hủy duyệt",
        icon: CloseCircleOutlined,
        color: "#01ABA8",
        hoverColor: "#FBBF24",
        onClick: (row) => frappe.msgprint(`Hủy duyệt ${row.name}`),
      },
    ],
  },

  [DocType.IN_PROCESS_INVENTORY]: {
    title: "TỒN KHO ĐANG SẢN XUẤT",
    groupByField: "materialgroup",
    actions: [
      {
        label: "Thống kê NVL thừa",
        icon: FileTextOutlined,
        color: "#00aeee",
        hoverColor: "#60A5FA",
        onClick: () => frappe.msgprint("Thống kê NVL thừa"),
      },
      {
        label: "Kiểm kê tồn kho",
        icon: MonitorOutlined,
        color: "#00aeee",
        hoverColor: "#4ADE80",
        onClick: () => frappe.msgprint("Kiểm kê tồn kho"),
      },
      {
        label: "Chốt số cuối kỳ",
        icon: CalendarOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Chốt số cuối kỳ"),
      },
      baseCopyAction,
    ],
  },

  [DocType.SEMI_FINISHED_PRODUCTS]: {
    title: "BÁN THÀNH PHẨM",
    groupByField: "lotnumber",
    actions: [
      {
        label: "Duyệt huỷ tem",
        icon: FileDoneOutlined,
        color: "#00aeee",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Duyệt huỷ tem"),
      },
      {
        label: "Xuất Excel",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#4ADE80",
        onClick: () => frappe.msgprint("Đang xuất Excel..."),
      },
      {
        label: "Import Excel",
        icon: ImportOutlined,
        color: "#00aeee",
        hoverColor: "#4ADE80",
        onClick: () => frappe.msgprint("Đang nhập Excel..."),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#F87171",
        onClick: () => frappe.msgprint("Xoá"),
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Duyệt huỷ tem",
        icon: FileDoneOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Duyệt huỷ tem ${row.name}`),
      },
      {
        label: "In lại tem",
        icon: PrinterOutlined,
        color: "#01ABA8",
        hoverColor: "#FBBF24",
        onClick: (row) => frappe.msgprint(`In lại tem ${row.name}`),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#01ABA8",
        hoverColor: "#FBBF24",
        onClick: (row) => frappe.msgprint(`Xoá ${row.name}`),
      },
    ],
  },
  [DocType.TRACEABILITY]: {
    title: "DANH SÁCH TRUY XUẤT NGUỒN GỐC SẢN PHẨM",
    hideTree: true,
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.TRACEABILITY),
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
    ],
  },
  [DocType.PERIOD_END_CLOSING]: {
    title: "DANH SÁCH CHỐT SỔ CUỐI KỲ",
    groupByField: "materialgroup",
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.PERIOD_END_CLOSING),
      },
      baseCopyAction,
    ],
  },
  [DocType.STATISTICAL_REPORT]: {
    title: "BÁO CÁO TỔNG QUAN ĐƠN HÀNG CHI TIẾT",
    groupByField: "detailordercode",
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.STATISTICAL_REPORT),
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
