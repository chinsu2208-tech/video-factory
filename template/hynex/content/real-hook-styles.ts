import { VideoContent } from "../scenes/SceneRunner";

// Dùng 1 template cho NHIỀU video: chỉ 0–5 giây đầu (hook + thumbnail) có bố cục khác nhau theo từng video.
// - `preset: "auto"` → bố cục tự chọn cố định theo `seed` (mặc định = nội dung hook): đổi vị trí, căn lề, cỡ chữ, kiểu dòng dẫn,
//   thứ tự chữ cứng/mềm, màu chữ mềm, độ nghiêng. Cùng seed ra cùng kiểu; 100 video có nội dung khác nhau → 100 kiểu rải đều.
// - Muốn ép một kiểu: `preset: "stack" | "center-pill" | "left-bottom" | "split-right" | "left-top" | "center-big" | "right-bottom" | "split-left"`.
// Bảng này mô phỏng 8 video khác nhau (cùng template, cùng cảnh sau): chạy `npm run render:real-hooks`.
const cap = [{ from: 10, to: 100, text: "Mình từng mất cả tiếng mỗi sáng", hl: ["tiếng"] }];
const v = (src: string, lead: string, lines: string[], seed: string) => ({ type: "talk" as const, duration: 100, props: { src, preset: "auto", seed, lead, lines, captions: cap } });
export const realHookStyles: VideoContent = {
  id: "real-hook-styles",
  branch: "real",
  orientation: "vertical",
  scenes: [
    v("clips/real-1.mp4", "mỗi sáng đều mở sheet đếm đơn?", ["BÁO CÁO ĐƠN", "tự chạy"], "vid-001"),
    v("clips/real-2.mp4", "bí quyết của shop mình", ["HẾT *cực* VỚI SHEET"], "vid-002"),
    v("clips/real-3.mp4", "ai làm shop cũng nên biết", ["ĐƠN VỀ *tự động*", "MỖI SÁNG"], "vid-003"),
    v("clips/real-1.mp4", "thử 1 tuần là mê", ["1 GIỜ", "còn 2 phút"], "vid-004"),
    v("clips/real-2.mp4", "chủ shop nào cũng gặp", ["KHÔNG KỊP", "đếm đơn"], "vid-005"),
    v("clips/real-3.mp4", "mình làm thế này", ["VIẾT 1 PROMPT", "xong báo cáo"], "vid-006"),
    v("clips/real-1.mp4", "đừng làm tay nữa", ["*AI* ĐẾM ĐƠN HỘ"], "vid-007"),
    v("clips/real-2.mp4", "tiết kiệm mỗi ngày", ["60 PHÚT", "về 2 phút"], "vid-008"),
  ],
};
