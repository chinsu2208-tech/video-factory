import { VideoContent } from "../scenes/SceneRunner";

// Demo Media (giọng: hook mạnh, vui, giàu cảm xúc). Cảnh phoneDemo chiếu video thành phẩm
// (public/clips/edu-demo.mp4 = video EDU đã render). Muốn đổi video: thay `src`, hoặc bỏ `src` để hiện khung giữ chỗ.
export const mediaDemo: VideoContent = {
  id: "media-demo",
  branch: "media",
  orientation: "vertical",
  scenes: [
    { type: "hook", duration: 80, sfx: [{ at: 4, name: "pop" }], props: { kicker: "Khoan đã, nhìn đây!", emoji: "😩", text: "Ngồi 2 tiếng mà vẫn chưa có kịch bản?!", accentWords: ["2", "tiếng", "kịch", "bản"], sticker: "Có cách nhanh hơn nè" } },
    {
      type: "chat",
      duration: 180,
      sfx: [{ at: 10, name: "tick" }, { at: 64, name: "pop" }, { at: 118, name: "pop" }],
      props: {
        title: "Bí quyết: hỏi AI đúng cách",
        messages: [
          { at: 6, side: "right", kind: "human", author: "Bạn", text: "Viết giúp mình kịch bản 30 giây về xịt vải thơm với!", charsPerFrame: 2.2 },
          { at: 56, side: "left", kind: "ai", author: "Trợ lý AI", text: "Ok luôn! Mở bằng một câu hook gây tò mò nhé 😎", typing: true, typeFrames: 16, charsPerFrame: 1.8, reaction: "🔥" },
          { at: 112, side: "left", kind: "ai", author: "Trợ lý AI", text: "“Đừng mua xịt vải trước khi xem 3 điều này!”", typing: true, typeFrames: 10, charsPerFrame: 1.6, reaction: "😍" },
        ],
      },
    },
    {
      type: "tutorial",
      duration: 180,
      sfx: [{ at: 20, name: "tick" }, { at: 30, name: "tick" }, { at: 40, name: "tick" }, { at: 78, name: "pop" }, { at: 114, name: "ding" }],
      props: {
        step: "Bước 1: nhập chủ đề",
        url: "app.hynex.vn/kich-ban",
        fieldLabel: "Bạn muốn làm video gì?",
        typed: "Cách chọn xịt vải thơm",
        buttonLabel: "Tạo kịch bản ✨",
        resultTitle: "Kịch bản của bạn đây!",
        resultLines: ["🎣 Hook: Đừng mua trước khi xem", "📌 3 tiêu chí chọn mùi hương", "📣 Lời kêu gọi cuối video"],
        tooltip: "Bấm vào đây!",
        notice: "Xong rồi nè, chỉ mất 10 giây!",
      },
    },
    {
      type: "phoneDemo",
      duration: 170,
      sfx: [{ at: 10, name: "pop" }, { at: 40, name: "pop" }, { at: 70, name: "ding" }],
      props: {
        headline: "Và đây là thành phẩm",
        src: "clips/edu-demo.mp4",
        caption: "API là gì? Ai cũng hiểu được! #hynex",
        stickers: [
          { text: "Xịn chưa!", emoji: "🤩", tone: "#C8FF3D", x: 0, y: 40, rotate: -8, at: 30 },
          { text: "Auto lên video", emoji: "⚡", tone: "#FFD84D", x: 400, y: 560, rotate: 6, at: 54 },
        ],
      },
    },
    { type: "problemSolution", duration: 110, sfx: [{ at: 46, name: "pop" }, { at: 56, name: "ding" }], props: { problem: "Bí ý tưởng, nản ghê!", solution: "Có kịch bản trong 10 giây", solutionSub: "Nhập chủ đề, AI lo phần còn lại." } },
    {
      type: "beforeAfter",
      duration: 130,
      sfx: [{ at: 20, name: "swipe" }],
      props: {
        title: "Cùng một ý, ai cũng dừng lại xem",
        before: ["Hôm nay mình giới thiệu", "một loại xịt vải.", "Mùi thơm và tiện lợi."],
        after: ["Đừng mua xịt vải", "khi chưa xem 3 điều này! 😱", "① Mùi bám lâu", "② Không ố áo", "③ Giá hợp lý"],
      },
    },
    {
      type: "listicle",
      duration: 130,
      sfx: [{ at: 14, name: "pop" }, { at: 30, name: "pop" }, { at: 46, name: "pop" }],
      props: {
        title: "3 mẹo hỏi AI siêu hiệu quả",
        items: [
          { icon: "🎯", title: "Nói rõ mục tiêu", body: "Video để bán hay để dạy?" },
          { icon: "🎤", title: "Cho AI ví dụ mẫu", body: "Nó bắt chước đúng giọng bạn" },
          { icon: "🔁", title: "Xin nhiều phiên bản", body: "Chọn cái ưng nhất" },
        ],
      },
    },
    { type: "cta", duration: 120, sfx: [{ at: 30, name: "ding" }], props: { emoji: "🚀", headline: "Muốn mẹo AI mỗi ngày?", sub: "Học nhanh, làm được ngay!", button: "Theo dõi Hynex", handle: "@hynex" } },
  ],
};
