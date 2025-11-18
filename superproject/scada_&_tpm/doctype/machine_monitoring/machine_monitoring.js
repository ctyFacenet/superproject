frappe.ui.form.on("Machine Monitoring", {
  refresh(frm) {
    frm.add_custom_button("Xem Dashboard Máy", () => {
      frappe.call({
        method: "superproject.machine_dashboard.get_layout_by_type",
        args: { machine_type: frm.doc.machinecode },
        callback(r) {
          if (!r.message) return;

          let d = new frappe.ui.Dialog({
            title: r.message.title,
            size: "extra-large",
            fields: [{ fieldname: "html", fieldtype: "HTML" }],
          });

          d.set_value("html", r.message.html);
          d.show();

          animate_gauge(d, r.message.availability);
        },
      });
    });
  },
});


function animate_gauge(d, availability) {
  let circle = d.$wrapper.find("#progress-circle")[0];
  let text = d.$wrapper.find("#progress-text")[0];

  let current = 0;
  let step = availability / 40;
  let circumference = 2 * Math.PI * 45;

  let timer = setInterval(() => {
    if (current >= availability) {
      current = availability;
      clearInterval(timer);
    }
    circle.setAttribute(
      "stroke-dashoffset",
      circumference - (current / 100) * circumference
    );
    text.innerHTML = Math.round(current) + "%";
    current += step;
  }, 25);
}
