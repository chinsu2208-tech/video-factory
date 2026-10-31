import { VideoContent } from "../scenes/SceneRunner";

// Hynex Edu · "AI từ con số 0" · Tập 3: Bộ não của AI là gì? (Mô hình)
// Giọng đọc public/voice/bai-03.mp3 (Make). 30 fps, tổng 1521 khung ≈ 50.7s. Lời đọc: voice/bai-03.txt (6 dòng = 6 cảnh).
export const eduAiBai03: VideoContent = {
  id: "edu-ai-bai-03",
  branch: "edu",
  orientation: "vertical",
  voice: "voice/bai-03.mp3",
  scenes: [
    {
      type: "hook",
      duration: 250,
      sfx: [{ at: 40, name: "pop" }, { at: 52, name: "pop" }, { at: 64, name: "pop" }],
      props: { question: "AI học xong, giữ lại gì?", highlight: "giữ lại", sub: "Câu trả lời: một mô hình.", icons: ["🎓", "🧠", "📘"], sticker: "Nghe nè" },
    },
    {
      type: "steps",
      duration: 299,
      sfx: [{ at: 20, name: "tick" }, { at: 110, name: "tick" }, { at: 200, name: "tick" }, { at: 275, name: "ding" }],
      props: {
        title: "Cuốn sách của đầu bếp",
        steps: [
          { icon: "🍲", title: "Nấu hàng nghìn bữa", detail: "Mỗi bữa là một lần học" },
          { icon: "📖", title: "Viết hết thành sách", detail: "Gom mọi kinh nghiệm" },
          { icon: "🔍", title: "Mở sách là có đáp án", detail: "Ai hỏi món gì cũng trả lời" },
        ],
        stepFrames: 90,
        tip: "Cuốn sách đó là mô hình!",
      },
    },
    {
      type: "concept",
      duration: 187,
      sfx: [{ at: 38, name: "pop" }, { at: 60, name: "pop" }, { at: 82, name: "pop" }, { at: 110, name: "ding" }],
      props: {
        term: "Mô hình",
        definition: "Mô hình là kết quả sau khi AI học xong.",
        analogy: [
          { icon: "⏳", role: "Học", maps: "Tốn thời gian và tiền" },
          { icon: "⚡", role: "Dùng", maps: "Rất nhanh" },
          { icon: "🧠", role: "Mô hình", maps: "Bộ não của AI" },
        ],
        tip: "Mô hình là bộ não của AI!",
      },
    },
    {
      type: "comparison",
      duration: 364,
      sfx: [{ at: 30, name: "pop" }, { at: 60, name: "pop" }],
      props: {
        title: "Mỗi app, một bộ não",
        left: { icon: "📗", title: "Nhà xuất bản A", points: ["Sách nấu ăn riêng", "Công thức riêng"] },
        right: { icon: "📘", title: "Nhà xuất bản B", points: ["Sách nấu ăn riêng", "Câu trả lời khác"] },
      },
    },
    {
      type: "steps",
      duration: 214,
      sfx: [{ at: 20, name: "tick" }, { at: 80, name: "tick" }, { at: 140, name: "tick" }, { at: 190, name: "ding" }],
      props: {
        title: "Thử ngay nhé",
        steps: [
          { icon: "📱", title: "Mở điện thoại", detail: "Xem danh sách ứng dụng" },
          { icon: "🔎", title: "Tìm ứng dụng AI", detail: "Chưa có cũng không sao" },
        ],
        stepFrames: 65,
        tip: "Tập sau mình nói tiếp!",
      },
    },
    {
      type: "recap",
      duration: 207,
      sfx: [{ at: 16, name: "tick" }, { at: 40, name: "tick" }, { at: 64, name: "tick" }, { at: 90, name: "pop" }, { at: 110, name: "ding" }],
      props: {
        title: "Nhớ nhé",
        points: ["Mô hình là bộ não của AI", "Học thì lâu, dùng thì nhanh", "Tập sau: ChatGPT có phải AI?"],
        cheer: "Bạn đã hiểu mô hình rồi đó!",
        cta: "Hynex Edu · Làm chủ AI từ con số 0",
      },
    },
  ],
};
