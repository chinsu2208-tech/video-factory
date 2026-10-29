// ====== LAYOUT 4: "ANIMATION ĐỒ HOẠ CHUYỂN ĐỘNG" (explainer: số đếm, các bước, biểu đồ) ======
// Hợp với nội dung dạng lộ trình: "Cách kiếm 100 triệu đầu tiên", "5 bước mở shop", "Quy trình làm hàng"...
// Sửa file này là đổi nội dung. Mỗi cảnh có `dur` (giây); khi có giọng đọc thì chỉnh `dur` theo lời đọc.

export const MX_FPS = 30;

export const mx = {
  // màu (đổi là đổi toàn bộ video)
  bg: '#0b1220',
  bg2: '#16233f',
  accent: '#ffc233',
  text: '#ffffff',
  muted: '#9fb0cc',
  // chữ
  kicker: 'CÁCH KIẾM',
  title: '100 TRIỆU',
  titleLine2: 'ĐẦU TIÊN',
  hookSub: 'Không cần vốn lớn, cần đúng thứ tự',
  goal: 100_000_000,          // số tiền đích (đồng)
  handle: '@tenkenh',
  cta: 'LƯU LẠI ĐỂ LÀM THEO',
  ctaSub: 'Theo dõi để xem phần tiếp theo',
  disclaimer: 'Số liệu minh hoạ. Kết quả mỗi người khác nhau.',
  voice: undefined as string | undefined,   // mp3 lồng tiếng (đặt trong /public)
  music: undefined as string | undefined,
};

export type StepIcon = 'search' | 'box' | 'trend' | 'loop';
export type Step = {icon: StepIcon; title: string; sub: string; target: number; dur: number};

export const steps: Step[] = [
  {icon: 'search', title: 'Chọn đúng sản phẩm', sub: 'Xem thứ đang bán chạy trên sàn, đừng đoán', target: 10_000_000, dur: 4.5},
  {icon: 'box', title: 'Bán thử 10 đơn đầu', sub: 'Làm bản mẫu nhỏ, bán thật, nghe khách nói', target: 35_000_000, dur: 4.5},
  {icon: 'trend', title: 'Nhân đôi cái đang chạy', sub: 'Video nào ra đơn thì làm thêm 10 bản giống nó', target: 70_000_000, dur: 4.5},
  {icon: 'loop', title: 'Tự động hoá, giữ khách cũ', sub: 'Để máy làm việc lặp lại, người làm việc mới', target: 100_000_000, dur: 4.5},
];

export const chart = {
  title: 'Doanh thu cộng dồn theo tháng',
  unit: 'tr',
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  values: [8, 22, 41, 63, 82, 100],   // triệu đồng, giá trị cuối nên bằng goal
  dur: 5.5,
};

export const HOOK_SEC = 3.5;
export const END_SEC = 3;
export const motionTotalSec = HOOK_SEC + steps.reduce((a, s) => a + s.dur, 0) + chart.dur + END_SEC;
