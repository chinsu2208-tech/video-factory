import { VideoContent } from "../scenes/SceneRunner";

// Demo EDU (giọng: truyền cảm hứng, tận tình, ví dụ dễ hiểu). Đổi nội dung ở đây, không đụng animation.
export const eduDemo: VideoContent = {
  id: "edu-demo",
  branch: "edu",
  orientation: "vertical",
  scenes: [
    {
      type: "hook",
      duration: 90,
      sfx: [{ at: 40, name: "pop" }, { at: 48, name: "pop" }, { at: 56, name: "pop" }],
      props: { question: "Ai cũng hiểu được API, kể cả bạn!", highlight: "API", sub: "Mình giải thích bằng một bữa ăn nhà hàng thôi. Dễ lắm!", icons: ["📱", "🧑‍🍳", "🍜"], sticker: "Tin mình đi" },
    },
    {
      type: "concept",
      duration: 140,
      sfx: [{ at: 40, name: "pop" }, { at: 52, name: "pop" }, { at: 64, name: "pop" }],
      props: {
        term: "API",
        definition: "API là người đưa tin giữa hai phần mềm.",
        analogy: [
          { icon: "🙋", role: "Bạn ngồi bàn", maps: "App trên điện thoại" },
          { icon: "🧑‍🍳", role: "Anh phục vụ", maps: "API, chạy đi chạy lại" },
          { icon: "🍳", role: "Nhà bếp", maps: "Nơi giữ dữ liệu" },
        ],
        tip: "Bạn không vào bếp, bạn chỉ gọi món!",
      },
    },
    {
      type: "steps",
      duration: 130,
      sfx: [{ at: 20, name: "tick" }, { at: 50, name: "tick" }, { at: 80, name: "ding" }],
      props: {
        title: "Gọi món chỉ có 3 bước",
        steps: [
          { icon: "📨", title: "Bạn gọi món", detail: "App hỏi: thời tiết Hà Nội hôm nay?" },
          { icon: "⚙️", title: "Bếp nấu", detail: "Server tìm đúng dữ liệu cho bạn" },
          { icon: "📬", title: "Món ra bàn", detail: "App hiện: 27°C, trời nắng đẹp" },
        ],
        stepFrames: 30,
        tip: "Nhanh trong tích tắc luôn!",
      },
    },
    {
      type: "comparison",
      duration: 110,
      props: {
        title: "Có API khác gì không có?",
        left: { icon: "😵", title: "Không có API", points: ["Tự chép số liệu bằng tay", "Chậm, dễ nhầm"] },
        right: { icon: "😎", title: "Có API", points: ["Dữ liệu tự cập nhật", "Nhanh và chính xác"] },
      },
    },
    {
      type: "process",
      duration: 140,
      sfx: [{ at: 14, name: "tick" }, { at: 30, name: "tick" }, { at: 46, name: "tick" }, { at: 62, name: "ding" }],
      props: {
        title: "Hành trình của một yêu cầu",
        nodes: [
          { icon: "📱", label: "App gửi yêu cầu", sub: "Ví dụ: cho tôi thời tiết" },
          { icon: "🚪", label: "API đón nhận", sub: "Kiểm tra rồi chuyển vào bếp" },
          { icon: "🖥️", label: "Server xử lý", sub: "Lấy dữ liệu trong kho" },
          { icon: "📦", label: "Gửi kết quả về", sub: "Dưới dạng JSON" },
        ],
        tip: "Mỗi lần bạn mở app là có một chuyến đi như vậy!",
      },
    },
    {
      type: "case",
      duration: 120,
      sfx: [{ at: 14, name: "pop" }, { at: 30, name: "pop" }, { at: 46, name: "ding" }],
      props: {
        title: "Ví dụ quen thuộc: app thời tiết",
        situation: "App muốn hiện nhiệt độ nhưng đâu có tự đo được.",
        action: "App nhờ API của đài khí tượng, 10 phút hỏi một lần.",
        result: "Bạn luôn thấy số mới nhất, không tốn công.",
      },
    },
    {
      type: "quiz",
      duration: 140,
      sfx: [{ at: 80, name: "ding" }],
      props: {
        question: "Trong nhà hàng, API là ai nhỉ?",
        options: [{ text: "Bạn ngồi bàn", icon: "🙋" }, { text: "Anh phục vụ", icon: "🧑‍🍳" }, { text: "Nhà bếp", icon: "🍳" }],
        correctIndex: 1,
        revealAt: 80,
        explain: "Đúng rồi! API là người đưa tin.",
      },
    },
    {
      type: "recap",
      duration: 130,
      sfx: [{ at: 14, name: "tick" }, { at: 28, name: "tick" }, { at: 42, name: "ding" }],
      props: {
        title: "Bạn giỏi quá, nhớ nhé",
        points: ["API là người đưa tin giữa phần mềm", "Gọi món, bếp nấu, món ra bàn", "Nhờ API, dữ liệu tự chạy cho bạn"],
        cheer: "Bạn đã hiểu API rồi đó, đi tiếp thôi!",
        cta: "Theo dõi Hynex Edu",
      },
    },
  ],
};
