import { VideoContent } from "../scenes/SceneRunner";

// Hynex Edu · "AI từ con số 0" · Tập 1: AI là gì?
// Bản KHÔNG giọng đọc: thời lượng từng cảnh tính theo thời gian đọc chữ trên màn hình.
// Khi có mp3 giọng đọc từ Make, chỉnh lại `duration` (30 fps) cho khớp từng đoạn lời.
// Lời đọc từng cảnh: voice/bai-01.txt (6 dòng, theo thứ tự cảnh).
export const eduAiBai01: VideoContent = {
  id: "edu-ai-bai-01",
  branch: "edu",
  orientation: "vertical",
  scenes: [
    // 1. Mở đầu
    {
      type: "hook",
      duration: 150,
      sfx: [{ at: 40, name: "pop" }, { at: 48, name: "pop" }, { at: 56, name: "pop" }, { at: 62, name: "pop" }],
      props: {
        question: "AI là gì?",
        highlight: "AI",
        sub: "Mình giải thích trong một phút. Bạn không cần biết gì trước đó.",
        icons: ["🖼️", "🧠", "🤖"],
        sticker: "Tin mình đi",
      },
    },
    // 2. Ví dụ đời thường: dạy cháu nhận mèo
    {
      type: "steps",
      duration: 280,
      sfx: [{ at: 20, name: "tick" }, { at: 90, name: "tick" }, { at: 160, name: "tick" }, { at: 232, name: "ding" }],
      props: {
        title: "Dạy cháu nhận mèo",
        steps: [
          { icon: "📸", title: "Cho cháu xem thật nhiều ảnh mèo", detail: "Không đọc định nghĩa nào hết" },
          { icon: "🧒", title: "Cháu tự rút ra đặc điểm", detail: "Tai nhọn, râu dài, đuôi dài" },
          { icon: "🐱", title: "Gặp mèo lạ vẫn gọi đúng", detail: "Kể cả con chưa từng gặp" },
        ],
        stepFrames: 70,
        tip: "Xem nhiều rồi, tự khắc nhận ra!",
      },
    },
    // 3. Định nghĩa
    {
      type: "concept",
      duration: 240,
      sfx: [{ at: 38, name: "pop" }, { at: 50, name: "pop" }, { at: 62, name: "pop" }, { at: 80, name: "ding" }],
      props: {
        term: "AI",
        definition: "AI là máy học từ ví dụ, rồi tự đoán được điều mới.",
        analogy: [
          { icon: "🧒", role: "Cháu nhỏ xem ảnh mèo", maps: "Máy tính xem dữ liệu" },
          { icon: "🐱", role: "Xem thật nhiều ảnh", maps: "Học từ nhiều ví dụ" },
          { icon: "✨", role: "Nhận ra mèo lạ", maps: "Tự đoán điều mới" },
        ],
        tip: "AI học y như cháu nhỏ!",
      },
    },
    // 4. AI quanh bạn
    {
      type: "comparison",
      duration: 220,
      sfx: [{ at: 16, name: "pop" }, { at: 26, name: "pop" }],
      props: {
        title: "AI ở quanh bạn",
        left: { icon: "🧠", title: "Không phải vậy", points: ["Không suy nghĩ như người", "Không phải phép màu"] },
        right: { icon: "📱", title: "Mà là vậy", points: ["Mở khoá bằng khuôn mặt, gợi ý chữ khi nhắn tin", "Đoán giỏi vì đã xem rất nhiều ví dụ"] },
      },
    },
    // 5. Thử ngay
    {
      type: "steps",
      duration: 240,
      sfx: [{ at: 20, name: "tick" }, { at: 70, name: "tick" }, { at: 120, name: "tick" }, { at: 172, name: "ding" }],
      props: {
        title: "Thử ngay hôm nay",
        steps: [
          { icon: "📱", title: "Cầm điện thoại lên", detail: "Của bạn thôi, không cần cài gì" },
          { icon: "🔎", title: "Tìm một chỗ dùng AI", detail: "Quét mặt? Gợi ý chữ?" },
          { icon: "✅", title: "Chỉ cần một chỗ thôi!", detail: "Tìm được là bạn giỏi rồi" },
        ],
        stepFrames: 50,
        tip: "Làm được là hiểu rồi đó!",
      },
    },
    // 6. Nhớ nhé
    {
      type: "recap",
      duration: 270,
      sfx: [{ at: 16, name: "tick" }, { at: 30, name: "tick" }, { at: 44, name: "tick" }, { at: 66, name: "pop" }, { at: 74, name: "ding" }],
      props: {
        title: "Nhớ nhé",
        points: ["AI là máy học từ ví dụ", "Nó đoán giỏi, không suy nghĩ như người", "Tập sau: Dữ liệu là gì?"],
        cheer: "Bạn đã hiểu AI rồi đó, đi tiếp thôi!",
        cta: "Hynex Edu · Làm chủ AI từ con số 0",
      },
    },
  ],
};
