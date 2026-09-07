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

export interface CustomContentBlock {
  heading: string
  contentHtml: string
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

export interface PartnerLogo {
  image: string
  name: string
}

export interface PartnerGroup {
  title: string
  logos: PartnerLogo[]
}

export interface Testimonial {
  image: string
  name?: string
  role?: string
  quote?: string
}

export type SectionKey =
  | 'hero'
  | 'intro'
  | 'about'
  | 'metrics'
  | 'voices'
  | 'partnerVoices'
  | 'theme'
  | 'rules'
  | 'timeline'
  | 'customContent'
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
  contentFontSize: number
  headingFontSize: number
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
    globalBackground: string
    headerLogo: string
    heroBackground: string
    heroTitleArtwork: string
    heroOrganizations: string
    organizerSlides: IntroSlide[]
    aboutImage: string
    aboutGallery?: string[]
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
    titleArtworkWidth: number
    titleArtworkOffsetX: number
    titleArtworkOffsetY: number
  }
  intro: {
    title?: string
    subtitle?: string
    paragraphsHtml: string[]
    ctaLabel: string
    ctaHref: string
  }
  about: {
    kicker: string
    title: string
    description: string
    descriptionFontSize: number
    imageLabel: string
    paragraphsHtml: string[]
    paragraphOneFontSize: number
    paragraphTwoFontSize: number
    statistics: Statistic[]
  }
  voices: {
    title: string
    slides: Testimonial[]
  }
  partnerVoices: {
    title: string
    slides: Testimonial[]
  }
  theme: {
    kicker: string
    title: string
    subtitle?: string
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
  customContent: {
    title: string
    blocks: CustomContentBlock[]
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
    organizerLogoScale: number
    organizerPaddingTop: number
    organizerPaddingBottom: number
    organizerPaddingX: number
    supportGroupsPaddingBottom: number
    organizers: PartnerGroup
    supportGroups: PartnerGroup[]
  }
  footer: {
    title: string
    organization: string
    contact: string
    footerCardScale: number
    footerLogoScale: number
    contactFontSize: number
    contactNameFontSize: number
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
  'hero', 'intro', 'about', 'metrics', 'voices', 'partnerVoices', 'theme', 'rules', 'timeline', 'customContent',
  'prizes', 'benefits', 'activities', 'partners', 'faq', 'footer',
]

export const contentSectionOrder: SectionKey[] = sectionKeys.filter((key) => key !== 'hero')

const makeSectionSettings = (overrides: Partial<SectionSettings> = {}): SectionSettings => ({
  enabled: true,
  contentFontSize: 16,
  headingFontSize: 0,
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
    containerWidth: 1360,
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
    height: 76,
    logoWidth: 68,
    containerWidth: 1400,
    paddingX: 32,
    navGap: 36,
    fontSize: 15,
    backgroundColor: 'rgba(4, 7, 28, 0.96)',
    textColor: '#ffffff',
    backdropBlur: 16,
  },
  sectionOrder: [...contentSectionOrder],
  sections: {
    hero: makeSectionSettings({ paddingTop: 0, paddingBottom: 0, minHeight: 600, containerWidth: 1400 }),
    intro: makeSectionSettings({ paddingTop: 52, paddingBottom: 58 }),
    about: makeSectionSettings(),
    metrics: makeSectionSettings({ paddingTop: 44, paddingBottom: 48 }),
    voices: makeSectionSettings({ paddingTop: 48, paddingBottom: 54, containerWidth: 1180 }),
    partnerVoices: makeSectionSettings({ paddingTop: 48, paddingBottom: 54, containerWidth: 1180 }),
    theme: makeSectionSettings(),
    rules: makeSectionSettings(),
    timeline: makeSectionSettings(),
    customContent: makeSectionSettings({ enabled: false, containerWidth: 1040, contentAlign: 'left' }),
    prizes: makeSectionSettings(),
    benefits: makeSectionSettings(),
    activities: makeSectionSettings(),
    faq: makeSectionSettings({ paddingTop: 48, paddingBottom: 54 }),
    partners: makeSectionSettings({ paddingTop: 52, paddingBottom: 80 }),
    footer: makeSectionSettings({ paddingTop: 36, paddingBottom: 42 }),
  },
  customCss: '',
}

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
  if (!requestedOrder.includes('partnerVoices')) {
    const appendedPartnerVoicesIndex = sectionOrder.indexOf('partnerVoices')
    if (appendedPartnerVoicesIndex >= 0) sectionOrder.splice(appendedPartnerVoicesIndex, 1)
    const voicesIndex = sectionOrder.indexOf('voices')
    sectionOrder.splice(voicesIndex >= 0 ? voicesIndex + 1 : 0, 0, 'partnerVoices')
  }
  const faqIndex = sectionOrder.indexOf('faq')
  const partnersIndex = sectionOrder.indexOf('partners')
  if (partnersIndex > faqIndex) {
    sectionOrder.splice(partnersIndex, 1)
    sectionOrder.splice(faqIndex, 0, 'partners')
  }

  return {
    global: { ...defaultSiteSettings.global, ...(settings?.global ?? {}) },
    header: { ...defaultSiteSettings.header, ...(settings?.header ?? {}) },
    sectionOrder,
    sections,
    customCss: settings?.customCss ?? '',
  }
}

const defaultVoices: SiteContent['voices'] = {
  title: 'TẦM NHÌN THƯƠNG HIỆU 2025\nVỚI GIÁM KHẢO, THÍ SINH',
  slides: [
    {
      image: '/assets/tnth-canva/07-mahsy0l1pt4-MAHSy0l1pT4.jpg',
      name: 'CHỊ NGUYỄN THỊ A',
      role: 'Quán quân Tầm Nhìn Thương Hiệu 2025',
      quote: 'Nếu được nhắn nhủ một điều tới các đội thi đầy nhiệt huyết của Tầm Nhìn Thương Hiệu 2026, mình muốn nói rằng: Các bạn hãy cứ dám thử, dám thể hiện và hãy tận hưởng hành trình này, vì biết đâu đích đến có lẽ không cần là một giải thưởng, mà chính là một phần thưởng lớn hơn - một phiên bản tốt hơn của bản thân.',
    },
    {
      image: '/assets/tnth-canva/08-mahsy0vtyai-MAHSy0vtyAI.jpg',
      name: 'BẠN NGUYỄN MINH AN',
      role: 'Thí sinh mùa 2025',
      quote: 'Cuộc thi đã giúp mình nhìn một bài toán thương hiệu bằng tư duy sâu hơn, đồng thời gặp gỡ những người đồng đội đầy cảm hứng.',
    },
    {
      image: '/assets/tnth-canva/07-mahsy0l1pt4-MAHSy0l1pT4.jpg',
      name: '',
      role: '',
      quote: '',
    },
    {
      image: '/assets/tnth-canva/08-mahsy0vtyai-MAHSy0vtyAI.jpg',
      name: '',
      role: '',
      quote: '',
    },
  ],
}

const defaultPartnerVoices: SiteContent['partnerVoices'] = {
  title: 'TẦM NHÌN THƯƠNG HIỆU\nVỚI ĐỐI TÁC',
  slides: defaultVoices.slides.map((slide) => ({ ...slide })),
}

const defaultFooter: SiteContent['footer'] = {
  title: 'Kênh liên hệ:',
  organization: '',
  contact: '',
  footerCardScale: 85,
  footerLogoScale: 220,
  contactFontSize: 18,
  contactNameFontSize: 17,
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

const defaultOrganizerGroup: PartnerGroup = {
  title: 'ĐƠN VỊ TỔ CHỨC',
  logos: [{
    image: '/assets/tnth-canva/organizer-logos-2026.webp',
    name: 'Các đơn vị tổ chức',
  }],
}

const defaultBronzePartnerGroup: PartnerGroup = {
  title: 'NHÀ TÀI TRỢ ĐỒNG',
  logos: [{ image: '', name: 'Logo' }],
}

const defaultGoldPartnerGroup: PartnerGroup = {
  title: 'NHÀ TÀI TRỢ VÀNG',
  logos: Array.from({ length: 2 }, () => ({ image: '', name: 'Logo' })),
}

const defaultStandalonePartnerGroups: PartnerGroup[] = [
  { title: 'BẢO TRỢ CHUYÊN MÔN', logos: Array.from({ length: 7 }, () => ({ image: '', name: 'Logo' })) },
  { title: 'BẢO TRỢ TRUYỀN THÔNG', logos: Array.from({ length: 10 }, () => ({ image: '', name: 'Logo' })) },
  { title: 'ĐỐI TÁC HÌNH ẢNH ĐỘC QUYỀN', logos: [{ image: '', name: 'Logo' }] },
  { title: 'ĐỐI TÁC TRUYỀN THÔNG', logos: Array.from({ length: 8 }, () => ({ image: '', name: 'Logo' })) },
]

type LegacyPartnerLevel = PartnerLevel & { logos?: unknown[] }
type LegacyPartners = SiteContent['partners'] & {
  organizers?: PartnerGroup
  markers?: unknown[]
  levels?: LegacyPartnerLevel[]
}

const normalizePartnerLogo = (value: unknown): PartnerLogo => {
  if (typeof value === 'string') return { image: '', name: value }
  if (typeof value !== 'object' || value === null) return { image: '', name: 'Logo' }
  const logo = value as Record<string, unknown>
  return {
    image: String(logo.image ?? logo.logo ?? ''),
    name: String(logo.name ?? logo.label ?? 'Logo'),
  }
}

const normalizePartnerGroup = (group: PartnerGroup, fallbackTitle: string): PartnerGroup => ({
  title: group.title || fallbackTitle,
  logos: Array.isArray(group.logos) && group.logos.length
    ? group.logos.map(normalizePartnerLogo)
    : [{ image: '', name: 'Logo' }],
})

const normalizeButtonHref = (value: unknown): string => {
  return String(value ?? '').trim()
}

export const normalizeSiteContent = (value: SiteContent): SiteContent => {
  const legacy = value as Partial<SiteContent>
  const legacySettings = value.settings as Partial<SiteSettings>
  const legacyPartners = value.partners as unknown as LegacyPartners
  const { markers: legacyOrganizerMarkers, levels: _legacyLevels, ...partnerContent } = legacyPartners
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
  const normalizedSettings = normalizeSettings(settingsWithRefinedSpacing)
  return {
    ...value,
    meta: {
      ...value.meta,
      editorPassword: value.meta?.editorPassword || '111111',
    },
    assets: {
      ...value.assets,
      globalBackground: value.assets.globalBackground
        ?? value.assets.activitiesBackground
        ?? '/assets/tnth-canva/10-mahsd0narra-MAHSd0NArRA.png',
      heroBackground: value.assets?.heroBackground ?? '',
      heroOrganizations: value.assets?.heroOrganizations ?? '',
      statisticIcon: value.assets?.statisticIcon ?? '',
      compassOverlay: value.assets?.compassOverlay ?? '',
      heroTitleArtwork: value.assets?.heroTitleArtwork ?? '/assets/tnth-canva/06-mahstkk4kow-MAHStKK4Kow.png',
      footerLogo: value.assets?.footerLogo ?? '/assets/tnth-canva/02-magto6-z-j8-MAGto6_z-j8.png',
      footerBackground: value.assets?.footerBackground ?? '/assets/tnth-canva/10-mahsd0narra-MAHSd0NArRA.png',
      aboutGallery: Array.isArray(value.assets?.aboutGallery)
        ? value.assets.aboutGallery
        : Array.from({ length: 6 }, (_, index) => `/assets/tnth-years/${String(index + 1).padStart(2, '0')}.jpg`),
    },
    voices: {
      ...defaultVoices,
      ...(legacy.voices ?? {}),
      title: legacy.voices?.title ?? defaultVoices.title,
      slides: (Array.isArray(legacy.voices?.slides) ? legacy.voices.slides : defaultVoices.slides).map((s) => {
        const image = String(s.image || '')
        const name = String(s.name || '')
        const role = String(s.role || '')
        const quote = String(s.quote || '')
        return name || role || quote ? { image, name, role, quote } : { image }
      }),
    },
    partnerVoices: {
      ...defaultPartnerVoices,
      ...(legacy.partnerVoices ?? {}),
      slides: (Array.isArray(legacy.partnerVoices?.slides) ? legacy.partnerVoices.slides : defaultPartnerVoices.slides).map((slide) => ({ ...slide })),
    },
    hero: {
      ...value.hero,
      tagline: value.hero?.tagline ?? '',
      ctaLabel: String(value.hero?.ctaLabel ?? 'ĐĂNG KÝ NGAY'),
      ctaHref: normalizeButtonHref(value.hero?.ctaHref),
      titleArtworkWidth: Math.min(800, Math.max(120, Number(value.hero?.titleArtworkWidth) || 360)),
      titleArtworkOffsetX: Math.min(300, Math.max(-300, Number.isFinite(Number(value.hero?.titleArtworkOffsetX)) ? Number(value.hero?.titleArtworkOffsetX) : 70)),
      titleArtworkOffsetY: Math.min(300, Math.max(-300, Number.isFinite(Number(value.hero?.titleArtworkOffsetY)) ? Number(value.hero?.titleArtworkOffsetY) : -40)),
    },
    intro: {
      ...value.intro,
      title: value.intro?.title ?? 'BAN TỔ CHỨC',
      subtitle: value.intro?.subtitle ?? 'BAN ĐỐI NGOẠI - HỘI SINH VIÊN - NEU',
      paragraphsHtml: Array.isArray(value.intro?.paragraphsHtml)
        ? value.intro.paragraphsHtml
        : [
            '<strong>Ban Đối Ngoại</strong> là đơn vị trực thuộc <strong>Hội Sinh viên Đại học Kinh tế Quốc Dân</strong> với vai trò tiêu biểu là phụ trách công tác Đối Ngoại cho các sự kiện của <strong>Hội Sinh viên - Đại học Kinh tế Quốc dân</strong>.',
            'Trải qua <strong>20 năm</strong> hoạt động, <strong>Ban Đối Ngoại</strong> đã không ngừng khẳng định vị thế của mình với chuyên môn chính gồm Mời tài trợ, Truyền thông báo chí, góp phần tạo nên thành công cho các chương trình bên trong và ngoài khuôn khổ Đại học.',
            'Với phong thái tự tin chuyên nghiệp, <strong>Ban Đối Ngoại</strong> đã kết nối hàng trăm doanh nghiệp, báo đài với cộng đồng sinh viên, tham gia tổ chức <strong>200+ sự kiện</strong> ... Fanpage của Ban Đối Ngoại đã thu hút được <strong>37000+ lượt theo dõi</strong> từ các bạn sinh viên và các doanh nghiệp, tổ chức, đối tác đồng hành.',
          ],
      ctaLabel: value.intro?.ctaLabel ?? 'TÌM HIỂU THÊM',
      ctaHref: value.intro?.ctaHref ?? 'https://www.facebook.com/bandoingoai.neu',
    },
    about: {
      ...value.about,
      kicker: value.about?.kicker ?? '',
      title: value.about?.title ?? 'TẦM NHÌN THƯƠNG HIỆU',
      description: value.about?.description ?? '<strong>TẦM NHÌN THƯƠNG HIỆU</strong> là cuộc thi giải case study đầu tiên về lĩnh vực <strong>Truyền thông thương hiệu</strong> được đặt nền móng bởi <strong>Ban Đối Ngoại - HSV - NEU</strong> với mục đích kết nối và khai phá tiềm năng sáng tạo của các bạn sinh viên trên địa bàn toàn quốc có niềm đam mê với lĩnh vực <strong>Truyền thông thương hiệu</strong> nói riêng và <strong>Marketing</strong> nói chung.',
      descriptionFontSize: Math.min(40, Math.max(10, Number(value.about?.descriptionFontSize) || 16)),
      imageLabel: value.about?.imageLabel ?? '',
      paragraphsHtml: Array.isArray(value.about?.paragraphsHtml)
        ? value.about.paragraphsHtml
        : [
            'Với lĩnh vực sáng tạo, độc đáo, chủ đề <strong>"TRUYỀN THÔNG THƯƠNG HIỆU"</strong> hứa hẹn sẽ đem lại cho các bạn thí sinh nhiều ý tưởng mới mẻ, đột phá cũng như giúp các Doanh nghiệp tận dụng và khai phá để phát triển thương hiệu của mình.',
            'Sau bốn mùa tổ chức thành công, <strong>TẦM NHÌN THƯƠNG HIỆU CHÍNH THỨC QUAY TRỞ LẠI</strong> vào tháng 9 này, hứa hẹn mang lại giá trị sâu sắc cùng những thử thách đột phá giúp khơi dậy sức sáng tạo trong mỗi thí sinh đến với cuộc thi.',
          ],
      paragraphOneFontSize: Math.min(40, Math.max(10, Number(value.about?.paragraphOneFontSize) || 16)),
      paragraphTwoFontSize: Math.min(40, Math.max(10, Number(value.about?.paragraphTwoFontSize) || 16)),
      statistics: Array.isArray(value.about?.statistics) ? value.about.statistics : [],
    },
    theme: {
      ...value.theme,
      kicker: value.theme?.kicker ?? '',
      title: value.theme?.title ?? '',
      subtitle: value.theme?.subtitle ?? 'ROUND TO UNBOUND',
      quote: value.theme?.quote ?? '',
      paragraphsHtml: Array.isArray(value.theme?.paragraphsHtml) ? value.theme.paragraphsHtml : [],
    },
    rules: {
      ...value.rules,
      cards: value.rules.cards,
    },
    timeline: {
      ...value.timeline,
      rounds: value.timeline.rounds.map((round) => ({
          ...round,
          title: String(round.title ?? ''),
          date: String(round.date ?? ''),
          description: String(round.description ?? ''),
        })),
    },
    customContent: legacy.customContent ?? {
      title: 'NỘI DUNG CHƯƠNG TRÌNH',
      blocks: [
        {
          heading: 'VIRAL CLIP',
          contentHtml: 'Các đội hoàn thiện Viral Clip với nội dung bám sát đề án và chiến dịch truyền thông của đội.',
        },
        {
          heading: 'ĐÊM CHUNG KẾT',
          contentHtml: '<strong>Phần 1:</strong> Top 4 đội thi thuyết trình IMC Plan và trả lời câu hỏi phản biện.\n<strong style="color: #7feeff">Phần 2:</strong> Các đội xử lý minicase và tiến tới phần phản biện trực tiếp.',
        },
      ],
    },
    prizes: value.prizes,
    benefits: value.benefits,
    activities: (() => {
      const activities = value.activities

      return {
        ...activities,
        cards: activities.cards.map((card) => ({
          ...card,
          ctaLabel: String(card.ctaLabel ?? 'TÌM HIỂU THÊM'),
          ctaHref: normalizeButtonHref(card.ctaHref),
        })),
      }
    })(),
    faq: value.faq.map((item) => ({
        question: String(item.question ?? ''),
        answer: String(item.answer ?? ''),
      })),
    partners: {
      ...partnerContent,
      kicker: legacyPartners.kicker ?? '',
      organizerLogoScale: Math.min(200, Math.max(20, Number(legacyPartners.organizerLogoScale) || 80)),
      organizerPaddingTop: Math.min(300, Math.max(0, Number(legacyPartners.organizerPaddingTop) || 0)),
      organizerPaddingBottom: Math.min(300, Math.max(0, Number.isFinite(Number(legacyPartners.organizerPaddingBottom)) ? Number(legacyPartners.organizerPaddingBottom) : 40)),
      organizerPaddingX: Math.min(300, Math.max(0, Number(legacyPartners.organizerPaddingX) || 0)),
      supportGroupsPaddingBottom: Math.min(300, Math.max(0, Number.isFinite(Number(legacyPartners.supportGroupsPaddingBottom)) ? Number(legacyPartners.supportGroupsPaddingBottom) : 64)),
      organizers: (() => {
        const organizerGroup = legacyPartners.organizers
          ? normalizePartnerGroup(legacyPartners.organizers, defaultOrganizerGroup.title)
          : {
              ...defaultOrganizerGroup,
              logos: Array.isArray(legacyOrganizerMarkers) && legacyOrganizerMarkers.length
                ? legacyOrganizerMarkers.map(normalizePartnerLogo)
                : defaultOrganizerGroup.logos.map(normalizePartnerLogo),
            }
        return organizerGroup
      })(),
      supportGroups: (() => {
        if (Array.isArray(legacyPartners.supportGroups)) {
          return legacyPartners.supportGroups.map((group) => normalizePartnerGroup(group, 'NHÓM ĐỐI TÁC'))
        }
        return [defaultGoldPartnerGroup, defaultBronzePartnerGroup, ...defaultStandalonePartnerGroups]
          .map((group) => normalizePartnerGroup(group, group.title))
      })(),
    },
    footer: {
      ...defaultFooter,
      ...(legacy.footer ?? {}),
      footerCardScale: Math.min(100, Math.max(20, Number(legacy.footer?.footerCardScale) || 85)),
      footerLogoScale: Math.min(300, Math.max(100, Number(legacy.footer?.footerLogoScale) || 220)),
      contactFontSize: Math.min(28, Math.max(12, Number(legacy.footer?.contactFontSize) || 18)),
      contactNameFontSize: Math.min(28, Math.max(12, Number(legacy.footer?.contactNameFontSize) || 17)),
      contactLines: Array.isArray(legacy.footer?.contactLines) ? legacy.footer.contactLines : defaultFooter.contactLines,
      socials: (Array.isArray(legacy.footer?.socials) ? legacy.footer.socials : defaultFooter.socials).map((social) => ({
        ...social,
        href: social.href,
      })),
    },
    settings: normalizedSettings,
  }
}

export const loadSiteContent = async (): Promise<SiteContent> => {
  let lastError = new Error('Không thể kết nối API dữ liệu.')

  // Thử lại ngắn khi backend vừa khởi động hoặc đang reload trong môi trường dev.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const apiResponse = await fetch(`/api/site-content?v=${Date.now()}`)
      if (apiResponse.ok) {
        const serverData = await apiResponse.json() as unknown
        if (isSiteContent(serverData)) {
          return normalizeSiteContent(serverData)
        }

        throw new Error('Dữ liệu máy chủ không đúng cấu trúc website.')
      }

      const errorResponse = await apiResponse.json().catch(() => null) as { message?: string } | null
      lastError = new Error(errorResponse?.message || 'Không thể tải cấu hình từ cơ sở dữ liệu.')
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Không thể kết nối API dữ liệu.')
    }

    if (attempt < 2) {
      await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)))
    }
  }

  throw lastError
}
