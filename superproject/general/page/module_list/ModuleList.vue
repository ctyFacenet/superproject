<template>
  <section>
    <div class="module-list">
      <div v-for="m in modules" :key="m.module" class="module-card" @click="openModule(m)">
        <div class="icon-container">
          <component :is="getIcon(m.icon)" class="module-icon" />
        </div>

        <h5 class="module-name">{{ __(m.module) }}</h5>
        <p class="module-description">{{ __(m.description || "") }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
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
  ShoppingOutlined,
  FileOutlined,
} from "@ant-design/icons-vue";

const modules = ref([]);

const getIcon = (iconName) => {
  const map = {
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
  return map[iconName] || FileOutlined;
};

const openModule = (m) => {
  frappe.set_route(m.is_single ? "Form" : "List", m.link_to);
  frappe.ui.toolbar.setup_custom_menu_bar();
};

onMounted(async () => {
  modules.value = await frappe.xcall(
    "superproject.general.doctype.display.display.get_modules_display"
  );
  $(".navbar-module").text("Trang chủ");
});
</script>

<style scoped>
.module-list {
  display: grid;
  grid-template-columns: repeat(2, 520px);
  gap: 50px 60px;
  justify-content: center;
  padding: 40px 20px;
  margin-top: 40px;
}

.module-card {
  width: 520px;
  height: 300px;
  background: #e3f2fd;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 24px;
  transition:
    transform 0.25s cubic-bezier(.165, .84, .44, 1),
    box-shadow 0.25s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.175);
}

.module-card:hover {
  transform: scale(1.06);
}

.icon-container {
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 18px;
}

.module-icon {
  font-size: 80px;
  color: #1976d2;
}

.module-card:hover .module-icon {
  transform: scale(1.15);
}

.module-name {
  margin: 12px 0 6px 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}

.module-description {
  margin: 0;
  font-size: 1rem;
  color: #666;
  text-align: center;
  max-width: 380px;
}

@media (max-width: 1200px) {
  .module-list {
    grid-template-columns: repeat(2, 420px);
  }

  .module-card {
    width: 420px;
    height: 280px;
  }

  .icon-container {
    width: 130px;
    height: 130px;
  }
}

@media (max-width: 900px) {
  .module-list {
    grid-template-columns: 1fr !important;
    justify-content: center;
    padding: 0 20px;
    gap: 30px;
  }

  .module-card {
    width: 100% !important;
    max-width: 500px;
    height: auto;
    padding: 30px 20px;
    margin: 0 auto;
  }

  .icon-container {
    width: 120px;
    height: 120px;
  }

  .module-icon {
    font-size: 70px;
  }
}

.page-head {
  display: none !important;
}
</style>
