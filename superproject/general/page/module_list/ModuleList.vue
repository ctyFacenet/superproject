<template>
  <section>
    <div class="module-list" style="margin-top: 25px">
      <div v-for="m in modules" :key="m.module" class="module-card" @click="openModule(m)">
        <div class="icon-wrapper">
          <div class="icon-container">
            <!-- ✅ Render icon component thực -->
            <component :is="getIcon(m.icon)" class="module-icon" />
          </div>
        </div>

        <div class="content-wrapper">
          <h5 class="module-name">{{ __(m.module) }}</h5>
          <p class="module-description">{{ __(m.description || "") }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  MenuOutlined,
  UserOutlined,
  FolderOutlined,
  FileTextOutlined,
  SettingOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ApiOutlined,
  CodeOutlined,
  BulbOutlined,
  EditOutlined,
  ShoppingOutlined,
  FileOutlined,
} from "@ant-design/icons-vue";

const modules = ref([]);

// Map icon name → component
const getIcon = (iconName) => {
  const iconMap = {
    user: UserOutlined,
    folder: FolderOutlined,
    file: FileTextOutlined,
    setting: SettingOutlined,
    appstore: AppstoreOutlined,
    database: DatabaseOutlined,
    cloud: CloudOutlined,
    api: ApiOutlined,
    code: CodeOutlined,
    bulb: BulbOutlined,
    shop: ShoppingOutlined,
  };
  return iconMap[iconName] || FileOutlined;
};

const openModule = (m) => {
  if (m.is_single) {
    frappe.set_route("Form", m.link_to);
  } else {
    frappe.set_route("List", m.link_to);
  }
  frappe.ui.toolbar.setup_custom_menu_bar();
};

onMounted(async () => {
  modules.value = await frappe.xcall(
    "superproject.general.doctype.display.display.get_modules_display",
  );
  $(".navbar-module").text("Trang chủ");
});
</script>

<style scoped>
.module-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  justify-items: center;
}

.module-card {
  width: 300px;
  min-width: 300px;
  max-width: 300px;

  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #e5fce2;
  border-radius: 14px;
  padding: 28px 24px;
  transition: all 0.3s ease;
  min-height: 150px;
  box-shadow: 10px 10px lightblue;
}

.module-card:hover {
  background-color: #eff7ff;
  transform: translateY(-2px);
}

.icon-wrapper {
  flex-shrink: 0;
}

.icon-container {
  width: 80px;
  height: 80px;
  background-color: #f1f1f1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.module-card:hover .icon-container {
  transform: scale(1.05);
  background: white;
}

/* ✅ Icon mặc định */
.module-icon {
  font-size: 36px;
  color: #5a5a5a;
  transition:
    color 0.1s ease,
    transform 0.1s ease;
}

/* ✅ Khi hover card */
.module-card:hover .module-icon {
  color: #1976d2;
  transform: scale(1.15);
  /* phóng to nhẹ */
}

.content-wrapper {
  flex: 1;
  text-align: left;
  min-width: 0;
}

.module-name {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  transition: color 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-card:hover .module-name {
  color: #1976d2;
}

.module-description {
  margin: 0;
  font-size: 0.95rem;
  color: #7f8c8d;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .module-list {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }

  .module-card {
    width: 260px;
    min-width: 260px;
    max-width: 260px;
  }
}

@media (max-width: 768px) {
  .module-list {
    grid-template-columns: 1fr !important;
    gap: 14px;
    padding: 0 15px;
  }

  .module-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: unset;

    flex-direction: column;
    text-align: center;
    padding: 20px 16px;
    gap: 14px;
    min-height: 160px;
  }

  .content-wrapper {
    text-align: center;
  }

  .icon-container {
    width: 80px;
    height: 80px;
  }

  .module-icon {
    font-size: 36px;
  }

  .module-name {
    font-size: 1.1rem;
    white-space: normal;
  }

  .module-description {
    font-size: 0.85rem;
  }

  .page-head {
    display: none;
  }
}
</style>
