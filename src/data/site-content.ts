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
  'prizes', 'benefits', 'activities', 'partners', 'faq', 'footer',
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
      heroOrganizations: value.assets.heroOrganizations.endsWith('04-magucn8vs0s-MAGucN8vS0s.png')
        ? '/assets/tnth-canva/04-organizations-transparent-v2.png'
        : value.assets.heroOrganizations,
      statisticIcon: value.assets.statisticIcon.endsWith('02-magto6-z-j8-MAGto6_z-j8.png')
        ? '/assets/tnth-canva/03-mahsv-hibxi-MAHSv-hIBxI.png'
        : value.assets.statisticIcon,
      heroTitleArtwork: value.assets.heroTitleArtwork || '/assets/tnth-canva/06-mahstkk4kow-MAHStKK4Kow.png',
      footerLogo: value.assets.footerLogo || '/assets/tnth-canva/02-magto6-z-j8-MAGto6_z-j8.png',
      footerBackground: value.assets.footerBackground || '/assets/tnth-canva/10-mahsd0narra-MAHSd0NArRA.png',
      aboutGallery: value.assets.aboutGallery?.length
        ? value.assets.aboutGallery
        : Array.from({ length: 6 }, (_, index) => `/assets/tnth-years/${String(index + 1).padStart(2, '0')}.jpg`),
    },
    voices: {
      ...defaultVoices,
      ...(legacy.voices ?? {}),
      slides: legacy.voices?.slides?.length ? legacy.voices.slides : defaultVoices.slides,
    },
    hero: {
      ...value.hero,
      tagline: value.hero.tagline.trim().toUpperCase() === 'ROUND TO UNBOUND' ? '' : value.hero.tagline,
    },
    intro: {
      ...value.intro,
      paragraphsHtml: value.intro.paragraphsHtml.map((paragraph) => paragraph
        .replace('<strong>19 năm</strong>', '<strong>20 năm</strong>')
        .replace('<strong>36.000+ lượt theo dõi</strong>', '<strong>37000+ lượt theo dõi</strong>')
        .replace('<strong>200+ sự kiện</strong>. Fanpage', '<strong>200+ sự kiện</strong>... Fanpage')),
    },
    about: {
      ...value.about,
      kicker: value.about.kicker.trim().toUpperCase() === 'ROUND TO UNBOUND' ? '' : value.about.kicker,
    },
    theme: {
      ...value.theme,
      kicker: value.theme.kicker.trim().toUpperCase() === 'TẦM NHÌN THƯƠNG HIỆU 2026' ? '' : value.theme.kicker,
      title: value.theme.title.trim().toUpperCase() === 'CHỦ ĐỀ: ROUND TO UNBOUND'
        ? 'CHỦ ĐỀ TẦM NHÌN THƯƠNG HIỆU 2026'
        : value.theme.title,
      subtitle: value.theme.subtitle || 'ROUND TO UNBOUND',
      quote: value.theme.quote.toLocaleLowerCase('vi-VN').includes('la bàn vận mệnh') ? '' : value.theme.quote,
      paragraphsHtml: value.theme.paragraphsHtml[0]?.startsWith('Thế giới từng kẹt')
        ? [
            'Giữa trung tâm đầy hỗn mang của một thế giới công nghệ số, tồn tại một Chiếc la bàn vận mệnh từng định hướng mọi kết nối và duy trì nhịp vận hành của cả thế giới. Thế nhưng, vào khoảnh khắc nó ngừng xoay, mọi tín hiệu bắt đầu rối loạn, mọi chuyển động mắc kẹt trong những vòng lặp vô định, đẩy thành phố vào trạng thái hỗn mang chưa từng có. Muốn phá vỡ thế bế tắc ấy, cần những người đủ bản lĩnh tiến thẳng đến lõi của cỗ máy, chạm tay vào từng bánh răng và khởi động lại nhịp xoay của tương lai.',
            'Mang trong mình tinh thần ấy, <strong>ROUND TO UNBOUND</strong> chính là hành trình của những Marketers dũng cảm trên con đường thoát khỏi giới hạn do chính kỷ nguyên số vô thức tạo nên. Họ lần theo những giá trị tưởng chừng quen thuộc, giải mã những tín hiệu từng bị bỏ quên và kết nối những khả năng chưa từng giao thoa để xoay chuyển Chiếc la bàn vận mệnh. Nhưng tái khởi động cỗ máy chưa bao giờ là đích đến cuối cùng. Điều thực sự được quyết định nằm ở cách họ tạo nên những điểm chạm mới, mở rộng không gian sáng tạo và kiến tạo những quỹ đạo phát triển mới cho Truyền thông Thương hiệu trong tương lai.',
          ]
        : value.theme.paragraphsHtml,
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
      rounds: value.timeline.rounds.some((round) => round.title === 'Vòng 1: Online Test' || round.description.startsWith('Top 27 đội thi xuất sắc nhất'))
        ? [
            { title: 'Vòng Khởi động: Brand Kickstart', date: '02/09 – 05/09', description: 'Vòng thi warm up cho chương trình nhằm tăng độ nhận diện cho Cuộc thi, kèm theo đó sẽ đáp ứng đề bài NTT Ra Đề. Thí sinh trình bày đề án dưới dạng 3-Page Proposal, từ đó chọn ra Top 2 xuất sắc nhất đi thẳng vào Vòng 2: Brand Campaign.' },
            { title: 'Vòng 1: Brand Insight', date: '27/09 – 02/10', description: 'Từ đề bài, các đội thi hoàn thành bài đánh giá tổng quan thị trường, tình hình thương hiệu, chân dung khách hàng mục tiêu và mục tiêu tổng quát về chiến dịch truyền thông cho thương hiệu của mình. Thí sinh trình bày đề án dưới dạng 10-Page Proposal.' },
            { title: 'Vòng 2: Brand Campaign', date: '09/10 – 14/10', description: 'Top 27 xuất sắc nhất sẽ có cơ hội bước vào Vòng 3 và tiếp tục hoàn thiện đề án kế hoạch truyền thông tích hợp của Doanh nghiệp.' },
            { title: 'Chung kết: Grand Finale', date: '05/11', description: 'HOÀN THIỆN ĐỀ ÁN\nTop 4 đội thi sẽ làm việc với Mentors để hoàn thiện kế hoạch truyền thông tích hợp đã thực hiện trong phạm vi cho phép. Đồng thời thực hiện 1 TVC thể hiện được kế hoạch truyền thông đó.\n\nPHẦN ĐỘI THI ĐƯỢC YÊU THÍCH NHẤT\nBGK chấm script, TVC đăng tải lên Fanpage Tầm Nhìn Thương Hiệu và tính điểm theo lượng tương tác để giành giải đội thi được yêu thích nhất. Điểm phần thi này sẽ nằm trong đề án.\n\nĐÊM CHUNG KẾT\nPhần 1: Top 4 đội thi bước vào Chung kết, trình bày đề án hoàn thiện và trả lời các câu hỏi từ Ban Giám Khảo.\nPhần 2: Top 4 đội thi tiếp tục tham gia giải minicase đã được BTC gửi trong 24h trước đêm Chung kết và phản biện với đội còn lại.' },
          ]
        : value.timeline.rounds,
    },
    prizes: /^50\.000\.000|^1XX|^XX/.test(`${value.prizes.totalValue}${value.prizes.cards[0]?.value ?? ''}`)
      ? {
          ...value.prizes,
          totalValue: '18.000.000 ĐỒNG',
          cards: [
            { title: 'QUÁN QUÂN', value: '8.000.000 ĐỒNG', benefits: ['01 đội Quán quân'] },
            { title: 'Á QUÂN', value: '5.000.000 ĐỒNG', benefits: ['01 đội Á quân'] },
            { title: 'QUÝ QUÂN', value: '2.000.000 ĐỒNG/ĐỘI', benefits: ['02 đội Quý quân'] },
            { title: 'ĐỘI ĐƯỢC YÊU THÍCH NHẤT', value: '1.000.000 ĐỒNG', benefits: ['01 giải thưởng'] },
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
    activities: value.activities.cards.length < 4
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
      : value.activities,
    faq: value.faq.length < 5 || value.faq.some((item) => item.question === 'BTC có hỗ trợ thí sinh ghép đội không?' && item.answer.startsWith('Có.'))
      ? [
          { question: 'Thí sinh đăng ký tham gia cuộc thi có cần phải đóng lệ phí không?', answer: 'Không. Thí sinh không cần đóng bất kỳ khoản lệ phí nào khi đăng ký tham gia cuộc thi.' },
          { question: 'BTC có hỗ trợ thí sinh ghép đội không?', answer: 'Không. Ban Tổ chức không hỗ trợ ghép đội. Thí sinh cần chủ động tìm kiếm và thành lập đội thi trước khi đăng ký.' },
          { question: 'Khi nào đội thi được xác nhận đăng ký thành công?', answer: 'Đội thi sẽ nhận được email xác nhận đăng ký thành công từ Ban Tổ chức trong vòng 24 giờ kể từ khi hoàn tất đăng ký và thông tin được kiểm tra, xác nhận hợp lệ.' },
          { question: 'Thí sinh lọt top bao nhiêu sẽ nhận được Certificate?', answer: 'Certificate sẽ được trao cho Top 25 đội thi của Vòng 1 và Top 2 đội thi của Vòng Khởi động.' },
          { question: 'Nếu gặp sự cố trong quá trình tham gia thi, đội thi cần làm gì?', answer: 'Trong trường hợp gặp bất kỳ sự cố gì hoặc cần hỗ trợ trong quá trình tham gia cuộc thi, đội thi vui lòng liên hệ Ban Tổ chức qua Fanpage cuộc thi.' },
        ]
      : value.faq,
    partners: {
      ...value.partners,
      kicker: '',
    },
    footer: {
      ...defaultFooter,
      ...(legacy.footer ?? {}),
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
