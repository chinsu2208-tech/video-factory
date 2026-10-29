---
name: "tao-video-bat-tu-ve-tay-remotion"
description: "Dựng video Bát tự/tử vi 9:16 phong cách sổ tay vẽ tay (font thư pháp, màu Ngũ hành) từ script + mp3 giọng đọc bằng Remotion, có vùng an toàn TikTok. Dùng khi Sếp gửi script + mp3 về bát tự, lá số, lưu niên, trụ ngày, nhật chủ, dụng thần."
---

# Video Bát tự vẽ tay (script + mp3 → clip 9:16) bằng Remotion

Người dùng: Sếp Trinh (TAPCo, Hà Nội), nói tiếng Việt thân mật, thích trả lời ngắn. Kênh bát tự dẫn về xemkhuyetmenh.online (link trong bio). Style: sổ tay vẽ tay nhiều màu (cùng họ skill `tao-video-notebook-hand-drawn-remotion`) + màu theo Ngũ hành + font thư pháp của Sếp. KHÔNG dùng kiểu cổ thư/mực nâu (Sếp đã chê) và KHÔNG trộn màu/font Hynex.Solutions.

## 0. Quy tắc cứng
- Chữ Hán, can chi, số liệu là text thật; can chi lấy từ bảng `STEM`/`BR` trong code (Quý 癸 Thủy, Dậu 酉 Kim, Canh 庚 Kim, Tý 子 Thủy, Nhâm 壬 Thủy, Thân 申 Kim...), không gõ tay từ trí nhớ. Không bịa dữ kiện lá số.
- Ví dụ "người 1/người 2", nhật chủ mạnh/yếu chỉ là minh hoạ: ghi rõ trên hình khi là khung chưa có dữ liệu thật. Luôn có chân trang "Tham khảo theo mệnh lý truyền thống · không khẳng định vận mệnh". Không hứa kết quả cuộc đời, không cam kết thu nhập.
- Năm sinh tính theo bát tự đổi ở Lập xuân (đầu tháng 2): người sinh tháng 1 đến đầu tháng 2 thuộc năm trước. Giữ lưu ý này khi script nói về năm sinh. Không tự ghi ngày giờ chính xác nếu script không nêu.
- Font thư pháp (QuangNinhThuphap.ttf, thiếu ký tự ₫) CHỈ dùng cho tiêu đề lớn, đặt NGOÀI filter làm run nét; chữ nhỏ dùng Baloo 2 / Patrick Hand. Font này đuôi chữ kéo dài xuống (Tý, người, ngày): chừa chỗ, đừng đặt chữ ngay dưới tiêu đề. Bán gói cho người khác thì phải kiểm tra bản quyền font.
- Remotion cần Company License nếu công ty từ 4 người.

## 1. Màu
Nền/giấy: navy '#1f2f5c' (nét), cream '#fbf6e9', sky '#cfe6f7', peach '#fbd3bd', mint '#a9dfc4', yellow '#fbd35b', coral '#f4907b', blue '#8bbdf0', silver '#dfe6ee', red '#e2574c' (con dấu/nhấn).
Ngũ hành cố định, không đổi giữa các cảnh: Mộc mint, Hỏa coral, Thổ yellow, Kim silver, Thủy blue.
Nét viền navy dày 6, bo tròn, fill phẳng; bọc nội dung trong `filter="url(#wob)"` (feTurbulence + feDisplacementMap) để nét run; seed đổi ~7,5 lần/giây (`3+floor(t*7.5)%5`).

## 2. Cấu trúc project (gói bazi-pack.zip, Remotion 4.0.290, 1080x1920)
- `BaziHand.tsx`: bảng màu `P`, `EC`/`EZ`/`STEM`/`BR`, `Page` (trang sổ), `Title` (ghi chú nhỏ + tiêu đề thư pháp + gạch vàng lượn, căn trái x=230), `Wavy`, `Star`, `Doodle` (icon Ngũ hành), `Foot`, `SAFE` + `SafeCtx`.
- `BaziScript.tsx`: `EpisodeShell({phrases, voice, scenes})` = chuyển cảnh trượt + zoom nhẹ + phụ đề chạy theo giọng + chân trang; primitive xuất ra: Person, Coin, Tick, Cross, Calendar, Clock, Tag, TT, Card, Pop, Fade, Gauge, A/POP/cl/lerp. Tập 1 (1991–1993) nằm ở đây làm mẫu.
- `BaziEp2.tsx`: tập 2 (1993 → 2020) làm mẫu thứ hai: PillarCard (thiên can trên, địa chi dưới), House (nứt), Briefcase, Gear, Swirl, Slab (các tầng lá số), timeline lập xuân.
- `tools/align.py`, `tools/align_dp.py`: căn giờ câu theo giọng. Cần Python + numpy + ffmpeg.
- Tập mới: copy `BaziEp2.tsx` thành `BaziEpN.tsx`, viết lại các cảnh `S1..Sn` theo script (mỗi cảnh 1 ý, 1 đồ vật ẩn dụ), đổi `cap` json, `voice`, `EPN_TOTAL`, thêm 2 Composition trong Root (id chỉ chứa chữ, số, dấu gạch ngang; KHÔNG dùng dấu gạch dưới).

## 3. Quy trình
1. Nhận script + mp3 (ElevenLabs, giọng Hale). Sao mp3 vào `public/`. Đo độ dài bằng ffprobe.
2. Lưu script ra file. **Dòng tiêu đề của script thường được đọc thành tiếng**: thêm dấu chấm cuối tiêu đề rồi chạy `python3 tools/align_dp.py public/x.mp3 script.txt src/capN.json --num 8`. Thử cả có/không tiêu đề, chọn bản có mốc câu tăng dần, không chồng nhau. In bảng câu–giây để chia cảnh. Mốc từng chữ trong câu dài là ước lượng đều, chỉ dùng cho cue nhỏ.
3. Chia cảnh theo ý (hook, trụ năm, quan hệ/cơ chế, nhật chủ vững-yếu, tự kiểm tra, CTA "xem lá số ở link trong bio", lưu ý nhỏ). Mỗi icon pop đúng lúc từ khoá được nói.
4. Tổng khung hình 30fps = ceil((giây giọng + 0,4) × 30); 15fps = một nửa.
5. `remotion still` ~24 khung, ghép lưới bằng PIL để duyệt; vẽ lớp đỏ vùng che (mục 4) để kiểm tra. Sửa tràn chữ, đè nhau.
6. Render 15fps stop-motion (hợp style vẽ tay, nhanh gấp đôi), chạy nền: `npx remotion render src/index.ts BaziEpN-15 out/v15.mp4 --concurrency=2 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`. Máy 2 nhân: bản 73–77s mất khoảng 30–35 phút (30fps ~1 giờ). Đừng ước 10–20 phút. Máy 8 nhân chỉ vài phút. Remotion tự mix mp3 vào video.
7. Ghép 30fps: `ffmpeg -i out/v15.mp4 -r 30 -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -c:a copy -movflags +faststart out/final.mp4` (~22MB). Kiểm tra volumedetect có tiếng, xem 3–4 khung. Giao bằng SendUserFile, kèm 2–3 câu: có gì, lưu ý dữ liệu minh hoạ, bước tiếp.

## 4. Vùng an toàn TikTok (bắt buộc)
Đo theo ảnh chụp màn hình thật của Sếp (video bị zoom ~0,95 và cắt ~55px mỗi mép): thanh tìm kiếm/giờ che y<260; caption + tên kênh + thanh tiến trình che y>1700; cột icon phải (avatar, tim, bình luận, lưu) che x>880 khi y từ 1090 đến 1900. Cách làm trong code: shell bọc mọi cảnh trong `translate(SAFE.tx SAFE.ty) scale(SAFE.s)` với `SAFE={s:0.88, tx:20, ty:115}`; `Page` dùng `SafeCtx` để nghịch biến đổi, vẫn phủ kín màn hình. Phụ đề: pill tâm (480, 1585), rộng tối đa 800 (nằm lệch trái né cột icon). Chân trang ở (480, 1690). Nội dung chính chỉ nằm trong y 280–1560, bên phải x≤880. Tập 1 đã đăng trước khi có quy tắc này (không render lại theo yêu cầu Sếp); mọi tập sau phải theo.

## 5. Bẫy đã gặp
- Mũi tên/đường nét dùng `pathLength=1` + `strokeDasharray="0 1"` + `strokeLinecap=round` vẫn hiện một chấm: ẩn bằng `opacity` hoặc điều kiện khi giá trị = 0.
- `markerEnd` hiện ngay cả khi nét chưa vẽ xong: chỉ gắn khi tiến độ > 0,98.
- `pkill -f "remotion render"` giết luôn shell của chính lệnh: dùng `pkill -f "[r]emotion render"`.
- Composition id có dấu gạch dưới sẽ lỗi.
- Concurrency > 2 trên máy 2 nhân gây lỗi/chậm.

## 6. Chạy hằng ngày (đã chuẩn bị)
Sheet "Lịch video Bát tự" (cột script, tên mp3, trạng thái Chờ mp3/Sẵn sàng/Đang dựng/Đã dựng/Lỗi, link video) và thư mục Drive "Hynex Video Bát tự" (pack, mp3 giọng đọc, video xuất). Sếp tạo mp3 ElevenLabs thủ công, thả vào thư mục mp3. Phiên hẹn giờ mới không có sẵn project: nên chạy trên máy phụ đã nối app Claude (tác vụ bật Require this computer) có sẵn gói project, hoặc tải gói từ Drive. Mỗi script mới Claude phải viết lại cảnh từ bộ primitive, không chỉ thay chữ. Video xong lưu vào "video xuất", điền link vào Sheet; Sếp tự duyệt và đăng.