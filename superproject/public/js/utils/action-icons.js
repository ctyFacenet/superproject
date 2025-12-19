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
  DownloadOutlined,
} from "@ant-design/icons-vue";

export const ACTION_ICON_MAP = {
  file: FileTextOutlined,
  calendar: CalendarOutlined,
  unlock: UnlockOutlined,
  lock: LockOutlined,
  approve: FileDoneOutlined,
  delete: DeleteOutlined,
  excel: FileExcelOutlined,
  view: EyeOutlined,
  edit: EditOutlined,
  cancel: CloseCircleOutlined,
  history: HistoryOutlined,
  plus: PlusCircleOutlined,
  print: PrinterOutlined,
  import: ImportOutlined,
  columns: SwitcherOutlined,
  chart: BarChartOutlined,
  monitor: MonitorOutlined,
  form: FormOutlined,
  copy: CopyOutlined,
  download: DownloadOutlined,
};

export function resolveActionIcon(key) {
  return ACTION_ICON_MAP[key] || null;
}
