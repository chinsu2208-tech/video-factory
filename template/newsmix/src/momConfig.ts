// ====== TEMPLATE "REVIEW MẸ BỈM" 9:16 ======
// Tự co giãn theo số lượng: 6–10 video + 2–5 ảnh (ảnh sản phẩm / ảnh feedback khách).
// Thời lượng = độ dài voice. Chạy hàng loạt: truyền job qua --props=job.json (xem README).
// Clip FULL MÀN HÌNH 1080x1920; chữ/logo đè lên nằm trong vùng an toàn x 40–940, y 200–1560.

export const MOM_FPS = 30;

export type MomImage = {
  src?: string; // file trong /public (jpg/png). Trống = khung giữ chỗ
  kind: 'product' | 'feedback';
  caption?: string; // vd "Mẹ bé Su, Hà Nội" (feedback) hoặc tên sản phẩm
};

export type MomStat = {
  value: number; // con số khổng lồ đếm tăng dần, vd 98
  prefix?: string; // vd '-' hoặc '+'
  suffix?: string; // vd '%', 'h', ' mẹ'
  kicker?: string; // dòng nhỏ phía trên, vd 'Chỉ sau 7 ngày'
  label: string; // dòng nhãn bên dưới, vd 'mẹ bỉm hài lòng'
};

export type MomJob = {
  durationSec: number; // = độ dài file voice
  sceneSec?: number; // độ dài mỗi cảnh clip, mặc định 2s
  clipSec?: number; // độ dài mỗi clip nguồn, mặc định 5s (để cắt đoạn đan xen)
  fxSeed?: number; // số bất kỳ (vd số dòng sheet) -> đổi kiểu chuyển cảnh/sticker giữa các video
  voice?: string; // vd 'voice.mp3' trong /public
  music?: string;
  brandName: string;
  handle: string;
  logoImg?: string;
  hookTag?: string; // nhãn nhỏ phía trên thẻ hook, mặc định 'Mẹ bỉm cần biết'
  hookLines: string[]; // câu hook mở đầu, tối đa 3 dòng ~22 ký tự
  cta: string;
  benefits?: string[]; // công dụng (3–4 ý ngắn): hiện thẻ checklist tick lần lượt + nhãn công dụng trượt vào trên các clip
  benefitsTitle?: string; // mặc định 'Công dụng'
  captions?: string[]; // chữ ngắn dưới khung cho từng clip (tuỳ chọn, cùng thứ tự videos)
  videos: string[]; // 6–10 clip, file trong /public (trống từng phần tử = giữ chỗ)
  images: MomImage[]; // 2–5 ảnh
  stats?: MomStat[]; // 1–3 con số chữ to đập vào mắt, đặt trên video thật
};

export const momTheme = {
  bg: '#fff4ee',
  bg2: '#ffe3e8',
  accent: '#ff7a8a', // hồng san hô
  accent2: '#ffb36b', // cam đào
  ink: '#4a2c35',
  card: '#ffffff',
  feedbackBg: '#e9f7ee',
};

export const defaultMomJob: MomJob = {
  durationSec: 45,
  brandName: 'TÊN KÊNH',
  handle: '@tenkenh',
  hookLines: ['MẸ BỈM NÀO CŨNG', 'GẶP CHUYỆN NÀY,', 'NHƯNG ÍT AI BIẾT!'],
  cta: 'Theo dõi để xem thêm mẹo hay cho mẹ & bé',
  captions: ['', 'Mẹ nào cũng từng gặp', '', 'Bí quyết nằm ở đây', '', '', '', ''],
  videos: ['', '', '', '', '', '', '', ''],
  images: [
    {kind: 'product', caption: 'Tên sản phẩm'},
    {kind: 'feedback', caption: 'Mẹ bé Su · Hà Nội'},
    {kind: 'feedback', caption: 'Mẹ bé Bin · Đà Nẵng'},
  ],
};

export type MomBg = {bgSrc?: string; bgStart?: number};
export type MomScene =
  | {type: 'video'; from: number; to: number; src: string; startSec: number; idx: number; hook?: boolean}
  | ({type: 'image'; from: number; to: number; img: MomImage} & MomBg)
  | ({type: 'benefits'; from: number; to: number} & MomBg)
  | ({type: 'stat'; from: number; to: number; stat: MomStat} & MomBg)
  | ({type: 'end'; from: number; to: number} & MomBg);

const HOOK_SEC = 3;
const END_SEC = 2.6;
const IMG_SEC = 2.6;
const STAT_SEC = 2.5;

/**
 * Xếp lịch: mỗi cảnh clip ~sceneSec (2s) rồi chuyển. Clip dài cắt thành nhiều đoạn đan xen với clip khác.
 * Ảnh / công dụng / con số chen giữa, nền của chúng là chính video thật (làm mờ, hoà trộn).
 */
export const buildMomScenes = (job: MomJob): MomScene[] => {
  const total = job.durationSec;
  const sceneSec = job.sceneSec ?? 2;
  const clipSec = job.clipSec ?? 5;
  const clips = job.videos.length ? job.videos : [''];
  const imgs = [...job.images].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'product' ? -1 : 1));
  const stats = job.stats ?? [];
  const nBen = job.benefits?.length ?? 0;
  const benSec = nBen ? Math.min(5, 1.4 + 0.8 * nBen) : 0;
  const extraTime = imgs.length * IMG_SEC + benSec + stats.length * STAT_SEC;
  const vidTime = Math.max(HOOK_SEC + sceneSec, total - END_SEC - extraTime);
  const nRest = Math.max(1, Math.round((vidTime - HOOK_SEC) / sceneSec));
  const restLen = (vidTime - HOOK_SEC) / nRest;
  const nSeg = nRest + 1;

  const starts = [0, clipSec * 0.5, clipSec * 0.25];
  const pool = starts.flatMap((st) => clips.map((src) => ({src, st})));

  const at = (frac: number) => Math.min(nSeg - 1, Math.max(0, Math.round(frac * nSeg) - 1));
  const imgSlots = imgs.map((_, i) => at(imgs.length === 1 ? 0.4 : 0.25 + (0.6 * i) / (imgs.length - 1)));
  const benSlot = nBen ? (imgSlots.length ? imgSlots[0] : at(0.4)) : -1;
  const statSlots = stats.map((_, i) => at(stats.length === 1 ? 0.62 : 0.5 + (0.4 * i) / (stats.length - 1)));

  const out: MomScene[] = [];
  let t = 0;
  let last: {src: string; start: number; len: number} = {src: '', start: 0, len: 0};
  const bg = (): MomBg => ({bgSrc: last.src || undefined, bgStart: Math.max(0, Math.min(last.start + last.len, clipSec - 3))});
  const push = (s: MomScene, dur: number) => {
    out.push({...s, from: t, to: t + dur} as MomScene);
    t += dur;
  };
  for (let i = 0; i < nSeg; i++) {
    const len = i === 0 ? HOOK_SEC : restLen;
    const p = pool[i % pool.length];
    const startSec = Math.max(0, Math.min(p.st, clipSec - len - 0.05));
    push({type: 'video', from: 0, to: 0, src: p.src, startSec, idx: i, hook: i === 0}, len);
    last = {src: p.src, start: startSec, len};
    imgs.forEach((img, j) => {
      if (imgSlots[j] === i) push({type: 'image', from: 0, to: 0, img, ...bg()}, IMG_SEC);
    });
    if (benSlot === i) push({type: 'benefits', from: 0, to: 0, ...bg()}, benSec);
    stats.forEach((stat, j) => {
      if (statSlots[j] === i) push({type: 'stat', from: 0, to: 0, stat, ...bg()}, STAT_SEC);
    });
  }
  push({type: 'end', from: 0, to: 0, ...bg()}, END_SEC);
  return out;
};
export {HOOK_SEC};
