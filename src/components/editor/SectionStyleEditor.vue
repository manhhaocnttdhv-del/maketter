<script setup lang="ts">
import { ImagePlus, RotateCcw } from '@lucide/vue'
import BackgroundPresetPicker from './BackgroundPresetPicker.vue'
import type { SectionSettings } from '../../data/site-content'

const props = defineProps<{ modelValue: SectionSettings }>()
const emit = defineEmits<{
  'update:modelValue': [value: SectionSettings]
  'upload-error': [message: string]
}>()

const numberFields: Array<{ key: keyof SectionSettings; label: string; min: number; max: number; step?: number }> = [
  { key: 'paddingTop', label: 'Padding trên', min: 0, max: 300 },
  { key: 'paddingBottom', label: 'Padding dưới', min: 0, max: 300 },
  { key: 'marginTop', label: 'Margin trên', min: -200, max: 300 },
  { key: 'marginBottom', label: 'Margin dưới', min: -200, max: 300 },
  { key: 'minHeight', label: 'Chiều cao tối thiểu', min: 0, max: 1600 },
  { key: 'containerWidth', label: 'Chiều rộng container', min: 320, max: 1920 },
  { key: 'borderRadius', label: 'Bo góc section', min: 0, max: 160 },
]

const update = <K extends keyof SectionSettings>(key: K, value: SectionSettings[K]) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const colorValue = (value: string, fallback: string) => /^#[\da-f]{6}$/i.test(value) ? value : fallback

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    emit('upload-error', 'Tệp đã chọn không phải là ảnh.')
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    emit('upload-error', 'Ảnh nền lớn hơn 8 MB. Hãy nén ảnh trước khi tải lên.')
    return
  }
  const reader = new FileReader()
  reader.onload = () => update('backgroundImage', String(reader.result ?? ''))
  reader.readAsDataURL(file)
  input.value = ''
}
</script>

<template>
  <div class="section-style-editor">
    <label class="config-toggle-field config-toggle-field--prominent">
      <span>Hiển thị section</span>
      <input type="checkbox" :checked="modelValue.enabled" @change="update('enabled', ($event.target as HTMLInputElement).checked)" />
    </label>

    <div class="design-group">
      <div class="design-group__title"><strong>Bố cục</strong><span>Khoảng cách và cách sắp xếp</span></div>
      <div class="design-grid design-grid--two">
        <label class="config-field">
          <span>Kiểu bố cục</span>
          <select :value="modelValue.layout" @change="update('layout', ($event.target as HTMLSelectElement).value as SectionSettings['layout'])">
            <option value="default">Mặc định</option>
            <option value="reverse">Đảo ảnh / nội dung</option>
            <option value="centered">Căn giữa, thu gọn</option>
          </select>
        </label>
        <label class="config-field">
          <span>Căn chữ</span>
          <select :value="modelValue.contentAlign" @change="update('contentAlign', ($event.target as HTMLSelectElement).value as SectionSettings['contentAlign'])">
            <option value="left">Trái</option>
            <option value="center">Giữa</option>
            <option value="right">Phải</option>
          </select>
        </label>
        <label class="config-field">
          <span>Số cột thẻ</span>
          <select :value="modelValue.columns" @change="update('columns', Number(($event.target as HTMLSelectElement).value))">
            <option :value="0">Theo thiết kế gốc</option>
            <option v-for="column in 6" :key="column" :value="column">{{ column }} cột</option>
          </select>
        </label>
        <label class="config-field">
          <span>CSS class riêng</span>
          <input type="text" :value="modelValue.customClass" placeholder="my-section" @input="update('customClass', ($event.target as HTMLInputElement).value)" />
        </label>
      </div>

      <div class="design-grid design-grid--two design-number-grid">
        <label v-for="field in numberFields" :key="field.key" class="config-field config-number-field">
          <span>{{ field.label }} <em>px</em></span>
          <input type="number" :min="field.min" :max="field.max" :step="field.step ?? 1" :value="modelValue[field.key]" @input="update(field.key, Number(($event.target as HTMLInputElement).value) as never)" />
        </label>
      </div>
    </div>

    <div class="design-group">
      <div class="design-group__title"><strong>Nền section</strong><span>Màu, ảnh và lớp phủ</span></div>
      <div class="design-grid design-grid--two">
        <label class="config-field config-color-field">
          <span>Màu nền</span>
          <div><input type="color" :value="colorValue(modelValue.backgroundColor, '#0b2459')" @input="update('backgroundColor', ($event.target as HTMLInputElement).value)" /><input type="text" :value="modelValue.backgroundColor" placeholder="để trống = màu gốc" @input="update('backgroundColor', ($event.target as HTMLInputElement).value)" /></div>
        </label>
        <label class="config-field config-color-field">
          <span>Màu chữ</span>
          <div><input type="color" :value="colorValue(modelValue.textColor, '#ffffff')" @input="update('textColor', ($event.target as HTMLInputElement).value)" /><input type="text" :value="modelValue.textColor" placeholder="để trống = màu gốc" @input="update('textColor', ($event.target as HTMLInputElement).value)" /></div>
        </label>
      </div>

      <div class="config-field config-image-field">
        <span>Ảnh nền riêng của section</span>
        <BackgroundPresetPicker
          :model-value="modelValue.backgroundImage"
          title="Chọn ảnh nền mẫu cho section"
          @update:model-value="update('backgroundImage', $event)"
        />
        <div v-if="modelValue.backgroundImage" class="config-image-preview"><img :src="modelValue.backgroundImage" alt="" /></div>
        <input type="text" :value="modelValue.backgroundImage" placeholder="Để trống để dùng ảnh/màu gốc" @input="update('backgroundImage', ($event.target as HTMLInputElement).value)" />
        <div class="config-image-actions">
          <label class="config-upload-button"><ImagePlus :size="15" /> Tải ảnh nền<input type="file" accept="image/*" @change="handleImageUpload" /></label>
          <button v-if="modelValue.backgroundImage" type="button" class="config-reset-image" @click="update('backgroundImage', '')"><RotateCcw :size="14" /> Dùng nền gốc</button>
        </div>
      </div>

      <div class="design-grid design-grid--two">
        <label class="config-field"><span>Vị trí ảnh</span><input type="text" :value="modelValue.backgroundPosition" placeholder="center center" @input="update('backgroundPosition', ($event.target as HTMLInputElement).value)" /></label>
        <label class="config-field"><span>Kích thước ảnh</span><select :value="modelValue.backgroundSize" @change="update('backgroundSize', ($event.target as HTMLSelectElement).value)"><option value="cover">Cover</option><option value="contain">Contain</option><option value="auto">Auto</option><option value="100% 100%">Kéo đầy 100%</option></select></label>
        <label class="config-field"><span>Lặp ảnh</span><select :value="modelValue.backgroundRepeat" @change="update('backgroundRepeat', ($event.target as HTMLSelectElement).value)"><option value="no-repeat">Không lặp</option><option value="repeat">Lặp cả hai chiều</option><option value="repeat-x">Lặp ngang</option><option value="repeat-y">Lặp dọc</option></select></label>
        <label class="config-field config-color-field"><span>Màu lớp phủ</span><div><input type="color" :value="colorValue(modelValue.overlayColor, '#071438')" @input="update('overlayColor', ($event.target as HTMLInputElement).value)" /><input type="text" :value="modelValue.overlayColor" @input="update('overlayColor', ($event.target as HTMLInputElement).value)" /></div></label>
      </div>
      <label class="config-range-field"><span>Độ đậm lớp phủ <strong>{{ Math.round(modelValue.overlayOpacity * 100) }}%</strong></span><input type="range" min="0" max="1" step="0.01" :value="modelValue.overlayOpacity" @input="update('overlayOpacity', Number(($event.target as HTMLInputElement).value))" /></label>
    </div>
  </div>
</template>
