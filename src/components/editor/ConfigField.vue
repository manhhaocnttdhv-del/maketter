<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp, GripVertical, ImagePlus, Plus, Trash2 } from '@lucide/vue'
import BackgroundPresetPicker from './BackgroundPresetPicker.vue'
import SourceImagePicker from './SourceImagePicker.vue'

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
  editorPassword: 'Mật khẩu quản trị (/editor)',
  label: 'Nhãn hiển thị',
  target: 'ID section đích',
  globalBackground: 'Ảnh nền chung từ section 2',
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
  footerCardScale: 'Kích cỡ khối Kênh liên hệ',
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
  blocks: 'Các khối nội dung',
  heading: 'Tiêu đề khối',
  contentHtml: 'Nội dung nhiều dòng (hỗ trợ in đậm và màu)',
  date: 'Ngày / thời gian',
  totalLabel: 'Nhãn tổng giải thưởng',
  totalValue: 'Tổng giá trị',
  benefits: 'Quyền lợi',
  groups: 'Các nhóm',
  question: 'Câu hỏi',
  answer: 'Câu trả lời',
  organizers: 'Logo đơn vị tổ chức',
  organizerLogoScale: 'Kích cỡ logo đơn vị tổ chức',
  levels: 'Các cấp đối tác',
  supportGroups: 'Logo nhà tài trợ / bảo trợ',
  logos: 'Danh sách logo',
  name: 'Tên đơn vị / mô tả ảnh',
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
const draggedLogoIndex = ref<number | null>(null)

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

const dropLogoAt = (targetIndex: number) => {
  const sourceIndex = draggedLogoIndex.value
  draggedLogoIndex.value = null
  if (sourceIndex === null || sourceIndex === targetIndex) return
  const next = [...(props.modelValue as unknown[])]
  const [moved] = next.splice(sourceIndex, 1)
  next.splice(targetIndex, 0, moved)
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

const readImageFile = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result ?? ''))
  reader.onerror = () => reject(new Error('read-error'))
  reader.readAsDataURL(file)
})

const handleMultipleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  if (!files.length) return

  const invalid = files.find((file) => !file.type.startsWith('image/'))
  if (invalid) {
    emit('upload-error', `“${invalid.name}” không phải là tệp ảnh.`)
    return
  }
  const oversized = files.find((file) => file.size > 8 * 1024 * 1024)
  if (oversized) {
    emit('upload-error', `“${oversized.name}” lớn hơn 8 MB. Hãy nén ảnh trước khi tải lên.`)
    return
  }

  try {
    const images = await Promise.all(files.map(async (file) => ({
      image: await readImageFile(file),
      name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
    })))
    const current = props.modelValue as unknown[]
    const placeholdersOnly = current.length > 0 && current.every((item) => {
      if (typeof item !== 'object' || item === null) return false
      return !String((item as Record<string, unknown>).image ?? '')
    })
    emit('update:modelValue', placeholdersOnly ? images : [...current, ...images])
  } catch {
    emit('upload-error', 'Không thể đọc một hoặc nhiều tệp ảnh đã chọn.')
  }
}

const handleLogoItemUpload = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    emit('upload-error', `“${file.name}” không phải là tệp ảnh.`)
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    emit('upload-error', `“${file.name}” lớn hơn 8 MB. Hãy nén ảnh trước khi tải lên.`)
    return
  }

  try {
    const items = props.modelValue as Array<Record<string, unknown>>
    const item = items[index] ?? {}
    const currentName = String(item.name ?? '').trim()
    updateArrayValue(index, {
      ...item,
      image: await readImageFile(file),
      name: currentName && currentName !== 'Logo'
        ? currentName
        : file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
    })
  } catch {
    emit('upload-error', 'Không thể đọc tệp ảnh này.')
  }
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

const handleFormattingShortcut = (event: KeyboardEvent) => {
  if (!(event.ctrlKey || event.metaKey)) return
  const key = event.key.toLowerCase()
  const isBold = key === 'b' && !event.shiftKey
  const isCyan = key === 'c' && event.shiftKey
  if (!isBold && !isCyan) return
  const textarea = event.currentTarget as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  if (start === end) return
  event.preventDefault()
  const selected = textarea.value.slice(start, end)
  const open = isBold ? '<strong style="color: #7feeff">' : '<span style="color: #7feeff">'
  const close = isBold ? '</strong>' : '</span>'
  const nextValue = `${textarea.value.slice(0, start)}${open}${selected}${close}${textarea.value.slice(end)}`
  emit('update:modelValue', nextValue)
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(start + open.length, end + open.length)
  })
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

  <div v-else-if="isArray && name === 'logos'" class="config-array logo-manager">
    <div class="config-array__heading logo-manager__heading">
      <div><strong>{{ label }}</strong><span>{{ (modelValue as unknown[]).length }} logo · kéo thả để sắp xếp</span></div>
      <button type="button" @click="addArrayValue"><Plus :size="14" /> Thêm ô</button>
    </div>
    <label class="config-upload-button config-upload-button--multiple">
      <ImagePlus :size="16" /> Chọn và import nhiều logo
      <input type="file" accept="image/*" multiple @change="handleMultipleImageUpload" />
    </label>
    <div v-if="!(modelValue as unknown[]).length" class="config-array__empty">Chưa có logo. Hãy chọn nhiều ảnh để import.</div>
    <div v-else class="logo-manager__grid">
      <article
        v-for="(item, index) in (modelValue as Array<Record<string, unknown>>)"
        :key="index"
        class="logo-manager__item"
        :class="{ 'is-dragging': draggedLogoIndex === index }"
        draggable="true"
        @dragstart="draggedLogoIndex = index"
        @dragend="draggedLogoIndex = null"
        @dragover.prevent
        @drop.prevent="dropLogoAt(index)"
      >
        <div class="logo-manager__preview">
          <img v-if="item.image" :src="String(item.image)" :alt="String(item.name || '')" />
          <ImagePlus v-else :size="25" />
          <span><GripVertical :size="14" /> {{ index + 1 }}</span>
          <label class="logo-manager__replace" title="Chọn ảnh cho ô này">
            <ImagePlus :size="15" />
            <input type="file" accept="image/*" @change="handleLogoItemUpload($event, index)" />
          </label>
        </div>
        <input type="text" :value="String(item.name || '')" placeholder="Tên đơn vị" @input="updateArrayValue(index, { ...item, name: ($event.target as HTMLInputElement).value })" />
        <SourceImagePicker
          :model-value="String(item.image || '')"
          label="Chọn ảnh trong source"
          compact
          @update:model-value="updateArrayValue(index, { ...item, image: $event })"
        />
        <div class="logo-manager__actions">
          <button type="button" :disabled="index === 0" title="Đưa lên" @click="moveArrayValue(index, -1)"><ArrowUp :size="13" /></button>
          <button type="button" :disabled="index === (modelValue as unknown[]).length - 1" title="Đưa xuống" @click="moveArrayValue(index, 1)"><ArrowDown :size="13" /></button>
          <button type="button" class="is-danger" title="Xóa logo" @click="removeArrayValue(index)"><Trash2 :size="13" /></button>
        </div>
      </article>
    </div>
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
    <BackgroundPresetPicker
      v-if="/background/i.test(name)"
      :model-value="String(modelValue ?? '')"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <div v-if="modelValue" class="config-image-preview"><img :src="String(modelValue)" alt="" /></div>
    <input type="text" :value="String(modelValue ?? '')" placeholder="/assets/... hoặc https://..." @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <SourceImagePicker :model-value="String(modelValue ?? '')" @update:model-value="emit('update:modelValue', $event)" />
    <label class="config-upload-button"><ImagePlus :size="15" /> Tải ảnh từ máy<input type="file" accept="image/*" @change="handleImageUpload" /></label>
    <small>Ảnh được nhúng trực tiếp vào bản JSON để xem và xuất ngay.</small>
  </div>

  <label v-else-if="typeof modelValue === 'number' && (name === 'organizerLogoScale' || name === 'footerCardScale')" class="config-range-field config-range-field--editable">
    <span>{{ label }} <strong>{{ modelValue }}%</strong></span>
    <input type="range" min="20" :max="name === 'organizerLogoScale' ? 200 : 100" step="1" :value="modelValue" @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))" />
    <small>Kéo để thu/phóng khối này (20–{{ name === 'organizerLogoScale' ? 200 : 100 }}%).</small>
  </label>

  <label v-else-if="typeof modelValue === 'number'" class="config-field">
    <span>{{ label }}</span>
    <input type="number" :value="modelValue" @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))" />
  </label>

  <label v-else class="config-field">
    <span>{{ label }}</span>
    <textarea v-if="isLongText" :value="String(modelValue ?? '')" rows="4" @keydown="handleFormattingShortcut" @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"></textarea>
    <input v-else type="text" :value="String(modelValue ?? '')" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <small v-if="isLongText">Bôi đen chữ: Ctrl+B để in đậm + tự đổi màu cyan · Ctrl+Shift+C để chỉ đổi màu.</small>
  </label>
</template>
