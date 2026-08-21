<script setup lang="ts">
import { Check, Sparkles } from '@lucide/vue'
import { backgroundPresets, type BackgroundPreset } from '../../data/background-presets'

const props = defineProps<{
  modelValue: string
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isSelected = (preset: BackgroundPreset) => {
  if (preset.isDefault && (!props.modelValue || props.modelValue === preset.image)) {
    return true
  }
  return props.modelValue === preset.image
}

const selectPreset = (preset: BackgroundPreset) => {
  emit('update:modelValue', preset.image)
}
</script>

<template>
  <div class="bg-preset-picker">
    <div class="bg-preset-picker__header">
      <div class="bg-preset-picker__title">
        <Sparkles :size="15" class="text-accent" />
        <strong>{{ title || 'Bộ sưu tập ảnh nền sự kiện' }}</strong>
      </div>
      <span class="bg-preset-picker__hint">{{ backgroundPresets.length }} mẫu ảnh nền</span>
    </div>

    <div class="bg-preset-grid">
      <button
        v-for="preset in backgroundPresets"
        :key="preset.id"
        type="button"
        class="bg-preset-card"
        :class="{ 'is-active': isSelected(preset) }"
        @click="selectPreset(preset)"
      >
        <div class="bg-preset-card__preview">
          <img :src="preset.image" :alt="preset.name" loading="lazy" />
          <div class="bg-preset-card__overlay">
            <span class="bg-preset-card__tag" :class="{ 'is-default': preset.isDefault }">
              {{ preset.tag }}
            </span>
            <span v-if="isSelected(preset)" class="bg-preset-card__check">
              <Check :size="14" />
            </span>
          </div>
        </div>

        <div class="bg-preset-card__info">
          <strong class="bg-preset-card__name">{{ preset.name }}</strong>
          <p class="bg-preset-card__desc">{{ preset.description }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.bg-preset-picker {
  margin: 12px 0 16px;
  padding: 14px;
  background: rgba(14, 28, 68, 0.45);
  border: 1px solid rgba(127, 238, 255, 0.2);
  border-radius: 12px;
}

.bg-preset-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.bg-preset-picker__title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e6f3ff;
  font-size: 13px;
  font-weight: 700;
}

.text-accent {
  color: #7feeff;
}

.bg-preset-picker__hint {
  font-size: 11px;
  color: #8da4ca;
}

.bg-preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.bg-preset-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #09173b;
  border: 2px solid rgba(141, 164, 202, 0.25);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-preset-card:hover {
  border-color: rgba(127, 238, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}

.bg-preset-card.is-active {
  border-color: #7feeff;
  background: #0c2152;
  box-shadow: 0 0 16px rgba(127, 238, 255, 0.35);
}

.bg-preset-card__preview {
  position: relative;
  width: 100%;
  height: 90px;
  background: #04091a;
  overflow: hidden;
}

.bg-preset-card__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.bg-preset-card:hover .bg-preset-card__preview img {
  transform: scale(1.06);
}

.bg-preset-card__overlay {
  position: absolute;
  inset: 0;
  padding: 6px 8px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(4, 9, 26, 0.7) 0%, transparent 60%);
  pointer-events: none;
}

.bg-preset-card__tag {
  padding: 2px 7px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(112, 69, 221, 0.85);
  color: #ffffff;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.bg-preset-card__tag.is-default {
  background: rgba(24, 79, 183, 0.9);
  color: #d8f5ff;
}

.bg-preset-card__check {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  background: #7feeff;
  color: #040b22;
  border-radius: 50%;
  box-shadow: 0 0 8px #7feeff;
}

.bg-preset-card__info {
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bg-preset-card__name {
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.bg-preset-card__desc {
  margin: 0;
  font-size: 10px;
  color: #9cb5db;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
