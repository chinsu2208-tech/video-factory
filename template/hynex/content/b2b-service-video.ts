import { VideoContent } from "../scenes/SceneRunner";

// VIDEO 1 (B2B) – dịch vụ "Gói sản xuất video TikTok" (hynexvn.com/video-tiktok).
// Giọng: ngắn gọn, chuyên nghiệp, lợi ích trước. Dạng mock chat → quy trình 6 bước → thành phẩm.
// Nhóm mục tiêu: chủ shop TikTok Shop có sẵn ảnh + feedback nhưng thiếu người làm content đều đặn.
// Tư liệu b-roll (public/broll: ảnh sản phẩm + 3 feedback thật, đã làm mờ tên khách; public/clips/tapstore-baby.mp4 = video thành phẩm mẫu). Để trống `src` = khung giữ chỗ. Thêm file vào public/broll/ rồi điền src (ảnh .png/.jpg hoặc video .mp4).
// Video thành phẩm trong điện thoại: điền `src` ở bước cuối (file trong public/clips/).
export const b2bServiceVideo: VideoContent = {
  id: "b2b-service-video",
  branch: "b2b",
  orientation: "vertical",
  scenes: [
    { type: "hook", duration: 95, sfx: [{ at: 8, name: "pop" }, { at: 40, name: "ding" }], props: { audience: "Chủ shop TikTok Shop", hook: "Có sẵn ảnh, có sẵn feedback?", promise: "Chúng tôi làm tiếp phần còn lại." } },
    {
      type: "chat",
      duration: 235,
      sfx: [{ at: 8, name: "pop" }, { at: 56, name: "pop" }, { at: 100, name: "pop" }, { at: 146, name: "pop" }, { at: 190, name: "ding" }],
      props: {
        title: "Chat tư vấn · Hynex.Solutions",
        messages: [
          // Khách (trái, trắng): lười + muốn rẻ. Thương hiệu Hynex (phải, tối): bình tĩnh, nêu lợi ích.
          { at: 8, side: "left", kind: "human", bubble: "surface", author: "Chủ shop", text: "Chị muốn xây kênh TikTok, mà chỉ có sẵn sản phẩm + đánh giá khách. Chị lười lắm nha 😅", charsPerFrame: 2.6, size: 28 },
          { at: 56, side: "left", kind: "human", bubble: "surface", author: "Chủ shop", text: "Làm được không? Mà rẻ thôi nhé!", charsPerFrame: 2.4, size: 28 },
          { at: 100, side: "right", kind: "ai", bubble: "accent", author: "Hynex", text: "Được chị! Chị gửi ảnh + đánh giá khách, còn lại em lo.", typing: true, typeFrames: 10, charsPerFrame: 2.4, size: 28 },
          { at: 146, side: "right", kind: "ai", bubble: "accent", author: "Hynex", text: "Từ 2,9 triệu/tháng cho 12 video, rẻ hơn thuê 1 bạn edit.", typing: true, typeFrames: 8, charsPerFrame: 2.4, size: 28, reaction: "👍" },
          { at: 190, side: "right", kind: "ai", bubble: "accent", author: "Hynex", text: "Em cho chị xem 6 bước nhé 👇", typing: true, typeFrames: 6, charsPerFrame: 2.4, size: 28 },
        ],
      },
    },
    { type: "processStep", duration: 135, sfx: [{ at: 14, name: "tick" }, { at: 26, name: "tick" }, { at: 38, name: "tick" }, { at: 50, name: "tick" }], props: { n: 1, total: 6, kind: "research", title: "Nghiên cứu sản phẩm", sub: "Đọc sản phẩm và feedback khách đang có", product: "Xịt thơm Baby 50ml", items: ["Mùi như em bé, không bị ngộp", "Xịt cho con đi học đi chơi đều được", "Mùi phấn rôm, nữ tính yêu lắm"] } },
    { type: "processStep", duration: 135, sfx: [{ at: 18, name: "tick" }, { at: 30, name: "tick" }, { at: 42, name: "tick" }, { at: 74, name: "ding" }], props: { n: 2, total: 6, kind: "hook", title: "Sản xuất hook", sub: "Từ feedback, viết nhiều hook rồi chọn hook mạnh nhất", pickIndex: 1, items: ["Xịt thơm loại nào cũng như nhau?", "Vì sao mấy bà chuộng mùi em bé?", "Khách nhà tui review chuẩn bài"] } },
    { type: "processStep", duration: 140, sfx: [{ at: 16, name: "pop" }, { at: 24, name: "pop" }, { at: 32, name: "pop" }, { at: 40, name: "pop" }], props: { n: 3, total: 6, kind: "broll", title: "Input b-roll", sub: "Gắn ảnh sản phẩm và feedback thật của shop", tiles: [{ label: "Ảnh sản phẩm", src: "broll/product.jpg" }, { label: "Feedback thật", src: "broll/review1.jpg" }, { label: "Feedback thật", src: "broll/review2.jpg" }, { label: "Feedback thật", src: "broll/review3.jpg" }] } },
    { type: "processStep", duration: 140, sfx: [{ at: 16, name: "tick" }, { at: 30, name: "tick" }, { at: 44, name: "tick" }, { at: 58, name: "ding" }], props: { n: 4, total: 6, kind: "script", title: "Lên kịch bản", sub: "Mỗi video có cấu trúc rõ, giọng đúng thương hiệu", items: ["0–3s · Hook: vì sao mấy bà chuộng mùi em bé?", "Feedback thật của khách", "Mùi dịu, nhẹ như vừa giặt", "Chốt: đi học hay đi làm đều hợp"] } },
    { type: "processStep", duration: 125, sfx: [{ at: 10, name: "pop" }], props: { n: 5, total: 6, kind: "voice", title: "Lồng tiếng (voice over)", sub: "Thu giọng đọc theo kịch bản, khớp nhịp hình", voiceLine: "Vì sao mấy bà chuộng mùi em bé?", voiceSrc: "clips/tapstore-baby.mp4", voiceStart: 0, items: ["Giọng đọc tự nhiên", "Khớp nhịp hình", "Chỉnh lại nếu cần"] } },
    { type: "processStep", duration: 160, sfx: [{ at: 10, name: "whoosh" }, { at: 30, name: "pop" }, { at: 62, name: "pop" }, { at: 94, name: "pop" }], props: { n: 6, total: 6, kind: "final", title: "Thành phẩm hoàn chỉnh", sub: "Kèm caption và hashtag, sẵn sàng đăng", src: "clips/tapstore-baby.mp4", srcStart: 150, comments: ["Mùi này thơm thật 😍", "Shop ơi cho xin link!", "Mình mua rồi, mê lắm", "Xịt đi học ok nè 👍", "Giá nhiêu vậy shop?", "Mùi em bé luôn á 🥹", "Chốt đơn luôn 🛒", "Ship Hà Nội nhanh không?"] } },
    { type: "closing", duration: 105, sfx: [{ at: 30, name: "ding" }], props: { headline: "Nhận 2 video mẫu từ chính ảnh của bạn", sub: "Xem kết quả trước khi quyết định.", button: "Nhận 2 video mẫu", handle: "hynexvn.com/video-tiktok" } },
  ],
};
