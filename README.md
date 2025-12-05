### Superproject

FaceNet

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app superproject
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/superproject
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License

mit

### Create new site

bench new-site research
123
admin
admin

### Example

bench --site research install-app superproject

### Switch app custom

bench use research / development.localhost

bench start

### Fix DB error access denied

cd ERP_Next/.devcontainer/
docker compose up -d

Example: SƠ ĐỒ KIẾN TRÚC REALTIME: Frappe → WebSocket → Vue UI
 ┌───────────────────────────────────────────────────────────────────┐
 │                           USER ACTION                             │
 │            (Insert / Update Test Machines Status Doc)             │
 └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                    Frappe Backend: DocType Event                  │
 │     class TestMachinesStatus(Document):                           │
 │         on_update()                                               │
 │             publish_realtime_status()                             │
 └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                    Python Handler: publish_realtime               │
 │                                                                   │
 │   data = get_all_machine_status()                                 │
 │   frappe.publish_realtime(                                        │
 │       "machine_status_update",                                    │
 │       data,                                                       │
 │       after_commit=True                                           │
 │   )                                                               │
 │                                                                   │
 │   ➜ ĐẨY EVENT + DỮ LIỆU LÊN HỆ THỐNG SOCKET.IO CỦA FRAPPE         │
 └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                    Frappe Realtime Socket Server                  │
 │   (socket.io server running on ws://hostname:8000/socket.io/)     │
 │                                                                   │
 │   - Nhận event "machine_status_update" từ backend                 │
 │   - Phát lại event đến **mọi client đang kết nối**                │
 │   - Gửi JSON payload về danh sách máy cập nhật                    │
 └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                        Frontend (Browser)                         │
 │                      Vue Component Lifecycle                      │
 │                                                                   │
 │ onMounted():                                                      │
 │     frappe.realtime.on("machine_status_update", (data) => {       │
 │         machines.value = data;                                    │
 │         lastUpdate.value = timestamp;                             │
 │     });                                                           │
 │                                                                   │
 │   ➜ Vue reactive system rerender toàn bộ UI realtime              │
 │   ➜ Không cần reload, không cần refresh                           │
 └───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │                        Realtime Updated UI                        │
 │      - Thông số máy đổi → UI tự đổi                               │
 │      - Trạng thái đổi (Đang chạy / Dừng / Máy lỗi) → đổi màu      │
 │      - Không có delay, không có polling                           │
 └───────────────────────────────────────────────────────────────────┘
