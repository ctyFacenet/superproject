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
  MonitorOutlined,
  FormOutlined,
  CopyOutlined,
  DownloadOutlined
} from "@ant-design/icons-vue";
import { DocType } from "../../utils/consts.js";

const baseCopyAction = {
  label: "",
  icon: SwitcherOutlined,
  color: "#01aba8",
  hoverColor: "#9CA3AF",
  onClick: () =>
    window.dispatchEvent(
      new CustomEvent("open-column-picker", { detail: { doctype: frappe.get_route()[1] } }),
    ),
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
  //Module APS
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
  [DocType.DETAILED_ORDER_OVERVIEW_REPORT]: {
    title: "BÁO CÁO TỔNG QUAN ĐƠN HÀNG CHI TIẾT",
    groupByField: "detailordercode",
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.DETAILED_ORDER_OVERVIEW_REPORT),
      },
      baseCopyAction,
    ],
  },

  // Module SCADA & TPM
  [DocType.MAINTENANCE_PLANNING]: {
    title: "Kế hoạch bảo dưỡng máy móc",
    groupByField: "machinegroup",
    enableCollapse: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.MAINTENANCE_PLANNING),
      },
      {
        label: "Xem lịch bảo dưỡng",
        icon: CalendarOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => {
          frappe.msgprint("Xem lịch bảo dưỡng");
        },
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => { },
      },
      baseCopyAction,
    ],
    rowActions: [
      {
        label: "Thêm nhật trình bảo dưỡng",
        icon: PlusCircleOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: () => frappe.new_doc(DocType.MAINTENANCE_LOG),
      },
      {
        label: "Xem chi tiết",
        icon: EyeOutlined,
        color: "#01ABA8",
        hoverColor: "#FBBF24",
        onClick: () => { },
      },
      {
        label: "Chỉnh sửa",
        icon: EditOutlined,
        color: "#01ABA8",
        hoverColor: "#FBBF24",
        onClick: () => { },
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#01ABA8",
        hoverColor: "#FBBF24",
        onClick: () => { },
      },
    ],
  },
  [DocType.MAINTENANCE_LOG]: {
    title: "Nhật trình bảo dưỡng máy móc",
    groupByField: "machinegroup",
    enableCollapse: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.MAINTENANCE_LOG),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => { },
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },
  [DocType.SCADA_STATISTICAL_REPORT]: {
    title: "BÁO CÁO CHI TIẾT TRẠNG THÁI MÁY - NHÓM LINE",
    hideSelect: true,
    groupByField: "processcode",
    hideSearchFullText: true,
  },

  //Module MDM
  [DocType.BOM_MANAGEMENT]: {
    title: "Quản lý BOM",
    hideSelect: true,
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.BOM_MANAGEMENT),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },
  [DocType.MACHINE_GROUP]: {
    title: "NHÓM MÁY",
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.LINE_GROUP),
      },
      {
        label: "Sao chép",
        icon: CopyOutlined,
        color: "#00aeee",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Sao chép"),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "Import file",
        icon: ImportOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Đang import file..."),
      },
      {
        label: "Xuất Excel",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel..."),
      },
      {
        label: "Xuất Excel tất cả",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel tất cả..."),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },
  [DocType.LINE_GROUP]: {
    title: "NHÓM LINE",
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.LINE_GROUP),
      },
      {
        label: "Sao chép",
        icon: CopyOutlined,
        color: "#00aeee",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Sao chép"),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "Import file",
        icon: ImportOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Đang import file..."),
      },
      {
        label: "Xuất Excel",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel..."),
      },
      {
        label: "Xuất Excel tất cả",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel tất cả..."),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },
  [DocType.MAINTENANCE_LOCATION]: {
    title: "VỊ TRÍ BẢO DƯỠNG",
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.MAINTENANCE_LOCATION),
      },
      {
        label: "Sao chép",
        icon: CopyOutlined,
        color: "#00aeee",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Sao chép"),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "Import file",
        icon: ImportOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Đang import file..."),
      },
      {
        label: "Xuất Excel",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel..."),
      },
      {
        label: "Xuất Excel tất cả",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel tất cả..."),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },
  [DocType.DOWNTIME_REASON]: {
    title: "LÝ DO DỪNG MÁY",
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.DOWNTIME_REASON),
      },
      {
        label: "Sao chép",
        icon: CopyOutlined,
        color: "#00aeee",
        hoverColor: "#3B82F6",
        onClick: () => frappe.msgprint("Sao chép"),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "Import file",
        icon: ImportOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Đang import file..."),
      },
      {
        label: "Xuất Excel",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel..."),
      },
      {
        label: "Xuất Excel tất cả",
        icon: FileExcelOutlined,
        color: "#00aeee",
        hoverColor: "#FBBF24",
        onClick: () => frappe.msgprint("Xuất Excel tất cả..."),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },

  //Module QMS
  [DocType.IQC_FORM]: {
    title: "DANH SÁCH BIỂU MẪU IQC",
    hideSelect: true,
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.IQC_FORM),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(false),
  },
  [DocType.PQC_FORM]: {
    title: "DANH SÁCH BIỂU MẪU PQC",
    hideSelect: true,
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.PQC_FORM),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(false),
  },
  [DocType.OQC_FORM]: {
    title: "DANH SÁCH BIỂU MẪU OQC",
    hideSelect: true,
    hideTree: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.OQC_FORM),
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(false),
  },

  [DocType.IQC_REQUEST]: {
    title: "DANH SÁCH YÊU CẦU IQC",
    hideSelect: true,
    actions: [
      {
        label: "Thêm mới",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => frappe.new_doc(DocType.IQC_REQUEST),
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
        label: "Sửa",
        icon: EditOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Sửa ${row.name}`),
      },
      {
        label: "Khai báo QC",
        icon: FormOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Khai báo QC ${row.name}`),
      },
    ],
  },
  [DocType.PQC_REQUEST]: {
    title: "DANH SÁCH YÊU CẦU PQC",
    hideSelect: true,
    groupByField: "productionordercode",
    actions: [baseCopyAction],
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
  [DocType.OQC_REQUEST]: {
    title: "DANH SÁCH YÊU CẦU OQC",
    hideSelect: true,
    actions: [baseCopyAction],
    rowActions: [
      {
        label: "Khai báo QC",
        icon: FormOutlined,
        color: "#01ABA8",
        hoverColor: "#60A5FA",
        onClick: (row) => frappe.msgprint(`Xem ${row.name}`),
      },
    ],
  },
  [DocType.MARKET_DEFECT_REPORT]: {
    title: "DANH SÁCH LỖI",
    groupByField: "defectreporttype",
    actions: [
      {
        label: "Tạo báo cáo lỗi thị trường",
        icon: PlusCircleOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => { },
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => { },
      },
      baseCopyAction,
    ],
    rowActions: baseRowActions(),
  },
  [DocType.DEFECT_RATE_REPORT]: {
    title: "BÁO CÁO TỈ LỆ PHẾ",
    hideSelect: true,
    hideSearchFullText: true,
    groupByField: "process_code",
    actions: [
      {
        label: "Export Excel",
        icon: DownloadOutlined,
        color: "#00aeee",
        hoverColor: "#38BDF8",
        onClick: () => { },
      },
      baseCopyAction,
    ],
  },
};

export const getDoctypeConfig = (doctype) => {
  return {
    enableCollapse: false,
    hideSearchFullText: false,
    ...(doctypeConfigs[doctype] || {
      title: doctype?.toUpperCase() || "DANH SÁCH",
      actions: [baseCopyAction],
      rowActions: baseRowActions(),
    }),
  };
};
