<template>
  <a-row :gutter="[16, 16]">
    <a-col
      v-for="user in users"
      :key="user.id"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="24"
    >
      <a-card :bordered="true" style="width: 100%">
        <a-row :gutter="8" align="middle">
          <!-- CỘT TRÁI -->
          <a-col :span="6">
            <a-row :gutter="4" align="middle">
              <!-- Cột chọn icon -->
              <a-col :span="10">
                <a-select
                  v-model:value="user.icon"
                  style="width: 100%"
                  placeholder="Chọn icon"
                  size="small"
                >
                  <a-select-option value="user">
                    <UserOutlined /> User
                  </a-select-option>
                  <a-select-option value="smile">
                    <SmileOutlined /> Smile
                  </a-select-option>
                  <a-select-option value="setting">
                    <SettingOutlined /> Setting
                  </a-select-option>
                </a-select>
              </a-col>

              <!-- Cột tên + mô tả -->
              <a-col :span="14">
                <div style="font-weight: 500; line-height: 1.4">
                  {{ user.name }}
                </div>
                <a-input
                  v-model:value="user.description"
                  placeholder="Nhập mô tả..."
                  size="small"
                />
              </a-col>
            </a-row>
          </a-col>

          <!-- CỘT PHẢI -->
          <a-col :span="18">
            <a-checkbox-group
              v-model:value="user.selectedOptions"
              :options="user.options"
              style="width: 100%"
            />
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from "vue"
import {
  UserOutlined,
  SmileOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue"

const users = ref([
  {
    id: 1,
    name: "Nguyễn Văn A",
    icon: "user",
    description: "Nhân viên thiết kế",
    options: ["Task A", "Task B", "Task C"],
    selectedOptions: ["Task A"],
  },
  {
    id: 2,
    name: "Trần Thị B",
    icon: "smile",
    description: "QA/QC kiểm thử",
    options: ["Design", "Review", "Deploy"],
    selectedOptions: ["Review"],
  },
])
</script>

<style scoped>
a-card {
  border-radius: 8px;
  box-shadow: none !important;
}
</style>
