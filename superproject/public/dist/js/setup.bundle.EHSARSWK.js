(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // frappe-html:/workspace/development/frappe-bench/apps/superproject/superproject/public/js/superproject/ui/toolbar/navbar.html
  frappe.templates["navbar"] = `<div class="sticky-top">
	<header class="navbar navbar-expand my-navbar" role="navigation">
		<div class="container">
			<div class="mobile_container d-flex align-items-center d-block d-md-none" style="color:white !important;">
				<button class="btn btn-reset mobile-menu-btn " style="padding-left:0px;">
					<i class="fas fa-bars fa-2x" style="color:white !important;"></i>
				</button>
			</div>
			<div class="desktop_container d-none d-md-flex align-items-center">
				<a class="navbar-brand navbar-home ">
					<img
						class="app-logo"
						src="{{ frappe.boot.app_logo_url }}"
						alt="{{ __('App Logo') }}"
					>
				</a>
				<div class="navbar-breadcrumb-wrapper ml-3">
					<div class="navbar-module small"></div>
					<div class="navbar-breadcrumb font-weight-bold" style="font-size:1.1rem;"></div>
				</div>
			</div>
			<div class="collapse navbar-collapse justify-content-end">
				<form class="form-inline fill-width justify-content-end" role="search" onsubmit="return false;">
					{% if (frappe.boot.read_only) { %}
						<span class="indicator-pill yellow no-indicator-dot" title="{%= __("Your site is undergoing maintenance or being updated.") %}">
							{%= __("Read Only Mode") %}
						</span>
					{% } %}
					{% if (frappe.boot.user.impersonated_by) { %}
						<span class="indicator-pill red no-indicator-dot" title="{%= __("You are impersonating as another user.") %}">
							{%= __("Impersonating {0}", [frappe.boot.user.name]) %}
						</span>
					{% } %}
					<div class="input-group search-bar text-muted hidden">
						<input
							id="navbar-search"
							type="text"
							class="form-control"
							placeholder="{%= __('Search or type a command ({0})', [frappe.utils.is_mac() ? '\u2318 + G' : 'Ctrl + G']) %}"
							aria-haspopup="true"
						>
						<span class="search-icon">
							<svg class="icon icon-sm"><use href="#icon-search"></use></svg>
						</span>
					</div>
				</form>
				<ul class="navbar-nav">
					<li class="nav-item dropdown dropdown-notifications dropdown-mobile hidden">
						<button
							class="btn-reset nav-link notifications-icon text-muted"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
						<span class="notifications-seen">
							<span class="sr-only">{{ __("No new notifications") }}</span>
							<i class="fa-solid fa-bell"></i> 
						</span>
						<span class="notifications-unseen">
							<span class="sr-only">{{ __("You have unseen notifications") }}</span>
							<i class="fa-solid fa-bell"></i>
						</span>
						</button>
						<div class="dropdown-menu notifications-list dropdown-menu-right" role="menu">
							<div class="notification-list-header">
								<div class="header-items"></div>
								<div class="header-actions"></div>
							</div>
							<div class="notification-list-body">
								<div class="panel-notifications"></div>
								<div class="panel-events"></div>
								<div class="panel-changelog-feed"></div>
							</div>
						</div>
					</li>
					<li class="nav-item dropdown dropdown-message dropdown-mobile hidden">
						<button
							class="btn-reset nav-link notifications-icon text-muted"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="true"
						>
							<span>
								<svg class="es-icon icon-sm"><use href="#es-line-chat-alt"></use></svg>
							</span>
						</button>
					</li>
					<li class="vertical-bar d-none d-sm-block"></li>
					<li class="nav-item dropdown dropdown-navbar-user dropdown-mobile">
						<button
							class="btn-reset nav-link"
							data-toggle="dropdown"
							aria-label="{{ __("User Menu") }}"
						>
							{{ avatar }}
						</button>
						<div class="dropdown-menu dropdown-menu-right" id="toolbar-user" role="menu">
							{% for item in navbar_settings.settings_dropdown %}
								{% var condition = item.condition ? eval(item.condition) : true %}
								{% if (condition && !item.hidden) { %}
									{% if (item.route) { %}
										<a class="dropdown-item" href="{{ item.route }}">
											{%= __(item.item_label) %}
										</a>
									{% } else if (item.action) { %}
										<button class="btn-reset dropdown-item" onclick="return {{ item.action }}">
											{%= __(item.item_label) %}
										</button>
									{% } else { %}
										<div class="dropdown-divider"></div>
									{% } %}
								{% } %}
							{% endfor %}
						</div>
					</li>
					<li class="nav-item dropdown dropdown-navbar-user dropdown-mobile dropdown-logout d-none d-md-block" style="margin-right:15px;">
						<button 
							type="button" 
							class="btn-log-out" 
							onclick="return frappe.app.logout();"
						>
							<i class="fa-solid fa-right-from-bracket text-center"></i>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</header>
	{% if !localStorage.getItem("dismissed_announcement_widget") && strip_html(navbar_settings.announcement_widget) != '' %}
	<div class="announcement-widget form-message p-2 m-0" style="position: relative; z-index: -1; border-radius: 0; background-color: var(--bg-blue);">
		<div class="container flex justify-between align-center mx-auto">
			{{ navbar_settings.announcement_widget }}
			<div class="close-message p-0 mr-2" style="position: relative;">
			{{ frappe.utils.icon("close") }}
			</div>
		</div>
	</div>
	{% endif %}
	<div class="custom-menu-bar-wrapper">
		<div class="container">
			<div class="custom-menu-bar-scroll-btn left">
				<i class="fa fa-chevron-left"></i>
			</div>
			<div class="custom-menu-bar"></div>
			<div class="custom-menu-bar-scroll-btn right">
				<i class="fa fa-chevron-right"></i>
			</div>
		</div>
	</div>
</div>`;

  // ../superproject/superproject/public/js/superproject/ui/toolbar/toolbar.js
  frappe.provide("frappe.ui.toolbar");
  frappe.provide("frappe.search");
  frappe.ui.toolbar.Toolbar = class {
    constructor() {
      $("header").replaceWith(
        frappe.render_template("navbar", {
          avatar: frappe.avatar(frappe.session.user, "avatar-medium"),
          navbar_settings: frappe.boot.navbar_settings
        })
      );
      $(".dropdown-toggle").dropdown();
      $("#toolbar-user a[href]").click(function() {
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
      $(document).on("page-change", function() {
        $("header .navbar .custom-menu").remove();
      });
      $("#search-modal").on("shown.bs.modal", function() {
        var search_modal = $(this);
        setTimeout(function() {
          search_modal.find("#modal-search").focus();
        }, 300);
      });
      $(".navbar-toggle-full-width").click(() => {
        frappe.ui.toolbar.toggle_full_width();
      });
    }
    setup_announcement_widget() {
      let current_announcement = frappe.boot.navbar_settings.announcement_widget;
      if (!current_announcement)
        return;
      if (current_announcement != localStorage.getItem("announcement_widget")) {
        localStorage.removeItem("dismissed_announcement_widget");
        localStorage.setItem("announcement_widget", current_announcement);
      }
      if (!localStorage.getItem("dismissed_announcement_widget")) {
        let announcement_widget = $(".announcement-widget");
        let close_message = announcement_widget.find(".close-message");
        close_message.on(
          "click",
          () => localStorage.setItem("dismissed_announcement_widget", true) || announcement_widget.addClass("hidden")
        );
      }
    }
    setup_help() {
      if (!frappe.boot.desk_settings.notifications) {
        $(".navbar .vertical-bar").removeClass("d-sm-block");
        $(".dropdown-help").removeClass("d-lg-block");
        return;
      }
      frappe.provide("frappe.help");
      frappe.help.show_results = show_results;
      this.search = new frappe.search.SearchDialog();
      frappe.provide("frappe.searchdialog");
      frappe.searchdialog.search = this.search;
      $(".dropdown-help .dropdown-toggle").on("click", function() {
        $(".dropdown-help input").focus();
      });
      $(".dropdown-help .dropdown-menu").on("click", "input, button", function(e) {
        e.stopPropagation();
      });
      $("#input-help").on("keydown", function(e) {
        if (e.which == 13) {
          $(this).val("");
        }
      });
      $(document).on("page-change", function() {
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
            target: "_blank"
          }).appendTo($help_links);
        }
        $(".dropdown-help .dropdown-menu").on("click", "a", show_results);
      });
      var $result_modal = frappe.get_modal("", "");
      $result_modal.addClass("help-modal");
      $(document).on("click", ".help-modal a", show_results);
      function show_results(e) {
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
          frappe.search.utils.make_function_searchable(function() {
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
      $(".custom-btn-back").off("click").on("click", () => {
        if (location.pathname === "/app/home")
          return;
        window.history.back();
      });
      $(".navbar-brand").off("click.custom-navbar").on("click.custom-navbar", function(e) {
        e.preventDefault();
        frappe.set_route("module-list");
      });
      await frappe.ui.toolbar.setup_custom_menu_bar();
      $(document).on("page-change", async function() {
        var _a2;
        const breadcrumbs = frappe.router.current_route;
        let breadcrumb_html = "";
        if (breadcrumbs.length >= 3) {
          const doctype = breadcrumbs[1];
          const record_name = breadcrumbs[2];
          if (frappe.views.view_modes.includes(breadcrumbs[2]) || breadcrumbs[2] === breadcrumbs[1]) {
            breadcrumb_html = `<span>${__(doctype)}</span>`;
          } else {
            let response = await frappe.db.get_value(doctype, record_name, ((_a2 = frappe.meta.get_docfield(doctype, frappe.get_meta(doctype).title_field)) == null ? void 0 : _a2.fieldname) || "name");
            let title = Object.values(response.message)[0];
            breadcrumb_html = `
						<span class="breadcrumb-link custom-breadcrumb" data-doctype="${doctype}" style="cursor:pointer;">
							${__(doctype)}
						</span>
						<i class="fa fa-angle-right mx-1"></i>
						<span>${__(title)}</span>`;
          }
        } else {
          let title = breadcrumbs[breadcrumbs.length - 1].toLowerCase().split(/[-\s]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          breadcrumb_html = `<span>${__(title)}</span>`;
        }
        $(".navbar-breadcrumb").html(breadcrumb_html);
        $(".breadcrumb-link").off("click").on("click", function(e) {
          e.preventDefault();
          const doctype = $(this).data("doctype");
          frappe.set_route("List", doctype);
        });
        frappe.ui.toolbar.setup_hightlight_menu_bar();
      });
    }
  };
  $.extend(frappe.ui.toolbar, {
    add_dropdown_button: function(parent, label, click, icon) {
      var menu = frappe.ui.toolbar.get_menu(parent);
      if (menu.find("li:not(.custom-menu)").length && !menu.find(".divider").length) {
        frappe.ui.toolbar.add_menu_divider(menu);
      }
      return $(
        '<li class="custom-menu"><a><i class="fa-fw ' + icon + '"></i> ' + label + "</a></li>"
      ).insertBefore(menu.find(".divider")).find("a").click(function() {
        click.apply(this);
      });
    },
    get_menu: function(label) {
      return $("#navbar-" + label.toLowerCase());
    },
    add_menu_divider: function(menu) {
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
    }
  });
  frappe.ui.toolbar.clear_cache = frappe.utils.throttle(function() {
    frappe.assets.clear_local_storage();
    frappe.xcall("frappe.sessions.clear").then((message) => {
      frappe.show_alert({
        message,
        indicator: "info"
      });
      location.reload(true);
    });
  }, 1e4);
  frappe.ui.toolbar.show_about = function() {
    try {
      frappe.ui.misc.about();
    } catch (e) {
      console.log(e);
    }
    return false;
  };
  frappe.ui.toolbar.route_to_user = function() {
    frappe.set_route("Form", "User", frappe.session.user);
  };
  frappe.ui.toolbar.view_website = function() {
    let website_tab = window.open();
    website_tab.opener = null;
    website_tab.location = "/index";
  };
  frappe.ui.toolbar.setup_session_defaults = function() {
    let fields = [];
    frappe.call({
      method: "frappe.core.doctype.session_default_settings.session_default_settings.get_session_default_values",
      callback: function(data) {
        fields = JSON.parse(data.message);
        let perms = frappe.perm.get_perm("Session Default Settings");
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
            }
          };
        }
        frappe.prompt(
          fields,
          function(values) {
            fields.forEach(function(d) {
              if (!values[d.fieldname]) {
                values[d.fieldname] = "";
              }
            });
            frappe.call({
              method: "frappe.core.doctype.session_default_settings.session_default_settings.set_session_default_values",
              args: {
                default_values: values
              },
              callback: function(data2) {
                if (data2.message == "success") {
                  frappe.show_alert({
                    message: __("Session Defaults Saved"),
                    indicator: "green"
                  });
                  frappe.ui.toolbar.clear_cache();
                } else {
                  frappe.show_alert({
                    message: __(
                      "An error occurred while setting Session Defaults"
                    ),
                    indicator: "red"
                  });
                }
              }
            });
          },
          __("Session Defaults"),
          __("Save")
        );
      }
    });
  };
  frappe.ui.toolbar.setup_custom_menu_bar = async function(hide = false) {
    if (hide) {
      $(".custom-menu-bar-wrapper").hide();
      return;
    } else {
      $(".custom-menu-bar-wrapper").show();
      frappe.ui.toolbar.init_menu_bar_scroll_behavior();
      $(document).one("page-change.custom-menu-bar", async function() {
        const breadcrumbs = frappe.get_route_str().split("/");
        let link_to;
        if (breadcrumbs.length < 3)
          link_to = breadcrumbs[breadcrumbs.length - 1];
        else
          link_to = breadcrumbs[1];
        let result = await frappe.xcall("superproject.setup.doctype.display.display.get_module_display", { link_to_name: link_to });
        let module_name = await frappe.xcall("superproject.setup.doctype.display.display.get_module_name", { link_to_name: link_to });
        if (!result)
          return;
        $(".custom-menu-bar").empty();
        $(".custom-menu-bar-submenu").remove();
        window.custom_module = module_name;
        $(".navbar-module").text(__(module_name));
        result.forEach((item) => {
          const div = $('<div class="custom-menu-bar-item"></div>').text(item.label || item.link_to).attr("data-link", item.link_to);
          if (item.child && item.child.length > 0) {
            div.addClass("has-child");
            div.attr("data-group", item.label);
            const submenu = $('<div class="custom-menu-bar-submenu"></div>').attr("data-group", item.label);
            item.child.forEach((sub) => {
              if (!sub.link_to)
                return;
              const subDiv = $('<div class="custom-menu-bar-submenu-item"></div>').text(sub.title || sub.label || sub.link_to).attr("data-link", sub.link_to).attr("data-group", item.label);
              subDiv.on("click", function(e) {
                e.stopPropagation();
                submenu.hide();
                div.removeClass("hover-active");
                if (sub.type === "DocType") {
                  if (sub.is_single)
                    frappe.set_route(["Form", sub.link_to, sub.link_to]);
                  else
                    frappe.set_route(["List", sub.link_to, "List"]);
                } else if (sub.type === "Report") {
                  frappe.set_route(["query-report", sub.link_to]);
                } else if (sub.type === "Page") {
                  frappe.set_route([sub.link_to]);
                }
              });
              submenu.append(subDiv);
            });
            $("body").append(submenu);
            let hideTimeout;
            div.on("mouseenter", function() {
              clearTimeout(hideTimeout);
              $(".custom-menu-bar-submenu").hide();
              $(".custom-menu-bar-item").removeClass("hover-active");
              div.addClass("hover-active");
              const rect = div[0].getBoundingClientRect();
              submenu.css({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                display: "block"
              });
            });
            div.on("mouseleave", function() {
              hideTimeout = setTimeout(() => {
                if (!submenu.is(":hover") && !div.is(":hover")) {
                  submenu.hide();
                  div.removeClass("hover-active");
                }
              }, 150);
            });
            submenu.on("mouseenter", function() {
              clearTimeout(hideTimeout);
              div.addClass("hover-active");
            });
            submenu.on("mouseleave", function() {
              submenu.hide();
              div.removeClass("hover-active");
            });
          } else {
            div.on("mouseenter", function() {
              $(".custom-menu-bar-submenu").hide();
              $(".custom-menu-bar-item").removeClass("hover-active");
            });
          }
          if (item.link_to) {
            div.on("click", function() {
              if (item.type === "DocType") {
                if (item.is_single)
                  frappe.set_route(["Form", item.link_to, item.link_to]);
                else
                  frappe.set_route(["List", item.link_to, "List"]);
              } else if (item.type === "Report") {
                frappe.set_route(["query-report", item.link_to]);
              } else if (item.type === "Page") {
                frappe.set_route([item.link_to]);
              }
            });
          }
          $(".custom-menu-bar").append(div);
        });
        frappe.ui.toolbar.init_menu_bar_scroll_behavior();
        frappe.ui.toolbar.setup_hightlight_menu_bar();
        frappe.ui.toolbar.render_mobile_menu(result);
      });
    }
  };
  frappe.ui.toolbar.render_mobile_menu = function(result) {
    if ($("#mobile-custom-menu-wrapper").length === 0) {
      const wrapper2 = $(`
			<div id="mobile-custom-menu-wrapper" class="d-md-none" style="
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,0.5);
				display: none;
				transition: opacity 0.3s;
				z-index: 1050;
			">
				<div id="mobile-custom-menu" style="
					position: absolute;
					top: 0;
					left: -40%;
					width: 40%;
					height: 100%;
					background-color: white;
					padding: 10px;
					overflow-y: auto;
					box-shadow: 2px 0 5px rgba(0,0,0,0.3);
					transition: left 0.3s;
				"></div>
			</div>
		`);
      $("body").append(wrapper2);
    }
    const wrapper = $("#mobile-custom-menu-wrapper");
    const mobileSidebar = $("#mobile-custom-menu");
    const renderMenuItems = () => {
      mobileSidebar.empty();
      const menuDiv = $(`
			<div style="padding:8px 10px; border-radius:5px; margin-bottom:5px; cursor:pointer; display:flex; align-items:center;">
				<i class="fa fa-home" style="margin-right:8px;"></i>
				Trang ch\u1EE7
			</div>
		`);
      menuDiv.on("click", (e) => {
        e.stopPropagation();
        frappe.set_route("module-list");
        hideMenu();
      });
      mobileSidebar.append(menuDiv);
      const breadcrumbs = frappe.get_route_str().split("/");
      const currentLink = breadcrumbs[1] || breadcrumbs[0];
      if (currentLink === "module-list")
        return;
      result.forEach((item) => {
        const itemDiv = $('<div style="padding:8px 10px; border-radius:5px; margin-bottom:5px; cursor:pointer; position:relative;"></div>').text(item.label || item.link_to);
        if (item.child && item.child.length > 0) {
          const subMenu = $('<div style="display:none;margin-top:10px;"></div>');
          const toggleBtn = $('<span style="position:absolute; right:10px; cursor:pointer;"><i class="fa fa-caret-down"></i></span>');
          itemDiv.append(toggleBtn);
          itemDiv.on("click", (e) => {
            e.stopPropagation();
            subMenu.slideToggle(200);
            toggleBtn.find("i").toggleClass("fa-caret-down fa-caret-up");
          });
          let shouldShowSubmenu = false;
          item.child.forEach((sub) => {
            const subDiv = $('<div style="padding:8px 10px; border-radius:5px; cursor:pointer;"></div>').text(sub.title || sub.label || sub.link_to);
            if (sub.link_to === currentLink) {
              subDiv.css("background-color", "#f0f0f0");
              shouldShowSubmenu = true;
            }
            subDiv.on("click", (e) => {
              e.stopPropagation();
              if (sub.type === "DocType") {
                if (sub.is_single)
                  frappe.set_route(["Form", sub.link_to, sub.link_to]);
                else
                  frappe.set_route(["List", sub.link_to, "List"]);
              } else if (sub.type === "Report") {
                frappe.set_route(["query-report", sub.link_to]);
              } else if (sub.type === "Page") {
                frappe.set_route([sub.link_to]);
              }
              hideMenu();
            });
            subMenu.append(subDiv);
          });
          if (shouldShowSubmenu) {
            subMenu.show();
            toggleBtn.find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
          }
          itemDiv.append(subMenu);
        } else {
          if (item.link_to === currentLink) {
            itemDiv.css("background-color", "#f0f0f0");
          }
          itemDiv.on("click", function() {
            if (item.type === "DocType") {
              if (item.is_single)
                frappe.set_route(["Form", item.link_to, item.link_to]);
              else
                frappe.set_route(["List", item.link_to, "List"]);
            } else if (item.type === "Report") {
              frappe.set_route(["query-report", item.link_to]);
            } else if (item.type === "Page") {
              frappe.set_route([item.link_to]);
            }
            hideMenu();
          });
        }
        mobileSidebar.append(itemDiv);
      });
    };
    renderMenuItems();
    const showMenu = () => {
      wrapper.show();
      setTimeout(() => {
        wrapper.css("opacity", "1");
        mobileSidebar.css("left", "0");
      }, 10);
    };
    const hideMenu = () => {
      wrapper.css("opacity", "0");
      mobileSidebar.css("left", "-40%");
      setTimeout(() => {
        wrapper.hide();
      }, 300);
    };
    $(document).off("click.mobile-menu-btn").on("click.mobile-menu-btn", ".mobile-menu-btn", function() {
      showMenu();
    });
    wrapper.off("click").on("click", function(e) {
      if (e.target === this)
        hideMenu();
    });
  };
  frappe.ui.toolbar.init_menu_bar_scroll_behavior = function() {
    const updateScrollButtons = () => {
      const container = $(".custom-menu-bar");
      if (container[0]) {
        const hasOverflow = container[0].scrollWidth > container[0].clientWidth;
        if (hasOverflow) {
          const scrollLeft = container.scrollLeft();
          const maxScroll = container[0].scrollWidth - container[0].clientWidth;
          if (scrollLeft <= 0) {
            $(".custom-menu-bar-scroll-btn.left").removeClass("show");
            $(".custom-menu-bar-scroll-btn.right").addClass("show");
          } else if (scrollLeft >= maxScroll - 1) {
            $(".custom-menu-bar-scroll-btn.left").addClass("show");
            $(".custom-menu-bar-scroll-btn.right").removeClass("show");
          } else {
            $(".custom-menu-bar-scroll-btn.left").addClass("show");
            $(".custom-menu-bar-scroll-btn.right").addClass("show");
          }
        } else {
          $(".custom-menu-bar-scroll-btn").removeClass("show");
        }
      }
    };
    $(".custom-menu-bar-scroll-btn.left").off("click").on("click", function() {
      const container = $(".custom-menu-bar");
      const currentScroll = container.scrollLeft();
      container.animate({ scrollLeft: currentScroll - 300 }, 250, "swing", updateScrollButtons);
    });
    $(".custom-menu-bar-scroll-btn.right").off("click").on("click", function() {
      const container = $(".custom-menu-bar");
      const currentScroll = container.scrollLeft();
      container.animate({ scrollLeft: currentScroll + 300 }, 250, "swing", updateScrollButtons);
    });
    $(".custom-menu-bar").off("wheel").on("wheel", function(e) {
      e.preventDefault();
      const delta = e.originalEvent.deltaY || e.originalEvent.deltaX;
      this.scrollLeft += delta;
      updateScrollButtons();
    });
    $(".custom-menu-bar").off("scroll").on("scroll", updateScrollButtons);
    requestAnimationFrame(() => {
      requestAnimationFrame(updateScrollButtons);
    });
  };
  frappe.ui.toolbar.setup_hightlight_menu_bar = async function() {
    let breadcrumbs = frappe.router.current_route;
    const target = breadcrumbs[1] || breadcrumbs[0];
    $(".custom-menu-bar-item").removeClass("active hover-active");
    const mainMatches = $(`.custom-menu-bar-item[data-link="${target}"]`);
    const subMatches = $(`.custom-menu-bar-submenu-item[data-link="${target}"]`);
    mainMatches.each(function() {
      $(this).addClass("active");
    });
    subMatches.each(function() {
      const sub = $(this);
      const group = sub.attr("data-group");
      const parent = $(`.custom-menu-bar-item.has-child[data-group="${group}"]`);
      parent.addClass("active");
    });
  };

  // ../superproject/superproject/public/js/superproject/ui/notifications/notifications.js
  frappe.provide("frappe.search");
  frappe.ui.Notifications = class Notifications {
    constructor() {
      this.tabs = {};
      this.notification_settings = frappe.boot.notification_settings;
      this.make();
    }
    make() {
      this.dropdown = $(".navbar").find(".dropdown-notifications").removeClass("hidden");
      this.dropdown_list = this.dropdown.find(".notifications-list");
      this.header_items = this.dropdown_list.find(".header-items");
      this.header_actions = this.dropdown_list.find(".header-actions");
      this.body = this.dropdown_list.find(".notification-list-body");
      this.panel_events = this.dropdown_list.find(".panel-events");
      this.panel_notifications = this.dropdown_list.find(".panel-notifications");
      this.panel_changelog_feed = this.dropdown_list.find(".panel-changelog-feed");
      this.user = frappe.session.user;
      this.setup_headers();
      this.setup_dropdown_events();
    }
    setup_headers() {
      $(`<span class="notification-settings pull-right" data-action="go_to_settings">
			${frappe.utils.icon("setting-gear")}
		</span>`).on("click", (e) => {
        e.stopImmediatePropagation();
        this.dropdown.dropdown("hide");
        frappe.set_route("Form", "Notification Settings", frappe.session.user);
      }).appendTo(this.header_actions).attr("title", __("Notification Settings")).tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
      $(`<span class="mark-all-read pull-right" data-action="mark_all_as_read">
			${frappe.utils.icon("mark-as-read")}
		</span>`).on("click", (e) => this.mark_all_as_read(e)).appendTo(this.header_actions).attr("title", __("Mark all as read")).tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
      this.categories = [
        {
          label: __("Notifications"),
          id: "notifications",
          view: NotificationsView,
          el: this.panel_notifications
        },
        {
          label: __("Events"),
          id: "todays_events",
          view: EventsView,
          el: this.panel_events
        },
        {
          label: __("What's New"),
          id: "changelog_feed",
          view: ChangelogFeedView,
          el: this.panel_changelog_feed
        }
      ];
      let get_headers_html = (item) => {
        let active = item.id == "notifications" ? "active" : "";
        return `<li class="notifications-category ${active}"
   					id="${item.id}"
   					data-toggle="collapse"
   				>${item.label}</li>`;
      };
      let navitem = $(`<ul class="notification-item-tabs nav nav-tabs" role="tablist"></ul>`);
      this.categories = this.categories.map((item) => {
        item.$tab = $(get_headers_html(item));
        item.$tab.on("click", (e) => {
          e.stopImmediatePropagation();
          this.switch_tab(item);
        });
        navitem.append(item.$tab);
        return item;
      });
      navitem.appendTo(this.header_items);
      this.categories.forEach((category) => {
        this.make_tab_view(category);
      });
      this.switch_tab(this.categories[0]);
    }
    switch_tab(item) {
      this.categories.forEach((item2) => {
        item2.$tab.removeClass("active");
      });
      item.$tab.addClass("active");
      Object.keys(this.tabs).forEach((tab_name) => this.tabs[tab_name].hide());
      this.tabs[item.id].show();
    }
    make_tab_view(item) {
      let tabView = new item.view(item.el, this.dropdown, this.notification_settings);
      this.tabs[item.id] = tabView;
    }
    mark_all_as_read(e) {
      e.stopImmediatePropagation();
      let notificationsView = this.tabs.notifications;
      this.dropdown_list.find(".notification-item.unread").each((idx, el) => {
        const $el = $(el);
        const docname = $el.data("name");
        notificationsView.mark_as_read(docname, $el);
      });
      frappe.call("frappe.desk.doctype.notification_log.notification_log.mark_all_as_read").then(() => {
        this.tabs.notifications.update_badge();
      });
    }
    setup_dropdown_events() {
      this.dropdown.on("hide.bs.dropdown", (e) => {
        let hide = $(e.currentTarget).data("closable");
        $(e.currentTarget).data("closable", true);
        return hide;
      });
      this.dropdown.on("click", (e) => {
        $(e.currentTarget).data("closable", true);
      });
    }
  };
  frappe.ui.notifications = {
    get_notification_config() {
      return frappe.xcall("frappe.desk.notifications.get_notification_info").then((r) => {
        frappe.ui.notifications.config = r;
        return r;
      });
    },
    show_open_count_list(doctype) {
      if (!frappe.ui.notifications.config) {
        this.get_notification_config().then(() => {
          this.route_to_list_with_filters(doctype);
        });
      } else {
        this.route_to_list_with_filters(doctype);
      }
    },
    route_to_list_with_filters(doctype) {
      let filters = frappe.ui.notifications.config["conditions"][doctype];
      if (filters && $.isPlainObject(filters)) {
        if (!frappe.route_options) {
          frappe.route_options = {};
        }
        $.extend(frappe.route_options, filters);
      }
      frappe.set_route("List", doctype);
    }
  };
  var BaseNotificationsView = class {
    constructor(wrapper, parent, settings) {
      this.wrapper = wrapper;
      this.parent = parent;
      this.settings = settings;
      this.max_length = 20;
      this.container = $(`<div></div>`).appendTo(this.wrapper);
      this.make();
    }
    show() {
      this.container.show();
    }
    hide() {
      this.container.hide();
    }
  };
  var NotificationsView = class extends BaseNotificationsView {
    make() {
      this.notifications_icon = this.parent.find(".notifications-icon");
      this.notifications_icon.attr("title", __("Notifications")).tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
      this.setup_notification_listeners();
      this.create_badge();
      this.get_notifications_list(this.max_length).then((r) => {
        if (!r.message)
          return;
        this.dropdown_items = r.message.notification_logs;
        frappe.update_user_info(r.message.user_info);
        this.render_notifications_dropdown();
        if (this.settings.seen == 0 && this.dropdown_items.length > 0) {
          this.toggle_notification_icon(false);
          this.update_badge();
        }
      });
    }
    display_unread_count() {
      this.unreadCountElement = document.createElement("span");
      this.unreadCountElement.classList.add("unread-count");
      $(this.unreadCountElement).css({
        "position": "absolute",
        "top": "-10px",
        "right": "-10px",
        "background-color": "red",
        "color": "white",
        "border-radius": "50%",
        "padding": "2px 6px",
        "font-size": "12px",
        "font-weight": "bold",
        "display": "none"
      });
      this.notifications_icon[0].appendChild(this.unreadCountElement);
      let unreadCount = this.dropdown_items.filter((item) => !item.read).length;
      if (unreadCount > 0) {
        $(this.unreadCountElement).text(unreadCount).css("display", "block");
      } else {
        $(this.unreadCountElement).css("display", "none");
      }
    }
    clear_unread_count() {
      if (this.unreadCountElement) {
        $(this.unreadCountElement).remove();
        this.unreadCountElement = null;
      }
    }
    update_dropdown() {
      this.get_notifications_list(1).then((r) => {
        if (!r.message)
          return;
        let new_item = r.message.notification_logs[0];
        frappe.update_user_info(r.message.user_info);
        this.dropdown_items.unshift(new_item);
        if (this.dropdown_items.length > this.max_length) {
          this.container.find(".recent-notification").last().remove();
          this.dropdown_items.pop();
        }
        this.insert_into_dropdown();
      });
    }
    change_activity_status() {
      if (this.container.find(".activity-status")) {
        this.container.find(".activity-status").replaceWith(
          `<a class="recent-item text-center text-muted"
					href="/app/List/Notification Log">
					<div class="full-log-btn">${__("View Full Log")}</div>
				</a>`
        );
      }
    }
    mark_as_read(docname, $el) {
      frappe.call("frappe.desk.doctype.notification_log.notification_log.mark_as_read", {
        docname
      }).then(() => {
        $el.removeClass("unread");
        this.update_badge();
      });
    }
    insert_into_dropdown() {
      let new_item = this.dropdown_items[0];
      let new_item_html = this.get_dropdown_item_html(new_item);
      $(new_item_html).prependTo(this.container);
      this.change_activity_status();
      this.update_badge();
    }
    get_dropdown_item_html(notification_log) {
      let doc_link = this.get_item_link(notification_log);
      let read_class = notification_log.read ? "" : "unread";
      let message = notification_log.subject;
      let title = message.match(/<b class="subject-title">(.*?)<\/b>/);
      message = title ? message.replace(title[1], frappe.ellipsis(strip_html(title[1]), 100)) : message;
      let timestamp = frappe.datetime.comment_when(notification_log.creation);
      let message_html = `<div class="message">
			<div>${message}</div>
			<div class="notification-timestamp text-muted">
				${timestamp}
			</div>
		</div>`;
      let user = notification_log.from_user;
      let user_avatar = frappe.avatar(user, "avatar-medium user-avatar");
      let item_html = $(`<a class="recent-item notification-item ${read_class}"
				href="${doc_link}"
				data-name="${notification_log.name}"
			>
				<div class="notification-body">
					${user_avatar}
					${message_html}
				</div>
				<div class="mark-as-read" title="${__("Mark as Read")}">
				</div>
			</a>`);
      if (!notification_log.read) {
        let mark_btn = item_html.find(".mark-as-read");
        mark_btn.tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
        mark_btn.on("click", (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.mark_as_read(notification_log.name, item_html);
        });
      }
      item_html.on("click", () => {
        !notification_log.read && this.mark_as_read(notification_log.name, item_html);
        this.notifications_icon.trigger("click");
        console.log("click");
      });
      return item_html;
    }
    render_notifications_dropdown() {
      if (this.settings && !this.settings.enabled) {
        this.container.html(`<li class="recent-item notification-item">
				<span class="text-muted">
					${__("Notifications Disabled")}
				</span></li>`);
      } else {
        if (this.dropdown_items.length) {
          this.container.empty();
          this.dropdown_items.forEach((notification_log) => {
            this.container.append(this.get_dropdown_item_html(notification_log));
          });
          this.container.append(`<a class="list-footer"
					href="/app/List/Notification Log">
						<div class="full-log-btn">${__("See all Activity")}</div>
					</a>`);
        } else {
          this.container.append(
            $(`<div class="notification-null-state">
					<div class="text-center">
						<img src="/assets/frappe/images/ui-states/notification-empty-state.svg" alt="Generic Empty State" class="null-state">
						<div class="title">${__("No New notifications")}</div>
						<div class="subtitle">
							${__("Looks like you haven\u2019t received any notifications.")}
					</div></div></div>`)
          );
        }
      }
    }
    get_notifications_list(limit) {
      return frappe.call(
        "frappe.desk.doctype.notification_log.notification_log.get_notification_logs",
        { limit }
      );
    }
    get_item_link(notification_doc) {
      if (notification_doc.link) {
        return notification_doc.link;
      }
      const link_doctype = notification_doc.document_type ? notification_doc.document_type : "Notification Log";
      const link_docname = notification_doc.document_name ? notification_doc.document_name : notification_doc.name;
      return frappe.utils.get_form_link(link_doctype, link_docname);
    }
    toggle_notification_icon(seen) {
      this.notifications_icon.find(".notifications-seen").toggle(seen);
      this.notifications_icon.find(".notifications-unseen").toggle(!seen);
    }
    toggle_seen(flag) {
      frappe.call(
        "frappe.desk.doctype.notification_settings.notification_settings.set_seen_value",
        {
          value: cint(flag),
          user: frappe.session.user
        }
      );
    }
    create_badge() {
      if (this.notifications_icon.find(".notification-badge").length === 0) {
        const $badge = $('<span class="notification-badge text-center"></span>');
        $badge.css({
          "position": "absolute",
          "top": "0px",
          "right": "-5px",
          "background-color": "red",
          "color": "white",
          "border-radius": "50%",
          "width": "20px",
          "height": "20px",
          "line-height": "20px",
          "z-index": 10,
          "font-weight": "bold",
          "display": "none"
        });
        this.notifications_icon.css("position", "relative");
        this.notifications_icon.append($badge);
        this.badge = $badge;
      }
    }
    update_badge() {
      let unreadCount = this.container.find(".unread").length;
      if (!this.badge)
        this.create_badge();
      if (unreadCount > 0) {
        this.badge.text(unreadCount).show();
      } else {
        this.badge.hide();
      }
    }
    setup_notification_listeners() {
      frappe.realtime.on("notification", () => {
        this.toggle_notification_icon(false);
        this.update_dropdown();
      });
      frappe.realtime.on("indicator_hide", () => {
        this.toggle_notification_icon(true);
        this.update_badge(true);
      });
      this.parent.on("show.bs.dropdown", () => {
        if (this.notifications_icon.find(".notifications-unseen").is(":visible")) {
          this.toggle_notification_icon(true);
          frappe.call(
            "frappe.desk.doctype.notification_log.notification_log.trigger_indicator_hide"
          );
        }
      });
      this.parent.on("hide.bs.dropdown", () => {
        let notificationsView = this;
        this.container.find(".notification-item.unread").each((idx, el) => {
          const $el = $(el);
          const docname = $el.data("name");
          notificationsView.mark_as_read(docname, $el);
        });
      });
    }
  };
  var EventsView = class extends BaseNotificationsView {
    make() {
      let today = frappe.datetime.get_today();
      frappe.call({
        method: "frappe.desk.doctype.event.event.get_events",
        args: {
          start: today,
          end: today
        },
        type: "GET",
        callback: ({ message }) => {
          this.render_events_html(message);
        }
      });
    }
    render_events_html(event_list) {
      let html = "";
      if (event_list.length) {
        let get_event_html = (event) => {
          let time = __("All Day");
          if (!event.all_day) {
            let start_time = frappe.datetime.get_time(event.starts_on);
            let days_diff = frappe.datetime.get_day_diff(event.ends_on, event.starts_on);
            let end_time = frappe.datetime.get_time(event.ends_on);
            if (days_diff > 1) {
              end_time = __("Rest of the day");
            }
            time = `${start_time} - ${end_time}`;
          }
          let particpants = "";
          if (event.particpants) {
            particpants = frappe.avatar_group(event.particpants, 3);
          }
          let location2 = "";
          if (event.location) {
            location2 = `, ${event.location}`;
          }
          return `<a class="recent-item event" href="/app/event/${event.name}">
					<div class="event-border" style="border-color: ${event.color}"></div>
					<div class="event-item">
						<div class="event-subject">${event.subject}</div>
						<div class="event-time">${time}${location2}</div>
						${particpants}
					</div>
				</a>`;
        };
        html = event_list.map(get_event_html).join("");
      } else {
        html = `
				<div class="notification-null-state">
					<div class="text-center">
					<img src="/assets/frappe/images/ui-states/event-empty-state.svg" alt="Generic Empty State" class="null-state">
					<div class="title">${__("No Upcoming Events")}</div>
					<div class="subtitle">
						${__("There are no upcoming events for you.")}
				</div></div></div>
			`;
      }
      this.container.html(html);
    }
  };
  var ChangelogFeedView = class extends BaseNotificationsView {
    make() {
      this.render_changelog_feed_html(frappe.boot.changelog_feed || []);
    }
    render_changelog_feed_html(changelog_feed) {
      let html = "";
      if (changelog_feed.length) {
        this.container.empty();
        const get_changelog_feed_html = (changelog_feed_item) => {
          const timestamp = frappe.datetime.prettyDate(
            changelog_feed_item.posting_timestamp
          );
          const message_html = `<div class="message">
							<div>${changelog_feed_item.title}</div>
							<div class="notification-timestamp text-muted">
							${changelog_feed_item.app_title} | ${timestamp}
							</div>
						</div>`;
          const item_html = `<a class="recent-item notification-item"
								href="${changelog_feed_item.link}"
								data-name="${changelog_feed_item.title}"
								target="_blank" rel="noopener noreferrer"
							>
							<div class="notification-body">
								${message_html}
							</div>
							</div>
						</a>`;
          return item_html;
        };
        html = changelog_feed.map(get_changelog_feed_html).join("");
      } else {
        html = `<div class="notification-null-state">
						<div class="text-center">
							<img src="/assets/frappe/images/ui-states/notification-empty-state.svg" alt="Generic Empty State" class="null-state">
							<div class="title">${__("Nothing New")}</div>
							<div class="subtitle">
								${__("There is nothing new to show you right now.")}
							</div>
						</div>
					</div>
					`;
      }
      this.container.html(html);
    }
  };

  // ../superproject/superproject/public/js/superproject/ui/page.js
  frappe.ui.make_app_page = function(opts) {
    opts.parent.page = new frappe.ui.Page(opts);
    return opts.parent.page;
  };
  frappe.ui.pages = {};
  frappe.ui.Page = class Page {
    constructor(opts) {
      $.extend(this, opts);
      this.set_document_title = true;
      this.buttons = {};
      this.fields_dict = {};
      this.views = {};
      this.make();
      frappe.ui.pages[frappe.get_route_str()] = this;
    }
    make() {
      this.wrapper = $(this.parent);
      this.add_main_section();
      this.setup_scroll_handler();
      this.setup_sidebar_toggle();
    }
    setup_scroll_handler() {
      let last_scroll = 0;
      $(window).scroll(
        frappe.utils.throttle(() => {
          $(".page-head").toggleClass("drop-shadow", !!document.documentElement.scrollTop);
          let current_scroll = document.documentElement.scrollTop;
          if (current_scroll > 0 && last_scroll <= current_scroll) {
            $(".page-head").css("top", "-15px");
          } else {
            $(".page-head").css("top", "var(--navbar-height)");
          }
          last_scroll = current_scroll;
        }, 500)
      );
    }
    get_empty_state(title, message, primary_action) {
      return $(`<div class="page-card-container">
  			<div class="page-card">
  				<div class="page-card-head">
  					<span class="indicator blue">
  						${title}</span>
  				</div>
  				<p>${message}</p>
  				<div>
  					<button class="btn btn-primary btn-sm">${primary_action}</button>
  				</div>
  			</div>
  		</div>`);
    }
    load_lib(callback) {
      frappe.require(this.required_libs, callback);
    }
    add_main_section() {
      $(frappe.render_template("page", {})).appendTo(this.wrapper);
      if (this.single_column) {
        this.add_view(
          "main",
          '<div class="row layout-main">					<div class="col-md-12 layout-main-section-wrapper">						<div class="layout-main-section"></div>						<div class="layout-footer hide"></div>					</div>				</div>'
        );
      } else {
        this.add_view(
          "main",
          `
				<div class="row layout-main">
					<div class="col-lg-2 layout-side-section"></div>
					<div class="col layout-main-section-wrapper">
						<div class="layout-main-section"></div>
						<div class="layout-footer hide"></div>
					</div>
				</div>
			`
        );
      }
      this.setup_page();
    }
    setup_page() {
      this.$title_area = this.wrapper.find(".title-area");
      this.$sub_title_area = this.wrapper.find("h6");
      if (this.title)
        this.set_title(this.title);
      if (this.icon)
        this.get_main_icon(this.icon);
      this.body = this.main = this.wrapper.find(".layout-main-section");
      this.container = this.wrapper.find(".page-body");
      this.sidebar = this.wrapper.find(".layout-side-section");
      this.footer = this.wrapper.find(".layout-footer");
      this.indicator = this.wrapper.find(".indicator-pill");
      this.page_actions = this.wrapper.find(".page-actions");
      this.btn_primary = this.page_actions.find(".primary-action");
      this.btn_secondary = this.page_actions.find(".btn-secondary");
      this.menu = this.page_actions.find(".menu-btn-group .dropdown-menu");
      this.menu_btn_group = this.page_actions.find(".menu-btn-group");
      this.actions = this.page_actions.find(".actions-btn-group .dropdown-menu");
      this.actions_btn_group = this.page_actions.find(".actions-btn-group");
      this.standard_actions = this.page_actions.find(".standard-actions");
      this.custom_actions = this.page_actions.find(".custom-actions");
      this.page_form = $('<div class="page-form row hide"></div>').prependTo(this.main);
      this.inner_toolbar = this.custom_actions;
      this.icon_group = this.page_actions.find(".page-icon-group");
      if (this.make_page) {
        this.make_page();
      }
      this.card_layout && this.main.addClass("frappe-card");
      let menu_btn = this.menu_btn_group.find("button");
      menu_btn.attr("title", __("Menu")).tooltip({ delay: { show: 600, hide: 100 } });
      frappe.ui.keys.get_shortcut_group(this.page_actions[0]).add(menu_btn, menu_btn.find(".menu-btn-group-label"));
      let action_btn = this.actions_btn_group.find("button");
      frappe.ui.keys.get_shortcut_group(this.page_actions[0]).add(action_btn, action_btn.find(".actions-btn-group-label"));
      this.skip_link_to_main = $("<button>").addClass("sr-only sr-only-focusable btn btn-primary-light my-2").text(__("Navigate to main content")).attr({ tabindex: 0, role: "link" }).on("click", (e) => {
        e.preventDefault();
        const main = this.main.get(0);
        main.setAttribute("tabindex", -1);
        main.focus();
        main.addEventListener(
          "blur",
          () => {
            main.removeAttribute("tabindex");
          },
          { once: true }
        );
      }).appendTo(this.sidebar);
    }
    setup_sidebar_toggle() {
      let sidebar_toggle = $(".sidebar-toggle-btn");
      let sidebar_wrapper = this.wrapper.find(".layout-side-section");
      if (this.disable_sidebar_toggle || !sidebar_wrapper.length) {
        sidebar_toggle.last().remove();
        this.wrapper.addClass("no-list-sidebar");
      } else {
        if (!frappe.is_mobile()) {
          sidebar_toggle.attr("title", __("Toggle Sidebar"));
        }
        sidebar_toggle.attr("aria-label", __("Toggle Sidebar"));
        sidebar_toggle.tooltip({
          delay: { show: 600, hide: 100 },
          trigger: "hover"
        });
        sidebar_toggle.click(() => {
          if (frappe.utils.is_xs() || frappe.utils.is_sm()) {
            this.setup_overlay_sidebar();
          } else {
            sidebar_wrapper.toggle();
          }
          $(document.body).trigger("toggleSidebar");
          this.update_sidebar_icon();
        });
      }
    }
    setup_overlay_sidebar() {
      this.sidebar.find(".close-sidebar").remove();
      let overlay_sidebar = this.sidebar.find(".overlay-sidebar").addClass("opened");
      $('<div class="close-sidebar">').hide().appendTo(this.sidebar).fadeIn();
      let scroll_container = $("html").css("overflow-y", "hidden");
      this.sidebar.find(".close-sidebar").on("click", (e) => this.close_sidebar(e));
      this.sidebar.on("click", "button:not(.dropdown-toggle)", (e) => this.close_sidebar(e));
      this.close_sidebar = () => {
        scroll_container.css("overflow-y", "");
        this.sidebar.find("div.close-sidebar").fadeOut(() => {
          overlay_sidebar.removeClass("opened").find(".dropdown-toggle").removeClass("text-muted");
        });
      };
    }
    update_sidebar_icon() {
      let sidebar_toggle = $(".sidebar-toggle-btn");
      let sidebar_toggle_icon = sidebar_toggle.find(".sidebar-toggle-icon");
      let sidebar_wrapper = this.wrapper.find(".layout-side-section");
      let is_sidebar_visible = $(sidebar_wrapper).is(":visible");
      sidebar_toggle_icon.html(
        frappe.utils.icon(
          is_sidebar_visible ? "es-line-sidebar-collapse" : "es-line-sidebar-expand",
          "md"
        )
      );
    }
    set_indicator(label, color) {
      this.clear_indicator().removeClass("hide").html(`<span>${label}</span>`).addClass(color);
    }
    add_action_icon(icon, click, css_class = "", tooltip_label) {
      const button = $(`
			<button class="text-muted btn btn-default ${css_class} icon-btn">
				${frappe.utils.icon(icon)}
			</button>
		`);
      if (!tooltip_label) {
        if (icon.startsWith("es-")) {
          icon = icon.replace("es-line-", "");
          icon = icon.replace("es-solid-", "");
          icon = icon.replace("es-small-", "");
        }
        tooltip_label = frappe.unscrub(icon);
      }
      button.appendTo(this.icon_group.removeClass("hide"));
      button.click(click);
      button.attr("title", __(tooltip_label)).tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
      return button;
    }
    clear_indicator() {
      return this.indicator.removeClass().addClass("indicator-pill no-indicator-dot whitespace-nowrap hide");
    }
    get_icon_label(icon, label) {
      let icon_name = icon;
      let size = "xs";
      if (typeof icon === "object") {
        icon_name = icon.icon;
        size = icon.size || "xs";
      }
      return `${icon ? frappe.utils.icon(icon_name, size) : ""} <span class="hidden-xs"> ${__(
        label
      )} </span>`;
    }
    set_action(btn, opts) {
      let me = this;
      if (opts.icon) {
        opts.iconHTML = this.get_icon_label(opts.icon, opts.label);
      }
      this.clear_action_of(btn);
      btn.removeClass("hide").prop("disabled", false).html(opts.iconHTML || opts.label).attr("data-label", opts.label).on("click", function() {
        let response = opts.click.apply(this, [btn]);
        me.btn_disable_enable(btn, response);
      });
      if (opts.working_label) {
        btn.attr("data-working-label", opts.working_label);
      }
      let text_span = btn.find("span");
      frappe.ui.keys.get_shortcut_group(this).add(btn, text_span.length ? text_span : btn);
    }
    set_primary_action(label, click, icon, working_label) {
      this.set_action(this.btn_primary, {
        label,
        click,
        icon,
        working_label
      });
      return this.btn_primary;
    }
    set_secondary_action(label, click, icon, working_label) {
      this.set_action(this.btn_secondary, {
        label,
        click,
        icon,
        working_label
      });
      return this.btn_secondary;
    }
    clear_action_of(btn) {
      btn.addClass("hide").unbind("click").removeAttr("data-working-label");
    }
    clear_primary_action() {
      this.clear_action_of(this.btn_primary);
    }
    clear_secondary_action() {
      this.clear_action_of(this.btn_secondary);
    }
    clear_actions() {
      this.clear_primary_action();
      this.clear_secondary_action();
    }
    clear_custom_actions() {
      this.custom_actions.addClass("hide").empty();
    }
    clear_icons() {
      this.icon_group.addClass("hide").empty();
    }
    add_menu_item(label, click, standard, shortcut, show_parent) {
      return this.add_dropdown_item({
        label,
        click,
        standard,
        parent: this.menu,
        shortcut,
        show_parent
      });
    }
    add_custom_menu_item(parent, label, click, standard, shortcut, icon = null) {
      return this.add_dropdown_item({
        label,
        click,
        standard,
        parent,
        shortcut,
        icon
      });
    }
    clear_menu() {
      this.clear_btn_group(this.menu);
    }
    show_menu() {
      this.menu_btn_group.removeClass("hide");
    }
    hide_menu() {
      this.menu_btn_group.addClass("hide");
    }
    show_icon_group() {
      this.icon_group.removeClass("hide");
    }
    hide_icon_group() {
      this.icon_group.addClass("hide");
    }
    show_actions_menu() {
      this.actions_btn_group.removeClass("hide");
    }
    hide_actions_menu() {
      this.actions_btn_group.addClass("hide");
    }
    add_action_item(label, click, standard) {
      return this.add_dropdown_item({
        label,
        click,
        standard,
        parent: this.actions
      });
    }
    add_actions_menu_item(label, click, standard, shortcut) {
      return this.add_dropdown_item({
        label,
        click,
        standard,
        shortcut,
        parent: this.actions,
        show_parent: false
      });
    }
    clear_actions_menu() {
      this.clear_btn_group(this.actions);
    }
    add_dropdown_item({
      label,
      click,
      standard,
      parent,
      shortcut,
      show_parent = true,
      icon = null
    }) {
      if (show_parent) {
        parent.parent().removeClass("hide hidden-xl");
      }
      let $link = this.is_in_group_button_dropdown(parent, "li > a.grey-link > span", label);
      if ($link)
        return $link;
      let $li;
      let $icon = ``;
      if (icon) {
        $icon = `<span class="menu-item-icon">${frappe.utils.icon(icon)}</span>`;
      }
      if (shortcut) {
        let shortcut_obj = this.prepare_shortcut_obj(shortcut, click, label);
        $li = $(`
				<li>
					<a class="grey-link dropdown-item" href="#" onClick="return false;">
						${$icon}
						<span class="menu-item-label">${label}</span>
						<kbd class="pull-right">
							<span>${shortcut_obj.shortcut_label}</span>
						</kbd>
					</a>
				</li>
			`);
        frappe.ui.keys.add_shortcut(shortcut_obj);
      } else {
        $li = $(`
				<li>
					<a class="grey-link dropdown-item" href="#" onClick="return false;">
						${$icon}
						<span class="menu-item-label">${label}</span>
					</a>
				</li>
			`);
      }
      $link = $li.find("a").on("click", (e) => {
        if (e.ctrlKey || e.metaKey) {
          frappe.open_in_new_tab = true;
        }
        return click();
      });
      if (standard) {
        $li.appendTo(parent);
      } else {
        this.divider = parent.find(".dropdown-divider");
        if (!this.divider.length) {
          this.divider = $('<li class="dropdown-divider user-action"></li>').prependTo(
            parent
          );
        }
        $li.addClass("user-action").insertBefore(this.divider);
      }
      if (!shortcut) {
        frappe.ui.keys.get_shortcut_group(parent.get(0)).add($link, $link.find(".menu-item-label"));
      }
      return $link;
    }
    prepare_shortcut_obj(shortcut, click, label) {
      let shortcut_obj;
      if (typeof shortcut === "string") {
        shortcut_obj = { shortcut };
      } else {
        shortcut_obj = shortcut;
      }
      if (frappe.utils.is_mac()) {
        shortcut_obj.shortcut_label = shortcut_obj.shortcut.replace("Ctrl", "\u2318").replace("Alt", "\u2325");
      } else {
        shortcut_obj.shortcut_label = shortcut_obj.shortcut;
      }
      shortcut_obj.shortcut_label = shortcut_obj.shortcut_label.replace("Shift", "\u21E7");
      shortcut_obj.shortcut = shortcut_obj.shortcut.toLowerCase();
      if (!shortcut_obj.action) {
        shortcut_obj.action = click;
      }
      shortcut_obj.page = this;
      return shortcut_obj;
    }
    is_in_group_button_dropdown(parent, selector, label) {
      if (!selector)
        selector = "li";
      if (!label || !parent)
        return false;
      const item_selector = `${selector}[data-label="${encodeURIComponent(label)}"]`;
      const existing_items = $(parent).find(item_selector);
      return (existing_items == null ? void 0 : existing_items.length) > 0 && existing_items;
    }
    clear_btn_group(parent) {
      parent.empty();
      parent.parent().addClass("hide");
    }
    add_divider() {
      return $('<li class="dropdown-divider"></li>').appendTo(this.menu);
    }
    get_or_add_inner_group_button(label) {
      var $group = this.inner_toolbar.find(
        `.inner-group-button[data-label="${encodeURIComponent(label)}"]`
      );
      if (!$group.length) {
        $group = $(
          `<div class="inner-group-button" data-label="${encodeURIComponent(label)}">
					<button type="button" class="btn btn-default ellipsis" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						${label}
						${frappe.utils.icon("select", "xs")}
					</button>
					<div role="menu" class="dropdown-menu"></div>
				</div>`
        ).appendTo(this.inner_toolbar);
      }
      return $group;
    }
    get_inner_group_button(label) {
      return this.inner_toolbar.find(
        `.inner-group-button[data-label="${encodeURIComponent(label)}"]`
      );
    }
    set_inner_btn_group_as_primary(label) {
      this.get_or_add_inner_group_button(label).find("button").removeClass("btn-default").addClass("btn-primary");
    }
    btn_disable_enable(btn, response) {
      if (response && response.then) {
        btn.prop("disabled", true);
        response.then(() => {
          btn.prop("disabled", false);
        });
      } else if (response && response.always) {
        btn.prop("disabled", true);
        response.always(() => {
          btn.prop("disabled", false);
        });
      }
    }
    add_inner_button(label, action, group, type = "default") {
      var me = this;
      let _action = function() {
        let btn = $(this);
        let response = action();
        me.btn_disable_enable(btn, response);
      };
      let menu_item_label = group ? `${group} > ${label}` : label;
      let menu_item = this.add_menu_item(menu_item_label, _action, false, false, false);
      menu_item.parent().addClass("hidden-xl");
      if (this.menu_btn_group.hasClass("hide")) {
        this.menu_btn_group.removeClass("hide").addClass("hidden-xl");
      }
      if (group) {
        var $group = this.get_or_add_inner_group_button(group);
        $(this.inner_toolbar).removeClass("hide");
        if (!this.is_in_group_button_dropdown($group.find(".dropdown-menu"), "a", label)) {
          return $(
            `<a class="dropdown-item" href="#" onclick="return false;" data-label="${encodeURIComponent(
              label
            )}">${label}</a>`
          ).on("click", _action).appendTo($group.find(".dropdown-menu"));
        }
      } else {
        let button = this.inner_toolbar.find(
          `button[data-label="${encodeURIComponent(label)}"]`
        );
        if (button.length == 0) {
          button = $(`<button data-label="${encodeURIComponent(
            label
          )}" class="btn btn-${type} ellipsis">
					${__(label)}
				</button>`);
          button.on("click", _action);
          button.appendTo(this.inner_toolbar.removeClass("hide"));
        }
        return button;
      }
    }
    remove_inner_button(label, group) {
      if (typeof label === "string") {
        label = [label];
      }
      label = label.map((l) => __(l));
      if (group) {
        var $group = this.get_inner_group_button(__(group));
        if ($group.length) {
          $group.find(`.dropdown-item[data-label="${encodeURIComponent(label)}"]`).remove();
        }
        if ($group.find(".dropdown-item").length === 0)
          $group.remove();
      } else {
        this.inner_toolbar.find(`button[data-label="${encodeURIComponent(label)}"]`).remove();
      }
    }
    change_inner_button_type(label, group, type) {
      let btn;
      if (group) {
        var $group = this.get_inner_group_button(__(group));
        if ($group.length) {
          btn = $group.find(`.dropdown-item[data-label="${encodeURIComponent(label)}"]`);
        }
      } else {
        btn = this.inner_toolbar.find(`button[data-label="${encodeURIComponent(label)}"]`);
      }
      if (btn) {
        btn.removeClass().addClass(`btn btn-${type} ellipsis`);
      }
    }
    add_inner_message(message) {
      let $message = $(`<span class='inner-page-message text-muted small'>${message}</div>`);
      this.inner_toolbar.find(".inner-page-message").remove();
      this.inner_toolbar.removeClass("hide").prepend($message);
      return $message;
    }
    clear_inner_toolbar() {
      this.inner_toolbar.empty().addClass("hide");
    }
    clear_user_actions() {
      this.menu.find(".user-action").remove();
    }
    get_title_area() {
      return this.$title_area;
    }
    set_title(title, icon = null, strip = true, tab_title = "", tooltip_label = "") {
      if (!title)
        title = "";
      if (strip) {
        title = strip_html(title);
      }
      this.title = title;
      frappe.utils.set_title(tab_title || title);
      if (icon) {
        title = `${frappe.utils.icon(icon)} ${title}`;
      }
      let title_wrapper = this.$title_area.find(".title-text");
      title_wrapper.html(title);
      title_wrapper.attr("title", __(tooltip_label) || this.title);
      if (tooltip_label) {
        title_wrapper.tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
      }
    }
    set_title_sub(txt) {
      this.$sub_title_area.html(txt).toggleClass("hide", !!!txt);
    }
    get_main_icon(icon) {
      return this.$title_area.find(".title-icon").html('<i class="' + icon + ' fa-fw"></i> ').toggle(true);
    }
    add_help_button(txt) {
    }
    add_button(label, click, opts) {
      if (!opts)
        opts = {};
      let button = $(`<button
			class="btn ${opts.btn_class || "btn-default"} ${opts.btn_size || "btn-sm"} ellipsis">
				${opts.icon ? frappe.utils.icon(opts.icon) : ""}
				${label}
		</button>`);
      let menu_item = this.add_menu_item(label, click, false);
      menu_item.parent().addClass("hidden-xl");
      button.appendTo(this.custom_actions);
      button.on("click", click);
      this.custom_actions.removeClass("hide");
      return button;
    }
    add_custom_button_group(label, icon, parent) {
      let dropdown_label = `<span class="hidden-xs">
			<span class="custom-btn-group-label">${__(label)}</span>
			${frappe.utils.icon("select", "xs")}
		</span>`;
      if (icon) {
        dropdown_label = `<span class="hidden-xs">
				${frappe.utils.icon(icon)}
				<span class="custom-btn-group-label">${__(label)}</span>
				${frappe.utils.icon("select", "xs")}
			</span>
			<span class="visible-xs">
				${frappe.utils.icon(icon)}
			</span>`;
      }
      let custom_btn_group = $(`
			<div class="custom-btn-group">
				<button type="button" class="btn btn-default btn-sm ellipsis" data-toggle="dropdown" aria-expanded="false">
					${dropdown_label}
				</button>
				<ul class="dropdown-menu" role="menu"></ul>
			</div>
		`);
      if (!parent)
        parent = this.custom_actions;
      parent.removeClass("hide").append(custom_btn_group);
      return custom_btn_group.find(".dropdown-menu");
    }
    add_dropdown_button(parent, label, click, icon) {
      frappe.ui.toolbar.add_dropdown_button(parent, label, click, icon);
    }
    add_label(label) {
      this.show_form();
      return $("<label class='col-md-1 page-only-label'>" + label + " </label>").appendTo(
        this.page_form
      );
    }
    add_select(label, options) {
      var field = this.add_field({ label, fieldtype: "Select" });
      return field.$wrapper.find("select").empty().add_options(options);
    }
    add_data(label) {
      var field = this.add_field({ label, fieldtype: "Data" });
      return field.$wrapper.find("input").attr("placeholder", label);
    }
    add_date(label, date) {
      var field = this.add_field({ label, fieldtype: "Date", default: date });
      return field.$wrapper.find("input").attr("placeholder", label);
    }
    add_check(label) {
      return $("<div class='checkbox'><label><input type='checkbox'>" + label + "</label></div>").appendTo(this.page_form).find("input");
    }
    add_break() {
      this.page_form.append('<div class="clearfix invisible-xs"></div>');
    }
    add_field(df, parent) {
      this.show_form();
      if (!df.placeholder) {
        df.placeholder = df.label;
      }
      df.input_class = "input-xs";
      var f = frappe.ui.form.make_control({
        df,
        parent: parent || this.page_form,
        only_input: df.fieldtype == "Check" ? false : true
      });
      f.refresh();
      $(f.wrapper).addClass("col-md-2").attr("title", __(df.label, null, df.parent)).tooltip({
        delay: { show: 600, hide: 100 },
        trigger: "hover"
      });
      if (df.fieldtype == "HTML") {
        return;
      }
      if (!f.$input)
        f.make_input();
      f.$input.attr("placeholder", __(df.label, null, df.parent));
      if (df.fieldtype === "Check") {
        $(f.wrapper).find(":first-child").removeClass("col-md-offset-4 col-md-8");
      }
      if (df.fieldtype == "Button") {
        $(f.wrapper).find(".page-control-label").html("&nbsp;");
        f.$input.addClass("btn-xs").css({ width: "100%", "margin-top": "-1px" });
      }
      if (df["default"])
        f.set_input(df["default"]);
      this.fields_dict[df.fieldname || df.label] = f;
      return f;
    }
    clear_fields() {
      this.page_form.empty();
    }
    show_form() {
      this.page_form.removeClass("hide");
    }
    hide_form() {
      this.page_form.addClass("hide");
    }
    get_form_values() {
      var values = {};
      for (let fieldname in this.fields_dict) {
        let field = this.fields_dict[fieldname];
        values[fieldname] = field.get_value();
      }
      return values;
    }
    add_view(name, html) {
      let element = html;
      if (typeof html === "string") {
        element = $(html);
      }
      this.views[name] = element.appendTo($(this.wrapper).find(".page-content"));
      if (!this.current_view) {
        this.current_view = this.views[name];
      } else {
        this.views[name].toggle(false);
      }
      return this.views[name];
    }
    set_view(name) {
      if (this.current_view_name === name)
        return;
      this.current_view && this.current_view.toggle(false);
      this.current_view = this.views[name];
      this.previous_view_name = this.current_view_name;
      this.current_view_name = name;
      this.views[name].toggle(true);
      this.wrapper.trigger("view-change");
    }
  };

  // frappe-html:/workspace/development/frappe-bench/apps/superproject/superproject/public/js/superproject/ui/page.html
  frappe.templates["page"] = `<div class="page-head flex">
	<div class="container">
		<div class="row flex align-center page-head-content justify-between">
			<div class="col-md-4 col-sm-6 col-xs-7 page-title">
				<!-- <div class="title-image hide hidden-md hidden-lg"></div> -->
				<!-- title -->
				<button class="btn-reset sidebar-toggle-btn" style="display:none;">
					<svg class="es-icon icon-md sidebar-toggle-placeholder">
						<use href="#es-line-align-justify"></use>
					</svg>
					<span class="sidebar-toggle-icon">
						<svg class="es-icon icon-md">
							<use href="#es-line-sidebar-collapse">
							</use>
						</svg>
					</span>
				</button>
				<div class="flex fill-width title-area">
					<div>
						<div class="flex">
							<h3 class="ellipsis title-text" style="max-width: 50vw;"></h3>
							<span class="indicator-pill whitespace-nowrap"></span>
						</div>
						<div class="ellipsis sub-heading hide text-muted"></div>
					</div>
					<button class="btn btn-default more-button hide">
						<svg class="icon icon-sm">
							<use href="#icon-dot-horizontal">
							</use>
						</svg>
					</button>
				</div>
			</div>
			<div class="flex col page-actions justify-content-end">
				<!-- buttons -->
				<div class="custom-actions hide hidden-xs hidden-md"></div>
				<div class="standard-actions flex">
					<span class="page-icon-group hide hidden-xs hidden-sm"></span>
					<div class="menu-btn-group hide">
						<button type="button" class="btn btn-default icon-btn" data-toggle="dropdown" aria-expanded="false" aria-label="{{ __("Menu") }}">
							<span>
								<span class="menu-btn-group-label">
									<svg class="icon icon-sm">
										<use href="#icon-dot-horizontal">
										</use>
									</svg>
								</span>
							</span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>
					</div>
					<button class="btn btn-secondary btn-default btn-sm hide"></button>
					<div class="actions-btn-group hide">
						<button type="button" class="btn btn-primary btn-sm" data-toggle="dropdown" aria-expanded="false">
							<span>
								<span class="hidden-xs actions-btn-group-label">{%= __("Actions") %}</span>
								<svg class="icon icon-xs">
									<use href="#icon-select">
									</use>
								</svg>
							</span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right" role="menu">
						</ul>
					</div>
					<button class="btn btn-primary btn-sm hide primary-action"></button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="container page-body">
	<div class="page-toolbar hide">
		<div class="container">
		</div>
	</div>
	<div class="page-wrapper">
		<div class="page-content">
			<div class="workflow-button-area btn-group pull-right hide"></div>
			<div class="clearfix"></div>
		</div>
	</div>
</div>
`;

  // ../superproject/superproject/public/js/superproject/form/controls/attach.js
  frappe.ui.form.ControlAttach = class ControlAttach extends frappe.ui.form.ControlData {
    make_input() {
      let me = this;
      this.$input = $('<button class="btn btn-default btn-sm btn-attach">').html(__("B\u1EA5m \u0111\u1EC3 t\u1EA3i l\xEAn")).prependTo(me.input_area).on({
        click: function() {
          me.on_attach_click();
        },
        attach_doc_image: function() {
          me.on_attach_doc_image();
        }
      });
      this.$value = $(
        `<div class="attached-file flex justify-between align-center">
				<div class="ellipsis">
				${frappe.utils.icon("es-line-link", "sm")}
					<a class="attached-file-link" target="_blank"></a>
				</div>
				<div>
					<a class="btn btn-xs btn-default" data-action="clear_attachment">${__("Clear")}</a>
				</div>
			</div>`
      ).prependTo(me.input_area).toggle(false);
      this.input = this.$input.get(0);
      this.set_input_attributes();
      this.has_input = true;
      frappe.utils.bind_actions_with_object(this.$value, this);
      this.toggle_reload_button();
    }
    clear_attachment() {
      let me = this;
      frappe.confirm(__("Are you sure you want to delete the attachment?"), function() {
        if (me.frm) {
          me.parse_validate_and_set_in_model(null);
          me.refresh();
          me.frm.attachments.remove_attachment_by_filename(me.value, async () => {
            await me.parse_validate_and_set_in_model(null);
            me.refresh();
            me.frm.doc.docstatus == 1 ? me.frm.save("Update") : me.frm.save();
          });
        } else {
          me.dataurl = null;
          me.fileobj = null;
          me.set_input(null);
          me.parse_validate_and_set_in_model(null);
          me.refresh();
        }
      });
    }
    reload_attachment() {
      if (this.file_uploader) {
        this.file_uploader.uploader.upload_files();
      }
    }
    on_attach_click() {
      this.set_upload_options();
      this.file_uploader = new frappe.ui.FileUploader(this.upload_options);
    }
    on_attach_doc_image() {
      this.set_upload_options();
      this.upload_options.restrictions.allowed_file_types = ["image/*"];
      this.file_uploader = new frappe.ui.FileUploader(this.upload_options);
    }
    set_upload_options() {
      let options = {
        allow_multiple: false,
        on_success: (file) => {
          this.on_upload_complete(file);
          this.toggle_reload_button();
        },
        restrictions: {}
      };
      if (this.frm) {
        options.doctype = this.frm.doctype;
        options.docname = this.frm.docname;
        options.fieldname = this.df.fieldname;
        options.make_attachments_public = this.df.make_attachment_public ? 1 : this.frm.meta.make_attachments_public;
      }
      if (this.df.options) {
        Object.assign(options, this.df.options);
      }
      this.upload_options = options;
    }
    set_input(value, dataurl) {
      this.last_value = this.value;
      this.value = value;
      if (this.value) {
        let file_url_parts = this.value.match(/^([^:]+),(.+):(.+)$/);
        let filename;
        if (file_url_parts) {
          filename = file_url_parts[1];
          dataurl = file_url_parts[2] + ":" + file_url_parts[3];
        }
        if (this.$input && this.$value) {
          this.$input.toggle(false);
          this.$value.toggle(true).find(".attached-file-link").text(filename || this.value).attr("href", dataurl || this.value);
        } else {
          this.$wrapper.html(`
					<div class="attached-file flex justify-between align-center">
						<div class="ellipsis">
							<a target="_blank"></a>
						</div>
					</div>
				`);
          this.$wrapper.find("a").text(filename || this.value).attr("href", dataurl || this.value);
        }
      } else {
        this.$input.toggle(true);
        this.$value.toggle(false);
      }
    }
    get_value() {
      return this.value || null;
    }
    async on_upload_complete(attachment) {
      if (this.frm) {
        await this.parse_validate_and_set_in_model(attachment.file_url);
        this.frm.attachments.update_attachment(attachment);
        this.frm.doc.docstatus == 1 ? this.frm.save("Update") : this.frm.save();
      }
      this.set_value(attachment.file_url);
    }
    toggle_reload_button() {
      this.$value.find('[data-action="reload_attachment"]').toggle(this.file_uploader && this.file_uploader.uploader.files.length > 0);
    }
  };

  // ../superproject/superproject/public/js/superproject/custom.js
  frappe.router.render = function() {
    if (this.current_route[0]) {
      this.render_page();
    } else {
      frappe.set_route(["app", "module-list"]);
    }
    if (frappe.get_route_str() === "module-list") {
      frappe.ui.toolbar.setup_custom_menu_bar(true);
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    if (frappe.Application) {
      frappe.Application.prototype.redirect_to_login = function() {
        window.location.href = `/login?`;
      };
    }
  });

  // ../superproject/superproject/public/js/superproject/list/bulk_operations.js
  var BulkOperations = class {
    constructor({ doctype }) {
      if (!doctype)
        frappe.throw(__("Doctype required"));
      this.doctype = doctype;
    }
    print(docs) {
      const print_settings = frappe.model.get_doc(":Print Settings", "Print Settings");
      const allow_print_for_draft = cint(print_settings.allow_print_for_draft);
      const is_submittable = frappe.model.is_submittable(this.doctype);
      const allow_print_for_cancelled = cint(print_settings.allow_print_for_cancelled);
      const letterheads = this.get_letterhead_options();
      const MAX_PRINT_LIMIT = 500;
      const BACKGROUND_PRINT_THRESHOLD = 25;
      const valid_docs = docs.filter((doc) => {
        return !is_submittable || doc.docstatus === 1 || allow_print_for_cancelled && doc.docstatus == 2 || allow_print_for_draft && doc.docstatus == 0 || frappe.user.has_role("Administrator");
      }).map((doc) => doc.name);
      const invalid_docs = docs.filter((doc) => !valid_docs.includes(doc.name));
      if (invalid_docs.length > 0) {
        frappe.msgprint(__("You selected Draft or Cancelled documents"));
        return;
      }
      if (valid_docs.length === 0) {
        frappe.msgprint(__("Select atleast 1 record for printing"));
        return;
      }
      if (valid_docs.length > MAX_PRINT_LIMIT) {
        frappe.msgprint(
          __("You can only print upto {0} documents at a time", [MAX_PRINT_LIMIT])
        );
        return;
      }
      const dialog = new frappe.ui.Dialog({
        title: __("Print Documents"),
        fields: [
          {
            fieldtype: "Select",
            label: __("Letter Head"),
            fieldname: "letter_sel",
            options: letterheads,
            default: letterheads[0]
          },
          {
            fieldtype: "Select",
            label: __("Print Format"),
            fieldname: "print_sel",
            options: frappe.meta.get_print_formats(this.doctype),
            default: frappe.get_meta(this.doctype).default_print_format
          },
          {
            fieldtype: "Select",
            label: __("Page Size"),
            fieldname: "page_size",
            options: frappe.meta.get_print_sizes(),
            default: print_settings.pdf_page_size
          },
          {
            fieldtype: "Float",
            label: __("Page Height (in mm)"),
            fieldname: "page_height",
            depends_on: 'eval:doc.page_size == "Custom"',
            default: print_settings.pdf_page_height
          },
          {
            fieldtype: "Float",
            label: __("Page Width (in mm)"),
            fieldname: "page_width",
            depends_on: 'eval:doc.page_size == "Custom"',
            default: print_settings.pdf_page_width
          },
          {
            fieldtype: "Check",
            label: __("Background Print (required for >25 documents)"),
            fieldname: "background_print",
            default: valid_docs.length > BACKGROUND_PRINT_THRESHOLD,
            read_only: valid_docs.length > BACKGROUND_PRINT_THRESHOLD
          }
        ]
      });
      dialog.set_primary_action(__("Print"), (args) => {
        if (!args)
          return;
        const default_print_format = frappe.get_meta(this.doctype).default_print_format;
        const with_letterhead = args.letter_sel == __("No Letterhead") ? 0 : 1;
        const print_format = args.print_sel ? args.print_sel : default_print_format;
        const json_string = JSON.stringify(valid_docs);
        const letterhead = args.letter_sel;
        let pdf_options;
        if (args.page_size === "Custom") {
          if (args.page_height === 0 || args.page_width === 0) {
            frappe.throw(__("Page height and width cannot be zero"));
          }
          pdf_options = JSON.stringify({
            "page-height": args.page_height,
            "page-width": args.page_width
          });
        } else {
          pdf_options = JSON.stringify({ "page-size": args.page_size });
        }
        if (args.background_print) {
          frappe.call("frappe.utils.print_format.download_multi_pdf_async", {
            doctype: this.doctype,
            name: json_string,
            format: print_format,
            no_letterhead: with_letterhead ? "0" : "1",
            letterhead,
            options: pdf_options
          }).then((response) => {
            let task_id = response.message.task_id;
            frappe.realtime.task_subscribe(task_id);
            frappe.realtime.on(`task_complete:${task_id}`, (data) => {
              frappe.msgprint({
                title: __("Bulk PDF Export"),
                message: __("Your PDF is ready for download"),
                primary_action: {
                  label: __("Download PDF"),
                  client_action: "window.open",
                  args: data.file_url
                }
              });
              frappe.realtime.task_unsubscribe(task_id);
              frappe.realtime.off(`task_complete:${task_id}`);
            });
          });
        } else {
          const w = window.open(
            "/api/method/frappe.utils.print_format.download_multi_pdf?doctype=" + encodeURIComponent(this.doctype) + "&name=" + encodeURIComponent(json_string) + "&format=" + encodeURIComponent(print_format) + "&no_letterhead=" + (with_letterhead ? "0" : "1") + "&letterhead=" + encodeURIComponent(letterhead) + "&options=" + encodeURIComponent(pdf_options)
          );
          if (!w) {
            frappe.msgprint(__("Please enable pop-ups"));
          }
        }
        dialog.hide();
      });
      dialog.show();
    }
    get_letterhead_options() {
      const letterhead_options = [__("No Letterhead")];
      frappe.call({
        method: "frappe.client.get_list",
        args: {
          doctype: "Letter Head",
          fields: ["name", "is_default"],
          filters: { disabled: 0 },
          limit_page_length: 0
        },
        async: false,
        callback(r) {
          if (r.message) {
            r.message.forEach((letterhead) => {
              if (letterhead.is_default) {
                letterhead_options.unshift(letterhead.name);
              } else {
                letterhead_options.push(letterhead.name);
              }
            });
          }
        }
      });
      return letterhead_options;
    }
    delete(docnames, done = null) {
      frappe.call({
        method: "frappe.desk.reportview.delete_items",
        freeze: true,
        freeze_message: docnames.length <= 10 ? __("Deleting {0} records...", [docnames.length]) : null,
        args: {
          items: docnames,
          doctype: this.doctype
        }
      }).then((r) => {
        let failed = r.message;
        if (!failed)
          failed = [];
        if (failed.length && !r._server_messages) {
          frappe.throw(
            __("Cannot delete {0}", [failed.map((f) => f.bold()).join(", ")])
          );
        }
        if (failed.length < docnames.length) {
          frappe.utils.play_sound("delete");
          if (done)
            done();
        }
      });
    }
    assign(docnames, done) {
      if (docnames.length > 0) {
        const assign_to = new frappe.ui.form.AssignToDialog({
          obj: this,
          method: "frappe.desk.form.assign_to.add_multiple",
          doctype: this.doctype,
          docname: docnames,
          bulk_assign: true,
          re_assign: true,
          callback: done
        });
        assign_to.dialog.clear();
        assign_to.dialog.show();
      } else {
        frappe.msgprint(__("Select records for assignment"));
      }
    }
    clear_assignment(docnames, done) {
      if (docnames.length > 0) {
        frappe.call({
          method: "frappe.desk.form.assign_to.remove_multiple",
          args: {
            doctype: this.doctype,
            names: docnames,
            ignore_permissions: true
          },
          freeze: true,
          freeze_message: "Removing assignments..."
        }).then(() => {
          done();
        });
      } else {
        frappe.msgprint(__("Select records for removing assignment"));
      }
    }
    apply_assignment_rule(docnames, done) {
      if (docnames.length > 0) {
        frappe.call("frappe.automation.doctype.assignment_rule.assignment_rule.bulk_apply", {
          doctype: this.doctype,
          docnames
        }).then(() => done());
      }
    }
    submit_or_cancel(docnames, action = "submit", done = null) {
      action = action.toLowerCase();
      const task_id = Math.random().toString(36).slice(-5);
      frappe.realtime.task_subscribe(task_id);
      return frappe.xcall("frappe.desk.doctype.bulk_update.bulk_update.submit_cancel_or_update_docs", {
        doctype: this.doctype,
        action,
        docnames,
        task_id
      }).then((failed_docnames) => {
        if (failed_docnames == null ? void 0 : failed_docnames.length) {
          const comma_separated_records = frappe.utils.comma_and(failed_docnames);
          switch (action) {
            case "submit":
              frappe.throw(__("Cannot submit {0}.", [comma_separated_records]));
              break;
            case "cancel":
              frappe.throw(__("Cannot cancel {0}.", [comma_separated_records]));
              break;
            default:
              frappe.throw(__("Cannot {0} {1}.", [action, comma_separated_records]));
          }
        }
        if ((failed_docnames == null ? void 0 : failed_docnames.length) < docnames.length) {
          frappe.utils.play_sound(action);
          if (done)
            done();
        }
      }).finally(() => {
        frappe.realtime.task_unsubscribe(task_id);
      });
    }
    edit(docnames, field_mappings, done) {
      let field_options = Object.keys(field_mappings).sort(function(a, b) {
        return __(cstr(field_mappings[a].label)).localeCompare(
          cstr(__(field_mappings[b].label))
        );
      });
      const status_regex = /status/i;
      const default_field = field_options.find((value) => status_regex.test(value));
      const dialog = new frappe.ui.Dialog({
        title: __("Bulk Edit"),
        fields: [
          {
            fieldtype: "Select",
            options: field_options,
            default: default_field,
            label: __("Field"),
            fieldname: "field",
            reqd: 1,
            onchange: () => {
              set_value_field(dialog);
            }
          },
          {
            fieldtype: "Data",
            label: __("Value"),
            fieldname: "value",
            onchange() {
              show_help_text();
            }
          }
        ],
        primary_action: ({ value }) => {
          const fieldname = field_mappings[dialog.get_value("field")].fieldname;
          dialog.disable_primary_action();
          frappe.call({
            method: "frappe.desk.doctype.bulk_update.bulk_update.submit_cancel_or_update_docs",
            args: {
              doctype: this.doctype,
              freeze: true,
              docnames,
              action: "update",
              data: {
                [fieldname]: value || null
              }
            }
          }).then((r) => {
            let failed = r.message || [];
            if (failed.length && !r._server_messages) {
              dialog.enable_primary_action();
              frappe.throw(
                __("Cannot update {0}", [
                  failed.map((f) => f.bold ? f.bold() : f).join(", ")
                ])
              );
            }
            done();
            dialog.hide();
            frappe.show_alert(__("Updated successfully"));
          });
        },
        primary_action_label: __("Update {0} records", [docnames.length])
      });
      if (default_field)
        set_value_field(dialog);
      show_help_text();
      function set_value_field(dialogObj) {
        const new_df = Object.assign({}, field_mappings[dialogObj.get_value("field")]);
        if (new_df.label.match(status_regex) && new_df.fieldtype === "Select" && !new_df.default) {
          let options = [];
          if (typeof new_df.options === "string") {
            options = new_df.options.split("\n");
          }
          new_df.default = options[0] || options[1];
        }
        new_df.label = __("Value");
        new_df.onchange = show_help_text;
        delete new_df.depends_on;
        dialogObj.replace_field("value", new_df);
        show_help_text();
      }
      function show_help_text() {
        let value = dialog.get_value("value");
        if (value == null || value === "") {
          dialog.set_df_property(
            "value",
            "description",
            __("You have not entered a value. The field will be set to empty.")
          );
        } else {
          dialog.set_df_property("value", "description", "");
        }
      }
      dialog.refresh();
      dialog.show();
    }
    add_tags(docnames, done) {
      const dialog = new frappe.ui.Dialog({
        title: __("Add Tags"),
        fields: [
          {
            fieldtype: "MultiSelectPills",
            fieldname: "tags",
            label: __("Tags"),
            reqd: true,
            get_data: function(txt) {
              return frappe.db.get_link_options("Tag", txt);
            }
          }
        ],
        primary_action_label: __("Add"),
        primary_action: () => {
          let args = dialog.get_values();
          if (args && args.tags) {
            dialog.set_message("Adding Tags...");
            frappe.call({
              method: "frappe.desk.doctype.tag.tag.add_tags",
              args: {
                tags: args.tags,
                dt: this.doctype,
                docs: docnames
              },
              callback: () => {
                dialog.hide();
                done();
              }
            });
          }
        }
      });
      dialog.show();
    }
    export(doctype, docnames) {
      frappe.require("data_import_tools.bundle.js", () => {
        const data_exporter = new frappe.data_import.DataExporter(
          doctype,
          "Insert New Records"
        );
        data_exporter.dialog.set_value("export_records", "by_filter");
        data_exporter.filter_group.add_filters_to_filter_group([
          [doctype, "name", "in", docnames, false]
        ]);
      });
    }
  };

  // ../superproject/superproject/public/js/superproject/list/list_settings.js
  var ListSettings = class {
    constructor({ listview, doctype, meta, settings }) {
      if (!doctype) {
        frappe.throw("DocType required");
      }
      this.listview = listview;
      this.doctype = doctype;
      this.meta = meta;
      this.settings = settings;
      this.dialog = null;
      this.fields = this.settings && this.settings.fields ? JSON.parse(this.settings.fields) : [];
      this.subject_field = null;
      frappe.model.with_doctype("List View Settings", () => {
        this.make();
        this.get_listview_fields(meta);
        this.setup_fields();
        this.setup_remove_fields();
        this.add_new_fields();
        this.show_dialog();
      });
    }
    make() {
      let me = this;
      let list_view_settings = frappe.get_meta("List View Settings");
      me.dialog = new frappe.ui.Dialog({
        title: __("{0} Settings", [__(me.doctype)]),
        fields: list_view_settings.fields
      });
      me.dialog.set_values(me.settings);
      me.dialog.set_primary_action(__("Save"), () => {
        let values = me.dialog.get_values();
        frappe.show_alert({
          message: __("Saving"),
          indicator: "green"
        });
        frappe.call({
          method: "frappe.desk.doctype.list_view_settings.list_view_settings.save_listview_settings",
          args: {
            doctype: me.doctype,
            listview_settings: values,
            removed_listview_fields: me.removed_fields || []
          },
          callback: function(r) {
            me.listview.refresh_columns(r.message.meta, r.message.listview_settings);
            me.dialog.hide();
          }
        });
      });
      me.dialog.fields_dict["total_fields"].df.onchange = () => me.refresh();
    }
    refresh() {
      let me = this;
      me.setup_fields();
      me.add_new_fields();
      me.setup_remove_fields();
    }
    show_dialog() {
      let me = this;
      if (!this.settings.fields) {
        me.update_fields();
      }
      if (!me.dialog.get_value("total_fields")) {
        let field_count = this.settings.total_fields;
        if (!field_count) {
          field_count = me.fields.length;
          if (field_count < 4) {
            field_count = 4;
          } else if (field_count > 10) {
            field_count = 10;
          }
        }
        me.dialog.set_value("total_fields", field_count);
      }
      me.dialog.show();
    }
    setup_fields() {
      function is_status_field(field) {
        return field.fieldname === "status_field";
      }
      let me = this;
      let fields_html = me.dialog.get_field("fields_html");
      let wrapper = fields_html.$wrapper[0];
      let fields = ``;
      let total_fields = me.dialog.get_values().total_fields || me.settings.total_fields;
      for (let idx in me.fields) {
        if (idx == parseInt(total_fields)) {
          break;
        }
        let is_sortable = idx == 0 ? `` : `sortable`;
        let show_sortable_handle = idx == 0 ? `hide` : ``;
        let can_remove = idx == 0 || is_status_field(me.fields[idx]) ? `hide` : ``;
        fields += `
				<div class="control-input flex align-center form-control fields_order ${is_sortable}"
					style="display: block; margin-bottom: 5px;" data-fieldname="${me.fields[idx].fieldname}"
					data-label="${me.fields[idx].label}" data-type="${me.fields[idx].type}">

					<div class="row">
						<div class="col-1">
							${frappe.utils.icon("drag", "xs", "", "", "sortable-handle " + show_sortable_handle)}
						</div>
						<div class="col-10" style="padding-left:0px;">
							${__(me.fields[idx].label, null, me.doctype)}
						</div>
						<div class="col-1 ${can_remove}">
							<a class="text-muted remove-field" data-fieldname="${me.fields[idx].fieldname}">
								${frappe.utils.icon("delete", "xs")}
							</a>
						</div>
					</div>
				</div>`;
      }
      fields_html.html(`
			<div class="form-group">
				<div class="clearfix">
					<label class="control-label" style="padding-right: 0px;">${__("Fields")}</label>
				</div>
				<div class="control-input-wrapper">
				${fields}
				</div>
				<p class="help-box small text-muted">
					<a class="add-new-fields text-muted">
						${__("+ Add / Remove Fields")}
					</a>
				</p>
			</div>
		`);
      new Sortable(wrapper.getElementsByClassName("control-input-wrapper")[0], {
        handle: ".sortable-handle",
        draggable: ".sortable",
        onUpdate: () => {
          me.update_fields();
          me.refresh();
        }
      });
    }
    add_new_fields() {
      let me = this;
      let fields_html = me.dialog.get_field("fields_html");
      let add_new_fields = fields_html.$wrapper[0].getElementsByClassName("add-new-fields")[0];
      add_new_fields.onclick = () => me.column_selector();
    }
    setup_remove_fields() {
      let me = this;
      let fields_html = me.dialog.get_field("fields_html");
      let remove_fields = fields_html.$wrapper[0].getElementsByClassName("remove-field");
      for (let idx = 0; idx < remove_fields.length; idx++) {
        remove_fields.item(idx).onclick = () => me.remove_fields(remove_fields.item(idx).getAttribute("data-fieldname"));
      }
    }
    remove_fields(fieldname) {
      let me = this;
      let existing_fields = me.fields.map((f) => f.fieldname);
      for (let idx in me.fields) {
        let field = me.fields[idx];
        if (field.fieldname == fieldname) {
          me.fields.splice(idx, 1);
          break;
        }
      }
      me.set_removed_fields(
        me.get_removed_listview_fields(
          me.fields.map((f) => f.fieldname),
          existing_fields
        )
      );
      me.refresh();
      me.update_fields();
    }
    update_fields() {
      let me = this;
      let fields_html = me.dialog.get_field("fields_html");
      let wrapper = fields_html.$wrapper[0];
      let fields_order = wrapper.getElementsByClassName("fields_order");
      me.fields = [];
      for (let idx = 0; idx < fields_order.length; idx++) {
        me.fields.push({
          fieldname: fields_order.item(idx).getAttribute("data-fieldname"),
          label: __(fields_order.item(idx).getAttribute("data-label"))
        });
      }
      me.dialog.set_value("fields", JSON.stringify(me.fields));
      me.dialog.get_value("fields");
    }
    column_selector() {
      let me = this;
      let d = new frappe.ui.Dialog({
        title: __("{0} Fields", [__(me.doctype)]),
        fields: [
          {
            label: __("Reset Fields"),
            fieldtype: "Button",
            fieldname: "reset_fields",
            click: () => me.reset_listview_fields(d)
          },
          {
            label: __("Select Fields"),
            fieldtype: "MultiCheck",
            fieldname: "fields",
            options: me.get_doctype_fields(
              me.meta,
              me.fields.map((f) => f.fieldname)
            ),
            columns: 2
          }
        ]
      });
      d.set_primary_action(__("Save"), () => {
        let values = d.get_values().fields;
        me.set_removed_fields(
          me.get_removed_listview_fields(
            values,
            me.fields.map((f) => f.fieldname)
          )
        );
        me.fields = [];
        me.set_subject_field(me.meta);
        me.set_status_field();
        for (let idx in values) {
          let value = values[idx];
          if (me.fields.length === parseInt(me.dialog.get_values().total_fields)) {
            break;
          } else if (value != me.subject_field.fieldname) {
            let field = frappe.meta.get_docfield(me.doctype, value);
            if (field) {
              me.fields.push({
                label: __(field.label, null, me.doctype),
                fieldname: field.fieldname
              });
            }
          }
        }
        me.refresh();
        me.dialog.set_value("fields", JSON.stringify(me.fields));
        d.hide();
      });
      d.show();
    }
    reset_listview_fields(dialog) {
      let me = this;
      frappe.xcall(
        "frappe.desk.doctype.list_view_settings.list_view_settings.get_default_listview_fields",
        {
          doctype: me.doctype
        }
      ).then((fields) => {
        let field = dialog.get_field("fields");
        field.df.options = me.get_doctype_fields(me.meta, fields);
        dialog.refresh();
      });
    }
    get_listview_fields(meta) {
      let me = this;
      if (!me.settings.fields) {
        me.set_list_view_fields(meta);
      } else {
        me.fields = JSON.parse(this.settings.fields);
      }
      me.fields.uniqBy((f) => f.fieldname);
    }
    set_list_view_fields(meta) {
      let me = this;
      me.set_subject_field(meta);
      me.set_status_field();
      meta.fields.forEach((field) => {
        if (field.in_list_view && !frappe.model.no_value_type.includes(field.fieldtype) && me.subject_field.fieldname != field.fieldname) {
          me.fields.push({
            label: __(field.label, null, me.doctype),
            fieldname: field.fieldname
          });
        }
      });
    }
    set_subject_field(meta) {
      let me = this;
      me.subject_field = {
        label: __("ID"),
        fieldname: "name"
      };
      if (meta.title_field) {
        let field = frappe.meta.get_docfield(me.doctype, meta.title_field.trim());
        me.subject_field = {
          label: __(field.label, null, me.doctype),
          fieldname: field.fieldname
        };
      }
      me.fields.push(me.subject_field);
    }
    set_status_field() {
      let me = this;
      if (frappe.has_indicator(me.doctype)) {
        me.fields.push({
          type: "Status",
          label: __("Status"),
          fieldname: "status_field"
        });
      }
    }
    get_doctype_fields(meta, fields) {
      let multiselect_fields = [];
      meta.fields.forEach((field) => {
        if (!frappe.model.no_value_type.includes(field.fieldtype)) {
          multiselect_fields.push({
            label: __(field.label, null, field.doctype),
            value: field.fieldname,
            checked: fields.includes(field.fieldname)
          });
        }
      });
      return multiselect_fields;
    }
    get_removed_listview_fields(new_fields, existing_fields) {
      let me = this;
      let removed_fields = [];
      if (frappe.has_indicator(me.doctype)) {
        new_fields.push("status_field");
      }
      existing_fields.forEach((column) => {
        if (!new_fields.includes(column)) {
          removed_fields.push(column);
        }
      });
      return removed_fields;
    }
    set_removed_fields(fields) {
      let me = this;
      if (me.removed_fields) {
        me.removed_fields = me.removed_fields.concat(fields);
      } else {
        me.removed_fields = fields;
      }
    }
  };

  // ../superproject/superproject/public/js/superproject/list/list_view.js
  frappe.provide("frappe.views");
  frappe.views.ListView = class ListView extends frappe.views.BaseList {
    static load_last_view() {
      const route = frappe.get_route();
      const doctype = route[1];
      if (route.length === 2) {
        const user_settings = frappe.get_user_settings(doctype);
        const last_view = user_settings.last_view;
        frappe.set_route(
          "list",
          frappe.router.doctype_layout || doctype,
          frappe.views.is_valid(last_view) ? last_view.toLowerCase() : "list"
        );
        return true;
      }
      return false;
    }
    constructor(opts) {
      super(opts);
      this.show();
      const meta = frappe.get_meta(this.doctype);
      this.is_large_table = meta == null ? void 0 : meta.is_large_table;
      this.debounced_refresh = frappe.utils.debounce(
        this.process_document_refreshes.bind(this),
        this.is_large_table ? 15e3 : 2e3
      );
      this.count_upper_bound = 1001;
      this._element_factory = new ElementFactory(this.doctype);
    }
    has_permissions() {
      return frappe.perm.has_perm(this.doctype, 0, "read");
    }
    show() {
      this.parent.disable_scroll_to_top = true;
      super.show();
    }
    check_permissions() {
      if (!this.has_permissions()) {
        frappe.set_route("");
        frappe.throw(__("Not permitted to view {0}", [this.doctype]));
      }
    }
    show_skeleton() {
      this.$list_skeleton = this.parent.page.container.find(".list-skeleton");
      if (!this.$list_skeleton.length) {
        this.$list_skeleton = $(`
				<div class="row list-skeleton">
					<div class="col-lg-2">
						<div class="list-skeleton-box"></div>
					</div>
					<div class="col">
						<div class="list-skeleton-box"></div>
					</div>
				</div>
			`);
        this.parent.page.container.find(".page-content").append(this.$list_skeleton);
      }
      this.parent.page.container.find(".layout-main").hide();
      this.$list_skeleton.show();
    }
    hide_skeleton() {
      this.$list_skeleton && this.$list_skeleton.hide();
      this.parent.page.container.find(".layout-main").show();
    }
    get view_name() {
      return "List";
    }
    get view_user_settings() {
      return this.user_settings[this.view_name] || {};
    }
    setup_defaults() {
      super.setup_defaults();
      this.view = "List";
      this.sort_by = this.view_user_settings.sort_by || this.sort_by || "modified";
      this.sort_order = this.view_user_settings.sort_order || this.sort_order || "desc";
      this.menu_items = this.menu_items.concat(this.get_menu_items());
      if (Array.isArray(this.view_user_settings.filters)) {
        const saved_filters = this.view_user_settings.filters;
        this.filters = this.validate_filters(saved_filters);
      } else {
        this.filters = (this.settings.filters || []).map((f) => {
          if (f.length === 3) {
            f = [this.doctype, f[0], f[1], f[2]];
          }
          return f;
        });
      }
      if (this.view_name == "List")
        this.toggle_paging = true;
      this.patch_refresh_and_load_lib();
      return this.get_list_view_settings().then(() => this.add_recent_filter_on_large_tables());
    }
    add_recent_filter_on_large_tables() {
      var _a2;
      if (!this.is_large_table || ((_a2 = this.list_view_settings) == null ? void 0 : _a2.disable_automatic_recency_filters)) {
        return;
      }
      const recency_field = "modified";
      if (this.filters.length) {
        return;
      }
      this.filters.push([this.doctype, recency_field, "Timespan", "last 90 days"]);
      frappe.show_alert(
        {
          message: __(
            "Automatically applied a filter for recent data. You can disable this behavior from the list view settings."
          ),
          indicator: "yellow"
        },
        3
      );
    }
    on_sort_change(sort_by, sort_order) {
      this.sort_by = sort_by;
      this.sort_order = sort_order;
      super.on_sort_change();
    }
    validate_filters(filters) {
      let valid_fields = this.meta.fields.map((df) => df.fieldname);
      valid_fields = valid_fields.concat(frappe.model.std_fields_list);
      return filters.filter((f) => valid_fields.includes(f[1])).uniqBy((f) => f[1]);
    }
    setup_page() {
      this.parent.list_view = this;
      super.setup_page();
    }
    setup_page_head() {
      super.setup_page_head();
      this.set_primary_action();
      this.set_actions_menu_items();
    }
    set_actions_menu_items() {
      this.actions_menu_items = this.get_actions_menu_items();
      this.workflow_action_menu_items = this.get_workflow_action_menu_items();
      this.workflow_action_items = {};
      const actions = this.actions_menu_items.concat(this.workflow_action_menu_items);
      actions.forEach((item) => {
        const $item = this.page.add_actions_menu_item(item.label, item.action, item.standard);
        if (item.class) {
          $item.addClass(item.class);
        }
        if (item.is_workflow_action && $item) {
          this.workflow_action_items[item.name] = $item;
        }
      });
    }
    show_restricted_list_indicator_if_applicable() {
      const match_rules_list = frappe.perm.get_match_rules(this.doctype);
      if (match_rules_list.length) {
        this.restricted_list = $(
          `<button class="btn btn-xs restricted-button flex align-center">
					${frappe.utils.icon("restriction", "xs")}
				</button>`
        ).click(() => this.show_restrictions(match_rules_list)).appendTo(this.page.page_form);
      }
    }
    show_restrictions(match_rules_list = []) {
      frappe.msgprint(
        frappe.render_template("list_view_permission_restrictions", {
          condition_list: match_rules_list
        }),
        __("Restrictions", null, "Title of message showing restrictions in list view")
      );
    }
    get_fields() {
      return super.get_fields().concat(
        Object.entries(this.link_field_title_fields || {}).map(
          (entry) => entry.join(".") + " as " + entry.join("_")
        )
      );
    }
    async set_fields() {
      this.link_field_title_fields = {};
      let fields = [].concat(
        frappe.model.std_fields_list,
        this.get_fields_in_list_view(),
        [this.meta.title_field, this.meta.image_field],
        this.settings.add_fields || [],
        this.meta.track_seen ? "_seen" : null,
        this.sort_by,
        "enabled",
        "disabled",
        "color"
      );
      await Promise.all(
        fields.map((f) => {
          return new Promise((resolve) => {
            const df = typeof f === "string" ? frappe.meta.get_docfield(this.doctype, f) : f;
            if (df && df.fieldtype == "Link" && frappe.boot.link_title_doctypes.includes(df.options)) {
              frappe.model.with_doctype(df.options, () => {
                const meta = frappe.get_meta(df.options);
                if (meta.show_title_field_in_link && meta.title_field) {
                  this.link_field_title_fields[typeof f === "string" ? f : f.fieldname] = meta.title_field;
                }
                this._add_field(f);
                resolve();
              });
            } else {
              this._add_field(f);
              resolve();
            }
          });
        })
      );
      this.fields.forEach((f) => {
        const df = frappe.meta.get_docfield(f[1], f[0]);
        if (df && df.fieldtype === "Currency" && df.options && !df.options.includes(":")) {
          this._add_field(df.options);
        }
      });
    }
    patch_refresh_and_load_lib() {
      this.refresh = this.refresh.bind(this);
      this.refresh = frappe.utils.throttle(this.refresh, 1e3);
      this.load_lib = new Promise((resolve) => {
        if (this.required_libs) {
          frappe.require(this.required_libs, resolve);
        } else {
          resolve();
        }
      });
      const interval = 5 * 60 * 1e3;
      setInterval(() => {
        if (frappe.get_route_str() === this.page_name) {
          this.refresh();
        }
      }, interval);
    }
    set_primary_action() {
      if (this.can_create && !frappe.boot.read_only) {
        const doctype_name = __(frappe.router.doctype_layout) || __(this.doctype);
        const label = `${__("Add", null, "Primary action in list view")} ${doctype_name}`;
        this.page.set_primary_action(
          label,
          () => {
            if (this.settings.primary_action) {
              this.settings.primary_action();
            } else {
              this.make_new_doc();
            }
          },
          "add"
        );
      } else {
        this.page.clear_primary_action();
      }
    }
    make_new_doc() {
      const doctype = this.doctype;
      const options = {};
      const allowed_filter_types = [
        "=",
        "descendants of (inclusive)",
        "descendants of",
        "ancestors of"
      ];
      this.filter_area.get().forEach((f) => {
        if (allowed_filter_types.includes(f[2]) && frappe.model.is_non_std_field(f[1])) {
          options[f[1]] = f[3];
        }
      });
      frappe.new_doc(doctype, options);
    }
    setup_view() {
      this.setup_columns();
      this.render_header();
      this.render_skeleton();
      this.setup_events();
      this.settings.onload && this.settings.onload(this);
      this.show_restricted_list_indicator_if_applicable();
    }
    refresh_columns(meta, list_view_settings) {
      this.meta = meta;
      this.list_view_settings = list_view_settings;
      this.setup_columns();
      this.refresh(true);
    }
    refresh(refresh_header = false) {
      return super.refresh().then(() => {
        this.render_header(refresh_header);
        this.update_checkbox();
        this.update_url_with_filters();
        this.setup_realtime_updates();
      });
    }
    update_checkbox(target) {
      if (!this.$checkbox_actions)
        return;
      let $check_all_checkbox = this.$checkbox_actions.find(".list-check-all");
      if ($check_all_checkbox.prop("checked") && target && !target.prop("checked")) {
        $check_all_checkbox.prop("checked", false);
      }
      $check_all_checkbox.prop("checked", this.$checks.length === this.data.length);
    }
    setup_freeze_area() {
      this.$freeze = $(
        `<div class="freeze flex justify-center align-center text-muted">
				${__("Loading")}...
			</div>`
      ).hide();
      this.$result.append(this.$freeze);
    }
    setup_columns() {
      this.columns = [];
      const get_df = frappe.meta.get_docfield.bind(null, this.doctype);
      if (this.meta.title_field) {
        this.columns.push({
          type: "Subject",
          df: get_df(this.meta.title_field)
        });
      } else {
        this.columns.push({
          type: "Subject",
          df: {
            label: __("ID"),
            fieldname: "name"
          }
        });
      }
      this.columns.push({
        type: "Tag"
      });
      if (frappe.has_indicator(this.doctype)) {
        this.columns.push({
          type: "Status"
        });
      }
      const fields_in_list_view = this.get_fields_in_list_view();
      this.columns = this.columns.concat(
        fields_in_list_view.filter((df) => {
          if (frappe.has_indicator(this.doctype) && df.fieldname === "status") {
            return false;
          }
          if (!df.in_list_view || df.is_virtual) {
            return false;
          }
          return df.fieldname !== this.meta.title_field;
        }).map((df) => ({
          type: "Field",
          df
        }))
      );
      if (this.list_view_settings.fields) {
        this.columns = this.reorder_listview_fields();
      }
      let total_fields = 6;
      if (window.innerWidth <= 1366) {
        total_fields = 4;
      } else if (window.innerWidth >= 1920) {
        total_fields = 10;
      }
      this.columns = this.columns.slice(0, this.list_view_settings.total_fields || total_fields);
      if (!this.settings.hide_name_column && this.meta.title_field && this.meta.title_field !== "name") {
        this.columns.push({
          type: "Field",
          df: {
            label: __("ID"),
            fieldname: "name"
          }
        });
      }
    }
    reorder_listview_fields() {
      let fields_order = [];
      let fields = JSON.parse(this.list_view_settings.fields);
      fields_order.push(this.columns[0]);
      fields_order.push(this.columns[1]);
      this.columns.splice(0, 2);
      for (let fld in fields) {
        for (let col in this.columns) {
          let field = fields[fld];
          let column = this.columns[col];
          if (column.type == "Status" && field.fieldname == "status_field") {
            fields_order.push(column);
            break;
          } else if (column.type == "Field" && field.fieldname === column.df.fieldname) {
            fields_order.push(column);
            break;
          }
        }
      }
      return fields_order;
    }
    get_documentation_link() {
      if (this.meta.documentation) {
        return `<a href="${this.meta.documentation}" target="blank" class="meta-description small text-muted">Need Help?</a>`;
      }
      return "";
    }
    get_no_result_message() {
      let help_link = this.get_documentation_link();
      let filters = this.filter_area && this.filter_area.get();
      let has_filters_set = filters && filters.length;
      let no_result_message = has_filters_set ? __("No {0} found with matching filters. Clear filters to see all {0}.", [
        __(this.doctype)
      ]) : this.meta.description ? __(this.meta.description) : __("You haven't created a {0} yet", [__(this.doctype)]);
      let new_button_label = has_filters_set ? __("Create a new {0}", [__(this.doctype)], "Create a new document from list view") : __(
        "Create your first {0}",
        [__(this.doctype)],
        "Create a new document from list view"
      );
      let empty_state_image = this.settings.empty_state_image || "/assets/frappe/images/ui-states/list-empty-state.svg";
      const new_button = this.can_create ? `<p><button class="btn btn-default btn-sm btn-new-doc hidden-xs">
				${new_button_label}
			</button> <button class="btn btn-primary btn-new-doc visible-xs">
				${__("Create New", null, "Create a new document from list view")}
			</button></p>` : "";
      return `<div class="msg-box no-border">
			<div>
				<img src="${empty_state_image}" alt="Generic Empty State" class="null-state">
			</div>
			<p>${no_result_message}</p>
			${new_button}
			${help_link}
		</div>`;
    }
    freeze() {
      if (this.list_view_settings && !this.list_view_settings.disable_count) {
        this.get_count_element().html(
          `<span>${__("Refreshing", null, "Document count in list view")}...</span>`
        );
      }
    }
    get_args() {
      const args = super.get_args();
      if (this.list_view_settings && !this.list_view_settings.disable_comment_count) {
        args.with_comment_count = 1;
      } else {
        args.with_comment_count = 0;
      }
      return args;
    }
    before_refresh() {
      if (frappe.route_options && this.filter_area) {
        this.filters = this.parse_filters_from_route_options();
        frappe.route_options = null;
        if (this.filters.length > 0) {
          return this.filter_area.clear(false).then(() => this.filter_area.set(this.filters));
        }
      }
      return Promise.resolve();
    }
    parse_filters_from_settings() {
      return (this.settings.filters || []).map((f) => {
        if (f.length === 3) {
          f = [this.doctype, f[0], f[1], f[2]];
        }
        return f;
      });
    }
    toggle_result_area() {
      super.toggle_result_area();
      this.toggle_actions_menu_button(
        this.$result.find(".list-row-checkbox:checked").length > 0
      );
    }
    toggle_actions_menu_button(toggle) {
      if (toggle) {
        this.page.show_actions_menu();
        this.page.clear_primary_action();
      } else {
        this.page.hide_actions_menu();
        this.set_primary_action();
      }
    }
    render_header(refresh_header = false) {
      if (refresh_header) {
        this.$result.find(".list-row-head").remove();
      }
      if (this.$result.find(".list-row-head").length === 0) {
        this.$result.prepend(this.get_header_html());
      }
    }
    render_skeleton() {
      const $row = this.get_list_row_html_skeleton(
        '<div><input type="checkbox" class="render-list-checkbox"/></div>'
      );
      this.$result.append($row);
    }
    before_render() {
      this.settings.before_render && this.settings.before_render();
      frappe.model.user_settings.save(this.doctype, "last_view", this.view_name);
      this.save_view_user_settings({
        filters: this.filter_area && this.filter_area.get(),
        sort_by: this.sort_selector && this.sort_selector.sort_by,
        sort_order: this.sort_selector && this.sort_selector.sort_order
      });
      this.toggle_paging && this.$paging_area.toggle(false);
    }
    after_render() {
      this.$no_result.html(`
			<div class="no-result text-muted flex justify-center align-center">
				${this.get_no_result_message()}
			</div>
		`);
      this.setup_new_doc_event();
      this.toggle_paging && this.$paging_area.toggle(true);
    }
    render() {
      this.render_list();
      this.set_rows_as_checked();
      this.render_count();
    }
    render_list() {
      this.$result.find(".list-row-container").remove();
      if (this.data.length > 0) {
        let idx = 0;
        for (let doc of this.data) {
          doc._idx = idx++;
          this.$result.append(this.get_list_row_html(doc));
        }
      }
    }
    render_count() {
      var _a2;
      if ((_a2 = this.list_view_settings) == null ? void 0 : _a2.disable_count) {
        return;
      }
      let me = this;
      let $count = this.get_count_element();
      this.get_count_str().then((count) => {
        $count.html(`<span>${count}</span>`);
        if (this.count_upper_bound && this.count_upper_bound == this.total_count) {
          $count.attr(
            "title",
            __(
              "The count shown is an estimated count. Click here to see the accurate count."
            )
          );
          $count.tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
          $count.on("click", () => {
            me.count_upper_bound = 0;
            $count.off("click");
            $count.tooltip("disable");
            me.freeze();
            me.render_count();
          });
        }
      });
    }
    get_count_element() {
      var _a2;
      return (_a2 = this.$result) == null ? void 0 : _a2.find(".list-count");
    }
    get_header_html() {
      if (!this.columns) {
        return;
      }
      const subject_field = this.columns[0].df;
      let subject_html = `
			<input class="level-item list-check-all" type="checkbox"
				title="${__("Select All")}">
			<span class="level-item" data-sort-by="${subject_field.fieldname}"
				title="${__("Click to sort by {0}", [subject_field.label])}">
				${__(subject_field.label)}
			</span>
		`;
      const $columns = this.columns.map((col) => {
        var _a2, _b, _c;
        let classes = [
          "list-row-col ellipsis",
          col.type == "Subject" ? "list-subject level" : "hidden-xs",
          col.type == "Tag" ? "tag-col hide" : "",
          frappe.model.is_numeric_field(col.df) ? "text-right" : ""
        ].join(" ");
        let html = "";
        if (col.type === "Subject") {
          html = subject_html;
        } else {
          const fieldname = (_a2 = col.df) == null ? void 0 : _a2.fieldname;
          const label = __(((_b = col.df) == null ? void 0 : _b.label) || col.type, null, (_c = col.df) == null ? void 0 : _c.parent);
          const title = __("Click to sort by {0}", [label]);
          const attrs = fieldname ? `data-sort-by="${fieldname}" title="${title}"` : "";
          html = `<span ${attrs}>${label}</span>`;
        }
        let style = null;
        if (col.df && col.df.columns && col.df.columns > 0) {
          style = `flex: ${col.df.columns}`;
        }
        return `<div class="${classes}" style="${style}">${html}</div>
			`;
      }).join("");
      const right_html = `
			<span class="list-count"></span>
			<span class="level-item list-liked-by-me hidden-xs">
				<span title="${__("Liked by me")}">
					${frappe.utils.icon("es-solid-heart", "sm", "like-icon")}
				</span>
			</span>
		`;
      return this.get_header_html_skeleton($columns, right_html);
    }
    get_header_html_skeleton(left = "", right = "") {
      return `
			<header class="level list-row-head text-muted">
				<div class="level-left list-header-subject">
					${left}
				</div>
				<div class="level-left checkbox-actions">
					<div class="level list-subject">
						<input class="level-item list-check-all" type="checkbox"
							title="${__("Select All")}">
						<span class="level-item list-header-meta"></span>
					</div>
				</div>
				<div class="level-right">
					${right}
				</div>
			</header>
		`;
    }
    get_left_html(doc) {
      return this.columns.map((col) => this.get_column_html(col, doc)).join("");
    }
    get_right_html(doc) {
      return this.get_meta_html(doc);
    }
    get_list_row_html(doc) {
      return this.get_list_row_html_skeleton(this.get_left_html(doc), this.get_right_html(doc));
    }
    get_list_row_html_skeleton(left = "", right = "") {
      return `
			<div class="list-row-container" tabindex="1">
				<div class="level list-row">
					<div class="level-left ellipsis">
						${left}
					</div>
					<div class="level-right text-muted ellipsis">
						${right}
					</div>
				</div>
				<div class="list-row-border"></div>
			</div>
		`;
    }
    get_column_html(col, doc) {
      var _a2, _b, _c, _d;
      if (col.type === "Status" || ((_a2 = col.df) == null ? void 0 : _a2.options) == "Workflow State") {
        let show_workflow_state = ((_b = col.df) == null ? void 0 : _b.options) == "Workflow State";
        return `
				<div class="list-row-col hidden-xs ellipsis">
					${this.get_indicator_html(doc, show_workflow_state)}
				</div>
			`;
      }
      if (col.type === "Tag") {
        const tags_display_class = !this.tags_shown ? "hide" : "";
        let tags_html = doc._user_tags ? this.get_tags_html(doc._user_tags, 2, true) : '<div class="tags-empty">-</div>';
        return `
				<div class="list-row-col tag-col ${tags_display_class} hidden-xs ellipsis">
					${tags_html}
				</div>
			`;
      }
      const df = col.df || {};
      const label = df.label;
      const fieldname = df.fieldname;
      const link_title_fieldname = this.link_field_title_fields[fieldname];
      const value = doc[fieldname] || "";
      let value_display = link_title_fieldname ? doc[fieldname + "_" + link_title_fieldname] || value : value;
      let translated_doctypes = ((_c = frappe.boot) == null ? void 0 : _c.translated_doctypes) || [];
      if (translated_doctypes.includes(df.options)) {
        value_display = __(value_display);
      }
      const format = () => {
        if (df.fieldtype === "Percent") {
          return `<div class="progress" style="margin: 0px;">
						<div class="progress-bar progress-bar-success" role="progressbar"
							aria-valuenow="${value}"
							aria-valuemin="0" aria-valuemax="100" style="width: ${Math.round(value)}%;">
						</div>
					</div>`;
        } else {
          return frappe.format(value, df, null, doc);
        }
      };
      const field_html = () => {
        let html;
        let _value;
        let strip_html_required = df.fieldtype == "Text Editor" || df.fetch_from && ["Text", "Small Text"].includes(df.fieldtype);
        if (strip_html_required) {
          _value = strip_html(value_display);
        } else {
          _value = typeof value_display === "string" ? frappe.utils.escape_html(value_display) : value_display;
        }
        if (df.fieldtype === "Rating") {
          let out_of_ratings = df.options || 5;
          _value = _value * out_of_ratings;
        }
        if (df.fieldtype === "Image") {
          html = df.options ? `<img src="${doc[df.options]}"
					style="max-height: 30px; max-width: 100%;">` : `<div class="missing-image small">
						${frappe.utils.icon("restriction")}
					</div>`;
        } else if (df.fieldtype === "Select") {
          html = `<span class="filterable indicator-pill ${frappe.utils.guess_colour(
            _value
          )} ellipsis"
					data-filter="${fieldname},=,${value}">
					<span class="ellipsis"> ${__(_value)} </span>
				</span>`;
        } else if (df.fieldtype === "Link") {
          html = `<a class="filterable ellipsis"
					data-filter="${fieldname},=,${value}">
					${_value}
				</a>`;
        } else if (frappe.model.html_fieldtypes.includes(df.fieldtype)) {
          html = `<span class="ellipsis">
					${_value}
				</span>`;
        } else {
          html = `<a class="filterable ellipsis"
					data-filter="${fieldname},=,${frappe.utils.escape_html(value)}">
					${format()}
				</a>`;
        }
        return `<span class="ellipsis"
				title="${__(label)}: ${frappe.utils.escape_html(_value)}">
				${html}
			</span>`;
      };
      const class_map = {
        Subject: "list-subject level",
        Field: "hidden-xs"
      };
      const css_class = [
        "list-row-col ellipsis",
        class_map[col.type],
        frappe.model.is_numeric_field(df) ? "text-right" : ""
      ].join(" ");
      let style = ((_d = col.df) == null ? void 0 : _d.columns) ? `flex: ${col.df.columns}` : "";
      let column_html;
      if (this.settings.formatters && this.settings.formatters[fieldname] && col.type !== "Subject") {
        column_html = this.settings.formatters[fieldname](value, df, doc);
      } else {
        column_html = {
          Subject: this.get_subject_element(doc, value_display).innerHTML,
          Field: field_html()
        }[col.type];
      }
      return `
			<div class="${css_class}" style="${style}">
				${column_html}
			</div>
		`;
    }
    get_tags_html(user_tags, limit, colored = false) {
      let get_tag_html = (tag) => {
        let color = "", style = "";
        if (tag) {
          if (colored) {
            color = frappe.get_palette(tag);
            style = `background-color: var(${color[0]}); color: var(${color[1]})`;
          }
          return `<div class="tag-pill ellipsis" title="${tag}" style="${style}">${tag}</div>`;
        }
      };
      return user_tags.split(",").slice(1, limit + 1).map(get_tag_html).join("");
    }
    get_meta_html(doc) {
      let html = "";
      let settings_button = null;
      if (this.settings.button && this.settings.button.show(doc)) {
        settings_button = `
				<span class="list-actions">
					<button class="btn btn-action btn-default btn-xs"
						data-name="${doc.name}" data-idx="${doc._idx}"
						title="${this.settings.button.get_description(doc)}">
						${this.settings.button.get_label(doc)}
					</button>
				</span>
			`;
      }
      const modified = comment_when(doc.modified, true);
      let assigned_to = ``;
      let assigned_users = doc._assign ? JSON.parse(doc._assign) : [];
      if (assigned_users.length) {
        assigned_to = `<div class="list-assignments d-flex align-items-center">
					${frappe.avatar_group(assigned_users, 3, { filterable: true })[0].outerHTML}
				</div>`;
      }
      let comment_count = null;
      if (this.list_view_settings && !this.list_view_settings.disable_comment_count) {
        comment_count = `<span class="comment-count d-flex align-items-center">
				${frappe.utils.icon("es-line-chat-alt")}
				${doc._comment_count > 99 ? "99+" : doc._comment_count || 0}
			</span>`;
      }
      html += `
			<div class="level-item list-row-activity hidden-xs">
				<div class="hidden-md hidden-xs">
					${settings_button || assigned_to}
				</div>
				<span class="modified">${modified}</span>
				${comment_count || ""}
				${comment_count ? '<span class="mx-2">\xB7</span>' : ""}
				<span class="list-row-like hidden-xs" style="margin-bottom: 1px;">
					${this.get_like_html(doc)}
				</span>
			</div>
			<div class="level-item visible-xs text-right">
				${this.get_indicator_html(doc)}
			</div>
		`;
      return html;
    }
    get_count_str() {
      let current_count = this.data.length;
      let count_without_children = this.data.uniqBy((d) => d.name).length;
      return frappe.db.count(this.doctype, {
        filters: this.get_filters_for_args(),
        limit: this.count_upper_bound
      }).then((total_count) => {
        this.total_count = total_count || current_count;
        this.count_without_children = count_without_children !== current_count ? count_without_children : void 0;
        let count_str;
        if (this.total_count === this.count_upper_bound) {
          count_str = `${format_number(this.total_count - 1, null, 0)}+`;
        } else {
          count_str = format_number(this.total_count, null, 0);
        }
        let str = __("{0} of {1}", [format_number(current_count, null, 0), count_str]);
        if (this.count_without_children) {
          str = __("{0} of {1} ({2} rows with children)", [
            count_without_children,
            count_str,
            current_count
          ]);
        }
        return str;
      });
    }
    get_form_link(doc) {
      if (this.settings.get_form_link) {
        return this.settings.get_form_link(doc);
      }
      return `/app/${encodeURIComponent(
        frappe.router.slug(frappe.router.doctype_layout || this.doctype)
      )}/${encodeURIComponent(cstr(doc.name))}`;
    }
    get_seen_class(doc) {
      const seen_by = doc._seen ? JSON.parse(doc._seen) : [];
      return seen_by.includes(frappe.session.user) ? "" : "bold";
    }
    get_like_html(doc) {
      const liked_by = doc._liked_by ? JSON.parse(doc._liked_by) : [];
      const is_liked = liked_by.includes(frappe.session.user);
      const title = liked_by.map((u) => frappe.user_info(u).fullname).join(", ");
      const div = document.createElement("div");
      div.appendChild(
        this._element_factory.get_like_element(doc.name, is_liked, liked_by, title)
      );
      return div.innerHTML;
    }
    get_subject_element(doc, title) {
      const ef = this._element_factory;
      const div = document.createElement("div");
      const checkboxspan = ef.get_checkboxspan_element();
      const ellipsisSpan = document.createElement("span");
      const seen = this.get_seen_class(doc);
      if (seen) {
        ellipsisSpan.classList.add("level-item", seen, "ellipsis");
      }
      div.appendChild(checkboxspan).appendChild(ef.get_checkbox_element(doc.name));
      div.appendChild(ellipsisSpan).appendChild(
        ef.get_link_element(
          doc.name,
          this.get_form_link(doc),
          this.get_subject_text(doc, title)
        )
      );
      return div;
    }
    get_subject_text(doc, title) {
      const subject_field = this.columns[0].df;
      let value = title || doc[subject_field.fieldname];
      if (this.settings.formatters && this.settings.formatters[subject_field.fieldname]) {
        let formatter = this.settings.formatters[subject_field.fieldname];
        value = formatter(value, subject_field, doc);
      }
      if (!value) {
        value = doc.name;
      }
      if (frappe.model.html_fieldtypes.includes(subject_field.fieldtype)) {
        return frappe.utils.html2text(value);
      } else {
        return value;
      }
    }
    get_indicator_html(doc, show_workflow_state) {
      const indicator = frappe.get_indicator(doc, this.doctype, show_workflow_state);
      const docstatus_description = [
        __("Document is in draft state"),
        __("Document has been submitted"),
        __("Document has been cancelled")
      ];
      const title = docstatus_description[doc.docstatus || 0];
      if (indicator) {
        return `<span class="indicator-pill ${indicator[1]} filterable no-indicator-dot ellipsis"
				data-filter='${indicator[2]}' title='${title}'>
				<span class="ellipsis"> ${indicator[0]}</span>
			</span>`;
      }
      return "";
    }
    get_indicator_dot(doc) {
      const indicator = frappe.get_indicator(doc, this.doctype);
      if (!indicator)
        return "";
      return `<span class='indicator ${indicator[1]}' title='${indicator[0]}'></span>`;
    }
    get_image_url(doc) {
      let url = doc.image ? doc.image : doc[this.meta.image_field];
      if (window.cordova && !frappe.utils.is_url(url)) {
        url = frappe.base_url + url;
      }
      return url || null;
    }
    setup_events() {
      this.setup_filterable();
      this.setup_sort_by();
      this.setup_list_click();
      this.setup_drag_click();
      this.setup_tag_event();
      this.setup_new_doc_event();
      this.setup_check_events();
      this.setup_like();
      this.setup_realtime_updates();
      this.setup_action_handler();
      this.setup_keyboard_navigation();
    }
    setup_keyboard_navigation() {
      let focus_first_row = () => {
        this.$result.find(".list-row-container:first").focus();
      };
      let focus_next = () => {
        $(document.activeElement).next().focus();
      };
      let focus_prev = () => {
        $(document.activeElement).prev().focus();
      };
      let list_row_focused = () => {
        return $(document.activeElement).is(".list-row-container");
      };
      let check_row = ($row) => {
        let $input = $row.find("input[type=checkbox]");
        $input.click();
      };
      let get_list_row_if_focused = () => list_row_focused() ? $(document.activeElement) : null;
      let is_current_page = () => this.page.wrapper.is(":visible");
      let is_input_focused = () => $(document.activeElement).is("input");
      let handle_navigation = (direction) => {
        if (!is_current_page() || is_input_focused())
          return false;
        let $list_row = get_list_row_if_focused();
        if ($list_row) {
          direction === "down" ? focus_next() : focus_prev();
        } else {
          focus_first_row();
        }
      };
      frappe.ui.keys.add_shortcut({
        shortcut: "down",
        action: () => handle_navigation("down"),
        description: __("Navigate list down", null, "Description of a list view shortcut"),
        page: this.page
      });
      frappe.ui.keys.add_shortcut({
        shortcut: "up",
        action: () => handle_navigation("up"),
        description: __("Navigate list up", null, "Description of a list view shortcut"),
        page: this.page
      });
      frappe.ui.keys.add_shortcut({
        shortcut: "shift+down",
        action: () => {
          if (!is_current_page() || is_input_focused())
            return false;
          let $list_row = get_list_row_if_focused();
          check_row($list_row);
          focus_next();
        },
        description: __(
          "Select multiple list items",
          null,
          "Description of a list view shortcut"
        ),
        page: this.page
      });
      frappe.ui.keys.add_shortcut({
        shortcut: "shift+up",
        action: () => {
          if (!is_current_page() || is_input_focused())
            return false;
          let $list_row = get_list_row_if_focused();
          check_row($list_row);
          focus_prev();
        },
        description: __(
          "Select multiple list items",
          null,
          "Description of a list view shortcut"
        ),
        page: this.page
      });
      frappe.ui.keys.add_shortcut({
        shortcut: "enter",
        action: () => {
          let $list_row = get_list_row_if_focused();
          if ($list_row) {
            $list_row.find("a[data-name]")[0].click();
            return true;
          }
          return false;
        },
        description: __("Open list item", null, "Description of a list view shortcut"),
        page: this.page
      });
      frappe.ui.keys.add_shortcut({
        shortcut: "space",
        action: () => {
          let $list_row = get_list_row_if_focused();
          if ($list_row) {
            check_row($list_row);
            return true;
          }
          return false;
        },
        description: __("Select list item", null, "Description of a list view shortcut"),
        page: this.page
      });
    }
    setup_filterable() {
      this.$result.on("click", ".filterable", (e) => {
        if (e.metaKey || e.ctrlKey)
          return;
        e.stopPropagation();
        const $this = $(e.currentTarget);
        const filters = $this.attr("data-filter").split("|");
        const filters_to_apply = filters.map((f) => {
          f = f.split(",");
          if (f[2] === "Today") {
            f[2] = frappe.datetime.get_today();
          } else if (f[2] == "User") {
            f[2] = frappe.session.user;
          }
          this.filter_area.remove(f[0]);
          return [this.doctype, f[0], f[1], f.slice(2).join(",")];
        });
        this.filter_area.add(filters_to_apply);
      });
    }
    setup_sort_by() {
      this.$result.on("click", "[data-sort-by]", (e) => {
        const sort_by = e.currentTarget.getAttribute("data-sort-by");
        if (!sort_by)
          return;
        let sort_order = "asc";
        if (this.sort_by === sort_by) {
          sort_order = this.sort_order === "asc" ? "desc" : "asc";
        }
        this.sort_selector.set_value(sort_by, sort_order);
        this.on_sort_change(sort_by, sort_order);
      });
    }
    setup_list_click() {
      this.$result.on("click", ".list-row, .image-view-header, .file-header", (e) => {
        const $target = $(e.target);
        if ((e.ctrlKey || e.metaKey) && !$target.is("a")) {
          const $list_row = $(e.currentTarget);
          const $check = $list_row.find(".list-row-checkbox");
          $check.prop("checked", !$check.prop("checked"));
          e.preventDefault();
          this.on_row_checked();
          return;
        }
        if ($target.hasClass("filterable") || $target.hasClass("select-like") || $target.hasClass("file-select") || $target.hasClass("list-row-like") || $target.is(":checkbox")) {
          e.stopPropagation();
          return;
        }
        if ($target.is("a"))
          return;
        const $row = $(e.currentTarget);
        const link = $row.find(".list-subject a").get(0);
        if (link) {
          frappe.set_route(link.pathname);
          return false;
        }
      });
    }
    setup_drag_click() {
      this.dragClick = false;
      this.$result.on("mousedown", ".list-row-checkbox", (e) => {
        var _a2, _b;
        (_a2 = e.stopPropagation) == null ? void 0 : _a2.call(e);
        (_b = e.preventDefault) == null ? void 0 : _b.call(e);
        this.dragClick = true;
        this.check = !e.target.checked;
      });
      $(document).on("mouseup", () => {
        this.dragClick = false;
      });
      this.$result.on("mousemove", ".level.list-row", (e) => {
        if (this.dragClick) {
          this.check_row_on_drag(e, this.check);
        }
      });
    }
    check_row_on_drag(event, check = true) {
      $(event.target).find(".list-row-checkbox").prop("checked", check);
      this.on_row_checked();
    }
    setup_action_handler() {
      this.$result.on("click", ".btn-action", (e) => {
        const $button = $(e.currentTarget);
        const doc = this.data[$button.attr("data-idx")];
        this.settings.button.action(doc);
        e.stopPropagation();
        return false;
      });
    }
    setup_check_events() {
      this.$result.on("change", "input[type=checkbox]", (e) => {
        const $target = $(e.currentTarget);
        if ($target.is(".list-header-subject .list-check-all")) {
          const $check = this.$result.find(".checkbox-actions .list-check-all");
          $check.prop("checked", $target.prop("checked"));
          $check.trigger("change");
        } else if ($target.is(".checkbox-actions .list-check-all")) {
          const $check = this.$result.find(".list-header-subject .list-check-all");
          $check.prop("checked", $target.prop("checked"));
          this.$result.find(".list-row-checkbox").prop("checked", $target.prop("checked"));
        } else if ($target.attr("data-parent")) {
          this.$result.find(`.${$target.attr("data-parent")}`).find(".list-row-checkbox").prop("checked", $target.prop("checked"));
        }
        this.on_row_checked();
      });
      this.$result.on("click", ".list-row-checkbox", (e) => {
        const $target = $(e.currentTarget);
        if (e.shiftKey && this.$checkbox_cursor && !$target.is(this.$checkbox_cursor)) {
          const name_1 = decodeURIComponent(this.$checkbox_cursor.data().name);
          const name_2 = decodeURIComponent($target.data().name);
          const index_1 = this.data.findIndex((d) => d.name === name_1);
          const index_2 = this.data.findIndex((d) => d.name === name_2);
          let [min_index, max_index] = [index_1, index_2];
          if (min_index > max_index) {
            [min_index, max_index] = [max_index, min_index];
          }
          let docnames = this.data.slice(min_index + 1, max_index).map((d) => d.name);
          const selector = docnames.map((name) => `.list-row-checkbox[data-name="${encodeURIComponent(name)}"]`).join(",");
          this.$result.find(selector).prop("checked", true);
        }
        this.$checkbox_cursor = $target;
        this.update_checkbox($target);
      });
      let me = this;
      this.page.actions_btn_group.on("show.bs.dropdown", () => {
        me.toggle_workflow_actions();
      });
    }
    setup_like() {
      this.$result.on("click", ".like-action", (e) => {
        const $this = $(e.currentTarget);
        const { doctype, name } = $this.data();
        frappe.ui.toggle_like($this, doctype, name);
        return false;
      });
      this.$result.on("click", ".list-liked-by-me", (e) => {
        const $this = $(e.currentTarget);
        $this.toggleClass("active");
        if ($this.hasClass("active")) {
          this.filter_area.add(
            this.doctype,
            "_liked_by",
            "like",
            "%" + frappe.session.user + "%"
          );
        } else {
          this.filter_area.remove("_liked_by");
        }
      });
    }
    setup_new_doc_event() {
      this.$no_result.find(".btn-new-doc").click(() => {
        if (this.settings.primary_action) {
          this.settings.primary_action();
        } else {
          this.make_new_doc();
        }
      });
    }
    setup_tag_event() {
      this.tags_shown = false;
      this.list_sidebar && this.list_sidebar.parent.on("click", ".list-tag-preview", () => {
        this.tags_shown = !this.tags_shown;
        this.toggle_tags();
      });
    }
    setup_realtime_updates() {
      var _a2;
      this.pending_document_refreshes = [];
      if (((_a2 = this.list_view_settings) == null ? void 0 : _a2.disable_auto_refresh) || this.realtime_events_setup) {
        return;
      }
      frappe.realtime.doctype_subscribe(this.doctype);
      frappe.realtime.off("list_update");
      frappe.realtime.on("list_update", (data) => {
        if ((data == null ? void 0 : data.doctype) !== this.doctype) {
          return;
        }
        if (this.$checks && this.$checks.length) {
          return;
        }
        if (this.avoid_realtime_update()) {
          return;
        }
        this.pending_document_refreshes.push(data);
        this.debounced_refresh();
      });
      this.realtime_events_setup = true;
    }
    disable_realtime_updates() {
      frappe.realtime.doctype_unsubscribe(this.doctype);
      this.realtime_events_setup = false;
    }
    process_document_refreshes() {
      if (!this.pending_document_refreshes.length)
        return;
      const route = frappe.get_route() || [];
      if (!cur_list || route[0] != "List" || cur_list.doctype != route[1]) {
        this.pending_document_refreshes = [];
        this.disable_realtime_updates();
        return;
      }
      const names = this.pending_document_refreshes.map((d) => d.name);
      this.pending_document_refreshes = this.pending_document_refreshes.filter(
        (d) => names.indexOf(d.name) === -1
      );
      if (!names.length)
        return;
      const call_args = this.get_call_args();
      call_args.args.filters.push([this.doctype, "name", "in", names]);
      call_args.args.start = 0;
      frappe.call(call_args).then(({ message }) => {
        if (!message)
          return;
        const data = frappe.utils.dict(message.keys, message.values);
        if (!(data && data.length)) {
          this.data = this.data.filter((d) => !names.includes(d.name));
          for (let name of names) {
            this.$result.find(`.list-row-checkbox[data-name='${name.replace(/'/g, "\\'")}']`).closest(".list-row-container").remove();
          }
          return;
        }
        data.forEach((datum) => {
          const index = this.data.findIndex((doc) => doc.name === datum.name);
          if (index === -1) {
            this.data.push(datum);
          } else {
            this.data[index] = datum;
          }
        });
        this.data.sort((a, b) => {
          const a_value = a[this.sort_by] || "";
          const b_value = b[this.sort_by] || "";
          let return_value = 0;
          if (a_value > b_value) {
            return_value = 1;
          }
          if (b_value > a_value) {
            return_value = -1;
          }
          if (this.sort_order === "desc") {
            return_value = -return_value;
          }
          return return_value;
        });
        if (this.$checks && this.$checks.length) {
          this.set_rows_as_checked();
        }
        this.toggle_result_area();
        this.render_list();
      });
    }
    avoid_realtime_update() {
      var _a2;
      if ((_a2 = this.filter_area) == null ? void 0 : _a2.is_being_edited()) {
        return true;
      }
      if (this.disable_list_update) {
        return true;
      }
      return false;
    }
    set_rows_as_checked() {
      if (!this.$checks || !this.$checks.length) {
        return;
      }
      $.each(this.$checks, (i, el) => {
        let docname = $(el).attr("data-name");
        this.$result.find(`.list-row-checkbox[data-name='${docname}']`).prop("checked", true);
      });
      this.on_row_checked();
    }
    on_row_checked() {
      this.$list_head_subject = this.$list_head_subject || this.$result.find("header .list-header-subject");
      this.$checkbox_actions = this.$checkbox_actions || this.$result.find("header .checkbox-actions");
      this.$checks = this.$result.find(".list-row-checkbox:checked");
      this.$list_head_subject.toggle(this.$checks.length === 0);
      this.$checkbox_actions.toggle(this.$checks.length > 0);
      if (this.$checks.length === 0) {
        this.$list_head_subject.find(".list-check-all").prop("checked", false);
      } else {
        this.$checkbox_actions.find(".list-header-meta").html(__("{0} items selected", [this.$checks.length]));
        this.$checkbox_actions.show();
        this.$list_head_subject.hide();
      }
      this.update_checkbox();
      this.toggle_actions_menu_button(this.$checks.length > 0);
    }
    toggle_tags() {
      this.$result.find(".tag-col").toggleClass("hide");
      const preview_label = this.tags_shown ? __("Hide Tags") : __("Show Tags");
      this.list_sidebar.parent.find(".list-tag-preview").text(preview_label);
    }
    get_checked_items(only_docnames) {
      const docnames = Array.from(this.$checks || []).map(
        (check) => cstr(unescape($(check).data().name))
      );
      if (only_docnames)
        return docnames;
      return this.data.filter((d) => docnames.includes(d.name));
    }
    clear_checked_items() {
      this.$checks && this.$checks.prop("checked", false);
      this.on_row_checked();
    }
    save_view_user_settings(obj) {
      return frappe.model.user_settings.save(this.doctype, this.view_name, obj);
    }
    on_update() {
    }
    update_url_with_filters() {
      if (frappe.get_route_str() == this.page_name && !this.report_name) {
        window.history.replaceState(null, null, this.get_url_with_filters());
      }
    }
    get_url_with_filters() {
      let search_params = this.get_search_params();
      let full_url = window.location.href.replace(window.location.search, "");
      if (search_params.size) {
        full_url += "?" + search_params.toString();
      }
      return full_url;
    }
    get_search_params() {
      let search_params = new URLSearchParams();
      this.get_filters_for_args().forEach((filter) => {
        if (filter[2] === "=") {
          search_params.append(filter[1], filter[3]);
        } else {
          search_params.append(filter[1], JSON.stringify([filter[2], filter[3]]));
        }
      });
      return search_params;
    }
    get_menu_items() {
      const doctype = this.doctype;
      const items = [];
      if (frappe.model.can_import(doctype, null, this.meta)) {
        items.push({
          label: __("Import", null, "Button in list view menu"),
          action: () => frappe.set_route("list", "data-import", {
            reference_doctype: doctype
          }),
          standard: true
        });
      }
      if (frappe.user_roles.includes("System Manager")) {
        items.push({
          label: __("User Permissions", null, "Button in list view menu"),
          action: () => frappe.set_route("list", "user-permission", {
            allow: doctype
          }),
          standard: true
        });
      }
      if (frappe.user_roles.includes("System Manager")) {
        items.push({
          label: __("Role Permissions Manager", null, "Button in list view menu"),
          action: () => frappe.set_route("permission-manager", {
            doctype
          }),
          standard: true
        });
      }
      if (frappe.model.can_create("Custom Field") && frappe.model.can_create("Property Setter")) {
        items.push({
          label: __("Customize", null, "Button in list view menu"),
          action: () => {
            if (!this.meta)
              return;
            if (this.meta.custom) {
              frappe.set_route("form", "doctype", doctype);
            } else if (!this.meta.custom) {
              frappe.set_route("form", "customize-form", {
                doc_type: doctype
              });
            }
          },
          standard: true,
          shortcut: "Ctrl+J"
        });
      }
      items.push({
        label: __("Toggle Sidebar", null, "Button in list view menu"),
        action: () => this.toggle_side_bar(),
        condition: () => !this.page.disable_sidebar_toggle,
        standard: true,
        shortcut: "Ctrl+K"
      });
      if (frappe.user.has_role("System Manager") && frappe.boot.developer_mode === 1) {
        items.push({
          label: __("Edit DocType", null, "Button in list view menu"),
          action: () => frappe.set_route("form", "doctype", doctype),
          standard: true
        });
      }
      if (frappe.user.has_role("System Manager")) {
        if (this.get_view_settings) {
          items.push(this.get_view_settings());
        }
      }
      return items;
    }
    get_view_settings() {
      return {
        label: __("List Settings", null, "Button in list view menu"),
        action: () => this.show_list_settings(),
        standard: true
      };
    }
    show_list_settings() {
      frappe.model.with_doctype(this.doctype, () => {
        new ListSettings({
          listview: this,
          doctype: this.doctype,
          settings: this.list_view_settings,
          meta: frappe.get_meta(this.doctype)
        });
      });
    }
    get_workflow_action_menu_items() {
      const workflow_actions = [];
      const me = this;
      if (frappe.model.has_workflow(this.doctype)) {
        const actions = frappe.workflow.get_all_transition_actions(this.doctype);
        actions.forEach((action) => {
          workflow_actions.push({
            label: __(action),
            name: action,
            action: () => {
              me.disable_list_update = true;
              frappe.xcall("frappe.model.workflow.bulk_workflow_approval", {
                docnames: this.get_checked_items(true),
                doctype: this.doctype,
                action
              }).finally(() => {
                me.disable_list_update = false;
              });
            },
            is_workflow_action: true
          });
        });
      }
      return workflow_actions;
    }
    toggle_workflow_actions() {
      if (!frappe.model.has_workflow(this.doctype))
        return;
      Object.keys(this.workflow_action_items).forEach((key) => {
        this.workflow_action_items[key].addClass("disabled");
      });
      const checked_items = this.get_checked_items();
      frappe.xcall("frappe.model.workflow.get_common_transition_actions", {
        docs: checked_items,
        doctype: this.doctype
      }).then((actions) => {
        Object.keys(this.workflow_action_items).forEach((key) => {
          this.workflow_action_items[key].removeClass("disabled");
          this.workflow_action_items[key].toggle(actions.includes(key));
        });
      });
    }
    get_actions_menu_items() {
      const doctype = this.doctype;
      const actions_menu_items = [];
      const bulk_operations = new BulkOperations({ doctype: this.doctype });
      const is_field_editable = (field_doc) => {
        return field_doc.fieldname && frappe.model.is_value_type(field_doc) && field_doc.fieldtype !== "Read Only" && !field_doc.hidden && !field_doc.read_only && !field_doc.is_virtual;
      };
      const has_editable_fields = (doctype2) => {
        return frappe.meta.get_docfields(doctype2).some((field_doc) => is_field_editable(field_doc));
      };
      const has_submit_permission = (doctype2) => {
        return frappe.perm.has_perm(doctype2, 0, "submit");
      };
      const is_bulk_edit_allowed = (doctype2) => {
        var _a2;
        if (frappe.model.has_workflow(doctype2)) {
          return !!((_a2 = this.list_view_settings) == null ? void 0 : _a2.allow_edit);
        }
        return true;
      };
      const bulk_assignment = () => {
        return {
          label: __("Assign To", null, "Button in list view actions menu"),
          action: () => {
            this.disable_list_update = true;
            bulk_operations.assign(this.get_checked_items(true), () => {
              this.disable_list_update = false;
              this.clear_checked_items();
              this.refresh();
            });
          },
          standard: true
        };
      };
      const bulk_assignment_clear = () => {
        return {
          label: __("Clear Assignment", null, "Button in list view actions menu"),
          action: () => {
            frappe.confirm(
              "Are you sure you want to clear the assignments?",
              () => {
                this.disable_list_update = true;
                bulk_operations.clear_assignment(this.get_checked_items(true), () => {
                  this.disable_list_update = false;
                  this.clear_checked_items();
                  this.refresh();
                });
              },
              () => {
                this.clear_checked_items();
                this.refresh();
              }
            );
          },
          standard: true
        };
      };
      const bulk_assignment_rule = () => {
        return {
          label: __("Apply Assignment Rule", null, "Button in list view actions menu"),
          action: () => {
            this.disable_list_update = true;
            bulk_operations.apply_assignment_rule(this.get_checked_items(true), () => {
              this.disable_list_update = false;
              this.clear_checked_items();
              this.refresh();
            });
          },
          standard: true
        };
      };
      const bulk_add_tags = () => {
        return {
          label: __("Add Tags", null, "Button in list view actions menu"),
          action: () => {
            this.disable_list_update = true;
            bulk_operations.add_tags(this.get_checked_items(true), () => {
              this.disable_list_update = false;
              this.clear_checked_items();
              this.refresh();
            });
          },
          standard: true
        };
      };
      const bulk_printing = () => {
        return {
          label: __("Print", null, "Button in list view actions menu"),
          action: () => bulk_operations.print(this.get_checked_items()),
          standard: true
        };
      };
      const bulk_delete = () => {
        return {
          label: __("Delete", null, "Button in list view actions menu"),
          action: () => {
            const docnames = this.get_checked_items(true).map(
              (docname) => docname.toString()
            );
            let message = __(
              "Delete {0} item permanently?",
              [docnames.length],
              "Title of confirmation dialog"
            );
            if (docnames.length > 1) {
              message = __(
                "Delete {0} items permanently?",
                [docnames.length],
                "Title of confirmation dialog"
              );
            }
            frappe.confirm(message, () => {
              this.disable_list_update = true;
              bulk_operations.delete(docnames, () => {
                this.disable_list_update = false;
                this.clear_checked_items();
                this.refresh();
              });
            });
          },
          standard: true
        };
      };
      const bulk_cancel = () => {
        return {
          label: __("Cancel", null, "Button in list view actions menu"),
          action: () => {
            const docnames = this.get_checked_items(true);
            if (docnames.length > 0) {
              frappe.confirm(
                __(
                  "Cancel {0} documents?",
                  [docnames.length],
                  "Title of confirmation dialog"
                ),
                () => {
                  this.disable_list_update = true;
                  bulk_operations.submit_or_cancel(docnames, "cancel", () => {
                    this.disable_list_update = false;
                    this.clear_checked_items();
                    this.refresh();
                  });
                }
              );
            }
          },
          standard: true
        };
      };
      const bulk_submit = () => {
        return {
          label: __("Submit", null, "Button in list view actions menu"),
          action: () => {
            const docnames = this.get_checked_items(true);
            if (docnames.length > 0) {
              frappe.confirm(
                __(
                  "Submit {0} documents?",
                  [docnames.length],
                  "Title of confirmation dialog"
                ),
                () => {
                  this.disable_list_update = true;
                  bulk_operations.submit_or_cancel(docnames, "submit", () => {
                    this.disable_list_update = false;
                    this.clear_checked_items();
                    this.refresh();
                  });
                }
              );
            }
          },
          standard: true
        };
      };
      const bulk_edit = () => {
        return {
          label: __("Edit", null, "Button in list view actions menu"),
          action: () => {
            let field_mappings = {};
            frappe.meta.get_docfields(doctype).forEach((field_doc) => {
              if (is_field_editable(field_doc)) {
                field_mappings[field_doc.label] = Object.assign({}, field_doc);
              }
            });
            this.disable_list_update = true;
            bulk_operations.edit(this.get_checked_items(true), field_mappings, () => {
              this.disable_list_update = false;
              this.refresh();
            });
          },
          standard: true
        };
      };
      const bulk_export = () => {
        return {
          label: __("Export", null, "Button in list view actions menu"),
          action: () => {
            const docnames = this.get_checked_items(true);
            bulk_operations.export(doctype, docnames);
          },
          standard: true
        };
      };
      if (has_editable_fields(doctype) && is_bulk_edit_allowed(doctype)) {
        actions_menu_items.push(bulk_edit());
      }
      actions_menu_items.push(bulk_export());
      actions_menu_items.push(bulk_assignment());
      actions_menu_items.push(bulk_assignment_clear());
      actions_menu_items.push(bulk_assignment_rule());
      actions_menu_items.push(bulk_add_tags());
      if (frappe.model.can_print(doctype)) {
        actions_menu_items.push(bulk_printing());
      }
      if (frappe.model.is_submittable(doctype) && has_submit_permission(doctype) && !frappe.model.has_workflow(doctype)) {
        actions_menu_items.push(bulk_submit());
      }
      if (frappe.model.can_cancel(doctype) && !frappe.model.has_workflow(doctype)) {
        actions_menu_items.push(bulk_cancel());
      }
      if (frappe.model.can_delete(doctype) && is_bulk_edit_allowed(doctype)) {
        actions_menu_items.push(bulk_delete());
      }
      return actions_menu_items;
    }
    parse_filters_from_route_options() {
      const filters = [];
      let params = new URLSearchParams(window.location.search);
      if (!params.toString() && frappe.route_options) {
        params = new Map(Object.entries(frappe.route_options));
      }
      params.forEach((value, field) => {
        let doctype = null;
        let value_array;
        if ($.isArray(value) && value[0].startsWith("[") && value[0].endsWith("]")) {
          value_array = [];
          for (var i = 0; i < value.length; i++) {
            value_array.push(JSON.parse(value[i]));
          }
        } else if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
          value = JSON.parse(value);
        }
        if (field.includes(".")) {
          doctype = field.split(".")[0];
          field = field.split(".")[1];
        }
        if (!doctype) {
          doctype = frappe.meta.get_doctype_for_field(this.doctype, field);
        }
        if (doctype) {
          if (value_array) {
            for (var j = 0; j < value_array.length; j++) {
              if ($.isArray(value_array[j])) {
                filters.push([doctype, field, value_array[j][0], value_array[j][1]]);
              } else {
                filters.push([doctype, field, "=", value_array[j]]);
              }
            }
          } else if ($.isArray(value)) {
            filters.push([doctype, field, value[0], value[1]]);
          } else {
            filters.push([doctype, field, "=", value]);
          }
        }
      });
      return filters;
    }
  };
  frappe.get_list_view = (doctype) => {
    let route = `List/${doctype}/List`;
    return frappe.views.list_view[route];
  };
  var ElementFactory = class {
    constructor(doctype) {
      this.templates = {
        checkbox: this.create_checkbox_element(doctype),
        checkboxspan: this.create_checkboxspan_element(),
        link: this.create_link_element(doctype),
        like: this.create_like_element(doctype)
      };
    }
    create_checkbox_element(doctype) {
      const checkbox = document.createElement("input");
      checkbox.classList.add("list-row-checkbox");
      checkbox.type = "checkbox";
      checkbox.dataset.doctype = doctype;
      return checkbox;
    }
    create_link_element(doctype) {
      const link = document.createElement("a");
      link.classList.add("ellipsis");
      link.dataset.doctype = doctype;
      return link;
    }
    create_checkboxspan_element() {
      const checkboxspan = document.createElement("span");
      checkboxspan.classList.add("level-item", "select-like");
      return checkboxspan;
    }
    create_like_element(doctype) {
      const like = document.createElement("span");
      like.classList.add("like-action");
      like.innerHTML = frappe.utils.icon("es-solid-heart", "sm", "like-icon");
      like.dataset.doctype = doctype;
      return like;
    }
    get_checkbox_element(name) {
      const checkbox = this.templates.checkbox.cloneNode(true);
      checkbox.dataset.name = name;
      return checkbox;
    }
    get_checkboxspan_element() {
      return this.templates.checkboxspan.cloneNode(true);
    }
    get_link_element(name, href, text) {
      const link = this.templates.link.cloneNode(true);
      link.dataset.name = name;
      link.href = href;
      link.title = text;
      link.textContent = text;
      return link;
    }
    get_like_element(name, liked, liked_by, title) {
      const like = this.templates.like.cloneNode(true);
      like.dataset.name = name;
      const heart_classes = liked ? ["liked-by", "liked"] : ["not-liked"];
      like.classList.add(...heart_classes);
      like.setAttribute("data-liked-by", liked_by || "[]");
      like.setAttribute("title", title);
      return like;
    }
  };

  // ../superproject/superproject/public/js/superproject/list/list_view_select.js
  frappe.provide("frappe.views");
  frappe.views.ListViewSelect = class ListViewSelect {
    constructor(opts) {
      $.extend(this, opts);
      this.set_current_view();
      this.setup_views();
    }
    add_view_to_menu(view, action) {
      if (this.doctype == "File" && view == "List") {
        view = "File";
      }
      let $el = this.page.add_custom_menu_item(
        this.parent,
        this.label_map[view] || __(view),
        action,
        true,
        null,
        this.icon_map[view] || "list"
      );
      $el.parent().attr("data-view", view);
    }
    set_current_view() {
      this.label_map.Facenet = "Facenet View";
      this.current_view = "List";
      const route = frappe.get_route();
      const view_name = frappe.utils.to_title_case(route[2] || "");
      if (route.length > 2 && frappe.views.view_modes.includes(view_name)) {
        this.current_view = view_name;
        if (this.current_view === "Kanban") {
          this.kanban_board = route[3];
        } else if (this.current_view === "Inbox") {
          this.email_account = route[3];
        }
      }
    }
    set_route(view, calendar_name) {
      const route = [this.slug(), "view", view];
      if (calendar_name)
        route.push(calendar_name);
      let search_params = cur_list == null ? void 0 : cur_list.get_search_params();
      if (search_params) {
        frappe.route_options = Object.fromEntries(search_params);
      }
      frappe.set_route(route);
    }
    setup_views() {
      const views = {
        List: {
          condition: true,
          action: () => this.set_route("list")
        },
        Report: {
          condition: true,
          action: () => this.set_route("report"),
          current_view_handler: () => {
            const reports = this.get_reports();
            let default_action = {};
            if (frappe.get_route().length > 3) {
              default_action = {
                label: __("Report Builder"),
                action: () => this.set_route("report")
              };
            }
            this.setup_dropdown_in_sidebar("Report", reports, default_action);
          }
        },
        Dashboard: {
          condition: true,
          action: () => this.set_route("dashboard")
        },
        Calendar: {
          condition: frappe.views.calendar[this.doctype],
          action: () => this.set_route("calendar", "default"),
          current_view_handler: () => {
            this.get_calendars().then((calendars) => {
              this.setup_dropdown_in_sidebar("Calendar", calendars);
            });
          }
        },
        Gantt: {
          condition: frappe.views.calendar[this.doctype],
          action: () => this.set_route("gantt")
        },
        Inbox: {
          condition: this.doctype === "Communication" && frappe.boot.email_accounts.length,
          action: () => this.set_route("inbox"),
          current_view_handler: () => {
            const accounts = this.get_email_accounts();
            let default_action;
            if (has_common(frappe.user_roles, ["System Manager", "Administrator"])) {
              default_action = {
                label: __("New Email Account"),
                action: () => frappe.new_doc("Email Account")
              };
            }
            this.setup_dropdown_in_sidebar("Inbox", accounts, default_action);
          }
        },
        Image: {
          condition: this.list_view.meta.image_field,
          action: () => this.set_route("image")
        },
        Tree: {
          condition: frappe.treeview_settings[this.doctype] || frappe.get_meta(this.doctype).is_tree,
          action: () => this.set_route("tree")
        },
        Kanban: {
          condition: this.doctype != "File",
          action: () => this.setup_kanban_boards(),
          current_view_handler: () => {
            frappe.views.KanbanView.get_kanbans(this.doctype).then(
              (kanbans) => this.setup_kanban_switcher(kanbans)
            );
          }
        },
        Map: {
          condition: this.list_view.settings.get_coords_method || this.list_view.meta.fields.find((i) => i.fieldname === "latitude") && this.list_view.meta.fields.find((i) => i.fieldname === "longitude") || this.list_view.meta.fields.find(
            (i) => i.fieldname === "location" && i.fieldtype == "Geolocation"
          ),
          action: () => this.set_route("map")
        },
        Facenet: {
          condition: true,
          action: () => this.set_route("facenet")
        }
      };
      frappe.views.view_modes.forEach((view) => {
        if (this.current_view !== view && views[view].condition) {
          this.add_view_to_menu(view, views[view].action);
        }
        if (this.current_view == view) {
          views[view].current_view_handler && views[view].current_view_handler();
        }
      });
    }
    setup_dropdown_in_sidebar(view, items, default_action) {
      if (!this.sidebar)
        return;
      const views_wrapper = this.sidebar.sidebar.find(".views-section");
      views_wrapper.find(".sidebar-label").html(__(view));
      const $dropdown = views_wrapper.find(".views-dropdown");
      let placeholder = __("Select {0}", [__(view)]);
      let html = ``;
      if (!items || !items.length) {
        html = `<div class="empty-state">
						${__("No {0} Found", [__(view)])}
				</div>`;
      } else {
        const page_name = this.get_page_name();
        items.map((item) => {
          if (item.name.toLowerCase() == page_name.toLowerCase()) {
            placeholder = item.name;
          } else {
            html += `<li><a class="dropdown-item" href="${item.route}">${item.name}</a></li>`;
          }
        });
      }
      views_wrapper.find(".selected-view").html(placeholder);
      if (default_action) {
        views_wrapper.find(".sidebar-action a").html(default_action.label);
        views_wrapper.find(".sidebar-action a").click(() => default_action.action());
      }
      $dropdown.html(html);
      views_wrapper.removeClass("hide");
    }
    setup_kanban_switcher(kanbans) {
      const kanban_switcher = this.page.add_custom_button_group(
        __("Select Kanban"),
        null,
        this.list_view.$filter_section
      );
      kanbans.map((k) => {
        this.page.add_custom_menu_item(
          kanban_switcher,
          k.name,
          () => this.set_route("kanban", k.name),
          false
        );
      });
      let perms = this.list_view.board_perms;
      let can_create = perms ? perms.create : true;
      if (can_create) {
        this.page.add_custom_menu_item(
          kanban_switcher,
          __("Create New Kanban Board"),
          () => frappe.views.KanbanView.show_kanban_dialog(this.doctype),
          true
        );
      }
    }
    get_page_name() {
      return frappe.utils.to_title_case(frappe.get_route().slice(-1)[0] || "");
    }
    get_reports() {
      let added = [];
      let reports_to_add = [];
      let add_reports = (reports2) => {
        reports2.map((r) => {
          if (!r.ref_doctype || r.ref_doctype == this.doctype) {
            const report_type = r.report_type === "Report Builder" ? `/app/list/${r.ref_doctype}/report` : "/app/query-report";
            const route = r.route || report_type + "/" + (r.title || r.name);
            if (added.indexOf(route) === -1) {
              added.push(route);
              reports_to_add.push({
                name: __(r.title || r.name),
                route
              });
            }
          }
        });
      };
      if (this.list_view.settings.reports) {
        add_reports(this.list_view.settings.reports);
      }
      var reports = Object.values(frappe.boot.user.all_reports).sort(
        (a, b) => a.title.localeCompare(b.title)
      ) || [];
      add_reports(reports);
      return reports_to_add;
    }
    setup_kanban_boards() {
      var _a2;
      function fetch_kanban_board(doctype) {
        frappe.db.get_value(
          "Kanban Board",
          { reference_doctype: doctype },
          "name",
          (board) => {
            if (!$.isEmptyObject(board)) {
              frappe.set_route("list", doctype, "kanban", board.name);
            } else {
              frappe.views.KanbanView.show_kanban_dialog(doctype);
            }
          }
        );
      }
      const last_opened_kanban = (_a2 = frappe.model.user_settings[this.doctype]["Kanban"]) == null ? void 0 : _a2.last_kanban_board;
      if (!last_opened_kanban) {
        fetch_kanban_board(this.doctype);
      } else {
        frappe.db.exists("Kanban Board", last_opened_kanban).then((exists) => {
          if (exists) {
            frappe.set_route("list", this.doctype, "kanban", last_opened_kanban);
          } else {
            fetch_kanban_board(this.doctype);
          }
        });
      }
    }
    get_calendars() {
      const doctype = this.doctype;
      let calendars = [];
      return frappe.db.get_list("Calendar View", {
        filters: {
          reference_doctype: doctype
        }
      }).then((result) => {
        if (!(result && Array.isArray(result) && result.length))
          return;
        if (frappe.views.calendar[this.doctype]) {
          calendars.push({
            name: "Default",
            route: `/app/${this.slug()}/view/calendar/default`
          });
        }
        result.map((calendar) => {
          calendars.push({
            name: calendar.name,
            route: `/app/${this.slug()}/view/calendar/${calendar.name}`
          });
        });
        return calendars;
      });
    }
    get_email_accounts() {
      let accounts_to_add = [];
      let accounts = frappe.boot.email_accounts;
      accounts.forEach((account) => {
        let email_account = account.email_id == "All Accounts" ? "All Accounts" : account.email_account;
        let route = `/app/communication/view/inbox/${email_account}`;
        let display_name = ["All Accounts", "Sent Mail", "Spam", "Trash"].includes(
          account.email_id
        ) ? __(account.email_id) : account.email_account;
        accounts_to_add.push({
          name: display_name,
          route
        });
      });
      return accounts_to_add;
    }
    slug() {
      return frappe.router.slug(frappe.router.doctype_layout || this.doctype);
    }
  };
  frappe.views.view_modes.push("Facenet");

  // ../superproject/superproject/public/js/superproject/views/facenet/facenet_view.js
  frappe.provide("frappe.views");
  var _a;
  frappe.views.FacenetView = (_a = class extends frappe.views.ListView {
    get view_name() {
      return "FaceNet";
    }
    render() {
    }
    setup_defaults() {
      super.setup_defaults();
      this.page_title = __("FaceNet:") + " " + this.page_title;
      this.view = "FaceNet";
      return this.get_list_view_settings();
    }
    setup_page() {
      this.hide_filters = true;
      this.hide_sort_selector = true;
      super.setup_page();
      frappe.after_ajax(() => {
        const $label = $(".custom-btn-group-label");
        $label.text("FaceNet View");
        const $icon = $label.closest(".btn-group").find("svg use");
        $icon.attr("href", "#icon-list");
      });
    }
    setup_view() {
      this.setup_facenet_page();
    }
    setup_facenet_page() {
      const facenet_wrapper_html = `<div class="facenet-view">Anh L\u1ED9c ch\u1EBB ch\xE2u</div>`;
      this.$frappe_list.html(facenet_wrapper_html);
      this.wrapper = this.$frappe_list.find(".facenet-view");
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
        }
      });
    }
    setup_global_search() {
    }
  }, __publicField(_a, "no_sidebar", true), _a);

  // ../superproject/superproject/public/js/superproject/router.js
  frappe.provide("frappe.views");
  frappe.re_route = { "#login": "" };
  frappe.route_titles = {};
  frappe.route_flags = {};
  frappe.route_history = [];
  frappe.view_factory = {};
  frappe.view_factories = [];
  frappe.route_options = null;
  frappe.open_in_new_tab = false;
  frappe.route_hooks = {};
  $(window).on("hashchange", function(e) {
    if (window.location.hash && !frappe.router.is_app_route(e.currentTarget.pathname)) {
      let sub_path = frappe.router.get_sub_path(window.location.hash);
      frappe.router.push_state(sub_path);
      return false;
    }
  });
  window.addEventListener("popstate", (e) => {
    frappe.router.route();
    e.preventDefault();
    return false;
  });
  $("body").on("click", "a", function(e) {
    const target_element = e.currentTarget;
    const href = target_element.getAttribute("href");
    const is_on_same_host = target_element.hostname === window.location.hostname;
    if (target_element.getAttribute("target") === "_blank") {
      return;
    }
    const override = (route) => {
      e.preventDefault();
      frappe.set_route(route);
      return false;
    };
    if (!is_on_same_host || target_element.getAttribute("onclick") || e.ctrlKey || e.metaKey || href === "#") {
      return;
    }
    if (href && href.startsWith("#")) {
      return override(target_element.hash);
    }
    if (frappe.router.is_app_route(target_element.pathname)) {
      if (target_element.search) {
        frappe.route_options = {};
        let params = new URLSearchParams(target_element.search);
        for (const [key, value] of params) {
          frappe.route_options[key] = value;
        }
      }
      if (target_element.hash) {
        frappe.route_hash = target_element.hash;
      }
      return override(target_element.pathname);
    }
  });
  frappe.router = {
    current_route: null,
    routes: {},
    factory_views: ["form", "list", "report", "tree", "print", "dashboard", "facenet"],
    list_views: [
      "list",
      "kanban",
      "report",
      "calendar",
      "tree",
      "gantt",
      "dashboard",
      "image",
      "inbox",
      "map",
      "facenet"
    ],
    list_views_route: {
      list: "List",
      kanban: "Kanban",
      report: "Report",
      calendar: "Calendar",
      tree: "Tree",
      gantt: "Gantt",
      dashboard: "Dashboard",
      image: "Image",
      inbox: "Inbox",
      file: "Home",
      map: "Map",
      facenet: "Facenet"
    },
    layout_mapped: {},
    is_app_route(path) {
      if (!path)
        return;
      if (path.substr(0, 1) === "/")
        path = path.substr(1);
      path = path.split("/");
      if (path[0]) {
        return path[0] === "app";
      }
    },
    setup() {
      for (let doctype of frappe.boot.user.can_read) {
        this.routes[this.slug(doctype)] = { doctype };
      }
      if (frappe.boot.doctype_layouts) {
        for (let doctype_layout of frappe.boot.doctype_layouts) {
          this.routes[this.slug(doctype_layout.name)] = {
            doctype: doctype_layout.document_type,
            doctype_layout: doctype_layout.name
          };
        }
      }
    },
    async route() {
      if (!frappe.app)
        return;
      let sub_path = this.get_sub_path();
      if (frappe.boot.setup_complete) {
        !frappe.re_route["setup-wizard"] && (frappe.re_route["setup-wizard"] = "app");
      } else if (!sub_path.startsWith("setup-wizard")) {
        frappe.re_route["setup-wizard"] && delete frappe.re_route["setup-wizard"];
        frappe.set_route(["setup-wizard"]);
      }
      if (this.re_route(sub_path))
        return;
      this.current_sub_path = sub_path;
      this.current_route = await this.parse();
      this.set_history(sub_path);
      this.render();
      this.set_title(sub_path);
      this.trigger("change");
    },
    async parse(route) {
      route = this.get_sub_path_string(route).split("/");
      if (!route)
        return [];
      route = $.map(route, this.decode_component);
      this.set_route_options_from_url();
      return await this.convert_to_standard_route(route);
    },
    async convert_to_standard_route(route) {
      if (frappe.workspaces[route[0]]) {
        route = ["Workspaces", frappe.workspaces[route[0]].title];
      } else if (route[0] == "private") {
        let private_workspace = route[1] && `${route[1]}-${frappe.user.name.toLowerCase()}`;
        if (!frappe.workspaces[private_workspace] && localStorage.new_workspace) {
          let new_workspace = JSON.parse(localStorage.new_workspace);
          if (frappe.router.slug(new_workspace.title) === route[1]) {
            frappe.workspaces[private_workspace] = new_workspace;
          }
        }
        if (!frappe.workspaces[private_workspace]) {
          frappe.msgprint(
            __("Workspace <b>{0}</b> does not exist", [
              frappe.utils.xss_sanitise(route[1])
            ])
          );
          return ["Workspaces"];
        }
        route = ["Workspaces", "private", frappe.workspaces[private_workspace].title];
      } else if (this.routes[route[0]]) {
        route = await this.set_doctype_route(route);
      }
      return route;
    },
    doctype_route_exist(route) {
      route = this.get_sub_path_string(route).split("/");
      return this.routes[route[0]];
    },
    set_doctype_route(route) {
      let doctype_route = this.routes[route[0]];
      return frappe.model.with_doctype(doctype_route.doctype).then(() => {
        let meta = frappe.get_meta(doctype_route.doctype);
        if (route[1] && route[1] === "view" && route[2]) {
          route = this.get_standard_route_for_list(
            route,
            doctype_route,
            meta.force_re_route_to_default_view && meta.default_view ? meta.default_view : null
          );
        } else if (route[1] && route[1] !== "view") {
          let docname = route[1];
          if (route.length > 2) {
            docname = route.slice(1).join("/");
          }
          route = ["Form", doctype_route.doctype, docname];
        } else if (frappe.model.is_single(doctype_route.doctype)) {
          route = ["Form", doctype_route.doctype, doctype_route.doctype];
        } else if (meta.default_view) {
          if (meta.default_view === "Tree") {
            route = ["Tree", doctype_route.doctype];
          } else {
            route = [
              "List",
              doctype_route.doctype,
              this.list_views_route[meta.default_view.toLowerCase()]
            ];
          }
        } else {
          route = ["List", doctype_route.doctype, "List"];
        }
        this.doctype_layout = doctype_route.doctype_layout;
        return route;
      });
    },
    get_standard_route_for_list(route, doctype_route, default_view) {
      let standard_route;
      let _route = default_view || route[2] || "";
      if (_route.toLowerCase() === "tree") {
        standard_route = ["Tree", doctype_route.doctype];
      } else {
        let new_route = this.list_views_route[_route.toLowerCase()];
        let re_route = route[2].toLowerCase() !== (new_route == null ? void 0 : new_route.toLowerCase());
        if (re_route) {
          frappe.route_flags.replace_route = true;
          route[2] = _route.toLowerCase();
          this.set_route(route);
        }
        standard_route = [
          "List",
          doctype_route.doctype,
          this.list_views_route[_route.toLowerCase()]
        ];
        if (route[3])
          standard_route.push(...route.slice(3, route.length));
      }
      return standard_route;
    },
    set_history() {
      frappe.route_history.push(this.current_route);
      frappe.ui.hide_open_dialog();
    },
    render() {
      if (this.current_route[0]) {
        this.render_page();
      } else {
        frappe.views.pageview.show("");
      }
    },
    render_page() {
      const route = this.current_route;
      const factory = frappe.utils.to_title_case(route[0]);
      if (route[1] && frappe.views[factory + "Factory"]) {
        route[0] = factory;
        if (!frappe.view_factory[factory]) {
          frappe.view_factory[factory] = new frappe.views[factory + "Factory"]();
        }
        frappe.view_factory[factory].show();
      } else {
        const route_name = frappe.utils.xss_sanitise(route[0]);
        if (frappe.views.pageview) {
          frappe.views.pageview.show(route_name);
        }
      }
    },
    re_route(sub_path) {
      if (frappe.re_route[sub_path] !== void 0) {
        const re_route_val = this.get_sub_path(frappe.re_route[sub_path]);
        if (re_route_val === this.current_sub_path) {
          window.history.back();
        } else {
          frappe.set_route(re_route_val);
        }
        return true;
      }
    },
    set_title(sub_path) {
      if (frappe.route_titles[sub_path]) {
        frappe.utils.set_title(frappe.route_titles[sub_path]);
      }
    },
    set_route() {
      let route = Array.from(arguments);
      return new Promise((resolve) => {
        route = this.get_route_from_arguments(route);
        route = this.convert_from_standard_route(route);
        let sub_path = this.make_url(route);
        sub_path += frappe.route_hash || "";
        frappe.route_hash = null;
        if (frappe.open_in_new_tab) {
          localStorage["route_options"] = JSON.stringify(frappe.route_options);
          window.open(sub_path, "_blank");
          frappe.open_in_new_tab = false;
        } else {
          this.push_state(sub_path);
        }
        setTimeout(() => {
          frappe.after_ajax && frappe.after_ajax(() => {
            resolve();
          });
        }, 100);
      }).finally(() => frappe.route_flags = {});
    },
    get_route_from_arguments(route) {
      if (route.length === 1 && $.isArray(route[0])) {
        route = route[0];
      }
      if (route.length === 1 && route[0] && route[0].includes("/")) {
        route = $.map(route[0].split("/"), this.decode_component);
      }
      if (route && route[0] == "") {
        route.shift();
      }
      if (route && ["desk", "app"].includes(route[0])) {
        route.shift();
      }
      return route;
    },
    convert_from_standard_route(route) {
      const view = route[0] ? route[0].toLowerCase() : "";
      let new_route = route;
      if (view === "list") {
        if (route[2] && route[2] !== "list" && !$.isPlainObject(route[2])) {
          new_route = [this.slug(route[1]), "view", route[2].toLowerCase()];
          if (route[3])
            new_route.push(...route.slice(3, route.length));
        } else {
          if ($.isPlainObject(route[2])) {
            frappe.route_options = route[2];
          }
          new_route = [this.slug(route[1])];
        }
      } else if (view === "form") {
        new_route = [this.slug(route[1])];
        if (route[2]) {
          new_route.push(route[2]);
        }
      } else if (view === "tree") {
        new_route = [this.slug(route[1]), "view", "tree"];
      }
      return new_route;
    },
    slug_parts(route) {
      if (route[0] && this.factory_views.includes(route[0].toLowerCase())) {
        route[0] = route[0].toLowerCase();
        route[1] = this.slug(route[1]);
      }
      return route;
    },
    make_url(params) {
      var _a2;
      let path_string = $.map(params, function(a) {
        if ($.isPlainObject(a)) {
          frappe.route_options = a;
          return null;
        } else {
          return encodeURIComponent(String(a));
        }
      }).join("/");
      if (path_string) {
        return "/app/" + path_string;
      }
      let private_home = `home-${frappe.user.name.toLowerCase()}`;
      let default_workspace = frappe.router.slug(((_a2 = frappe.boot.user.default_workspace) == null ? void 0 : _a2.name) || "");
      let workspace = frappe.workspaces[default_workspace] || frappe.workspaces[private_home] || frappe.workspaces["home"] || Object.values(frappe.workspaces)[0];
      if (workspace) {
        return "/app/" + (workspace.public ? "" : "private/") + frappe.router.slug(workspace.title);
      }
      return "/app";
    },
    push_state(url) {
      if (window.location.pathname !== url) {
        const method = frappe.route_flags.replace_route ? "replaceState" : "pushState";
        history[method](null, null, url);
        this.route();
      }
    },
    get_sub_path_string(route) {
      if (!route) {
        route = window.location.pathname;
        if (route.includes("app#")) {
          route = window.location.hash;
        }
      }
      return this.strip_prefix(route);
    },
    strip_prefix(route) {
      if (route.substr(0, 1) == "/")
        route = route.substr(1);
      if (route == "app")
        route = route.substr(4);
      if (route.startsWith("app/"))
        route = route.substr(4);
      if (route.substr(0, 1) == "/")
        route = route.substr(1);
      if (route.substr(0, 1) == "#")
        route = route.substr(1);
      if (route.substr(0, 1) == "!")
        route = route.substr(1);
      return route;
    },
    get_sub_path(route) {
      var sub_path = this.get_sub_path_string(route);
      route = $.map(sub_path.split("/"), this.decode_component).join("/");
      return route;
    },
    set_route_options_from_url() {
      let query_string = window.location.search;
      if (!frappe.route_options) {
        frappe.route_options = {};
      }
      if (localStorage.getItem("route_options")) {
        frappe.route_options = JSON.parse(localStorage.getItem("route_options"));
        localStorage.removeItem("route_options");
      }
      let params = new URLSearchParams(query_string);
      for (const [key, value] of params) {
        frappe.route_options[key] = value;
      }
    },
    decode_component(r) {
      try {
        return decodeURIComponent(r);
      } catch (e) {
        if (e instanceof URIError) {
          return r;
        } else {
          throw e;
        }
      }
    },
    slug(name) {
      return name.toLowerCase().replace(/ /g, "-");
    }
  };
  frappe.get_route = () => frappe.router.current_route;
  frappe.get_route_str = () => frappe.router.current_route.join("/");
  frappe.set_route = function() {
    return frappe.router.set_route.apply(frappe.router, arguments);
  };
  frappe.get_prev_route = function() {
    if (frappe.route_history && frappe.route_history.length > 1) {
      return frappe.route_history[frappe.route_history.length - 2];
    } else {
      return [];
    }
  };
  frappe.set_re_route = function() {
    var tmp = frappe.router.get_sub_path();
    frappe.set_route.apply(null, arguments);
    frappe.re_route[tmp] = frappe.router.get_sub_path();
  };
  frappe.has_route_options = function() {
    return Boolean(Object.keys(frappe.route_options || {}).length);
  };
  frappe.utils.make_event_emitter(frappe.router);
})();
//# sourceMappingURL=setup.bundle.EHSARSWK.js.map
