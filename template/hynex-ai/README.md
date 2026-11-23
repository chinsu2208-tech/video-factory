# HYNEX AI · Template video bản tin AI (Remotion)

Video dọc 9:16, 1080×1920, 30fps, giữ vùng an toàn TikTok (trên 240, dưới 480, phải 140, trái 60).
Phong cách Tech Editorial Motion trên **màu chuẩn Hynex**: navy `#0B1F44`, Hynex Blue `#2563FF`, lime `#C8FF00`. Font **Manrope**. Nền lưới + chấm pixel + quầng sáng nhẹ, UI mockup vector 2D.

## Chạy
```
npm install
npm run studio     # xem và chỉnh
npm run render     # out/hynex-ai-brief.mp4  (đọc src/data/episode.json)
npm run gallery    # out/motion-library.mp4  (17 motion, mỗi cái 3 giây)
```

## Cấu trúc một số (khoảng 55 giây với 5 tin)
Opening (logo dựng từ điểm dữ liệu + ngày) → các cảnh tin → Ending (logo HYNEX AI + nút "Comment BRIEF").
Mỗi cảnh: chip số thứ tự, chip loại tin, chip tên hãng (chữ) → tiêu đề có highlight lime → motion → thẻ "Why it matters / Try this".

| type      | Dùng cho                         | Motion gợi ý |
|-----------|----------------------------------|--------------|
| breaking  | Model/công cụ mới ra             | launch, feature, neural |
| tool      | Cập nhật tính năng, giao diện    | screen, upgrade, morph |
| battle    | So sánh model                    | battle, speed, ranking, cost |
| usecase   | Quy trình dùng được ngay         | aiworkflow, workflow, agent, scan, beforeafter |
| tip       | Prompt của ngày                  | prompt, tokens |

## episode.json
```json
{
  "lang": "en",
  "date": "MON · NOV 23",
  "sample": false,
  "labels": {},
  "scenes": [
    { "type": "breaking", "maker": "Sample Lab", "title": "A new model **Nova 2** just launched",
      "motion": { "kind": "launch", "name": "Nova 2", "maker": "Sample Lab" },
      "note": "Cheaper replies for **customer chat** at the same quality" }
  ]
}
```
- `**từ khóa**` = vệt highlight lime. Tối đa 1 cụm mỗi tiêu đề, tiêu đề dưới 10 từ.
- `maker` chỉ là chữ. Không chèn logo thật của các hãng AI.
- `lang`: `en` hoặc `vi` có sẵn nhãn (src/data/labels.ts). Ngôn ngữ khác: thêm khối trong labels.ts hoặc ghi đè bằng `"labels": {...}`.
- `sample: true` hiện nhãn SAMPLE ở góc. Dữ liệu mẫu đi kèm là hư cấu, tắt trước khi đăng.
- Ảnh chụp màn hình thật cho motion `screen`/`morph`: bỏ vào `public/`, ghi `"src": "ten-anh.png"`.

## 17 kind motion
14 đặc trưng: `prompt` {prompt, output[]}, `neural` {}, `battle` {a, b, rows[{label,a,b,unit?,lowerIsBetter?}]}, `workflow` {steps[]}, `feature` {name, features[]}, `screen` {app, button, src?}, `beforeafter` {before[], after[]}, `tokens` {text}, `ranking` {metric?, rows[{name,before,after}]}, `cost` {from, to, unit?, label?}, `speed` {a{name,seconds}, b{name,seconds}}, `morph` {src?, label?}, `scan` {fields[{key,value}]}, `agent` {tasks[]}.
3 nhận diện: `launch` {name, maker?} (chip mở ra), `upgrade` {from, to, note?} (thanh nâng cấp), `aiworkflow` {steps[]} (khối sáng lần lượt và hoàn thành).

## Prompt cho AI viết episode.json mỗi sáng
> Bạn là biên tập viên HYNEX AI. Từ danh sách tin (kèm link nguồn) dưới đây, chọn 5 tin hữu ích nhất cho người bán hàng online và chủ doanh nghiệp nhỏ. Xuất đúng JSON theo schema trong README (lang = "en"). Mỗi tin: chọn `type` và `motion.kind` hợp với nội dung theo bảng; tiêu đề dưới 10 từ, đúng 1 cụm `**highlight**`; `note` là 1 câu nói vì sao quan trọng hoặc việc thử ngay hôm nay. Chỉ dùng số liệu có trong nguồn, không bịa điểm benchmark hay giá. Không dùng từ "revolutionary", "game-changer", "insane". Chỉ xuất JSON.

## Màu (src/brand.ts)
`bg #0B1F44` · `bg2 #16306A` · `bg3 #1C3A7A` · `line #2A4785` · `blue #2563FF` · `blueSoft #5B8CFF` · `lime #C8FF00` · `muted #A9B6D3`.
Lime chỉ đặt trên navy hoặc làm nền cho chữ navy. Không gradient tím xanh, không mascot robot.
