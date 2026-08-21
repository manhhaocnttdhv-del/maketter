export type TextKey = 'eyebrow' | 'title' | 'subtitle' | 'cta'

export interface TextContent {
  eyebrow: string
  title: string
  subtitle: string
  cta: string
}

export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  fontStyle: 'normal' | 'italic'
  textAlign: 'left' | 'center' | 'right'
  color: string
  letterSpacing: number
}

export type TextStyleMap = Record<TextKey, TextStyle>

export interface LayoutTemplate {
  id: string
  title: string
  category: string
  format: string
  variant: 'launch' | 'studio' | 'organic' | 'editorial'
  content: TextContent
  styles: TextStyleMap
}

const style = (
  fontSize: number,
  color: string,
  fontWeight = 600,
  textAlign: TextStyle['textAlign'] = 'left',
  fontFamily = 'Manrope',
): TextStyle => ({
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle: 'normal',
  textAlign,
  color,
  letterSpacing: 0,
})

export const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'launch',
    title: 'Ra mắt sản phẩm',
    category: 'Mạng xã hội',
    format: '1080 × 1350 px',
    variant: 'launch',
    content: {
      eyebrow: 'SẢN PHẨM MỚI · 2026',
      title: 'Ý tưởng lớn\nbắt đầu từ đây.',
      subtitle: 'Bộ công cụ sáng tạo giúp thương hiệu của bạn nổi bật theo cách riêng.',
      cta: 'KHÁM PHÁ NGAY  →',
    },
    styles: {
      eyebrow: style(12, '#e9552d', 800),
      title: style(54, '#18223c', 800, 'left', 'DM Sans'),
      subtitle: style(17, '#596175', 500),
      cta: style(12, '#ffffff', 800),
    },
  },
  {
    id: 'studio',
    title: 'Creative Studio',
    category: 'Bài thuyết trình',
    format: '1920 × 1080 px',
    variant: 'studio',
    content: {
      eyebrow: 'MAKETTER®  —  CREATIVE LAB',
      title: 'MAKE\nIT BOLD.',
      subtitle: 'Strategy · Identity · Digital experiences',
      cta: 'VIEW OUR WORK  ↗',
    },
    styles: {
      eyebrow: style(11, '#dce7ff', 700),
      title: style(58, '#ffffff', 900, 'left', 'DM Sans'),
      subtitle: style(15, '#dce7ff', 500),
      cta: style(12, '#162352', 800),
    },
  },
  {
    id: 'organic',
    title: 'Organic Living',
    category: 'Câu chuyện',
    format: '1080 × 1920 px',
    variant: 'organic',
    content: {
      eyebrow: 'MINDFUL JOURNAL · ISSUE 04',
      title: 'SLOW\nDOWN.',
      subtitle: 'Những thói quen nhỏ cho một cuộc sống xanh, lành mạnh và đầy cảm hứng.',
      cta: 'ĐỌC CÂU CHUYỆN  +',
    },
    styles: {
      eyebrow: style(11, '#c8ff4d', 700),
      title: style(59, '#c8ff4d', 900, 'left', 'DM Sans'),
      subtitle: style(16, '#f3f0eb', 500),
      cta: style(12, '#101010', 800),
    },
  },
  {
    id: 'editorial',
    title: 'Brand Editorial',
    category: 'Mạng xã hội',
    format: '1080 × 1350 px',
    variant: 'editorial',
    content: {
      eyebrow: 'THE WEEKEND EDIT',
      title: 'Tìm lại\nnhịp riêng.',
      subtitle: 'Một hành trình thị giác về không gian, chất liệu và những điều giản dị.',
      cta: 'XEM BỘ SƯU TẬP  ↗',
    },
    styles: {
      eyebrow: style(11, '#8e2e25', 800),
      title: style(49, '#241d1a', 700, 'left', 'Georgia'),
      subtitle: style(15, '#5d504b', 500),
      cta: style(11, '#fffaf5', 800),
    },
  },
]

export const cloneContent = (template: LayoutTemplate): TextContent =>
  JSON.parse(JSON.stringify(template.content)) as TextContent

export const cloneStyles = (template: LayoutTemplate): TextStyleMap =>
  JSON.parse(JSON.stringify(template.styles)) as TextStyleMap

export const getLayout = (id?: string): LayoutTemplate =>
  layoutTemplates.find((template) => template.id === id) ?? layoutTemplates[0]
