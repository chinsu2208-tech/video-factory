# aff-remotion: template Remotion 5 kênh Mẹ Bỉm AFF (đã có 2 kênh thí điểm)

Kênh A Tiết Kiệm (comp `TietKiem`), kênh B Thông Thái (comp `ThongThai`). 1080x1920, 30fps, 6 cảnh x 2,6s, chuyển mờ 0,4s (13,6s).

## Chạy
npm install
npx remotion studio src/index.ts
npx remotion render src/index.ts TietKiem out/tiet-kiem.mp4 --props=props/tiet-kiem.json
npx remotion render src/index.ts ThongThai out/thong-thai.mp4 --props=props/thong-thai.json

## Cần tự thêm vào public/ (không lưu trong project)
- fonts/: SuperKidpop.ttf, BurgerSteak.ttf, Adventor-Bold.otf, IntrudingCat.ttf, TheMelody.ttf (font Sếp đã gửi)
- clips/k1.mp4 k2.mp4 k3.mp4: clip Kling (H.264, không tiếng)
- stills/S1.png...: ảnh sản phẩm

## Đổi nội dung
Chỉ sửa file props/*.json (Make/Claude sinh JSON này). Mỗi scene: src (clip + startSec hoặc still), lead / big / bigSize / line / small, callouts [{dot:[x,y], text, top}], sub, scrim.
Thêm "debug": true để vẽ khung vùng an toàn.

## Quy tắc
- Vùng an toàn x 40–930, y 200–1500. Chữ chính nằm trên y 1270. Sub ở y 1290. Chip callout: top + 112 < 1270.
- Font chính đậm cho chữ chính; font phụ viết tay chỉ cho câu dẫn.
- Callout chỉ đặt trên khung ổn định (still hoặc đầu clip), clip AI hay méo nhãn.
- Chữ trung thực: claim hãng ghi "hãng công bố"; không bịa bình luận; sale/quà chỉ khi thật.
- Thêm kênh mới: thêm Theme trong src/themes.ts, 1 Composition trong Root.tsx, 1 file props.

## Ghi chú repo
- Không commit clip Kling, font (giấy phép riêng) và ảnh sản phẩm: `public/clips`, `public/fonts`, `public/stills` đã nằm trong .gitignore.
- Mới có 2 kênh thí điểm: A Tiết Kiệm, B Thông Thái. Còn C FOMO, D Lười, E Khó Tính – An Toàn.
- Nội dung trong props/*.json là bản demo (số mẫu: giá 140k, 300ml). Kiểm tra lại số thật trước khi đăng.
