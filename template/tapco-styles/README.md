# tapco-styles

Các style video Remotion 9:16 (1080x1920, 30fps) của TAPCo. Mỗi style là một composition trong `src/Root.tsx`.

| Style | Composition id |
|---|---|
| Tin trend / thread | TrendNews, PostThread |
| Scrapbook TAP (tips) | TapTips |
| Bát tự vẽ tay | Bazi* |
| PR app ảnh màn hình thật | NhaGiaNhanReal |
| Sổ tay nhiều màu | NotebookDemo |
| Tonelux editorial (be sáng + vàng) | ToneEditorial3 (bản sáng), ToneEditorial / ToneEditorial2 (bản tối) |

## Chạy
```
npm install
npx remotion studio src/index.ts
npx remotion render src/index.ts <CompId> out/x.mp4 --concurrency=2
```
Id composition không dùng dấu `_`. Nén: `ffmpeg -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -c:a aac -movflags +faststart`.

## File không có trong repo
Voice (`.mp3`) và video nguồn (`.mp4/.mov`) không commit. Tự thêm vào `public/`, ví dụ Tonelux cần `public/tl/voice.mp3` và `public/tl/src.mp4`. Bát tự cần `public/bazi-voice.mp3`.

## Vùng an toàn TikTok
Trục nội dung x≈490, lề trái 110 / phải 870, nội dung chính y 280–1500, caption y≈1585 rộng ≤ 740. Không đặt nội dung chính dưới thanh tìm kiếm (trên), caption/tên kênh (dưới), cột icon (phải).

## Tonelux
Cảnh "minh hoạ" phải ghi "hình minh hoạ". Không khẳng định màu nào hợp với một người cụ thể.
