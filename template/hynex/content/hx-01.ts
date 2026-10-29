import { VideoContent } from "../scenes/SceneRunner";

// HX-01 · Hynex Real · "BẠN LÀM VIỆC CHO AI?" (kịch bản đã duyệt). Giọng: public/voice-hx01.mp3 (37,5s = 1125 frame).
// Mốc thời gian caption lấy từ chỗ ngắt nghỉ của file voice. Không thêm số liệu/chi tiết ngoài kịch bản.
export const hx01: VideoContent = {
  id: "hx-01",
  branch: "real",
  orientation: "vertical",
  voice: "voice-hx01.mp3",
  sound: false,
  scenes: [
    {
      type: "talk", duration: 195, // 0–6,5s: hook
      props: {
        preset: "auto", seed: "hx-01", src: "clips/real-1.mp4", sound: false,
        lines: ["BẠN LÀM VIỆC", "cho AI?"],
        captions: [
          { from: 0, to: 82, text: "Bạn đang dùng AI, hay đang làm việc cho AI?", hl: ["AI?"] },
          { from: 96, to: 195, text: "Nghe thì vô lý, nhưng bạn thử nhìn lại màn hình của mình xem." },
        ],
      },
    },
    {
      type: "flow", duration: 225, // 6,5–14s: 5 cửa sổ phải copy thủ công
      props: {
        bg: "clips/real-1.mp4", kicker: "Màn hình của bạn", title: "Copy qua copy lại", accent: ["copy"],
        steps: [
          { kind: "spark", title: "Cửa sổ 1", detail: "Mở để hỏi AI" },
          { kind: "script", title: "Cửa sổ 2", detail: "Mở để chép câu trả lời" },
          { kind: "edit", title: "Cửa sổ 3", detail: "Dán qua chỗ khác, sửa" },
          { kind: "script", title: "Cửa sổ 4", detail: "Dán tiếp" },
          { kind: "gear", title: "Rồi lại hỏi AI", detail: "Vòng lặp mới" },
        ],
        gap: 14,
      },
    },
    {
      type: "talk", duration: 198, // 14–20,6s
      props: {
        src: "clips/real-1.mp4", startFrom: 60, sound: false,
        captions: [
          { from: 0, to: 140, text: "Cả buổi sáng trôi qua mà bạn chỉ làm đúng một việc là chuyển chữ từ chỗ này sang chỗ kia.", hl: ["chuyển", "chữ"] },
        ],
      },
    },
    {
      type: "talk", duration: 108, // 20,6–24,2s
      props: {
        preset: "center-big", src: "clips/real-3.mp4", sound: false,
        lines: ["KHÔNG PHẢI", "dùng AI"],
        captions: [{ from: 0, to: 100, text: "Đó là AI đang giao việc cho bạn.", hl: ["AI"] }],
      },
    },
    {
      type: "talk", duration: 186, // 24,2–30,4s
      props: {
        preset: "left-bottom", src: "clips/real-1.mp4", startFrom: 30, sound: false,
        lines: ["BẠN *quyết định*", "AI CHẠY VIỆC"],
        captions: [
          { from: 0, to: 95, text: "Công cụ đúng phải khiến bạn bớt thao tác, chứ không thêm cửa sổ để canh." },
          { from: 95, to: 186, text: "AI mới là người chạy việc, còn bạn là người quyết định.", hl: ["chạy", "quyết"] },
        ],
      },
    },
    {
      type: "talk", duration: 117, // 30,4–34,3s
      props: {
        preset: "center-pill", src: "clips/real-3.mp4", sound: false,
        lines: ["NGƯỜI RA LỆNH", "hay người copy?"],
        captions: [{ from: 18, to: 117, text: "Hôm nay, bạn đang là người ra lệnh, hay người copy?", hl: ["copy?"] }],
      },
    },
    {
      type: "cta", duration: 96, // 34,3–37,5s
      props: {
        bg: "clips/real-3.mp4",
        lead: "nhận bộ prompt và khung dashboard",
        headline: "COMMENT OFFICE",
        button: "Comment “OFFICE”",
      },
    },
  ],
};
