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
  'hero', 'intro', 'about', 'metrics', 'voices', 'theme', 'rules', 'timeline', 'customContent',
  'prizes', 'benefits', 'activities', 'partners', 'faq', 'footer',
]

export const contentSectionOrder: SectionKey[] = sectionKeys.filter((key) => key !== 'hero')

const makeSectionSettings = (overrides: Partial<SectionSettings> = {}): SectionSettings => ({
  enabled: true,
  contentFontSize: 16,
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
    theme: makeSectionSettings(),
    rules: makeSectionSettings(),
    timeline: makeSectionSettings(),
    customContent: makeSectionSettings({ enabled: false, containerWidth: 1040, contentAlign: 'left' }),
    prizes: makeSectionSettings(),
    benefits: makeSectionSettings(),
    activities: makeSectionSettings(),
    faq: makeSectionSettings({ paddingTop: 48, paddingBottom: 54 }),
    partners: makeSectionSettings({ paddingTop: 52, paddingBottom: 52 }),
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
      role: 'Giám khảo',
      quote: 'Tầm Nhìn Thương Hiệu là một hành trình để người trẻ thử sức, kết nối và biến góc nhìn thương hiệu thành giải pháp thực tế.',
    },
    {
      image: '/assets/tnth-canva/08-mahsy0vtyai-MAHSy0vtyAI.jpg',
      name: 'BẠN NGUYỄN MINH AN',
      role: 'Thí sinh mùa 2025',
      quote: 'Cuộc thi đã giúp mình nhìn một bài toán thương hiệu bằng tư duy sâu hơn, đồng thời gặp gỡ những người đồng đội đầy cảm hứng.',
    },
  ],
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

const officialTimelineDates = ['2/9 – 5/9', '27/9 – 2/10', '9/10 – 14/10', '5/11']

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
  if (normalizedSettings.sections.hero.overlayOpacity === 0.15) {
    normalizedSettings.sections.hero.overlayOpacity = 0.05
  }
  return {
    ...value,
    meta: {
      ...value.meta,
      editorPassword: value.meta?.editorPassword || '111111',
    },
    assets: {
      ...value.assets,
      globalBackground: value.assets.globalBackground
        || value.assets.activitiesBackground
        || '/assets/tnth-canva/10-mahsd0narra-MAHSd0NArRA.png',
      heroBackground: !value.assets.globalBackground && String(value.assets?.heroBackground ?? '').endsWith('10-mahsd0narra-MAHSd0NArRA.png')
        ? '/assets/tnth-canva/01-mahscd5rwcc-MAHScd5RwCc.png'
        : (value.assets?.heroBackground || ''),
      heroOrganizations: String(value.assets?.heroOrganizations ?? '').endsWith('04-magucn8vs0s-MAGucN8vS0s.png')
        ? '/assets/tnth-canva/04-organizations-transparent-v2.png'
        : (value.assets?.heroOrganizations || ''),
      statisticIcon: String(value.assets?.statisticIcon ?? '').endsWith('02-magto6-z-j8-MAGto6_z-j8.png')
        ? '/assets/tnth-canva/03-mahsv-hibxi-MAHSv-hIBxI.png'
        : (value.assets?.statisticIcon || ''),
      compassOverlay: String(value.assets?.compassOverlay ?? '').endsWith('11-mahsv9hppfa-MAHSv9HpPfA.png')
        ? '/assets/tnth-compass-blue-silver.png'
        : (value.assets?.compassOverlay || ''),
      heroTitleArtwork: value.assets?.heroTitleArtwork || '/assets/tnth-canva/06-mahstkk4kow-MAHStKK4Kow.png',
      footerLogo: value.assets?.footerLogo || '/assets/tnth-canva/02-magto6-z-j8-MAGto6_z-j8.png',
      footerBackground: value.assets?.footerBackground || '/assets/tnth-canva/10-mahsd0narra-MAHSd0NArRA.png',
      aboutGallery: value.assets?.aboutGallery?.length
        ? value.assets.aboutGallery
        : Array.from({ length: 6 }, (_, index) => `/assets/tnth-years/${String(index + 1).padStart(2, '0')}.jpg`),
    },
    voices: {
      ...defaultVoices,
      ...(legacy.voices ?? {}),
      title: (legacy.voices?.title || defaultVoices.title).replace('2026', '2025'),
      slides: (legacy.voices?.slides?.length ? legacy.voices.slides : defaultVoices.slides).map((s) => ({
        ...s,
        role: String(s.role || '').replace('2026', '2025'),
      })),
    },
    hero: {
      ...value.hero,
      tagline: String(value.hero?.tagline ?? '').trim().toUpperCase() === 'ROUND TO UNBOUND' ? '' : (value.hero?.tagline || ''),
    },
    intro: {
      ...value.intro,
      title: value.intro?.title || 'BAN TỔ CHỨC',
      subtitle: value.intro?.subtitle || 'BAN ĐỐI NGOẠI - HỘI SINH VIÊN - NEU',
      paragraphsHtml: [
        '<strong>Ban Đối Ngoại</strong> là đơn vị trực thuộc <strong>Hội Sinh viên Đại học Kinh tế Quốc Dân</strong> với vai trò tiêu biểu là phụ trách công tác Đối Ngoại cho các sự kiện của <strong>Hội Sinh viên - Đại học Kinh tế Quốc dân</strong>.',
        'Trải qua <strong>20 năm</strong> hoạt động, <strong>Ban Đối Ngoại</strong> đã không ngừng khẳng định vị thế của mình với chuyên môn chính gồm Mời tài trợ, Truyền thông báo chí, góp phần tạo nên thành công cho các chương trình bên trong và ngoài khuôn khổ Đại học.',
        'Với phong thái tự tin chuyên nghiệp, <strong>Ban Đối Ngoại</strong> đã kết nối hàng trăm doanh nghiệp, báo đài với cộng đồng sinh viên, tham gia tổ chức <strong>200+ sự kiện</strong> ... Fanpage của Ban Đối Ngoại đã thu hút được <strong>37000+ lượt theo dõi</strong> từ các bạn sinh viên và các doanh nghiệp, tổ chức, đối tác đồng hành.',
      ],
      ctaLabel: 'TÌM HIỂU THÊM',
      ctaHref: 'https://www.facebook.com/bandoingoai.neu',
    },
    about: {
      ...value.about,
      kicker: String(value.about?.kicker ?? '').trim().toUpperCase() === 'ROUND TO UNBOUND' ? '' : (value.about?.kicker || ''),
      title: value.about?.title || 'TẦM NHÌN THƯƠNG HIỆU',
      description: '<strong>TẦM NHÌN THƯƠNG HIỆU</strong> là cuộc thi giải case study đầu tiên về lĩnh vực <strong>Truyền thông thương hiệu</strong> được đặt nền móng bởi <strong>Ban Đối Ngoại - HSV - NEU</strong> với mục đích kết nối và khai phá tiềm năng sáng tạo của các bạn sinh viên trên địa bàn toàn quốc có niềm đam mê với lĩnh vực <strong>Truyền thông thương hiệu</strong> nói riêng và <strong>Marketing</strong> nói chung.',
      imageLabel: '',
      paragraphsHtml: [
        'Với lĩnh vực sáng tạo, độc đáo, chủ đề <strong>"TRUYỀN THÔNG THƯƠNG HIỆU"</strong> hứa hẹn sẽ đem lại cho các bạn thí sinh nhiều ý tưởng mới mẻ, đột phá cũng như giúp các Doanh nghiệp tận dụng và khai phá để phát triển thương hiệu của mình.',
        'Sau bốn mùa tổ chức thành công, <strong>TẦM NHÌN THƯƠNG HIỆU CHÍNH THỨC QUAY TRỞ LẠI</strong> vào tháng 9 này, hứa hẹn mang lại giá trị sâu sắc cùng những thử thách đột phá giúp khơi dậy sức sáng tạo trong mỗi thí sinh đến với cuộc thi.',
      ],
      statistics: [
        { value: '2.000+', label: 'Thí sinh tham dự' },
        { value: '700+', label: 'Đội thi đăng ký' },
        { value: '60+', label: 'Trường Đại học, Cao đẳng trên cả nước' },
        { value: '1.000.000+', label: 'Lượt tiếp cận trên các nền tảng trực tuyến' },
        { value: '70+', label: 'Doanh nghiệp đối tác tiêu biểu' },
        { value: '70+', label: 'Bài báo mạng và các đơn vị truyền thông uy tín' },
      ],
    },
    theme: {
      ...value.theme,
      kicker: String(value.theme?.kicker ?? '').trim().toUpperCase() === 'TẦM NHÌN THƯƠNG HIỆU 2026' ? '' : (value.theme?.kicker || ''),
      title: String(value.theme?.title ?? '').trim().toUpperCase() === 'CHỦ ĐỀ: ROUND TO UNBOUND'
        ? 'CHỦ ĐỀ\nTẦM NHÌN THƯƠNG HIỆU 2026'
        : (value.theme?.title || ''),
      subtitle: value.theme?.subtitle || 'ROUND TO UNBOUND',
      quote: String(value.theme?.quote ?? '').toLocaleLowerCase('vi-VN').includes('la bàn vận mệnh') ? '' : (value.theme?.quote || ''),
      paragraphsHtml: [
        'Giữa trung tâm đầy hỗn mang của thế giới công nghệ số, tồn tại một <strong>Chiếc la bàn vận mệnh</strong> định hướng mọi kết nối và duy trì nhịp vận hành của cả thế giới. Thế nhưng, vào khoảnh khắc nó ngừng xoay, mọi tín hiệu dần biến mất, mọi chuyển động mắc kẹt trong những vòng lặp vô định, đẩy thành phố vào trạng thái rối loạn chưa từng có. Muốn phá vỡ thế bế tắc ấy, cần những người đủ bản lĩnh tiến thẳng đến lõi của cỗ máy, chạm tay vào từng bánh răng và <strong>khởi động lại nhịp xoay của tương lai</strong>.',
        'Mang trong mình tinh thần của các chiến binh, <strong>ROUND TO UNBOUND</strong> chính là hành trình của những <strong>Marketers</strong> dũng cảm trên con đường thoát khỏi giới hạn do chính kỷ nguyên số vô thức tạo nên. Họ lần theo những giá trị tưởng chừng quen thuộc, giải mã những tín hiệu từng bị bỏ quên và kết nối những khả năng vốn rời rạc để xoay chuyển <strong>Chiếc la bàn vận mệnh</strong>. Nhưng tái khởi động cỗ máy chưa bao giờ là đích đến cuối cùng. Bởi phía trước không chỉ là những giới hạn cần được phá vỡ, mà còn là những không gian mới đang chờ được mở ra. Tại <strong>Tầm Nhìn Thương Hiệu 2026</strong>, mỗi thí sinh được trao cơ hội mở ra một góc nhìn mới, tạo nên những điểm chạm khác biệt và kiến tạo những quỹ đạo mới cho <strong>Truyền thông Thương hiệu</strong>. Nếu đã sẵn sàng, đây chính là lúc để bạn cất lên tiếng nói và tạo ra những con đường mới cho hành trình của chính mình.',
      ],
    },
    rules: {
      ...value.rules,
      cards: value.rules.cards.some((card) => card.items.includes('Thành viên Ban Tổ chức của Tầm Nhìn Thương Hiệu 2025.'))
        ? [
            { title: 'ĐỐI TƯỢNG THAM GIA', items: ['Sinh viên đang theo học tại các trường Đại học, Cao đẳng trên địa bàn toàn quốc.', 'Độ tuổi từ 18–24 tuổi; đã tốt nghiệp THPT hoặc vừa tốt nghiệp Đại học, Cao đẳng trong vòng 06 tháng.'] },
            { title: 'ĐỐI TƯỢNG KHÔNG ĐƯỢC THAM GIA', items: ['Thành viên Ban Giám khảo, Ban Cố vấn và Diễn giả của cuộc thi.', 'Thí sinh dự thi Chung kết Tầm Nhìn Thương Hiệu 2025.', 'Thành viên Ban Tổ chức Tầm Nhìn Thương Hiệu 2025.', 'Thành viên Ban Tổ chức Tầm Nhìn Thương Hiệu 2026.'] },
            { title: 'HÌNH THỨC DỰ THI', items: ['Thí sinh đăng ký dự thi theo đội với số lượng 03 người/đội.', 'Mỗi thí sinh chỉ được đăng ký dự thi với 01 đội duy nhất.'] },
          ]
        : value.rules.cards,
    },
    timeline: {
      ...value.timeline,
      rounds: (value.timeline.rounds.some((round) => round.title === 'Vòng 1: Online Test' || String(round.description ?? '').startsWith('Top 27 đội thi xuất sắc nhất'))
        ? [
            { title: 'Vòng Khởi động: Brand Kickstart', date: '02/09 – 05/09', description: 'Vòng thi warm up cho chương trình nhằm tăng độ nhận diện cho Cuộc thi, kèm theo đó sẽ đáp ứng đề bài NTT Ra Đề. Thí sinh trình bày đề án dưới dạng 3-Page Proposal, từ đó chọn ra Top 2 xuất sắc nhất đi thẳng vào Vòng 2: Brand Campaign.' },
            { title: 'Vòng 1: Brand Insight', date: '27/09 – 02/10', description: 'Từ đề bài, các đội thi hoàn thành bài đánh giá tổng quan thị trường, tình hình thương hiệu, chân dung khách hàng mục tiêu và mục tiêu tổng quát về chiến dịch truyền thông cho thương hiệu của mình. Thí sinh trình bày đề án dưới dạng 10-Page Proposal.' },
            { title: 'Vòng 2: Brand Campaign', date: '09/10 – 14/10', description: 'Top 27 xuất sắc nhất sẽ có cơ hội bước vào Vòng 3 và tiếp tục hoàn thiện đề án kế hoạch truyền thông tích hợp của Doanh nghiệp.' },
            { title: 'Vòng Chung kết: Grand Finale', date: '05/11', description: 'VIRAL CLIP\nCác đội hoàn thiện 01 Viral Clip với nội dung bám sát đề án và chiến dịch truyền thông của đội. BTC sẽ đăng tải sản phẩm lên Fanpage và Website chính thức của cuộc thi để thực hiện phần bình chọn công khai.\n\nĐÊM CHUNG KẾT\nPhần 1: Top 4 đội thi thuyết trình IMC Plan và trả lời câu hỏi phản biện từ Ban Giám khảo.\nPhần 2: Các đội nhận 01 minicase từ BTC trong 24 giờ trước Đêm Chung kết; tại sân khấu, Top 4 trình bày kế hoạch giải quyết tình huống và tham gia phản biện trực tiếp.' },
          ]
        : value.timeline.rounds).map((round, index) => ({
          ...round,
          title: String(round.title ?? ''),
          date: String(officialTimelineDates[index] ?? round.date ?? ''),
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
    prizes: /^50\.000\.000|^1XX|^XX/.test(`${value.prizes.totalValue}${value.prizes.cards[0]?.value ?? ''}`)
      ? {
          ...value.prizes,
          totalValue: '18.000.000 ĐỒNG',
          cards: [
            { title: 'QUÁN QUÂN', value: '8.000.000 ĐỒNG', benefits: ['01 đội Quán quân'] },
            { title: 'Á QUÂN', value: '5.000.000 ĐỒNG', benefits: ['01 đội Á quân'] },
            { title: 'QUÝ QUÂN', value: '2.000.000 ĐỒNG/ĐỘI', benefits: ['02 đội Quý quân'] },
            { title: 'ĐỘI ĐƯỢC YÊU THÍCH NHẤT', value: '1.000.000 ĐỒNG', benefits: ['01 đội'] },
          ],
        }
      : value.prizes,
    benefits: value.benefits.groups.some((group) => group.items.includes('Thí sinh cam kết các thông tin cung cấp là chính xác và tuân thủ pháp luật.'))
      ? {
          ...value.benefits,
          groups: [
            { title: 'QUY ĐỊNH CHUNG', items: ['BTC có quyền điều chỉnh thể lệ, thời gian và nội dung các vòng thi cũng như hoạt động bên lề trong trường hợp cần thiết, và sẽ thông báo đến thí sinh ít nhất 24 giờ trước khi áp dụng thay đổi.', 'BTC có quyền cung cấp bài thi của thí sinh đến Ban Giám khảo, các đơn vị Bảo trợ Chuyên môn và Nhà tài trợ.', 'BTC có quyền sử dụng thông tin và hình ảnh thí sinh nhằm mục đích quảng bá cuộc thi, trong phạm vi phù hợp và không vi phạm pháp luật.', 'BTC có quyền hủy bỏ kết quả của đội thi nếu phát hiện hành vi gian lận, chống đối hoặc không hợp tác trong quá trình dự thi.', 'BTC có trách nhiệm giải quyết kiến nghị, khiếu nại, đảm bảo quyền lợi chính đáng của thí sinh một cách khách quan, công bằng và minh bạch. Quyết định của BTC là quyết định cuối cùng.', 'BTC cam kết trao đầy đủ giải thưởng cho thí sinh theo đúng nội dung trong thể lệ.'] },
            { title: 'QUYỀN LỢI THÍ SINH', items: ['Có cơ hội vận dụng kiến thức chuyên môn để giải quyết các bài toán thực tế từ thương hiệu.', 'Cơ hội mở rộng kiến thức, kết nối đa chiều qua chuỗi sự kiện Webinar, Information Day và Training Day, với sự đồng hành của các doanh nghiệp uy tín, các đơn vị đào tạo chuyên môn và đội ngũ giảng viên NEU.', 'Có cơ hội mở rộng tư duy, nâng tầm hiểu biết cùng chuỗi Training Day dành riêng cho các thí sinh.', 'Top 27 đội thi tham gia Vòng 2: IMC Plan sẽ nhận được đánh giá chi tiết từ đội ngũ ban giám khảo – những chuyên gia đầu ngành Truyền thông thương hiệu.', 'Top 4 chung cuộc sẽ nhận được sự đồng hành hướng dẫn từ các Mentor giàu kinh nghiệm chuyên môn.', 'Cơ cấu giải thưởng hấp dẫn cùng nhiều phần quà giá trị từ Ban Tổ chức và các đơn vị doanh nghiệp đồng hành.'] },
          ],
        }
      : value.benefits,
    activities: (value.activities.cards.length < 4
      ? {
          ...value.activities,
          kicker: '',
          cards: [
            { title: 'WEBINAR', date: '28/08', description: 'Hoạt động chia sẻ kiến thức Marketing chuyên sâu, tạo cơ hội kết nối người tham gia với các diễn giả và góp phần thu hút sự quan tâm của các thí sinh tiềm năng.', ctaLabel: 'RECAP HOẠT ĐỘNG', ctaHref: value.activities.cards[0]?.ctaHref || '#' },
            { title: 'INFORMATION DAY', date: '18/09', description: 'Cung cấp thông tin toàn diện về cuộc thi, đồng thời mang đến những chia sẻ và lời khuyên từ các chuyên gia Marketing, giúp thí sinh chuẩn bị tốt cho Vòng 1.', ctaLabel: 'ĐĂNG KÝ NGAY', ctaHref: value.activities.cards[1]?.ctaHref || '#register' },
            { title: 'TRAINING DAY 1', date: '28/09', description: 'Các đội thi được trau dồi thêm kiến thức và kỹ năng cần thiết cho Vòng 1.', ctaLabel: 'TÌM HIỂU THÊM', ctaHref: '#' },
            { title: 'TRAINING DAY 2', date: '10/10', description: 'TOP 27 đội thi vượt qua Vòng 1 được huấn luyện kỹ năng chuyên sâu, chuẩn bị hành trang cho Vòng 2.', ctaLabel: 'TÌM HIỂU THÊM', ctaHref: '#' },
          ],
        }
      : value.activities),
    faq: (value.faq.length < 5 || value.faq.some((item) => item.question === 'BTC có hỗ trợ thí sinh ghép đội không?' && String(item.answer ?? '').startsWith('Có.'))
      ? [
          { question: 'Thí sinh đăng ký tham gia cuộc thi có cần phải đóng lệ phí không?', answer: 'Không. Thí sinh không cần đóng bất kỳ khoản lệ phí nào khi đăng ký tham gia cuộc thi.' },
          { question: 'BTC có hỗ trợ thí sinh ghép đội không?', answer: 'Không. Ban Tổ chức không hỗ trợ ghép đội. Thí sinh cần chủ động tìm kiếm và thành lập đội thi trước khi đăng ký.' },
          { question: 'Khi nào đội thi được xác nhận đăng ký thành công?', answer: 'Đội thi sẽ nhận được email xác nhận đăng ký thành công từ Ban Tổ chức trong vòng 24 giờ kể từ khi hoàn tất đăng ký và thông tin được kiểm tra, xác nhận hợp lệ.' },
          { question: 'Thí sinh lọt top bao nhiêu sẽ nhận được Certificate?', answer: 'Certificate sẽ được trao cho Top 25 đội thi của Vòng 1 và Top 2 đội thi của Vòng Khởi động.' },
          { question: 'Nếu gặp sự cố trong quá trình tham gia thi, đội thi cần làm gì?', answer: 'Trong trường hợp gặp bất kỳ sự cố gì hoặc cần hỗ trợ trong quá trình tham gia cuộc thi, đội thi vui lòng liên hệ Ban Tổ chức qua Fanpage cuộc thi.' },
        ]
      : value.faq).map((item) => ({
        question: String(item.question ?? ''),
        answer: String(item.answer ?? ''),
      })),
    partners: {
      ...partnerContent,
      kicker: '',
      organizerLogoScale: Math.min(200, Math.max(20, Number(legacyPartners.organizerLogoScale) || 80)),
      organizers: (() => {
        const organizerGroup = legacyPartners.organizers
          ? normalizePartnerGroup(legacyPartners.organizers, defaultOrganizerGroup.title)
          : {
              ...defaultOrganizerGroup,
              logos: Array.isArray(legacyOrganizerMarkers) && legacyOrganizerMarkers.length
                ? legacyOrganizerMarkers.map(normalizePartnerLogo)
                : defaultOrganizerGroup.logos.map(normalizePartnerLogo),
            }
        const isLegacyLogoBanner = organizerGroup.logos.length === 1
          && String(organizerGroup.logos[0]?.image ?? '').endsWith('/04-organizations-transparent-v2.png')
        const isEmptyOrganizerPlaceholders = organizerGroup.logos.length > 0
          && organizerGroup.logos.every((logo) => !String(logo?.image ?? '').trim())
        return isLegacyLogoBanner || isEmptyOrganizerPlaceholders
          ? { ...defaultOrganizerGroup, logos: defaultOrganizerGroup.logos.map(normalizePartnerLogo) }
          : organizerGroup
      })(),
      supportGroups: (() => {
        const groups = (legacyPartners.supportGroups ?? [])
          .map((group) => normalizePartnerGroup(group, 'NHÓM ĐỐI TÁC'))
        const normalizedTitle = (group: PartnerGroup) => String(group.title ?? '').trim().toLocaleUpperCase('vi-VN')
        const defaultGroups = [defaultGoldPartnerGroup, defaultBronzePartnerGroup, ...defaultStandalonePartnerGroups]
        const defaultTitles = new Set(defaultGroups.map(normalizedTitle))
        const knownGroups = defaultGroups.map((defaultGroup) => {
          const matchingGroup = groups.find((group) => (
            normalizedTitle(group) === normalizedTitle(defaultGroup)
          ))
          return matchingGroup ?? normalizePartnerGroup(defaultGroup, defaultGroup.title)
        })
        const customGroups = groups.filter((group) => !defaultTitles.has(normalizedTitle(group)))
        return [
          ...knownGroups,
          ...customGroups,
        ]
      })(),
    },
    footer: {
      ...defaultFooter,
      ...(legacy.footer ?? {}),
      footerCardScale: Math.min(100, Math.max(20, Number(legacy.footer?.footerCardScale) || 85)),
      footerLogoScale: Math.min(300, Math.max(100, Number(legacy.footer?.footerLogoScale) || 220)),
      contactFontSize: Math.min(28, Math.max(12, Number(legacy.footer?.contactFontSize) || 18)),
      contactNameFontSize: Math.min(28, Math.max(12, Number(legacy.footer?.contactNameFontSize) || 17)),
      contactLines: legacy.footer?.contactLines?.length ? legacy.footer.contactLines : defaultFooter.contactLines,
      socials: (legacy.footer?.socials?.length ? legacy.footer.socials : defaultFooter.socials).map((social, index) => ({
        ...social,
        href: social.href === '#'
          ? [
              'https://www.facebook.com/tamnhinthuonghieu.neu',
              'https://www.facebook.com/groups/403557561880905/',
              'https://www.tiktok.com/@tamnhinthuonghieu_neu',
            ][index] || social.href
          : social.href,
      })),
    },
    settings: normalizedSettings,
  }
}

export const loadSiteContent = async (): Promise<SiteContent> => {
  let lastError = new Error('Không thể kết nối API SQLite.')

  // Thử lại ngắn khi backend vừa khởi động hoặc đang reload trong môi trường dev.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const apiResponse = await fetch(`/api/site-content?v=${Date.now()}`)
      if (apiResponse.ok) {
        const serverData = await apiResponse.json() as unknown
        if (isSiteContent(serverData)) {
          return normalizeSiteContent(serverData)
        }

        throw new Error('Dữ liệu SQLite không đúng cấu trúc website.')
      }

      const errorResponse = await apiResponse.json().catch(() => null) as { message?: string } | null
      lastError = new Error(errorResponse?.message || 'Không thể tải cấu hình từ SQLite.')
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Không thể kết nối API SQLite.')
    }

    if (attempt < 2) {
      await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)))
    }
  }

  throw lastError
}
