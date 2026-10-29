// ====== CẤU HÌNH TEMPLATE "TIN TREND DỌC 9:16" ======
// Nhịp cắt đo từ video mẫu 61.25s @30fps. Sửa file này là đổi nội dung, không cần đụng code dựng.

export const FPS = 30;
export const DURATION_SEC = 61.25;

export const brand = {
  name: 'TÊN KÊNH',          // chữ góc phải trên của khung clip
  sub: 'MEDIA',
  label: 'TÊN KÊNH TRENDING', // nhãn trên thẻ tiêu đề
  logoText: 'T+',             // thay bằng ảnh logo: để logoImg = 'logo.png' (đặt trong /public)
  logoImg: undefined as string | undefined, // vd 'logo.png' (đặt trong /public)
  logoShape: 'rounded' as 'rounded' | 'circle' | 'free', // free = PNG trong suốt dạng sticker, không có ô trắng
  logoBox: '#ffffff',       // màu ô nền sau logo
  logoTextColor: '#1a1a1a',
  handle: '@tenkenh',
  accent: '#ff7a1a',        // màu viền/nhấn
};

// ====== MÀU SẮC: đổi ở đây là đổi toàn bộ video ======
export const theme = {
  gridBg: '#b8121b',        // nền lưới (cảnh 'grid')
  gridLine: '#7a0910',      // màu đường kẻ lưới
  headlineBg: ['#8b7a6b', '#4a3b33', '#1a1210'], // gradient nền thẻ tiêu đề khi không có ảnh nền
  panel: '#0b0808',         // nền tối phía dưới thẻ tiêu đề
  endBg: '#0d0f1a',         // nền màn kết
  // layout "PostThread"
  postCardBg: '#ffffff',
  postCardText: '#111111',
  titleCardBg: '#fdeee9',
  titleCardBorder: '#1c1c1c',
  titleCardText: '#1c1c1c',
  cloudA: '#f6b9cc',
  cloudB: '#fde4ec',
};

export type Bg =
  | {kind: 'grid'}
  | {kind: 'solid'; color: string}
  | {kind: 'gradient'; from: string; to: string; angle?: number}
  | {kind: 'image'; src: string};

export type HeadlineScene = {
  type: 'headline';
  from: number;
  to: number;
  date: string;
  lines: string[];       // tối đa 4 dòng, ~30 ký tự/dòng
  bgSrc?: string;        // ảnh/video nền (sẽ được làm mờ), file trong /public
};
export type ClipScene = {
  type: 'clip';
  from: number;
  to: number;
  bg: Bg;
  src?: string;          // file trong /public (.mp4 / .jpg / .png). Bỏ trống = khung giữ chỗ
  label?: string;
};
export type EndScene = {type: 'end'; from: number; to: number; cta: string};
export type Scene = HeadlineScene | ClipScene | EndScene;

const GRID: Bg = {kind: 'grid'};
const beige: Bg = {kind: 'solid', color: '#d8cfc1'};
const rose: Bg = {kind: 'solid', color: '#c98f8a'};
const ink: Bg = {kind: 'solid', color: '#14161d'};
const slate: Bg = {kind: 'solid', color: '#6b7a93'};

// Đoạn cắt nhanh (montage) 47.9s → 58.3s, mỗi cú ~0.3–0.6s
const fastCuts = [
  47.95, 48.25, 48.58, 48.92, 49.35, 49.85, 50.28, 50.72, 51.25, 52.45, 52.82,
  53.19, 53.79, 54.35, 54.72, 56.12, 56.52, 56.92, 57.22, 58.3,
];
const fastBgs: Bg[] = [beige, slate, ink, rose];
const montage: ClipScene[] = fastCuts.slice(0, -1).map((t, i) => ({
  type: 'clip',
  from: t,
  to: fastCuts[i + 1],
  bg: fastBgs[i % fastBgs.length],
  label: `CLIP ${i + 8}`,
}));

export const scenes: Scene[] = [
  {
    type: 'headline',
    from: 0,
    to: 5.67,
    date: '27/10/2026',
    lines: [
      'TIÊU ĐỀ TIN NÓNG ĐẶT Ở ĐÂY,',
      'TỐI ĐA BỐN DÒNG NGẮN, MỖI DÒNG',
      'KHOẢNG 30 KÝ TỰ ĐỂ KHÔNG TRÀN',
      'VÀ CÓ “TỪ KHOÁ” GÂY TÒ MÒ',
    ],
  },
  {type: 'clip', from: 5.67, to: 8.0, bg: GRID, label: 'ẢNH / SCREENSHOT NGUỒN'},
  {type: 'clip', from: 8.0, to: 18.42, bg: GRID, label: 'CLIP 1 · CẬN CẢNH'},
  {type: 'clip', from: 18.42, to: 25.89, bg: beige, label: 'CLIP 2 · BỐI CẢNH'},
  {type: 'clip', from: 25.89, to: 34.23, bg: rose, label: 'CLIP 3 · CHI TIẾT'},
  {type: 'clip', from: 34.23, to: 37.64, bg: ink, label: 'CLIP 4'},
  {type: 'clip', from: 37.64, to: 42.31, bg: slate, label: 'CLIP 5'},
  {type: 'clip', from: 42.31, to: 47.95, bg: beige, label: 'CLIP 6'},
  ...montage,
  {type: 'end', from: 58.3, to: 61.25, cta: 'Theo dõi kênh để xem thêm tin trend'},
];

// Lồng tiếng: đặt file mp3 vào /public rồi điền tên (vd 'voice.mp3'). Câu nghỉ ~0.5s tại
// 8.07, 11.63, 28.05, 34.2, 45.16, 50.79, 54.4, 58.3 giây (dùng để chia lời đọc).
export const voice: string | undefined = undefined;
export const music: string | undefined = undefined;
