export interface NavItem {
  label: string
  target: string
}

export interface IntroSlide {
  image: string
  position?: string
  label?: string
}

export interface Statistic {
  value: string
  label: string
}

export interface Rule {
  title: string
  items: string[]
}

export interface TimelineRound {
  title: string
  date: string
  description: string
}

export interface Prize {
  title: string
  value: string
  benefits: string[]
}

export interface BenefitGroup {
  title: string
  items: string[]
}

export interface Activity {
  title: string
  date: string
  description: string
  ctaLabel: string
  ctaHref: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface PartnerLevel {
  label: string
  value: string
}

export interface Testimonial {
  image: string
  name: string
  role: string
  quote: string
}

export type SectionKey =
  | 'hero'
  | 'intro'
  | 'about'
  | 'metrics'
  | 'voices'
  | 'theme'
  | 'rules'
  | 'timeline'
  | 'prizes'
  | 'benefits'
  | 'activities'
  | 'faq'
  | 'partners'
  | 'footer'

export interface GlobalSettings {
  containerWidth: number
  fontFamily: string
  headingFontFamily: string
  baseFontSize: number
  primaryColor: string
  secondaryColor: string
  accentColor: string
  pageBackground: string
  textColor: string
  headingColor: string
  buttonRadius: number
  scrollBehavior: 'smooth' | 'auto'
}

export interface HeaderSettings {
  enabled: boolean
  sticky: boolean
  height: number
  logoWidth: number
  containerWidth: number
  paddingX: number
  navGap: number
  fontSize: number
  backgroundColor: string
  textColor: string
  backdropBlur: number
}

export interface SectionSettings {
  enabled: boolean
  paddingTop: number
  paddingBottom: number
  marginTop: number
  marginBottom: number
  minHeight: number
  containerWidth: number
  backgroundColor: string
  backgroundImage: string
  backgroundPosition: string
  backgroundSize: string
  backgroundRepeat: string
  overlayColor: string
  overlayOpacity: number
  textColor: string
  contentAlign: 'left' | 'center' | 'right'
  layout: 'default' | 'reverse' | 'centered'
  columns: number
  borderRadius: number
  customClass: string
}

export interface SiteSettings {
  global: GlobalSettings
  header: HeaderSettings
  sectionOrder: SectionKey[]
  sections: Record<SectionKey, SectionSettings>
  customCss: string
}

export interface SiteContent {
  meta: {
    title: string
    description: string
    editorPassword?: string
  }
  settings: SiteSettings
  assets: {
    headerLogo: string
    heroBackground: string
    heroTitleArtwork: string
    heroOrganizations: string
    organizerSlides: IntroSlide[]
    aboutImage: string
    statisticIcon: string
    themePoster: string
    compassOverlay: string
    timelineBackground: string
    activitiesBackground: string
    facebookIcon: string
    tiktokIcon: string
    footerLogo: string
    footerBackground: string
  }
  navigation: NavItem[]
  hero: {
    titleLineOne: string
    titleLineTwo: string
    edition: string
    tagline: string
    deadline: string
    ctaLabel: string
    ctaHref: string
  }
  intro: {
    paragraphsHtml: string[]
    ctaLabel: string
    ctaHref: string
  }
  about: {
    kicker: string
    title: string
    description: string
    imageLabel: string
    paragraphsHtml: string[]
    statistics: Statistic[]
  }
  voices: {
    title: string
    slides: Testimonial[]
  }
  theme: {
    kicker: string
    title: string
    cardLabel: string
    quote: string
    paragraphsHtml: string[]
  }
  rules: {
    title: string
    cards: Rule[]
  }
  timeline: {
    title: string
    rounds: TimelineRound[]
  }
  prizes: {
    title: string
    totalLabel: string
    totalValue: string
    cards: Prize[]
  }
  benefits: {
    title: string
    groups: BenefitGroup[]
  }
  activities: {
    kicker: string
    title: string
    cards: Activity[]
  }
  faq: FAQ[]
  partners: {
    kicker: string
    title: string
    markers: string[]
    levels: PartnerLevel[]
  }
  footer: {
    title: string
    organization: string
    contact: string
    contactTitle: string
    contactLines: string[]
    socials: Array<{
      icon: string
      label: string
      href: string
    }>
  }
}

export const sectionKeys: SectionKey[] = [
  'hero', 'intro', 'about', 'metrics', 'voices', 'theme', 'rules', 'timeline',
  'prizes', 'benefits', 'activities', 'faq', 'partners', 'footer',
]

export const contentSectionOrder: SectionKey[] = sectionKeys.filter((key) => key !== 'hero')

const makeSectionSettings = (overrides: Partial<SectionSettings> = {}): SectionSettings => ({
  enabled: true,
  paddingTop: 52,
  paddingBottom: 52,
  marginTop: 0,
  marginBottom: 0,
  minHeight: 0,
  containerWidth: 1180,
  backgroundColor: '',
  backgroundImage: '',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  overlayColor: '#071438',
  overlayOpacity: 0.45,
  textColor: '',
  contentAlign: 'left',
  layout: 'default',
  columns: 0,
  borderRadius: 0,
  customClass: '',
  ...overrides,
})

export const defaultSiteSettings: SiteSettings = {
  global: {
    containerWidth: 1280,
    fontFamily: "'Lexend', 'Montserrat', sans-serif",
    headingFontFamily: "'Oxanium', 'Lexend', sans-serif",
    baseFontSize: 20,
    primaryColor: '#183b83',
    secondaryColor: '#7045dd',
    accentColor: '#7feeff',
    pageBackground: '#08183f',
    textColor: '#eef6ff',
    headingColor: '#ffffff',
    buttonRadius: 999,
    scrollBehavior: 'smooth',
  },
  header: {
    enabled: true,
    sticky: true,
    height: 78,
    logoWidth: 64,
    containerWidth: 1280,
    paddingX: 28,
    navGap: 40,
    fontSize: 16,
    backgroundColor: 'rgba(4, 7, 28, 0.96)',
    textColor: '#ffffff',
    backdropBlur: 16,
  },
  sectionOrder: [...contentSectionOrder],
  sections: {
    hero: makeSectionSettings({ paddingTop: 0, paddingBottom: 0, minHeight: 650, containerWidth: 1280 }),
    intro: makeSectionSettings({ paddingTop: 52, paddingBottom: 58 }),
    about: makeSectionSettings(),
    metrics: makeSectionSettings({ paddingTop: 44, paddingBottom: 48 }),
    voices: makeSectionSettings({ paddingTop: 48, paddingBottom: 54, containerWidth: 1180 }),
    theme: makeSectionSettings(),
    rules: makeSectionSettings(),
    timeline: makeSectionSettings(),
    prizes: makeSectionSettings(),
    benefits: makeSectionSettings(),
    activities: makeSectionSettings(),
    faq: makeSectionSettings({ paddingTop: 48, paddingBottom: 54 }),
    partners: makeSectionSettings({ paddingBottom: 54 }),
    footer: makeSectionSettings({ paddingTop: 36, paddingBottom: 42 }),
  },
  customCss: '',
}

export const contentFilePath = '/site-content.json'
export const contentStorageKey = 'tnth-site-content-draft'

export const isSiteContent = (value: unknown): value is SiteContent => {
  if (typeof value !== 'object' || value === null) return false
  const config = value as Partial<SiteContent>
  return Boolean(
    config.meta
    && config.assets
    && typeof config.assets.headerLogo === 'string'
    && typeof config.assets.heroBackground === 'string'
    && typeof config.assets.heroOrganizations === 'string'
    && typeof config.assets.statisticIcon === 'string'
    && Array.isArray(config.navigation)
    && config.hero
    && config.intro,
  )
}

const normalizeSettings = (settings?: Partial<SiteSettings>): SiteSettings => {
  const sourceSections = settings?.sections ?? {} as Partial<Record<SectionKey, Partial<SectionSettings>>>
  const sections = Object.fromEntries(sectionKeys.map((key) => [
    key,
    { ...defaultSiteSettings.sections[key], ...(sourceSections[key] ?? {}) },
  ])) as Record<SectionKey, SectionSettings>

  const requestedOrder = Array.isArray(settings?.sectionOrder)
    ? settings.sectionOrder.filter((key): key is SectionKey => contentSectionOrder.includes(key as SectionKey))
    : []
  const sectionOrder = [...new Set([...requestedOrder, ...contentSectionOrder])]

  return {
    global: { ...defaultSiteSettings.global, ...(settings?.global ?? {}) },
    header: { ...defaultSiteSettings.header, ...(settings?.header ?? {}) },
    sectionOrder,
    sections,
    customCss: settings?.customCss ?? '',
  }
}

const defaultVoices: SiteContent['voices'] = {
  title: 'TẦM NHÌN THƯƠNG HIỆU VỚI GIÁM KHẢO, THÍ SINH',
  slides: [
    {
      image: '/assets/tnth-canva/07-mahsy0l1pt4-MAHSy0l1pT4.jpg',
      name: 'CHỊ NGUYỄN THỊ A',
      role: 'Giám khảo',
      quote: 'Tầm Nhìn Thương Hiệu là một hành trình để người trẻ thử sức, kết nối và biến góc nhìn thương hiệu thành giải pháp thực tế.',
    },
  ],
}

const defaultFooter: SiteContent['footer'] = {
  title: 'Kênh liên hệ:',
  organization: '',
  contact: '',
  contactTitle: 'Kênh liên hệ:',
  contactLines: [
    'Trưởng Ban Tổ chức: 0369218999 (Nguyễn Thị Minh Hiền)',
    'Trưởng Ban Truyền thông: 0822446348 (Nguyễn Trần Lâm Hoàng)',
  ],
  socials: [
    { icon: '/assets/tnth-canva/13-facebook-logo-MAGzNqKrzKM.svg', label: 'Fanpage Tầm Nhìn Thương Hiệu', href: '#' },
    { icon: '/assets/tnth-canva/13-facebook-logo-MAGzNqKrzKM.svg', label: 'Group Tầm Nhìn Thương Hiệu', href: '#' },
    { icon: '/assets/tnth-canva/14-tik-tok-icon-MAGzNtv5p7o.svg', label: 'TikTok Tầm Nhìn Thương Hiệu', href: '#' },
  ],
}

export const normalizeSiteContent = (value: SiteContent): SiteContent => {
  const legacy = value as Partial<SiteContent>
  const legacySettings = value.settings as Partial<SiteSettings>
  const settingsWithRefinedSpacing: Partial<SiteSettings> = legacy.voices
    ? legacySettings
    : {
      ...legacySettings,
      sections: Object.fromEntries(sectionKeys.map((key) => [
        key,
        {
          ...(legacySettings.sections?.[key] ?? {}),
          paddingTop: defaultSiteSettings.sections[key].paddingTop,
          paddingBottom: defaultSiteSettings.sections[key].paddingBottom,
        },
      ])) as SiteSettings['sections'],
    }
  return {
    ...value,
    meta: {
      ...value.meta,
      editorPassword: value.meta?.editorPassword || '111111',
    },
    assets: {
      ...value.assets,
      heroTitleArtwork: value.assets.heroTitleArtwork || '/assets/tnth-canva/06-mahstkk4kow-MAHStKK4Kow.png',
      footerLogo: value.assets.footerLogo || '/assets/tnth-canva/02-magto6-z-j8-MAGto6_z-j8.png',
      footerBackground: value.assets.footerBackground || '/assets/tnth-canva/10-mahsd0narra-MAHSd0NArRA.png',
    },
    voices: {
      ...defaultVoices,
      ...(legacy.voices ?? {}),
      slides: legacy.voices?.slides?.length ? legacy.voices.slides : defaultVoices.slides,
    },
    footer: {
      ...defaultFooter,
      ...(legacy.footer ?? {}),
      contactLines: legacy.footer?.contactLines?.length ? legacy.footer.contactLines : defaultFooter.contactLines,
      socials: legacy.footer?.socials?.length ? legacy.footer.socials : defaultFooter.socials,
    },
    settings: normalizeSettings(settingsWithRefinedSpacing),
  }
}

export const loadSiteContent = async (useDraft = true): Promise<SiteContent> => {
  if (useDraft) {
    const draft = localStorage.getItem(contentStorageKey)
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as unknown
        if (isSiteContent(parsed)) return normalizeSiteContent(parsed)
      } catch {
        localStorage.removeItem(contentStorageKey)
      }
    }
  }

  const response = await fetch(`${contentFilePath}?v=${Date.now()}`)
  if (!response.ok) throw new Error('Không thể tải site-content.json')
  const content = await response.json() as unknown
  if (!isSiteContent(content)) throw new Error('site-content.json không đúng cấu trúc')
  return normalizeSiteContent(content)
}
