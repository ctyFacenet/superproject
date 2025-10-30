frappe.provide("frappe.views");

frappe.views.FacenetView = class FacenetView extends frappe.views.ListView {
	get view_name() {
		return "FaceNet";
	}

	static no_sidebar = true;

	render() {
	}

	setup_defaults() {
		super.setup_defaults();
		this.page_title = __("FaceNet:") + " " + this.page_title;
		this.view = "FaceNet";
		return this.get_list_view_settings();
	}

	setup_page() {
		// this.hide_page_form = true;
		this.hide_filters = true;
		this.hide_sort_selector = true;
		super.setup_page();
		frappe.after_ajax(() => {
			const $label = $('.custom-btn-group-label');
			$label.text('FaceNet View');
			const $icon = $label.closest('.btn-group').find('svg use');
			$icon.attr('href', '#icon-list');
		});
	}

	setup_view() {
		this.setup_facenet_page();
	}

	setup_facenet_page() {
		const facenet_wrapper_html = `<div class="facenet-view">Anh Lộc chẻ châu</div>`;
		this.$frappe_list.html(facenet_wrapper_html);
		this.wrapper = this.$frappe_list.find('.facenet-view');
		this.page.clear_secondary_action();	
		this.page.main.removeClass("frappe-card");

		this.render_vue();
	}

	render_vue() {
		this.wrapper.empty();
		let counter = new superproject.ui.CounterNewComponent({
			wrapper: this.wrapper[0],
			value: 1,
			onUpdateValue: (newVal) => {
				console.log("Updated value:", newVal);
			},
		});
	}
	setup_global_search() {
		
	}
};