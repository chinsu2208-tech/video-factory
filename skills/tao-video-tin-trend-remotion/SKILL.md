---
name: "tao-video-tin-trend-remotion"
description: "Dựng video tin trend / thread dọc 9:16 bằng Remotion từ clip, tiêu đề, màu, logo của Sếp. Dùng khi Sếp dán lệnh từ Xưởng Tin Trend hoặc nói 'làm video tin trend', 'làm video thread'."
---

# Dựng video tin trend / thread bằng Remotion

Sếp Trinh thích trả lời ngắn, tiếng Việt thân mật. Làm thẳng, không giải thích dài.

## Có 2 kiểu video
- **Tin trend** (composition `TrendNews`): thẻ tiêu đề mở đầu 5.7s, clip nằm trong khung (nền lưới/màu), montage cắt nhanh cuối, màn kết có ô tìm kiếm tên kênh. Mẫu dài 61s.
- **Thread bài đăng** (composition `PostThread`): video nền loop + thẻ bài đăng kiểu Threads hiện lần lượt, thẻ mở đầu có thẻ tiêu đề, sticker logo góc phải. Mẫu dài ~3 phút (12 thẻ, mỗi thẻ 12–15s).

Sếp thường gửi lệnh được tạo từ trang "Xưởng Tin Trend" (artifact), có các dòng: Kiểu video, Tên kênh, Handle, Nhãn thẻ tiêu đề, Ngày, Tiêu đề (1–4), Lời kêu gọi, Màu sắc, Logo, Số clip, Độ dài, Lồng tiếng, Nhạc nền. Thiếu thông tin nào thì tự chọn mặc định hợp lý, nói rõ trong 1 dòng, đừng hỏi lại nếu việc không đắt.

## Quy trình
1. **Dựng project** ở `/home/claude/trend-news-template` bằng các file ở phần "Source" bên dưới (ghi đúng nguyên văn), rồi `npm install`. Thư mục `public/` để clip, logo, mp3.
2. **Chuẩn bị file Sếp gửi**: copy clip/logo vào `public/`. Clip đổi về H.264 mp4 nếu cần: `ffmpeg -i in -c:v libx264 -preset veryfast -pix_fmt yuv420p -an public/clipN.mp4` (bỏ tiếng gốc). Logo đặt tên `logo.png`.
3. **Điền cấu hình** (không sửa code dựng):
   - `src/config.ts` → `brand.name`, `brand.label`, `brand.handle`, `brand.logoText` (chữ cái đầu + `+`), `brand.logoImg='logo.png'` nếu có file, `brand.logoShape` (`rounded` | `circle` | `free`), `brand.accent`.
   - `theme.gridBg` = màu nền, `theme.gridLine` = đường kẻ lưới, `theme.titleCardBg` (và `theme.cloudA`) = nền thẻ tiêu đề.
   - Cảnh `headline`: `date`, `lines` (tối đa 4 dòng, ~30 ký tự/dòng, IN HOA). Cảnh `end`: `cta`.
   - Cảnh `clip`: điền `src: 'clipN.mp4'` theo đúng thứ tự Sếp gửi. Số clip khác 6 thì chia lại thời gian các cảnh giữa (5.67s → hết trước 3s cuối) cho tổng khớp độ dài mong muốn. Chỉ dùng montage cắt nhanh nếu có từ 10 clip trở lên. Phần đầu dùng nền `grid`, các clip sau luân phiên nền trơn (`solid`/`gradient`/`image`).
   - Kiểu Thread: sửa `src/postConfig.ts` (`postScenes`): `title` (thẻ mở đầu), các `post` (user, text[], image?, counter dạng `n/N`), `bg.src` là video loop Sếp gửi (không có thì để gradient giữ chỗ và báo Sếp). Tự viết nội dung các thẻ từ chủ đề nếu Sếp chưa đưa, gửi bản nháp cho Sếp duyệt trước khi render.
4. **Cập nhật độ dài**: `DURATION_SEC` (trend) hoặc `POST_DURATION_SEC` (thread) phải bằng `to` của cảnh cuối.
5. **Lồng tiếng** (nếu Sếp chọn có): viết lời đọc tiếng Việt theo từng cảnh, gửi Sếp duyệt trước (tạo giọng tốn credit Higgsfield). Sau khi duyệt, tạo giọng bằng Higgsfield (`generate_audio` / `list_voices`, xem `get_workflow_instructions` nếu cần), tải mp3 về `public/voice.mp3`, `ffprobe` đo độ dài, chia lại thời gian cảnh theo câu, đặt `export const voice = 'voice.mp3'`. Nhạc nền: `music = 'music.mp3'`, âm lượng đã set 0.12.
6. **Kiểm tra trước khi render hết**: render still các khung đại diện (đầu, giữa, cuối) rồi nhìn: chữ không tràn, logo/màu đúng, clip nằm trong khung. Sửa xong mới render hết.
   ```
   CH=$(node -e "console.log(require('playwright').chromium.executablePath())")
   npx remotion still src/index.ts TrendNews out/s.png --frame=60 --browser-executable=$CH --log=error
   ```
7. **Render** (chạy nền, có thể mất vài phút; máy ít core nên `--concurrency` không vượt `nproc`):
   ```
   npx remotion render src/index.ts TrendNews out/video.mp4 --browser-executable=$CH --concurrency=$(nproc) --log=error
   ```
   Kiểu thread thay `TrendNews` bằng `PostThread`.
8. **Kiểm tra file xuất**: `ffprobe` (1080x1920, đúng độ dài), lấy vài khung nhìn lại. Gửi mp4 cho Sếp bằng SendUserFile kèm 1 dòng tóm tắt.

## Quy tắc
- Template dùng thương hiệu của Sếp (kênh của Sếp). Không chép logo, tên kênh, clip hay hình của kênh khác từ video mẫu.
- Nhắc 1 lần (lần đầu trong cuộc trò chuyện): Remotion miễn phí cho cá nhân và công ty dưới 4 người, từ 4 người cần mua Company License; TAPCo có 7–9 người nên cần cân nhắc khi dùng thương mại.
- Không có nền loop/clip thật thì khung giữ chỗ vẫn render được, nhưng phải nói rõ với Sếp rằng đó là bản thử.

## Cấu trúc thời gian video mẫu (để chia lại khi đổi số clip)
Tin trend 61.25s @30fps: thẻ tiêu đề 0–5.67s · ảnh nguồn 5.67–8.0 · clip 8.0–18.4 (nền lưới) · 18.4–25.9 · 25.9–34.2 · 34.2–37.6 · 37.6–42.3 · 42.3–47.9 · montage cắt nhanh 47.9–58.3 (mỗi cú 0.3–0.6s) · màn kết 58.3–61.25. Lời đọc nghỉ ~0.5s ở các giây 8.07, 11.63, 28.05, 34.2, 45.16, 50.79, 54.4, 58.3.
Thread mẫu 184s: mở đầu 3.7s, sau đó 12 thẻ, nền loop đổi mỗi 3–10s, kết 3s.

# Source

### package.json
```json
{
  "name": "trend-news-template",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "studio": "remotion studio src/index.ts",
    "render": "remotion render src/index.ts TrendNews out/trend-news.mp4"
  },
  "dependencies": {
    "@remotion/cli": "4.0.290",
    "remotion": "4.0.290",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/react": "18.3.12",
    "typescript": "5.6.3"
  }
}
```

### tsconfig.json
```json
{"compilerOptions":{"target":"ES2020","module":"commonjs","jsx":"react-jsx","strict":true,"skipLibCheck":true,"esModuleInterop":true},"include":["src"]}
```

### src/index.ts
```ts
import {registerRoot} from 'remotion';
import {Root} from './Root';

registerRoot(Root);
```

### src/Root.tsx
```tsx
import React from 'react';
import {Composition} from 'remotion';
import {TrendNews} from './Template';
import {FPS, DURATION_SEC} from './config';
import {PostThread} from './PostThread';
import {POST_FPS, POST_DURATION_SEC} from './postConfig';

export const Root: React.FC = () => (
  <>
  <Composition
    id="TrendNews"
    component={TrendNews}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={Math.round(DURATION_SEC * FPS)}
  />
  <Composition
    id="PostThread"
    component={PostThread}
    width={1080}
    height={1920}
    fps={POST_FPS}
    durationInFrames={Math.round(POST_DURATION_SEC * POST_FPS)}
  />
  </>
);
```

### src/config.ts
```ts
// ====== CẤU HÌNH TEMPLATE "TIN TREND DỌC 9:16" ======
// Nhịp cắt đo từ video mẫu 61.25s @30fps. Sửa file này là đổi nội dung, không cần đụng code dựng.

export const FPS = 30;
export const DURATION_SEC = 61.25;

export const brand = {
  name: 'TÊN KÊNH',          // chữ góc phải trên của khung clip
  sub: 'MEDIA',
  label: 'TÊN KÊNH TRENDING', // nhãn trên thẻ tiêu đề
  logoText: 'T+',             // thay bằng ảnh logo: để logoImg = 'logo.png' (đặt trong /public)
  logoImg: undefined as string | undefined, // vd 'logo.png' (đặt trong /public)
  logoShape: 'rounded' as 'rounded' | 'circle' | 'free', // free = PNG trong suốt dạng sticker, không có ô trắng
  logoBox: '#ffffff',       // màu ô nền sau logo
  logoTextColor: '#1a1a1a',
  handle: '@tenkenh',
  accent: '#ff7a1a',        // màu viền/nhấn
};

// ====== MÀU SẮC: đổi ở đây là đổi toàn bộ video ======
export const theme = {
  gridBg: '#b8121b',        // nền lưới (cảnh 'grid')
  gridLine: '#7a0910',      // màu đường kẻ lưới
  headlineBg: ['#8b7a6b', '#4a3b33', '#1a1210'], // gradient nền thẻ tiêu đề khi không có ảnh nền
  panel: '#0b0808',         // nền tối phía dưới thẻ tiêu đề
  endBg: '#0d0f1a',         // nền màn kết
  // layout "PostThread"
  postCardBg: '#ffffff',
  postCardText: '#111111',
  titleCardBg: '#fdeee9',
  titleCardBorder: '#1c1c1c',
  titleCardText: '#1c1c1c',
  cloudA: '#f6b9cc',
  cloudB: '#fde4ec',
};

export type Bg =
  | {kind: 'grid'}
  | {kind: 'solid'; color: string}
  | {kind: 'gradient'; from: string; to: string; angle?: number}
  | {kind: 'image'; src: string};

export type HeadlineScene = {
  type: 'headline';
  from: number;
  to: number;
  date: string;
  lines: string[];       // tối đa 4 dòng, ~30 ký tự/dòng
  bgSrc?: string;        // ảnh/video nền (sẽ được làm mờ), file trong /public
};
export type ClipScene = {
  type: 'clip';
  from: number;
  to: number;
  bg: Bg;
  src?: string;          // file trong /public (.mp4 / .jpg / .png). Bỏ trống = khung giữ chỗ
  label?: string;
};
export type EndScene = {type: 'end'; from: number; to: number; cta: string};
export type Scene = HeadlineScene | ClipScene | EndScene;

const GRID: Bg = {kind: 'grid'};
const beige: Bg = {kind: 'solid', color: '#d8cfc1'};
const rose: Bg = {kind: 'solid', color: '#c98f8a'};
const ink: Bg = {kind: 'solid', color: '#14161d'};
const slate: Bg = {kind: 'solid', color: '#6b7a93'};

// Đoạn cắt nhanh (montage) 47.9s → 58.3s, mỗi cú ~0.3–0.6s
const fastCuts = [
  47.95, 48.25, 48.58, 48.92, 49.35, 49.85, 50.28, 50.72, 51.25, 52.45, 52.82,
  53.19, 53.79, 54.35, 54.72, 56.12, 56.52, 56.92, 57.22, 58.3,
];
const fastBgs: Bg[] = [beige, slate, ink, rose];
const montage: ClipScene[] = fastCuts.slice(0, -1).map((t, i) => ({
  type: 'clip',
  from: t,
  to: fastCuts[i + 1],
  bg: fastBgs[i % fastBgs.length],
  label: `CLIP ${i + 8}`,
}));

export const scenes: Scene[] = [
  {
    type: 'headline',
    from: 0,
    to: 5.67,
    date: '27/10/2026',
    lines: [
      'TIÊU ĐỀ TIN NÓNG ĐẶT Ở ĐÂY,',
      'TỐI ĐA BỐN DÒNG NGẮN, MỖI DÒNG',
      'KHOẢNG 30 KÝ TỰ ĐỂ KHÔNG TRÀN',
      'VÀ CÓ “TỪ KHOÁ” GÂY TÒ MÒ',
    ],
  },
  {type: 'clip', from: 5.67, to: 8.0, bg: GRID, label: 'ẢNH / SCREENSHOT NGUỒN'},
  {type: 'clip', from: 8.0, to: 18.42, bg: GRID, label: 'CLIP 1 · CẬN CẢNH'},
  {type: 'clip', from: 18.42, to: 25.89, bg: beige, label: 'CLIP 2 · BỐI CẢNH'},
  {type: 'clip', from: 25.89, to: 34.23, bg: rose, label: 'CLIP 3 · CHI TIẾT'},
  {type: 'clip', from: 34.23, to: 37.64, bg: ink, label: 'CLIP 4'},
  {type: 'clip', from: 37.64, to: 42.31, bg: slate, label: 'CLIP 5'},
  {type: 'clip', from: 42.31, to: 47.95, bg: beige, label: 'CLIP 6'},
  ...montage,
  {type: 'end', from: 58.3, to: 61.25, cta: 'Theo dõi kênh để xem thêm tin trend'},
];

// Lồng tiếng: đặt file mp3 vào /public rồi điền tên (vd 'voice.mp3'). Câu nghỉ ~0.5s tại
// 8.07, 11.63, 28.05, 34.2, 45.16, 50.79, 54.4, 58.3 giây (dùng để chia lời đọc).
export const voice: string | undefined = undefined;
export const music: string | undefined = undefined;
```

### src/Template.tsx
```tsx
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {brand, theme, scenes, FPS, voice, music, ClipScene, HeadlineScene, EndScene, Bg} from './config';

export const FONT = '"Be Vietnam Pro","Inter","Liberation Sans","DejaVu Sans",Arial,sans-serif';

const isVideo = (s: string) => /\.(mp4|mov|webm)$/i.test(s);

export const Media: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) =>
  isVideo(src) ? (
    <OffthreadVideo src={staticFile(src)} style={style} muted />
  ) : (
    <Img src={staticFile(src)} style={style} />
  );

export const Logo: React.FC<{size: number; radius: number}> = ({size, radius}) => {
  if (brand.logoImg && brand.logoShape === 'free') {
    return (
      <Img
        src={staticFile(brand.logoImg)}
        style={{width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'}}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: brand.logoShape === 'circle' ? size / 2 : radius,
        background: brand.logoBox,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size * 0.5,
        color: brand.logoTextColor,
        boxShadow: `0 0 28px ${brand.accent}88`,
      }}
    >
      {brand.logoImg ? (
        <Img src={staticFile(brand.logoImg)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      ) : (
        brand.logoText
      )}
    </div>
  );
};

/* ---------- Nền ---------- */
const GridBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: theme.gridBg,
      backgroundImage:
        `linear-gradient(${theme.gridLine} 3px, transparent 3px), linear-gradient(90deg, ${theme.gridLine} 3px, transparent 3px)`,
      backgroundSize: '98px 98px',
      backgroundPosition: '4px 10px',
    }}
  >
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)'}}
    />
  </AbsoluteFill>
);

export const Background: React.FC<{bg: Bg}> = ({bg}) => {
  if (bg.kind === 'grid') return <GridBg />;
  if (bg.kind === 'solid') return <AbsoluteFill style={{background: bg.color}} />;
  if (bg.kind === 'gradient')
    return <AbsoluteFill style={{background: `linear-gradient(${bg.angle ?? 160}deg, ${bg.from}, ${bg.to})`}} />;
  return <Media src={bg.src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
};

/* ---------- Cảnh clip trong khung ---------- */
const ClipSceneView: React.FC<{s: ClipScene}> = ({s}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Background bg={s.bg} />
      {/* khung clip */}
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 356,
          width: 1016,
          height: 1210,
          overflow: 'hidden',
          background: '#111',
          borderRadius: 6,
          boxShadow: '0 12px 50px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{width: '100%', height: '100%', transform: `scale(${zoom})`}}>
          {s.src ? (
            <Media src={s.src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(160deg,#2b3350 0%,#10131f 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                color: '#fff',
                fontFamily: FONT,
              }}
            >
              <div style={{fontSize: 64, fontWeight: 800, opacity: 0.9, textAlign: 'center', padding: '0 60px'}}>
                {s.label ?? 'CLIP'}
              </div>
              <div style={{fontSize: 34, opacity: 0.5}}>đặt file vào /public rồi điền `src`</div>
            </div>
          )}
        </div>
      </div>
      {/* logo kênh góc phải trên */}
      {brand.logoImg ? (
        <div style={{position: 'absolute', right: 50, top: 190}}>
          <Logo size={190} radius={24} />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            right: 50,
            top: 226,
            textAlign: 'center',
            fontFamily: FONT,
            color: '#fff',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
          }}
        >
          <div style={{fontSize: 54, fontWeight: 900, letterSpacing: 4}}>{brand.name}</div>
          <div style={{fontSize: 22, letterSpacing: 14, color: '#c9a7ff', borderTop: '2px solid #8a5cf0', paddingTop: 6}}>
            {brand.sub}
          </div>
        </div>
      )}
      {/* handle góc phải dưới */}
      <div
        style={{
          position: 'absolute',
          right: 50,
          bottom: 330,
          fontFamily: FONT,
          fontSize: 34,
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
        }}
      >
        {brand.handle}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Thẻ tiêu đề mở đầu ---------- */
const Icon: React.FC<{kind: 'play' | 'star' | 'bars' | 'flame'; size: number}> = ({kind, size}) => {
  const c = brand.accent;
  const inner = {
    play: <path d="M38 28 L72 50 L38 72 Z" fill={c} />,
    star: <path d="M50 24 L58 42 L78 44 L63 57 L68 77 L50 66 L32 77 L37 57 L22 44 L42 42 Z" fill={c} />,
    bars: (
      <g fill={c}>
        <rect x="26" y="56" width="12" height="20" />
        <rect x="44" y="44" width="12" height="32" />
        <rect x="62" y="30" width="12" height="46" />
      </g>
    ),
    flame: <path d="M50 22 C56 38 74 44 70 64 C68 76 58 80 50 80 C40 80 30 74 30 62 C30 50 42 46 44 36 C46 30 48 26 50 22 Z" fill={c} />,
  }[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="rgba(20,10,5,0.75)" stroke={c} strokeWidth="2.5" opacity="0.9" />
      {inner}
    </svg>
  );
};

const HeadlineSceneView: React.FC<{s: HeadlineScene}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panel = spring({frame, fps, config: {damping: 18}, durationInFrames: 24});
  const pill = spring({frame: frame - 8, fps, config: {damping: 16}});
  return (
    <AbsoluteFill style={{background: '#222'}}>
      {/* nền mờ */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        {s.bgSrc ? (
          <Media
            src={s.bgSrc}
            style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(26px) brightness(0.85)', transform: 'scale(1.15)'}}
          />
        ) : (
          <AbsoluteFill style={{background: `linear-gradient(180deg,${theme.headlineBg[0]} 0%,${theme.headlineBg[1]} 60%,${theme.headlineBg[2]} 100%)`, filter: 'blur(12px)'}} />
        )}
      </AbsoluteFill>
      {/* panel tối phía dưới */}
      <AbsoluteFill
        style={{
          top: 1080 + (1 - panel) * 300,
          background: `linear-gradient(180deg, rgba(8,6,6,0) 0%, ${theme.panel}ee 14%, ${theme.panel} 100%)`,
        }}
      />
      {/* trang trí */}
      <div style={{position: 'absolute', left: 800, top: 1180, opacity: 0.35}}>
        <Icon kind="flame" size={150} />
      </div>
      <div style={{position: 'absolute', left: 880, top: 1420, opacity: 0.35}}>
        <Icon kind="bars" size={170} />
      </div>
      <div style={{position: 'absolute', left: 760, top: 1650, opacity: 0.35}}>
        <Icon kind="play" size={150} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 1700, opacity: 0.35}}>
        <Icon kind="star" size={140} />
      </div>
      {/* khung cam phát sáng */}
      <div
        style={{
          position: 'absolute',
          inset: 22,
          borderRadius: 34,
          border: `5px solid ${brand.accent}`,
          boxShadow: `0 0 28px ${brand.accent}aa, inset 0 0 22px ${brand.accent}55`,
        }}
      />
      {/* thẻ thương hiệu */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 1050,
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${(1 - pill) * -700}px)`,
        }}
      >
        <div style={{zIndex: 2}}>
          <Logo size={170} radius={28} />
        </div>
        <div
          style={{
            marginLeft: -22,
            height: 112,
            width: 700,
            borderRadius: 30,
            border: `4px solid ${brand.accent}`,
            background: 'linear-gradient(90deg,#1b0f08,#2b1608)',
            boxShadow: `0 0 26px ${brand.accent}88`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 56,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 58,
            color: '#fff',
            letterSpacing: 1,
          }}
        >
          {brand.label}
        </div>
      </div>
      {/* chip ngày */}
      <div
        style={{
          position: 'absolute',
          left: 118,
          top: 1262,
          background: '#8a3b10',
          borderRadius: 12,
          padding: '12px 26px',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 36,
          color: '#ffe9d6',
          opacity: interpolate(frame, [14, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        📅 : {s.date}
      </div>
      {/* tiêu đề, hiện từng dòng */}
      <div style={{position: 'absolute', left: 118, top: 1368, width: 880, fontFamily: FONT}}>
        {s.lines.map((line, i) => {
          const start = 22 + i * 9;
          const o = interpolate(frame, [start, start + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [start, start + 10], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={i}
              style={{
                opacity: o,
                transform: `translateY(${y}px)`,
                color: '#fff',
                fontWeight: 800,
                fontSize: 44,
                lineHeight: 1.45,
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Cảnh kết ---------- */
const EndSceneView: React.FC<{s: EndScene}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14}});
  const chars = Math.floor(interpolate(frame, [12, 12 + brand.handle.length * 3], [0, brand.handle.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{background: theme.endBg, alignItems: 'center'}}>
      <div style={{marginTop: 560, transform: `scale(${pop})`}}>
        <Logo size={220} radius={50} />
      </div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: 3}}>
        {brand.name}
      </div>
      {/* ô tìm kiếm */}
      <div
        style={{
          marginTop: 130,
          width: 800,
          height: 112,
          borderRadius: 14,
          background: '#fff',
          boxShadow: `-8px 0 0 #25f4ee, 8px 0 0 #fe2c55`,
          display: 'flex',
          alignItems: 'center',
          padding: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            height: '100%',
            borderRadius: 10,
            background: '#161823',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 28,
            gap: 22,
            fontFamily: FONT,
            fontSize: 46,
            color: '#e8e8ee',
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M16 16 L21 21" />
          </svg>
          <span>{brand.handle.slice(0, chars)}{caret ? '|' : ''}</span>
        </div>
      </div>
      <div style={{marginTop: 60, fontFamily: FONT, fontSize: 38, color: '#9aa0b4', opacity: interpolate(frame, [30, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {s.cta}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Ghép tất cả ---------- */
export const TrendNews: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s, i) => {
        const from = Math.round(s.from * FPS);
        const dur = Math.max(1, Math.round(s.to * FPS) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {s.type === 'headline' && <HeadlineSceneView s={s} />}
            {s.type === 'clip' && <ClipSceneView s={s} />}
            {s.type === 'end' && <EndSceneView s={s} />}
          </Sequence>
        );
      })}
      {voice && <Audio src={staticFile(voice)} />}
      {music && <Audio src={staticFile(music)} volume={0.12} />}
    </AbsoluteFill>
  );
};
```

### src/postConfig.ts
```ts
// ====== LAYOUT 2: "BÀI ĐĂNG ĐÈ LÊN VIDEO NỀN" (kiểu thread 12 phần) ======
// Video mẫu dài 184s: ~3.7s mở đầu + 12 thẻ bài đăng (mỗi thẻ ~12–15s), nền là clip loop đổi 3–10s/lần.
// Ở đây để bản demo ngắn (~31s). Thêm/bớt phần tử trong `posts` là xong.

export const POST_FPS = 30;

export type PostScene =
  | {type: 'title'; from: number; to: number; user: string; time: string; counter: string; text: string;
     likes: string; comments: string; reposts: string; shares: string; title: string; bg: BgLoop}
  | {type: 'post'; from: number; to: number; user: string; time: string; counter: string; text: string[];
     image?: string; bg: BgLoop}
  | {type: 'end'; from: number; to: number; cta: string};

// Nền: video/ảnh loop (đặt trong /public) hoặc để trống = nền gradient động giữ chỗ
export type BgLoop = {src?: string; from?: string; to?: string};

const pastel = (a: string, b: string): BgLoop => ({from: a, to: b});

export const postScenes: PostScene[] = [
  {
    type: 'title', from: 0, to: 4,
    user: 'ten_tai_khoan', time: '19 giờ', counter: '1/12',
    text: 'CHỦ ĐỀ CỦA THREAD',
    likes: '12K', comments: '121', reposts: '1,5K', shares: '1,5K',
    title: 'TIÊU ĐỀ GÂY TÒ MÒ, TỐI ĐA 4 DÒNG, NÊU RA VẤN ĐỀ VÀ HỨA HẸN ĐÁP ÁN?',
    bg: pastel('#cfe8d5', '#f3d9c9'),
  },
  {
    type: 'post', from: 4, to: 13, user: 'ten_tai_khoan', time: '19 giờ', counter: '2/12',
    text: [
      'TIÊU ĐỀ PHẦN 2 (IN HOA, ĐẬM)',
      'Đoạn nội dung dài vài dòng: mỗi thẻ chứa khoảng 4–7 dòng chữ, đủ để người xem đọc kịp trong 8–12 giây.',
      '1. Ý chính thứ nhất của phần này.',
      '2. Ý chính thứ hai, viết ngắn gọn.',
    ],
    bg: pastel('#f6d4dc', '#fbeccf'),
  },
  {
    type: 'post', from: 13, to: 22, user: 'ten_tai_khoan', time: '19 giờ', counter: '3/12',
    text: [
      'TIÊU ĐỀ PHẦN 3',
      'Thẻ có thể kèm ảnh minh hoạ phía dưới (điền `image` trong /public). Dùng cho sơ đồ, ảnh người tập, ảnh sản phẩm.',
    ],
    bg: pastel('#d6e4f6', '#e8d6f0'),
  },
  {
    type: 'post', from: 22, to: 28, user: 'ten_tai_khoan', time: '19 giờ', counter: '4/12',
    text: ['TIÊU ĐỀ PHẦN 4', 'Nội dung phần 4. Nền phía sau là clip loop dễ chịu, đổi liên tục để giữ mắt người xem.'],
    bg: pastel('#f9e3b8', '#d8efe4'),
  },
  {type: 'end', from: 28, to: 31, cta: 'Theo dõi để xem phần tiếp theo'},
];
export const POST_DURATION_SEC = 31;
```

### src/PostThread.tsx
```tsx
import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, theme} from './config';
import {postScenes, POST_FPS, BgLoop, PostScene} from './postConfig';
import {FONT, Logo, Media} from './Template';

type Title = Extract<PostScene, {type: 'title'}>;
type Post = Extract<PostScene, {type: 'post'}>;

/* nền loop: video/ảnh, hoặc gradient động giữ chỗ */
const LoopBg: React.FC<{bg: BgLoop}> = ({bg}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 300], [1.0, 1.08], {extrapolateRight: 'clamp'});
  if (bg.src) {
    return <Media src={bg.src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />;
  }
  const ang = 150 + Math.sin(frame / 40) * 25;
  return (
    <AbsoluteFill style={{background: `linear-gradient(${ang}deg, ${bg.from ?? '#ddd'}, ${bg.to ?? '#fff'})`}}>
      <div style={{position: 'absolute', top: 1500, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 34, color: 'rgba(0,0,0,0.35)'}}>
        video nền loop đặt ở đây (`bg.src`)
      </div>
    </AbsoluteFill>
  );
};

/* sticker logo góc phải trên, nghiêng nhẹ */
const Sticker: React.FC = () => (
  <div style={{position: 'absolute', right: 70, top: 300, transform: 'rotate(-6deg)'}}>
    <Logo size={190} radius={36} />
  </div>
);

const Avatar: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${brand.accent}, #6b4bd6)`, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: size * 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {brand.logoText.slice(0, 1)}
  </div>
);

const Meta: React.FC<{user: string; time: string; size?: number}> = ({user, time, size = 28}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT}}>
    <Avatar size={size * 1.8} />
    <span style={{fontWeight: 700, fontSize: size, color: theme.postCardText}}>{user}</span>
    <span style={{fontSize: size * 0.85, color: '#9a9a9a'}}>{time}</span>
  </div>
);

const Counter: React.FC<{c: string; size: number}> = ({c, size}) => (
  <span style={{fontSize: size, color: '#9a9a9a', background: '#efefef', borderRadius: 10, padding: '2px 12px', marginLeft: 14, fontWeight: 500}}>{c}</span>
);

const Stat: React.FC<{icon: string; v: string; size: number; color?: string}> = ({icon, v, size, color}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, marginRight: 36, color: color ?? '#666', fontSize: size}}>
    <span>{icon}</span>
    {v}
  </span>
);

const pop = (frame: number, fps: number) => spring({frame, fps, config: {damping: 15, stiffness: 140}});

/* ---- Cảnh mở đầu: thẻ bài đăng + thẻ tiêu đề ---- */
const TitleView: React.FC<{s: Title}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(frame, fps);
  const b = pop(frame - 10, fps);
  return (
    <AbsoluteFill>
      <LoopBg bg={s.bg} />
      <Sticker />
      <div style={{position: 'absolute', left: 80, right: 80, top: 540, transform: `scale(${a})`, background: theme.postCardBg, padding: '34px 40px', fontFamily: FONT, boxShadow: '0 10px 40px rgba(0,0,0,0.18)'}}>
        <Meta user={s.user} time={s.time} size={36} />
        <div style={{marginTop: 30, fontSize: 44, color: theme.postCardText, display: 'flex', alignItems: 'center'}}>
          {s.text}
          <Counter c={s.counter} size={30} />
        </div>
        <div style={{marginTop: 34, fontSize: 36}}>
          <Stat icon="❤" v={s.likes} size={36} color="#e8223c" />
          <Stat icon="◯" v={s.comments} size={36} />
          <Stat icon="⟲" v={s.reposts} size={36} />
          <Stat icon="➤" v={s.shares} size={36} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute', left: 80, right: 80, top: 1000, height: 640,
          transform: `translateY(${(1 - b) * 400}px)`, opacity: b > 0.02 ? 1 : 0,
          background: `radial-gradient(circle at 20% 90%, ${theme.cloudA}, transparent 55%), ${theme.titleCardBg}`,
          border: `6px solid ${theme.titleCardBorder}`, borderRadius: 34,
          boxShadow: `14px 14px 0 ${theme.titleCardBorder}`, fontFamily: FONT,
        }}
      >
        <div style={{position: 'absolute', left: 40, top: 30, fontSize: 52, fontWeight: 900, color: brand.accent, letterSpacing: 1}}>{brand.name}</div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 150, textAlign: 'center', fontSize: 54, lineHeight: 1.35, fontWeight: 900, color: theme.titleCardText}}>
          {s.title}
        </div>
        <div style={{position: 'absolute', right: 40, bottom: 28}}>
          <Logo size={120} radius={26} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---- Cảnh bài đăng ---- */
const PostView: React.FC<{s: Post}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(frame, fps);
  return (
    <AbsoluteFill>
      <LoopBg bg={s.bg} />
      <Sticker />
      <div style={{position: 'absolute', left: 44, right: 44, top: s.image ? 520 : 700, transform: `scale(${0.94 + 0.06 * a})`, opacity: a, display: 'flex', flexDirection: 'column', gap: 0}}>
        <div style={{background: theme.postCardBg, padding: '30px 36px', fontFamily: FONT, boxShadow: '0 10px 40px rgba(0,0,0,0.18)'}}>
          <Meta user={s.user} time={s.time} />
          <div style={{marginTop: 22, fontSize: 31, lineHeight: 1.5, color: theme.postCardText}}>
            {s.text.map((line, i) => (
              <div key={i} style={{fontWeight: i === 0 ? 800 : 400, marginTop: i === 0 ? 0 : 8}}>
                {line}
                {i === s.text.length - 1 && <Counter c={s.counter} size={24} />}
              </div>
            ))}
          </div>
          <div style={{marginTop: 24, fontSize: 28, color: '#777'}}>♡ 24    ◯ 1    ⟲ 3    ➤</div>
        </div>
        {s.image && (
          <Img src={staticFile(s.image)} style={{marginTop: 28, marginLeft: 50, width: 700, background: '#fff', objectFit: 'cover'}} />
        )}
      </div>
    </AbsoluteFill>
  );
};

const EndView: React.FC<{cta: string}> = ({cta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps);
  return (
    <AbsoluteFill style={{background: theme.endBg, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${p})`}}><Logo size={240} radius={54} /></div>
      <div style={{marginTop: 50, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: '#fff'}}>{brand.name}</div>
      <div style={{marginTop: 30, fontFamily: FONT, fontSize: 40, color: '#9aa0b4'}}>{cta}</div>
    </AbsoluteFill>
  );
};

export const PostThread: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {postScenes.map((s, i) => {
      const from = Math.round(s.from * POST_FPS);
      const dur = Math.max(1, Math.round(s.to * POST_FPS) - from);
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          {s.type === 'title' && <TitleView s={s} />}
          {s.type === 'post' && <PostView s={s} />}
          {s.type === 'end' && <EndView cta={s.cta} />}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
```