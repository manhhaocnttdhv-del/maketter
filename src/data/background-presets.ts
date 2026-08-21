export interface BackgroundPreset {
  id: string
  name: string
  tag: string
  description: string
  image: string
  isDefault?: boolean
}

export const backgroundPresets: BackgroundPreset[] = [
  {
    id: 'canva-default',
    name: 'Bản gốc Canva TNTH 2026',
    tag: 'Default',
    description: 'Ảnh nền gốc chính thức từ bộ thiết kế Canva của Ban Đối Ngoại NEU',
    image: '/assets/tnth-canva/01-mahscd5rwcc-MAHScd5RwCc.png',
    isDefault: true,
  },
  {
    id: 'unbound-portal',
    name: 'Round to Unbound – Cyber Orbit',
    tag: 'Đẳng cấp 3D',
    description: 'Vòng quỹ đạo năng lượng 3D, la bàn định vị thương hiệu & vệt sáng Neon Cyan/Violet',
    image: '/assets/tnth-background-unbound.svg',
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Vision – Tinh vân vô cực',
    tag: 'Vũ trụ số',
    description: 'Không gian vũ trụ sâu thẳm, dải ngân hà huyền ảo kết hợp chùm sao & ánh sáng tương lai',
    image: '/assets/tnth-bg-cosmic-nebula.svg',
  },
  {
    id: 'strategic-wave',
    name: 'Strategic Wave – Lưới số hóa đa chiều',
    tag: 'Công nghệ cao',
    description: 'Lưới 3D ma trận phối cảnh sâu, sóng kim loại lỏng ánh ngọc & tia sáng định hướng',
    image: '/assets/tnth-bg-strategic-wave.svg',
  },
  {
    id: 'aurora-prism',
    name: 'Aurora Prism – Lăng kính cực quang',
    tag: 'Nghệ thuật',
    description: 'Dải cực quang quang phổ mềm mại, khúc xạ ánh sáng kim cương trên nền xanh đen Midnight',
    image: '/assets/tnth-bg-aurora-prism.svg',
  },
]
