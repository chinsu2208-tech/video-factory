// ====== TEMPLATE "NEWSMIX" 9:16 – video tổng hợp nhiều nguồn (tin thật, sự kiện, sản phẩm aff đa dạng) ======
// Mỗi segment = 1 cảnh ~2s với 1 bố cục. Clip nguồn khác ánh sáng/góc quay/chất lượng đều được "đồng nhất" bằng
// lớp chỉnh màu + grain + nền mờ. Style 'A' = TIN NÓNG (đỏ/vàng, sắc cạnh), 'B' = XU HƯỚNG (sáng, bo tròn).
// Vùng an toàn TikTok: x 40–940, y 200–1560.

export const NEWS_FPS = 30;

export type NewsSeg =
  | {layout: 'full'; src: string; startSec?: number; source?: string; headline?: string; dur?: number}
  | {layout: 'framed'; src: string; startSec?: number; source?: string; headline?: string; dur?: number}
  | {layout: 'split'; src: string; startSec?: number; source?: string; src2: string; start2?: number; source2?: string; headline?: string; dur?: number}
  | {layout: 'pip'; src: string; startSec?: number; source?: string; src2: string; start2?: number; source2?: string; headline?: string; dur?: number}
  | {layout: 'stat'; value: number; prefix?: string; suffix?: string; kicker?: string; label: string; dur?: number}
  | {layout: 'compare'; leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[]; dur?: number}
  | {layout: 'timeline'; title: string; items: {t: string; label: string}[]; dur?: number}
  | {layout: 'offer'; name: string; oldPrice: number; price: number; gifts?: string[]; stockLeft?: number; stockTotal?: number; deadline?: string; src?: string; startSec?: number; source?: string; dur?: number}
  | {layout: 'bars'; title: string; unit?: string; items: {label: string; value: number}[]; note?: string; dur?: number};

export type NewsJob = {
  style: 'A' | 'B' | 'C';
  durationSec: number; // = độ dài voice
  voice?: string;
  music?: string;
  fxSeed?: number;
  brandName: string;
  handle: string;
  logoImg?: string;
  badge?: string; // nhãn góc trên: 'TIN NÓNG' / 'XU HƯỚNG' ...
  titleTag?: string; // nhãn nhỏ trên thẻ hook
  titleLines: string[]; // hook mở đầu, dùng *từ khoá* để tô nổi
  ticker: string[]; // dải chữ chạy phía dưới
  cta: string;
  segments: NewsSeg[]; // phần tử đầu = cảnh hook (nên là layout 'full')
};

export type SchedSeg = {seg: NewsSeg; from: number; to: number; idx: number; bgSrc?: string; bgStart?: number; hook: boolean} | {end: true; from: number; to: number; bgSrc?: string; bgStart?: number};

const DEF_DUR: Record<string, number> = {full: 2.2, framed: 2.2, split: 2.4, pip: 2.4, stat: 2.5, compare: 4, timeline: 4, bars: 3.5, offer: 4.5};
const END_SEC = 2.6;

export const scheduleNews = (job: NewsJob): SchedSeg[] => {
  const durs = job.segments.map((s, i) => s.dur ?? (i === 0 ? 3 : DEF_DUR[s.layout]));
  const sum = durs.reduce((a, b) => a + b, 0);
  const k = Math.max(0.7, Math.min(1.5, (job.durationSec - END_SEC) / sum));
  const out: SchedSeg[] = [];
  let t = 0;
  let last: {src: string; start: number} = {src: '', start: 0};
  job.segments.forEach((seg, i) => {
    const d = durs[i] * k;
    out.push({seg, from: t, to: t + d, idx: i, hook: i === 0, bgSrc: last.src || undefined, bgStart: last.start + 1.2});
    if ('src' in seg && seg.src) last = {src: seg.src, start: seg.startSec ?? 0};
    t += d;
  });
  out.push({end: true, from: t, to: t + END_SEC, bgSrc: last.src || undefined, bgStart: last.start + 1.2});
  return out;
};

const A = 'Nguồn: clip demo';
export const demoNewsA: NewsJob = {
  style: 'A',
  durationSec: 34,
  fxSeed: 1,
  brandName: 'TÊN KÊNH',
  handle: '@tenkenh',
  badge: 'TIN NÓNG',
  titleTag: 'Cập nhật',
  titleLines: ['MẸ BỈM ĐANG *TÌM KIẾM*', 'SẢN PHẨM NÀY'],
  ticker: ['TỔNG HỢP XU HƯỚNG MẸ & BÉ', 'XỊT THƠM QUẦN ÁO GỌN NHẸ', 'LĂN KHỬ MÙI DỊU NHẸ', 'THEO DÕI ĐỂ CẬP NHẬT MỖI NGÀY'],
  cta: 'Theo dõi để cập nhật tin trend mỗi ngày',
  segments: [
    {layout: 'full', src: 'c1.mp4', startSec: 0},
    {layout: 'framed', src: 'c5.mp4', startSec: 0, source: `${A} #1`, headline: 'Lăn khử mùi *dịu nhẹ* cho tuổi teen'},
    {layout: 'split', src: 'c2.mp4', startSec: 0.5, source: `${A} #2`, src2: 'c4.mp4', start2: 0.5, source2: `${A} #3`, headline: 'Hai cách chăm sóc, *một xu hướng*'},
    {layout: 'full', src: 'c8.mp4', startSec: 2.4, source: `${A} #4`, headline: 'Xịt thơm quần áo *gọn nhẹ* bỏ túi'},
    {layout: 'stat', value: 3, suffix: ' bước', kicker: 'Chỉ cần', label: 'là xong mùi cả ngày'},
    {layout: 'pip', src: 'c6.mp4', startSec: 1, source: `${A} #5`, src2: 'c3.mp4', start2: 2, source2: `${A} #6`, headline: 'Nhiều mẹ *cùng chia sẻ*'},
    {layout: 'compare', leftTitle: 'Cách cũ', leftItems: ['Phơi cả ngày', 'Mùi hắc', 'Khó mang đi'], rightTitle: 'Cách mới', rightItems: ['Xịt là thơm', 'Dịu nhẹ', 'Bỏ túi gọn']},
    {layout: 'framed', src: 'c9.mp4', startSec: 1.5, source: `${A} #7`, headline: 'Từng clip một *góc nhìn khác nhau*'},
    {layout: 'bars', title: 'Mẹ quan tâm điều gì?', unit: '%', note: 'SỐ LIỆU MẪU', items: [{label: 'Thơm nhẹ', value: 86}, {label: 'An toàn', value: 78}, {label: 'Tiện mang', value: 64}]},
    {layout: 'full', src: 'c7.mp4', startSec: 2.2, source: `${A} #8`, headline: 'Dùng thử *là ghiền*'},
    {layout: 'timeline', title: 'Cách dùng', items: [{t: 'Bước 1', label: 'Lắc nhẹ chai'}, {t: 'Bước 2', label: 'Xịt cách 20cm'}, {t: 'Bước 3', label: 'Để khô tự nhiên'}]},
    {layout: 'split', src: 'c3.mp4', startSec: 2.5, source: `${A} #6`, src2: 'c1.mp4', start2: 2.5, source2: `${A} #9`, headline: 'Và đây là *kết quả*'},
    {layout: 'offer', name: 'Xịt thơm quần áo Baby 100ml', oldPrice: 129000, price: 79000, gifts: ['Tặng 1 lăn khử mùi mini', 'Freeship đơn từ 99k'], stockLeft: 23, stockTotal: 100, deadline: 'Kết thúc 23:59 hôm nay', src: 'c1.mp4', startSec: 1.5, source: `${A} #10`},
  ],
};

export const demoNewsB: NewsJob = {
  style: 'B',
  durationSec: 30,
  fxSeed: 4,
  brandName: 'TÊN KÊNH',
  handle: '@tenkenh',
  badge: 'XU HƯỚNG',
  titleTag: 'Đang hot',
  titleLines: ['3 LÝ DO MẸ BỈM', 'MÊ MẨN *MÓN NÀY*'],
  ticker: ['XU HƯỚNG CHĂM SÓC MẸ & BÉ', 'GỌN NHẸ · DỊU NHẸ · TIỆN LỢI'],
  cta: 'Theo dõi để không bỏ lỡ xu hướng mới',
  segments: [
    {layout: 'full', src: 'c4.mp4', startSec: 0},
    {layout: 'full', src: 'c2.mp4', startSec: 2.5, source: `${A} #1`, headline: 'Lý do 1: *Dịu nhẹ*'},
    {layout: 'pip', src: 'c9.mp4', startSec: 0, source: `${A} #2`, src2: 'c5.mp4', start2: 2.5, source2: `${A} #3`, headline: 'Lý do 2: *Tiện mang đi*'},
    {layout: 'stat', value: 2, suffix: ' giây', kicker: 'Chỉ mất', label: 'để xịt là thơm'},
    {layout: 'framed', src: 'c7.mp4', startSec: 0.5, source: `${A} #4`, headline: 'Lý do 3: *Ai cũng mê*'},
    {layout: 'compare', leftTitle: 'Trước', leftItems: ['Mùi khó chịu', 'Mất thời gian'], rightTitle: 'Sau', rightItems: ['Thơm nhẹ', 'Nhanh gọn']},
    {layout: 'split', src: 'c6.mp4', startSec: 0.5, source: `${A} #5`, src2: 'c8.mp4', start2: 0.5, source2: `${A} #6`, headline: 'Mỗi mẹ *một câu chuyện*'},
    {layout: 'timeline', title: 'Dùng thế nào?', items: [{t: '1', label: 'Lắc nhẹ'}, {t: '2', label: 'Xịt vừa đủ'}, {t: '3', label: 'Tận hưởng'}]},
    {layout: 'full', src: 'c1.mp4', startSec: 2.4, source: `${A} #7`, headline: 'Bạn đã thử *chưa*?'},
    {layout: 'offer', name: 'Lăn khử mùi dịu nhẹ', oldPrice: 99000, price: 59000, gifts: ['Tặng túi zip xinh', 'Mua 2 giảm thêm 10k'], stockLeft: 37, stockTotal: 100, deadline: 'Flash sale 2 giờ nữa', src: 'c4.mp4', startSec: 1, source: `${A} #8`},
  ],
};

export const demoNewsC: NewsJob = {
  style: 'C',
  durationSec: 32,
  fxSeed: 2,
  brandName: 'TÊN KÊNH',
  handle: '@tenkenh',
  badge: 'bí kíp mới',
  titleTag: 'Lưu ngay',
  titleLines: ['HỌC SINH – SINH VIÊN', '*NHẤT ĐỊNH* PHẢI BIẾT'],
  ticker: ['mẹo nhỏ cho ngày đi học', 'thơm tho cả ngày', 'gọn nhẹ bỏ cặp', 'theo dõi để xem thêm nha'],
  cta: 'Lưu lại và theo dõi để xem thêm mẹo nha!',
  segments: [
    {layout: 'full', src: 'c5.mp4', startSec: 0},
    {layout: 'framed', src: 'c4.mp4', startSec: 0, source: `${A} #1`, headline: 'Mang theo *lăn khử mùi* bỏ cặp'},
    {layout: 'full', src: 'c2.mp4', startSec: 2.5, source: `${A} #2`, headline: 'Xịt nhẹ là *thơm ngay*'},
    {layout: 'split', src: 'c6.mp4', startSec: 0.5, source: `${A} #3`, src2: 'c8.mp4', start2: 0.5, source2: `${A} #4`, headline: 'Mỗi bạn *một cách dùng*'},
    {layout: 'stat', value: 5, suffix: ' giây', kicker: 'Chỉ mất', label: 'là xong trước giờ vào lớp'},
    {layout: 'pip', src: 'c9.mp4', startSec: 1, source: `${A} #5`, src2: 'c4.mp4', start2: 2.5, headline: 'Bạn bè *cũng dùng*'},
    {layout: 'compare', leftTitle: 'Trước', leftItems: ['Ngại giao tiếp', 'Lo mùi mồ hôi'], rightTitle: 'Sau', rightItems: ['Tự tin hơn', 'Thơm nhẹ cả ngày']},
    {layout: 'framed', src: 'c7.mp4', startSec: 0.5, source: `${A} #6`, headline: 'Dùng thử là *mê*'},
    {layout: 'timeline', title: 'Dùng sao cho đúng?', items: [{t: 'bước 1', label: 'Lăn đều dưới cánh tay'}, {t: 'bước 2', label: 'Đợi khô vài giây'}, {t: 'bước 3', label: 'Mặc áo, đi học!'}]},
    {layout: 'bars', title: 'Các bạn quan tâm gì?', unit: '%', note: 'số liệu mẫu', items: [{label: 'Thơm nhẹ', value: 82}, {label: 'Gọn nhẹ', value: 74}, {label: 'Giá học sinh', value: 66}]},
    {layout: 'full', src: 'c3.mp4', startSec: 2.4, source: `${A} #7`, headline: 'Bạn thử *chưa*?'},
    {layout: 'offer', name: 'Lăn khử mùi học sinh', oldPrice: 89000, price: 49000, gifts: ['Tặng sticker dễ thương', 'Giá riêng cho học sinh'], stockLeft: 18, stockTotal: 60, deadline: 'Hết đợt này là hết nha', src: 'c5.mp4', startSec: 1, source: `${A} #8`},
  ],
};
