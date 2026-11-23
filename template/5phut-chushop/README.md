# 5 Phút Chủ Shop · Template video Remotion

Video dọc 9:16 (1080×1920, 30fps, ~55 giây) dựng tự động từ **một file dữ liệu tin** mỗi sáng. Màu, chữ, icon theo design system "5 Phút Chủ Shop" (cam, đỏ, đen). Mọi nội dung chính nằm trong vùng an toàn TikTok (trên 240px, dưới 480px, phải 140px, trái 60px).

## Chạy thử
```bash
npm install
npm run studio      # xem trước, chỉnh trong trình duyệt
npm run render      # xuất out/ban-tin.mp4 từ src/data/episode.json
npm run gallery     # xuất video thư viện 25 motion
```

## Mỗi sáng chỉ cần thay 1 file: `src/data/episode.json`
Cấu trúc video: **Mở đầu → Tin 01 → Tin 02 → Tin 03 → Con số hôm nay → Hạn chót → Việc cần làm → Kết**. Độ dài tự tính theo dữ liệu.

**Highlight:** mọi chỗ viết `**từ khóa**` trong `title`, `affects`, `action`, `number.label`, `deadline.label` sẽ được tô vệt bút cam (trên thẻ đỏ thì vệt đen). Mỗi câu nên highlight 1–2 cụm, đúng con số, mốc ngày hoặc đối tượng bị ảnh hưởng.

## Thư viện 25 motion (src/motion)
| Nhóm | Component | Dùng khi |
|---|---|---|
| 1 Chữ | `KineticTitle` | Tiêu đề tin hiện theo nhịp đọc |
| | `Highlight`, `RichText` | Tô từ khóa (`**...**`) |
| | `Typewriter` | Trích văn bản chính sách (`quote`) |
| | `WordPop` | Nhấn mức phí, ngày (`pop`) |
| | `NewsTicker` | Thanh tin chạy ngang (`ticker`) |
| 2 Số liệu | `NumberCounter` | Con số hôm nay, `chart.type = counter` |
| | `BarCompare` | So sánh trước/sau, `chart.type = bars` |
| | `DonutChart` | Cơ cấu chi phí, `chart.type = donut` |
| | `PriceTransition` | Giá cũ → giá mới, `chart.type = price` |
| | `Countdown` | Số ngày còn lại đến hạn |
| 3 Minh họa | `ConveyorBox` | `visual: conveyor` · vận chuyển, kho |
| | `ReceiptPrinter` | `visual: receipt` · hóa đơn, kê khai |
| | `CoinWallet` | `visual: coins-in` (giảm phí, hoàn tiền) / `coins-out` (tăng phí) |
| | `CalendarFlip` | Cảnh hạn chót |
| | `StampDoc` | `visual: stamp` · luật, nghị định mới |
| | `CartMove` | `visual: cart` · chính sách sàn, mùa sale |
| | `TrendChart` | `visual: trend-up / trend-down` |
| | `ChecklistTick` | Cảnh việc cần làm |
| 4 Chuyển cảnh | `Push`, `CardFlip`, `Swipe`, `ShapeWipe`, `SpringIn` | Đã gắn sẵn: tin dùng Swipe, con số dùng Card Flip, hạn chót và việc cần làm dùng Push, Shape Wipe ở chỗ nối mở đầu, khối tin, kết |
| 5 Nhận diện | `UrgentBell` + `UrgentFrame` | `kind: urgent` · chuông rung, viền đỏ nhấp |
| | `OpportunityBulb` | `kind: opportunity` · bóng đèn, mũi tên xanh |
| | (CoinWallet out) | `kind: cost` · xu bay khỏi ví |
| | (StampDoc) | `kind: policy` · văn bản đóng dấu |
| | (ChecklistTick) | Việc cần làm |

Không ghi `visual` thì tự chọn theo `kind`. Có `chart` thì biểu đồ thay cho minh họa. Có `quote` (và không có chart) thì hiện đoạn trích kiểu máy đánh chữ.

## Lệnh cho AI viết episode.json mỗi sáng
Dán vào Claude cùng 5 tin đã chọn từ Kho tin:

> Bạn là biên tập viên bản tin "5 Phút Chủ Shop". Từ các tin dưới đây, viết đúng một file JSON theo cấu trúc `src/data/types.ts`:
> - Chọn 3 tin quan trọng nhất cho chủ shop. Mỗi tin gán `kind`: `urgent` (có hạn gấp, rủi ro bị phạt), `opportunity` (cơ hội tăng doanh thu), `cost` (chi phí tăng), `policy` (văn bản mới), `info` (tin sàn khác).
> - `title` dưới 12 chữ, có đúng 1 cụm `**highlight**` là con số, mốc ngày hoặc hành động chính.
> - `affects`, `action`: mỗi câu dưới 15 chữ, 1 cụm `**highlight**`. `action` bắt đầu bằng động từ.
> - Có số so sánh thì dùng `chart` (`price` cho giá cũ→mới, `bars` cho 2–3 mốc, `donut` cho cơ cấu). Không có thì chọn `visual` hợp nội dung.
> - `pop`: con số hoặc ngày đáng nhớ nhất của tin (tối đa 10 ký tự).
> - `source`: tên văn bản gốc hoặc trang chính thức, không chỉ tên báo. Không tìm được văn bản gốc thì ghi "Chưa có văn bản chính thức".
> - `number`: một con số nổi bật trong ngày. `deadline`: hạn gần nhất, tính `daysLeft` từ hôm nay. `todo`: 3 việc ngắn.
> - `sample`: false. Chỉ trả về JSON.

## Thêm ngành mới (5 Phút AI, kế toán, spa)
Giữ nguyên khung, chỉ thay "áo": màu trong `src/brand.ts`, icon trong `public/icons`, chữ thương hiệu ở cảnh Mở đầu và Kết.

## Lưu ý
- Dữ liệu trong `episode.json` hiện là **bản mẫu** (nhãn BẢN MẪU trên video). Kiểm tra lại số liệu, văn bản trước khi đăng.
- Font Be Vietnam Pro nằm sẵn trong `public/fonts`, không cần mạng khi render.
- Lồng tiếng: thêm `<Audio>` từ `@remotion/media` vào `src/Episode.tsx` (file giọng đọc AI đặt trong `public/`).
