// ====== LAYOUT 3: "VLOG REVIEW F&B" (clip creator tự quay + phụ đề nhảy theo cụm từ) ======
// Đo từ video mẫu 72.6s: ~63 cú cắt, trung bình ~1.15s/cú, mỗi cú 2–5 chữ phụ đề.
// Cấu trúc kể: [bìa giá hook 0–1s] → lý do khác biệt → 5–7 điểm nổi bật → địa chỉ → màn kết 3s.
// Bình thường: 1 video dài quay sẵn, cắt thành nhiều shot bằng `startAt` (giây trong clip gốc).

export const VLOG_FPS = 30;
export const VLOG_END_SEC = 3;

export type Sticker =
  | {kind: 'label'; text: string}                 // chữ nhỏ có sao lấp lánh, vd "Bếp điện từ"
  | {kind: 'bubble'; text: string}                // bong bóng tìm kiếm trắng, vd "219k -> 169k"
  | {kind: 'badge'; big: string; text: string};   // vd "+39k" + "Buffet tráng miệng"

export type Cover = {line1: string; line2: string; badge: string; small?: string};
export type Place = {name: string; address: string};

export type Shot = {
  dur: number;               // giây
  src?: string;              // file trong /public. Bỏ trống = khung giữ chỗ
  startAt?: number;          // bắt đầu từ giây thứ mấy của clip gốc
  caption?: string;          // *từ* trong dấu sao sẽ tô vàng
  sticker?: Sticker;
  cover?: Cover;             // bìa tiêu đề (chỉ shot đầu)
  place?: Place;             // thẻ tên quán + địa chỉ (các shot cuối)
  label?: string;            // chữ trên khung giữ chỗ
};

export const vlog = {
  cta: 'Theo dõi kênh để xem thêm review',
  keepClipAudio: true,       // giữ tiếng gốc của clip (creator tự nói). false = tắt tiếng clip
  voice: undefined as string | undefined,  // mp3 lồng tiếng chạy suốt video (nếu có)
  music: undefined as string | undefined,
  highlight: '#ffe14a',      // màu chữ nhấn
  captionColor: '#ffffff',
  captionY: 1500,            // vị trí dọc của phụ đề (px, trên canvas 1920)
  stickerAccent: '#ff9b1a',  // màu thanh địa chỉ
  // ---- phụ đề chạy theo giọng đọc (khi src/captions.json có dữ liệu) ----
  keywords: [] as string[],  // từ/cụm cần tô vàng, vd ['169K', 'bếp điện từ']. Số và giá luôn được tô vàng
  highlightNumbers: true,
  highlightSpoken: false,    // true = tô vàng chữ đang được đọc (kiểu karaoke)
  snapCutsToVoice: true,     // cắt cảnh tại đầu cụm lời đọc (mỗi cảnh >= 0.9s)
  holdAfter: 0.3,            // giữ phụ đề thêm bao nhiêu giây sau khi đọc xong cụm
};

export const shots: Shot[] = [
  {dur: 1.0, label: 'CẢNH MỞ ĐẦU · MÓN CHÍNH', caption: 'Buffet nướng giảm giá từ',
   cover: {line1: 'Buffet', line2: 'Nướng chảo gang', badge: '169K', small: '219k'}},
  {dur: 1.3, label: 'NGƯỜI REVIEW CẦM MÓN', caption: 'Thế nhưng mà *là* người'},
  {dur: 1.2, label: 'MẶT TIỀN QUÁN', caption: 'Bởi vì *là* quán có'},
  {dur: 1.4, label: 'KHÔNG GIAN QUÁN', caption: '*Không* gian rất rộng', sticker: {kind: 'label', text: 'Rộng rãi'}},
  {dur: 1.2, label: 'ĐÔNG KHÁCH', caption: 'Mỗi *bàn* đều có một'},
  {dur: 1.4, label: 'CHẢO ĐANG NƯỚNG', caption: 'Như tôi *là* buffet',
   sticker: {kind: 'bubble', text: '219k -> 169k (buổi trưa, bàn từ 2 người)'}},
  {dur: 1.2, label: 'BẾP ĐIỆN TỪ', caption: 'Ở trên *bếp điện từ*', sticker: {kind: 'label', text: 'Bếp điện từ'}},
  {dur: 1.2, label: 'MENU', caption: 'Menu có khá *nhiều* lựa chọn', sticker: {kind: 'label', text: 'Menu nhiều lựa chọn'}},
  {dur: 1.2, label: 'THỊT NƯỚNG', caption: 'Thịt *thăn*, dải heo,'},
  {dur: 1.2, label: 'LÒNG BÒ', caption: 'Lòng bò nướng *xém dai*'},
  {dur: 1.3, label: 'ĂN VẶT', caption: 'Buffet *ăn vặt* cũng đa dạng', sticker: {kind: 'label', text: 'Buffet ăn vặt'}},
  {dur: 1.3, label: 'TRÁNG MIỆNG', caption: 'Có cả buffet *tráng miệng* từ',
   sticker: {kind: 'badge', big: '+39k', text: 'Buffet tráng miệng'}},
  {dur: 1.2, label: 'CỬA QUÁN BAN ĐÊM', caption: 'Anh em *đến đây* là thấy'},
  {dur: 1.2, label: 'ĐI BỘ VÀO QUÁN', caption: 'Rồi đi bộ *vào quán*'},
  {dur: 1.4, label: 'NGƯỜI REVIEW', caption: 'Quán cần *tụ tập* nha',
   place: {name: 'TÊN QUÁN', address: 'Cs: Số 12, Đường ABC, Quận X'}},
  {dur: 1.4, label: 'KẾT', caption: 'Deee *nha*', place: {name: 'TÊN QUÁN', address: 'Cs: Số 12, Đường ABC, Quận X'}},
];

// Dữ liệu căn thời gian do `python3 tools/align.py voice.mp3 script.txt` tạo ra
import captionsData from './captions.json';
export type Caps = {
  words: {w: string; s: number; e: number}[];
  phrases: {text: string; s: number; e: number}[];
  cuts: number[];
  voiceEnd: number;
  total: number;
};
export const captions = captionsData as unknown as Caps;
export const voiceDriven = captions.phrases.length > 0;

// Khi có giọng đọc: cảnh đổi tại các điểm cắt gợi ý; số cảnh nhiều hơn danh sách `shots` thì xoay vòng lại.
export const timedShots: Shot[] = (() => {
  if (!voiceDriven || !vlog.snapCutsToVoice) return shots;
  const cuts = captions.cuts;
  const end = Math.max(captions.total, captions.voiceEnd);
  return cuts.map((c, i) => {
    const base = shots[i % shots.length];
    const first = i < shots.length;
    return {
      ...base,
      caption: undefined,                 // phụ đề do CaptionTrack lo
      sticker: first ? base.sticker : undefined,
      cover: first ? base.cover : undefined,
      dur: Math.max(0.3, (i + 1 < cuts.length ? cuts[i + 1] : end) - c),
    };
  });
})();

export const vlogTotalSec = Math.max(
  timedShots.reduce((a, s) => a + s.dur, 0),
  voiceDriven ? captions.total : 0,
) + VLOG_END_SEC;
