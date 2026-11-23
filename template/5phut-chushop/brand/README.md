> Brand guideline (bản gốc, chỉnh trực tiếp): https://claude.ai/artifact/CNBoyJuNZKwadFBEwoYAve
> Thư mục này là bản sao để lưu trữ: `tokens.json` (màu, chữ, khoảng cách, bo góc), `assets/` (logo, icon, khung mẫu).

# 5 Phút Chủ Shop

Bản tin mỗi sáng cho chủ shop và hộ kinh doanh: tin thuế, hóa đơn, chính sách sàn, kèm **ảnh hưởng ai** và **cần làm gì**. Nhận diện cam, đỏ, đen: nhanh, gấp, rõ việc.

## Tinh thần thương hiệu
- **Nhanh:** 5 phút đọc, 60–90 giây xem. Mỗi tin một ý.
- **Rõ việc:** tin nào cũng kết bằng hành động và hạn chót.
- **Đáng tin:** luôn dẫn văn bản gốc, không giật tít, không dọa.

## Giọng văn
- Gọi người đọc là "chủ shop" hoặc "anh chị". Câu ngắn, động từ đứng đầu: "Kiểm tra lại…", "Chuẩn bị…".
- Tiêu đề video dưới 10 chữ. Ví dụ: "Từ 1/1/2026 bỏ thuế khoán".
- Không dùng chữ khiến người ta tưởng là trang của cơ quan nhà nước.
- Tin chưa có văn bản chính thức ghi rõ "chưa có văn bản chính thức".

## Màu
- `flame` là màu nhận diện: logo, nhãn TIN, con số lớn. Chữ nhỏ màu cam dùng `flame-ink`.
- `alert` (đỏ) chỉ cho hạn chót, cảnh báo, ô "cần làm gì". Đỏ hiếm thì đỏ mới có trọng lượng.
- Video luôn nền `night` với thẻ `night-card`; chữ `on-dark`. Web dùng `surface` và `ink`.
- Chữ trắng trên `flame` chỉ từ 24px đậm (độ tương phản ~3:1).

## Chữ
Một họ chữ **Be Vietnam Pro** (Google Fonts, đủ dấu tiếng Việt). Video: `video-title` 76px đậm 800, `video-body` 44px, `video-number` 300px đậm 900 cho thẻ số liệu. Web: `display`, `h1`, `h2`, `body`, `caption`.

## Khung video 9:16 (1080×1920)
Nội dung chính nằm trong vùng an toàn: dưới `video-safe-top` (240px), trên `video-safe-bottom` (480px), cách phải `video-safe-right` (140px), cách trái `video-safe-left` (60px).
1. **Mở đầu 0–3s:** "3 tin chủ shop cần biết sáng nay" + ngày.
2. **Thẻ tin ×3:** nhãn `TIN 1/3` (pill flame), tiêu đề 2 dòng (dòng 2 màu flame), ô "ẢNH HƯỞNG AI" (`night-card`), ô "CẦN LÀM GÌ" (`alert`).
3. **Thẻ số liệu:** nhãn `CON SỐ HÔM NAY` (pill alert), một con số `video-number` màu flame, 2 dòng giải thích, nút "Nguồn: văn bản gốc".
4. **Thẻ hạn chót:** icon `han-chot`, ngày và số ngày còn lại.
5. **Kết:** logo + "Bản tin đầy đủ trong nhóm thành viên".
Khung mẫu ở nhóm **Video**.

## Icon
12 icon nét 3px, góc bo tròn, nét đen `ink` kèm một chi tiết nhấn `flame` (hoặc `alert` với thuế, hạn chót, cảnh báo). Một icon một ý, đặt trên nhãn hoặc cạnh tiêu đề, không trang trí.

## Không làm
- Không gradient, không đổ bóng, không nhiều hơn 3 màu trong một khung.
- Không dùng đỏ cho tin vui hay trang trí.
- Không chữ dưới 34px trong video.
- Không đặt chữ, logo ngoài vùng an toàn.
