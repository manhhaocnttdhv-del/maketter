<script setup lang="ts">
import { ref } from 'vue'
import { Check, Image, X } from '@lucide/vue'
import { backgroundPresets, type BackgroundPreset } from '../data/background-presets'
import type { SiteContent } from '../data/site-content'

const props = defineProps<{
  site: SiteContent
}>()

const isOpen = ref(false)

const currentImage = () => props.site.assets.heroBackground || backgroundPresets[0].image

const isSelected = (preset: BackgroundPreset) => {
  return currentImage() === preset.image
}

const applyPreset = (preset: BackgroundPreset) => {
  props.site.assets.heroBackground = preset.image
  // Also clear any section override on hero so it takes immediate effect
  if (props.site.settings.sections.hero) {
    props.site.settings.sections.hero.backgroundImage = ''
  }
}
</script>

<template>
  <div class="theme-switcher-widget">
    <!-- Floating Trigger Button -->
    <button
      type="button"
      class="theme-switcher-trigger"
      :class="{ 'is-open': isOpen }"
      title="Đổi ảnh nền sự kiện"
      @click="isOpen = !isOpen"
    >
      <Image :size="18" />
      <span>Đổi ảnh nền</span>
    </button>

    <!-- Popup Modal / Drawer -->
    <Transition name="fade-slide">
      <div v-if="isOpen" class="theme-switcher-panel">
        <div class="theme-panel-head">
          <div>
            <strong>Chọn ảnh nền sự kiện</strong>
            <span>{{ backgroundPresets.length }} mẫu ảnh chuẩn TNTH 2026</span>
          </div>
          <button type="button" class="theme-panel-close" @click="isOpen = false">
            <X :size="16" />
          </button>
        </div>

        <div class="theme-preset-list">
          <div
            v-for="preset in backgroundPresets"
            :key="preset.id"
            class="theme-preset-item"
            :class="{ 'is-active': isSelected(preset) }"
            @click="applyPreset(preset)"
          >
            <div class="theme-preset-thumb">
              <img :src="preset.image" :alt="preset.name" />
              <span v-if="isSelected(preset)" class="theme-active-badge">
                <Check :size="12" />
              </span>
            </div>
            <div class="theme-preset-meta">
              <div class="theme-preset-name-row">
                <strong class="theme-preset-name">{{ preset.name }}</strong>
                <span class="theme-preset-tag" :class="{ 'is-default': preset.isDefault }">
                  {{ preset.tag }}
                </span>
              </div>
              <p class="theme-preset-desc">{{ preset.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-switcher-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.theme-switcher-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #0b2468 0%, #1742a0 100%);
  color: #ffffff;
  border: 1.5px solid rgba(127, 238, 255, 0.4);
  border-radius: 999px;
  font-family: 'Lexend', 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(2, 7, 24, 0.45), 0 0 12px rgba(127, 238, 255, 0.25);
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}

.theme-switcher-trigger:hover {
  background: linear-gradient(135deg, #123896 0%, #1e52c8 100%);
  border-color: #7feeff;
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5), 0 0 18px rgba(127, 238, 255, 0.4);
}

.theme-switcher-trigger.is-open {
  background: #06143c;
  border-color: #7feeff;
}

.theme-switcher-panel {
  position: absolute;
  bottom: 54px;
  right: 0;
  width: 360px;
  max-height: 520px;
  padding: 16px;
  background: rgba(5, 14, 40, 0.95);
  border: 1.5px solid rgba(127, 238, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 150, 255, 0.18);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.theme-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(127, 238, 255, 0.15);
  padding-bottom: 10px;
}

.theme-panel-head strong {
  display: block;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
}

.theme-panel-head span {
  font-size: 11px;
  color: #8fa7ce;
}

.theme-panel-close {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 0;
  border-radius: 50%;
  color: #c0d4f2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-panel-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.theme-preset-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
  max-height: 400px;
}

.theme-preset-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: rgba(11, 26, 68, 0.5);
  border: 1.5px solid rgba(141, 164, 202, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-preset-item:hover {
  background: rgba(16, 38, 96, 0.7);
  border-color: rgba(127, 238, 255, 0.45);
  transform: translateX(2px);
}

.theme-preset-item.is-active {
  background: rgba(18, 48, 120, 0.85);
  border-color: #7feeff;
  box-shadow: 0 0 12px rgba(127, 238, 255, 0.25);
}

.theme-preset-thumb {
  position: relative;
  width: 80px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #030818;
}

.theme-preset-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.theme-active-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  background: #7feeff;
  color: #030818;
  border-radius: 50%;
  box-shadow: 0 0 6px #7feeff;
}

.theme-preset-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
}

.theme-preset-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.theme-preset-name {
  font-size: 12px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theme-preset-tag {
  font-size: 9px;
  padding: 1px 5px;
  background: #7045dd;
  color: white;
  border-radius: 3px;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
}

.theme-preset-tag.is-default {
  background: #183b83;
}

.theme-preset-desc {
  margin: 0;
  font-size: 10px;
  color: #8da6cf;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

@media (max-width: 480px) {
  .theme-switcher-widget {
    bottom: 16px;
    right: 16px;
  }
  .theme-switcher-panel {
    width: calc(100vw - 32px);
    right: 0;
    max-height: 75vh;
  }
}
</style>
