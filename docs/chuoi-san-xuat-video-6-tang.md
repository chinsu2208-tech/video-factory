# Chuỗi sản xuất video 6 tầng (bản thiết kế, 29/10/2026)

Chủ trì: Sếp Trinh. Mục tiêu: mỗi video ra đời từ một chuỗi có đầu vào, đầu ra và người/AI phụ trách rõ ràng; dữ liệu đăng xong quay về làm ý tưởng tốt hơn. Dựa trên dây chuyền ý tưởng → kịch bản → voice đã có (xem tong-quan-video-pipeline.md).

```
1 BRAND BRAIN → 2 CONTENT INTELLIGENCE → 3 CREATIVE → 4 CLAUDE DỰNG → 5 VIDEO OUTPUT → 6 PHÂN PHỐI & HỌC
                         ^                                                                   |
                         +------------------------ dữ liệu phản hồi ------------------------+
```

## Nguyên tắc chung
- Mỗi tầng giao cho tầng sau MỘT thứ cố định (hợp đồng bàn giao), lưu ở một chỗ cố định. Tầng sau không phải hỏi lại tầng trước.
- Mỗi brand có bộ riêng ở tầng 1. Các tầng sau chỉ đọc, không tự bịa quy định.
- Con người duyệt ở 2 cổng: kịch bản (cuối tầng 3) và video (cuối tầng 5). Còn lại tự chạy.

## Tầng 1 · Brand Brain
- **Gồm:** định vị, tư duy thương hiệu, giọng nói (xưng hô, từ nên/không nên), trải nghiệm khách, Style Guide (màu, font, logo, kiểu video được dùng, điều cấm nói).
- **Đầu ra:** một "Brand Pack" cho mỗi brand (doc ngắn + dòng trong tab Brand Config). Hynex dùng skill `hynex-video-system` làm Style Guide kỹ thuật.
- **Đã có:** tab Brand Config (tone, sản phẩm, điều cấm, Voice ID, màu, CTA, thư mục Drive) cho TAP Store. **Thiếu:** Sangé, ToneLux, Babyfresh; phần định vị/trải nghiệm chưa viết.
- **Người làm:** Sếp + Claude viết nháp, Sếp duyệt. Cập nhật hiếm (theo quý).

## Tầng 2 · Content Intelligence
- **Gồm:** ma trận nội dung (nhóm khách × nỗi đau × dạng nội dung × mục tiêu), kho chủ đề, kho hook có điểm, góc nhìn.
- **Đầu ra:** các dòng ý tưởng trong tab "Kho y tuong" với cột mới: Chủ đề, Góc nhìn, Hook, Mục tiêu (view/follow/đơn), Điểm hook.
- **Cách chạy:** mỗi tuần Claude sinh khoảng 20 ý/brand từ Brand Pack + điểm hook tuần trước; Sếp tick ý nào làm.
- **Đã có:** tab Kho y tuong, kế hoạch 20 ý/tuần cho kênh aib2b. **Thiếu:** ma trận, kho hook có điểm.

## Tầng 3 · Creative
- **Gồm:** kịch bản, voice, tài nguyên (ảnh feedback, b-roll, ảnh sản phẩm, clip).
- **Đầu ra: "Gói sáng tạo"** cho mỗi video (một dòng sheet + 1 file JSON): brand, kiểu video, hook, kịch bản, link mp3, danh sách tài nguyên đã chọn (đường dẫn + thẻ), CTA, mục tiêu.
- **Đã có:** Scenario 1 (ý tưởng → kịch bản) và 2 (duyệt → voice) trên Make, đang tắt chờ API key. **Thiếu:** tab "Kho ảnh/clip" có thẻ (đi học, couple, UGC, feedback…) để chọn tài nguyên tự động; ảnh feedback phải làm mờ tên.
- **Cổng duyệt 1:** Sếp duyệt kịch bản, trạng thái "Duyệt".

## Tầng 4 · Claude dựng (tự động)
Claude đọc Gói sáng tạo và tự làm:
1. **Chọn cách thể hiện:** kiểu video theo cột "Kiểu video" (Hynex Real, Scrapbook, Notebook…); với Hynex Real hook 0–5s dùng `preset: "auto"` để mỗi video một bố cục.
2. **Sắp cảnh và nhịp:** chia kịch bản theo thời lượng voice; mở bằng hook, kết bằng CTA của brand.
3. **Chọn tài nguyên:** theo thẻ trong kho; không lặp quá gần video trước; ảnh nào cũng được tái dùng.
4. **Dựng:** viết `content/<id>.ts`, render, tự kiểm (still vài khung, ffprobe 1080×1920 có audio), lưu Drive, ghi link vào sheet, đổi trạng thái "Video xong".
- **Chạy ở đâu:** template nằm trong repo GitHub private, task đêm của Claude chạy cho các dòng "Duyệt + Voice xong".
- **Đã có:** skill `hynex-video-system`, template v0.5, kiểu video trong sheet. **Thiếu:** repo GitHub, task đêm, quy tắc tự chọn tài nguyên.

## Tầng 5 · Video output
- Video MP4 + thumbnail (`npm run cover:real`) + caption + hashtag + CTA, đặt trong thư mục Drive của brand.
- **Cổng duyệt 2:** Sếp xem, cần sửa thì ghi vào cột "Ghi chú sửa"; Claude sửa và dựng lại.

## Tầng 6 · Phân phối & Học
- **Phân phối:** đăng theo lịch (tay hoặc công cụ đăng lịch), kèm link sản phẩm/comment CTA.
- **Đo lường:** nhập số liệu sau 24h và 7 ngày vào tab "So lieu": view, tỉ lệ xem hết, share, comment, đơn (nếu có). Ban đầu nhập tay hoặc dán export; sau có thể nối tự động.
- **Phân tích hằng tuần:** Claude nhóm theo hook, kiểu video, bố cục hook, ngày giờ đăng; chỉ ra cái nào thắng/thua.
- **Vòng phản hồi:** kết quả cập nhật Điểm hook và gợi ý chủ đề cho tầng 2 tuần sau.

## Lộ trình đề xuất
1. **Giai đoạn 1 (làm trước):** bật Scenario 1-2 (dán API key), viết Brand Pack TAP Store + Hynex, thêm các cột mới ở Kho y tuong.
2. **Giai đoạn 2:** tab Kho ảnh/clip có thẻ; chốt "Gói sáng tạo"; đẩy template lên GitHub private; task đêm tự dựng.
3. **Giai đoạn 3:** tab So lieu + báo cáo tuần tự động; nối vòng phản hồi về tầng 2.

## Việc cần Sếp quyết
- Brand nào thí điểm trước (đề xuất TAP Store).
- Số liệu TikTok lấy cách nào ở giai đoạn đầu (nhập tay hay export).
- Tên repo GitHub private và việc cho Claude tạo repo.
