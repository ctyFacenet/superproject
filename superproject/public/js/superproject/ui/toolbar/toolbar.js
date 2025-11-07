// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

frappe.provide("frappe.ui.toolbar");
frappe.provide("frappe.search");

frappe.ui.toolbar.Toolbar = class {
	constructor() {
		$("header").replaceWith(
			frappe.render_template("navbar", {
				avatar: frappe.avatar(frappe.session.user, "avatar-medium"),
				navbar_settings: frappe.boot.navbar_settings,
			})
		);
		$(".dropdown-toggle").dropdown();
		$("#toolbar-user a[href]").click(function () {
			$(this).closest(".dropdown-menu").prev().dropdown("toggle");
		});

		this.setup_awesomebar();
		this.setup_notifications();
		this.setup_help();
		this.setup_announcement_widget();
		this.make();
	}

	make() {
		this.bind_events();
		this.custom_setup();
		$(document).trigger("toolbar_setup");
	}

	bind_events() {
		// clear all custom menus on page change
		$(document).on("page-change", function () {
			$("header .navbar .custom-menu").remove();
		});

		//focus search-modal on show in mobile view
		$("#search-modal").on("shown.bs.modal", function () {
			var search_modal = $(this);
			setTimeout(function () {
				search_modal.find("#modal-search").focus();
			}, 300);
		});
		$(".navbar-toggle-full-width").click(() => {
			frappe.ui.toolbar.toggle_full_width();
		});
	}

	setup_announcement_widget() {
		let current_announcement = frappe.boot.navbar_settings.announcement_widget;

		if (!current_announcement) return;

		// If an unseen announcement is added, overlook dismiss flag
		if (current_announcement != localStorage.getItem("announcement_widget")) {
			localStorage.removeItem("dismissed_announcement_widget");
			localStorage.setItem("announcement_widget", current_announcement);
		}

		// When an announcement is closed, add dismiss flag
		if (!localStorage.getItem("dismissed_announcement_widget")) {
			let announcement_widget = $(".announcement-widget");
			let close_message = announcement_widget.find(".close-message");
			close_message.on(
				"click",
				() =>
					localStorage.setItem("dismissed_announcement_widget", true) ||
					announcement_widget.addClass("hidden")
			);
		}
	}

	setup_help() {
		if (!frappe.boot.desk_settings.notifications) {
			// hide the help section
			$(".navbar .vertical-bar").removeClass("d-sm-block");
			$(".dropdown-help").removeClass("d-lg-block");
			return;
		}
		frappe.provide("frappe.help");
		frappe.help.show_results = show_results;

		this.search = new frappe.search.SearchDialog();
		frappe.provide("frappe.searchdialog");
		frappe.searchdialog.search = this.search;

		$(".dropdown-help .dropdown-toggle").on("click", function () {
			$(".dropdown-help input").focus();
		});

		$(".dropdown-help .dropdown-menu").on("click", "input, button", function (e) {
			e.stopPropagation();
		});

		$("#input-help").on("keydown", function (e) {
			if (e.which == 13) {
				$(this).val("");
			}
		});

		$(document).on("page-change", function () {
			var $help_links = $(".dropdown-help #help-links");
			$help_links.html("");

			var route = frappe.get_route_str();
			var breadcrumbs = route.split("/");

			var links = [];
			for (let i = 0; i < breadcrumbs.length; i++) {
				var r = route.split("/", i + 1);
				var key = r.join("/");
				var help_links = frappe.help.help_links[key] || [];
				links = $.merge(links, help_links);
			}

			if (links.length === 0) {
				$help_links.next().hide();
			} else {
				$help_links.next().show();
			}

			for (let i = 0; i < links.length; i++) {
				var link = links[i];
				var url = link.url;
				$("<a>", {
					href: url,
					class: "dropdown-item",
					text: __(link.label),
					target: "_blank",
				}).appendTo($help_links);
			}

			$(".dropdown-help .dropdown-menu").on("click", "a", show_results);
		});

		var $result_modal = frappe.get_modal("", "");
		$result_modal.addClass("help-modal");

		$(document).on("click", ".help-modal a", show_results);

		function show_results(e) {
			//edit links
			var href = e.target.href;
			if (href.indexOf("blob") > 0) {
				window.open(href, "_blank");
			}
			var path = $(e.target).attr("data-path");
			if (path) {
				e.preventDefault();
			}
		}
	}

	setup_awesomebar() {
		if (frappe.boot.desk_settings.search_bar) {
			let awesome_bar = new frappe.search.AwesomeBar();
			awesome_bar.setup("#navbar-search");

			frappe.search.utils.make_function_searchable(
				frappe.utils.generate_tracking_url,
				__("Generate Tracking URL")
			);

			if (frappe.model.can_read("RQ Job")) {
				frappe.search.utils.make_function_searchable(function () {
					frappe.set_route("List", "RQ Job");
				}, __("Background Jobs"));
			}
		}
	}

	setup_notifications() {
		if (frappe.boot.desk_settings.notifications && frappe.session.user !== "Guest") {
			this.notifications = new frappe.ui.Notifications();
		}
	}

	async custom_setup() {
		// Gắn sự kiện cho nút Back - Chỉ gắn 1 lần duy nhất khi tải trang
		$(".custom-btn-back").off("click").on("click", () => {
			if (location.pathname === "/app/home") return;
			window.history.back();
		});

		$('.navbar-brand').off('click.custom-navbar').on('click.custom-navbar', function(e) {
			e.preventDefault();
			frappe.set_route('module-list');
		});

		await frappe.ui.toolbar.setup_custom_menu_bar()

		$(document).on("page-change", async function () {
			const breadcrumbs = frappe.router.current_route;

			let breadcrumb_html = "";
			if (breadcrumbs.length >= 3) {
				const doctype = breadcrumbs[1];
				const record_name = breadcrumbs[2];
				if (frappe.views.view_modes.includes(breadcrumbs[2]) || breadcrumbs[2] === breadcrumbs[1]) {
					breadcrumb_html = `<span>${__(doctype)}</span>`;
				} else {
					let response = await frappe.db.get_value(doctype, record_name, frappe.meta.get_docfield(doctype, frappe.get_meta(doctype).title_field)?.fieldname || "name")
					let title =  Object.values(response.message)[0]
					breadcrumb_html = `
						<span class="breadcrumb-link custom-breadcrumb" data-doctype="${doctype}" style="cursor:pointer;">
							${__(doctype)}
						</span>
						<i class="fa fa-angle-right mx-1"></i>
						<span>${__(title)}</span>`;
				}
			} else {
				let title = breadcrumbs[breadcrumbs.length - 1].toLowerCase().split(/[-\s]+/) .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
				breadcrumb_html = `<span>${__(title)}</span>`;
			}

			$(".navbar-breadcrumb").html(breadcrumb_html);
			$(".breadcrumb-link").off("click").on("click", function (e) {
				e.preventDefault();
				const doctype = $(this).data("doctype");
				frappe.set_route("List", doctype);
			});

			frappe.ui.toolbar.setup_hightlight_menu_bar();
			
		});
	}

};

$.extend(frappe.ui.toolbar, {
	add_dropdown_button: function (parent, label, click, icon) {
		var menu = frappe.ui.toolbar.get_menu(parent);
		if (menu.find("li:not(.custom-menu)").length && !menu.find(".divider").length) {
			frappe.ui.toolbar.add_menu_divider(menu);
		}

		return $(
			'<li class="custom-menu"><a><i class="fa-fw ' + icon + '"></i> ' + label + "</a></li>"
		)
			.insertBefore(menu.find(".divider"))
			.find("a")
			.click(function () {
				click.apply(this);
			});
	},
	get_menu: function (label) {
		return $("#navbar-" + label.toLowerCase());
	},
	add_menu_divider: function (menu) {
		menu = typeof menu == "string" ? frappe.ui.toolbar.get_menu(menu) : menu;

		$('<li class="divider custom-menu"></li>').prependTo(menu);
	},
	add_icon_link(route, icon, index, class_name) {
		let parent_element = $(".navbar-right").get(0);
		let new_element = $(`<li class="${class_name}">
			<a class="btn" href="${route}" title="${frappe.utils.to_title_case(
			class_name,
			true
		)}" aria-haspopup="true" aria-expanded="true">
				<div>
					<i class="octicon ${icon}"></i>
				</div>
			</a>
		</li>`).get(0);

		parent_element.insertBefore(new_element, parent_element.children[index]);
	},
	toggle_full_width() {
		let fullwidth = JSON.parse(localStorage.container_fullwidth || "false");
		fullwidth = !fullwidth;
		localStorage.container_fullwidth = fullwidth;
		frappe.ui.toolbar.set_fullwidth_if_enabled();
		$(document.body).trigger("toggleFullWidth");
	},
	set_fullwidth_if_enabled() {
		let fullwidth = JSON.parse(localStorage.container_fullwidth || "false");
		$(document.body).toggleClass("full-width", fullwidth);
	},
	show_shortcuts(e) {
		e.preventDefault();
		frappe.ui.keys.show_keyboard_shortcut_dialog();
		return false;
	},
});

frappe.ui.toolbar.clear_cache = frappe.utils.throttle(function () {
	frappe.assets.clear_local_storage();
	frappe.xcall("frappe.sessions.clear").then((message) => {
		frappe.show_alert({
			message: message,
			indicator: "info",
		});
		location.reload(true);
	});
}, 10000);

frappe.ui.toolbar.show_about = function () {
	try {
		frappe.ui.misc.about();
	} catch (e) {
		console.log(e);
	}
	return false;
};

frappe.ui.toolbar.route_to_user = function () {
	frappe.set_route("Form", "User", frappe.session.user);
};

frappe.ui.toolbar.view_website = function () {
	let website_tab = window.open();
	website_tab.opener = null;
	website_tab.location = "/index";
};

frappe.ui.toolbar.setup_session_defaults = function () {
	let fields = [];
	frappe.call({
		method: "frappe.core.doctype.session_default_settings.session_default_settings.get_session_default_values",
		callback: function (data) {
			fields = JSON.parse(data.message);
			let perms = frappe.perm.get_perm("Session Default Settings");
			//add settings button only if user is a System Manager or has permission on 'Session Default Settings'
			if (frappe.user_roles.includes("System Manager") || perms[0].read == 1) {
				fields[fields.length] = {
					fieldname: "settings",
					fieldtype: "Button",
					label: __("Settings"),
					click: () => {
						frappe.set_route(
							"Form",
							"Session Default Settings",
							"Session Default Settings"
						);
					},
				};
			}
			frappe.prompt(
				fields,
				function (values) {
					//if default is not set for a particular field in prompt
					fields.forEach(function (d) {
						if (!values[d.fieldname]) {
							values[d.fieldname] = "";
						}
					});
					frappe.call({
						method: "frappe.core.doctype.session_default_settings.session_default_settings.set_session_default_values",
						args: {
							default_values: values,
						},
						callback: function (data) {
							if (data.message == "success") {
								frappe.show_alert({
									message: __("Session Defaults Saved"),
									indicator: "green",
								});
								frappe.ui.toolbar.clear_cache();
							} else {
								frappe.show_alert({
									message: __(
										"An error occurred while setting Session Defaults"
									),
									indicator: "red",
								});
							}
						},
					});
				},
				__("Session Defaults"),
				__("Save")
			);
		},
	});
};

// Chức năng khởi tạo Menu Bar nằm dưới Navbar
frappe.ui.toolbar.setup_custom_menu_bar = async function (hide = false) {
	if (hide) {
		$('.custom-menu-bar-wrapper').hide();
		return;
	} else {
		$('.custom-menu-bar-wrapper').show();
		frappe.ui.toolbar.init_menu_bar_scroll_behavior();

		$(document).one('page-change.custom-menu-bar', async function() {
			const breadcrumbs = frappe.get_route_str().split('/')
			let link_to
			if (breadcrumbs.length < 3) link_to = breadcrumbs[breadcrumbs.length - 1]
			else link_to = breadcrumbs[1]
			let result = await frappe.xcall('superproject.general.doctype.display.display.get_module_display', { link_to_name: link_to });
			let module_name = await frappe.xcall('superproject.general.doctype.display.display.get_module_name', { link_to_name: link_to });
			if (!result) return
			$('.custom-menu-bar').empty();
			$('.custom-menu-bar-submenu').remove();

			window.custom_module = module_name
			$(".navbar-module").text(__(module_name));

			result.forEach(item => {
				const div = $('<div class="custom-menu-bar-item"></div>').text(__(item.label || item.link_to)).attr('data-link', item.link_to);
				
				if (item.child && item.child.length > 0) {
					div.addClass('has-child');
					div.attr('data-group', item.label);
					const submenu = $('<div class="custom-menu-bar-submenu"></div>').attr('data-group', item.label);
					
					item.child.forEach(sub => {
						if (!sub.link_to) return;
						const subDiv = $('<div class="custom-menu-bar-submenu-item"></div>')
										.text(__(sub.title || sub.label || sub.link_to))
										.attr('data-link', sub.link_to)
										.attr('data-group', item.label);
						subDiv.on('click', function(e) {
							e.stopPropagation();
							submenu.hide();
							div.removeClass('hover-active'); // Chỉ xóa hover state, không xóa active
							
							if (sub.type === "DocType") {
								if (sub.is_single) frappe.set_route(['Form', sub.link_to, sub.link_to]);
								else frappe.set_route(['List', sub.link_to, 'List']);
							} else if (sub.type === "Report") {
								frappe.set_route(['query-report', sub.link_to]);
							} else if (sub.type === "Page") {
								frappe.set_route([sub.link_to]);
							}
						});
						submenu.append(subDiv);
					});
					
					$('body').append(submenu);
					
					let hideTimeout;
					div.on('mouseenter', function() {
						clearTimeout(hideTimeout);
						$('.custom-menu-bar-submenu').hide();
						$('.custom-menu-bar-item').removeClass('hover-active'); // Chỉ xóa hover state
						div.addClass('hover-active');
						
						const rect = div[0].getBoundingClientRect();
						submenu.css({
							top: rect.bottom + window.scrollY,
							left: rect.left + window.scrollX,
							display: 'block'
						});
					});
					
					div.on('mouseleave', function() {
						hideTimeout = setTimeout(() => {
							// chỉ ẩn nếu cả submenu và cha đều không được hover
							if (!submenu.is(':hover') && !div.is(':hover')) {
								submenu.hide();
								div.removeClass('hover-active');
							}
						}, 150);
					});

					submenu.on('mouseenter', function() {
						clearTimeout(hideTimeout);
						// giữ cha đang hover
						div.addClass('hover-active');
					});

					submenu.on('mouseleave', function() {
						submenu.hide();
						div.removeClass('hover-active');
					});
				} else {
					// Item không có child - chỉ ẩn submenu khác, không xóa active
					div.on('mouseenter', function() {
						$('.custom-menu-bar-submenu').hide();
						$('.custom-menu-bar-item').removeClass('hover-active');
					});
				}
				
				if (item.link_to) {
					div.on('click', function() {
						if (item.type === "DocType") {
							if (item.is_single) frappe.set_route(['Form', item.link_to, item.link_to]);
							else frappe.set_route(['List', item.link_to, 'List']);
						} else if (item.type === "Report") {
							frappe.set_route(['query-report', item.link_to]);
						} else if (item.type === "Page") {
							frappe.set_route([item.link_to]);
						}
					});
				}
				
				$('.custom-menu-bar').append(div);
			});
			
			frappe.ui.toolbar.init_menu_bar_scroll_behavior();
			frappe.ui.toolbar.setup_hightlight_menu_bar();
			frappe.ui.toolbar.render_mobile_menu(result);
		})
	}
};

frappe.ui.toolbar.render_mobile_menu = function(result) {
	// Nếu wrapper chưa có thì tạo mới
	if ($('#mobile-custom-menu-wrapper').length === 0) {
		const wrapper = $(`
			<div id="mobile-custom-menu-wrapper" class="mobile-menu-overlay d-md-none">
				<div id="mobile-custom-menu" class="mobile-menu-sidebar"></div>
			</div>
		`);
		$('body').append(wrapper);
	}

	const wrapper = $('#mobile-custom-menu-wrapper');
	const mobileSidebar = $('#mobile-custom-menu');

	// Hàm render menu
	const renderMenuItems = () => {
		mobileSidebar.empty();

		// Nút Trang chủ
		const homeDiv = $(`
			<div class="mobile-menu-item" data-link="module-list">
				<div class="mobile-item-header">
					<div class="mobile-item-label">
						<i class="fa fa-home" style="margin-right:8px;"></i> Trang chủ
					</div>
				</div>
			</div>
		`);
		homeDiv.on("click", e => {
			e.stopPropagation();
			frappe.set_route("module-list");
			hideMenu();
		});
		mobileSidebar.append(homeDiv);

		const breadcrumbs = frappe.get_route_str().split('/');
		const currentLink = breadcrumbs[1] || breadcrumbs[0];

		if (currentLink === "module-list") return;

		result.forEach(item => {
			const itemDiv = $('<div class="mobile-menu-item"></div>').attr('data-link', item.link_to);
			const header = $('<div class="mobile-item-header"></div>');
			const labelSpan = $('<div class="mobile-item-label"></div>')
				.html(`${__(item.label || item.link_to)}`);

			header.append(labelSpan);

			// Nếu có submenu
			if (item.child && item.child.length > 0) {
				const toggleIcon = $('<span class="mobile-item-toggle"><i class="fa fa-caret-down"></i></span>');
				header.append(toggleIcon);

				const subMenu = $('<div class="mobile-submenu"></div>');
				let shouldShowSubmenu = false;

				item.child.forEach(sub => {
					const subDiv = $('<div class="mobile-subitem"></div>')
						.attr('data-sub-link', sub.link_to)
						.text(__(sub.title || sub.label || sub.link_to));

					if (sub.link_to === currentLink) {
						subDiv.addClass('mobile-item-active');
						shouldShowSubmenu = true;
					}

					subDiv.on('click', e => {
						e.stopPropagation();
						if (sub.type === "DocType") {
							if (sub.is_single)
								frappe.set_route(['Form', sub.link_to, sub.link_to]);
							else
								frappe.set_route(['List', sub.link_to, 'List']);
						} else if (sub.type === "Report") {
							frappe.set_route(['query-report', sub.link_to]);
						} else if (sub.type === "Page") {
							frappe.set_route([sub.link_to]);
						}
						hideMenu();
					});

					subMenu.append(subDiv);
				});

				// ✅ Bấm vào label của item cha để mở/đóng submenu
				header.on('click', e => {
					e.stopPropagation();
					subMenu.slideToggle(200);
					const icon = toggleIcon.find('i');
					icon.toggleClass('fa-caret-down fa-caret-up');
				});

				itemDiv.append(header);
				itemDiv.append(subMenu);

				if (shouldShowSubmenu) {
					subMenu.show();
					toggleIcon.find('i').removeClass('fa-caret-down').addClass('fa-caret-up');
				}
			} else {
				// Không có submenu
				if (item.link_to === currentLink) {
					itemDiv.addClass('mobile-item-active');
				}
				header.on('click', e => {
					e.stopPropagation();
					if (item.type === "DocType") {
						if (item.is_single)
							frappe.set_route(['Form', item.link_to, item.link_to]);
						else
							frappe.set_route(['List', item.link_to, 'List']);
					} else if (item.type === "Report") {
						frappe.set_route(['query-report', item.link_to]);
					} else if (item.type === "Page") {
						frappe.set_route([item.link_to]);
					}
					hideMenu();
				});
				itemDiv.append(header);
			}

			mobileSidebar.append(itemDiv);
		});
	};

	renderMenuItems();

	// Animation hiển thị menu
	const showMenu = () => {
		wrapper.show();
		setTimeout(() => {
			wrapper.css('opacity', '1');
			mobileSidebar.css('left', '0');
		}, 10);
	};

	// Animation ẩn menu
	const hideMenu = () => {
		wrapper.css('opacity', '0');
		mobileSidebar.css('left', '-40%');
		setTimeout(() => wrapper.hide(), 300);
	};

	// Gắn sự kiện mở menu
	$(document).off('click.mobile-menu-btn').on('click.mobile-menu-btn', '.mobile-menu-btn', showMenu);

	// Click overlay ngoài menu để ẩn
	wrapper.off('click').on('click', function(e) {
		if (e.target === this) hideMenu();
	});
};


// Chức năng khởi tạo cơ chế hiển thị mũi tên/hỗ trợ scroll ngang khi SL Chức năng lớn
frappe.ui.toolbar.init_menu_bar_scroll_behavior = function() {
	const updateScrollButtons = () => {
		const container = $('.custom-menu-bar');
		
		if (container[0]) {
			const hasOverflow = container[0].scrollWidth > container[0].clientWidth;
			
			if (hasOverflow) {
				const scrollLeft = container.scrollLeft();
				const maxScroll = container[0].scrollWidth - container[0].clientWidth;
				
				if (scrollLeft <= 0) {
					$('.custom-menu-bar-scroll-btn.left').removeClass('show');
					$('.custom-menu-bar-scroll-btn.right').addClass('show');
				} else if (scrollLeft >= maxScroll - 1) {
					$('.custom-menu-bar-scroll-btn.left').addClass('show');
					$('.custom-menu-bar-scroll-btn.right').removeClass('show');
				} else {
					$('.custom-menu-bar-scroll-btn.left').addClass('show');
					$('.custom-menu-bar-scroll-btn.right').addClass('show');
				}
			} else {
				$('.custom-menu-bar-scroll-btn').removeClass('show');
			}
		}
	};
	
	$('.custom-menu-bar-scroll-btn.left').off('click').on('click', function() {
		const container = $('.custom-menu-bar');
		const currentScroll = container.scrollLeft();
		container.animate({ scrollLeft: currentScroll - 300 }, 250, 'swing', updateScrollButtons);
	});
	
	$('.custom-menu-bar-scroll-btn.right').off('click').on('click', function() {
		const container = $('.custom-menu-bar');
		const currentScroll = container.scrollLeft();
		container.animate({ scrollLeft: currentScroll + 300 }, 250, 'swing', updateScrollButtons);
	});
	
	$('.custom-menu-bar').off('wheel').on('wheel', function(e) {
		e.preventDefault();
		const delta = e.originalEvent.deltaY || e.originalEvent.deltaX;
		this.scrollLeft += delta;
		updateScrollButtons();
	});
	
	$('.custom-menu-bar').off('scroll').on('scroll', updateScrollButtons);
	
	requestAnimationFrame(() => {
		requestAnimationFrame(updateScrollButtons);
	});
};

// Chức năng hiển thị các Item trong Menu đang được chọn
frappe.ui.toolbar.setup_hightlight_menu_bar = async function () {
	let breadcrumbs = frappe.router.current_route;
	const target = breadcrumbs[1] || breadcrumbs[0];

	// Reset trạng thái cho menu bar (desktop)
	$('.custom-menu-bar-item').removeClass('active hover-active');
	$('.custom-menu-bar-submenu-item').removeClass('active');

	// Reset trạng thái cho mobile menu
	$('.mobile-menu-item').removeClass('mobile-item-active');
	$('.mobile-subitem').removeClass('mobile-item-active');

	// ====== Xử lý MENU BAR (desktop) ======
	const mainMatches = $(`.custom-menu-bar-item[data-link="${target}"]`);
	const subMatches  = $(`.custom-menu-bar-submenu-item[data-link="${target}"]`);

	mainMatches.each(function() {
		$(this).addClass('active');
	});

	subMatches.each(function() {
		const sub = $(this);
		const group = sub.attr('data-group');
		const parent = $(`.custom-menu-bar-item.has-child[data-group="${group}"]`);
		parent.addClass('active');
	});

	// ====== Xử lý MOBILE MENU ======
	const mobileMainMatches = $(`.mobile-menu-item[data-link="${target}"]`);
	const mobileSubMatches  = $(`.mobile-subitem[data-sub-link="${target}"]`);

	// Active item chính nếu trùng link
	mobileMainMatches.each(function() {
		$(this).addClass('mobile-item-active');
	});

	// Active sub-item và mở submenu nếu trùng
	if (mobileSubMatches.length > 0) {
		mobileSubMatches.each(function() {
			const sub = $(this);
			sub.addClass('mobile-item-active');

			// Mở submenu chứa nó
			const submenu = sub.closest('.mobile-submenu');
			if (submenu.length) {
				submenu.slideDown(0); // hiển thị ngay
				const toggle = submenu.siblings('.mobile-item-header').find('i.fa');
				toggle.removeClass('fa-caret-down').addClass('fa-caret-up');
			}
		});
	} else {
		// ❗ Nếu không có subitem nào active → đóng tất cả submenu đang mở
		$('.mobile-submenu').each(function() {
			const submenu = $(this);
			if (submenu.is(':visible')) {
				submenu.slideUp(0);
				const toggle = submenu.siblings('.mobile-item-header').find('i.fa');
				toggle.removeClass('fa-caret-up').addClass('fa-caret-down');
			}
		});
	}
};

