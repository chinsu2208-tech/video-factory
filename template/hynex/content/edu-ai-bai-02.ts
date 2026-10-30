import { VideoContent } from "../scenes/SceneRunner";

// Hynex Edu · "AI từ con số 0" · Tập 2: Dữ liệu là gì?
// Có giọng đọc (public/voice/bai-02.mp3, tạo từ Make). Thời lượng cảnh căn theo giọng, 30 fps, tổng 1659 khung = 55.3s.
// Lời đọc từng cảnh: voice/bai-02.txt (6 dòng, theo thứ tự cảnh).
export const eduAiBai02: VideoContent = {
  id: "edu-ai-bai-02",
  branch: "edu",
  orientation: "vertical",
  voice: "voice/bai-02.mp3",
  scenes: [
    {
      type: "hook",
      duration: 201,
      sfx: [{ at: 40, name: "pop" }, { at: 52, name: "pop" }, { at: 64, name: "pop" }],
      props: { question: "AI học từ cái gì?", highlight: "học", sub: "Câu trả lời ngắn: dữ liệu.", icons: ["❓", "📚", "🧠"], sticker: "Nghe nè" },
    },
    {
      type: "steps",
      duration: 272,
      sfx: [{ at: 20, name: "tick" }, { at: 105, name: "tick" }, { at: 190, name: "tick" }, { at: 250, name: "ding" }],
      props: {
        title: "Cuốn sổ của bà",
        steps: [
          { icon: "🍲", title: "Bà nấu hàng nghìn bữa", detail: "Mỗi bữa là một lần học" },
          { icon: "📓", title: "Bà ghi lại từng bữa", detail: "Thành một cuốn sổ" },
          { icon: "✨", title: "Cuốn sổ đó là dữ liệu", detail: "Dữ liệu của bà" },
        ],
        stepFrames: 85,
        tip: "Ghi lại, là có dữ liệu!",
      },
    },
    {
      type: "concept",
      duration: 274,
      sfx: [{ at: 38, name: "pop" }, { at: 60, name: "pop" }, { at: 82, name: "pop" }, { at: 110, name: "ding" }],
      props: {
        term: "Dữ liệu",
        definition: "Dữ liệu là thông tin được ghi lại.",
        analogy: [
          { icon: "🔤", role: "Chữ và con số", maps: "Tin nhắn, hoá đơn" },
          { icon: "🖼️", role: "Hình ảnh", maps: "Ảnh bạn chụp" },
          { icon: "🎙️", role: "Tiếng nói", maps: "Đoạn ghi âm" },
        ],
        tip: "Dữ liệu là thức ăn của AI!",
      },
    },
    {
      type: "comparison",
      duration: 339,
      sfx: [{ at: 30, name: "pop" }, { at: 60, name: "pop" }],
      props: {
        title: "Dữ liệu tốt, AI giỏi",
        left: { icon: "📕", title: "Dữ liệu sai", points: ["AI học sai", "Trả lời sai"] },
        right: { icon: "📗", title: "Dữ liệu đúng", points: ["AI học đúng", "Càng nhiều càng giỏi"] },
      },
    },
    {
      type: "steps",
      duration: 297,
      sfx: [{ at: 20, name: "tick" }, { at: 110, name: "tick" }, { at: 200, name: "tick" }, { at: 270, name: "ding" }],
      props: {
        title: "Thử ngay nhé",
        steps: [
          { icon: "📱", title: "Mở thư viện ảnh", detail: "Trên điện thoại của bạn" },
          { icon: "🔎", title: "Gõ chữ hoa vào ô tìm", detail: "Hoặc chữ biển" },
          { icon: "🌸", title: "Máy tự tìm ra ảnh", detail: "Dù bạn chưa đặt tên ảnh" },
        ],
        stepFrames: 90,
        tip: "Đó là AI học từ dữ liệu!",
      },
    },
    {
      type: "recap",
      duration: 276,
      sfx: [{ at: 16, name: "tick" }, { at: 40, name: "tick" }, { at: 64, name: "tick" }, { at: 90, name: "pop" }, { at: 110, name: "ding" }],
      props: {
        title: "Nhớ nhé",
        points: ["Dữ liệu là thông tin ghi lại", "Dữ liệu là thức ăn của AI", "Tập sau: Mô hình là gì?"],
        cheer: "Bạn đã hiểu dữ liệu rồi đó!",
        cta: "Hynex Edu · Làm chủ AI từ con số 0",
      },
    },
  ],
};
