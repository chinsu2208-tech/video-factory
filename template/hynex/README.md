# HYNEX Brand & Motion System (v0.2 DRAFT)
Remotion 4 + React + TypeScript. 3 nhánh: EDU, Media, B2B. Ưu tiên 9:16.

## Chạy
```
npm install
npm run studio          # xem/sửa
npm run render:edu      # out/edu-demo.mp4
npm run render:media    # cần out/edu-demo.mp4 đã copy vào public/clips/
npm run render:b2b
npm run typecheck
```
Trên máy của bạn: xoá dòng `setBrowserExecutable` trong remotion.config.ts.

## Cấu trúc
- brand/ tokens + fonts · core-components/ (Logo, primitives, ui-sim gồm PhoneMockup/PhoneVideo, data-viz)
- branches/{edu,media,b2b}/scenes.tsx · content/*.ts (nội dung tách khỏi animation)
- scenes/SceneRunner.tsx · render/Root.tsx · public/{fonts,sfx,clips,logo} · docs/

## Đổi nội dung
Sửa content/*-demo.ts (text, duration, sfx). Không cần đụng animation.
Đổi orientation "vertical" ↔ "horizontal" để ra 16:9.

## Mockup điện thoại (video thành phẩm)
Cảnh `phoneDemo` của Media: đặt file vào public/clips/, đổi `src`. Bỏ `src` để hiện khung giữ chỗ.

## Âm thanh
Bộ sfx nháp: `bash render/make-sfx.sh` (cần ffmpeg). Thêm cue qua `sfx: [{at, name}]` trong từng cảnh.

## Đã test / chưa test
- Đã: dấu tiếng Việt, 9:16 safe zone, render MP4 cả 3 demo, âm thanh.
- Chưa: 16:9 sau thiết kế lại, nhạc nền, logo SVG chính thức, chạy trên máy ngoài sandbox.


## Nhánh REAL (v0.4 DRAFT) — quy trình / hướng dẫn AI có cảnh thật
Dùng cho nội dung quy trình, hướng dẫn, AI: kết quả đầu ra + quy trình (mô phỏng hoặc ảnh app thật) + phần prompt. Footage thật làm nền, đồ hoạ công nghệ làm chính.
- Cảnh: talk, stat, prompt, drag, code, screen, result, flow, editorial, cta (`branches/real/scenes.tsx`). Mẫu: `content/real-demo.ts`, chạy `npm run render:real`.
- Chữ đan xen: cứng (Barlow Condensed) + mềm (Baloo 2); khung giao diện nổi qua prop `ui` (search, menu, pill).
- Không logo góc; CTA chỉ mời comment, không dẫn website.
- Clip thật: `public/clips/`; ảnh chụp app: `public/app/` (che số liệu nội bộ trước khi đăng).

### Real: hook 0–5 giây đầu + bảng màu (v0.5)
- Hook đa dạng cho nhiều video: cảnh mở đầu `talk` dùng `preset: "auto"` (+ `seed` tuỳ chọn) để mỗi video tự có bố cục riêng (8 preset: stack, center-pill, left-bottom, split-right, left-top, center-big, right-bottom, split-left; đổi cả căn lề, cỡ, kiểu dòng dẫn, thứ tự chữ cứng/mềm, độ nghiêng). Chỉ 0–5s đầu đổi, các cảnh sau giữ nguyên. Bảng mẫu: `npm run render:real-hooks`.
- Thumbnail: `npm run cover:real` (frame 45 của cảnh mở đầu).
- Bảng màu chữ: `palette` của cảnh = brand (MẶC ĐỊNH, đã chọn) | lime-mono | kem-hong | sky-lime | nang-sanho. Xem `npm run` composition RealPalettes.

## Hynex Edu – series "AI từ con số 0"
- Mỗi tập = 1 file `content/edu-ai-bai-XX.ts` (VideoContent, branch edu, 6 cảnh ứng với 6 dòng kịch bản). Mẫu: `edu-ai-bai-02.ts` (có voice).
- Voice đặt ở `public/voice/bai-XX.mp3`, khai báo `voice: "voice/bai-XX.mp3"`. Có voice thì SFX tự hạ còn 40%.
- Đăng ký tập mới ở `render/Root.tsx` + script `render:edu-ai-XX` trong package.json.
- Cảnh cuối (recap) luôn có "Hynex Edu · Làm chủ AI từ con số 0". Giữ vùng an toàn TikTok (trên 220, dưới 420, trái 64, phải 170).
- Căn thời lượng cảnh theo voice: dùng thời điểm từ đầu/cuối giữa các cảnh (tools align), duration tính bằng frame @30fps.
