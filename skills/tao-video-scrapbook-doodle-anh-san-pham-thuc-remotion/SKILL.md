---
name: "tao-video-scrapbook-doodle-anh-san-pham-thuc-remotion"
description: "Dựng video tips mẹo/kiến thức 9:16 phong cách scrapbook doodle cute + ảnh sản phẩm thật (polaroid) bằng Remotion, cho TAP Store và kênh làm đẹp/để ở học sinh."
---

# Scrapbook doodle + ảnh sản phẩm thật (Remotion)

Sếp Trinh (TAPCo) thích: ngắn, casual tiếng Việt, làm trước hỏi sau. Style này đã dựng cho TAP Store (xịt vải Baby, Baby Chuchu). Prompt gốc: "Cute Beauty Scrapbook × Pastel Editorial Magazine × Real Photography", đối tượng học sinh/người mới.

## Dạng nội dung (Sếp chốt)
Là **kiến thức / chia sẻ tips mẹo** hữu ích, KHÔNG phải quảng cáo thẳng. Sản phẩm thật chỉ là 1 phần của mẹo (vd mẹo 3 có chai Baby). Ví dụ đã làm: "3 mẹo giữ tủ đồ đi học thơm tho" (phơi khô hẳn rồi mới cất / để tủ và balo thoáng / thử chỗ khuất trước khi xịt vải). Layout khác trong prompt: so sánh 2 cột, myth vs fact, checklist, routine timeline, texture close-up, summary.

## Quy tắc nội dung (bắt buộc)
- Chỉ ghi thông tin thấy trên chai/nhãn (tên, Fabric Perfume, 50ml, hồng pastel). KHÔNG hứa công dụng/mùi hương/kết quả chưa kiểm chứng, không vẽ lại bao bì, không bịa trước-sau.
- Mẹo phải là kiến thức phổ thông đúng (phơi khô, tủ thoáng, thử chỗ khuất). Không bịa hướng dẫn sử dụng riêng của sản phẩm; có dòng "Mẹo chung, làm theo hướng dẫn trên nhãn sản phẩm".
- Giọng điệu thân thiện, không phán xét, không ép mua.

## Ảnh sản phẩm thật
Sếp gửi PNG nền trong suốt (1080x1350). Xử lý bằng PIL: lấy bbox theo kênh alpha (`a>20`), cắt khung dọc 4:5 quanh chai (cao*1.08) -> `public/tap/cN.png` (720x900, dùng cho polaroid) và ảnh vuông nền trắng `pN.jpg`. Lưu ý: `convert('RGB')` trên PNG trong suốt cho nền đen, phải dùng alpha. Giữ nguyên ảnh, không chỉnh màu.

## Thiết kế
- Bảng màu pastel: navy #33477a (chữ), coral #f4907b, pink #f7b6c5, mint #a9dfc4, butter #fbe38a, lavender #d9c8f0, sky #cfe6f7, peach #fbd3bd; mỗi cảnh một nền cardstock (sky, peach nhạt, mint nhạt, lavender nhạt, butter nhạt).
- Trang sổ tay (khổ 880x1340 tại x50 y190): giấy kem, dòng kẻ xanh nhạt, lề hồng, viền khâu nét đứt hồng, lỗ lò xo bên trái, tab màu mép phải, nền đốm trắng trôi.
- Font: Baloo 2 800/600 cho tiêu đề/thân, Patrick Hand cho chú thích tay (đều có tiếng Việt qua @fontsource).
- Tiêu đề kiểu sticker: một bản bóng màu lệch (+6,+7) dưới, bản chính có viền trắng (paintOrder stroke), có thể thêm dải highlight butter vẽ dần sau từ khóa.
- Sticker doodle: viền trắng dày (stroke 22) + nét navy 4px + filter wobble (feTurbulence 0.03 + feDisplacementMap scale 4, seed đổi theo `floor(t*6)%5+1`) + rung xoay ±2° mỗi 1/5s; bộ: tim/mây/sao/hoa có mặt kawaii (mắt, miệng, má hồng), nhãn nổ (burst 16 góc) "Mẹo 1/2/3", áo, chai doodle, tủ quần áo, mặt trời xoay, bong bóng "psst~", hơi xịt (các vòng tròn pulse), squiggle, mũi tên chấm, washi tape sọc chéo, sticky note gập góc, polaroid (khung trắng viền navy, ô ảnh pastel + cutout ảnh thật, 2 góc dán washi, ghi chú tay dưới).
- Đặt polaroid cutout: scale ảnh = ph*1.02, y = đỉnh ô ảnh (1.14 thì cắt đáy chai). Dùng clipPath id duy nhất (img+x+y).
- Hiệu ứng: trang trượt vào/ra ngang có xoay nhẹ, camera zoom 1->1.035 suốt cảnh, sticker bounce spring damping ~10, checklist tích từng dòng, underline vẽ dần. Tránh nhảy liên tục/quay nhanh.
- Biến toàn cục `TNOW` gán mỗi frame để các sticker đọc thời gian (Remotion render từng frame độc lập nên an toàn).

## Bố cục 29s (TapTips.tsx)
Bìa (3 mẹo, 2 polaroid nhỏ) -> 3 cảnh mẹo (burst số, tiêu đề 2 dòng, doodle minh họa, sticky, 1 dòng chú thích tay) -> Nhớ nhanh (checklist 3 dòng + doodle) -> Kết TAP Store (2 polaroid, "Link ở bio nha", disclaimer). Scene là mảng `TT_SC {id,s,e,cap,bg}`.

## Vùng an toàn TikTok
Trục giữa CX=490. Nội dung y 280-1500, x 110-880 (cột icon phải x>880, y 1090-1900), trang kết thúc y~1530, caption pill (490,1625) rộng 740, footer y 1705. Tab màu mép phải chỉ là trang trí.

## Render
`npx remotion render src/index.ts TapTips out/x.mp4 --concurrency=2 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` chạy nền + Monitor chờ `done 0`; 30fps thẳng (clip nhẹ ~4-5 phút); nhớ chụp `remotion still` trước để kiểm tra chồng chữ (vd bong bóng "psst~" từng đè tiêu đề). Nén: `ffmpeg -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -movflags +faststart`. Id composition không chứa "_".

## Lịch sử / bài học
- Bản đầu (TapScrapbook.tsx, quảng cáo 2 sản phẩm) bị Sếp chê "chưa graphic, doodle cute" và đổi hướng sang dạng kiến thức/tips mẹo. Luôn hỏi/chốt dạng nội dung trước.
- Chưa làm: giọng đọc, nhạc, layout myth-vs-fact và so sánh 2 cột, dạng JSON để tự động hóa.
- Kênh TAP là 1 trong 7 kênh Sếp đang cân nhắc (xịt vải, Tonelux, PR web app, PR bát tự, reup TQ, tips xu hướng sản phẩm, AI).