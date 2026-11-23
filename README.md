# video-factory

Một repo, nhiều template video (Remotion). Mỗi template một thư mục trong `template/`.

| Template | Thư mục | Ghi chú |
|---|---|---|
| Hynex (EDU, Media, B2B, Real) | `template/hynex` | 9:16, vùng an toàn TikTok. Real: hook `preset: "auto"`, palette, `npm run cover:real` |
| Bản tin 5 Phút Chủ Shop | `template/5phut-chushop` | 9:16, tone cam đỏ đen, 25 motion, highlight, thẻ ảnh chụp nguồn, CTA chỉ comment. Nội dung đọc từ `src/data/episode.json` |
| Bản tin HYNEX AI (5 phút AI) | `template/hynex-ai` | 9:16, màu chuẩn Hynex navy/blue/lime, 14 motion + 3 nhận diện, JSON, đa ngôn ngữ (en/vi) |

Thêm template mới: tạo `template/<tên>/` riêng, có README riêng.
Quy trình sản xuất: xem `docs/chuoi-san-xuat-video-6-tang.md`.
Không commit clip Kling, file .env hay API key.
