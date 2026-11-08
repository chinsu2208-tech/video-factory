import { VideoContent } from "../scenes/SceneRunner";

// PR "Bộ Văn phòng ảo AI" (vanphongao.hynexvn.com) — nhánh Media, ~45s, chữ + sfx (chưa voice).
// Clip trong điện thoại quay từ landing + bản demo văn phòng 3D (public/clips/vpa-*.mp4).
// Số liệu trong video lấy từ trang landing (14 chương, 8 bàn AI, 8 style). Không công khai giá: CTA mời comment.
const phone = { showUI: false, phoneWidth: 430 };

export const vanphongaoPr: VideoContent = {
  id: "vanphongao-pr",
  branch: "media",
  orientation: "vertical",
  scenes: [
    {
      type: "hook",
      duration: 95,
      sfx: [{ at: 4, name: "pop" }, { at: 60, name: "pop" }],
      props: { kicker: "Không đùa đâu!", emoji: "🏢", text: "Văn phòng 11 nhân viên bằng AI, không tốn lương", accentWords: ["11", "AI,", "lương"], sticker: "Xem nè" },
    },
    {
      type: "phoneDemo",
      duration: 165,
      sfx: [{ at: 4, name: "whoosh" }, { at: 40, name: "pop" }, { at: 80, name: "pop" }],
      props: {
        ...phone,
        headline: "Đây là văn phòng của mình",
        src: "clips/vpa-office.mp4",
        tone: "sky",
        reactions: ["😍", "🔥", "👏"],
        stickers: [
          { text: "Mỗi bàn 1 nhân viên AI", emoji: "🤖", tone: "#C8FF3D", x: 0, y: 120, rotate: -6, at: 36 },
          { text: "Tự chạy theo ca", emoji: "⏰", tone: "#FFD84D", x: 330, y: 640, rotate: 5, at: 76 },
        ],
      },
    },
    {
      type: "problemSolution",
      duration: 110,
      sfx: [{ at: 46, name: "pop" }, { at: 56, name: "ding" }],
      props: { problem: "Có AI rồi mà việc vẫn dồn lên đầu bạn?", solution: "Giao cho bàn AI tự chạy", solutionSub: "Bạn chỉ duyệt việc cần người thật." },
    },
    {
      type: "phoneDemo",
      duration: 190,
      sfx: [{ at: 4, name: "swipe" }, { at: 54, name: "tick" }, { at: 105, name: "tick" }, { at: 156, name: "tick" }],
      props: {
        ...phone,
        headline: "Mở app là thấy hết việc",
        src: "clips/vpa-tabs.mp4",
        tone: "violet",
        reactions: ["👀", "✅"],
        stickers: [
          { text: "Giao việc 1 chạm", emoji: "👆", tone: "#C8FF3D", x: 0, y: 200, rotate: -6, at: 40 },
          { text: "Lịch ca trực", emoji: "🗓️", tone: "#FFD84D", x: 360, y: 600, rotate: 6, at: 100 },
        ],
      },
    },
    {
      type: "phoneDemo",
      duration: 165,
      sfx: [{ at: 4, name: "whoosh" }, { at: 50, name: "ding" }],
      props: {
        ...phone,
        headline: "Báo cáo đọc 10 giây là nắm",
        src: "clips/vpa-report.mp4",
        tone: "white",
        reactions: ["📊", "🔥"],
        stickers: [{ text: "Có hình khối, không tường chữ", emoji: "📊", tone: "#C8FF3D", x: 0, y: 560, rotate: -5, at: 46 }],
      },
    },
    {
      type: "listicle",
      duration: 135,
      sfx: [{ at: 14, name: "pop" }, { at: 30, name: "pop" }, { at: 46, name: "pop" }],
      props: {
        title: "Trong bộ có gì?",
        items: [
          { icon: "📘", title: "14 chương hướng dẫn", body: "Từng bước, rút từ hệ thống chạy thật" },
          { icon: "📋", title: "Thư viện 8 bàn AI", body: "Prompt dán vào Claude là chạy" },
          { icon: "🎨", title: "8 style văn phòng", body: "Kèm template Google Sheet 5 tab" },
        ],
      },
    },
    {
      type: "phoneDemo",
      duration: 200,
      sfx: [{ at: 45, name: "pop" }, { at: 90, name: "pop" }, { at: 135, name: "pop" }, { at: 180, name: "pop" }],
      props: {
        ...phone,
        headline: "Đổi giao diện 1 chạm",
        src: "clips/vpa-styles.mp4",
        tone: "peach",
        reactions: ["🎄", "🌳", "🏖️", "☕"],
        stickers: [
          { text: "Giáng sinh", emoji: "🎄", tone: "#C8FF3D", x: 0, y: 160, rotate: -6, at: 45 },
          { text: "Bãi biển", emoji: "🏖️", tone: "#FFD84D", x: 400, y: 560, rotate: 6, at: 135 },
        ],
      },
    },
    {
      type: "chat",
      duration: 150,
      sfx: [{ at: 8, name: "tick" }, { at: 70, name: "pop" }],
      props: {
        title: "Không biết code?",
        tone: "sun",
        messages: [
          { at: 6, side: "right", kind: "human", author: "Bạn", text: "Mình không biết code, làm được không?", charsPerFrame: 2.2 },
          { at: 64, side: "left", kind: "ai", author: "Hynex", text: "Được nha! Làm theo hướng dẫn, dán prompt vào Claude là chạy 👌", typing: true, typeFrames: 14, charsPerFrame: 1.8, reaction: "😍" },
        ],
      },
    },
    {
      type: "cta",
      duration: 135,
      sfx: [{ at: 30, name: "ding" }],
      props: { emoji: "🏢", headline: "Văn phòng ảo AI", sub: "Comment để nhận bộ + giá ưu đãi", button: "Comment “VĂN PHÒNG”" },
    },
  ],
};
