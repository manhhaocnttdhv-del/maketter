<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type {
  LayoutTemplate,
  TextContent,
  TextKey,
  TextStyleMap,
} from '../data/layouts'

const props = defineProps<{
  layout: LayoutTemplate
  content?: TextContent
  styles?: TextStyleMap
  activeText?: TextKey
  interactive?: boolean
}>()

const emit = defineEmits<{
  select: [key: TextKey]
}>()

const keys: TextKey[] = ['eyebrow', 'title', 'subtitle', 'cta']

const textValue = (key: TextKey) => props.content?.[key] ?? props.layout.content[key]

const textStyle = (key: TextKey): CSSProperties => {
  const current = props.styles?.[key] ?? props.layout.styles[key]

  return {
    fontFamily: current.fontFamily,
    fontSize: `calc(${current.fontSize}px * var(--preview-scale, 1))`,
    fontWeight: current.fontWeight,
    fontStyle: current.fontStyle,
    textAlign: current.textAlign,
    color: current.color,
    letterSpacing: `calc(${current.letterSpacing}px * var(--preview-scale, 1))`,
  }
}

const selectText = (key: TextKey) => {
  if (props.interactive) emit('select', key)
}
</script>

<template>
  <div
    class="design-preview"
    :class="[`design-preview--${layout.variant}`, { 'is-interactive': interactive }]"
  >
    <div class="design-grid" aria-hidden="true"></div>
    <div class="design-orbit" aria-hidden="true"><span></span></div>
    <div class="design-sun" aria-hidden="true"></div>
    <div class="design-photo" aria-hidden="true">
      <span class="photo-sun"></span>
      <span class="photo-land photo-land--back"></span>
      <span class="photo-land photo-land--front"></span>
    </div>
    <div class="design-stamp" aria-hidden="true">MKT<br />26</div>

    <div
      v-for="key in keys"
      :key="key"
      class="text-layer"
      :class="[`text-layer--${key}`, { 'is-active': activeText === key }]"
      :style="textStyle(key)"
      :role="interactive ? 'button' : undefined"
      :tabindex="interactive ? 0 : undefined"
      @click.stop="selectText(key)"
      @keydown.enter.prevent="selectText(key)"
      @keydown.space.prevent="selectText(key)"
    >
      {{ textValue(key) }}
    </div>
  </div>
</template>
