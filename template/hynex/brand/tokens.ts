// HYNEX BRAND TOKENS — DRAFT v0.2
// Màu chủ đạo lấy từ logo Sếp gửi: navy #0C141D, xanh chanh #C8FF3D, trắng.
// Mọi component đọc từ đây. Đổi ở đây = đổi cả hệ thống.

export type Branch = "edu" | "media" | "b2b" | "real";
export type Orientation = "vertical" | "horizontal";

export const color = {
  // Lõi thương hiệu (từ logo)
  ink: "#0C141D",
  lime: "#C8FF3D",
  white: "#FFFFFF",
  // Biến thể
  inkSoft: "#17222E",
  inkLine: "#2A3A4A",
  limeSoft: "#EEFFC2",
  limeMid: "#DDFF7A",
  limeDeep: "#4F7A00", // chữ màu nhấn trên nền sáng (lime thuần không đọc được trên nền sáng)
  cream: "#FFFBEA",
  paper: "#F7F9F2",
  muted: "#5B6673",
  mutedOnDark: "#9FB0C2",
  // Màu phụ cho icon/tile (vui, nhiều màu; luôn đi cùng viền ink)
  sky: "#6FD3FF",
  coral: "#FF8A6B",
  violet: "#A99BFF",
  sun: "#FFD84D",
  mint: "#7CF0C0",
  pink: "#FF9EC7",
  green: "#22C55E",
  red: "#EF4444",
} as const;

/** Vòng màu cho tile icon: mỗi mục một màu, tạo cảm giác vui và trực quan. */
export const tilePalette = [color.lime, color.sky, color.coral, color.violet, color.sun, color.mint, color.pink] as const;

export const font = {
  // Be Vietnam Pro: sạch, thiết kế cho tiếng Việt. Nunito: tròn, thân thiện, dùng cho tiêu đề EDU/Media.
  display: "Nunito, 'Be Vietnam Pro', system-ui, sans-serif",
  body: "'Be Vietnam Pro', Nunito, system-ui, sans-serif",
  soft: "'Baloo 2','Nunito',sans-serif",
  hard: "'Barlow Condensed','Be Vietnam Pro',sans-serif",
  serif: "'Playfair Display', 'Be Vietnam Pro', Georgia, serif", // nhánh Real: hook text kiểu tạp chí
  mono: "'DejaVu Sans Mono', monospace",
  emoji: "'Noto Color Emoji'",
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 800, heavy: 900 },
} as const;

export type Theme = {
  name: string;
  bg: string;
  surface: string;
  line: string;
  text: string;
  muted: string;
  accent: string; // màu nền cho nút/tile nhấn
  onAccent: string; // chữ trên accent
  accentText: string; // chữ màu nhấn (đọc được trên bg)
  accent2: string;
  outline: string; // viền "sticker"
  hardShadow: boolean; // bóng cứng kiểu sticker (EDU/Media) hay bóng mềm (B2B)
  fontDisplay: string;
  fontBody: string;
  dark: boolean;
};

export const branchTheme: Record<Branch, Theme> = {
  // EDU: giấy kem ấm, tile nhiều màu, truyền cảm hứng
  edu: {
    name: "Hynex EDU",
    bg: color.cream,
    surface: color.white,
    line: "#E9E2C8",
    text: color.ink,
    muted: color.muted,
    accent: color.lime,
    onAccent: color.ink,
    accentText: color.limeDeep,
    accent2: color.coral,
    outline: color.ink,
    hardShadow: true,
    fontDisplay: font.display,
    fontBody: font.body,
    dark: false,
  },
  // Media: nền xanh chanh SÁNG, vui, nhịp nhanh (ink chỉ dùng cho điểm nhấn)
  media: {
    name: "Hynex Media",
    bg: color.lime,
    surface: color.white,
    line: color.ink,
    text: color.ink,
    muted: "#38432A",
    accent: color.ink,
    onAccent: color.lime,
    accentText: color.ink,
    accent2: color.coral,
    outline: color.ink,
    hardShadow: true,
    fontDisplay: font.display,
    fontBody: font.body,
    dark: false,
  },
  // Real: nội dung thật. Nền giấy ấm, chữ serif lớn màu lime đặt trên video/ảnh thật, nhãn marker, bóng mềm
  real: {
    name: "Hynex Real",
    bg: "#EFEAE0",
    surface: color.white,
    line: "#D9D2C3",
    text: color.ink,
    muted: "#5B5446",
    accent: color.lime,
    onAccent: color.ink,
    accentText: color.ink,
    accent2: color.pink,
    outline: color.ink,
    hardShadow: false,
    fontDisplay: font.serif,
    fontBody: font.body,
    dark: false,
  },
  // B2B: trắng sạch, navy, lime dùng tiết chế
  b2b: {
    name: "Hynex B2B",
    bg: color.paper,
    surface: color.white,
    line: "#DCE3D2",
    text: color.ink,
    muted: color.muted,
    accent: color.ink,
    onAccent: color.lime,
    accentText: color.ink,
    accent2: color.lime,
    outline: color.ink,
    hardShadow: false,
    fontDisplay: font.body,
    fontBody: font.body,
    dark: false,
  },
};

/** Tông tối dùng cho điểm nhấn (hook/CTA của Media): ink nền, lime chữ. */
export const inkTone: Theme = {
  name: "ink",
  bg: color.ink,
  surface: color.inkSoft,
  line: color.inkLine,
  text: color.white,
  muted: color.mutedOnDark,
  accent: color.lime,
  onAccent: color.ink,
  accentText: color.lime,
  accent2: color.coral,
  outline: color.lime,
  hardShadow: false,
  fontDisplay: font.display,
  fontBody: font.body,
  dark: true,
};

export const space = { xs: 8, sm: 16, md: 24, lg: 40, xl: 64, xxl: 96 } as const;
export const radius = { sm: 12, md: 22, lg: 34, pill: 999 } as const;

export const shadow = {
  soft: "0 12px 32px rgba(12,20,29,0.10)",
  hard: (c: string = color.ink, d = 7) => `${d}px ${d}px 0 ${c}`,
  glow: (c: string) => `0 0 44px ${c}66`,
} as const;

// Motion language: dễ thương, có độ nảy nhẹ (pop), không cứng.
export const motion = {
  fps: 30,
  spring: {
    soft: { damping: 200 },
    snappy: { damping: 18, stiffness: 190 },
    pop: { damping: 10, stiffness: 170, mass: 0.8 }, // nảy rõ, dùng cho sticker/icon
    bounce: { damping: 8, stiffness: 150 },
  },
  enterFrames: 14,
  exitFrames: 10,
  stagger: 6,
} as const;

// Khổ video: 9:16 là ưu tiên. SAFE ZONE TikTok: trên (thanh tìm kiếm), dưới (caption/tên kênh), phải (cột icon).
export const format = {
  vertical: { width: 1080, height: 1920, safe: { top: 220, bottom: 420, left: 64, right: 170 } },
  horizontal: { width: 1920, height: 1080, safe: { top: 130, bottom: 72, left: 96, right: 96 } },
} as const;

export const safeBox = (o: Orientation) => {
  const f = format[o];
  return { x: f.safe.left, y: f.safe.top, w: f.width - f.safe.left - f.safe.right, h: f.height - f.safe.top - f.safe.bottom };
};

export const brand = {
  wordmark: "Hynex",
  tagline: "Hiểu rõ. Làm được. Kiếm được.", // DRAFT, cần Sếp duyệt
} as const;
