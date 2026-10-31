import { VideoContent } from "../scenes/SceneRunner";

// Demo bộ linh kiện cảnh mới của Hynex Edu (không có giọng). Mỗi cảnh ~4s.
export const eduComponentsDemo: VideoContent = {
  id: "edu-components-demo",
  branch: "edu",
  orientation: "vertical",
  sound: false,
  scenes: [
    { type: "chat", duration: 150, props: { title: "Hỏi ChatGPT thử nhé", messages: [{ kind: "human", text: "Gợi ý cho mình món tối nay với trứng và cà chua" }, { kind: "ai", text: "Trứng xào cà chua nhé! Phi hành, cho cà chua, đổ trứng vào. Xong trong 10 phút." }], tip: "Hỏi như nói chuyện thôi!" } },
    { type: "phone", duration: 120, props: { title: "Mở thư viện ảnh", appTitle: "Ảnh", rows: [{ icon: "🌸", text: "Hoa", sub: "12 ảnh" }, { icon: "🐱", text: "Mèo", sub: "8 ảnh" }, { icon: "🍜", text: "Món ăn", sub: "30 ảnh" }, { icon: "🏖️", text: "Biển", sub: "21 ảnh" }, { icon: "👨‍👩‍👧", text: "Gia đình", sub: "45 ảnh" }], tapIndex: 1, tapAt: 70, caption: "Máy tự gom ảnh theo chủ đề!" } },
    { type: "prompt", duration: 220, props: { title: "Viết câu lệnh rõ ràng", prompt: "Viết giúp mình tin nhắn chúc mừng sinh nhật mẹ, ngắn, ấm áp", result: "Mẹ yêu ơi, chúc mẹ tuổi mới thật nhiều sức khoẻ và niềm vui. Con thương mẹ nhiều lắm!", tip: "Nói rõ ai, việc gì, giọng thế nào" } },
    { type: "bignum", duration: 100, props: { label: "Con số đáng nhớ", value: 1000, suffix: "+", sub: "bữa nấu đã học xong trước khi đầu bếp viết sách", icon: "🍲", tip: "Học nhiều, dùng nhanh" } },
    { type: "beforeafter", duration: 140, props: { title: "Hỏi sao cho trúng?", before: { text: "Viết cho mình cái gì đó" }, after: { text: "Viết lời chúc sinh nhật mẹ, 2 câu, giọng ấm áp" }, tip: "Càng rõ, càng đúng ý" } },
    { type: "checklist", duration: 130, props: { title: "Dùng AI an toàn", items: [{ text: "Kiểm tra lại thông tin quan trọng", ok: true }, { text: "Tự hỏi AI khi chưa hiểu", ok: true }, { text: "Gửi số thẻ ngân hàng", ok: false }, { text: "Gửi mật khẩu", ok: false }], tip: "Đừng chia sẻ thông tin nhạy cảm" } },
    { type: "myth", duration: 120, props: { myth: "AI biết hết mọi thứ", fact: "AI học từ dữ liệu, có lúc vẫn sai", tip: "Luôn kiểm tra lại nhé" } },
    { type: "timeline", duration: 130, props: { title: "AI học như thế nào", events: [{ time: "BƯỚC 1", title: "Đọc thật nhiều", detail: "Sách, bài viết, hình ảnh" }, { time: "BƯỚC 2", title: "Tìm quy luật", detail: "Mẫu lặp lại" }, { time: "BƯỚC 3", title: "Trả lời bạn", detail: "Trong vài giây" }], tip: "Học xong mới dùng được" } },
    { type: "countdown", duration: 130, props: { from: 3, lead: "Chuẩn bị nhé", go: "Thử ngay!", sub: "Mở điện thoại lên nào" } },
    { type: "notify", duration: 120, props: { title: "AI nhắc việc giúp bạn", items: [{ icon: "💊", title: "8:00 · Nhắc uống thuốc", body: "Đừng quên nhé" }, { icon: "🛒", title: "17:30 · Đi chợ", body: "Mua trứng, cà chua" }, { icon: "📞", title: "19:00 · Gọi cho con", body: "Hỏi thăm một chút" }], tip: "Có AI, nhớ việc dễ hơn" } },
    { type: "table", duration: 130, props: { title: "So sánh nhanh", columns: ["Việc", "Người", "AI"], rows: [["Tốc độ", "Chậm", "Nhanh"], ["Mệt mỏi", "Có", "Không"], ["Hiểu cảm xúc", "Giỏi", "Còn yếu"]], tip: "Mỗi bên giỏi một việc" } },
    { type: "photo", duration: 110, props: { title: "AI nhìn ảnh", src: "broll/product.jpg", caption: "AI nhận ra đồ vật trong ảnh", tip: "Ảnh cũng là dữ liệu" } },
  ],
};
