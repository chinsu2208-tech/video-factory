// ====== LAYOUT 2: "BÀI ĐĂNG ĐÈ LÊN VIDEO NỀN" (kiểu thread 12 phần) ======
// Video mẫu dài 184s: ~3.7s mở đầu + 12 thẻ bài đăng (mỗi thẻ ~12–15s), nền là clip loop đổi 3–10s/lần.
// Ở đây để bản demo ngắn (~31s). Thêm/bớt phần tử trong `posts` là xong.

export const POST_FPS = 30;

export type PostScene =
  | {type: 'title'; from: number; to: number; user: string; time: string; counter: string; text: string;
     likes: string; comments: string; reposts: string; shares: string; title: string; bg: BgLoop}
  | {type: 'post'; from: number; to: number; user: string; time: string; counter: string; text: string[];
     image?: string; bg: BgLoop}
  | {type: 'end'; from: number; to: number; cta: string};

// Nền: video/ảnh loop (đặt trong /public) hoặc để trống = nền gradient động giữ chỗ
export type BgLoop = {src?: string; from?: string; to?: string};

const pastel = (a: string, b: string): BgLoop => ({from: a, to: b});

export const postScenes: PostScene[] = [
  {
    type: 'title', from: 0, to: 4,
    user: 'ten_tai_khoan', time: '19 giờ', counter: '1/12',
    text: 'CHỦ ĐỀ CỦA THREAD',
    likes: '12K', comments: '121', reposts: '1,5K', shares: '1,5K',
    title: 'TIÊU ĐỀ GÂY TÒ MÒ, TỐI ĐA 4 DÒNG, NÊU RA VẤN ĐỀ VÀ HỨA HẸN ĐÁP ÁN?',
    bg: pastel('#cfe8d5', '#f3d9c9'),
  },
  {
    type: 'post', from: 4, to: 13, user: 'ten_tai_khoan', time: '19 giờ', counter: '2/12',
    text: [
      'TIÊU ĐỀ PHẦN 2 (IN HOA, ĐẬM)',
      'Đoạn nội dung dài vài dòng: mỗi thẻ chứa khoảng 4–7 dòng chữ, đủ để người xem đọc kịp trong 8–12 giây.',
      '1. Ý chính thứ nhất của phần này.',
      '2. Ý chính thứ hai, viết ngắn gọn.',
    ],
    bg: pastel('#f6d4dc', '#fbeccf'),
  },
  {
    type: 'post', from: 13, to: 22, user: 'ten_tai_khoan', time: '19 giờ', counter: '3/12',
    text: [
      'TIÊU ĐỀ PHẦN 3',
      'Thẻ có thể kèm ảnh minh hoạ phía dưới (điền `image` trong /public). Dùng cho sơ đồ, ảnh người tập, ảnh sản phẩm.',
    ],
    bg: pastel('#d6e4f6', '#e8d6f0'),
  },
  {
    type: 'post', from: 22, to: 28, user: 'ten_tai_khoan', time: '19 giờ', counter: '4/12',
    text: ['TIÊU ĐỀ PHẦN 4', 'Nội dung phần 4. Nền phía sau là clip loop dễ chịu, đổi liên tục để giữ mắt người xem.'],
    bg: pastel('#f9e3b8', '#d8efe4'),
  },
  {type: 'end', from: 28, to: 31, cta: 'Theo dõi để xem phần tiếp theo'},
];
export const POST_DURATION_SEC = 31;
