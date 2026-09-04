<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Check, Images, Search, X } from '@lucide/vue'
import sourceImages from 'virtual:source-images'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  compact?: boolean
}>(), {
  label: 'Chọn từ thư viện ảnh',
  compact: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const search = ref('')
const sourceFilter = ref<'all' | 'public' | 'src'>('all')

const filteredImages = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('vi-VN')
  return sourceImages.filter((image) => {
    const matchesSource = sourceFilter.value === 'all' || image.source === sourceFilter.value
    const matchesSearch = !query || `${image.name} ${image.path}`.toLocaleLowerCase('vi-VN').includes(query)
    return matchesSource && matchesSearch
  })
})

const open = () => {
  search.value = ''
  sourceFilter.value = 'all'
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const selectImage = (url: string) => {
  emit('update:modelValue', url)
  close()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) close()
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape))
</script>

<template>
  <button type="button" class="source-library-trigger" :class="{ 'is-compact': compact }" @click="open">
    <Images :size="compact ? 13 : 15" /> {{ label }}
  </button>

  <Teleport to="body">
    <div v-if="isOpen" class="source-library-backdrop" role="presentation" @mousedown.self="close">
      <section class="source-library-modal" role="dialog" aria-modal="true" aria-label="Thư viện ảnh trong source">
        <header class="source-library-header">
          <div>
            <span>THƯ VIỆN SOURCE</span>
            <h2>Chọn ảnh có sẵn</h2>
            <p>{{ sourceImages.length }} ảnh trong public/ và src/assets/</p>
          </div>
          <button type="button" aria-label="Đóng thư viện ảnh" @click="close"><X :size="20" /></button>
        </header>

        <div class="source-library-toolbar">
          <label>
            <Search :size="16" />
            <input v-model="search" type="search" placeholder="Tìm theo tên hoặc đường dẫn..." autofocus />
          </label>
          <div class="source-library-filters" aria-label="Lọc thư mục">
            <button type="button" :class="{ active: sourceFilter === 'all' }" @click="sourceFilter = 'all'">Tất cả</button>
            <button type="button" :class="{ active: sourceFilter === 'public' }" @click="sourceFilter = 'public'">public/</button>
            <button type="button" :class="{ active: sourceFilter === 'src' }" @click="sourceFilter = 'src'">src/assets/</button>
          </div>
        </div>

        <div class="source-library-results">
          <button
            v-for="image in filteredImages"
            :key="image.path"
            type="button"
            class="source-library-card"
            :class="{ selected: modelValue === image.url }"
            :title="image.path"
            @click="selectImage(image.url)"
          >
            <span class="source-library-thumbnail">
              <img :src="image.url" :alt="image.name" loading="lazy" />
              <span v-if="modelValue === image.url" class="source-library-check"><Check :size="15" /></span>
            </span>
            <strong>{{ image.name }}</strong>
            <small>{{ image.path }}</small>
          </button>
          <p v-if="!filteredImages.length" class="source-library-empty">Không tìm thấy ảnh phù hợp.</p>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.source-library-trigger {
  min-height: 32px;
  margin-top: 6px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  background: linear-gradient(100deg, #315bc8, #7145d8);
  border: 0;
  border-radius: 7px;
  box-shadow: 0 6px 14px rgba(57, 70, 171, .18);
  font: 800 8px/1.2 'Be Vietnam Pro', sans-serif;
  cursor: pointer;
}
.source-library-trigger:hover { filter: brightness(1.08); }
.source-library-trigger.is-compact { width: 100%; min-height: 27px; margin-top: 6px; font-size: 7.5px; }
.source-library-backdrop {
  position: fixed;
  z-index: 5000;
  inset: 0;
  padding: clamp(14px, 3vw, 40px);
  display: grid;
  place-items: center;
  background: rgba(3, 9, 27, .76);
  backdrop-filter: blur(8px);
}
.source-library-modal {
  width: min(1080px, 100%);
  height: min(780px, 92vh);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #24324f;
  background: #f7f9fc;
  border: 1px solid rgba(205, 220, 246, .8);
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(1, 7, 27, .5);
  font-family: 'Be Vietnam Pro', sans-serif;
}
.source-library-header {
  padding: 20px 22px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #fff;
  background: linear-gradient(110deg, #0b1d4a, #244f9f 60%, #6540c6);
}
.source-library-header span { color: #8feeff; font-size: 9px; font-weight: 900; letter-spacing: .14em; }
.source-library-header h2 { margin: 4px 0 2px; font-size: 21px; font-weight: 900; }
.source-library-header p { margin: 0; color: #c6d7f4; font-size: 10px; }
.source-library-header > button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(255, 255, 255, .1);
  border-radius: 9px;
  cursor: pointer;
}
.source-library-toolbar { padding: 14px 18px; display: flex; align-items: center; gap: 12px; background: #fff; border-bottom: 1px solid #e1e7f0; }
.source-library-toolbar > label { min-width: 220px; flex: 1; height: 38px; padding: 0 11px; display: flex; align-items: center; gap: 8px; color: #79869d; background: #f3f6fa; border: 1px solid #dce3ed; border-radius: 8px; }
.source-library-toolbar input { width: 100%; color: #263653; background: transparent; border: 0; outline: 0; font-size: 11px; }
.source-library-filters { display: flex; gap: 5px; }
.source-library-filters button { height: 34px; padding: 0 11px; color: #68758b; background: #eef2f7; border-radius: 7px; font-size: 9px; font-weight: 800; cursor: pointer; }
.source-library-filters button.active { color: #fff; background: #4663c9; }
.source-library-results { min-height: 0; flex: 1; padding: 17px; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); align-content: start; gap: 12px; overflow-y: auto; }
.source-library-card { min-width: 0; padding: 8px; display: flex; flex-direction: column; text-align: left; background: #fff; border: 2px solid transparent; border-radius: 10px; box-shadow: 0 4px 14px rgba(25, 43, 77, .08); cursor: pointer; transition: .18s ease; }
.source-library-card:hover { border-color: #8095e1; transform: translateY(-2px); }
.source-library-card.selected { border-color: #4b68d3; background: #f0f3ff; }
.source-library-thumbnail { position: relative; height: 102px; display: grid; place-items: center; overflow: hidden; background: repeating-conic-gradient(#e7ebf1 0 25%, #fff 0 50%) 50% / 16px 16px; border-radius: 7px; }
.source-library-thumbnail img { width: 100%; height: 100%; object-fit: contain; }
.source-library-check { position: absolute; top: 6px; right: 6px; width: 25px; height: 25px; display: grid; place-items: center; color: #fff; background: #4865d0; border-radius: 50%; box-shadow: 0 3px 9px rgba(27, 47, 119, .3); }
.source-library-card strong { margin-top: 8px; overflow: hidden; color: #2b3d66; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.source-library-card small { margin-top: 3px; overflow: hidden; color: #8893a6; font: 7px/1.4 Consolas, monospace; text-overflow: ellipsis; white-space: nowrap; }
.source-library-empty { grid-column: 1 / -1; margin: 50px 0; color: #8792a5; text-align: center; font-size: 12px; }
@media (max-width: 680px) {
  .source-library-backdrop { padding: 8px; }
  .source-library-modal { height: 96vh; border-radius: 12px; }
  .source-library-toolbar { align-items: stretch; flex-direction: column; }
  .source-library-filters { display: grid; grid-template-columns: repeat(3, 1fr); }
  .source-library-results { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding: 10px; }
  .source-library-thumbnail { height: 88px; }
}
</style>
