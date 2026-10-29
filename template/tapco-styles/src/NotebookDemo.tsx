import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '@fontsource/patrick-hand/latin-400.css';
import '@fontsource/patrick-hand/latin-ext-400.css';
import '@fontsource/patrick-hand/vietnamese-400.css';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/baloo-2/latin-ext-800.css';
import '@fontsource/baloo-2/vietnamese-800.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/vietnamese-600.css';

// ====== LAYOUT 7: NOTEBOOK EXPLAINER (ảnh demo tĩnh — mỗi frame = 1 cảnh) ======
const P = {navy: '#1f2f5c', sky: '#cfe6f7', powder: '#e4f1fa', cream: '#fbf6e9', coral: '#f4907b', peach: '#fbd3bd', mint: '#a9dfc4', yellow: '#fbd35b', orange: '#e8924a'};
const H = '"Baloo 2","Be Vietnam Pro",sans-serif';
const HAND = '"Patrick Hand","Be Vietnam Pro",sans-serif';
export const NB_SCENES = 4;
const L = {stroke: P.navy, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

const Defs = () => (
  <defs>
    <filter id="wob" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="5" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
    </filter>
    <filter id="sh" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="6" dy="9" stdDeviation="5" floodColor="#1f2f5c" floodOpacity="0.18" />
    </filter>
  </defs>
);

const Page: React.FC<{tint: string}> = ({tint}) => (
  <g>
    <rect width={1080} height={1920} fill={tint} />
    <g filter="url(#sh)">
      <rect x={50} y={90} width={980} height={1740} rx={14} fill={P.cream} stroke={P.navy} strokeWidth={5} />
    </g>
    {Array.from({length: 33}).map((_, i) => <line key={i} x1={70} x2={1010} y1={190 + i * 50} y2={190 + i * 50} stroke="#b9d3ea" strokeWidth={2} />)}
    <line x1={170} x2={170} y1={100} y2={1820} stroke={P.coral} strokeWidth={3} opacity={0.7} />
    {Array.from({length: 14}).map((_, i) => <circle key={i} cx={50} cy={160 + i * 125} r={14} fill={tint} stroke={P.navy} strokeWidth={4} />)}
  </g>
);

const Coin: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 60}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={P.yellow} {...L} />
    <circle r={r * 0.66} fill="none" {...L} strokeWidth={4} />
    <text y={r * 0.3} textAnchor="middle" fontFamily={H} fontSize={r * 0.9} fill={P.navy}>₫</text>
  </g>
);
const Wavy: React.FC<{x: number; y: number; w: number; c?: string}> = ({x, y, w, c = P.coral}) => (
  <path d={`M${x} ${y} q${w / 8} -16 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0`} stroke={c} strokeWidth={9} fill="none" strokeLinecap="round" />
);
const Star: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -26 L7 -7 L27 -7 L11 5 L17 25 L0 13 L-17 25 L-11 5 L-27 -7 L-7 -7Z" fill={P.yellow} {...L} strokeWidth={4} />
);
const Person: React.FC<{x: number; y: number; s?: number; arm?: 'up' | 'point'}> = ({x, y, s = 1, arm = 'up'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-10} width={120} height={150} rx={40} fill={P.coral} {...L} />
    <path d={arm === 'up' ? 'M60 20 L120 -60' : 'M60 30 L140 20'} {...L} strokeWidth={22} stroke={P.coral} />
    <path d={arm === 'up' ? 'M60 20 L120 -60' : 'M60 30 L140 20'} {...L} strokeWidth={6} />
    <path d="M-60 30 L-105 90" {...L} strokeWidth={22} stroke={P.coral} /><path d="M-60 30 L-105 90" {...L} />
    <rect x={-40} y={140} width={32} height={90} rx={12} fill={P.navy} /><rect x={8} y={140} width={32} height={90} rx={12} fill={P.navy} />
    <circle cx={0} cy={-70} r={58} fill="#fde1c4" {...L} />
    <path d="M-58 -78 Q-40 -140 10 -128 Q60 -120 58 -70 Q20 -105 -58 -78Z" fill={P.navy} />
    <circle cx={-18} cy={-68} r={5} fill={P.navy} /><circle cx={20} cy={-68} r={5} fill={P.navy} />
    <path d="M-16 -46 Q2 -30 20 -46" {...L} strokeWidth={5} fill="none" />
  </g>
);

/* ---- 1. BÌA ---- */
const Cover = () => (
  <g>
    <Page tint={P.sky} />
    <g filter="url(#wob)">
      <text x={230} y={330} fontFamily={HAND} fontSize={58} fill={P.navy}>Tập 1 · Kiếm tiền hiện nay</text>
      <text x={230} y={500} fontFamily={H} fontWeight={800} fontSize={170} fill={P.navy}>KIẾM</text>
      <text x={230} y={660} fontFamily={H} fontWeight={800} fontSize={170} fill={P.coral}>100 TRIỆU</text>
      <text x={230} y={810} fontFamily={H} fontWeight={800} fontSize={120} fill={P.navy}>ĐẦU TIÊN</text>
      <Wavy x={230} y={840} w={620} c={P.yellow} />
      {/* heo đất */}
      <g transform="translate(560 1260)">
        <ellipse cx={0} cy={0} rx={230} ry={170} fill={P.peach} {...L} />
        <path d="M-170 -110 L-200 -190 L-110 -150Z" fill={P.peach} {...L} />
        <ellipse cx={200} cy={20} rx={52} ry={42} fill={P.coral} {...L} /><circle cx={190} cy={20} r={7} fill={P.navy} /><circle cx={215} cy={20} r={7} fill={P.navy} />
        <circle cx={120} cy={-50} r={13} fill={P.navy} />
        <rect x={-60} y={-176} width={120} height={16} rx={8} fill={P.navy} />
        <rect x={-150} y={150} width={50} height={80} rx={14} fill={P.peach} {...L} /><rect x={80} y={150} width={50} height={80} rx={14} fill={P.peach} {...L} />
        <path d="M-230 -20 q-40 -30 -10 -70" {...L} fill="none" />
      </g>
      <Coin x={560} y={1000} r={64} />
      <path d="M560 1070 L560 1090" {...L} strokeDasharray="2 14" />
      <Coin x={820} y={930} r={42} /><Coin x={300} y={1040} r={38} />
      <Star x={880} y={420} s={1.3} /><Star x={140} y={1480} s={1} />
      <Person x={250} y={1450} s={0.8} arm="up" />
      <text x={640} y={1700} fontFamily={HAND} fontSize={44} fill={P.navy} opacity={0.75}>(số liệu minh hoạ)</text>
    </g>
  </g>
);

/* ---- 2. LỘ TRÌNH ---- */
const Stop: React.FC<{x: number; y: number; n: number; label: string; c: string; children: React.ReactNode}> = ({x, y, n, label, c, children}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={120} fill={c} {...L} />
    <g>{children}</g>
    <circle cx={-95} cy={-95} r={34} fill={P.yellow} {...L} /><text x={-95} y={-82} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={42} fill={P.navy}>{n}</text>
    <text y={190} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={48} fill={P.navy}>{label}</text>
  </g>
);
const Road = () => (
  <g>
    <Page tint={P.mint} />
    <g filter="url(#wob)">
      <text x={230} y={290} fontFamily={H} fontWeight={800} fontSize={104} fill={P.navy}>Lộ trình 4 bước</text>
      <Wavy x={230} y={325} w={560} />
      <path d="M300 640 C 700 560, 800 800, 520 900 S 260 1160, 540 1260 S 820 1500, 700 1620" fill="none" stroke={P.navy} strokeWidth={6} strokeDasharray="4 22" strokeLinecap="round" />
      <Stop x={300} y={640} n={1} label="Chọn sản phẩm" c={P.powder}>
        <rect x={-55} y={-40} width={110} height={90} fill={P.peach} {...L} /><path d="M-70 -40 L0 -90 L70 -40Z" fill={P.coral} {...L} /><rect x={-14} y={0} width={28} height={50} fill={P.cream} {...L} strokeWidth={4} />
      </Stop>
      <Stop x={780} y={760} n={2} label="Bán thử 10 đơn" c={P.peach}>
        <path d="M-60 -20 L0 -55 L60 -20 L60 45 L0 75 L-60 45Z" fill={P.yellow} {...L} /><path d="M-60 -20 L0 10 L60 -20 M0 10 L0 75" {...L} fill="none" />
      </Stop>
      <Stop x={300} y={1120} n={3} label="Nhân bản ra đơn" c={P.powder}>
        <rect x={-62} y={0} width={30} height={55} fill={P.mint} {...L} strokeWidth={4} /><rect x={-15} y={-30} width={30} height={85} fill={P.mint} {...L} strokeWidth={4} /><rect x={32} y={-65} width={30} height={120} fill={P.coral} {...L} strokeWidth={4} />
      </Stop>
      <Stop x={760} y={1500} n={4} label="Tự động hoá" c={P.peach}>
        <circle r={44} fill={P.sky} {...L} /><circle r={16} fill={P.cream} {...L} strokeWidth={4} />
        {[0, 60, 120, 180, 240, 300].map((a) => <rect key={a} x={-9} y={-64} width={18} height={24} fill={P.sky} {...L} strokeWidth={4} transform={`rotate(${a})`} />)}
      </Stop>
      <Star x={900} y={380} s={1.2} /><Star x={150} y={1560} s={1} />
      <Person x={580} y={1030} s={0.55} arm="point" />
    </g>
  </g>
);

/* ---- 3. BIỂU ĐỒ ---- */
const Chart = () => {
  const vals = [8, 22, 41, 63, 82, 100];
  const lb = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  const base = 1360, h = 800, x0 = 260, bw = 100, gap = 28;
  const cols = [P.sky, P.sky, P.mint, P.mint, P.peach, P.yellow];
  return (
    <g>
      <Page tint={P.peach} />
      <g filter="url(#wob)">
        <text x={230} y={290} fontFamily={H} fontWeight={800} fontSize={80} fill={P.navy}>Doanh thu cộng dồn</text>
        <Wavy x={230} y={325} w={620} c={P.yellow} />
        <path d={`M${x0 - 30} ${base - h - 40} L${x0 - 30} ${base} L1000 ${base}`} {...L} fill="none" />
        {[25, 50, 75, 100].map((g) => (
          <g key={g}><line x1={x0 - 30} x2={1000} y1={base - (g / 100) * h} y2={base - (g / 100) * h} stroke={P.navy} strokeDasharray="4 14" opacity={0.35} strokeWidth={3} />
            <text x={x0 - 50} y={base - (g / 100) * h + 12} textAnchor="end" fontFamily={HAND} fontSize={38} fill={P.navy}>{g}</text></g>
        ))}
        {vals.map((v, i) => {
          const x = x0 + i * (bw + gap), bh = (v / 100) * h;
          return (
            <g key={i}>
              <rect x={x} y={base - bh} width={bw} height={bh} rx={8} fill={cols[i]} {...L} />
              {[0.25, 0.5, 0.75].map((q) => <line key={q} x1={x + 14} x2={x + 40} y1={base - bh * q} y2={base - bh * q - 22} stroke={P.navy} strokeWidth={3} opacity={0.35} />)}
              <text x={x + bw / 2} y={base - bh - 18} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={44} fill={P.navy}>{v}</text>
              <text x={x + bw / 2} y={base + 56} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={P.navy}>{lb[i]}</text>
            </g>
          );
        })}
        <circle cx={x0 + 5 * (bw + gap) + bw / 2} cy={base - h - 60} r={120} fill="none" stroke={P.coral} strokeWidth={8} strokeDasharray="520 40" />
        <text x={x0 + 5 * (bw + gap) + bw / 2 - 135} y={base - h - 50} textAnchor="end" fontFamily={HAND} fontSize={52} fill={P.coral}>mốc 100 triệu!</text>
        <text x={540} y={1560} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={72} fill={P.navy}>đơn vị: triệu đồng</text>
        <text x={540} y={1630} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={P.navy} opacity={0.75}>Ví dụ giả định, không phải kết quả thật</text>
      </g>
    </g>
  );
};

/* ---- 4. CTA ---- */
const Cta = () => (
  <g>
    <Page tint={P.sky} />
    <g filter="url(#wob)">
      <text x={230} y={330} fontFamily={HAND} fontSize={56} fill={P.navy}>Muốn làm bài bản?</text>
      <text x={230} y={470} fontFamily={H} fontWeight={800} fontSize={120} fill={P.navy}>Học cùng</text>
      <g transform="translate(540 760) rotate(-3)" filter="url(#sh)">
        <rect x={-380} y={-110} width={760} height={220} rx={26} fill={P.coral} {...L} />
        <text y={40} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={140} fill={P.cream}>HYNEX EDU</text>
      </g>
      <g transform="translate(700 1060) rotate(4)" filter="url(#sh)">
        <rect x={-270} y={-130} width={540} height={270} fill={P.yellow} {...L} />
        <text y={-40} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={P.navy}>Có người chỉ</text>
        <text y={25} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={P.navy}>từng bước, có</text>
        <text y={90} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={P.navy}>bài thực hành</text>
      </g>
      <Person x={330} y={1250} s={1.1} arm="point" />
      <path d="M470 1250 C 560 1200, 600 1160, 640 1130" {...L} fill="none" strokeDasharray="4 18" />
      <g transform="translate(540 1640)"><rect x={-290} y={-52} width={580} height={104} rx={52} fill={P.cream} {...L} /><text y={14} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={46} fill={P.navy}>Xem khoá học ở link bio</text></g>
      <Star x={880} y={330} s={1.3} /><Star x={170} y={900} s={1} />
    </g>
  </g>
);

export const NotebookDemo: React.FC = () => {
  const f = useCurrentFrame();
  const Scene = [Cover, Road, Chart, Cta][Math.min(f, 3)];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><Defs /><Scene /></svg>
    </AbsoluteFill>
  );
};
