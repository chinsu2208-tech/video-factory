import { VideoContent } from "../scenes/SceneRunner";

// VIDEO 2 (B2B) – "Lợi ích khi làm việc với Hynex" theo kiểu SO SÁNH: thuê 1 nhân sự vs Hynex (tiền, nhân sự, thời gian).
// Số liệu (cần giữ khớp trang hynexvn.com/video-tiktok):
//  - Hynex gói Duy trì: 25 video/tháng, 3.250.000đ (130.000đ/video).
//  - Thuê 1 nhân sự: khoảng 10 triệu/tháng cho 20–30 video (số do Sếp cung cấp), shop còn tự trả công cụ (CapCut, voice, AI kịch bản).
//  - Chênh lệch = 10.000.000 − 3.250.000 = 6.750.000đ/tháng ≈ 81 triệu/năm (chưa tính công cụ).
//  - Tuyển + đào tạo người mới: 2–3 tuần (số do Sếp cung cấp).
//  - Cảnh "Hynex làm gì": kịch bản viết từ thông tin thương hiệu; voice AI có trong cả 3 gói; guideline (font, logo, giọng văn) do shop cấp, chưa có thì mất phí khởi tạo; bảng idea + lịch cố định từ gói Duy trì.
export const b2bBenefitVideo: VideoContent = {
  id: "b2b-benefit-video",
  branch: "b2b",
  orientation: "vertical",
  scenes: [
    { type: "hook", duration: 95, sfx: [{ at: 8, name: "pop" }, { at: 40, name: "ding" }], props: { audience: "Chủ shop TikTok Shop", hook: "Cùng 25 video mỗi tháng, chênh nhau bao nhiêu tiền?", promise: "Tính thử ngay nhé.", icons: ["💰", "👤", "⏱️"] } },
    {
      type: "versus",
      duration: 290,
      sfx: [{ at: 18, name: "tick" }, { at: 40, name: "tick" }, { at: 62, name: "tick" }, { at: 104, name: "ding" }],
      props: {
        title: "Về tiền",
        left: { name: "Thuê 1 nhân sự", icon: "👤" },
        right: { name: "Hynex Duy trì", icon: "🚀" },
        rows: [
          { label: "Chi phí mỗi tháng", icon: "💰", left: { value: "~10 triệu", sub: "20–30 video" }, right: { value: "3,25 triệu", sub: "25 video" } },
          { label: "Giá mỗi video", icon: "🎬", left: { value: "~400k", sub: "trên 25 video" }, right: { value: "130k", sub: "trên 25 video" } },
          { label: "Công cụ", icon: "🧰", left: { value: "Shop tự trả", sub: "CapCut, voice, AI kịch bản" }, right: { value: "Hynex lo", sub: "không phát sinh thêm" } },
        ],
        banner: { label: "Chênh mỗi tháng", value: 6.75, decimals: 2, suffix: " triệu", sub: "≈ 81 triệu mỗi năm, chưa tính công cụ", at: 110 },
      },
    },
    {
      type: "versus",
      duration: 190,
      sfx: [{ at: 18, name: "tick" }, { at: 40, name: "ding" }],
      props: {
        title: "Về nhân sự",
        left: { name: "Thuê 1 nhân sự", icon: "👤" },
        right: { name: "Hynex Duy trì", icon: "🚀" },
        rows: [
          { label: "Phụ thuộc", icon: "🔗", left: { value: "1 người", sub: "Nghỉ là kênh đứt" }, right: { value: "Quy trình", sub: "Không phụ thuộc ai" } },
          { label: "Giao video", icon: "📅", left: { value: "Tuỳ tình hình", sub: "Dễ trễ lịch đăng" }, right: { value: "Lịch cố định", sub: "Giao đều theo tuần" } },
        ],
      },
    },
    {
      type: "versus",
      duration: 200,
      sfx: [{ at: 18, name: "tick" }, { at: 40, name: "ding" }],
      props: {
        title: "Về thời gian",
        left: { name: "Thuê 1 nhân sự", icon: "👤" },
        right: { name: "Hynex Duy trì", icon: "🚀" },
        rows: [
          { label: "Bắt đầu có video", icon: "⏳", left: { value: "2–3 tuần", sub: "Tuyển và đào tạo", bar: 1 }, right: { value: "Có 2 video mẫu", sub: "Rồi chạy lịch hàng tuần", bar: 0.22 } },
        ],
      },
    },
    {
      type: "service",
      duration: 230,
      sfx: [{ at: 18, name: "pop" }, { at: 30, name: "pop" }, { at: 42, name: "pop" }, { at: 54, name: "pop" }, { at: 66, name: "pop" }, { at: 96, name: "ding" }],
      props: {
        title: "Hynex làm gì cho shop?",
        services: [
          { icon: "📝", name: "Lên kịch bản", benefit: "Viết từ thông tin thương hiệu cung cấp" },
          { icon: "🎙️", name: "Lồng voice AI", benefit: "Có trong cả 3 gói" },
          { icon: "🎬", name: "Edit theo brand guideline", benefit: "Đúng font, logo, giọng văn của shop" },
          { icon: "💡", name: "Bảng idea mỗi tuần", benefit: "Theo keyword và trend" },
          { icon: "#️⃣", name: "Caption + hashtag", benefit: "Theo keyword, sẵn để đăng" },
        ],
        note: "Chưa có brand guideline? Có phí khởi tạo.",
      },
    },
    { type: "checklist", duration: 160, sfx: [{ at: 18, name: "pop" }, { at: 36, name: "pop" }, { at: 54, name: "pop" }], props: { title: "Nói thẳng trước", sub: "Để chủ shop tự cân nhắc", items: [{ text: "Mỗi video sửa nhỏ 1 lần", ok: true }, { text: "Không quay người thật", ok: false }, { text: "Không cam kết số view", ok: false }] } },
    { type: "closing", duration: 120, sfx: [{ at: 30, name: "ding" }], props: { headline: "Nhận 2 video mẫu từ chính ảnh của bạn", sub: "Xem trước, rồi hẵng quyết định.", button: "Nhận 2 video mẫu", handle: "hynexvn.com/video-tiktok" } },
  ],
};
