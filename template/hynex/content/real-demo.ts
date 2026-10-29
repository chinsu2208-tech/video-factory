import { VideoContent } from "../scenes/SceneRunner";

// HYNEX REAL (v0.3 DRAFT) — template cho nội dung QUY TRÌNH / HƯỚNG DẪN AI (không phải PR sản phẩm).
// Trọng tâm: KẾT QUẢ ĐẦU RA + QUY TRÌNH (mô phỏng hoặc ảnh chụp thật) + PHẦN PROMPT. Khung màn hình to, chiếm nhiều diện tích.
// Chữ overlay đan xen: CỨNG (Barlow Condensed hoa) + MỀM (Baloo 2 bo tròn, hồng/lime); dòng lẻ trong `lines` là chữ mềm; từ trong `accent` là chữ mềm hồng.
// Khung giao diện nổi: thêm `ui: [{kind:"search"|"menu"|"pill", ...}]` vào bất kỳ cảnh nào (toạ độ px khung 1080×1920, giữ trong vùng an toàn).
// Không có logo góc; không dẫn website — CTA chỉ hướng người xem comment.
// Nhịp: hook chữ lớn trên cảnh thật → số tiền/thời gian lime → prompt (gõ + AI xử lý + kết quả) → thao tác kéo thả → app thật → kết quả đầu ra → logo + CTA.
// Cảnh: talk, stat, prompt, drag, code, screen (ảnh app thật), result (điện thoại lớn), flow, editorial, cta.
// - Footage thật: bỏ file vào public/clips/, điền `src`/`bg`. Ảnh chụp app: public/app/, truyền `ratio` = cao/rộng.
// - Icon nổi (OrbitIcon) tự có trong prompt/result. Sticker tối thiểu.
// Demo: TAP Store tự động hoá báo cáo đơn mỗi sáng (số liệu mẫu, thay số thật trước khi đăng).
export const realDemo: VideoContent = {
  id: "real-demo",
  branch: "real",
  orientation: "vertical",
  scenes: [
    {
      type: "talk",
      duration: 150, // 0–5 giây đầu = hook + khung thumbnail (frame 45)
      sfx: [{ at: 6, name: "pop" }],
      props: {
        preset: "auto", // mỗi video tự có bố cục hook riêng theo seed; hoặc ép: stack | center-pill | left-bottom | split-right | left-top | center-big | right-bottom | split-left
        src: "clips/real-1.mp4",
        lead: "mỗi sáng đều mở sheet đếm đơn?",
        lines: ["BÁO CÁO ĐƠN", "tự chạy"],
        ui: [
          { kind: "pill", icon: "pin", text: "TAP Store · Hà Nội", x: 64, y: 900, at: 20 },
          { kind: "pill", icon: "cal", text: "29 tháng 10", x: 64, y: 980, at: 30 },
          { kind: "pill", icon: "tag", text: "Chủ shop", x: 64, y: 1060, at: 40 },
          { kind: "menu", x: 250, y: 1160, at: 70, cursor: true },
        ],
        captions: [
          { from: 10, to: 56, text: "Shop mình từng mất cả tiếng" },
          { from: 56, to: 150, text: "chỉ để gom đơn vào một bảng", hl: ["một", "bảng"] },
        ],
      },
    },
    {
      type: "stat",
      duration: 130,
      sfx: [{ at: 14, name: "tick" }, { at: 52, name: "ding" }],
      props: {
        src: "clips/real-2.mp4",
        tag: "Số liệu mẫu",
        ui: [{ kind: "search", text: "báo cáo đơn hàng tự động", x: 64, y: 1390, at: 24, w: 700 }],
        lead: "làm tay mỗi ngày",
        value: 60,
        unit: "phút / ngày",
        versus: { label: "sau khi tự động hoá", value: "~2 phút" },
        caption: "Thay 1 tiếng ngồi gom đơn bằng 1 quy trình chạy lúc 8h sáng.",
      },
    },
    {
      type: "prompt",
      duration: 250,
      sfx: [{ at: 16, name: "tick" }, { at: 96, name: "pop" }, { at: 130, name: "ding" }],
      props: {
        bg: "clips/real-1.mp4",
        step: "Bước 1 · Viết prompt",
        title: "Nói cho AI biết cần gì",
        accent: ["AI", "cần"],
        prompt: "**Đọc đơn TikTok Shop hôm qua**, tính **tổng doanh thu** và **top 3 sản phẩm**, rồi gửi báo cáo qua Zalo lúc **8h sáng**.",
        outputTitle: "Báo cáo 8h sáng",
        output: [
          { kind: "script", text: "Tổng doanh thu hôm qua" },
          { kind: "spark", text: "Top 3 sản phẩm bán chạy" },
          { kind: "done", text: "Đã gửi Zalo cho Sếp" },
        ],
        caption: "Viết như nhắn tin, không cần code.",
      },
    },
    {
      type: "drag",
      duration: 220,
      sfx: [{ at: 30, name: "pop" }, { at: 68, name: "pop" }, { at: 106, name: "pop" }, { at: 150, name: "ding" }],
      props: {
        bg: "clips/real-1.mp4",
        step: "Bước 2 · Nối quy trình",
        title: "Kéo thả 3 khối nối với nhau",
        accent: ["3", "khối"],
        blocks: [
          { icon: "🛒", label: "TikTok Shop", sub: "Có đơn mới" },
          { icon: "📊", label: "Google Sheets", sub: "Thêm dòng vào bảng" },
          { icon: "💬", label: "Zalo", sub: "Gửi báo cáo 8h sáng" },
        ],
        caption: "Không cần biết code cũng nối được.",
      },
    },
    {
      type: "screen",
      duration: 200,
      sfx: [{ at: 10, name: "swipe" }, { at: 50, name: "ding" }, { at: 100, name: "ding" }],
      props: {
        bg: "clips/real-1.mp4",
        step: "Bước 3 · Chạy thật trong app",
        title: "Báo cáo tự về sổ ca trực",
        accent: ["tự", "về"],
        src: "app/shift-log.png",
        ratio: 0.70,
        url: "van-phong-ai.tapco",
        from: { x: 0, y: 0, s: 1 },
        to: { x: 28, y: 36, s: 1.1 },
        marks: [
          { x: 21.5, y: 25.5, w: 7, h: 5, at: 40, label: "09:25 tự chạy" },
          { x: 22.5, y: 41.5, w: 74, h: 14, at: 85, label: "số liệu đã gom sẵn" },
        ],
        caption: "Sếp chỉ cần mở ra và duyệt.",
      },
    },
    {
      type: "result",
      duration: 160,
      sfx: [{ at: 10, name: "ding" }],
      props: {
        bg: "clips/real-3.mp4",
        step: "Kết quả đầu ra",
        title: "8h sáng, số về tận điện thoại",
        accent: ["8h", "số"],
        src: "clips/real-3.mp4",
        chips: [
          { kind: "done", x: 20, y: 120, at: 16 },
          { kind: "spark", x: 560, y: 330, at: 28 },
          { kind: "gear", x: 30, y: 560, at: 40 },
        ],
      },
    },
    {
      type: "cta",
      duration: 120,
      sfx: [{ at: 8, name: "logo" }, { at: 34, name: "ding" }],
      props: {
        bg: "clips/real-3.mp4",
        lead: "muốn xem hướng dẫn chi tiết?",
        headline: "Comment QUY TRÌNH nhé",
        accent: ["QUY", "TRÌNH"],
        button: "Comment “QUY TRÌNH”",
        ui: [{ kind: "search", text: "comment: QUY TRÌNH", x: 64, y: 1290, at: 30, w: 700 }],
      },
    },
  ],
};
