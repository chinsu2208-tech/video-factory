# MomReview (mẹ bỉm) – 6–10 video + 2–5 ảnh (sản phẩm / feedback)
Render: npx remotion render src/index.ts MomReview out/dong2_v1.mp4 --props=job.json --concurrency=$(nproc)
- Đặt clip/ảnh/voice vào public/, điền tên file trong job.json (xem job.example.json).
- durationSec = độ dài voice. Số video/ảnh co giãn tự động (video chia đều, ảnh sản phẩm chèn sớm, feedback chèn về sau).
- Sửa màu: momTheme trong src/momConfig.ts. Hook: hookLines (tối đa 3 dòng).

## Hiệu ứng dùng chung (src/fx.tsx) – áp cho cả TrendNews, PostThread, MomReview
- Chuyển cảnh: slide / push / zoom / flash / iris / glitch, chọn theo fxSeed (truyền số dòng sheet vào --props '{"fxSeed":5}' => mỗi video một kiểu).
- Phụ đề nảy từng từ (captions), sticker pop-up tự chọn, sao vàng nhảy, thẻ feedback rơi, nút Theo dõi bấm + tim bay ở màn kết.
