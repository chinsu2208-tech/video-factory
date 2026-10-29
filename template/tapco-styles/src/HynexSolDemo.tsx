import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/vietnamese-500.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import '@fontsource/plus-jakarta-sans/vietnamese-800.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/vietnamese-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/vietnamese-500.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';

// ====== LAYOUT 8: HYNEX.SOLUTIONS BRAND (Navy · Lime · Data Blue) — ảnh demo tĩnh ======
export const hs = {
  navy: '#0C141D', lime: '#C8FF3D', blue: '#2986FF', paper: '#F6F9F7', tint: '#D6E9FF', soft: '#141E2B',
  sub: 'Edu', // wordmark: Hynex.<sub>
};
const HEAD = '"Plus Jakarta Sans","Be Vietnam Pro",sans-serif';
const BODY = 'Inter,"Be Vietnam Pro",sans-serif';
const MONO = '"IBM Plex Mono",monospace';


/* ===== BỘ MINH HOẠ FLAT (gốc toạ độ = tâm) ===== */
export const B2 = '#1b63d6'; // blue đậm hơn cho mặt khuất
export const Coin: React.FC<{x: number; y: number; r?: number; dark?: boolean}> = ({x, y, r = 50, dark}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={dark ? hs.soft : hs.tint} stroke={hs.blue} strokeWidth={r / 7} />
    <circle r={r * 0.68} fill="none" stroke={hs.blue} strokeWidth={r / 14} opacity={0.6} />
    <text y={r * 0.34} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={r * 0.95} fill={hs.blue}>₫</text>
  </g>
);
export const CoinStack: React.FC<{x: number; y: number; n?: number; s?: number; dark?: boolean}> = ({x, y, n = 4, s = 1, dark}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({length: n}).map((_, i) => (
      <g key={i} transform={`translate(0 ${-i * 26})`}>
        <ellipse rx={70} ry={26} cy={14} fill={B2} />
        <rect x={-70} y={-12} width={140} height={26} fill={B2} />
        <ellipse rx={70} ry={26} cy={-12} fill={dark ? hs.tint : hs.tint} stroke={hs.blue} strokeWidth={5} />
      </g>
    ))}
  </g>
);
export const Bag: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-34 -60 C-34 -110 34 -110 34 -60" fill="none" stroke={hs.navy} strokeWidth={10} strokeLinecap="round" />
    <path d="M-80 -60 H80 L68 90 Q66 104 52 104 H-52 Q-66 104 -68 90Z" fill={hs.blue} />
    <path d="M-80 -60 H80 L76 -30 H-76Z" fill={B2} />
    <circle cx={0} cy={20} r={26} fill="#fff" /><path d="M-12 20 L-3 30 L14 10" fill="none" stroke={hs.blue} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
export const Box: React.FC<{x: number; y: number; s?: number; dark?: boolean}> = ({x, y, s = 1, dark}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -70 L80 -30 L0 10 L-80 -30Z" fill={hs.tint} />
    <path d="M-80 -30 L0 10 L0 100 L-80 60Z" fill={hs.blue} />
    <path d="M80 -30 L0 10 L0 100 L80 60Z" fill={B2} />
    <path d="M-40 -50 L40 -10 L40 10 L-40 -30Z" fill="#fff" opacity={dark ? 0.9 : 1} />
    <path d="M0 10 L0 100" stroke="#fff" strokeWidth={8} opacity={0.0} />
  </g>
);
export const Phone: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-95} y={-175} width={190} height={350} rx={34} fill={hs.navy} />
    <rect x={-81} y={-160} width={162} height={320} rx={24} fill="#fff" />
    <rect x={-22} y={-170} width={44} height={9} rx={4.5} fill={hs.navy} />
    <rect x={-60} y={-126} width={80} height={14} rx={7} fill={hs.tint} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-60 + i * 36} y={70 - [30, 62, 100, 140][i]} width={26} height={[30, 62, 100, 140][i]} rx={6} fill={i === 3 ? hs.blue : hs.tint} />)}
    <path d="M-62 40 L-24 6 L0 24 L50 -40" fill="none" stroke={hs.blue} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={50} cy={-40} r={10} fill={hs.lime} stroke={hs.navy} strokeWidth={4} />
    <rect x={-60} y={96} width={120} height={36} rx={18} fill={hs.navy} />
  </g>
);
export const Laptop: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-140} y={-110} width={280} height={180} rx={16} fill="#fff" stroke={hs.tint} strokeWidth={10} />
    <rect x={-124} y={-94} width={248} height={148} rx={8} fill={hs.soft} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-100 + i * 46} y={30 - [20, 40, 62, 84, 108][i]} width={30} height={[20, 40, 62, 84, 108][i]} rx={5} fill={i === 4 ? hs.lime : hs.blue} />)}
    <path d="M-170 70 H170 L150 96 H-150Z" fill={hs.tint} />
    <rect x={-30} y={70} width={60} height={9} rx={4} fill={hs.blue} />
  </g>
);
export const GradCap: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 18 V70 Q0 110 70 70 V18 L0 52Z" fill={B2} />
    <path d="M0 -50 L130 12 L0 74 L-130 12Z" fill={hs.blue} />
    <path d="M0 -50 L130 12 L0 74" fill="none" />
    <path d="M110 22 V90" stroke="#fff" strokeWidth={8} strokeLinecap="round" /><circle cx={110} cy={98} r={11} fill={hs.lime} />
  </g>
);
export const Magnifier: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M40 40 L84 84" stroke={hs.navy} strokeWidth={16} strokeLinecap="round" />
    <circle r={52} fill={hs.tint} stroke={hs.blue} strokeWidth={12} />
    <path d="M-26 14 L-8 -6 L8 6 L28 -22" fill="none" stroke={hs.blue} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
export const Gear: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 56}) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={-r * 0.2} y={-r * 1.25} width={r * 0.4} height={r * 0.5} rx={r * 0.08} fill={hs.blue} transform={`rotate(${i * 45})`} />)}
    <circle r={r} fill={hs.blue} /><circle r={r * 0.42} fill={hs.tint} />
  </g>
);
export const Arrow: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-90 50 L-30 -10 L0 20 L80 -60" stroke={hs.blue} strokeWidth={16} />
    <path d="M30 -64 L84 -64 L84 -10" stroke={hs.blue} strokeWidth={16} />
  </g>
);
export const Dot: React.FC<{x: number; y: number; r?: number; c?: string; o?: number}> = ({x, y, r = 10, c = hs.tint, o = 1}) => <circle cx={x} cy={y} r={r} fill={c} opacity={o} />;
export const Plus: React.FC<{x: number; y: number; c?: string}> = ({x, y, c = hs.blue}) => <path d={`M${x - 12} ${y} H${x + 12} M${x} ${y - 12} V${y + 12}`} stroke={c} strokeWidth={6} strokeLinecap="round" />;

export const Mark: React.FC<{x: number; y: number; s?: number; dark?: boolean}> = ({x, y, s = 1, dark}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect width={96} height={96} rx={25} fill={dark ? '#fff' : hs.navy} />
    <text x={48} y={70} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={64} fill={dark ? hs.navy : '#fff'}>H</text>
    <circle cx={86} cy={86} r={12} fill={hs.lime} stroke={dark ? hs.navy : hs.paper} strokeWidth={5} />
    <text x={124} y={66} fontFamily={HEAD} fontWeight={800} fontSize={52} fill={dark ? '#fff' : hs.navy}>Hynex<tspan fontWeight={500}>.{hs.sub}</tspan></text>
  </g>
);
export const Pill: React.FC<{x: number; y: number; w: number; h?: number; fill: string; color: string; text: string; size?: number; stroke?: string}> = ({x, y, w, h = 104, fill, color, text, size = 42, stroke}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
    <text x={w / 2} y={h / 2 + size * 0.35} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={size} fill={color}>{text}</text>
  </g>
);
const Badge: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={170} height={170} rx={34} fill={hs.tint} />
    <g transform="translate(85 85)">{children}</g>
  </g>
);
const Defs = () => (
  <defs>
    <filter id="card" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#0c141d" floodOpacity="0.10" />
    </filter>
  </defs>
);

/* 1. BÌA (nền Paper) */
const Cover = () => (
  <g>
    <rect width={1080} height={1920} fill={hs.paper} />
    <Mark x={80} y={90} />
    <g transform="translate(80 290)">
      <rect width={470} height={64} rx={32} fill={hs.tint} />
      <text x={235} y={43} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={28} fill={hs.blue}>TẬP 1 · CÁCH KIẾM TIỀN</text>
    </g>
    <text fontFamily={HEAD} fontWeight={800} fontSize={124} fill={hs.navy}>
      <tspan x={80} y={520}>Kiếm <tspan fill={hs.blue}>100 triệu</tspan></tspan>
      <tspan x={80} y={650}>đầu tiên bằng</tspan>
      <tspan x={80} y={780}>cách nào?</tspan>
    </text>
    {/* vùng minh hoạ */}
    <g>
      <ellipse cx={540} cy={1160} rx={460} ry={60} fill={hs.tint} opacity={0.7} />
      <circle cx={540} cy={1010} r={210} fill={hs.tint} opacity={0.55} />
      <Bag x={210} y={1090} s={1.15} />
      <Box x={880} y={1100} s={1.05} />
      <Phone x={540} y={1000} s={1.0} />
      <CoinStack x={745} y={1160} n={4} s={0.8} />
      <Coin x={350} y={850} r={46} /><Coin x={790} y={830} r={36} />
      <Arrow x={760} y={920} s={0.62} />
      <Dot x={120} y={900} r={12} /><Dot x={960} y={940} r={9} c={hs.blue} o={0.35} /><Plus x={940} y={720} c={hs.navy} />
    </g>
    <g filter="url(#card)" transform="translate(80 1300)">
      <rect width={920} height={400} rx={28} fill="#fff" />
      <text x={50} y={70} fontFamily={BODY} fontWeight={500} fontSize={32} fill={hs.navy} opacity={0.6}>Mục tiêu doanh thu</text>
      <g transform="translate(795 48)"><circle r={11} fill={hs.lime} stroke={hs.navy} strokeWidth={3} /><text x={22} y={10} fontFamily={MONO} fontSize={26} fill={hs.navy}>chạy</text></g>
      <text x={50} y={165} fontFamily={MONO} fontWeight={600} fontSize={92} fill={hs.navy}>100.000.000đ</text>
      <rect x={50} y={205} width={820} height={24} rx={12} fill={hs.tint} />
      <rect x={50} y={205} width={510} height={24} rx={12} fill={hs.blue} />
      {[['4', 'bước'], ['6', 'tháng'], ['10', 'đơn đầu']].map(([n, l], i) => (
        <g key={i} transform={`translate(${50 + i * 285} 265)`}>
          <rect width={250} height={105} rx={20} fill={hs.paper} />
          <text x={125} y={52} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={46} fill={hs.blue}>{n}</text>
          <text x={125} y={90} textAnchor="middle" fontFamily={BODY} fontSize={28} fill={hs.navy} opacity={0.7}>{l}</text>
        </g>
      ))}
    </g>
    <text x={80} y={1800} fontFamily={MONO} fontSize={28} fill={hs.navy} opacity={0.5}>Số liệu minh hoạ · không cam kết thu nhập</text>
  </g>
);

/* 2. QUY TRÌNH (nền Paper) */
const Steps = () => {
  const items: [string, string, string, React.ReactNode][] = [
    ['01', 'Chọn sản phẩm', 'Xem thứ đang bán chạy, không đoán.', <><Bag x={-6} y={8} s={0.55} /><Magnifier x={26} y={-14} s={0.56} /></>],
    ['02', 'Bán thử 10 đơn', 'Làm bản nhỏ, bán thật, nghe khách nói.', <><Box x={-4} y={4} s={0.62} /><circle cx={42} cy={-42} r={24} fill={hs.navy} /><text x={42} y={-33} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={26} fill="#fff">10</text></>],
    ['03', 'Nhân bản cái đang chạy', 'Video ra đơn thì làm thêm 10 bản giống nó.', <><Phone x={-24} y={6} s={0.26} rot={-8} /><Phone x={26} y={-2} s={0.26} rot={8} /><Arrow x={4} y={52} s={0.0} /></>],
    ['04', 'Tự động hoá việc lặp lại', 'Để máy làm việc cũ, người làm việc mới.', <><Gear x={-14} y={6} r={38} /><Gear x={44} y={-34} r={22} /><circle cx={44} cy={44} r={20} fill={hs.lime} stroke={hs.navy} strokeWidth={4} /><path d="M35 44 L42 51 L55 36" fill="none" stroke={hs.navy} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></>],
  ];
  return (
    <g>
      <rect width={1080} height={1920} fill={hs.paper} />
      <Mark x={80} y={90} s={0.7} />
      <text x={80} y={330} fontFamily={MONO} fontWeight={600} fontSize={30} fill={hs.blue}>QUY TRÌNH · 4 BƯỚC</text>
      <text fontFamily={HEAD} fontWeight={800} fontSize={104} fill={hs.navy}>
        <tspan x={80} y={450}>Làm theo đúng</tspan><tspan x={80} y={570}>thứ tự này.</tspan>
      </text>
      <Coin x={900} y={420} r={52} /><Plus x={980} y={330} /><Dot x={800} y={300} r={10} c={hs.blue} o={0.35} />
      <path d="M165 835 V1630" stroke={hs.tint} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" />
      {items.map(([n, t, d, ic], i) => (
        <g key={i} transform={`translate(80 ${650 + i * 290})`} filter="url(#card)">
          <rect width={920} height={250} rx={26} fill="#fff" />
          <Badge x={36} y={40}>{ic}</Badge>
          <text x={240} y={96} fontFamily={MONO} fontWeight={600} fontSize={32} fill={hs.blue}>{n}</text>
          <text x={240} y={154} fontFamily={HEAD} fontWeight={800} fontSize={44} fill={hs.navy}>{t}</text>
          <text x={240} y={204} fontFamily={BODY} fontSize={31} fill={hs.navy} opacity={0.65}>{d}</text>
        </g>
      ))}
    </g>
  );
};

/* 3. BIỂU ĐỒ (nền Navy — khoảnh khắc "uy tín") */
const Chart = () => {
  const vals = [8, 22, 41, 63, 82, 100], lb = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  const base = 1400, h = 700, x0 = 170, bw = 106, gap = 30;
  return (
    <g>
      <rect width={1080} height={1920} fill={hs.navy} />
      <Mark x={80} y={90} s={0.7} dark />
      <text x={80} y={330} fontFamily={MONO} fontWeight={600} fontSize={30} fill={hs.blue}>DOANH THU CỘNG DỒN</text>
      <text fontFamily={HEAD} fontWeight={800} fontSize={104} fill="#fff">
        <tspan x={80} y={450}>6 tháng,</tspan><tspan x={80} y={570}>một mốc <tspan fill={hs.blue}>100tr.</tspan></tspan>
      </text>
      <g transform="translate(60 700)">
        <rect width={960} height={880} rx={28} fill={hs.soft} />
      </g>
      <CoinStack x={955} y={600} n={4} s={0.62} dark />
      <Coin x={900} y={420} r={34} dark /><Plus x={990} y={340} c={hs.blue} /><Dot x={850} y={330} r={9} c={hs.blue} o={0.4} />
      {[25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={x0} x2={970} y1={base - (g / 100) * h} y2={base - (g / 100) * h} stroke="#fff" opacity={0.12} strokeWidth={2} />
          <text x={x0 - 18} y={base - (g / 100) * h + 10} textAnchor="end" fontFamily={MONO} fontSize={28} fill="#fff" opacity={0.5}>{g}</text>
        </g>
      ))}
      {vals.map((v, i) => {
        const x = x0 + i * (bw + gap), bh = (v / 100) * h, last = i === 5;
        return (
          <g key={i}>
            <rect x={x} y={base - bh} width={bw} height={bh} rx={14} fill={last ? hs.lime : hs.blue} />
            <text x={x + bw / 2} y={base - bh - 20} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={38} fill="#fff">{v}</text>
            <text x={x + bw / 2} y={base + 54} textAnchor="middle" fontFamily={MONO} fontSize={32} fill="#fff" opacity={0.6}>{lb[i]}</text>
          </g>
        );
      })}
      <g transform="translate(560 790)"><path d="M0 0 V-62" stroke="#fff" strokeWidth={5} strokeLinecap="round" /><path d="M0 -62 L50 -46 L0 -30Z" fill={hs.lime} /></g>
      <Arrow x={430} y={880} s={0.8} />
      <text x={80} y={1710} fontFamily={MONO} fontSize={30} fill="#fff" opacity={0.6}>đơn vị: triệu đồng</text>
      <text x={80} y={1760} fontFamily={MONO} fontSize={30} fill="#fff" opacity={0.6}>ví dụ giả định, không phải kết quả thật</text>
    </g>
  );
};

/* 4. CTA (nền Navy, nút Lime) */
const Cta = () => (
  <g>
    <rect width={1080} height={1920} fill={hs.navy} />
    <Mark x={80} y={90} dark />
    <text fontFamily={HEAD} fontWeight={800} fontSize={112} fill="#fff">
      <tspan x={80} y={430}>Muốn đi nhanh</tspan><tspan x={80} y={555}>hơn, có người</tspan><tspan x={80} y={680}>chỉ <tspan fill={hs.blue}>từng bước?</tspan></tspan>
    </text>
    <g transform="translate(80 770)">
      <rect width={920} height={380} rx={28} fill={hs.soft} />
      {['Lộ trình từng bước', 'Bài thực hành thật', 'Hỏi đáp khi bị kẹt'].map((t, i) => (
        <g key={i} transform={`translate(50 ${40 + i * 110})`}>
          <rect width={76} height={76} rx={20} fill={hs.tint} />
          <path d="M21 40 L34 53 L56 27" fill="none" stroke={hs.blue} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <text x={108} y={53} fontFamily={HEAD} fontWeight={800} fontSize={42} fill="#fff">{t}</text>
        </g>
      ))}
    </g>
    {/* minh hoạ học + làm */}
    <g>
      <circle cx={540} cy={1420} r={170} fill={hs.soft} />
      <Laptop x={540} y={1440} s={1.0} />
      <GradCap x={820} y={1330} s={0.75} />
      <CoinStack x={210} y={1500} n={4} s={0.78} dark />
      <Coin x={300} y={1290} r={38} dark /><Dot x={900} y={1500} r={10} c={hs.blue} o={0.5} /><Plus x={130} y={1330} c={hs.blue} /><Plus x={960} y={1230} c="#fff" />
    </g>
    <Pill x={80} y={1600} w={500} fill={hs.lime} color={hs.navy} text="Bắt đầu học ↗" size={44} h={108} />
    <text x={630} y={1670} fontFamily={BODY} fontWeight={500} fontSize={38} fill="#fff" opacity={0.75} textDecoration="underline">Xem thêm ↗</text>
    <text x={80} y={1790} fontFamily={MONO} fontSize={26} fill="#fff" opacity={0.6}>Hynex.{hs.sub} — một nhánh của Hynex Ecosystem</text>
    <text x={80} y={1835} fontFamily={MONO} fontSize={24} fill="#fff" opacity={0.4}>Nội dung tham khảo, không cam kết thu nhập</text>
  </g>
);

export const HynexSolDemo: React.FC = () => {
  const f = useCurrentFrame();
  const Scene = [Cover, Steps, Chart, Cta][Math.min(f, 3)];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><Defs /><Scene /></svg>
    </AbsoluteFill>
  );
};
