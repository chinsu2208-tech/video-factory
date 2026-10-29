---
name: "tao-video-pr-app-anh-man-hinh-that-remotion"
description: "Dựng video PR 9:16 cho app từ ảnh/video màn hình thật bằng Remotion (zoom, vòng sáng, thông báo nổi, avatar thật). Dùng khi Sếp muốn clip quảng bá Nhà Gia Nhân hoặc app khác."
---

# Video PR app từ màn hình thật (Remotion)

Ví dụ gốc: app **Nhà Gia Nhân** (https://myhomeai.base44.app, nhà isometric 3D + 10 gia nhân). Sếp Trinh thích: ngắn, casual, tiếng Việt, làm trước hỏi sau.

## Bài học quan trọng (đã sai 1 lần)
1. **KHÔNG vẽ lại app.** Bản vẽ lại nhà iso + nhân vật bị chê "lệch" vì khác app thật. Prompt gốc của Sếp (MyHome AI) yêu cầu: dùng ảnh/quay màn hình THẬT, giữ nguyên layout/màu, không bịa nút/tính năng.
2. **Chỉ nêu tính năng nhìn thấy trong ảnh.** Câu thoại/nhắc việc lấy đúng chữ trong app (vd nhắc 16:00 dọn khu vui chơi, 10:00 uống đủ 2 lít nước, hỏi thăm mua sắm 09:00). Không tự đặt lời cho nhân vật.
3. WebFetch không đọc được app Base44 (chỉ ra thẻ meta) → phải xin ảnh/quay màn hình từ Sếp. Có ảnh nhà 3D nhỏ (~500px) thì zoom mềm; **xin video quay màn hình kéo xoay nhà** hoặc ảnh từng phòng độ phân giải cao để nét hơn. Một số màn không chụp được từng phòng → dùng ảnh có sẵn + crop.
4. Sếp thấy bản đầu "thiếu element, animation chưa đã" → luôn thêm lớp trang trí (xem mục Element).

## Input cần
- 5–8 ảnh màn hình app thật (nhà, trò chuyện, hôm nay, danh sách nhân vật, màn chỉnh sửa…).
- (Tuỳ chọn) mp3 ElevenLabs để canh nhịp; chưa có thì làm không giọng/nhạc và nói rõ.
- Tagline/CTA thật của app (Nhà Gia Nhân: "Một ngôi nhà để về, có người quan tâm mỗi ngày"; CTA "Link ở bio nha").

## Cấu trúc dự án
`src/NhaGiaNhanReal.tsx` (export `NhaGiaNhanReal`, `GR_SC`, `GR_TOTAL`), ảnh ở `public/gn/a1..a6.png`, đăng ký trong `Root.tsx`:
`<Composition id="NhaGiaNhanReal" fps={30} width={1080} height={1920} durationInFrames={GR_TOTAL*30}/>` (id không chứa dấu "_").

Mỗi cảnh là 1 object `Sc`:
```
{s,e,            // giây bắt đầu/kết thúc
 img,iw,ih,       // số ảnh + kích thước pixel gốc
 cardH,           // chiều cao khung (rộng cố định CW=780)
 from:{x,y,w}, to:{x,y,w}, // cửa sổ zoom/pan theo toạ độ ảnh gốc (h = w*cardH/780)
 ring:{x,y,w,h,at}, num, // vòng sáng + số thứ tự tính năng
 title:[..], sub, cap,   // tiêu đề trên, caption pill dưới
 toasts:[{at,who,y,text,side}], calls:[{at,text,x,y,dx,dy}], pills:[{at,text,x,y,c}], avRow:{at,ids,y,d}, spark}
```
Toạ độ ring/call nằm theo toạ độ ảnh gốc nên bám theo khi zoom. Cửa sổ phải nằm trọn trong ảnh (x+w ≤ iw, y+h ≤ ih) và scale 780/w ≤ ~1.9 để khỏi mờ.

Hiển thị: `<image href={staticFile('gn/aN.png')} x={-win.x*scale} y={-win.y*scale} width={iw*scale} height={ih*scale}/>` trong `clipPath` rect bo góc rx 36; scale = 780/win.w; nội suy win bằng `Easing.inOut(Easing.cubic)` suốt cảnh.

## Vùng an toàn TikTok + trục giữa
- Trục giữa chung `CX = 490` cho MỌI thứ (tiêu đề, khung, toast, caption). Lệch trục = bị chê "lệch".
- Nội dung y 280–1560, x 110–870 (cột icon phải x>880 cho y 1090–1900), caption pill ở (490, 1585) rộng ≤740, footer y 1690, tiêu đề y ~320–340. Khung ảnh căn giữa quanh y 880.

## Element tạo cảm giác "đã"
- Nền: gradient + 3 đốm màu pastel trôi + hạt trắng bay lên.
- Chuyển cảnh: khung trượt ngang vào/ra (spring + ease), tiêu đề nảy vào.
- Vòng sáng coral (#e5654f) pulse + ripple 2 vòng + 3 ngôi sao lấp lánh quanh vòng.
- Badge số 1..N ở góc khung.
- Callout: đường kẻ vẽ dần + chấm + pill tên (vd HLV Nam, Cô Tâm, Thầy Ba trên nhà 3D).
- Toast thông báo nổi (avatar thật + câu thật), bồng bềnh nhẹ.
- Pill nổi lấy chữ có thật trong app ("5 việc cần nhắc", "Đã thuê · 3", "Kiểu tóc"…).
- Hàng avatar thật cắt từ màn hình danh sách nhân vật (ô 76×76 quanh tâm từng avatar), nhảy ra bằng spring.

## Render
- Máy 2 core: `npx remotion render src/index.ts NhaGiaNhanReal out/x.mp4 --concurrency=2 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` chạy nền + Monitor chờ `done 0`. Clip toàn ảnh tĩnh nhẹ nên 34s 30fps vẫn render được thẳng (không cần 15fps rồi nhân đôi — cách đó bị stop-motion).
- Chụp thử bằng `remotion still --frame=N`, ghép lưới và phủ đỏ các vùng cấm TikTok để kiểm tra trước khi render.
- Nén lại: `ffmpeg -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -movflags +faststart`.

## Khung kịch bản mẫu (34s)
0–4 nhà 3D + tagline → 4–7.5 zoom khu Sân, callout nhân vật → hỏi thăm (1) → việc hằng ngày + 2 toast (2) → trò chuyện, avatar + "Cả đội" (3) → Hôm nay (4) → danh sách gia nhân (5) → tự chỉnh gia nhân (6) → CTA tên app + avatar + "Link ở bio nha".
Chỉ một template (World Tour/Quick Demo). Prompt gốc còn 4 template chưa làm: Problem–Solution, Feature Spotlight, Miniature Story, Quick Product Demo.

## Chưa làm / việc tiếp
- Chưa có giọng đọc/nhạc; canh nhịp khi có mp3.
- Thay ảnh nhà 3D tĩnh bằng video quay màn hình (kéo xoay) khi Sếp gửi.
- Bản vẽ iso tự dựng (`NhaGiaNhan.tsx`) chỉ giữ làm dự phòng, không dùng để PR.
- Sếp sẽ chỉnh style thêm sau.