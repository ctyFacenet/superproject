<template>
  <div class="tw-p-4 tw-bg-white tw-rounded-lg tw-border-gray-200 tw-w-full tw-h-full">

    <div class="tw-flex tw-items-center tw-gap-6 tw-border-b tw-border-gray-300 tw-pb-2">

      <div class="tw-flex tw-w-max tw-overflow-hidden">

        <span @click="activeTab = 'accounts'"
          class="tw-px-4 tw-py-2 tw-cursor-pointer tw-border tw-border-b-white tw-rounded-t-md"
          :class="activeTab === 'accounts'
            ? 'tw-bg-white tw-text-blue-600 tw-font-semibold tw-border-blue-300'
            : 'tw-bg-gray-50 tw-text-gray-700 hover:tw-bg-gray-100'">
          Danh sách tài khoản
        </span>

        <span @click="activeTab = 'groups'"
          class="tw-px-4 tw-py-2 tw-cursor-pointer tw-border tw-border-b-white tw-rounded-t-md tw-ml-[3px]"
          :class="activeTab === 'groups'
            ? 'tw-bg-white tw-text-blue-600 tw-font-semibold tw-border-blue-300'
            : 'tw-bg-gray-50 tw-text-gray-700 hover:tw-bg-gray-100'">
          Danh sách nhóm quyền
        </span>

      </div>

      <div class="tw-ml-auto tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-text-blue-600 tw-font-medium"
        @click="onAddNew">
        <PlusCircleOutlined />
        <span>Thêm mới</span>
      </div>
    </div>

    <h2 class="tw-text-center tw-text-[18px] tw-font-bold tw-my-4">
      DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG
    </h2>

    <div v-if="activeTab === 'accounts'">
      <div ref="scrollWrapper" class="tw-overflow-x-auto tw-w-full" @scroll="handleScroll">
        <table class="tw-w-full tw-border-collapse tw-relative">
          <thead class="tw-bg-blue-100 tw-text-gray-700 tw-font-semibold">
            <tr>
              <th v-for="col in accountCols" :key="col.key" class="tw-p-2 tw-border tw-text-center tw-relative"
                :style="{ width: colWidths[col.key] + 'px' }">
                {{ col.title }}
                <span class="col-resizer" @mousedown="(e) => startResize(e, col.key)"></span>
              </th>
            </tr>

            <tr class="tw-bg-white">
              <td v-for="col in ['username', 'email', 'lastName', 'firstName']" :key="col" class="tw-p-2 tw-border">
                <a-input v-model:value="filtersAccount[col]" allowClear>
                  <template #prefix>
                    <SearchOutlined class="tw-text-gray-400" />
                  </template>
                </a-input>
              </td>
              <td class="tw-border"></td>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in paginatedAccounts" :key="index" class="hover:tw-bg-blue-50">
              <td class="tw-border tw-p-2">{{ row.username }}</td>
              <td class="tw-border tw-p-2">{{ row.email }}</td>
              <td class="tw-border tw-p-2">{{ row.lastName }}</td>
              <td class="tw-border tw-p-2">{{ row.firstName }}</td>

              <td class="tw-border tw-p-2 tw-flex tw-gap-3 tw-justify-center">
                <EditOutlined class="tw-text-blue-600 tw-cursor-pointer" />
                <DeleteOutlined class="tw-text-red-500 tw-cursor-pointer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tw-flex tw-items-center tw-justify-center sm:tw-justify-between tw-mt-3">
        <a-select class="tw-w-[110px] tw-hidden sm:tw-block" v-model:value="pageSizeAccount" :options="pageSizeOptions"
          @change="onPageSizeChangeAccount" />

        <div class="tw-flex tw-items-center tw-gap-2">
          <button class="tw-border tw-px-3 tw-py-1 tw-rounded-sm" :disabled="currentPageAccount === 1"
            @click="currentPageAccount--">‹</button>
          <span class="tw-border tw-border-blue-600 tw-text-blue-600 tw-rounded-sm tw-px-3 tw-py-1 tw-font-semibold">
            {{ currentPageAccount }}
          </span>
          <button class="tw-border tw-px-3 tw-py-1 tw-rounded-sm" :disabled="currentPageAccount === totalPagesAccount"
            @click="currentPageAccount++">›</button>
        </div>

        <div class="tw-hidden sm:tw-flex tw-items-center tw-gap-2">
          <span>Đi đến</span>
          <a-input-number class="tw-w-[90px]" v-model:value="goToPageAccount" @pressEnter="jumpToPageAccount" />
        </div>
      </div>
    </div>

    <div v-else>
      <div ref="scrollWrapper" class="tw-overflow-x-auto tw-w-full" @scroll="handleScroll">
        <table class="tw-w-full tw-border-collapse tw-relative">
          <thead class="tw-bg-blue-100 tw-text-gray-700 tw-font-semibold">
            <tr>
              <th v-for="col in groupCols" :key="col.key" class="tw-p-2 tw-border tw-text-center tw-relative"
                :style="{ width: colWidths[col.key] + 'px' }">
                {{ col.title }}

                <span class="col-resizer" @mousedown="(e) => startResize(e, col.key)"></span>
              </th>
            </tr>
            <tr class="tw-bg-white">
              <td v-for="col in ['name', 'code']" :key="col" class="tw-p-2 tw-border">
                <a-input v-model:value="filtersGroup[col]" allowClear>
                  <template #prefix>
                    <SearchOutlined class="tw-text-gray-400" />
                  </template>
                </a-input>
              </td>
              <td class="tw-border"></td>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in paginatedGroups" :key="index" class="hover:tw-bg-blue-50">
              <td class="tw-border tw-p-2">{{ row.name }}</td>
              <td class="tw-border tw-p-2">{{ row.code }}</td>

              <td class="tw-border tw-p-2 tw-flex tw-gap-3 tw-justify-center">
                <EditOutlined class="tw-text-blue-600 tw-cursor-pointer" />
                <DeleteOutlined class="tw-text-red-500 tw-cursor-pointer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tw-flex tw-items-center tw-justify-center sm:tw-justify-between tw-mt-3">
        <a-select class="tw-w-[110px] tw-hidden sm:tw-block" v-model:value="pageSizeGroup" :options="pageSizeOptions"
          @change="onPageSizeChangeGroup" />

        <div class="tw-flex tw-items-center tw-gap-2">
          <button class="tw-border tw-px-3 tw-py-1 tw-rounded-sm" :disabled="currentPageGroup === 1"
            @click="currentPageGroup--">‹</button>
          <span class="tw-border tw-border-blue-600 tw-text-blue-600 tw-rounded-sm tw-px-3 tw-py-1 tw-font-semibold">
            {{ currentPageGroup }}
          </span>
          <button class="tw-border tw-px-3 tw-py-1 tw-rounded-sm" :disabled="currentPageGroup === totalPagesGroup"
            @click="currentPageGroup++">›</button>
        </div>

        <div class="tw-hidden sm:tw-flex tw-items-center tw-gap-2">
          <span>Đi đến</span>
          <a-input-number class="tw-w-[90px]" v-model:value="goToPageGroup" @pressEnter="jumpToPageGroup" />
        </div>
      </div>
    </div>

  </div>
  <div
    class="tw-text-center tw-border-gray-200 tw-bg-white tw-text-[13px] sm:tw-text-[14px] tw-font-[500] tw-tracking-wide tw-text-gray-600">
    © Copyright
    <a href="https://facenet.vn" target="_blank" rel="noopener noreferrer"
      class="tw-text-[#0066cc] tw-font-semibold tw-cursor-pointer hover:tw-underline">FaceNet</a>. All Rights
    Reserved,&nbsp;Designed by
    <a href="https://facenet.vn" target="_blank" rel="noopener noreferrer"
      class="tw-text-[#0066cc] tw-font-semibold tw-cursor-pointer hover:tw-underline">FaceNet</a>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined
} from "@ant-design/icons-vue";

import useResize from "../../../public/js/components/DataTable/composables/useResize";
import usePagination from "../../../public/js/components/DataTable/composables/usePagination";

const props = defineProps({ listview: Object });

const accountCols = [
  { key: "username", title: "Tên tài khoản" },
  { key: "email", title: "Email" },
  { key: "lastName", title: "Họ" },
  { key: "firstName", title: "Tên" },
  { key: "actions", title: "Thao tác" }
];

const groupCols = [
  { key: "name", title: "Tên nhóm quyền" },
  { key: "code", title: "Mã nhóm quyền" },
  { key: "actions", title: "Thao tác" }
];

const {
  colWidths,
  startResize,
  scrollWrapper,
  handleScroll
} = useResize();

const activeTab = ref("accounts");

const accounts = ref([
  { username: "admin@kct.vn", email: "", lastName: "", firstName: "KCT" },
  { username: "qc@kct.vn", email: "kct12345@gmail.com", lastName: "", firstName: "" },
  { username: "qms@kct.vn", email: "kct@gmail.com", lastName: "Nguyễn", firstName: "" },
  { username: "test@kct.vn", email: "test1123@gmail.com", lastName: "", firstName: "" }
]);

const filtersAccount = ref({
  username: "",
  email: "",
  lastName: "",
  firstName: ""
});

const filteredAccounts = computed(() =>
  accounts.value.filter(row =>
    row.username.toLowerCase().includes(filtersAccount.value.username.toLowerCase()) &&
    row.email.toLowerCase().includes(filtersAccount.value.email.toLowerCase()) &&
    row.lastName.toLowerCase().includes(filtersAccount.value.lastName.toLowerCase()) &&
    row.firstName.toLowerCase().includes(filtersAccount.value.firstName.toLowerCase())
  )
);

const groups = ref([
  { name: "Nhân viên", code: "kctvn_mdm_nhanvien__group" },
  { name: "Quản lý dữ liệu", code: "kctvn_mdm_quan-ly-du-lieu__group" }
]);

const filtersGroup = ref({
  name: "",
  code: ""
});

const filteredGroups = computed(() =>
  groups.value.filter(row =>
    row.name.toLowerCase().includes(filtersGroup.value.name.toLowerCase()) &&
    row.code.toLowerCase().includes(filtersGroup.value.code.toLowerCase())
  )
);

const {
  currentPage: currentPageAccount,
  pageSize: pageSizeAccount,
  pageSizeOptions,
  totalPages: totalPagesAccount,
  paginatedRows: paginatedAccounts,
  goToPage: goToPageAccount,
  onPageSizeChange: onPageSizeChangeAccount,
  jumpToPage: jumpToPageAccount
} = usePagination(filteredAccounts);


const {
  currentPage: currentPageGroup,
  pageSize: pageSizeGroup,
  totalPages: totalPagesGroup,
  paginatedRows: paginatedGroups,
  goToPage: goToPageGroup,
  onPageSizeChange: onPageSizeChangeGroup,
  jumpToPage: jumpToPageGroup
} = usePagination(filteredGroups);

function onAddNew() {
  if (activeTab.value === "accounts") frappe.show_alert({
    message: __("Thêm tài khoản đang phát triển"),
    indicator: "yellow",
  });
  else frappe.show_alert({
    message: __("Thêm nhóm quyền đang phát triển"),
    indicator: "yellow",
  });
}
</script>

<style scoped>
table {
  border-collapse: separate !important;
  border-spacing: 0 !important;
}

table td,
table th {
  border: none !important;
  position: relative;
}

table td::after,
table th::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 174, 238, 0.1);
}

table td::before,
table th::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: rgba(0, 174, 238, 0.1);
}

table td,
table th {
  border: 1px solid #e5e7eb;
}

.col-resizer {
  position: absolute;
  top: 0;
  right: -3px;
  width: 6px;
  cursor: col-resize;
  height: 100%;
  user-select: none;
}

tbody tr:nth-child(odd) {
  background-color: #f9fafb;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}

tbody tr:hover {
  background-color: rgb(232, 243, 255) !important;
}

button:disabled {
  cursor: not-allowed !important;
  opacity: 0.4;
}
</style>
