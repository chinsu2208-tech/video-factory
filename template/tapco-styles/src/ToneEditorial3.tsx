import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/playfair-display/vietnamese-600.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/playfair-display/vietnamese-700.css';
import '@fontsource/playfair-display/latin-600-italic.css';
import '@fontsource/playfair-display/vietnamese-600-italic.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';

// ===== Tonelux editorial graphic motion (Remotion, 1080x1920) =====
export const TE3_TOTAL = 56; // seconds
const GOLD = '#E3B04B', GOLDL = '#F1D58A', BEIGE = '#F1E2C8';
const IV = '#FCF7EC', ES = '#3A2E24', BU = '#743D4B', OL = '#85866A', RO = '#D6A6A5', TA = '#B9AA98';
const SERIF = "'Playfair Display', serif", SANS = "'Be Vietnam Pro', sans-serif";
const e1 = Easing.bezier(0.65, 0, 0.35, 1), e2 = Easing.bezier(0.16, 1, 0.3, 1);
const pr = (f: number, a: number, b: number, ea = e2) =>
  interpolate(f, [a * 30, b * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ea});
const CX = 490, L = 110, R = 870; // safe axis and margins

// ---------- caption chunks (seconds) ----------
const CAPS: [number, number, string][] = [
  [0, 2.2, 'Một buổi test màu cho bạn 3 thứ'], [2.2, 3.1, 'nguyên nhân,'], [3.1, 4.0, 'bằng chứng,'], [4.0, 4.9, 'và bảng màu.'],
  [4.9, 7.1, '1. Nguyên nhân'],
  [7.1, 8.2, 'Nhiều bạn mua son, áo, màu tóc'], [8.2, 9.9, 'mà không hợp, rồi nghĩ'], [9.9, 10.9, '“chắc da mình có vấn đề”'],
  [10.9, 12.4, 'Thực tế phần lớn là'], [12.4, 13.5, 'lệch undertone.'],
  [13.5, 15.8, 'Màu lệch tông làm da xỉn,'], [15.8, 17.7, 'quầng mắt rõ hơn,'], [17.7, 19.0, 'nhìn mệt dù ngủ đủ.'],
  [19.0, 21.0, '2. Bằng chứng'],
  [21.0, 22.4, 'Chuyên viên đặt từng tấm vải cạnh mặt,'], [22.4, 24.5, 'cùng ánh sáng,'], [24.5, 26.4, 'cùng khoảng cách.'],
  [26.4, 28.5, 'Màu hợp thì da đều và sáng lên,'], [28.5, 30.3, 'màu lệch thì thấy xỉn ngay.'],
  [30.3, 31.5, 'Bạn nhìn bằng mắt mình,'], [31.5, 32.8, 'không cần tin lời ai.'],
  [32.8, 34.8, '3. Bảng màu'],
  [34.8, 36.7, 'Cuối buổi bạn có bảng màu cố định:'], [36.7, 37.7, 'màu nên dùng,'], [37.7, 38.8, 'màu nên né.'],
  [38.8, 40.9, 'Mua son, áo, nhuộm tóc theo bảng này,'], [40.9, 43.4, 'giảm hẳn chuyện mua rồi bỏ xó.'],
  [43.4, 45.5, 'Tự soi gương rất khó chuẩn'], [45.5, 46.5, 'vì ánh sáng đổi liên tục'], [46.5, 48.5, 'và mắt mình quen với mặt mình.'],
  [48.5, 50.8, 'Test là cách nhanh nhất'], [50.8, 52.5, 'để có đáp án chắc chắn.'],
  [52.5, 53.9, 'Muốn biết bảng màu của mình,'], [53.9, 56, 'đặt lịch tư vấn ở link trong bio'],
];

// ---------- primitives ----------
const Words: React.FC<{text: string; f: number; start?: number; size: number; color?: string; italic?: boolean; font?: string; lh?: number; gap?: number; align?: 'left' | 'center'; w?: number; weight?: number; ls?: number}> = ({text, f, start = 0, size, color = ES, italic, font = SERIF, lh = 1.08, gap = 0.1, align = 'left', w = R - L, weight = 600, ls = 0}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', width: w, columnGap: size * 0.26, rowGap: 0}}>
    {text.split(' ').map((t, i) => {
      const p = pr(f, start + i * gap, start + i * gap + 0.55);
      return (
        <span key={i} style={{display: 'inline-block', overflow: 'hidden', lineHeight: lh, paddingBottom: size * 0.12}}>
          <span style={{display: 'inline-block', fontFamily: font, fontStyle: italic ? 'italic' : 'normal', fontWeight: weight, fontSize: size, color, letterSpacing: ls, transform: `translateY(${(1 - p) * 115}%)`}}>{t}</span>
        </span>
      );
    })}
  </div>
);
const Line: React.FC<{x: number; y: number; w: number; f: number; start?: number; dur?: number; color?: string; th?: number}> = ({x, y, w, f, start = 0, dur = 0.7, color = ES, th = 2}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w * pr(f, start, start + dur, e1), height: th, background: color}} />
);
const Small: React.FC<{x: number; y: number; text: string; f: number; start?: number; color?: string; size?: number; align?: 'left' | 'right' | 'center'; w?: number}> = ({x, y, text, f, start = 0, color = ES, size = 26, align = 'left', w = 700}) => {
  const p = pr(f, start, start + 0.5);
  const left = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
  return <div style={{position: 'absolute', left, top: y, width: w, textAlign: align, fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: size * 0.16, textTransform: 'uppercase', color, opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>{text}</div>;
};
const Header: React.FC<{idx: string; label: string; f: number; color: string; ink?: string}> = ({idx, label, f, color, ink = ES}) => (
  <>
    <Small x={L} y={292} text="Tonelux · Personal Color" f={f} color={ink} size={20} />
    <div style={{position: 'absolute', left: R - 200, top: 276, width: 200, textAlign: 'right', fontFamily: SERIF, fontWeight: 700, fontSize: 54, color, opacity: pr(f, 0.1, 0.5)}}>{idx}</div>
    <Small x={R} y={340} text={label} f={f} start={0.15} color={ink} size={20} align="right" w={400} />
    <Line x={L} y={332} w={R - L - 0} f={f} start={0.1} color={ink} th={1.5} />
  </>
);

// real footage pane with geometric mask reveal + offset colour block
const VideoPane: React.FC<{f: number; x?: number; y: number; w?: number; h: number; oy?: number; src0: number; block?: string; reveal?: number}> = ({f, x = L, y, w = 760, h, oy = 0, src0, block = BU, reveal = 0}) => {
  const p = pr(f, reveal, reveal + 0.7, e1);
  return (
    <>
      <div style={{position: 'absolute', left: x + 18, top: y + 18, width: w, height: h * p, background: block}} />
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, background: ES}}>
        <OffthreadVideo src={staticFile('tl/src.mp4')} startFrom={Math.round(src0 * 30)} muted style={{position: 'absolute', left: 0, top: -oy, width: w, height: (w * 1280) / 720}} />
      </div>
    </>
  );
};

// annotation: dot on the footage + thin leader + label tag
const Marker: React.FC<{f: number; start: number; dx: number; dy: number; lx: number; ly: number; text: string; color?: string}> = ({f, start, dx, dy, lx, ly, text, color = IV}) => {
  const p = pr(f, start, start + 0.6);
  const len = Math.hypot(lx - dx, ly - dy);
  const ang = (Math.atan2(ly - dy, lx - dx) * 180) / Math.PI;
  return (
    <>
      <div style={{position: 'absolute', left: dx - 9, top: dy - 9, width: 18, height: 18, borderRadius: 9, border: `3px solid ${color}`, background: 'rgba(48,39,32,.35)', transform: `scale(${p})`}} />
      <div style={{position: 'absolute', left: dx, top: dy, width: len * p, height: 2, background: color, transformOrigin: '0 50%', transform: `rotate(${ang}deg)`}} />
      <div style={{position: 'absolute', left: lx, top: ly - 26, padding: '9px 18px', background: color, color: ES, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', opacity: pr(f, start + 0.35, start + 0.7), transform: `translateX(${(1 - pr(f, start + 0.35, start + 0.8)) * 24}px)`, whiteSpace: 'nowrap'}}>{text}</div>
    </>
  );
};

const Swatch: React.FC<{x: number; y: number; w: number; h: number; color: string; f: number; start: number; from?: 'left' | 'bottom'; r?: number}> = ({x, y, w, h, color, f, start, from = 'left', r = 0}) => {
  const p = pr(f, start, start + 0.7);
  const tx = from === 'left' ? (1 - p) * -120 : 0, ty = from === 'bottom' ? (1 - p) * 120 : 0;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: color, borderRadius: r, opacity: Math.min(1, p * 2), transform: `translate(${tx}px,${ty}px) scaleX(${0.3 + 0.7 * p})`, transformOrigin: 'left center'}} />;
};

// scene wrapper: colour wipe in (8f) + out (12f) then content
const Scene: React.FC<{s: number; e: number; bg: string; wipe: string; children: (f: number) => React.ReactNode}> = ({s, e, bg, wipe, children}) => {
  const f0 = useCurrentFrame();
  const x = interpolate(f0, [0, 8, 20], [-1080, 0, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e1});
  return (
    <Sequence from={Math.round(s * 30) - 8} durationInFrames={Math.round((e - s) * 30) + 8}>
      <Sequence from={8}>
        <ContentFrame bg={bg}>{children}</ContentFrame>
      </Sequence>
      <WipeBlock color={wipe} />
    </Sequence>
  );
};
const WipeBlock: React.FC<{color: string}> = ({color}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 8, 20], [-1080, 0, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e1});
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: color, transform: `translateX(${x}px)`}} />;
};
const ContentFrame: React.FC<{bg: string; children: (f: number) => React.ReactNode}> = ({bg, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '7px 7px'}} />
      {children(f)}
    </AbsoluteFill>
  );
};

const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const c = CAPS.find(([a, b]) => t >= a && t < b);
  if (!c) return null;
  const p = pr(f, c[0], c[0] + 0.25);
  const dark = false;
  return (
    <div style={{position: 'absolute', left: CX - 370, top: 1585, width: 740, display: 'flex', justifyContent: 'center', opacity: p}}>
      <div style={{background: dark ? IV : ES, color: dark ? ES : IV, fontFamily: SANS, fontWeight: 600, fontSize: 36, padding: '8px 26px', whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * 10}px)`}}>{c[2]}</div>
    </div>
  );
};

// ---------- SVG library ----------
const dr = (p: number) => ({pathLength: 1 as const, strokeDasharray: 1, strokeDashoffset: 1 - Math.min(1, Math.max(0, p)), opacity: p > 0.001 ? 1 : 0});
const Svg: React.FC<{x: number; y: number; w: number; h: number; vb: string; sc?: number; rot?: number; op?: number; children: React.ReactNode}> = ({x, y, w, h, vb, sc = 1, rot = 0, op = 1, children}) => (
  <svg width={w} height={h} viewBox={vb} style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `scale(${sc}) rotate(${rot}deg)`, opacity: op}}>{children}</svg>
);
const WC = ['#E7A35E', '#E8BB6B', '#D6C46E', '#A6B070', '#85866A', '#6FA195', '#7DA3B8', '#8E94C2', '#A98BB5', '#C77F9B', '#C9786F', '#D98B63'];
const polar = (cx: number, cy: number, r: number, d: number) => [cx + r * Math.cos((d * Math.PI) / 180), cy + r * Math.sin((d * Math.PI) / 180)];
const wedge = (cx: number, cy: number, r: number, r0: number, i: number) => {
  const a0 = i * 30 - 90, a1 = a0 + 30;
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1), [x2, y2] = polar(cx, cy, r0, a1), [x3, y3] = polar(cx, cy, r0, a0);
  return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3} Z`;
};
const Wheel: React.FC<{cx: number; cy: number; r: number; r0: number; f: number; start: number; rot?: number; hi?: number[]; lo?: number[]; hiT?: number; loT?: number; op?: number}> = ({cx, cy, r, r0, f, start, rot = 0, hi = [], lo = [], hiT = 99, loT = 99, op = 1}) => (
  <g transform={`rotate(${rot} ${cx} ${cy})`} opacity={op}>
    {WC.map((c, i) => {
      const p = pr(f, start + i * 0.09, start + i * 0.09 + 0.5);
      const isHi = hi.includes(i), isLo = lo.includes(i);
      const hp = isHi ? pr(f, hiT, hiT + 0.5) : 0, lp = isLo ? pr(f, loT, loT + 0.5) : 0;
      const [mx, my] = polar(cx, cy, 1, i * 30 - 75);
      return <path key={i} d={wedge(cx, cy, r, r0, i)} fill={c} stroke={IV} strokeWidth={4} opacity={p * (1 - 0.72 * lp)} transform={`translate(${mx * 14 * hp} ${my * 14 * hp}) scale(${1})`} />;
    })}
  </g>
);
const Lipstick: React.FC<{p: number; q: number; color: string}> = ({p, q, color}) => (
  <>
    <path d="M38 78 V46 Q50 32 62 42 V78 Z" fill={color} opacity={q} />
    <rect x={30} y={100} width={40} height={60} fill={ES} opacity={q} />
    <g stroke={ES} strokeWidth={4} strokeLinejoin="round" fill="none">
      <path {...dr(p)} d="M30 100 H70 V160 H30 Z" /><path {...dr(p)} d="M34 100 V78 H66 V100" /><path {...dr(p)} d="M38 78 V46 Q50 32 62 42 V78" />
    </g>
  </>
);
const Tee: React.FC<{p: number; q: number; color: string}> = ({p, q, color}) => (
  <>
    <path d="M32 14 L8 36 L24 54 L34 46 V108 H86 V46 L96 54 L112 36 L88 14 Q60 30 32 14 Z" fill={color} opacity={q} />
    <path {...dr(p)} d="M32 14 L8 36 L24 54 L34 46 V108 H86 V46 L96 54 L112 36 L88 14 Q60 30 32 14 Z" fill="none" stroke={ES} strokeWidth={4} strokeLinejoin="round" />
  </>
);
const Dye: React.FC<{p: number; q: number; color: string}> = ({p, q, color}) => (
  <>
    <path d="M24 30 H76 Q84 30 84 40 V132 Q84 142 74 142 H26 Q16 142 16 132 V40 Q16 30 24 30 Z" fill={color} opacity={q} />
    <path d="M16 70 H84 V110 H16 Z" fill={IV} opacity={q * 0.85} />
    <g stroke={ES} strokeWidth={4} strokeLinejoin="round" fill="none">
      <path {...dr(p)} d="M42 8 H58 V30 H42 Z" /><path {...dr(p)} d="M24 30 H76 Q84 30 84 40 V132 Q84 142 74 142 H26 Q16 142 16 132 V40 Q16 30 24 30 Z" /><path {...dr(p)} d="M16 70 H84 M16 110 H84" />
    </g>
  </>
);
const Eye: React.FC<{p: number; shade: number; stroke?: string}> = ({p, shade, stroke = ES}) => (
  <g fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round">
    <path {...dr(p)} d="M8 50 Q60 0 112 50 Q60 100 8 50 Z" />
    <circle {...dr(p)} cx={60} cy={50} r={18} /><circle cx={60} cy={50} r={7} fill={stroke} opacity={p} />
    <path d="M22 70 Q60 100 98 70" stroke="#6E5560" strokeWidth={9} opacity={shade} />
  </g>
);
const Moon: React.FC<{p: number; c?: string}> = ({p, c = IV}) => <path {...dr(p)} d="M62 8 A42 42 0 1 0 92 66 A34 34 0 0 1 62 8 Z" fill="none" stroke={c} strokeWidth={4} strokeLinejoin="round" />;
const Check: React.FC<{p: number; c?: string; w?: number}> = ({p, c = OL, w = 10}) => <path {...dr(p)} d="M16 54 L40 78 L86 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
const Cross: React.FC<{p: number; c?: string}> = ({p, c = BU}) => <path {...dr(p)} d="M20 20 L80 80 M80 20 L20 80" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" />;
const Battery: React.FC<{p: number; lv: number; c?: string; fill?: string}> = ({p, lv, c = ES, fill = '#C9786F'}) => (
  <>
    <rect x={10} y={14} width={98 * lv} height={52} fill={fill} />
    <g fill="none" stroke={c} strokeWidth={4}><path {...dr(p)} d="M6 10 H112 V70 H6 Z" /><path {...dr(p)} d="M112 28 H128 V52 H112" /></g>
  </>
);
const SunIc: React.FC<{p: number; rot: number; c?: string}> = ({p, rot, c = ES}) => (
  <g stroke={c} strokeWidth={4} strokeLinecap="round" fill="none">
    <circle {...dr(p)} cx={60} cy={60} r={22} />
    <g transform={`rotate(${rot} 60 60)`} opacity={p}>{Array.from({length: 8}).map((_, i) => { const [x0, y0] = polar(60, 60, 34, i * 45), [x1, y1] = polar(60, 60, 52, i * 45); return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} />; })}</g>
  </g>
);
const Bulb: React.FC<{p: number; c?: string; glow?: number}> = ({p, c = ES, glow = 0}) => (
  <>
    <path d="M50 10 A34 34 0 0 0 32 72 V92 H68 V72 A34 34 0 0 0 50 10 Z" fill="#F2D9A0" opacity={glow} />
    <g stroke={c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none"><path {...dr(p)} d="M50 10 A34 34 0 0 0 32 72 V92 H68 V72 A34 34 0 0 0 50 10 Z" /><path {...dr(p)} d="M36 106 H64 M40 120 H60" /></g>
  </>
);
const CloudIc: React.FC<{p: number; c?: string}> = ({p, c = ES}) => <path {...dr(p)} d="M36 78 A24 24 0 0 1 36 30 A34 34 0 0 1 98 26 A26 26 0 0 1 104 78 Z" fill="none" stroke={c} strokeWidth={4} strokeLinejoin="round" />;
const Calendar: React.FC<{p: number; c?: string}> = ({p, c = ES}) => (
  <g fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
    <path {...dr(p)} d="M12 24 H108 V108 H12 Z" /><path {...dr(p)} d="M12 48 H108 M36 10 V32 M84 10 V32" />
    <path {...dr(Math.max(0, (p - 0.5) * 2))} d="M36 80 L54 96 L86 62" stroke={BU} strokeWidth={8} />
  </g>
);
const Spark: React.FC<{x: number; y: number; s: number; c: string}> = ({x, y, s, c}) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -30 Q0 0 30 0 Q0 0 0 30 Q0 0 -30 0 Q0 0 0 -30 Z" fill={c} />;
const Drop: React.FC<{x: number; y: number; s: number; c: string; op: number}> = ({x, y, s, c, op}) => <path transform={`translate(${x} ${y}) scale(${s})`} opacity={op} d="M0 -30 Q22 0 22 14 A22 22 0 0 1 -22 14 Q-22 0 0 -30 Z" fill={c} />;
const Fan: React.FC<{p: number; cols: string[]}> = ({p, cols}) => (
  <g>{cols.map((c, i) => <rect key={i} x={-26} y={-120} width={52} height={120} rx={4} fill={c} stroke={ES} strokeWidth={3} transform={`rotate(${(i - (cols.length - 1) / 2) * 24 * p})`} />)}</g>
);
const Bag: React.FC<{p: number; c?: string}> = ({p, c = ES}) => (
  <g fill="none" stroke={c} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round"><path {...dr(p)} d="M16 40 H104 L110 132 H10 Z" /><path {...dr(p)} d="M40 40 V28 A20 20 0 0 1 80 28 V40" /></g>
);
const Ruler: React.FC<{p: number; c?: string}> = ({p, c = ES}) => (
  <g stroke={c} strokeWidth={4} strokeLinecap="round" fill="none">
    <path {...dr(p)} d="M6 30 H194" /><path {...dr(p)} d="M6 30 L22 18 M6 30 L22 42 M194 30 L178 18 M194 30 L178 42" />
    {Array.from({length: 9}).map((_, i) => <line key={i} x1={26 + i * 18.5} y1={30} x2={26 + i * 18.5} y2={i % 2 ? 40 : 46} opacity={p} strokeWidth={3} />)}
  </g>
);
const Panel: React.FC<{x: number; y: number; w: number; h: number; f: number; start: number; color?: string; fill?: string}> = ({x, y, w, h, f, start, color = ES, fill = 'none'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w * pr(f, start, start + 0.6, e1), height: h, border: `2px solid ${color}`, boxSizing: 'border-box', background: fill, overflow: 'hidden'}} />
);

// ---------- scenes ----------
const Intro = (f: number) => (
  <>
    <Small x={L} y={292} text="Tonelux · Personal Color" f={f} size={20} />
    <Line x={L} y={332} w={R - L} f={f} start={0.1} th={1.5} />
    <div style={{position: 'absolute', left: L, top: 350}}><Words text="Buổi test màu" f={f} start={0.15} size={64} italic w={R - L} /></div>
    <div style={{position: 'absolute', left: L, top: 420}}><Words text="cho bạn 3 thứ" f={f} start={0.5} size={96} color={BU} w={R - L} /></div>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><Wheel cx={785} cy={455} r={80} r0={34} f={f} start={0.4} rot={f * 1.2} /></svg>
    <VideoPane f={f} y={560} h={780} oy={63} src0={0} block={GOLD} reveal={0.3} />
    {[['01', 'Nguyên nhân', 2.5], ['02', 'Bằng chứng', 3.3], ['03', 'Bảng màu', 4.1]].map(([n, t, s], i) => {
      const p = pr(f, s as number, (s as number) + 0.5);
      return (
        <div key={i} style={{position: 'absolute', left: L + i * 260, top: 1392, width: 240, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
          <div style={{width: 240 * p, height: 3, background: [BU, OL, RO][i]}} />
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: ES, marginTop: 8}}>{n}</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: ES}}>{t}</div>
        </div>
      );
    })}
  </>
);

const Heading: (num: string, word: string, fg: string, accent: string, strip: string[]) => (f: number) => React.ReactNode = (num, word, fg, accent, strip) => (f) => {
  const p = pr(f, 0, 0.9, e1);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <Wheel cx={760} cy={620} r={300} r0={170} f={f} start={0.1} rot={f * 0.8} op={0.35} />
      </svg>
      <div style={{position: 'absolute', left: L - 10, top: 360, height: 520, overflow: 'hidden'}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 520, lineHeight: 1, color: accent, transform: `translateY(${(1 - p) * 100}%)`}}>{num}</div>
      </div>
      <div style={{position: 'absolute', left: L, top: 900}}><Words text={word} f={f} start={0.4} size={120} color={fg} italic w={R - L} /></div>
      <Line x={L} y={1090} w={R - L} f={f} start={0.7} color={fg} th={2} />
      {strip.map((c, i) => <Swatch key={i} x={L + i * ((R - L) / strip.length)} y={1130} w={(R - L) / strip.length - 8} h={90} color={c} f={f} start={0.8 + i * 0.1} />)}
    </>
  );
};

const Shop = (f: number) => {
  const dim = pr(f, 2.0, 2.8, e1);
  const items: {t: string; c: string; s: number; k: 'lip' | 'tee' | 'dye'}[] = [{t: 'Son', c: '#A94A5C', s: 0.2, k: 'lip'}, {t: 'Áo', c: OL, s: 0.5, k: 'tee'}, {t: 'Màu tóc', c: '#5A3A2A', s: 0.8, k: 'dye'}];
  return (
    <>
      <Header idx="01" label="Nguyên nhân" f={f} color={BU} />
      {items.map((it, i) => {
        const x = L + i * 260, p = pr(f, it.s, it.s + 0.9, e1), q = pr(f, it.s + 0.7, it.s + 1.1);
        const col = interpolateColors(dim, [0, 1], [it.c, TA]);
        const bob = Math.sin((f + i * 8) / 9) * 4 * pr(f, 1.2, 1.6);
        const qm = pr(f, 1.2 + i * 0.2, 1.6 + i * 0.2);
        return (
          <React.Fragment key={it.t}>
            <Panel x={x} y={430} w={240} h={400} f={f} start={it.s} fill="#F5E9D1" />
            <Svg x={x + 20} y={470 + bob} w={200} h={300} vb={it.k === 'lip' ? '0 0 100 170' : it.k === 'tee' ? '0 0 120 120' : '0 0 100 150'} op={1}>
              {it.k === 'lip' ? <Lipstick p={p} q={q} color={col} /> : it.k === 'tee' ? <Tee p={p} q={q} color={col} /> : <Dye p={p} q={q} color={col} />}
            </Svg>
            <div style={{position: 'absolute', left: x + 190, top: 438, fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: BU, opacity: qm, transform: `scale(${0.5 + 0.5 * qm}) rotate(${(1 - qm) * 20}deg)`}}>?</div>
            <Small x={x} y={850} text={it.t} f={f} start={it.s + 0.3} size={26} />
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: L, top: 915}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: BU, opacity: pr(f, 1.1, 1.5)}}>không hợp</div>
        <div style={{width: 300 * pr(f, 1.15, 1.9, e1), height: 3, background: BU, marginTop: 8}} />
      </div>
      <div style={{position: 'absolute', left: L - 6, top: 970, fontFamily: SERIF, fontWeight: 700, fontSize: 260, lineHeight: 0.8, color: RO, opacity: pr(f, 2.2, 2.7)}}>“</div>
      <div style={{position: 'absolute', left: L, top: 1100}}><Words text="Chắc da mình có vấn đề?" f={f} start={2.5} size={92} italic color={ES} w={R - L} lh={1.12} /></div>
    </>
  );
};

const Under = (f: number) => {
  const bx = L, bw = R - L, by = 700;
  const m1 = bx + bw * 0.24, m2 = bx + bw * 0.8;
  const gap = pr(f, 1.2, 2.0, e1);
  return (
    <>
      <Header idx="01" label="Nguyên nhân" f={f} color={BU} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={bx} y={by} width={bw * pr(f, 0.1, 0.9, e1)} height={56} fill="url(#ug)" />
        <defs><linearGradient id="ug" x1="0" x2="1" y1="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${bx} 0) scale(${bw} 1)`}><stop offset="0" stopColor="#D9A35F" /><stop offset="0.28" stopColor="#E8C9A0" /><stop offset="0.5" stopColor="#E9DCCB" /><stop offset="0.74" stopColor="#B9C4D3" /><stop offset="1" stopColor="#8BA3C4" /></linearGradient></defs>
        {/* pins */}
        <g opacity={pr(f, 0.6, 1.0)} transform={`translate(0 ${(1 - pr(f, 0.6, 1.1)) * -30})`}>
          <line x1={m1} y1={by - 70} x2={m1} y2={by} stroke={ES} strokeWidth={4} />
          <circle cx={m1} cy={by - 100} r={34} fill="#E3B895" stroke={ES} strokeWidth={4} />
        </g>
        <g opacity={pr(f, 0.9, 1.3)} transform={`translate(0 ${(1 - pr(f, 0.9, 1.4)) * 30})`}>
          <line x1={m2} y1={by + 56} x2={m2} y2={by + 126} stroke={BU} strokeWidth={4} />
          <circle cx={m2} cy={by + 160} r={34} fill="#6F8478" stroke={BU} strokeWidth={4} />
        </g>
        {/* offset bracket */}
        <g stroke={BU} strokeWidth={4} strokeLinecap="round" fill="none">
          <path {...dr(gap)} d={`M${m1} ${by + 270} H${m2}`} />
          <path {...dr(gap)} d={`M${m1} ${by + 270} l16 -12 M${m1} ${by + 270} l16 12 M${m2} ${by + 270} l-16 -12 M${m2} ${by + 270} l-16 12`} />
        </g>
        <g transform="translate(100 560)"><SunIc p={pr(f, 0.3, 0.9)} rot={f * 2} c={'#C68A3E'} /></g>
        {/* snowflake */}
        <g transform="translate(790 560)" stroke="#6F89A8" strokeWidth={4} strokeLinecap="round" opacity={pr(f, 0.4, 0.9)} fill="none">
          {[0, 60, 120].map((a) => { const [x0, y0] = polar(60, 60, 44, a), [x1, y1] = polar(60, 60, 44, a + 180); return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} />; })}
          <circle cx={60} cy={60} r={6} fill="#6F89A8" />
        </g>
      </svg>
      <Small x={bx} y={by + 70} text="Ấm" f={f} start={0.5} size={22} color="#C68A3E" w={90} />
      <Small x={R} y={by + 70} text="Lạnh" f={f} start={0.5} size={22} color="#6F89A8" align="right" w={140} />
      <Small x={m1} y={by - 160} text="Da bạn" f={f} start={0.9} size={22} align="center" w={200} />
      <Small x={m2} y={by + 205} text="Màu đã mua" f={f} start={1.2} size={22} color={BU} align="center" w={260} />
      <Small x={(m1 + m2) / 2} y={by + 292} text="Lệch" f={f} start={1.8} size={26} color={BU} align="center" w={200} />
      <div style={{position: 'absolute', left: L, top: 1060}}><Words text="Lệch undertone" f={f} start={1.6} size={118} color={BU} w={R - L} /></div>
      <Small x={L} y={1230} text="Hình minh hoạ khái niệm" f={f} start={2.0} size={18} color={TA} />
    </>
  );
};

const Effects = (f: number) => {
  const cards = [{t: 'Da xỉn', s: 1.1}, {t: 'Quầng mắt rõ hơn', s: 3.0}, {t: 'Nhìn mệt dù ngủ đủ', s: 4.5}];
  return (
    <>
      <Header idx="01" label="Nguyên nhân" f={f} color={BU} />
      {cards.map((c, i) => {
        const y = 420 + i * 300, s = c.s;
        const p = pr(f, s - 0.7, s), flow = pr(f, s, s + 1.2, e1), op = pr(f, s - 0.1, s + 0.3);
        const px = R - 230;
        return (
          <div key={i}>
            <Panel x={L} y={y} w={R - L} h={260} f={f} start={s - 0.7} color={ES} fill="#F6EAD2" />
            <div style={{position: 'absolute', left: L + 30, top: y + 26, fontFamily: SERIF, fontWeight: 600, fontSize: 40, fontStyle: 'italic', color: BU, opacity: p}}>0{i + 1}</div>
            <div style={{position: 'absolute', left: L + 30, top: y + 100, width: 420, fontFamily: SERIF, fontWeight: 700, fontSize: 50, lineHeight: 1.08, color: ES, opacity: p}}>{c.t}</div>
            <div style={{position: 'absolute', left: px, top: y + 2, width: 226, height: 256, background: '#E8D3AA', opacity: op}} />
            {i === 0 && (
              <Svg x={px} y={y + 2} w={226} h={256} vb="0 0 226 256" op={op}>
                <circle cx={113} cy={128} r={64} fill={interpolateColors(flow, [0, 1], ['#E6B995', '#9C8E80'])} />
                {[0, 1, 2].map((k) => { const t = ((f / 30) * 0.9 + k / 3) % 1; return <Drop key={k} x={60 + k * 52} y={60 + t * 150} s={0.55} c="#E6B995" op={flow * (1 - t)} />; })}
                <circle cx={113} cy={128} r={64 + 8 * Math.sin(f / 8)} fill="none" stroke={BU} strokeWidth={2} opacity={0.5 * (1 - flow)} />
              </Svg>
            )}
            {i === 1 && (
              <Svg x={px + 28} y={y + 76} w={170} h={110} vb="0 0 120 100" op={op}><Eye p={pr(f, s, s + 0.9)} shade={flow} stroke={ES} /></Svg>
            )}
            {i === 2 && (
              <>
                <Svg x={px + 14} y={y + 34} w={90} h={90} vb="0 0 100 100" op={op}><Moon p={pr(f, s, s + 0.7)} c={ES} /><g transform="translate(18 18) scale(0.55)"><Check p={pr(f, s + 0.7, s + 1.2)} c={OL} w={11} /></g></Svg>
                <Svg x={px + 40} y={y + 158} w={160} h={90} vb="0 0 140 80" op={op}><Battery p={pr(f, s + 0.2, s + 0.9)} lv={1 - 0.82 * flow} fill={RO} /></Svg>
              </>
            )}
          </div>
        );
      })}
      <Small x={L} y={1330} text="Hình minh hoạ" f={f} start={4.8} size={18} color={TA} />
    </>
  );
};

const Evidence = (f: number) => {
  const vp = pr(f, 0.1, 0.8, e1);
  const scan = ((f / 30) * 0.5) % 1;
  const cards = [{t: 'Từng tấm vải cạnh mặt', s: 2.2, k: 0}, {t: 'Cùng ánh sáng', s: 3.6, k: 1}, {t: 'Cùng khoảng cách', s: 5.5, k: 2}];
  const cw = 240, gap = 20;
  return (
    <>
      <Header idx="02" label="Bằng chứng" f={f} color={OL} />
      <VideoPane f={f} y={400} h={820} oy={0} src0={5} block={GOLD} reveal={0.1} />
      {/* viewfinder corners + scan line */}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {[[L + 24, 424, 1, 1], [R - 24, 424, -1, 1], [L + 24, 1196, 1, -1], [R - 24, 1196, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} {...dr(pr(f, 0.6 + i * 0.1, 1.2 + i * 0.1))} d={`M${x} ${(y as number) + 50 * (sy as number)} V${y} H${(x as number) + 50 * (sx as number)}`} stroke={IV} strokeWidth={4} fill="none" />
        ))}
        <line x1={L + 24} x2={R - 24} y1={440 + scan * 740} y2={440 + scan * 740} stroke={IV} strokeWidth={2} opacity={0.55 * vp} />
      </svg>
      {cards.map((c, i) => {
        const x = L + i * (cw + gap), y = 1250, p = pr(f, c.s, c.s + 0.6);
        return (
          <div key={i}>
            <Panel x={x} y={y} w={cw} h={215} f={f} start={c.s} color={ES} fill="#F5E9D1" />
            <Svg x={x + 70} y={y + 14} w={100} h={100} vb="0 0 120 120" op={p}>
              {c.k === 0 && <g transform="translate(60 112)"><Fan p={pr(f, c.s, c.s + 0.9, e1)} cols={[BU, OL, RO, '#C9A86A']} /></g>}
              {c.k === 1 && <SunIc p={pr(f, c.s, c.s + 0.7)} rot={f * 2} />}
              {c.k === 2 && <g transform="translate(0 30) scale(0.6)"><Ruler p={pr(f, c.s, c.s + 0.8)} /></g>}
            </Svg>
            <div style={{position: 'absolute', left: x + 10, top: y + 130, width: cw - 20, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 19, letterSpacing: 2, textTransform: 'uppercase', color: ES, lineHeight: 1.25, opacity: p}}>{c.t}</div>
          </div>
        );
      })}
    </>
  );
};

const Portrait: React.FC<{x: number; f: number; start: number; drape: string; hazeT: number; id: string; sparkle: boolean}> = ({x, f, start, drape, hazeT, id, sparkle}) => {
  const p = pr(f, start, start + 0.8, e1), reveal = pr(f, start + 0.6, start + 1.6, e1);
  const skin = interpolateColors(hazeT, [0, 1], ['#E8BE9E', '#B8A58F']);
  return (
    <Svg x={x} y={420} w={365} h={760} vb="0 0 365 760" op={p}>
      <defs><clipPath id={id}><circle cx={182} cy={400} r={reveal * 420} /></clipPath></defs>
      <rect width={365} height={760} fill="#F5E7CD" />
      <path d="M-20 800 V470 Q182 360 385 470 V800 Z" fill={TA} />
      <path d="M-20 800 V470 Q182 360 385 470 V800 Z" fill={drape} clipPath={`url(#${id})`} />
      <rect x={142} y={330} width={80} height={90} fill={interpolateColors(hazeT, [0, 1], ['#DDAF8F', '#A69582'])} />
      <path d="M62 250 Q55 60 182 55 Q310 60 302 250 L308 360 H56 Z" fill="#3A2C26" />
      <ellipse cx={182} cy={220} rx={100} ry={135} fill={skin} />
      <path d="M88 175 Q182 70 276 175 Q230 118 182 116 Q130 118 88 175 Z" fill="#3A2C26" />
      <ellipse cx={150} cy={170} rx={60} ry={70} fill={'#fff'} opacity={0.3 * (1 - hazeT)} />
      {sparkle && [[70, 120, 0.5], [300, 180, 0.4], [280, 70, 0.3]].map(([sx, sy, s], i) => <Spark key={i} x={sx as number} y={sy as number} s={(s as number) * (0.7 + 0.3 * Math.sin(f / 6 + i * 2)) * reveal} c={'#E0B36B'} />)}
      {!sparkle && <rect x={0} y={0} width={365} height={760} fill={'#8C8A78'} opacity={0.18 * hazeT} />}
    </Svg>
  );
};
const Compare = (f: number) => {
  const t2 = pr(f, 2.2, 3.0, e1);
  return (
    <>
      <Header idx="02" label="Bằng chứng" f={f} color={OL} />
      <Portrait x={L} f={f} start={0.2} drape="#C9786F" hazeT={0} id="cl" sparkle />
      <Portrait x={L + 395} f={f} start={0.4} drape="#6F8478" hazeT={t2} id="cr" sparkle={false} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={L + 380} x2={L + 380} y1={420} y2={1180 * pr(f, 0.2, 1.2, e1)} stroke={ES} strokeWidth={2} />
      </svg>
      <div style={{position: 'absolute', left: L, top: 1215, opacity: pr(f, 0.9, 1.4)}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: ES}}>Hợp</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: OL}}>da đều, sáng lên</div>
      </div>
      <div style={{position: 'absolute', left: L + 395, top: 1215, opacity: pr(f, 2.2, 2.7)}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: BU}}>Lệch tông</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: BU}}>xỉn ngay</div>
      </div>
      <Small x={L} y={1390} text="Hình minh hoạ · không phải kết quả của một người cụ thể" f={f} start={2.8} size={16} color={TA} w={760} />
    </>
  );
};

const EyeS = (f: number) => {
  const pulse = (f / 30) % 1.2;
  return (
    <>
      <Header idx="02" label="Bằng chứng" f={f} color={OL} />
      <VideoPane f={f} y={400} h={760} oy={0} src0={13} block={GOLDL} reveal={0.05} />
      <div style={{position: 'absolute', left: R - 170, top: 420, width: 150, height: 150, borderRadius: 75, background: IV, opacity: pr(f, 0.3, 0.7)}} />
      <Svg x={R - 150} y={460} w={110} h={92} vb="0 0 120 100" op={pr(f, 0.3, 0.7)}><Eye p={pr(f, 0.3, 1.2)} shade={0} /></Svg>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={R - 95} cy={495} r={75 + pulse * 40} fill="none" stroke={IV} strokeWidth={3} opacity={Math.max(0, 0.7 - pulse * 0.6)} />
      </svg>
      <div style={{position: 'absolute', left: L, top: 1195}}><Words text="Tự nhìn bằng mắt mình" f={f} start={0.2} size={60} color={ES} w={R - L} /></div>
      <div style={{position: 'absolute', left: L, top: 1300}}><Words text="không cần tin lời ai" f={f} start={1.3} size={54} italic color={BU} w={R - L} /></div>
    </>
  );
};

const GOOD = ['#C9786F', RO, '#B88A5A', OL, BU, '#E0C3A0'];
const BAD = ['#5F7F9C', '#9AA6B8', '#B9B0C9', '#4A6B5D', '#C7D0D8', '#8A7AA6'];
const Palette = (f: number) => {
  const sw = (R - L) / 6;
  return (
    <>
      <Header idx="03" label="Bảng màu" f={f} color={RO} />
      <div style={{position: 'absolute', left: L, top: 395}}><Words text="Bảng màu cố định" f={f} start={0.1} size={70} color={ES} w={R - L} /></div>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Wheel cx={CX} cy={740} r={190} r0={80} f={f} start={0.3} rot={0} hi={[9, 10, 11, 0, 1, 2]} lo={[5, 6, 7, 8]} hiT={1.9} loT={3.0} />
        <circle cx={CX} cy={740} r={62} fill="#E3B895" stroke={ES} strokeWidth={4} opacity={pr(f, 1.2, 1.7)} />
      </svg>
      <Small x={L} y={975} text="Nên dùng" f={f} start={1.9} size={24} color={BU} />
      {GOOD.map((c, i) => <Swatch key={i} x={L + i * sw} y={1015} w={sw - 10} h={120} color={c} f={f} start={1.9 + i * 0.08} from="bottom" />)}
      <Small x={L} y={1165} text="Nên né" f={f} start={3.0} size={24} color={OL} />
      {BAD.map((c, i) => <Swatch key={i} x={L + i * sw} y={1205} w={sw - 10} h={120} color={c} f={f} start={3.0 + i * 0.06} from="bottom" />)}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={L} y1={1335} x2={L + (R - L) * pr(f, 3.4, 4.0, e1)} y2={1195} stroke={ES} strokeWidth={3} />
      </svg>
      <Small x={L} y={1365} text="Ví dụ minh hoạ, bảng thật lập riêng cho từng người" f={f} start={3.2} size={16} color={TA} w={760} />
    </>
  );
};

const Apply = (f: number) => {
  const rows = [{t: 'Son', c: '#C9786F', s: 0.2, k: 0}, {t: 'Áo', c: OL, s: 0.8, k: 1}, {t: 'Nhuộm tóc', c: '#B88A5A', s: 1.4, k: 2}];
  const strike = pr(f, 2.3, 2.9, e1), shrink = pr(f, 2.9, 3.6, e1);
  return (
    <>
      <Header idx="03" label="Bảng màu" f={f} color={RO} />
      {rows.map((r) => {
        const y = 420 + r.k * 200, s = r.s, p = pr(f, s, s + 0.7, e1);
        return (
          <div key={r.t}>
            <Panel x={L} y={y} w={R - L} h={170} f={f} start={s} />
            <Svg x={L + 24} y={y + 10} w={r.k === 0 ? 56 : r.k === 1 ? 110 : 76} h={150} vb={r.k === 0 ? '0 0 100 170' : r.k === 1 ? '0 0 120 120' : '0 0 100 150'} op={p}>
              {r.k === 0 ? <Lipstick p={pr(f, s + 0.1, s + 0.8)} q={pr(f, s + 0.6, s + 1)} color={r.c} /> : r.k === 1 ? <Tee p={pr(f, s + 0.1, s + 0.8)} q={pr(f, s + 0.6, s + 1)} color={r.c} /> : <Dye p={pr(f, s + 0.1, s + 0.8)} q={pr(f, s + 0.6, s + 1)} color={r.c} />}
            </Svg>
            <Swatch x={L + 190} y={y + 20} w={130} h={130} color={r.c} f={f} start={s + 0.3} />
            <div style={{position: 'absolute', left: L + 350, top: y + 52, fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: ES, opacity: pr(f, s + 0.4, s + 0.9)}}>{r.t}</div>
            <Svg x={R - 130} y={y + 38} w={90} h={90} vb="0 0 100 100"><Check p={pr(f, s + 0.7, s + 1.2, e1)} /></Svg>
          </div>
        );
      })}
      <Svg x={L + 10} y={1070} w={200} h={230} vb="0 0 120 140" sc={1 - 0.45 * shrink} op={pr(f, 2.0, 2.4)}>
        <Bag p={pr(f, 2.0, 2.8)} />
        <g opacity={1 - shrink}><rect x={30} y={70} width={20} height={30} fill="#C9786F" /><rect x={56} y={80} width={20} height={20} fill={OL} /><rect x={82} y={60} width={16} height={40} fill="#B88A5A" /></g>
        <g transform="translate(20 40) scale(0.8)" opacity={strike}><Cross p={strike} /></g>
      </Svg>
      <div style={{position: 'absolute', left: L + 250, top: 1090}}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 62, color: TA, opacity: pr(f, 2.1, 2.5)}}>mua rồi bỏ xó</div>
          <div style={{position: 'absolute', left: 0, top: 42, width: `${strike * 100}%`, height: 5, background: BU}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: L + 250, top: 1190}}><Words text="giảm hẳn" f={f} start={2.9} size={104} color={BU} w={R - L - 250} /></div>
      <Svg x={R - 90} y={1210} w={70} h={100} vb="0 0 120 120" op={pr(f, 3.3, 3.7)}><path {...dr(pr(f, 3.3, 4.0))} d="M60 12 V100 M30 70 L60 100 L90 70" fill="none" stroke={BU} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /></Svg>
    </>
  );
};

const Mirror = (f: number) => {
  const cx = CX, cy = 840, R0 = 250;
  const tint = pr(f, 0.6, 4.2, Easing.linear);
  const skin = interpolateColors(tint, [0, 0.35, 0.7, 1], ['#EFC49C', '#E8BE9E', '#D4B3A4', '#C6B2B6']);
  const icons = [{a: -140, s: 2.0, k: 0}, {a: -40, s: 2.7, k: 1}, {a: 60, s: 3.4, k: 2}];
  const eyeP = pr(f, 3.1, 3.8);
  return (
    <>
      <Header idx="03" label="Bảng màu" f={f} color={BU} />
      <div style={{position: 'absolute', left: L, top: 395}}><Words text="Tự soi gương rất khó chuẩn" f={f} start={0.1} size={54} color={ES} w={R - L} italic /></div>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Wheel cx={cx} cy={cy} r={R0} r0={185} f={f} start={0.3} rot={f * 1.8} />
        <circle cx={cx} cy={cy} r={170} fill={IV} />
        <circle cx={cx} cy={cy} r={142 * pr(f, 0.6, 1.2)} fill={skin} />
        {icons.map((ic, i) => {
          const [ix, iy] = polar(cx, cy, R0 + 78, ic.a);
          const on = pr(f, ic.s, ic.s + 0.5), p = pr(f, ic.s - 0.3, ic.s + 0.4);
          return (
            <g key={i} transform={`translate(${ix - 40} ${iy - 45}) scale(${0.65 + 0.15 * on})`}>
              <circle cx={60} cy={60} r={64} fill={GOLD} opacity={0.15 + 0.35 * on} />
              {ic.k === 0 && <SunIc p={p} rot={f * 2} c={ES} />}
              {ic.k === 1 && <g transform="translate(10 -6)"><Bulb p={p} c={ES} glow={on} /></g>}
              {ic.k === 2 && <g transform="translate(-10 14)"><CloudIc p={p} c={ES} /></g>}
            </g>
          );
        })}
        <g transform={`translate(${cx - 48} ${cy - 40}) scale(0.8)`} opacity={eyeP}><Eye p={eyeP} shade={0} stroke={ES} /></g>
      </svg>
      <Small x={cx} y={1160} text="Ánh sáng đổi liên tục" f={f} start={2.1} size={26} color={ES} align="center" w={700} />
      <Line x={cx - 160} y={1205} w={320} f={f} start={2.2} color={BU} />
      <div style={{position: 'absolute', left: L, top: 1250}}><Words text="Mắt mình quen với mặt mình" f={f} start={3.1} size={60} color={ES} w={R - L} /></div>
    </>
  );
};

const TestV = (f: number) => {
  const fan = pr(f, 0.6, 1.6, e1);
  return (
    <>
      <Header idx="03" label="Bảng màu" f={f} color={RO} />
      <VideoPane f={f} y={400} h={720} oy={0} src0={17.2} block={GOLD} reveal={0.05} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform={`translate(${R - 80} ${1090})`}><Fan p={fan} cols={['#C9A86A', '#B9B6B2', '#C9786F', '#6F8478']} /></g>
      </svg>
      <div style={{position: 'absolute', left: L, top: 1180}}><Words text="Test là cách nhanh nhất" f={f} start={0.1} size={64} color={ES} w={R - L} /></div>
      <div style={{position: 'absolute', left: L, top: 1285}}><Words text="để có đáp án chắc chắn" f={f} start={2.3} size={64} italic color={BU} w={R - L} /></div>
      <Svg x={R - 100} y={1300} w={90} h={90} vb="0 0 100 100"><Check p={pr(f, 3.2, 3.9, e1)} c={OL} /></Svg>
    </>
  );
};

const Cta = (f: number) => {
  const cols = [IV, GOLDL, BU, GOLD, RO, BEIGE];
  return (
    <>
      {cols.map((c, i) => <Swatch key={i} x={L + i * ((R - L) / 6)} y={300} w={(R - L) / 6 - 6} h={110} color={c} f={f} start={0.1 + i * 0.08} from="bottom" />)}
      <div style={{position: 'absolute', left: L, top: 500}}><Words text="Bảng màu của bạn" f={f} start={0.4} size={88} color={ES} w={R - L} /></div>
      <div style={{position: 'absolute', left: L, top: 620}}><Words text="là gì?" f={f} start={1.0} size={110} italic color={BU} w={R - L} /></div>
      <Line x={L} y={800} w={R - L} f={f} start={1.2} color={ES} th={2} />
      <Svg x={L} y={860} w={200} h={200} vb="0 0 120 120"><Calendar p={pr(f, 1.2, 2.2, e1)} /></Svg>
      <div style={{position: 'absolute', left: L + 240, top: 880, width: 480 * pr(f, 1.4, 2.0, e1), height: 110, background: BU, overflow: 'hidden'}}>
        <div style={{width: 480, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 4, color: IV, textTransform: 'uppercase'}}>Đặt lịch tư vấn</div>
      </div>
      <Svg x={L + 250} y={1010} w={70} h={70} vb="0 0 120 120" op={pr(f, 2.1, 2.5)}><path {...dr(pr(f, 2.1, 2.9))} d="M60 104 V20 M28 52 L60 20 L92 52" fill="none" stroke={BU} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${Math.sin(f / 6) * -4})`} /></Svg>
      <Small x={L + 340} y={1032} text="Link trong bio" f={f} start={2.1} size={26} color={ES} />
      <Small x={L} y={1300} text="Tonelux · Personal Color" f={f} start={2.4} size={20} color={ES} />
    </>
  );
};

export const ToneEditorial3: React.FC = () => (
  <AbsoluteFill style={{background: IV}}>
    <Audio src={staticFile('tl/voice.mp3')} />
    <Scene s={0} e={4.7} bg={IV} wipe={GOLD}>{Intro}</Scene>
    <Scene s={4.7} e={7.1} bg={GOLDL} wipe={BEIGE}>{Heading('01', 'Nguyên nhân', ES, IV, ['#A94A5C', OL, '#5A3A2A', GOLD, RO, IV])}</Scene>
    <Scene s={7.1} e={10.9} bg={IV} wipe={GOLD}>{Shop}</Scene>
    <Scene s={10.9} e={13.5} bg={IV} wipe={BEIGE}>{Under}</Scene>
    <Scene s={13.5} e={19.0} bg={BEIGE} wipe={GOLD}>{Effects}</Scene>
    <Scene s={19.0} e={26.4} bg={IV} wipe={GOLDL}>{Evidence}</Scene>
    <Scene s={26.4} e={30.3} bg={IV} wipe={GOLD}>{Compare}</Scene>
    <Scene s={30.3} e={32.8} bg={IV} wipe={GOLDL}>{EyeS}</Scene>
    <Scene s={32.8} e={34.8} bg={GOLD} wipe={BEIGE}>{Heading('03', 'Bảng màu', ES, IV, GOOD)}</Scene>
    <Scene s={34.8} e={38.8} bg={IV} wipe={GOLDL}>{Palette}</Scene>
    <Scene s={38.8} e={43.4} bg={IV} wipe={GOLD}>{Apply}</Scene>
    <Scene s={43.4} e={48.5} bg={BEIGE} wipe={GOLDL}>{Mirror}</Scene>
    <Scene s={48.5} e={52.5} bg={IV} wipe={GOLD}>{TestV}</Scene>
    <Scene s={52.5} e={56} bg={GOLD} wipe={BEIGE}>{Cta}</Scene>
    <Caption />
  </AbsoluteFill>
);
