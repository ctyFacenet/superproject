
<template>
  <div class="tw-mb-8">
    <p class="tw-text-center tw-text-sm tw-text-gray-500 tw-mb-6 tw-flex tw-items-center tw-justify-center tw-gap-2">
      <MenuOutlined class="tw-text-gray-400 tw-text-xs" />
      Kéo thả để sắp xếp lại module
    </p>
    
    <draggable
      v-model="modules"
      item-key="name"
      :animation="200"
      @end="onDragEnd"
      class="tw-space-y-3"
    >
      <template #item="{ element }">
        <a-card
          bordered
          class="tw-rounded-lg tw-transition-all tw-duration-200 tw-cursor-move tw-bg-white tw-border tw-border-blue-300"
          :head-style="{ 
            backgroundColor: '#f0f9ff', 
            borderBottom: '1px solid #bfdbfe',
            padding: '12px 20px'
          }"
          :body-style="{ 
            padding: '20px',
            borderTop: 'none'
          }"
        >
          <template #title>
            <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
              <div class="tw-flex tw-items-center tw-gap-3">
                <!-- Icon Container with Dropdown -->
                <a-dropdown :trigger="['click']">
                  <div class="tw-w-10 tw-h-10 tw-rounded-lg tw-bg-blue-100 tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-cursor-pointer hover:tw-bg-blue-200 active:tw-bg-blue-200 tw-transition-colors">
                    <component 
                      :is="getIconComponent(element.icon)" 
                      class="tw-text-blue-600 tw-text-lg tw-leading-none"
                    />
                  </div>
                  <template #overlay>
                    <a-menu @click="({ key }) => changeIcon(element, key, 'modules')">
                      <a-menu-item v-for="(icon, key) in getIconComponent()" :key="key">
                        <div class="tw-flex tw-items-center tw-gap-2">
                          <component :is="icon" class="tw-text-base" />
                          <span class="tw-capitalize">{{ key }}</span>
                        </div>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
                
                <!-- Title & Description -->
                <div class="tw-flex-1">
                  <div class="tw-text-base tw-font-semibold tw-text-gray-800">
                    {{ element.title }}
                  </div>
                  
                  <!-- Description - Editable -->
                  <div class="tw-flex tw-items-center tw-gap-1 tw-mt-0.5">
                    <input
                      v-if="element.editingDescription"
                      v-model="element.description"
                      :style="{ width: (element.description?.length + 1) + 'ch' }"  
                      @blur="saveDescription(element)"
                      @keyup.enter="saveDescription(element)"
                      class="tw-text-xs tw-text-gray-700 tw-rounded-md tw-px-2 tw-py-1 tw-outline-none tw-border-0 focus:tw-bg-white focus:tw-ring-2 focus:tw-ring-blue-400 tw-transition-all tw-w-full"
                      placeholder="Nhập mô tả..."
                      autofocus
                    />
                    <div 
                      v-else
                      class="tw-text-xs tw-text-gray-500 tw-flex tw-items-center tw-gap-1.5 tw-cursor-pointer tw-py-1 tw-px-1 tw--mx-1 tw-rounded hover:tw-bg-gray-100 tw-transition-colors"
                      @click="startEditDescription(element)"
                    >
                      <span>{{ element.description || 'Thêm mô tả...' }}</span>
                      <EditOutlined class="tw-text-xs tw-text-gray-400 tw-transition-opacity tw-ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Drag Handle -->
              <MenuOutlined class="tw-text-gray-400 tw-text-base tw-cursor-grab active:tw-cursor-grabbing" />
            </div>
          </template>
          
          <!-- Card Body Content -->
          <div class="tw-h-[50px]">
            <!-- Nội dung body ở đây -->
          </div>
        </a-card>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
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
  ShoppingOutlined 
} from '@ant-design/icons-vue';

//Định nghĩa biến
const props = defineProps({
  frm: Object
})

//Khởi tạo dữ liệu
onMounted(() => {
  initialize_items()
})

const modules = ref([])

// Định nghĩa dữ liệu
const initialize_items = async () => {
  const res_modules = await frappe.db.get_list("Module Def", {filters: {app_name: "superproject"}})
  const all_modules = []
  
  for (const module of res_modules) {
    let module_name = module.name
    let existing_module_data = props.frm.doc.modules?.find(m => m.module === module_name)
    if (!existing_module_data) {
      const new_module = props.frm.add_child('modules', {
        module: module_name,
        icon: 'folder',
        description: '',
        direction: 0,
      })
      props.frm.refresh_field('modules')

      existing_module_data = new_module
    }

    const module_data = {
      name: module_name,
      title: __(module_name),
      icon: existing_module_data.icon || 'folder',
      description: existing_module_data?.description || '',
      direction: existing_module_data?.direction || 0,
      groups: [
        {
          id: `default-${module_name}`,
          editing: false,
          items: []
        },
        {
          id: `deactive-${module_name}`,
          editing: false,
          title: 'Không sử dụng',
          items: [],
        }
      ]
    }

    const doctypes = await frappe.db.get_list('DocType', {filters: {module: module_name, istable: 0}})
    doctypes.forEach(doctype => add_item_to_module(doctype.name, "DocType", module_name, module_data))

    const reports = await frappe.db.get_list('Report', {filters: {module: module_name}})
    reports.forEach(report => add_item_to_module(report.name, "Report", module_name, module_data))

    const pages = await frappe.db.get_list('Page', {filters: {module: module_name}})
    pages.forEach(page => add_item_to_module(page.name, "Page", module_name, module_data))    

    all_modules.push(module_data)
  }

  modules.value = all_modules.sort((a, b) => a.direction - b.direction)
  console.log(modules.value)

  const all_modules_name = all_modules.map(m => m.name)
  const all_items_name = []
  for (const m of all_modules) {
    for (const g of m.groups) {
      for (const i of g.items) {
        if (i.link_to) all_items_name.push(i.link_to)
      }
    }
  }
  
  const modules_grid = props.frm.fields_dict.modules.grid;
  const items_grid = props.frm.fields_dict.items.grid;

  for (let i = modules_grid.grid_rows.length - 1; i >= 0; i--) {
    const row = modules_grid.grid_rows[i];
    if (!all_modules_name.includes(row.doc.module)) {
      row.remove();
    }
  }

  for (let i = items_grid.grid_rows.length - 1; i >= 0; i--) {
    const row = items_grid.grid_rows[i];
    if (!all_items_name.includes(row.doc.link_to)) {
      row.remove();
    }
  }

  props.frm.refresh_field('modules');
  props.frm.refresh_field('items');

}

// Thêm item vào dữ liệu
const add_item_to_module = (name, type, module_name, module_data) => {
  let existing_item_data = props.frm.doc.items?.find(i => i.link_to === name && i.module === module_name)
  if (!existing_item_data) {
      const new_item = props.frm.add_child('items', {
        module: module_name,
        icon: 'folder',
        link_to: name,
        type: type,
        direction: 0
      })
      props.frm.refresh_field('items')

      existing_item_data = new_item
  }
  const group_name = existing_item_data?.group?.trim() || ''
  const deactive = existing_item_data?.deactive
  const direction = existing_item_data?.direction

  if (group_name) {
    let group = module_data.groups.find(g => g.title === group_name)
    if (!group) {
      const new_group = {
        id: `group-${module_name}-${group_name}`,
        title: __(group_name),
        name: group_name,
        editing: true,
        items: []
      }
      module_data.groups.push(new_group)
      group = new_group
    }

    const new_item = {
      id: `item-${module_name}-${group_name}-${name}`,
      title: __(name),
      type,
      link_to: name,
      icon: existing_item_data?.icon || 'folder',
      group: group_name || null,
      direction: direction
    }
    group.items.push(new_item)
  } else {
    const new_item = {
      id: `item-${module_name}-${deactive ? 'deactive' : 'default'}-${name}`,
      title: __(name),
      type,
      link_to: name,
      icon: existing_item_data?.icon || 'folder',
      direction: direction
    }

    if (deactive) module_data.groups[1].items.push(new_item)
    else module_data.groups[0].items.push(new_item)
  }
}

// Kéo thả Module
function onDragEnd(evt) {
  props.frm.doc.modules.forEach((m) => {
    const newIndex = modules.value.findIndex(mod => mod.name === m.module)
    if (newIndex !== -1) {
      m.direction = newIndex
    }
  })

  props.frm.refresh_field('modules')
  props.frm.dirty()
}

// Mapping Icon
const getIconComponent = (iconName = null) => {
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
    shop: ShoppingOutlined
  }
  return iconName ? (iconMap[iconName] || FolderOutlined) : iconMap;
}

const changeIcon = (element, iconKey, fieldname = 'modules') => {
  const dataSource = fieldname === 'items' ? props.frm.doc.items : props.frm.doc.modules;
  const nameKey = fieldname === 'modules' ? 'module' : 'link_to';
  const target = dataSource.find(item => item[nameKey] === element.name);
  
  if (target) {
    target.icon = iconKey;
    const index = modules.value.findIndex(mod => mod.name === element.name);
    if (index !== -1) {
      modules.value[index].icon = iconKey;
    }
    props.frm.refresh_field(fieldname);
    props.frm.dirty();
  }
};

// Thêm vào trong script
const startEditDescription = (element) => {
  element.editingDescription = true;
};

const saveDescription = (element) => {
  element.editingDescription = false;
  
  const module = props.frm.doc.modules.find(m => m.module === element.name);
  if (module) {
    module.description = element.description;
    props.frm.refresh_field('modules');
    props.frm.dirty();
  }
};

</script>

<css scoped>

</css>