<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileJson2,
  Image,
  KeyRound,
  LayoutDashboard,
  Lock,
  Monitor,
  PanelLeft,
  RotateCcw,
  Save,
  Settings2,
  Smartphone,
  Tablet,
  Unlock,
  Upload,
} from '@lucide/vue'
import CompetitionHero from '../components/CompetitionHero.vue'
import CompetitionSections from '../components/CompetitionSections.vue'
import ConfigField from '../components/editor/ConfigField.vue'
import GlobalStyleEditor from '../components/editor/GlobalStyleEditor.vue'
import SectionStyleEditor from '../components/editor/SectionStyleEditor.vue'
import {
  contentStorageKey,
  isSiteContent,
  loadSiteContent,
  normalizeSiteContent,
  sectionKeys,
  type SectionKey,
  type SectionSettings,
  type SiteContent,
} from '../data/site-content'
import { globalSiteStyle } from '../utils/site-styles'

type EditorSectionId = 'global' | 'header' | SectionKey
type EditorMode = 'visual' | 'json'
type InspectorTab = 'content' | 'design'
type DeviceMode = 'desktop' | 'tablet' | 'mobile'

interface EditorSection {
  id: EditorSectionId
  label: string
  hint: string
}

const sections: EditorSection[] = [
  { id: 'global', label: 'Toàn website', hint: 'SEO, font, màu và CSS' },
  { id: 'header', label: 'Header & menu', hint: 'Logo và điều hướng' },
  { id: 'hero', label: 'Hero mở đầu', hint: 'Tiêu đề, countdown, CTA' },
  { id: 'intro', label: 'Ban tổ chức', hint: 'Nội dung và slideshow' },
  { id: 'about', label: 'Giới thiệu cuộc thi', hint: 'Thông tin tổng quan' },
  { id: 'metrics', label: 'Số liệu nổi bật', hint: 'Icon và các con số' },
  { id: 'voices', label: 'Slider giám khảo', hint: 'Chia sẻ từ giám khảo, thí sinh' },
  { id: 'theme', label: 'Chủ đề', hint: 'Poster và diễn giải' },
  { id: 'rules', label: 'Thể lệ', hint: 'Các thẻ quy định' },
  { id: 'timeline', label: 'Timeline', hint: 'Các vòng và thời gian' },
  { id: 'prizes', label: 'Giải thưởng', hint: 'Tổng giải và từng hạng' },
  { id: 'benefits', label: 'Quyền lợi', hint: 'Các nhóm quyền lợi' },
  { id: 'activities', label: 'Hoạt động', hint: 'Các hoạt động đăng ký' },
  { id: 'faq', label: 'FAQ', hint: 'Câu hỏi thường gặp' },
  { id: 'partners', label: 'Đối tác', hint: 'Mốc và cấp tài trợ' },
  { id: 'footer', label: 'Footer', hint: 'Liên hệ và mạng xã hội' },
]

const site = ref<SiteContent | null>(null)
const activeSection = ref<EditorSectionId>('hero')
const activeTab = ref<InspectorTab>('content')
const editorMode = ref<EditorMode>('visual')
const deviceMode = ref<DeviceMode>('desktop')
const jsonText = ref('')
const errorMessage = ref('')
const statusMessage = ref('Đang tải cấu hình website...')
const savedState = ref<'saved' | 'saving' | 'error'>('saved')
const authStorageKey = 'tnth-editor-auth-token'
const isAuthenticated = ref(sessionStorage.getItem(authStorageKey) === 'true')
const passwordInput = ref('')
const passwordVisible = ref(false)
const authError = ref('')

const VALID_PASSWORDS = ['tnth2026', 'admin@tnth2026', 'admin123', 'tnth@2026']

const handleLogin = () => {
  authError.value = ''
  const val = passwordInput.value.trim()
  if (!val) {
    authError.value = 'Vui lòng nhập mật khẩu quản trị.'
    return
  }
  if (VALID_PASSWORDS.includes(val)) {
    sessionStorage.setItem(authStorageKey, 'true')
    isAuthenticated.value = true
    passwordInput.value = ''
    authError.value = ''
    void nextTick(() => {
      void setupPreviewObservers()
    })
  } else {
    authError.value = 'Mật khẩu không chính xác! Vui lòng thử lại.'
  }
}

const handleLogout = () => {
  sessionStorage.removeItem(authStorageKey)
  isAuthenticated.value = false
  passwordInput.value = ''
  authError.value = ''
}

const fileInput = ref<HTMLInputElement | null>(null)
const previewViewport = ref<HTMLElement | null>(null)
const previewDocument = ref<HTMLElement | null>(null)
const previewScale = ref(0.6)
const previewHeight = ref(900)
let saveTimer: ReturnType<typeof setTimeout> | undefined
let previewResizeObserver: ResizeObserver | undefined
let viewportResizeObserver: ResizeObserver | undefined
let ready = false

const deviceWidths: Record<DeviceMode, number> = { desktop: 1280, tablet: 768, mobile: 390 }
const deviceWidth = computed(() => deviceWidths[deviceMode.value])
const lineCount = computed(() => jsonText.value ? jsonText.value.split('\n').length : 0)
const activeDefinition = computed(() => sections.find((section) => section.id === activeSection.value) ?? sections[0])
const activeIsSection = computed(() => activeSection.value !== 'global' && activeSection.value !== 'header')
const orderedSections = computed(() => {
  if (!site.value) return sections
  const fixedIds: EditorSectionId[] = ['global', 'header', 'hero']
  const fixed = fixedIds.map((id) => sections.find((section) => section.id === id)).filter(Boolean) as EditorSection[]
  const ordered = site.value.settings.sectionOrder
    .map((id) => sections.find((section) => section.id === id))
    .filter(Boolean) as EditorSection[]
  return [...fixed, ...ordered]
})

const previewShellStyle = computed(() => ({
  width: `${deviceWidth.value * previewScale.value}px`,
  height: `${previewHeight.value}px`,
}))

const previewDocumentStyle = computed(() => ({
  width: `${deviceWidth.value}px`,
  transform: `scale(${previewScale.value})`,
}))

const prettyJson = (content: SiteContent) => JSON.stringify(content, null, 2)

const selectedModel = computed<unknown>({
  get: () => {
    if (!site.value) return {}
    const value = site.value
    switch (activeSection.value) {
      case 'global': return { meta: value.meta, heroBackground: value.assets.heroBackground }
      case 'header': return { navigation: value.navigation, headerLogo: value.assets.headerLogo }
      case 'hero': return { ...value.hero, heroBackground: value.assets.heroBackground, heroTitleArtwork: value.assets.heroTitleArtwork, heroOrganizations: value.assets.heroOrganizations }
      case 'intro': return { ...value.intro, organizerSlides: value.assets.organizerSlides }
      case 'about': {
        const { statistics: _statistics, ...about } = value.about
        return { ...about, aboutImage: value.assets.aboutImage }
      }
      case 'metrics': return { statistics: value.about.statistics, statisticIcon: value.assets.statisticIcon }
      case 'voices': return value.voices
      case 'theme': return { ...value.theme, themePoster: value.assets.themePoster }
      case 'rules': return value.rules
      case 'timeline': return { ...value.timeline, timelineBackground: value.assets.timelineBackground, compassOverlay: value.assets.compassOverlay }
      case 'prizes': return value.prizes
      case 'benefits': return value.benefits
      case 'activities': return { ...value.activities, activitiesBackground: value.assets.activitiesBackground }
      case 'faq': return { faq: value.faq }
      case 'partners': return value.partners
      case 'footer': return { ...value.footer, footerLogo: value.assets.footerLogo, footerBackground: value.assets.footerBackground }
      default: return {}
    }
  },
  set: (model) => {
    if (!site.value || typeof model !== 'object' || model === null) return
    const value = model as Record<string, unknown>
    switch (activeSection.value) {
      case 'global': {
        const { heroBackground, meta } = value as { meta: SiteContent['meta']; heroBackground?: string }
        if (meta) site.value.meta = meta
        if (heroBackground !== undefined) site.value.assets.heroBackground = String(heroBackground)
        break
      }
      case 'header':
        site.value.navigation = value.navigation as SiteContent['navigation']
        site.value.assets.headerLogo = String(value.headerLogo ?? '')
        break
      case 'hero': {
        const { heroBackground, heroTitleArtwork, heroOrganizations, ...hero } = value
        site.value.hero = hero as SiteContent['hero']
        site.value.assets.heroBackground = String(heroBackground ?? '')
        site.value.assets.heroTitleArtwork = String(heroTitleArtwork ?? '')
        site.value.assets.heroOrganizations = String(heroOrganizations ?? '')
        break
      }
      case 'intro': {
        const { organizerSlides, ...intro } = value
        site.value.intro = intro as SiteContent['intro']
        site.value.assets.organizerSlides = organizerSlides as SiteContent['assets']['organizerSlides']
        break
      }
      case 'about': {
        const { aboutImage, ...about } = value
        site.value.about = { ...site.value.about, ...about } as SiteContent['about']
        site.value.assets.aboutImage = String(aboutImage ?? '')
        break
      }
      case 'metrics':
        site.value.about.statistics = value.statistics as SiteContent['about']['statistics']
        site.value.assets.statisticIcon = String(value.statisticIcon ?? '')
        break
      case 'voices': site.value.voices = value as unknown as SiteContent['voices']; break
      case 'theme': {
        const { themePoster, ...theme } = value
        site.value.theme = theme as SiteContent['theme']
        site.value.assets.themePoster = String(themePoster ?? '')
        break
      }
      case 'rules': site.value.rules = value as unknown as SiteContent['rules']; break
      case 'timeline': {
        const { timelineBackground, compassOverlay, ...timeline } = value
        site.value.timeline = timeline as SiteContent['timeline']
        site.value.assets.timelineBackground = String(timelineBackground ?? '')
        site.value.assets.compassOverlay = String(compassOverlay ?? '')
        break
      }
      case 'prizes': site.value.prizes = value as unknown as SiteContent['prizes']; break
      case 'benefits': site.value.benefits = value as unknown as SiteContent['benefits']; break
      case 'activities': {
        const { activitiesBackground, ...activities } = value
        site.value.activities = activities as SiteContent['activities']
        site.value.assets.activitiesBackground = String(activitiesBackground ?? '')
        break
      }
      case 'faq': site.value.faq = value.faq as SiteContent['faq']; break
      case 'partners': site.value.partners = value as unknown as SiteContent['partners']; break
      case 'footer': {
        const { footerLogo, footerBackground, ...footer } = value
        site.value.footer = footer as SiteContent['footer']
        site.value.assets.footerLogo = String(footerLogo ?? '')
        site.value.assets.footerBackground = String(footerBackground ?? '')
        break
      }
    }
  },
})

const selectedSectionStyle = computed<SectionSettings>({
  get: () => {
    if (!site.value || !activeIsSection.value) throw new Error('Không có section đang chọn')
    return site.value.settings.sections[activeSection.value as SectionKey]
  },
  set: (value) => {
    if (!site.value || !activeIsSection.value) return
    site.value.settings.sections[activeSection.value as SectionKey] = value
  },
})

const updatePreviewMetrics = () => {
  if (!previewViewport.value || !previewDocument.value) return
  const availableWidth = Math.max(260, previewViewport.value.clientWidth - 48)
  previewScale.value = Math.min(1, availableWidth / deviceWidth.value)
  previewHeight.value = Math.max(500, previewDocument.value.scrollHeight * previewScale.value)
}

const setupPreviewObservers = async () => {
  await nextTick()
  previewResizeObserver?.disconnect()
  viewportResizeObserver?.disconnect()
  if (previewDocument.value) {
    previewResizeObserver = new ResizeObserver(updatePreviewMetrics)
    previewResizeObserver.observe(previewDocument.value)
  }
  if (previewViewport.value) {
    viewportResizeObserver = new ResizeObserver(updatePreviewMetrics)
    viewportResizeObserver.observe(previewViewport.value)
  }
  updatePreviewMetrics()
}

const scrollPreviewToActiveSection = async () => {
  await nextTick()
  if (!previewViewport.value || !previewDocument.value) return
  const target = previewDocument.value.querySelector<HTMLElement>(`[data-editor-section="${activeSection.value}"]`)
  if (!target) return
  previewViewport.value.scrollTo({ top: Math.max(0, target.offsetTop * previewScale.value - 22), behavior: 'smooth' })
}

const saveDraft = (showMessage = false) => {
  if (!site.value) return
  try {
    localStorage.setItem(contentStorageKey, JSON.stringify(site.value))
    jsonText.value = prettyJson(site.value)
    savedState.value = 'saved'
    if (showMessage) statusMessage.value = 'Đã lưu bản nháp trong trình duyệt'
    errorMessage.value = ''
  } catch {
    savedState.value = 'error'
    errorMessage.value = 'Bản nháp quá lớn để lưu trong trình duyệt. Preview vẫn hoạt động; hãy bấm “Tải JSON” để lưu ra máy.'
  }
}

const applyBackgroundToAllSections = (image: string) => {
  if (!site.value) return
  const currentSite = site.value
  currentSite.assets.heroBackground = image
  sectionKeys.forEach((key) => {
    if (currentSite.settings.sections[key]) {
      currentSite.settings.sections[key].backgroundImage = image
    }
  })
  statusMessage.value = 'Đã áp dụng ảnh nền cho tất cả các section!'
  saveDraft(true)
}

const setAsGlobalBackground = (image: string) => {
  if (!site.value) return
  site.value.assets.heroBackground = image
  statusMessage.value = 'Đã đặt làm ảnh nền cố định toàn website!'
  saveDraft(true)
}

const scheduleSave = () => {
  if (!ready) return
  savedState.value = 'saving'
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveDraft(), 450)
}

const loadContent = async (useDraft = true) => {
  try {
    ready = false
    site.value = await loadSiteContent(useDraft)
    jsonText.value = prettyJson(site.value)
    statusMessage.value = useDraft && localStorage.getItem(contentStorageKey)
      ? 'Đang dùng bản nháp đã lưu'
      : 'Đang dùng public/site-content.json'
    errorMessage.value = ''
    savedState.value = 'saved'
    await setupPreviewObservers()
    ready = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Không thể tải cấu hình.'
  }
}

const applyJson = async () => {
  try {
    const parsed = JSON.parse(jsonText.value) as unknown
    if (!isSiteContent(parsed)) throw new Error('JSON thiếu cấu trúc bắt buộc của website.')
    site.value = normalizeSiteContent(parsed)
    jsonText.value = prettyJson(site.value)
    saveDraft()
    statusMessage.value = 'Đã áp dụng JSON vào preview và bản nháp'
    errorMessage.value = ''
    await setupPreviewObservers()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'JSON không hợp lệ.'
  }
}

const downloadJson = () => {
  if (!site.value) return
  const source = editorMode.value === 'json' ? jsonText.value : prettyJson(site.value)
  try {
    const parsed = JSON.parse(source) as unknown
    if (!isSiteContent(parsed)) throw new Error('JSON chưa đúng cấu trúc.')
    const normalized = normalizeSiteContent(parsed)
    const blob = new Blob([prettyJson(normalized)], { type: 'application/json;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'site-content.json'
    link.click()
    URL.revokeObjectURL(link.href)
    statusMessage.value = 'Đã tải site-content.json — thay vào thư mục public khi deploy'
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Không thể xuất JSON.'
  }
}

const chooseFile = () => fileInput.value?.click()

const importJson = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    jsonText.value = String(reader.result ?? '')
    await applyJson()
  }
  reader.readAsText(file)
  input.value = ''
}

const resetToFile = async () => {
  localStorage.removeItem(contentStorageKey)
  await loadContent(false)
  statusMessage.value = 'Đã khôi phục nội dung từ public/site-content.json'
}

const handleUploadError = (message: string) => {
  errorMessage.value = message
}

const selectSection = (id: EditorSectionId) => {
  activeSection.value = id
  if (id === 'global') activeTab.value = 'design'
}

const moveSection = (key: SectionKey, direction: -1 | 1) => {
  if (!site.value || key === 'hero') return
  const order = [...site.value.settings.sectionOrder]
  const index = order.indexOf(key)
  const target = index + direction
  if (index < 0 || target < 0 || target >= order.length) return
  ;[order[index], order[target]] = [order[target], order[index]]
  site.value.settings.sectionOrder = order
}

const sectionOrderIndex = (id: EditorSectionId) => site.value?.settings.sectionOrder.indexOf(id as SectionKey) ?? -1
const sectionEnabled = (id: EditorSectionId) => {
  if (!site.value || id === 'global') return true
  if (id === 'header') return site.value.settings.header.enabled
  return site.value.settings.sections[id].enabled
}

watch(site, scheduleSave, { deep: true })
watch(activeSection, () => void scrollPreviewToActiveSection())
watch(deviceMode, () => void setupPreviewObservers())
watch(editorMode, (mode) => {
  if (mode === 'visual') void setupPreviewObservers()
  if (mode === 'json' && site.value) jsonText.value = prettyJson(site.value)
})

onMounted(() => void loadContent())
onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
  previewResizeObserver?.disconnect()
  viewportResizeObserver?.disconnect()
})
</script>

<template>
  <!-- 1. Màn hình bảo mật nhập mật khẩu khi chưa xác thực -->
  <div v-if="!isAuthenticated" class="editor-auth-overlay">
    <div class="editor-auth-box">
      <div class="editor-auth-badge">
        <Lock :size="28" />
      </div>
      <h1 class="editor-auth-title">TNTH Page Builder</h1>
      <p class="editor-auth-subtitle">Nhập mật khẩu quản trị để truy cập trình chỉnh sửa website Tầm Nhìn Thương Hiệu.</p>

      <form class="editor-auth-form" @submit.prevent="handleLogin">
        <div class="editor-auth-field">
          <KeyRound :size="16" class="editor-auth-icon" />
          <input
            v-model="passwordInput"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Nhập mật khẩu quản trị..."
            autofocus
            autocomplete="current-password"
          />
          <button
            type="button"
            class="editor-auth-eye"
            :title="passwordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            @click="passwordVisible = !passwordVisible"
          >
            <EyeOff v-if="passwordVisible" :size="16" />
            <Eye v-else :size="16" />
          </button>
        </div>

        <p v-if="authError" class="editor-auth-error-msg">
          {{ authError }}
        </p>

        <button type="submit" class="editor-auth-btn">
          <Unlock :size="16" /> Mở khóa Editor
        </button>
      </form>

      <div class="editor-auth-links">
        <RouterLink to="/" class="editor-auth-back-link">
          <ArrowLeft :size="14" /> Quay lại trang chủ
        </RouterLink>
        <span class="editor-auth-hint">Mật khẩu mặc định: <code>tnth2026</code></span>
      </div>
    </div>
  </div>

  <!-- 2. Không gian làm việc Editor khi đã xác thực -->
  <main v-else class="site-editor-page">
    <header class="site-editor-topbar">
      <RouterLink to="/" class="site-editor-brand"><LayoutDashboard :size="21" /><span><strong>TNTH Page Builder</strong><small>Visual content & layout editor</small></span></RouterLink>
      <div class="editor-mode-switch" role="tablist">
        <button type="button" :class="{ active: editorMode === 'visual' }" @click="editorMode = 'visual'"><PanelLeft :size="15" /> Trực quan</button>
        <button type="button" :class="{ active: editorMode === 'json' }" @click="editorMode = 'json'"><FileJson2 :size="15" /> JSON nâng cao</button>
      </div>
      <div class="editor-topbar-actions">
        <span class="editor-save-status" :class="`is-${savedState}`"><Check v-if="savedState === 'saved'" :size="13" />{{ savedState === 'saving' ? 'Đang lưu...' : savedState === 'error' ? 'Chưa lưu được' : 'Đã tự lưu' }}</span>
        <button type="button" @click="chooseFile"><Upload :size="15" /> Nhập JSON</button>
        <button type="button" @click="downloadJson"><Download :size="15" /> Tải JSON</button>
        <RouterLink to="/" target="_blank"><ExternalLink :size="15" /> Mở website</RouterLink>
        <button type="button" class="editor-lock-action" title="Khóa màn hình Editor" @click="handleLogout"><Lock :size="14" /> Khóa</button>
        <input ref="fileInput" class="d-none" type="file" accept="application/json,.json" @change="importJson" />
      </div>
    </header>

    <div v-if="errorMessage" class="editor-alert"><strong>Cần chú ý:</strong> {{ errorMessage }} <button type="button" @click="errorMessage = ''">×</button></div>

    <div v-if="editorMode === 'visual' && site" class="visual-editor-workspace">
      <aside class="editor-section-sidebar">
        <div class="editor-sidebar-heading"><span>CẤU TRÚC TRANG</span><strong>Sections</strong></div>
        <nav>
          <button
            v-for="section in orderedSections"
            :key="section.id"
            type="button"
            class="editor-section-button"
            :class="{ active: activeSection === section.id, disabled: !sectionEnabled(section.id) }"
            @click="selectSection(section.id)"
          >
            <span class="section-status-dot"></span>
            <span><strong>{{ section.label }}</strong><small>{{ section.hint }}</small></span>
            <span v-if="section.id !== 'global' && section.id !== 'header' && section.id !== 'hero'" class="section-order-buttons">
              <i role="button" :class="{ muted: sectionOrderIndex(section.id) <= 0 }" @click.stop="moveSection(section.id as SectionKey, -1)"><ArrowUp :size="11" /></i>
              <i role="button" :class="{ muted: sectionOrderIndex(section.id) >= site.settings.sectionOrder.length - 1 }" @click.stop="moveSection(section.id as SectionKey, 1)"><ArrowDown :size="11" /></i>
            </span>
          </button>
        </nav>
        <div class="editor-sidebar-footer"><span>{{ statusMessage }}</span><button type="button" @click="resetToFile"><RotateCcw :size="13" /> Khôi phục file gốc</button></div>
      </aside>

      <section ref="previewViewport" class="editor-live-preview">
        <div class="editor-preview-toolbar">
          <div><span>LIVE PREVIEW</span><strong>{{ site.meta.title }}</strong></div>
          <div class="device-switch">
            <button type="button" title="Desktop" :class="{ active: deviceMode === 'desktop' }" @click="deviceMode = 'desktop'"><Monitor :size="15" /></button>
            <button type="button" title="Tablet" :class="{ active: deviceMode === 'tablet' }" @click="deviceMode = 'tablet'"><Tablet :size="15" /></button>
            <button type="button" title="Mobile" :class="{ active: deviceMode === 'mobile' }" @click="deviceMode = 'mobile'"><Smartphone :size="15" /></button>
          </div>
        </div>
        <div class="editor-preview-stage">
          <div class="editor-device-frame" :class="`is-${deviceMode}`" :style="previewShellStyle">
            <div ref="previewDocument" class="editor-preview-document" :style="previewDocumentStyle">
              <main class="event-index" :style="globalSiteStyle(site)">
                <CompetitionHero :site="site" preview />
                <CompetitionSections :site="site" />
              </main>
            </div>
          </div>
        </div>
      </section>

      <aside class="editor-inspector">
        <div class="inspector-heading">
          <div><span>ĐANG CHỈNH SỬA</span><strong>{{ activeDefinition.label }}</strong><small>{{ activeDefinition.hint }}</small></div>
          <Settings2 :size="20" />
        </div>
        <div class="inspector-tabs">
          <button type="button" :class="{ active: activeTab === 'content' }" @click="activeTab = 'content'"><Image :size="14" /> Nội dung & ảnh</button>
          <button type="button" :class="{ active: activeTab === 'design' }" @click="activeTab = 'design'"><Settings2 :size="14" /> Bố cục & CSS</button>
        </div>
        <div class="inspector-scroll">
          <ConfigField v-if="activeTab === 'content'" v-model="selectedModel" @upload-error="handleUploadError" />
          <GlobalStyleEditor
            v-else-if="activeSection === 'global' || activeSection === 'header'"
            v-model="site.settings"
            :hero-background="site.assets.heroBackground"
            :mode="activeSection"
            @update:hero-background="site.assets.heroBackground = $event"
            @apply-to-all-sections="applyBackgroundToAllSections"
          />
          <SectionStyleEditor
            v-else
            v-model="selectedSectionStyle"
            @upload-error="handleUploadError"
            @apply-to-all-sections="applyBackgroundToAllSections"
            @set-as-global-bg="setAsGlobalBackground"
          />
        </div>
        <div class="inspector-actions">
          <button type="button" class="inspector-save-button" @click="saveDraft(true)"><Save :size="15" /> Lưu bản nháp</button>
          <button type="button" title="Tải site-content.json" @click="downloadJson"><Download :size="15" /></button>
        </div>
      </aside>
    </div>

    <section v-else-if="editorMode === 'json'" class="advanced-json-workspace">
      <div class="advanced-json-heading"><div><span>CHẾ ĐỘ NÂNG CAO</span><h1>site-content.json</h1><p>Sửa toàn bộ cấu hình gốc. Bấm áp dụng để đồng bộ lại form trực quan và preview.</p></div><div class="advanced-json-actions"><button type="button" @click="resetToFile"><RotateCcw :size="14" /> Khôi phục</button><button type="button" @click="downloadJson"><Download :size="14" /> Tải file</button></div></div>
      <label class="advanced-json-editor"><span>JSON · {{ lineCount }} dòng</span><textarea v-model="jsonText" spellcheck="false"></textarea></label>
      <button type="button" class="apply-json-button" @click="applyJson"><Check :size="16" /> Áp dụng JSON vào website</button>
    </section>

    <div v-else class="editor-loading"><span class="loading-orbit"></span><p>{{ errorMessage || 'Đang tải bộ cấu hình...' }}</p></div>
  </main>
</template>
