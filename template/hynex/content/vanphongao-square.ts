import { VideoContent } from "../scenes/SceneRunner";

// Video vuông 1:1 cho Facebook — Bộ Văn phòng ảo AI: giới thiệu tính năng + so sánh tiết kiệm.
// Chữ + sfx; độ dài từng cảnh canh theo script voice (~2,9 từ/giây), voice chèn sau.
// Không công khai giá gói. Lương ~10 triệu/người là ƯỚC TÍNH (số Sếp đưa cho dịch vụ Hynex) — chờ Sếp chốt.
const phone = { showUI: false, phoneWidth: 360 };

export const vanphongaoSquare: VideoContent = {
  id: "vanphongao-square",
  branch: "media",
  orientation: "square",
  scenes: [
    {
      type: "hook",
      duration: 105,
      sfx: [{ at: 4, name: "pop" }, { at: 60, name: "pop" }],
      props: { kicker: "Thử tính xem", emoji: "🤔", text: "Thuê 9 nhân viên, mỗi tháng tốn bao nhiêu?", accentWords: ["9", "nhân", "viên"], sticker: "Hay là…" },
    },
    {
      type: "phoneDemo",
      duration: 180,
      sfx: [{ at: 4, name: "whoosh" }, { at: 40, name: "pop" }],
      props: {
        ...phone,
        headline: "Dựng 1 văn phòng AI như này",
        src: "clips/vpa-office.mp4",
        tone: "sky",
        reactions: ["😍", "🔥", "👏"],
        stickers: [
          { text: "Mỗi bàn 1 nhân viên AI", emoji: "🤖", tone: "#C8FF3D", x: 0, y: 160, rotate: -6, at: 36 },
          { text: "Tự chạy theo ca", emoji: "⏰", tone: "#FFD84D", x: 640, y: 520, rotate: 5, at: 90 },
        ],
      },
    },
    {
      type: "phoneDemo",
      duration: 175,
      sfx: [{ at: 4, name: "swipe" }, { at: 50, name: "tick" }, { at: 100, name: "tick" }],
      props: {
        ...phone,
        headline: "Mở app là thấy hết việc",
        src: "clips/vpa-tabs.mp4",
        tone: "violet",
        reactions: ["👀", "✅"],
        stickers: [
          { text: "Giao việc 1 chạm", emoji: "👆", tone: "#C8FF3D", x: 0, y: 200, rotate: -6, at: 40 },
          { text: "Lịch ca trực", emoji: "🗓️", tone: "#FFD84D", x: 640, y: 440, rotate: 6, at: 80 },
          { text: "Nhân sự theo phòng", emoji: "👥", tone: "#FF9EC7", x: 0, y: 600, rotate: -4, at: 120 },
        ],
      },
    },
    {
      type: "phoneDemo",
      duration: 140,
      sfx: [{ at: 30, name: "pop" }, { at: 60, name: "pop" }, { at: 90, name: "pop" }],
      props: {
        ...phone,
        headline: "5 giao diện, đổi 1 chạm",
        src: "clips/vpa-styles.mp4",
        tone: "peach",
        reactions: ["🎄", "🌳", "🏖️", "☕"],
        stickers: [
          { text: "Giáng sinh", emoji: "🎄", tone: "#C8FF3D", x: 20, y: 200, rotate: -6, at: 30 },
          { text: "Bãi biển", emoji: "🏖️", tone: "#FFD84D", x: 660, y: 500, rotate: 6, at: 80 },
        ],
      },
    },
    {
      type: "versus",
      duration: 230,
      sfx: [{ at: 18, name: "tick" }, { at: 40, name: "tick" }, { at: 104, name: "ding" }],
      props: {
        title: "Về tiền",
        left: { name: "Thuê 9 người", icon: "👥" },
        right: { name: "Văn phòng AI", icon: "🤖" },
        rows: [
          { label: "Lương mỗi tháng", icon: "💰", left: { value: "~90 triệu", sub: "9 × ~10 triệu (ước tính)" }, right: { value: "0đ lương", sub: "Trả 1 lần, chỉ cần gói Claude" } },
        ],
        banner: { label: "Tiết kiệm mỗi tháng tới", value: 90, suffix: " triệu", sub: "Ước tính, chưa tính BHXH và công cụ", at: 100 },
      },
    },
    {
      type: "versus",
      duration: 200,
      sfx: [{ at: 18, name: "tick" }, { at: 40, name: "ding" }],
      props: {
        title: "Về thời gian",
        left: { name: "Thuê 9 người", icon: "👥" },
        right: { name: "Văn phòng AI", icon: "🤖" },
        rows: [
          { label: "Bắt đầu chạy việc", icon: "⏳", left: { value: "2–3 tuần", sub: "Tuyển và đào tạo", bar: 1 }, right: { value: "1 buổi", sub: "Bàn AI đầu tiên chạy được", bar: 0.08 } },
        ],
      },
    },
    {
      type: "versus",
      duration: 200,
      sfx: [{ at: 18, name: "tick" }, { at: 40, name: "tick" }, { at: 62, name: "ding" }],
      props: {
        title: "Về vận hành",
        left: { name: "Thuê 9 người", icon: "👥" },
        right: { name: "Văn phòng AI", icon: "🤖" },
        rows: [
          { label: "Khi nghỉ", icon: "🔗", left: { value: "Việc đứt", sub: "Nghỉ phép, nghỉ việc" }, right: { value: "Chạy theo ca", sub: "Kể cả lúc bạn ngủ" } },
          { label: "Báo cáo", icon: "📊", left: { value: "Tự gom", sub: "Hỏi từng người" }, right: { value: "Có sẵn", sub: "Báo cáo trực quan mỗi sáng" } },
        ],
      },
    },
    {
      type: "listicle",
      duration: 225,
      sfx: [{ at: 14, name: "pop" }, { at: 30, name: "pop" }, { at: 46, name: "pop" }, { at: 62, name: "pop" }, { at: 78, name: "pop" }],
      props: {
        title: "Trong bộ có gì?",
        items: [
          { icon: "🤖", title: "9 bàn AI dựng sẵn", body: "Kịch bản & voice, Xu hướng, Quản lý…" },
          { icon: "🏢", title: "Văn phòng 3D, 5 giao diện", body: "Chạy số thật, hiện đúng nhân sự của bạn" },
          { icon: "📊", title: "Mẫu báo cáo + Sheet 5 tab", body: "Đọc 10 giây là nắm" },
          { icon: "📘", title: "Hướng dẫn 5 bước", body: "Kèm 3 skill điều phối, quy tắc phối hợp" },
        ],
      },
    },
    {
      type: "cta",
      duration: 130,
      sfx: [{ at: 30, name: "ding" }],
      props: { emoji: "🏢", headline: "Văn phòng ảo AI", sub: "Comment để nhận bộ + giá ưu đãi", button: "Comment “VĂN PHÒNG”" },
    },
  ],
};
