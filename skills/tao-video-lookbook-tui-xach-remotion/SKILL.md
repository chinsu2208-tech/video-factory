---
name: "tao-video-lookbook-tui-xach-remotion"
description: "Dựng video 9:16 giới thiệu túi xách kiểu lookbook magazine bằng Remotion, từ ảnh sản phẩm thật; có 2 option: khung giấy tạp chí, hoặc ảnh full-bleed không khung tập trung hiệu ứng chữ."
---

# Video lookbook túi xách (Remotion, 9:16)

Dùng khi Sếp Trinh gửi ảnh túi/lookbook (VD LESAC) và muốn video giới thiệu sản phẩm kiểu tạp chí thời trang. Trả lời ngắn, tiếng Việt thân mật.

## Hai option (cùng 1 project)
1. **LesacLookbook**: ảnh đặt trong khung trên nền giấy kem, layout tạp chí (Hook / Hero / Details / Compose / Signature), serif Playfair + sans Inter.
2. **LesacFullBleed**: ảnh phủ kín 1080x1920, không khung, tập trung hiệu ứng chữ (~22s: Hook 3.2s, Hero 4.8s, Details 5s, Colours 5s, Signature 4s). Sếp hay chọn option này khi muốn "không bo viền, video chiếm toàn màn hình".

## Cấu trúc project (đã build ở /home/claude/lesac-lookbook, đóng gói lesac-lookbook-project.tgz)
- `src/theme.ts`: màu (paper #F7F6F2, ink #171717, accent #C52B32), W 1080 / H 1920, safe zone {top 200, bottom 480, left 60, right 140}.
- `src/data.ts` (option 1) và `src/dataFullBleed.ts` (option 2): nội dung, crop, thời lượng. Shot = {src, w, h, fx, fy, zoom, label}; fx/fy là điểm focus, zoom không méo hình.
- `src/parts.tsx`: CropImage (crop theo focal point + drift chậm), Headline, Micro, HRule, VRule...
- `src/type.tsx`: hiệu ứng chữ: LetterRise (từng chữ trồi qua mask), TrackIn (giãn chữ rồi co), OutlineFill (viền rồi tô trái sang phải), Marquee (chữ chạy), PhotoText (chữ chứa ảnh, có viền trắng nền), Scrim, Tag, Rule.
- `src/Lookbook.tsx`, `src/FullBleed.tsx`: các cảnh; EnterWrap có chuyển cảnh none / wipeUp / split / slideLeft / fade; SubCut = wipe sang ảnh thứ 2 trong cùng cảnh.
- `src/fonts.ts`: Playfair + Anton qua @fontsource (subset latin, latin-ext, vietnamese) kèm delayRender chờ font; không dựa vào font cài trên máy.
- `src/Root.tsx`: đăng ký 2 Composition, calculateMetadata tính độ dài.

## Quy trình
1. Xem ảnh gửi vào (kích thước, bố cục), copy vào `public/media`.
2. Sửa data: đổi src, chỉnh fx/fy/zoom cho khung 1080x1920, đổi chữ. Tên túi / bộ sưu tập / CTA / handle chưa có thì để placeholder `[Điền: ...]`, không bịa thông số, chất liệu, giá.
3. Render still vài frame (hook, hero, details, colours, signature) rồi XEM ảnh trước khi render video: check chữ lọt safe zone (x 60-940, y 200-1440), chữ không chồng nhau, crop không cắt logo.
4. Render: `npx remotion render src/index.ts LesacFullBleed out/x.mp4 --crf=20` (hoặc LesacLookbook). Verify bằng ffprobe (1080x1920, 30fps).
5. Gửi mp4 + project tgz (`tar --exclude=node_modules --exclude=out`) cho Sếp. Cập nhật README nếu thêm option.

## Môi trường sandbox
- Remotion không tải được Chrome (ENOTFOUND remotion.media): cài `@sparticuz/chromium` qua npm, giải nén ra /tmp/chromium, thêm `--browser-executable=/tmp/chromium` cho mọi lệnh still/render.
- tsc --noEmit trước khi render.

## Lỗi đã gặp, tránh lặp lại
- Ảnh/text của cảnh cũ lọt lên trên ảnh mới sau wipe: lớp WipeLeft/SubCut phải có zIndex cao (20) hơn text của cảnh trước.
- Lớp phủ tối (dim) phải có zIndex 2 mới nằm trên ảnh; không có z thì không thấy.
- PhotoText (chữ chứa ảnh) bị chìm: thêm lớp viền trắng 5px bên dưới và dim nền ~0.72.
- Hero crop cắt chữ LESAC trên túi: zoom 1, fx 0.4, drift nhỏ 0.03.
- Hook (useP) không được gọi có điều kiện trong component.
- Chuyển cảnh còn nháy trống ngắn: để overlap 12 frame và reveal delay 0 ở ảnh đầu.
- Ảnh nguồn 800-1100px: zoom chi tiết sẽ mềm; nói thật với Sếp, gợi ý ảnh nét hơn hoặc clip Kling.
- Khoảng 1/4 dưới màn hình để trống do safe zone TikTok là bình thường.

## Chưa làm
Template khác, art-direction mode khác, tỉ lệ 1:1 và 16:9. Nói rõ nếu Sếp yêu cầu.