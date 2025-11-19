<template>
  <div>
    <div>
      <a-radio-group v-model:value="selected">
        <a-radio-button value="ui">Giao diện</a-radio-button>
        <a-radio-button value="sys">Hệ thống</a-radio-button>
      </a-radio-group>
    </div>

    <div class="tw-mt-3">
      <Transition name="slide" mode="out-in">
        <div :key="selected">
          <component :is="currentComponent" :frm="props.frm" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Display from "./Display.vue"
import System from "./System.vue"

const props = defineProps({
  frm: Object
})

const selected = ref('ui')

const currentComponent = computed(() => {
  return selected.value === 'ui' ? Display : System
})
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.5s ease-out;
}

.slide-leave-active {
  transition: all 0.3s ease-in;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(48px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-48px);
}
</style>