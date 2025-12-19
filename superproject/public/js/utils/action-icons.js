import {
  /* ===== BASIC ===== */
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
  CheckOutlined,
  StopOutlined,

  /* ===== CIRCLE STATUS ===== */
  PlusCircleOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,

  /* ===== FILE ===== */
  FileOutlined,
  FileTextOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  FileProtectOutlined,

  /* ===== FOLDER ===== */
  FolderOutlined,
  FolderOpenOutlined,
  FolderAddOutlined,
  FolderViewOutlined,

  /* ===== CRUD ===== */
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,

  /* ===== WORKFLOW ===== */
  CheckSquareOutlined,
  CloseSquareOutlined,
  SyncOutlined,
  ReloadOutlined,
  RollbackOutlined,
  ForwardOutlined,
  RetweetOutlined,

  /* ===== TIME ===== */
  ClockCircleOutlined,
  CalendarOutlined,
  ScheduleOutlined,

  /* ===== SECURITY ===== */
  LockOutlined,
  UnlockOutlined,
  SafetyOutlined,
  KeyOutlined,

  /* ===== USER ===== */
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  TeamOutlined,
  SolutionOutlined,

  /* ===== EXPORT / IMPORT ===== */
  DownloadOutlined,
  UploadOutlined,
  ImportOutlined,
  ExportOutlined,
  PrinterOutlined,

  /* ===== SEARCH / FILTER ===== */
  SearchOutlined,
  FilterOutlined,
  FilterFilled,
  ZoomInOutlined,
  ZoomOutOutlined,

  /* ===== SETTINGS ===== */
  SettingOutlined,
  ToolOutlined,
  ControlOutlined,
  SlidersOutlined,

  /* ===== MENU / UI ===== */
  MenuOutlined,
  MoreOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SwitcherOutlined,

  /* ===== CHART ===== */
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  StockOutlined,

  /* ===== DASHBOARD / MONITOR ===== */
  MonitorOutlined,
  DashboardOutlined,

  /* ===== FORM ===== */
  FormOutlined,
  ProfileOutlined,
  ReadOutlined,

  /* ===== DATA ===== */
  DatabaseOutlined,
  TableOutlined,
  ApartmentOutlined,

  /* ===== NOTIFICATION ===== */
  BellOutlined,
  BellFilled,
  NotificationOutlined,

  /* ===== MESSAGE ===== */
  MessageOutlined,
  CommentOutlined,
  SendOutlined,

  /* ===== LOCATION ===== */
  EnvironmentOutlined,
  GlobalOutlined,

  /* ===== QC / WARNING ===== */
  WarningOutlined,
  AlertOutlined,

  /* ===== ARROW ===== */
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,

  /* ===== POWER ===== */
  PoweroffOutlined,

  /* ===== HISTORY ===== */
  HistoryOutlined,

  /* ===== TAG / LABEL ===== */
  TagOutlined,
  TagsOutlined,

  /* ===== LINK ===== */
  LinkOutlined,
  DisconnectOutlined,

  /* ===== CLOUD ===== */
  CloudUploadOutlined,
  CloudDownloadOutlined,

  /* ===== MOBILE ===== */
  MobileOutlined,
  TabletOutlined,

  /* ===== MISC ===== */
  EyeInvisibleOutlined,
  ScanOutlined,
  QrcodeOutlined,
  BarcodeOutlined,
} from "@ant-design/icons-vue";

export const ACTION_ICON_MAP = {
  /* ===== BASIC ===== */
  add: PlusOutlined,
  remove: MinusOutlined,
  close: CloseOutlined,
  check: CheckOutlined,
  stop: StopOutlined,
  plus_circle: PlusCircleOutlined,
  minus_circle: MinusCircleOutlined,

  /* ===== STATUS ===== */
  success: CheckCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
  info: InfoCircleOutlined,
  question: QuestionCircleOutlined,

  /* ===== FILE ===== */
  file: FileOutlined,
  file_text: FileTextOutlined,
  file_add: FileAddOutlined,
  file_done: FileDoneOutlined,
  excel: FileExcelOutlined,
  pdf: FilePdfOutlined,
  zip: FileZipOutlined,
  image: FileImageOutlined,
  file_search: FileSearchOutlined,
  file_protect: FileProtectOutlined,

  /* ===== FOLDER ===== */
  folder: FolderOutlined,
  folder_open: FolderOpenOutlined,
  folder_add: FolderAddOutlined,
  folder_view: FolderViewOutlined,

  /* ===== CRUD ===== */
  view: EyeOutlined,
  hide: EyeInvisibleOutlined,
  edit: EditOutlined,
  delete: DeleteOutlined,
  copy: CopyOutlined,
  save: SaveOutlined,
  undo: UndoOutlined,
  redo: RedoOutlined,

  /* ===== WORKFLOW ===== */
  approve: CheckSquareOutlined,
  reject: CloseSquareOutlined,
  sync: SyncOutlined,
  reload: ReloadOutlined,
  rollback: RollbackOutlined,
  forward: ForwardOutlined,
  retweet: RetweetOutlined,

  /* ===== TIME ===== */
  time: ClockCircleOutlined,
  calendar: CalendarOutlined,
  schedule: ScheduleOutlined,

  /* ===== SECURITY ===== */
  lock: LockOutlined,
  unlock: UnlockOutlined,
  safety: SafetyOutlined,
  key: KeyOutlined,

  /* ===== USER ===== */
  user: UserOutlined,
  user_add: UserAddOutlined,
  user_delete: UserDeleteOutlined,
  team: TeamOutlined,
  solution: SolutionOutlined,

  /* ===== EXPORT / IMPORT ===== */
  download: DownloadOutlined,
  upload: UploadOutlined,
  import: ImportOutlined,
  export: ExportOutlined,
  print: PrinterOutlined,

  /* ===== SEARCH / FILTER ===== */
  search: SearchOutlined,
  filter: FilterOutlined,
  filter_fill: FilterFilled,
  zoom_in: ZoomInOutlined,
  zoom_out: ZoomOutOutlined,

  /* ===== SETTINGS ===== */
  setting: SettingOutlined,
  tool: ToolOutlined,
  control: ControlOutlined,
  sliders: SlidersOutlined,

  /* ===== MENU ===== */
  menu: MenuOutlined,
  more: MoreOutlined,
  appstore: AppstoreOutlined,
  bars: BarsOutlined,
  columns: SwitcherOutlined,

  /* ===== CHART ===== */
  chart: BarChartOutlined,
  line_chart: LineChartOutlined,
  pie_chart: PieChartOutlined,
  area_chart: AreaChartOutlined,
  radar_chart: RadarChartOutlined,
  stock: StockOutlined,

  /* ===== DASHBOARD ===== */
  monitor: MonitorOutlined,
  dashboard: DashboardOutlined,

  /* ===== FORM ===== */
  form: FormOutlined,
  profile: ProfileOutlined,
  read: ReadOutlined,

  /* ===== DATA ===== */
  database: DatabaseOutlined,
  table: TableOutlined,
  apartment: ApartmentOutlined,

  /* ===== NOTIFY ===== */
  bell: BellOutlined,
  bell_fill: BellFilled,
  notify: NotificationOutlined,

  /* ===== MESSAGE ===== */
  message: MessageOutlined,
  comment: CommentOutlined,
  send: SendOutlined,

  /* ===== LOCATION ===== */
  location: EnvironmentOutlined,
  global: GlobalOutlined,

  /* ===== QC ===== */
  alert: AlertOutlined,
  warn: WarningOutlined,

  /* ===== ARROW ===== */
  up: ArrowUpOutlined,
  down: ArrowDownOutlined,
  left: ArrowLeftOutlined,
  right: ArrowRightOutlined,

  /* ===== POWER ===== */
  power: PoweroffOutlined,

  /* ===== HISTORY ===== */
  history: HistoryOutlined,

  /* ===== TAG ===== */
  tag: TagOutlined,
  tags: TagsOutlined,

  /* ===== LINK ===== */
  link: LinkOutlined,
  unlink: DisconnectOutlined,

  /* ===== CLOUD ===== */
  cloud_upload: CloudUploadOutlined,
  cloud_download: CloudDownloadOutlined,

  /* ===== MOBILE ===== */
  mobile: MobileOutlined,
  tablet: TabletOutlined,

  /* ===== SCAN ===== */
  scan: ScanOutlined,
  qrcode: QrcodeOutlined,
  barcode: BarcodeOutlined,
};


export function resolveActionIcon(key) {
  if (!key) return null;
  return ACTION_ICON_MAP[key] || null;
}

