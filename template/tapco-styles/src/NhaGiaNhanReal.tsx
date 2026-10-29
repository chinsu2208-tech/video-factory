import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/baloo-2/latin-ext-800.css';
import '@fontsource/baloo-2/vietnamese-800.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/vietnamese-600.css';

// ====== TEMPLATE: PR APP BẰNG ẢNH/VIDEO MÀN HÌNH THẬT (Nhà Gia Nhân) ======
// Mỗi cảnh = 1 ảnh app thật (public/gn/aN.png) + cửa sổ zoom từ→đến + vòng sáng + caption.
// Chỉ đưa vào tính năng thấy được trong ảnh. Tập mới: sửa mảng SC bên dưới.
const H = '"Baloo 2","Be Vietnam Pro",sans-serif';
const INK = '#2b4a46';
const CORAL = '#e5654f';
const CX = 490; // trục giữa chung (né cột icon TikTok bên phải)
const CW = 780;
const ease = Easing.inOut(Easing.cubic);

type Win = {x: number; y: number; w: number};
type Ring = {x: number; y: number; w: number; h: number; at?: number};
type Toast = {at: number; who: number; text: string; y: number; side?: 1 | -1};
type Call = {at: number; text: string; x: number; y: number; dx: number; dy: number};
type Pill = {at: number; text: string; x: number; y: number; c?: string};
type Sc = {toasts?: Toast[]; calls?: Call[]; pills?: Pill[]; avRow?: {at: number; ids: number[]; y: number; d: number}; spark?: boolean; s: number; e: number; img: number; iw: number; ih: number; cardH: number; from: Win; to: Win; ring?: Ring; num?: number; title: string[]; sub?: string; cap: string; hideCard?: boolean};


// Avatar thật: cắt từ ảnh màn hình "Gia nhân" (a4.png)
const AV = [
  {n: 'Quản gia Hoàng', cx: 102, cy: 193}, {n: 'Bác sĩ Minh', cx: 287, cy: 193}, {n: 'Chef Linh', cx: 471, cy: 193}, {n: 'Chú Tài', cx: 656, cy: 193},
  {n: 'Luật sư Quang', cx: 102, cy: 449}, {n: 'HLV Nam', cx: 287, cy: 449}, {n: 'Cô Tâm', cx: 471, cy: 449}, {n: 'Cô Dinh', cx: 656, cy: 449},
  {n: 'Thầy Học', cx: 102, cy: 675}, {n: 'Thầy Ba', cx: 287, cy: 675},
];
let UID = 0;
const Avatar: React.FC<{i: number; d: number; x: number; y: number; p: number; bob?: number}> = ({i, d, x, y, p, bob = 0}) => {
  const a = AV[i];
  const k = d / 76;
  const id = `av${i}_${Math.round(x)}_${Math.round(y)}`;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${p})`} opacity={Math.min(1, p)}>
      <clipPath id={id}><rect x={-d / 2} y={-d / 2} width={d} height={d} rx={d * 0.26} /></clipPath>
      <rect x={-d / 2 - 5} y={-d / 2 - 5} width={d + 10} height={d + 10} rx={d * 0.3} fill="#fff" filter="url(#grsh)" />
      <g clipPath={`url(#${id})`}>
        <image href={staticFile('gn/a4.png')} x={-d / 2 - (a.cx - 38) * k} y={-d / 2 - (a.cy - 38) * k} width={752 * k} height={1246 * k} />
      </g>
    </g>
  );
};

const Star: React.FC<{x: number; y: number; r: number; p: number; c?: string}> = ({x, y, r, p, c = '#fbd35b'}) => (
  <path transform={`translate(${x} ${y}) scale(${p}) rotate(${p * 40})`} d={`M0,${-r} Q${r * 0.18},${-r * 0.18} ${r},0 Q${r * 0.18},${r * 0.18} 0,${r} Q${-r * 0.18},${r * 0.18} ${-r},0 Q${-r * 0.18},${-r * 0.18} 0,${-r} Z`} fill={c} stroke="#fff" strokeWidth={3} />
);

const ToastCard: React.FC<{tt: Toast; p: number; out: number; t: number}> = ({tt, p, out, t}) => {
  const side = tt.side ?? 1;
  const x = CX - 370 + side * (1 - p) * 520;
  return (
    <g transform={`translate(${x} ${tt.y + Math.sin(t * 2.4 + tt.y) * 5})`} opacity={Math.min(1, p) * out}>
      <rect width={740} height={132} rx={40} fill="#fff" filter="url(#grsh)" />
      <rect x={3} y={3} width={734} height={126} rx={37} fill="none" stroke="#e3efed" strokeWidth={3} />
      <Avatar i={tt.who} d={84} x={72} y={66} p={1} />
      <foreignObject x={130} y={14} width={580} height={108}>
        <div style={{fontFamily: H, fontWeight: 600, fontSize: 31, lineHeight: 1.18, color: INK, display: 'flex', alignItems: 'center', height: 104}}>{tt.text}</div>
      </foreignObject>
      <circle cx={716} cy={22} r={11} fill={CORAL} stroke="#fff" strokeWidth={4} />
    </g>
  );
};

export const GR_SC: Sc[] = [
  {s: 0, e: 4, img: 1, iw: 496, ih: 904, cardH: 560, from: {x: 8, y: 178, w: 480}, to: {x: 40, y: 196, w: 420}, title: ['Một ngôi nhà để về,', 'có người quan tâm mỗi ngày'], cap: 'Ngôi nhà 3D, kéo để xoay', avRow: {at: 1.4, ids: [0,1,2,3,4,5,6,7,8,9], y: 1300, d: 62}},
  {s: 4, e: 7.5, img: 6, iw: 570, ih: 372, cardH: 520, from: {x: 5, y: 1, w: 555}, to: {x: 100, y: 60, w: 420}, title: ['Mỗi gia nhân', 'một khu riêng'], cap: 'Sân, bếp, phòng khách…', spark: true,
    calls: [{at: 1.0, text: 'HLV Nam', x: 125, y: 228, dx: -40, dy: -120}, {at: 1.5, text: 'Cô Tâm', x: 272, y: 190, dx: 10, dy: -130}, {at: 2.0, text: 'Thầy Ba', x: 385, y: 285, dx: 50, dy: -150}]},
  {s: 7.5, e: 11.5, img: 1, iw: 496, ih: 904, cardH: 330, from: {x: 4, y: 0, w: 488}, to: {x: 10, y: 40, w: 470}, ring: {x: 12, y: 58, w: 474, h: 104, at: 0.8}, num: 1, title: ['Gia nhân', 'chủ động hỏi thăm'], cap: 'Chú Tài hỏi thăm bạn mỗi ngày', spark: true,
    toasts: [{at: 1.3, who: 3, y: 1090, text: 'Hôm nay có “Kiểm tra danh sách mua sắm cho gia đình” lúc 09:00'}]},
  {s: 11.5, e: 15.5, img: 1, iw: 496, ih: 904, cardH: 560, from: {x: 8, y: 540, w: 480}, to: {x: 8, y: 552, w: 466}, ring: {x: 14, y: 572, w: 468, h: 132, at: 0.8}, num: 2, title: ['Việc hằng ngày', 'có người nhắc'], cap: 'Giờ nào, ai nhắc, đều rõ ràng', spark: true,
    toasts: [{at: 1.2, who: 0, y: 1200, text: 'Lúc 16:00 nhớ “Nhắc lịch dọn đẹp khu vực chơi của con” nha', side: -1}, {at: 2.1, who: 2, y: 1345, text: 'Lúc 10:00 nhớ “Uống đủ 2 lít nước trong ngày” nha'}]},
  {s: 15.5, e: 19.5, img: 2, iw: 736, ih: 1232, cardH: 960, from: {x: 0, y: 60, w: 736}, to: {x: 0, y: 260, w: 736}, ring: {x: 6, y: 76, w: 724, h: 46, at: 0.8}, num: 3, title: ['Trò chuyện'], cap: 'Hỏi một người hoặc cả đội', spark: true,
    avRow: {at: 1.0, ids: [0, 2, 3], y: 1440, d: 84}, pills: [{at: 1.8, text: 'Cả đội', x: 640, y: 1440}]},
  {s: 19.5, e: 23.5, img: 3, iw: 738, ih: 1236, cardH: 960, from: {x: 0, y: 90, w: 738}, to: {x: 0, y: 320, w: 738}, ring: {x: 14, y: 190, w: 712, h: 210, at: 0.8}, num: 4, title: ['Hôm nay'], cap: 'Tích việc nhỏ, ghi tâm trạng', spark: true,
    pills: [{at: 1.0, text: '5 việc cần nhắc', x: 320, y: 1420}, {at: 1.7, text: 'Nhật ký tâm trạng', x: 690, y: 1420, c: '#7cc29a'}]},
  {s: 23.5, e: 27, img: 4, iw: 752, ih: 1246, cardH: 960, from: {x: 0, y: 80, w: 752}, to: {x: 0, y: 250, w: 752}, ring: {x: 12, y: 82, w: 112, h: 42, at: 0.8}, num: 5, title: ['Gia nhân'], cap: 'Chọn gia nhân bạn cần', spark: true,
    pills: [{at: 1.0, text: 'Đã thuê · 3', x: 300, y: 1420, c: '#7cc29a'}, {at: 1.6, text: 'Chưa thuê · 7', x: 680, y: 1420, c: '#8aa29e'}]},
  {s: 27, e: 30.5, img: 5, iw: 564, ih: 984, cardH: 960, from: {x: 0, y: 40, w: 564}, to: {x: 0, y: 290, w: 564}, ring: {x: 14, y: 254, w: 536, h: 126, at: 0.6}, num: 6, title: ['Tự chỉnh gia nhân'], cap: 'Tính cách, tóc, màu áo tuỳ bạn', spark: true,
    pills: [{at: 0.9, text: 'Kiểu tóc', x: 230, y: 1420}, {at: 1.4, text: 'Màu áo', x: 490, y: 1420, c: '#4fb3b0'}, {at: 1.9, text: 'Phụ kiện', x: 740, y: 1420, c: '#f2a33a'}]},
  {s: 30.5, e: 34, img: 1, iw: 496, ih: 904, cardH: 560, from: {x: 8, y: 178, w: 480}, to: {x: 8, y: 178, w: 480}, title: ['Nhà Gia Nhân'], sub: 'Một ngôi nhà để về, có người quan tâm mỗi ngày', cap: 'Link ở bio nha', spark: true, avRow: {at: 0.6, ids: [0,1,2,3,4,5,6,7,8,9], y: 1300, d: 62}},
];
export const GR_TOTAL = 34;

export const NhaGiaNhanReal: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const idx = Math.max(0, GR_SC.findIndex((s) => t >= s.s && t < s.e));
  const sc = GR_SC[idx];
  const lt = t - sc.s;
  const dur = sc.e - sc.s;
  const k = ease(interpolate(lt, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const win = {x: sc.from.x + (sc.to.x - sc.from.x) * k, y: sc.from.y + (sc.to.y - sc.from.y) * k, w: sc.from.w + (sc.to.w - sc.from.w) * k};
  const scale = CW / win.w;
  const cardTop = 880 - sc.cardH / 2 + (idx === 8 ? 80 : 0);
  const enter = spring({frame: f - Math.round(sc.s * fps), fps, config: {damping: 15, stiffness: 110}});
  const exit = interpolate(lt, [dur - 0.3, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitE = ease(exit);
  const op = Math.min(1, enter) * exit;
  const capP = Math.min(1, spring({frame: f - Math.round((sc.s + 0.25) * fps), fps, config: {damping: 15}}));
  const titleP = Math.min(1, spring({frame: f - Math.round((sc.s + 0.1) * fps), fps, config: {damping: 16}}));
  const r = sc.ring;
  const ringOn = r ? interpolate(lt, [r.at ?? 0.8, (r.at ?? 0.8) + 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const pulse = 0.75 + 0.25 * Math.sin(t * 6);
  const cid = `clip${idx}`;

  return (
    <AbsoluteFill style={{background: '#edf4f3'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="grbg" cx="50%" cy="38%" r="70%">
            <stop offset="0" stopColor="#f7fbfa" />
            <stop offset="1" stopColor="#dbe9e7" />
          </radialGradient>
          <clipPath id={cid}>
            <rect x={0} y={0} width={CW} height={sc.cardH} rx={36} />
          </clipPath>
          <filter id="grsh" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx={0} dy={14} stdDeviation={16} floodColor="#2b4a46" floodOpacity={0.22} />
          </filter>
        </defs>
        <rect width={1080} height={1920} fill="url(#grbg)" />
        {[['#cfe6f7', 120, 520, 220], ['#fbd3bd', 960, 900, 260], ['#a9dfc4', 200, 1350, 240]].map(([c, bx, by, br], i) => (
          <circle key={i} cx={(bx as number) + Math.sin(t * 0.6 + i * 2) * 40} cy={(by as number) + Math.cos(t * 0.5 + i) * 50} r={br as number} fill={c as string} opacity={0.45} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={120 + i * 170} cy={((t * 40 + i * 330) % 1700) + 120} r={6 + (i % 3) * 3} fill="#fff" opacity={0.7} />
        ))}

        {/* tiêu đề */}
        <g opacity={titleP * exit} transform={`translate(${CX} ${sc.title.length > 1 ? 318 : 340 + (1 - titleP) * 20})`}>
          {sc.title.map((l, i) => (
            <text key={i} y={i * (sc.sub ? 100 : 62)} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={sc.sub ? 96 : sc.title.length > 1 ? 52 : 62} fill={INK} stroke="#fff" strokeWidth={12} paintOrder="stroke" strokeLinejoin="round">{l}</text>
          ))}
          {sc.sub && <text y={110} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={32} fill="#3f6b64" stroke="#fff" strokeWidth={8} paintOrder="stroke">{sc.sub}</text>}
        </g>

        {/* khung ảnh app thật */}
        <g transform={`translate(${CX - CW / 2 + (1 - Math.min(1, enter)) * 300 - (1 - exitE) * 300} ${cardTop})`} opacity={op}>
          <rect x={0} y={0} width={CW} height={sc.cardH} rx={36} fill="#fff" filter="url(#grsh)" />
          <g clipPath={`url(#${cid})`}>
            <image href={staticFile(`gn/a${sc.img}.png`)} x={-win.x * scale} y={-win.y * scale} width={sc.iw * scale} height={sc.ih * scale} preserveAspectRatio="none" />
            {r && (
              <rect
                x={(r.x - win.x) * scale} y={(r.y - win.y) * scale} width={r.w * scale} height={r.h * scale} rx={18}
                fill="none" stroke={CORAL} strokeWidth={7} opacity={ringOn * pulse}
              />
            )}
          </g>
          <rect x={0} y={0} width={CW} height={sc.cardH} rx={36} fill="none" stroke="#fff" strokeWidth={8} />
          {r && [0, 0.55].map((d, i) => {
            const q = (lt - (r.at ?? 0.8) - 0.3 - d) / 0.9;
            if (q < 0 || q > 1) return null;
            return <circle key={i} cx={(r.x + r.w / 2 - win.x) * scale} cy={(r.y + r.h / 2 - win.y) * scale} r={20 + q * 90} fill="none" stroke={CORAL} strokeWidth={6 * (1 - q)} opacity={1 - q} />;
          })}
          {sc.spark && r && [[-1, -1], [1, -1], [1, 1]].map(([ax, ay], i) => {
            const q = Math.min(1, Math.max(0, (lt - (r.at ?? 0.8) - 0.2 - i * 0.12) / 0.4));
            return <Star key={i} x={(r.x + r.w / 2 + ax * r.w / 2 - win.x) * scale} y={(r.y + r.h / 2 + ay * r.h / 2 - win.y) * scale} r={22 + i * 4} p={q * (0.85 + 0.15 * Math.sin(t * 7 + i))} />;
          })}
          {(sc.calls || []).map((c, i) => {
            const q = Math.min(1, Math.max(0, (lt - c.at) / 0.45));
            const tx = (c.x - win.x) * scale, ty = (c.y - win.y) * scale;
            const lx = tx + c.dx, ly = ty + c.dy;
            return (
              <g key={i} opacity={q}>
                <line x1={tx} y1={ty} x2={tx + (lx - tx) * q} y2={ty + (ly - ty) * q} stroke={CORAL} strokeWidth={5} strokeLinecap="round" />
                <circle cx={tx} cy={ty} r={9} fill={CORAL} stroke="#fff" strokeWidth={3} />
                <g transform={`translate(${lx} ${ly}) scale(${0.7 + 0.3 * q})`}>
                  <rect x={-92} y={-30} width={184} height={60} rx={30} fill="#fff" stroke={CORAL} strokeWidth={4} />
                  <text textAnchor="middle" y={11} fontFamily={H} fontWeight={800} fontSize={32} fill={INK}>{c.text}</text>
                </g>
              </g>
            );
          })}
          {sc.num && (
            <g transform="translate(14 14)" opacity={Math.min(1, enter)}>
              <circle r={36} fill={CORAL} stroke="#fff" strokeWidth={6} />
              <text y={14} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={42} fill="#fff">{sc.num}</text>
            </g>
          )}
        </g>

        {(sc.toasts || []).map((tt, i) => {
          const p = spring({frame: f - Math.round((sc.s + tt.at) * fps), fps, config: {damping: 13, stiffness: 100}});
          return <ToastCard key={i} tt={tt} p={Math.max(0, p)} out={exit} t={t} />;
        })}
        {sc.avRow && sc.avRow.ids.map((id, i) => {
          const n = sc.avRow!.ids.length;
          const gap = n > 5 ? 76 : 150;
          const x = CX - ((n - 1) * gap) / 2 + i * gap;
          const p = Math.max(0, spring({frame: f - Math.round((sc.s + sc.avRow!.at + i * 0.1) * fps), fps, config: {damping: 9, stiffness: 140}}));
          return <Avatar key={i} i={id} d={sc.avRow!.d} x={x} y={sc.avRow!.y} p={p * exit} bob={Math.sin(t * 3 + i) * 5} />;
        })}
        {(sc.pills || []).map((pl, i) => {
          const p = Math.max(0, spring({frame: f - Math.round((sc.s + pl.at) * fps), fps, config: {damping: 11, stiffness: 130}}));
          const w = pl.text.length * 19 + 70;
          return (
            <g key={i} transform={`translate(${pl.x - (pl.x > 700 ? 40 : 0)} ${pl.y + Math.sin(t * 3 + i * 2) * 6}) scale(${p})`} opacity={Math.min(1, p) * exit}>
              <rect x={-w / 2} y={-34} width={w} height={68} rx={34} fill={pl.c || CORAL} stroke="#fff" strokeWidth={5} filter="url(#grsh)" />
              <text textAnchor="middle" y={12} fontFamily={H} fontWeight={800} fontSize={34} fill="#fff">{pl.text}</text>
            </g>
          );
        })}
        {sc.avRow && sc.spark && [[170, 1200], [900, 1230], [520, 1150]].map(([x, y], i) => (
          <Star key={i} x={x} y={y + Math.sin(t * 3 + i) * 6} r={20 + i * 5} p={Math.min(1, Math.max(0, (lt - 1.2 - i * 0.2) / 0.4))} c={i % 2 ? '#f4907b' : '#fbd35b'} />
        ))}
        {/* caption */}
        <g transform={`translate(${CX} 1585) scale(${0.9 + 0.1 * capP})`} opacity={capP * exit}>
          <rect x={-370} y={-44} width={740} height={88} rx={44} fill="#fff" stroke={INK} strokeWidth={4} />
          <text textAnchor="middle" y={14} fontFamily={H} fontWeight={800} fontSize={sc.cap.length > 30 ? 34 : 42} fill={INK}>{sc.cap}</text>
        </g>
        <text x={CX} y={1690} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={22} fill="#6c8984">Ảnh chụp từ app Nhà Gia Nhân</text>
      </svg>
    </AbsoluteFill>
  );
};
