<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from '@lucide/vue'

const props = withDefaults(defineProps<{
  modelValue: unknown
  name?: string
  depth?: number
}>(), {
  name: '',
  depth: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  'upload-error': [message: string]
}>()

const labels: Record<string, string> = {
  title: 'Tiêu đề',
  description: 'Mô tả',
  label: 'Nhãn hiển thị',
  target: 'ID section đích',
  headerLogo: 'Logo header',
  heroBackground: 'Ảnh nền hero',
  heroTitleArtwork: 'Ảnh title hero (xóa để dùng text động)',
  heroOrganizations: 'Logo các đơn vị',
  organizerSlides: 'Ảnh slide giới thiệu',
  aboutImage: 'Ảnh giới thiệu',
  statisticIcon: 'Icon thống kê',
  themePoster: 'Poster chủ đề',
  compassOverlay: 'Ảnh la bàn phủ',
  timelineBackground: 'Ảnh nền timeline',
  activitiesBackground: 'Ảnh nền hoạt động',
  footerLogo: 'Logo footer',
  footerBackground: 'Ảnh nền footer',
  facebookIcon: 'Icon Facebook',
  tiktokIcon: 'Icon TikTok',
  navigation: 'Menu điều hướng',
  titleLineOne: 'Tiêu đề dòng 1',
  titleLineTwo: 'Tiêu đề dòng 2',
  edition: 'Năm / phiên bản',
  tagline: 'Thông điệp ngắn',
  deadline: 'Thời hạn countdown (ISO)',
  ctaLabel: 'Chữ trên nút',
  ctaHref: 'Link của nút',
  paragraphsHtml: 'Các đoạn nội dung (hỗ trợ HTML)',
  kicker: 'Dòng dẫn nhỏ',
  imageLabel: 'Chữ trên ảnh',
  statistics: 'Các số liệu',
  value: 'Giá trị',
  cards: 'Danh sách thẻ',
  slides: 'Các slide',
  items: 'Các ý nội dung',
  cardLabel: 'Nhãn thẻ',
  quote: 'Trích dẫn nổi bật',
  rounds: 'Các vòng thi',
  date: 'Ngày / thời gian',
  totalLabel: 'Nhãn tổng giải thưởng',
  totalValue: 'Tổng giá trị',
  benefits: 'Quyền lợi',
  groups: 'Các nhóm',
  question: 'Câu hỏi',
  answer: 'Câu trả lời',
  markers: 'Các dấu mốc',
  levels: 'Các cấp đối tác',
  organization: 'Đơn vị tổ chức',
  contact: 'Thông tin liên hệ',
  contactTitle: 'Tiêu đề liên hệ',
  contactLines: 'Các dòng liên hệ',
  socials: 'Các kênh mạng xã hội',
  role: 'Vai trò / chức danh',
  href: 'Đường dẫn',
  image: 'Ảnh',
  position: 'Vị trí ảnh',
  meta: 'SEO / thông tin website',
  content: 'Nội dung',
  media: 'Hình ảnh',
  faq: 'Câu hỏi thường gặp',
}

const label = computed(() => labels[props.name] ?? props.name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()))
const isArray = computed(() => Array.isArray(props.modelValue))
const isObject = computed(() => typeof props.modelValue === 'object' && props.modelValue !== null && !isArray.value)
const isLongText = computed(() => {
  if (typeof props.modelValue !== 'string') return false
  return props.modelValue.length > 70 || /(description|paragraph|answer|quote|customCss|items)/i.test(props.name)
})
const isImage = computed(() => {
  if (typeof props.modelValue !== 'string') return false
  return /(image|logo|poster|icon|overlay|background|artwork)/i.test(props.name)
    || /^data:image\//.test(props.modelValue)
    || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(props.modelValue)
})

const updateObjectValue = (key: string, value: unknown) => {
  emit('update:modelValue', { ...(props.modelValue as Record<string, unknown>), [key]: value })
}

const updateArrayValue = (index: number, value: unknown) => {
  const next = [...(props.modelValue as unknown[])]
  next[index] = value
  emit('update:modelValue', next)
}

const removeArrayValue = (index: number) => {
  emit('update:modelValue', (props.modelValue as unknown[]).filter((_, itemIndex) => itemIndex !== index))
}

const moveArrayValue = (index: number, direction: -1 | 1) => {
  const target = index + direction
  const next = [...(props.modelValue as unknown[])]
  if (target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target], next[index]]
  emit('update:modelValue', next)
}

const emptyFromTemplate = (value: unknown): unknown => {
  if (Array.isArray(value)) return []
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key,
      /(position)/i.test(key) ? item : emptyFromTemplate(item),
    ]))
  }
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return true
  return ''
}

const addArrayValue = () => {
  const current = props.modelValue as unknown[]
  const template = current.length ? current[current.length - 1] : ''
  emit('update:modelValue', [...current, emptyFromTemplate(template)])
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    emit('upload-error', 'Tệp đã chọn không phải là ảnh.')
    input.value = ''
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    emit('upload-error', 'Ảnh lớn hơn 8 MB. Hãy nén ảnh trước khi tải lên.')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', String(reader.result ?? ''))
  reader.onerror = () => emit('upload-error', 'Không thể đọc tệp ảnh này.')
  reader.readAsDataURL(file)
  input.value = ''
}
</script>

<template>
  <div v-if="isObject" class="config-object" :class="{ 'config-object--nested': depth > 0 }">
    <div v-if="name" class="config-group-title">{{ label }}</div>
    <ConfigField
      v-for="(value, key) in (modelValue as Record<string, unknown>)"
      :key="String(key)"
      :model-value="value"
      :name="String(key)"
      :depth="depth + 1"
      @update:model-value="updateObjectValue(String(key), $event)"
      @upload-error="emit('upload-error', $event)"
    />
  </div>

  <div v-else-if="isArray" class="config-array">
    <div class="config-array__heading">
      <div><strong>{{ label }}</strong><span>{{ (modelValue as unknown[]).length }} mục</span></div>
      <button type="button" @click="addArrayValue"><Plus :size="14" /> Thêm</button>
    </div>

    <div v-if="!(modelValue as unknown[]).length" class="config-array__empty">Chưa có mục nào. Bấm “Thêm” để tạo mới.</div>
    <article v-for="(item, index) in (modelValue as unknown[])" :key="index" class="config-array-item">
      <div class="config-array-item__toolbar">
        <span>Mục {{ index + 1 }}</span>
        <div>
          <button type="button" :disabled="index === 0" title="Đưa lên" @click="moveArrayValue(index, -1)"><ArrowUp :size="13" /></button>
          <button type="button" :disabled="index === (modelValue as unknown[]).length - 1" title="Đưa xuống" @click="moveArrayValue(index, 1)"><ArrowDown :size="13" /></button>
          <button type="button" class="is-danger" title="Xóa" @click="removeArrayValue(index)"><Trash2 :size="13" /></button>
        </div>
      </div>
      <ConfigField
        :model-value="item"
        :name="typeof item === 'object' && item !== null ? '' : `Nội dung ${index + 1}`"
        :depth="depth + 1"
        @update:model-value="updateArrayValue(index, $event)"
        @upload-error="emit('upload-error', $event)"
      />
    </article>
  </div>

  <label v-else-if="typeof modelValue === 'boolean'" class="config-toggle-field">
    <span>{{ label }}</span>
    <input type="checkbox" :checked="modelValue" @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
  </label>

  <div v-else-if="isImage" class="config-field config-image-field">
    <span>{{ label }}</span>
    <div v-if="modelValue" class="config-image-preview"><img :src="String(modelValue)" alt="" /></div>
    <input type="text" :value="String(modelValue ?? '')" placeholder="/assets/... hoặc https://..." @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <label class="config-upload-button"><ImagePlus :size="15" /> Tải ảnh từ máy<input type="file" accept="image/*" @change="handleImageUpload" /></label>
    <small>Ảnh được nhúng trực tiếp vào bản JSON để xem và xuất ngay.</small>
  </div>

  <label v-else-if="typeof modelValue === 'number'" class="config-field">
    <span>{{ label }}</span>
    <input type="number" :value="modelValue" @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))" />
  </label>

  <label v-else class="config-field">
    <span>{{ label }}</span>
    <textarea v-if="isLongText" :value="String(modelValue ?? '')" rows="4" @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"></textarea>
    <input v-else type="text" :value="String(modelValue ?? '')" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <small v-if="/paragraphsHtml/i.test(name)">Có thể dùng thẻ HTML như &lt;strong&gt;, &lt;br&gt;.</small>
  </label>
</template>
