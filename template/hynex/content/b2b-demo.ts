import { VideoContent } from "../scenes/SceneRunner";

// Demo B2B (giọng: ngắn gọn, chuyên nghiệp, nêu bật lợi ích). Khổ 9:16 trước; đổi orientation sang "horizontal" cho YouTube.
// Số liệu dưới đây là DỮ LIỆU MẪU để minh hoạ template, không phải số thật của khách hàng nào.
export const b2bDemo: VideoContent = {
  id: "b2b-demo",
  branch: "b2b",
  orientation: "vertical",
  scenes: [
    { type: "intro", duration: 85, sfx: [{ at: 30, name: "tick" }, { at: 38, name: "tick" }, { at: 46, name: "tick" }], props: { eyebrow: "Tự động hoá đơn hàng", company: "Xử lý đơn nhanh gấp 6 lần", line: "Từ 80 phút xuống 12 phút mỗi đơn, ít sai sót hơn.", facts: [{ value: "5", label: "bước chuẩn hoá" }, { value: "3", label: "kênh kết nối" }, { value: "24/7", label: "tự động chạy" }] } },
    { type: "problemSolution", duration: 100, sfx: [{ at: 26, name: "ding" }], props: { title: "Bớt việc tay, bớt rủi ro", problems: ["Nhập đơn bằng tay", "Duyệt qua nhiều người", "Khó theo dõi tiến độ"], solutions: ["Đơn tự về một nơi", "Quy tắc duyệt rõ ràng", "Theo dõi theo thời gian thực"] } },
    {
      type: "workflow",
      duration: 150,
      sfx: [{ at: 24, name: "tick" }, { at: 44, name: "tick" }, { at: 64, name: "tick" }, { at: 84, name: "tick" }, { at: 104, name: "ding" }],
      props: {
        title: "5 bước, 20 phút là xong",
        steps: [
          { label: "Nhận đơn", sub: "Tự thu từ mọi kênh bán", time: "1 phút" },
          { label: "Kiểm tra", sub: "Đối chiếu tồn kho, thông tin", time: "2 phút" },
          { label: "Duyệt", sub: "Theo quy tắc đặt sẵn", time: "5 phút" },
          { label: "Xử lý", sub: "Tạo phiếu, báo kho đóng gói", time: "10 phút" },
          { label: "Báo cáo", sub: "Cập nhật bảng điều khiển", time: "Tự động" },
        ],
        activeFrames: 20,
      },
    },
    {
      type: "dataStory",
      duration: 130,
      sfx: [{ at: 14, name: "tick" }, { at: 26, name: "tick" }],
      props: {
        title: "Kết quả dự kiến (mẫu)",
        metrics: [
          { icon: "⏱️", label: "Thời gian mỗi đơn", value: 12, suffix: " phút", delta: "Giảm 85%" },
          { icon: "🎯", label: "Tỉ lệ sai sót", value: 1.2, suffix: "%", delta: "Giảm 70%", decimals: 1 },
        ],
        chartTitle: "Số đơn xử lý mỗi ngày",
        chart: [{ label: "T1", value: 40 }, { label: "T2", value: 55 }, { label: "T3", value: 80 }, { label: "T4", value: 120 }, { label: "T5", value: 160 }],
      },
    },
    {
      type: "case",
      duration: 110,
      sfx: [{ at: 14, name: "tick" }, { at: 24, name: "tick" }, { at: 34, name: "ding" }],
      props: {
        title: "Cửa hàng 3 kênh bán (minh hoạ)",
        client: "Mùa cao điểm",
        challenge: "đơn tăng gấp đôi",
        rows: [
          { metric: "Thời gian / đơn", before: "80 phút", after: "12 phút" },
          { metric: "Đơn sai", before: "6%", after: "1.2%" },
          { metric: "Người nhập liệu", before: "4", after: "1" },
        ],
      },
    },
    {
      type: "proposal",
      duration: 110,
      props: {
        title: "Chọn gói phù hợp",
        plans: [
          { name: "Khởi động", price: "Gói 1", items: ["1 kênh bán", "Báo cáo cơ bản"] },
          { name: "Tăng tốc", price: "Gói 2", items: ["Nhiều kênh", "Quy tắc duyệt riêng", "Báo cáo ngày"], highlight: true },
          { name: "Toàn diện", price: "Gói 3", items: ["Tích hợp kho, kế toán", "Đào tạo đội ngũ"] },
        ],
      },
    },
    { type: "closing", duration: 100, sfx: [{ at: 30, name: "ding" }], props: { headline: "Sẵn sàng chạy nhanh hơn?", sub: "Tư vấn buổi đầu miễn phí.", button: "Đặt lịch tư vấn", handle: "hynex.vn" } },
  ],
};
