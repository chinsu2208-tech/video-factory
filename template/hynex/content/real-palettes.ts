import { VideoContent } from "../scenes/SceneRunner";

// 5 bảng màu chữ của nhánh Real (cùng 1 hook để so sánh). Chọn bằng prop `palette` của cảnh: brand | lime-mono | kem-hong | sky-lime | nang-sanho.
const cap = [{ from: 10, to: 100, text: "Mình từng mất cả tiếng mỗi sáng", hl: ["tiếng"] }];
const v = (palette: string) => ({ type: "talk" as const, duration: 100, props: { src: "clips/real-1.mp4", preset: "stack", palette, lead: "mỗi sáng đều mở sheet đếm đơn?", lines: ["BÁO CÁO ĐƠN", "tự chạy"], captions: cap } });
export const realPalettesDemo: VideoContent = {
  id: "real-palettes",
  branch: "real",
  orientation: "vertical",
  scenes: [v("brand"), v("lime-mono"), v("kem-hong"), v("sky-lime"), v("nang-sanho")],
};
