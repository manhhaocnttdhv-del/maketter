export interface CompetitionContent {
  organizer: string
  navigation: [string, string, string, string, string, string]
  titleLineOne: string
  titleLineTwo: string
  edition: string
  tagline: string
  cta: string
  eventDate: string
}

export const defaultCompetitionContent: CompetitionContent = {
  organizer: 'BAN TỔ CHỨC',
  navigation: ['Ban Tổ Chức', 'Giới thiệu', 'Thể lệ', 'Giải thưởng', 'Đối tác đồng hành', 'Liên hệ'],
  titleLineOne: 'TẦM NHÌN',
  titleLineTwo: 'THƯƠNG HIỆU',
  edition: '2026',
  tagline: 'ROUND TO UNBOUND',
  cta: 'ĐĂNG KÝ NGAY',
  eventDate: '2026-09-29T23:59',
}

const storageKey = 'maketter:tntn-2026'

export const cloneCompetitionContent = (): CompetitionContent =>
  JSON.parse(JSON.stringify(defaultCompetitionContent)) as CompetitionContent

export const loadCompetitionContent = (): CompetitionContent => {
  const fallback = cloneCompetitionContent()
  const saved = localStorage.getItem(storageKey)

  if (!saved) return fallback

  try {
    const parsed = JSON.parse(saved) as Partial<CompetitionContent>
    return {
      ...fallback,
      ...parsed,
      navigation: Array.isArray(parsed.navigation) && parsed.navigation.length === 6
        ? parsed.navigation as CompetitionContent['navigation']
        : fallback.navigation,
    }
  } catch {
    localStorage.removeItem(storageKey)
    return fallback
  }
}

export const saveCompetitionContent = (content: CompetitionContent) => {
  localStorage.setItem(storageKey, JSON.stringify(content))
}
