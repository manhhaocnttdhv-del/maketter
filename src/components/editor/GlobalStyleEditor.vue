<script setup lang="ts">
import BackgroundPresetPicker from './BackgroundPresetPicker.vue'
import type { GlobalSettings, HeaderSettings, SiteSettings } from '../../data/site-content'

const props = defineProps<{
  modelValue: SiteSettings
  mode: 'global' | 'header'
  heroBackground?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SiteSettings]
  'update:heroBackground': [value: string]
  'apply-to-all-sections': [image: string]
}>()

const updateGlobal = <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => {
  emit('update:modelValue', { ...props.modelValue, global: { ...props.modelValue.global, [key]: value } })
}

const updateHeader = <K extends keyof HeaderSettings>(key: K, value: HeaderSettings[K]) => {
  emit('update:modelValue', { ...props.modelValue, header: { ...props.modelValue.header, [key]: value } })
}

const colorValue = (value: string, fallback: string) => /^#[\da-f]{6}$/i.test(value) ? value : fallback

const globalColors: Array<{ key: keyof GlobalSettings; label: string; fallback: string }> = [
  { key: 'primaryColor', label: 'Màu chính', fallback: '#183b83' },
  { key: 'secondaryColor', label: 'Màu phụ', fallback: '#7045dd' },
  { key: 'accentColor', label: 'Màu nhấn', fallback: '#7feeff' },
  { key: 'pageBackground', label: 'Nền toàn trang', fallback: '#08183f' },
  { key: 'textColor', label: 'Màu chữ mặc định', fallback: '#eef6ff' },
  { key: 'headingColor', label: 'Màu tiêu đề', fallback: '#ffffff' },
]
</script>

<template>
  <div v-if="mode === 'global'" class="global-style-editor">
    <div class="design-group">
      <div class="design-group__title"><strong>Ảnh nền cố định toàn website</strong><span>Nền luôn luôn cố định xuyên suốt tất cả các section</span></div>
      <BackgroundPresetPicker :model-value="heroBackground || ''" @update:model-value="emit('update:heroBackground', $event)" />
      
      <div v-if="heroBackground" style="margin-top: 8px;">
        <button
          type="button"
          style="width: 100%; padding: 8px 12px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; background: rgba(112, 69, 221, 0.25); border: 1px solid rgba(112, 69, 221, 0.6); border-radius: 8px; color: #e5d8ff; font-size: 12px; font-weight: 700; cursor: pointer;"
          @click="emit('apply-to-all-sections', heroBackground)"
        >
          🚀 Đồng bộ ảnh nền này cho TẤT CẢ các section
        </button>
      </div>
    </div>

    <div class="design-group">
      <div class="design-group__title"><strong>Typography</strong><span>Font và cỡ chữ toàn website</span></div>
      <label class="config-field"><span>Font nội dung</span><input type="text" :value="modelValue.global.fontFamily" @input="updateGlobal('fontFamily', ($event.target as HTMLInputElement).value)" /></label>
      <label class="config-field"><span>Font tiêu đề</span><input type="text" :value="modelValue.global.headingFontFamily" @input="updateGlobal('headingFontFamily', ($event.target as HTMLInputElement).value)" /></label>
      <div class="design-grid design-grid--two">
        <label class="config-field"><span>Cỡ chữ gốc (px)</span><input type="number" min="10" max="28" :value="modelValue.global.baseFontSize" @input="updateGlobal('baseFontSize', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Rộng container (px)</span><input type="number" min="768" max="1920" :value="modelValue.global.containerWidth" @input="updateGlobal('containerWidth', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Bo góc button (px)</span><input type="number" min="0" max="999" :value="modelValue.global.buttonRadius" @input="updateGlobal('buttonRadius', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Cuộn trang</span><select :value="modelValue.global.scrollBehavior" @change="updateGlobal('scrollBehavior', ($event.target as HTMLSelectElement).value as GlobalSettings['scrollBehavior'])"><option value="smooth">Mượt</option><option value="auto">Mặc định</option></select></label>
      </div>
    </div>

    <div class="design-group">
      <div class="design-group__title"><strong>Bảng màu</strong><span>Biến màu dùng xuyên suốt website</span></div>
      <div class="design-grid design-grid--two">
        <label v-for="item in globalColors" :key="item.key" class="config-field config-color-field">
          <span>{{ item.label }}</span>
          <div><input type="color" :value="colorValue(String(modelValue.global[item.key]), item.fallback)" @input="updateGlobal(item.key, ($event.target as HTMLInputElement).value as never)" /><input type="text" :value="modelValue.global[item.key]" @input="updateGlobal(item.key, ($event.target as HTMLInputElement).value as never)" /></div>
        </label>
      </div>
    </div>

    <div class="design-group">
      <div class="design-group__title"><strong>CSS tùy chỉnh nâng cao</strong><span>Áp dụng trên trang chính sau khi lưu</span></div>
      <label class="config-field"><span>Custom CSS</span><textarea class="custom-css-input" rows="10" :value="modelValue.customCss" placeholder=".my-section { ... }" @input="emit('update:modelValue', { ...modelValue, customCss: ($event.target as HTMLTextAreaElement).value })"></textarea></label>
      <p class="design-note">Có thể gắn class riêng ở từng section rồi viết CSS cho class đó tại đây.</p>
    </div>
  </div>

  <div v-else class="global-style-editor">
    <label class="config-toggle-field config-toggle-field--prominent"><span>Hiển thị header</span><input type="checkbox" :checked="modelValue.header.enabled" @change="updateHeader('enabled', ($event.target as HTMLInputElement).checked)" /></label>
    <label class="config-toggle-field"><span>Cố định header khi cuộn</span><input type="checkbox" :checked="modelValue.header.sticky" @change="updateHeader('sticky', ($event.target as HTMLInputElement).checked)" /></label>

    <div class="design-group">
      <div class="design-group__title"><strong>Kích thước header</strong><span>Giữ menu một dòng trên desktop</span></div>
      <div class="design-grid design-grid--two">
        <label class="config-field"><span>Chiều cao (px)</span><input type="number" min="48" max="160" :value="modelValue.header.height" @input="updateHeader('height', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Logo (px)</span><input type="number" min="24" max="120" :value="modelValue.header.logoWidth" @input="updateHeader('logoWidth', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Rộng container (px)</span><input type="number" min="768" max="1920" :value="modelValue.header.containerWidth" @input="updateHeader('containerWidth', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Padding ngang (px)</span><input type="number" min="0" max="120" :value="modelValue.header.paddingX" @input="updateHeader('paddingX', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Khoảng cách menu (px)</span><input type="number" min="4" max="80" :value="modelValue.header.navGap" @input="updateHeader('navGap', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Cỡ chữ menu (px)</span><input type="number" min="8" max="26" :value="modelValue.header.fontSize" @input="updateHeader('fontSize', Number(($event.target as HTMLInputElement).value))" /></label>
        <label class="config-field"><span>Độ blur nền (px)</span><input type="number" min="0" max="40" :value="modelValue.header.backdropBlur" @input="updateHeader('backdropBlur', Number(($event.target as HTMLInputElement).value))" /></label>
      </div>
    </div>

    <div class="design-group">
      <div class="design-group__title"><strong>Màu header</strong><span>Có thể nhập HEX, RGB hoặc RGBA</span></div>
      <label class="config-field config-color-field"><span>Màu chữ menu</span><div><input type="color" :value="colorValue(modelValue.header.textColor, '#ffffff')" @input="updateHeader('textColor', ($event.target as HTMLInputElement).value)" /><input type="text" :value="modelValue.header.textColor" @input="updateHeader('textColor', ($event.target as HTMLInputElement).value)" /></div></label>
      <label class="config-field"><span>Màu nền header</span><input type="text" :value="modelValue.header.backgroundColor" placeholder="rgba(4, 7, 28, .96)" @input="updateHeader('backgroundColor', ($event.target as HTMLInputElement).value)" /></label>
    </div>
  </div>
</template>
