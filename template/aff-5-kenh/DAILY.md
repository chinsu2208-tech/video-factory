# Quy trình dựng hằng ngày (7h)

Nguồn: Google Sheet SAN_PHAM (id 1DNsDQjn3axS5eXTE4hz9cYBSmK3FwOSV-t2mWU7jOks). Kênh có template: A (comp TietKiem), B (comp ThongThai). C, D, E bỏ qua đến khi có template.

1. Tìm hàng có cột E "TRẠNG THÁI SP" = "Done Voice". Với mỗi kênh A (script H, voice I, trạng thái J) và B (script L, voice M, trạng thái N): chỉ dựng khi trạng thái kênh = "Done Voice" và ô link video tương ứng (AF cho A, AG cho B) còn trống.
2. Số SP lấy từ tên file voice (SP5_kenhA.mp3 → 5). Clip ở `Aff Tiktok/Source Sản Phẩm/<số>. <tên>/`, voice ở `Aff Tiktok/Voice/`, video xuất vào `Aff Tiktok/Video/`.
3. Chọn clip: xem khung hình; bỏ clip có chữ/watermark của video khác hoặc claim lạ; không đủ clip sạch thì bỏ qua SP và ghi chú vào AF/AG "Thiếu clip sạch".
4. `scripts/prep_clip.sh` tạo clip boomerang; `scripts/build_props.py` tạo props (mỗi đoạn script = 1 cảnh). Chữ lead/big/line/small chỉ lấy sự thật trong script, không thêm claim.
5. `npx remotion render src/index.ts TietKiem|ThongThai out/<tên>.mp4 --props=...`. Kiểm tra vài khung (chữ trong vùng an toàn, sub không đè), độ dài video ≈ voice + 0,8s.
6. Ghi video vào thư mục Video, đặt tên `AFF-SP<số>_kenh<A|B>_<tên-sp>.mp4`, ghi tên file vào AF/AG của hàng đó.


## Cập nhật: dùng TẤT CẢ clip sạch + nhiều shot
- Prep MỌI clip sạch của SP (nz1, nz2, nz3...), không chỉ 1 clip.
- Sau khi viết props (mỗi đoạn = 1 cảnh có chữ), chạy: `python3 scripts/build_shots.py props/cu.json props/moi.json nz1,nz2,nz3 10.08` -> mỗi đoạn voice tách thành shot 2-3s, đổi clip + crop liên tục, chữ lớn chỉ ở shot đầu.
- Mục tiêu: mỗi 2-3s đổi cảnh/góc, không để 1 cảnh đứng yên >3.5s.


## VÙNG AN TOÀN TIKTOK (BẮT BUỘC, đo từ ảnh chụp thật 2/11/2026)
Khung 1080x1920. TikTok phóng video lên nên CẮT ~100px mỗi bên.
- Chữ/sub/callout nằm trong **x 130–850, y 220–1380**.
- Cột icon bên phải bắt đầu x≈870; thanh tìm kiếm trên hết ở y≈205; chip sản phẩm + tên kênh bên dưới từ y≈1410.
- Chữ lớn nằm trên y 1255; sub tối đa 2 dòng (y 1280–1390, tối đa 28 ký tự/chunk).
- Hằng số nằm ở `SAFE` trong `src/AffVideo.tsx` (chữ lớn tự co bằng `fitBig`). Muốn kiểm tra: đặt `debug: true` trong props để vẽ khung xanh. Mọi template mới phải theo đúng khung này.
