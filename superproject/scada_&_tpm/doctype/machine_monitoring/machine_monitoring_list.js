frappe.listview_settings["Machine Monitoring"] = {
  refresh: async function (listview) {
    $(listview.page.body)
      .find(
        ".list-row-container, .list-paging-area, .listview-control, .listview-header, .result, .page-form",
      )
      .remove();

    listview.$result && listview.$result.hide();

    let $wrapper = $("#custom-machine-monitoring");
    if (!$wrapper.length) {
      $wrapper = $(
        '<div id="custom-machine-monitoring" class="mm-wrapper"></div>',
      ).prependTo(listview.page.body);
    }

    $wrapper.html(`<div style="padding:16px;color:#666;">Đang tải dữ liệu...</div>`);

    let tryCount = 0;
    let waitData = setInterval(() => {
      tryCount++;
      if ((listview.data && listview.data.length > 0) || tryCount >= 20) {
        clearInterval(waitData);
        renderUI(listview, $wrapper);
      }
    }, 200);
  },
};

function renderUI(listview, $wrapper) {
  const raw = listview.data || [];
  if (!raw.length) {
    $wrapper.html(`<div style="padding:16px;color:#999">Không có dữ liệu.</div>`);
    return;
  }

  const allLines = [...new Set(raw.map((r) => r.machinecode || "N/A"))];

  const status_by_line = {};
  allLines.forEach((l) => {
    status_by_line[l] = { run: 0, stop: 0, error: 0 };
  });

  function mapStatus(st) {
    st = (st || "").toLowerCase();
    if (st.includes("hỏng")) return "error";
    if (st.includes("chạy")) return "run";
    return "stop";
  }

  raw.forEach((rec) => {
    const line = rec.machinecode || "N/A";
    const type = mapStatus(rec.status);
    status_by_line[line][type]++;
  });

  const machines = raw.map((m) => ({
    name: m.machinecode || m.name || "Không tên",
    dv: m.dv || 0,
    fan: m.fan || 0,
    ex: m.ex || 0,
    len: m.len || 0,
    tin: m.tin || 0,
    tmid: m.tmid || 0,
    tout: m.tout || 0,
  }));

  function nowTime() {
    return new Date().toLocaleString("vi-VN", { hour12: false });
  }

  const last_update = nowTime();

  let html = `
  <div class="mm-time-banner">
      <div>Thời gian hiện tại: <span id="mm-clock">${nowTime()}</span></div>
      <div>Tần suất cập nhật: 3 phút</div>
      <div>Thời gian cập nhật mới nhất: ${last_update}</div>
  </div>

  <table class="mm-status-table">
      <thead>
          <tr>
              <th>Trạng thái</th>
              <th>Phân loại</th>
              ${allLines.map((k) => `<th>${k}</th>`).join("")}
              <th>Tổng</th>
          </tr>
      </thead>
      <tbody>

      ${["Đang chạy", "Tạm dừng", "Hỏng"]
      .map((label, i) => {
        const type = ["run", "stop", "error"][i];
        return `
          <tr>
              <td>${label}</td>
              <td>${allLines[i] || ""}</td>
              ${allLines
            .map((line) => {
              const cls =
                type === "run"
                  ? "mm-status-run"
                  : type === "stop"
                    ? "mm-status-stop"
                    : "mm-status-err";

              return `<td class="${cls}">${status_by_line[line][type]}</td>`;
            })
            .join("")}

              <td class="mm-status-run">
                  ${Object.values(status_by_line).reduce((s, v) => s + v[type], 0)}
              </td>
          </tr>`;
      })
      .join("")}
      <tr class="mm-total-row">
          <td>Tổng</td>
          <td></td>

          ${allLines
      .map((line) => {
        const v = status_by_line[line];
        return `<td>${v.run + v.stop + v.error}</td>`;
      })
      .join("")}
          <td>${raw.length}</td>
      </tr>
      </tbody>
  </table>


  <h3 class="mm-title">Danh sách máy móc</h3>
  <div class="mm-card-grid">
      ${machines
      .map(
        (m) => `
          <div class="mm-card">
              <div class="mm-card-header">${m.name}</div>
              <div class="mm-card-body">
                  <div class="mm-grid">
                      <div class="mm-item"><div class="mm-value mm-red">${m.dv}RPM</div><div class="mm-label">Tốc độ DV</div></div>
                      <div class="mm-item"><div class="mm-value mm-red">${m.fan}RPM</div><div class="mm-label">Tốc độ quạt</div></div>
                      <div class="mm-item"><div class="mm-value mm-red">${m.ex}RPM</div><div class="mm-label">Tốc độ quạt hút</div></div>
                  </div>
                  <div class="mm-grid">
                      <div class="mm-item"><div class="mm-value">${m.len}m</div><div class="mm-label">Chiều dài dây</div></div>
                      <div class="mm-item"><div class="mm-value mm-red">${m.tin}°c</div><div class="mm-label">Nhiệt độ vào</div></div>
                      <div class="mm-item"><div class="mm-value mm-red">${m.tout}°c</div><div class="mm-label">Nhiệt độ ra</div></div>
                  </div>
                  <div class="mm-grid">
                      <div class="mm-item"><div class="mm-value mm-red">${m.tmid}°c</div><div class="mm-label">Nhiệt sấy vào</div></div>
                      <div class="mm-item"><div class="mm-value mm-red">${m.tmid}°c</div><div class="mm-label">Nhiệt sấy giữa</div></div>
                      <div class="mm-item"><div class="mm-value mm-red">${m.tout}°c</div><div class="mm-label">Nhiệt sấy ra</div></div>
                  </div>
              </div>
              <div class="mm-card-footer">Không có kế hoạch sản xuất</div>
          </div>
      `,
      )
      .join("")}
  </div>
  `;

  $wrapper.html(html);
  setInterval(() => $("#mm-clock").text(nowTime()), 1000);
}
