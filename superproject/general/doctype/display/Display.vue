<template>
  <a-row :gutter="[16, 16]">
    <a-col
      v-for="module in modules"
      :key="module.id"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="24"
    >
      <a-card 
        :bordered="true" 
        :head-style="{ 
          backgroundColor: '#e6f7ff', 
          borderBottom: '1px solid #1890ff',
          padding: '12px 16px'
        }"
        :body-style="{ padding: '16px' }"
        style="border: 2px solid #1890ff; border-radius: 8px;"
      >
        <!-- HEADER -->
        <template #title>
          <a-row align="middle" :gutter="12">
            <a-col flex="40px">
              <a-dropdown>
                <a-button type="text" size="large" style="padding: 0; height: auto;">
                  <component 
                    :is="getIcon(module.icon)" 
                    style="font-size: 24px; color: #1890ff; cursor: pointer"
                  />
                </a-button>
                <template #overlay>
                  <a-menu @click="(e) => changeModuleIcon(module.name, e.key)">
                    <a-menu-item v-for="iconItem in availableIcons" :key="iconItem.key">
                      <component :is="iconItem.icon" /> {{ iconItem.label }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-col>
            <a-col flex="auto">
              <div style="font-weight: 600; font-size: 16px; color: #262626">
                {{ __(module.name) }}
              </div>
            </a-col>
            <a-col flex="auto" style="max-width: 400px">
              <a-textarea
                v-model:value="module.description"
                placeholder="Mô tả module..."
                :auto-size="{ minRows: 1, maxRows: 3 }"
                size="small"
                style="font-size: 13px"
                @blur="updateModuleDescription(module.name, module.description)"
              />
            </a-col>
          </a-row>
        </template>

        <!-- BODY - KANBAN GROUPS -->
        <a-row :gutter="[12, 12]">
          <!-- Existing Kanban Groups -->
          <a-col
            v-for="(group, groupIndex) in module.groups"
            :key="group.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <div 
              class="kanban-group"
              :class="{ 'drag-over': dragOverGroup === `${module.name}-${group.id}` }"
              @dragover.prevent="handleDragOver($event, module.name, group.id)"
              @dragleave="handleDragLeave"
              @drop="handleDrop($event, module.name, group.id, group.title)"
              :data-module-id="module.name"
            >
              <!-- Group Header -->
              <div class="group-header" v-if="groupIndex !== 0">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="flex: 1;">
                    <a-input
                      v-if="group.editing"
                      v-model:value="group.title"
                      size="small"
                      @blur="group.editing = false"
                      @pressEnter="group.editing = false"
                      autoFocus
                    />
                    <div 
                      v-else 
                      class="group-title"
                      :class="{'unused-group': group.title === 'Không sử dụng', 'normal-group': group.title !== 'Không sử dụng'}"
                      @click="group.title !== 'Không sử dụng' && (group.editing = true)"
                    >
                      {{ __(group.title) }}
                    </div>
                  </div>
                  <a-button 
                    v-if="group.title !== 'Không sử dụng'"
                    type="text" 
                    danger 
                    size="small"
                    @click="deleteGroup(module.name, group.id)"
                    style="display: flex; align-items: center; justify-content: center;"
                  >
                    <DeleteOutlined />
                  </a-button>
                </div>
              </div>

              <!-- Group Items -->
              <div class="group-body">
                <div
                  v-for="item in group.items"
                  :key="item.id"
                  class="group-item"
                  draggable="true"
                  @dragstart="handleDragStart($event, module.name, group.id, item.id, group.title)"
                  @dragend="handleDragEnd"
                >
                  <a-dropdown>
                    <div class="item-icon">
                      <component 
                        :is="getIcon(item.icon)" 
                        style="font-size: 18px; color: #1890ff"
                      />
                    </div>
                    <template #overlay>
                      <a-menu @click="(e) => changeItemIcon(module.name, group.id, item.id, e.key)">
                        <a-menu-item v-for="iconItem in availableIcons" :key="iconItem.key">
                          <component :is="iconItem.icon" /> {{ __(iconItem.label) }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                  <div class="item-content">
                    <div class="item-name">{{ __(item.name) }}</div>
                    <a-tag 
                      size="small" 
                      :color="getTypeColor(item.type)"
                      class="type-tag"
                    >
                      <span class="type-full">{{ __(item.type) }}</span>
                      <span class="type-short">{{ getTypeShortLabel(item.type) }}</span>
                    </a-tag>
                  </div>
                </div>

                <div v-if="group.items.length === 0" class="empty-state">
                  Trống
                </div>
              </div>
            </div>
          </a-col>

          <!-- Add New Group Button -->
          <a-col
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <div class="add-group-btn" @click="addNewGroup(module.name)">
              <PlusOutlined style="font-size: 24px; color: #1890ff" />
              <div style="margin-top: 8px; font-size: 13px; color: #595959">
                Thêm nhóm mới
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue"
import {
  UserOutlined,
  SmileOutlined,
  SettingOutlined,
  ProjectOutlined,
  FolderOutlined,
  TeamOutlined,
  FileOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  BugOutlined,
} from "@ant-design/icons-vue"

const props = defineProps({
  frm: {
    type: Object,
    required: true
  }
})

const modules = ref([])
let dragData = ref(null)
let dragOverGroup = ref(null)
let groupIdCounter = ref(1)
let itemIdCounter = ref(1)

// Danh sách modules cần bỏ qua
const excludedModules = ['Custom', 'Desk', 'Email', 'Geo', 'Integrations', 'Automation', 'Workflow', 'Core', 'Website', 'Printing', 'Social']

// Danh sách icon có sẵn
const availableIcons = [
  { key: 'user', icon: UserOutlined, label: 'User' },
  { key: 'project', icon: ProjectOutlined, label: 'Project' },
  { key: 'smile', icon: SmileOutlined, label: 'Smile' },
  { key: 'setting', icon: SettingOutlined, label: 'Setting' },
  { key: 'folder', icon: FolderOutlined, label: 'Folder' },
  { key: 'team', icon: TeamOutlined, label: 'Team' },
  { key: 'file', icon: FileOutlined, label: 'File' },
  { key: 'doctype', icon: FileTextOutlined, label: 'DocType' },
  { key: 'report', icon: BarChartOutlined, label: 'Report' },
  { key: 'page', icon: AppstoreOutlined, label: 'Page' },
  { key: 'sale', icon: ShoppingOutlined, label: 'Sale' },
]

const getIcon = (iconName) => {
  const iconMap = {
    user: UserOutlined,
    smile: SmileOutlined,
    setting: SettingOutlined,
    project: ProjectOutlined,
    folder: FolderOutlined,
    team: TeamOutlined,
    file: FileOutlined,
    doctype: FileTextOutlined,
    report: BarChartOutlined,
    page: AppstoreOutlined,
    sale: ShoppingOutlined
  }
  return iconMap[iconName] || FileOutlined
}

const getTypeColor = (type) => {
  const colorMap = {
    'DocType': 'blue',
    'Report': 'green',
    'Page': 'orange'
  }
  return colorMap[type] || 'default'
}

const getDefaultIconForType = (type) => {
  // Không dùng icon mặc định theo type nữa, dùng 'file' cho tất cả
  return 'cat'
}

const getTypeShortLabel = (type) => {
  const map = {
    'Report': 'R',
    'DocType': 'D',
    'Page': 'P'
  }
  return map[type] || '?'
}

// Fetch all modules and their doctypes, reports, pages
const fetchModulesData = async () => {
  try {
    // Fetch danh sách modules từ Module Def
    const allModules = await frappe.db.get_list('Module Def', {
      fields: ['name', 'app_name'],
      filters: [
        ['name', 'not in', excludedModules]
      ],
      order_by: 'name asc'
    })
    
    const modulesData = []

    for (const moduleObj of allModules) {
      const moduleName = moduleObj.name
      
      // Lấy thông tin từ frm.doc.modules nếu có
      let existingModuleData = props.frm.doc.modules?.find(m => m.module === moduleName)
      
      const moduleData = {
        name: moduleName,
        icon: existingModuleData?.icon || 'folder',
        description: existingModuleData?.description || '',
        groups: [
          {
            id: `default-${moduleName}`,
            title: '',
            editing: false,
            items: []
          },
          {
            id: `unused-${moduleName}`,
            title: 'Không sử dụng',
            editing: false,
            items: []
          }
        ]
      }

      // Fetch DocTypes của module (loại bỏ Child Table)
      const doctypes = await frappe.db.get_list('DocType', {
        fields: ['name', 'module'],
        filters: {
          module: moduleName,
          istable: 0  // Loại bỏ Child Table
        },
        order_by: 'name asc'
      })

      // Thêm DocTypes vào module
      doctypes.forEach(doctype => {
        addItemToModule(moduleData, doctype.name, 'DocType', moduleName)
      })

      // Fetch Reports của module
      const reports = await frappe.db.get_list('Report', {
        fields: ['name', 'module', 'ref_doctype'],
        filters: {
          module: moduleName,
          disabled: 0
        },
        order_by: 'name asc'
      })

      reports.forEach(report => {
        addItemToModule(moduleData, report.name, 'Report', moduleName)
      })

      // Fetch Pages của module
      const pages = await frappe.db.get_list('Page', {
        fields: ['name', 'module'],
        filters: {
          module: moduleName
        },
        order_by: 'name asc'
      })

      pages.forEach(page => {
        addItemToModule(moduleData, page.name, 'Page', moduleName)
      })

      // Load các group khác từ frm.doc.items (bỏ qua excluded modules)
      const groupedItems = {}
      props.frm.doc.items?.forEach(item => {
        if (item.module === moduleName && item.group && !excludedModules.includes(item.module)) {
          if (!groupedItems[item.group]) {
            groupedItems[item.group] = []
          }
          
          // Tìm item trong default group và move sang group mới
          const defaultGroup = moduleData.groups[0]
          const itemIndex = defaultGroup.items.findIndex(i => i.link_to === item.link_to)
          
          if (itemIndex !== -1) {
            const [movedItem] = defaultGroup.items.splice(itemIndex, 1)
            groupedItems[item.group].push(movedItem)
          }
        }
      })

      // Tạo các group từ groupedItems
      Object.keys(groupedItems).forEach(groupName => {
        moduleData.groups.push({
          id: `group-${groupIdCounter.value++}`,
          title: groupName,
          editing: false,
          items: groupedItems[groupName]
        })
      })

      const defaultGroup = moduleData.groups[0]
      const unusedGroup = moduleData.groups.find(g => g.title === 'Không sử dụng')

      defaultGroup.items = defaultGroup.items.filter(i => {
        const frmItem = props.frm.doc.items?.find(
          item => item.link_to === i.link_to && item.module === moduleName
        )
        if (frmItem?.deactive) {
          const exists = unusedGroup.items.find(u => u.link_to === i.link_to)
          if (!exists) {
            unusedGroup.items.push({
              id: `item-${itemIdCounter.value++}`,
              name: i.name,
              type: i.type,
              link_to: i.link_to,
              icon: i.icon
            })
          }
          return false
        }
        return true
      })

      modulesData.push(moduleData)
    }

    modules.value = modulesData
    
    // Cleanup frm.doc - Xóa các items và modules thuộc excluded modules
    cleanupExcludedModules()
    
    // Đánh dấu form dirty để lưu các thay đổi
    
  } catch (error) {
    console.error('Error fetching modules data:', error)
    frappe.msgprint(__('Failed to fetch modules data'))
  }
}

const cleanupExcludedModules = () => {
  // Xóa items thuộc excluded modules
  if (props.frm.doc.items) {
    props.frm.doc.items = props.frm.doc.items.filter(item => !excludedModules.includes(item.module))
  }
  
  // Xóa modules thuộc excluded modules
  if (props.frm.doc.modules) {
    props.frm.doc.modules = props.frm.doc.modules.filter(module => !excludedModules.includes(module.module))
  }
}

const addItemToModule = (moduleData, name, type, moduleName) => {
  // Kiểm tra xem item đã tồn tại trong frm.doc.items chưa
  const existingItem = props.frm.doc.items?.find(
    item => item.link_to === name && item.module === moduleName
  )

  const itemData = {
    id: `item-${itemIdCounter.value++}`,
    name: name,
    type: type,
    link_to: name,
    icon: existingItem?.icon || getDefaultIconForType(type)
  }
  moduleData.groups[0].items.push(itemData)
}

const updateModuleDescription = (moduleName, description) => {
  // Tìm hoặc tạo mới module trong frm.doc.modules
  let moduleRow = props.frm.doc.modules?.find(m => m.module === moduleName)
  
  moduleRow.description = description
  props.frm.dirty()
}

const changeModuleIcon = (moduleName, iconKey) => {
  const module = modules.value.find((m) => m.name === moduleName)
  if (module) {
    module.icon = iconKey
    
    // Cập nhật vào frm.doc.modules
    let moduleRow = props.frm.doc.modules?.find(m => m.module === moduleName)
    moduleRow.icon = iconKey
    props.frm.dirty()
  }
}

const changeItemIcon = (moduleName, groupId, itemId, iconKey) => {
  const module = modules.value.find((m) => m.name === moduleName)
  const group = module?.groups.find((g) => g.id === groupId)
  const item = group?.items.find((i) => i.id === itemId)
  
  if (item) {
    item.icon = iconKey
    
    // Cập nhật vào frm.doc.items
    const itemRow = props.frm.doc.items?.find(
      row => row.link_to === item.link_to && row.module === moduleName
    )
    if (itemRow) {
      itemRow.icon = iconKey
      props.frm.dirty()
    }
  }
}

const addNewGroup = (moduleName) => {
  const module = modules.value.find((m) => m.name === moduleName)
  if (module) {
    const newGroup = {
      id: `group-${groupIdCounter.value++}`,
      title: `Nhóm mới ${groupIdCounter.value - 1}`,
      editing: false,
      items: [],
    }
    module.groups.push(newGroup)
  }
}

const deleteGroup = (moduleName, groupId) => {
  const module = modules.value.find((m) => m.name === moduleName)
  if (module) {
    const groupIndex = module.groups.findIndex((g) => g.id === groupId)
    if (groupIndex > 0 && !module.groups[groupIndex].id.startsWith('unused-')) {
      const group = module.groups[groupIndex]
      
      // Move tất cả items về default group
      const defaultGroup = module.groups[0]
      group.items.forEach(item => {
        defaultGroup.items.push(item)
        
        // Xóa group trong frm.doc.items
        const itemRow = props.frm.doc.items?.find(
          row => row.link_to === item.link_to && row.module === moduleName
        )
        if (itemRow) {
          itemRow.group = ''
        }
      })
      
      module.groups.splice(groupIndex, 1)
      props.frm.dirty()
    }
  }
}

const handleDragStart = (event, moduleName, groupId, itemId, groupTitle) => {
  dragData.value = { moduleName, groupId, itemId, groupTitle }
  event.dataTransfer.effectAllowed = "move"
  event.target.classList.add('dragging');
}

const handleDragOver = (event, moduleName, groupId) => {
  event.preventDefault()
  
  if (dragData.value && dragData.value.moduleName === moduleName) {
    dragOverGroup.value = `${moduleName}-${groupId}`
  }
}

const handleDragLeave = () => {
  dragOverGroup.value = null
}

const handleDragEnd = (event) => {
  event.target.classList.remove('dragging');
}

const handleDrop = (event, targetModuleName, targetGroupId, targetGroupTitle) => {
  event.preventDefault();
  dragOverGroup.value = null;

  if (!dragData.value) return;

  const { moduleName, groupId, itemId } = dragData.value;

  if (moduleName !== targetModuleName) {
    dragData.value = null;
    return;
  }

  const module = modules.value.find(m => m.name === moduleName);
  const group = module.groups.find(g => g.id === targetGroupId);

  if (!group) return;

  const itemIndex = group.items.findIndex(i => i.id === itemId);
  let draggedItem;
  
  if (itemIndex !== -1) {
    // Remove item từ group hiện tại
    [draggedItem] = group.items.splice(itemIndex, 1);
  } else {
    // Lấy từ group khác
    const sourceGroup = module.groups.find(g => g.id === dragData.value.groupId);
    const sourceIndex = sourceGroup.items.findIndex(i => i.id === itemId);
    if (sourceIndex === -1) return;
    [draggedItem] = sourceGroup.items.splice(sourceIndex, 1);
  }

  // Xác định vị trí drop dựa trên event.target
  let targetIndex = Array.from(event.currentTarget.children).indexOf(event.target.closest('.group-item'));
  if (targetIndex === -1) targetIndex = group.items.length;

  group.items.splice(targetIndex, 0, draggedItem);

  // Update frm.doc.items như trước
  let itemRow = props.frm.doc.items?.find(row => row.link_to === draggedItem.link_to && row.module === moduleName);
  if (!itemRow) {
    itemRow = frappe.model.add_child(props.frm.doc, 'Super Project Items', 'items');
    itemRow.module = moduleName;
    itemRow.type = draggedItem.type;
    itemRow.link_to = draggedItem.link_to;
    itemRow.icon = draggedItem.icon;
  }

  // Cập nhật group/deactive
  if (targetGroupId.startsWith('unused-')) {
    itemRow.deactive = 1;
    itemRow.group = '';
  } else {
    itemRow.deactive = 0;
    itemRow.group = targetGroupTitle.startsWith('default-') ? '' : targetGroupTitle;
  }

  props.frm.dirty();
  dragData.value = null;
};


onMounted(() => {
  fetchModulesData()
})
</script>

<style scoped>
.kanban-group {
  background: #fafafa;
  border: 2px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.kanban-group.drag-over {
  background: #e6f7ff;
  border-color: #1890ff;
  border-style: dashed;
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.1);
}

.group-header {
  background: #ffffff;
  padding: 10px 12px;
  border-bottom: 2px solid #d9d9d9;
  min-height: 42px;
}

.group-title {
  font-weight: 600;
  font-size: 14px;
  color: #262626;
  cursor: pointer;
}

.group-title:hover {
  color: #1890ff;
}

.group-body {
  padding: 8px;
  flex: 1;
  overflow-y: auto;
  min-height: 150px;
}

.group-item {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: move;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
  transform: translateY(-2px);
}

.group-item.dragging {
  opacity: 0.5; /* hoặc 1 nếu không muốn mờ */
  background: #fafafa; /* tùy chỉnh */
}

.item-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f5ff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.item-icon:hover {
  background: #d6e4ff;
  transform: scale(1.1);
}

.item-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.item-name {
  flex: 1;
  font-size: 13px;
  color: #262626;
  font-weight: 500;
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  color: #bfbfbf;
  font-size: 13px;
  padding: 30px 10px;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  background: #fafafa;
}

.add-group-btn {
  background: #fafafa;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-group-btn:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  border-style: solid;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.type-short {
  display: none;
}

.group-title.unused-group {
  color: #e74a4aff; /* đỏ */
}

@media (max-width: 768px) {
  .kanban-group {
    min-height: 150px;
  }

  .group-title {
    font-size: 13px;
  }

  .group-item {
    padding: 8px 10px;
  }

  .item-icon {
    width: 28px;
    height: 28px;
  }

  .item-icon :deep(svg) {
    font-size: 16px !important;
  }

  .item-name {
    font-size: 12px;
  }

  .add-group-btn {
    min-height: 150px;
  }

  .type-full {
    display: none;
  }
  .type-short {
    display: inline;
    font-weight: 600;
  }
  .group-item .a-tag, .group-item .ant-tag {
    padding: 0 4px;
    font-size: 11px;
  }
}
</style>