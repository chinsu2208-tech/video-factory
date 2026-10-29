---
name: "tao-video-notebook-hand-drawn-remotion"
description: "Dựng ảnh/clip explainer 9:16 phong cách sổ tay vẽ tay nhiều màu (colorful hand-drawn notebook) bằng Remotion, có máy quay zoom/pan. Dùng khi Sếp nói 'style hand write', 'hand-drawn', 'sổ tay', 'notebook', hoặc gửi bảng MASTER VISUAL STYLE colorful hand-drawn explainer."
---

# Style "Sổ tay vẽ tay nhiều màu" (Colorful Hand-drawn Notebook) bằng Remotion

Cảm giác: một cuốn sổ minh hoạ được "sống dậy" — thông minh, gần gũi, nhiều màu, hơi tinh nghịch. Dùng cho video giải thích (kiếm tiền, quy trình, biểu đồ). Người dùng: Sếp Trinh (TAPCo, Hà Nội), nói tiếng Việt thân mật, thích trả lời ngắn.

## 0. Quy tắc cứng
- Chữ, số, nhãn biểu đồ là **text thật** (SVG text), tuyệt đối không nhờ AI ảnh vẽ chữ.
- Số liệu dùng đúng số được cung cấp, tỷ lệ cột khớp dữ liệu. Số minh hoạ phải ghi "ví dụ giả định, không phải kết quả thật". Không bịa thống kê/nguồn/kết quả tài chính.
- Đề tài kiếm tiền: luôn có dòng "không cam kết thu nhập" (chính sách TikTok).
- Không copy nhân vật/logo/brand của người khác. Nhân vật là nhân vật tự vẽ, giữ 1 nhân vật xuyên suốt.
- Remotion cần Company License nếu công ty từ 4 người (TAPCo 7–9): nhắc khi dùng thương mại.
- Giọng đọc (Higgsfield): gửi script cho Sếp duyệt trước vì tốn credit.
- Sếp chê trước đó "thiếu icon trực quan": luôn có minh hoạ đồ vật ở mọi cảnh, không để toàn chữ.
- **Vùng an toàn TikTok (mục 8) bắt buộc** với mọi video dọc đăng TikTok/Reels.
- Trả lời ngắn, tiếng Việt thân mật; giao file bằng SendUserFile.

## 1. Bảng màu (pastel, hơi bạc, KHÔNG neon/đen)
```ts
const P = {navy:'#1f2f5c', sky:'#cfe6f7', powder:'#e4f1fa', cream:'#fbf6e9', coral:'#f4907b', peach:'#fbd3bd', mint:'#a9dfc4', yellow:'#fbd35b', orange:'#e8924a'};
```
- Nét viền luôn navy, dày 6, `strokeLinecap/Join = round`. Fill phẳng. Nền sáng (cream/powder). Mỗi cảnh có một nền chủ đạo khác nhau (sky, mint, peach, powder) nhưng cùng palette.
- Màu có ý nghĩa: mint = tích cực/tiến độ, coral/peach = tương phản, vàng = số quan trọng/nhấn mạnh, cam = phụ. Tránh: nền đen, neon, gradient bóng, 3D, ảnh thật, đơn sắc.

## 2. Font (có vietnamese subset)
```bash
npm i @fontsource/baloo-2 @fontsource/patrick-hand @fontsource/be-vietnam-pro
```
```ts
import '@fontsource/patrick-hand/latin-400.css'; import '@fontsource/patrick-hand/latin-ext-400.css'; import '@fontsource/patrick-hand/vietnamese-400.css';
import '@fontsource/baloo-2/latin-800.css'; import '@fontsource/baloo-2/latin-ext-800.css'; import '@fontsource/baloo-2/vietnamese-800.css';
import '@fontsource/baloo-2/latin-600.css'; import '@fontsource/baloo-2/vietnamese-600.css';
const H='"Baloo 2","Be Vietnam Pro",sans-serif';        // tiêu đề thân thiện (800), nhãn 600
const HAND='"Patrick Hand","Be Vietnam Pro",sans-serif'; // ghi chú ngắn viết tay
```
Chữ viết tay chỉ để ghi chú ngắn; nội dung quan trọng/số liệu dùng Baloo 800 để dễ đọc. Không đoạn dài trong hình. Font thư pháp riêng của Sếp (nếu có): chỉ cho tiêu đề lớn, đặt ngoài filter làm run nét, nạp bằng `FontFace` + `delayRender/continueRender`.

## 3. Khối xây dựng (SVG 1080x1920)
```tsx
const L={stroke:P.navy,strokeWidth:6,strokeLinecap:'round',strokeLinejoin:'round'} as const;
// filter: nét run tay + bóng giấy
<defs>
 <filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter>
 <filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="6" dy="9" stdDeviation="5" floodColor="#1f2f5c" floodOpacity="0.18"/></filter>
</defs>
// Trang sổ: nền tint + giấy cream bo 14, viền navy 5, 33 dòng kẻ '#b9d3ea' cách 50px từ y=190, lề đỏ '#f4907b' x=170 opacity .7, 14 lỗ gáy tròn ở x=50 (cách 125px, fill = màu nền)
const Wavy=({x,y,w,c})=><path d={`M${x} ${y} q${w/8} -16 ${w/4} 0 t${w/4} 0 t${w/4} 0 t${w/4} 0`} stroke={c} strokeWidth={9} fill="none" strokeLinecap="round"/>; // gạch chân lượn sóng
const Star=({x,y,s=1})=><path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -26 L7 -7 L27 -7 L11 5 L17 25 L0 13 L-17 25 L-11 5 L-27 -7 L-7 -7Z" fill={P.yellow} {...L} strokeWidth={4}/>;
const Coin=({x,y,r=60})=><g transform={`translate(${x} ${y})`}><circle r={r} fill={P.yellow} {...L}/><circle r={r*.66} fill="none" {...L} strokeWidth={4}/><text y={r*.3} textAnchor="middle" fontFamily={H} fontSize={r*.9} fill={P.navy}>₫</text></g>;
```
Bọc mọi nội dung trong `<g filter="url(#wob)">` (trừ trang sổ) để nét run. Nhân vật `Person`: thân bo coral, tay phải giơ lên/chỉ (nét dày 22 coral + nét 6 navy), 2 chân navy, đầu tròn da '#fde1c4', tóc navy, 2 chấm mắt, miệng cong. Một nhân vật cho cả kênh.

Thư viện đồ vật (vẽ phong cách navy outline + fill phẳng): heo đất, xu, tiền, ví, cửa hàng, hộp hàng, xe giỏng, ngôi nhà, người, bánh răng, cột biểu đồ, mũi tên. Trang trí: mũi tên cong, đường chấm, gạch chân lượn, ngôi sao, bong bóng thoại, giấy note. Dùng thưa, mỗi thứ phục vụ câu chuyện.

## 4. Bốn cảnh mẫu (ảnh tĩnh duyệt style, composition 4 frame)
1. **Bìa** (nền sky): ghi chú "Tập 1 · …" (HAND), tiêu đề 3 dòng Baloo 800 (dòng số màu coral, gạch vàng lượn), heo đất + xu rơi, nhân vật góc dưới, ngôi sao, dòng "(số liệu minh hoạ)".
2. **Lộ trình 4 bước** (nền mint): đường chấm uốn lượn nối 4 vòng tròn icon (cửa hàng, hộp, biểu đồ, bánh răng), số thứ tự trong chấm vàng, nhãn dưới mỗi vòng, nhân vật nhỏ ở giữa chỉ đường.
3. **Biểu đồ cột** (nền peach): trục navy, lưới chấm, cột pastel khác màu theo ý nghĩa (cột cuối vàng), số trên đỉnh cột, khoanh tròn coral mốc quan trọng + ghi chú HAND, đơn vị + dòng "ví dụ giả định". Giữ tiêu đề ≤80px để không tràn.
4. **CTA** (nền sky): "Học cùng" + biển coral xoay -3° chữ tên khoá học, giấy note vàng xoay +4°, nhân vật chỉ vào note bằng đường chấm, nút pill "Xem khoá học ở link bio". Nội dung note chỉ dùng thứ Sếp cung cấp.
Rộng nội dung 920px, lề an toàn 80px; kiểm tra chữ tràn/đè nhau bằng still.

## 5. Camera & chuyển phần (đặc trưng của style)
Xem toàn bộ video như một canvas minh hoạ lớn liên tục. Nhịp kể: ESTABLISH (thấy cả bức) → APPROACH (zoom vào đối tượng đang nói) → EXPLAIN (giữ, hiện chi tiết) → CONNECT (pan theo đường chấm sang ý tiếp) → EXPAND (zoom out cho thấy quan hệ) → TRANSITION (qua cảnh nhờ hình chung). Không ép đủ 6 bước mỗi cảnh.
Chuyển cảnh có ý nghĩa: zoom vào đồng xu → lộ biểu đồ; theo mũi tên/đường chấm sang hình kế; khoanh tròn rồi mở rộng vòng thành cảnh mới; cửa hàng biến thành sơ đồ doanh thu–chi phí. Tránh wipe ngẫu nhiên, rung, xoay.
Cách làm trong Remotion: một `<g>` camera bao toàn cảnh với `translate(540 960) scale(z) translate(-cx -cy)`; nội suy `z,cx,cy` theo keyframe giây, easing `Easing.inOut(Easing.cubic)`; parallax = nền dịch 0.6x, tiền cảnh 1.2x. Thiết kế đối tượng zoom được mà vẫn nét (SVG vector).
Hoạt động đồ vật (hạn chế, nhất quán): DRAW-ON (strokeDasharray=1/pathLength=1, dashoffset 1→0), POP-IN (spring scale nhẹ), SLIDE-IN (thẻ giấy trượt vào), FOLLOW-PATH, BUILD-UP (ghép từng mảnh thành sơ đồ), HIGHLIGHT (khoanh/gạch chân), CHART-GROWTH (cột mọc theo dữ liệu). Không cho mọi thứ nảy/lắc. Động kiểu stop-motion (10–15 hình/giây) khi muốn cảm giác giấy cắt dán hoặc muốn render nhanh gấp đôi: `t=Math.floor(f/3)*3`, hoặc render composition 15fps rồi `ffmpeg -r 30` nhân đôi.
Bẫy: nét `pathLength=1` + `strokeDasharray="0 1"` + linecap round vẫn hiện một chấm (ẩn bằng opacity khi giá trị 0); `markerEnd` chỉ gắn khi nét vẽ xong (>0,98); composition id không dùng dấu gạch dưới.

## 6. Quy trình
1. Nhận kịch bản + mốc giây (thiếu thì tự chia: hook 3–5s, mỗi ý 2–3s, kết 3s).
2. Mỗi ý = 1 cảnh/1 đồ vật ẩn dụ; chọn màu nền chủ đạo cho từng cảnh; lập `caps:[bắt đầu,kết thúc,câu][]` ngắn sát lời đọc (phụ đề chạy theo voice khi có giọng).
3. Nếu chưa chốt style: làm 4 ảnh tĩnh (mục 4) cho Sếp duyệt trước khi dựng clip.
4. Dựng; `remotion still` ~10–24 khung, đặt lớp đỏ vùng che TikTok (mục 8) để kiểm tra; sửa tràn chữ (tiêu đề dài hay tràn); render.
```bash
npx remotion still <Id> out/x.png --frame=N --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
npx remotion render <Id> out/<ten>.mp4 --concurrency=2 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
```
Máy 2 nhân: concurrency tối đa 2; clip 77s 1080x1920 30fps mất khoảng 1 giờ (15fps khoảng 30 phút), phải chạy nền, đừng ước vài phút. Dừng render bằng `pkill -f "[r]emotion render"` (có ngoặc vuông để không giết chính shell). Ghép lưới ảnh bằng PIL để xem nhanh.
5. Giao file và 2–3 câu: có gì, chưa có gì (voice, nhân vật), 1 bước tiếp.

## 7. Ghi chú
- Bảng style gốc có nhắc "supplied reference image": nếu Sếp chưa gửi ảnh tham chiếu thì nói rõ là đang bám phần mô tả chữ, nét vẽ có thể chưa giống ảnh gốc.
- Style này cùng họ với kênh "cách kiếm tiền → Hynex Edu" nhưng khác brand: brand Hynex.Solutions (Navy/Lime/Blue, UI phẳng) là skill `tao-video-hynex-edu-remotion`. Khi Sếp chọn hand-drawn thì **không** trộn màu/font Hynex.Solutions vào.
- Chủ đề bát tự/tử vi có giọng đọc: dùng skill `tao-video-bat-tu-ve-tay-remotion` (cùng style, thêm màu Ngũ hành, font thư pháp, căn giờ theo giọng).
- Giao diện giả lập/hướng dẫn thao tác, bản đồ N hướng: xem skill `tao-video-hynex-edu-remotion` (layout bên đó có thể đổi sang màu/font hand-drawn nếu Sếp yêu cầu).

## 8. Vùng an toàn TikTok/Reels (video 1080x1920)
Đo từ ảnh chụp TikTok thật của Sếp (video bị zoom ~0,95, cắt ~55px mỗi mép): thanh tìm kiếm/giờ che y<260; caption + tên kênh + thanh tiến trình che y>1700; cột icon phải (avatar, tim, bình luận, lưu) che x>880 khi y 1090–1900.
Quy tắc: nội dung chính nằm trong y 280–1560 và x≤880 ở nửa dưới; tiêu đề bắt đầu dưới y≈300; phụ đề chạy theo giọng đặt pill tâm (480, 1585), rộng tối đa 800 (lệch trái); chân trang/disclaimer ở (480, 1690).
Cách làm gọn: bọc toàn bộ cảnh trong `translate(20 115) scale(0.88)`; trang sổ (nền) dùng React context để nghịch biến đổi nên vẫn phủ kín màn hình. Luôn kiểm tra still bằng lớp đỏ phủ 3 vùng trên.