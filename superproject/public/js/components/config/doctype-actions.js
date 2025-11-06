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
  FileExcelOutlined
} from "@ant-design/icons-vue";

export const doctypeActions = {
  "Sale Order": {
    title: "DANH SÁCH ĐƠN HÀNG TỔNG",
    actions: [
      {
        label: "Thêm mới",
        icon: PlusOutlined,
        onClick: () => frappe.new_doc("Sale Order"),
      },
      {
        label: "",
        icon: CopyOutlined,
        onClick: () => { },
      },
    ],
  },

  "Sale Order Detail": {
    title: "CHI TIẾT ĐƠN HÀNG",
    actions: [
      {
        label: "Duyệt",
        icon: LockOutlined,
        onClick: () => frappe.msgprint("Đã duyệt"),
      },
      {
        label: "Huỷ duyệt",
        icon: UnlockOutlined,
        onClick: () => frappe.msgprint("Huỷ duyệt"),
      },
      {
        label: "",
        icon: CopyOutlined,
        onClick: () => { },
      },
    ],
  },

  "Product Order": {
    title: "ĐƠN SẢN XUẤT NỘI BỘ",
    actions: [
      {
        label: "Tạo đơn sản xuất nội bộ",
        icon: PlusOutlined,
        onClick: () => frappe.msgprint("Tạo đơn sản xuất nội bộ"),
      },
      {
        label: "Duyệt",
        icon: FileDoneOutlined,
        onClick: () => frappe.msgprint("Duyệt"),
      },
      {
        label: "Huỷ duyệt",
        icon: UnlockOutlined,
        onClick: () => frappe.msgprint("Huỷ duyệt"),
      },
      {
        label: "Tạo lệnh sản xuất",
        icon: PlusOutlined,
        onClick: () => frappe.msgprint("Tạo lệnh sản xuất"),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "",
        icon: CopyOutlined,
        onClick: () => { },
      },
    ],
  },

  "Work Order": {
    title: "LỆNH SẢN XUẤT",
    actions: [
      {
        label: "",
        icon: CopyOutlined,
        onClick: () => { },
      },
    ],
  },

  "Work Order Approved": {
    title: "LỆNH SẢN XUẤT ĐÃ DUYỆT",
    actions: [
      {
        label: "",
        icon: CopyOutlined,
        onClick: () => { },
      },
    ],
  },

  "In Process Inventory": {
    title: "TỒN KHO ĐANG SẢN XUẤT",
    actions: [
      {
        label: "Thống kê NVL thừa",
        icon: FileTextOutlined,
        onClick: () => frappe.msgprint("Thống kê NVL thừa"),
      },
      {
        label: "Kiểm kê tồn kho",
        icon: SearchOutlined,
        onClick: () => frappe.msgprint("Kiểm kê tồn kho"),
      },
      {
        label: "Chốt số cuối kỳ",
        icon: CalendarOutlined,
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
        onClick: () => frappe.msgprint("Duyệt huỷ tem"),
      },
      {
        label: "Xuất Excel",
        icon: FileExcelOutlined,
        onClick: () => frappe.msgprint("Đang xuất Excel..."),
      },
      {
        label: "Xoá",
        icon: DeleteOutlined,
        onClick: () => frappe.msgprint("Xoá"),
      },
      {
        label: "",
        icon: CopyOutlined,
        onClick: () => { },
      },
    ],
  },
};
