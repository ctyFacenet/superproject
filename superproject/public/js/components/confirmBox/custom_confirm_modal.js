function customConfirmModal({
  title = "Xác nhận",
  message = "",
  note = "",
  type = "info",
  buttons = [],
}) {
  const MODAL_ID = "customConfirmModal";
  $("#" + MODAL_ID).remove();

  const alertMap = {
    danger: "alert-danger",
    success: "alert-success",
    info: "alert-info",
  };

  const buttonsHtml = buttons
    .map(
      (btn, i) =>
        `<button type="button" class="btn ${btn.class || "btn-secondary"} btn-action" data-idx="${i}">
        ${btn.text}
     </button>`,
    )
    .join("");

  const noteHtml = note
    ? `
     <div class="alert ${alertMap[type] || "alert-info"} d-flex align-items-center">
      <i class="fa fa-exclamation-triangle mr-2" style="font-size: 30px;"></i>
      <div>
        <div style="font-size: 18px; font-weight: 700;">Lưu ý:</div>
        <div style="margin-top: 6px; font-size: 14px;">${note}</div>
      </div>
     </div>
`
    : "";

  const modalHtml = `
    <div class="modal fade" id="${MODAL_ID}" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title fw-bold">${title}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <p>${message}</p>
            ${noteHtml}
          </div>

          <div class="modal-footer">
            ${buttonsHtml}
          </div>

        </div>
      </div>
    </div>`;

  $("body").append(modalHtml);

  const $dialog = $("#" + MODAL_ID);

  $dialog.on("click", ".btn-action", function () {
    const idx = $(this).data("idx");
    buttons[idx]?.onClick?.();
    $dialog.modal("hide");
  });

  $dialog.modal("show");
}
