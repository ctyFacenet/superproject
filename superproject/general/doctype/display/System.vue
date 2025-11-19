<template>
  <div class="tw-flex tw-h-screen">
    <!-- Sidebar -->
    <div class="tw-w-64 tw-bg-gray-100 tw-p-4 tw-flex-shrink-0">
      <h3 class="tw-mb-4 tw-font-bold">Danh sách Doctype</h3>
      <div class="tw-flex tw-flex-col tw-gap-2">
        <div
          v-for="item in availableItems"
          :key="item.link_to"
          class="tw-bg-white tw-p-2 tw-border tw-rounded tw-cursor-pointer"
          draggable="true"
          @dragstart="onDragStart(item)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>

    <!-- Vue Flow Area -->
    <VueFlow
    class="tw-flex-1"
    v-model:nodes="nodes"
    v-model:edges="edges"
    @drop="onDrop"
    @dragover.prevent
    >
    <Background :color="'#d1d5db'" :gap="20" :size="2" />
    <Controls />

    <!-- Custom Node Template -->
    <template #node-default="{ data }">
        <div class="custom-node">
        <div class="node-content">{{ data.label }}</div>
        <Handle type="target" position="left" />
        <Handle type="source" position="right" />
        </div>
    </template>
    </VueFlow>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls }from '@vue-flow/controls'

const props = defineProps({
  frm: Object
})

// Data
const availableItems = ref([])
const nodes = ref([])
const edges = ref([])

// Dragged item
const draggedItem = ref(null)

// Load available items
onMounted(() => {
  initialize_items()
})

const initialize_items = async function () {
  const items = props.frm.doc.items.filter(i => i.type === "DocType")
  let chains = await frappe.db.get_list("Workflow Chain", {
    fields: ["start_chain", "end_chain", "name"]
  })

  let chain_doctypes = new Set()
  for (const chain of chains) {
    chain_doctypes.add(chain.start_chain)
    chain_doctypes.add(chain.end_chain)
  }

  availableItems.value = items
    .filter(i => !chain_doctypes.has(i.link_to))
    .map(i => ({ link_to: i.link_to, title: __(i.link_to) }))

  console.log("Available items:", availableItems.value)
}

// Drag start
const onDragStart = (item) => {
  draggedItem.value = item
}

// Drop to Vue Flow
const onDrop = (event) => {
  const flowBounds = event.target.getBoundingClientRect()
  const x = event.clientX - flowBounds.left
  const y = event.clientY - flowBounds.top

  if (!draggedItem.value) return

  nodes.value.push({
    id: `${draggedItem.value.link_to}-${nodes.value.length}`,
    type: 'default',
    position: { x, y },
    data: { label: draggedItem.value.title }
  })

  draggedItem.value = null
}
</script>

<style scoped>
.tw-flex-1 {
  background-color: #f3f4f6;
}
.custom-node {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: all 0.2s;
  width: fit-content
}
</style>
