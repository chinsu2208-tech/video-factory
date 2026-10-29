import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/baloo-2/latin-ext-800.css';
import '@fontsource/baloo-2/vietnamese-800.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/vietnamese-600.css';
import '@fontsource/patrick-hand/latin-400.css';
import '@fontsource/patrick-hand/latin-ext-400.css';
import '@fontsource/patrick-hand/vietnamese-400.css';

// ====== TEMPLATE: SCRAPBOOK DOODLE · KIẾN THỨC / TIPS MẸO (TAP Store) ======
// Dạng nội dung: giáo dục ngắn (mẹo/kiến thức) cho học sinh; ảnh sản phẩm thật chỉ là 1 phần của mẹo.
// Sticker doodle: viền trắng + nét navy 4px + rung tay nhẹ. Tập mới: sửa SC + nội dung trong từng cảnh.
const H = '"Baloo 2","Be Vietnam Pro",sans-serif';
const HAND = '"Patrick Hand","Be Vietnam Pro",sans-serif';
const NAVY = '#33477a';
const CORAL = '#f4907b';
const PINK = '#f7b6c5';
const MINT = '#a9dfc4';
const BUTTER = '#fbe38a';
const LAV = '#d9c8f0';
const SKY = '#cfe6f7';
const PEACH = '#fbd3bd';
const CX = 490;
const ease = Easing.inOut(Easing.cubic);
let TNOW = 0; // thời gian hiện tại (giây) cho các doodle rung

type Sc = {id: string; s: number; e: number; cap: string; bg: string};
export const TT_SC: Sc[] = [
  {id: 'cover', s: 0, e: 4.5, cap: '3 mẹo cho tủ đồ đi học', bg: '#cfe6f7'},
  {id: 't1', s: 4.5, e: 9.5, cap: 'Mẹo 1: Phơi khô hẳn', bg: '#ffe3d6'},
  {id: 't2', s: 9.5, e: 14.5, cap: 'Mẹo 2: Để tủ thoáng', bg: '#d6f0e4'},
  {id: 't3', s: 14.5, e: 20, cap: 'Mẹo 3: Thử chỗ khuất', bg: '#e6dcf7'},
  {id: 'list', s: 20, e: 24.5, cap: 'Nhớ nhanh 3 mẹo', bg: '#fff3c4'},
  {id: 'end', s: 24.5, e: 29, cap: 'Theo dõi để xem thêm mẹo', bg: '#cfe6f7'},
];
export const TT_TOTAL = 29;

// ---------- hình học ----------
const starPath = (R: number, r: number, n: number) => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rad = i % 2 ? r : R;
    pts.push(`${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`);
  }
  return `M${pts.join(' L')}Z`;
};
const D_HEART = 'M0,24 C-48,-8 -26,-48 0,-24 C26,-48 48,-8 0,24Z';
const D_CLOUD = 'M-46,22 a22,22 0 0 1 4,-42 a30,30 0 0 1 56,-8 a24,24 0 0 1 36,24 a18,18 0 0 1 -6,26 Z';
const D_STAR = starPath(44, 20, 5);
const D_BURST = starPath(84, 68, 16);
const D_SHIRT = 'M-30,-30 L-12,-38 Q0,-24 12,-38 L30,-30 L44,-6 L28,0 L28,38 L-28,38 L-28,0 L-44,-6 Z';
const D_SPARK = 'M0,-34 Q5,-5 34,0 Q5,5 0,34 Q-5,5 -34,0 Q-5,-5 0,-34Z';

type Shape = {d: string; fill: string} | {cx: number; cy: number; r: number; fill: string};
const Face: React.FC<{y?: number; k?: number}> = ({y = 0, k = 1}) => (
  <g transform={`translate(0 ${y}) scale(${k})`}>
    <circle cx={-10} cy={-2} r={3.4} fill={NAVY} /><circle cx={10} cy={-2} r={3.4} fill={NAVY} />
    <path d="M-6,6 Q0,13 6,6" fill="none" stroke={NAVY} strokeWidth={3.4} strokeLinecap="round" />
    <circle cx={-19} cy={7} r={4.6} fill={PINK} opacity={0.85} /><circle cx={19} cy={7} r={4.6} fill={PINK} opacity={0.85} />
  </g>
);
// sticker: viền trắng dày + nét navy + rung tay
const Stk: React.FC<{x: number; y: number; s?: number; r?: number; p: number; shapes: Shape[]; children?: React.ReactNode; seed?: number}> = ({x, y, s = 1, r = 0, p, shapes, children, seed = 0}) => {
  const jit = Math.sin(Math.floor(TNOW * 5) * 2.1 + seed * 1.7) * 2.2;
  const draw = (u: boolean) => shapes.map((sh, i) => {
    const common = u ? {fill: '#fff', stroke: '#fff', strokeWidth: 22} : {fill: sh.fill, stroke: NAVY, strokeWidth: 4};
    return 'd' in sh ? <path key={i} d={sh.d} strokeLinejoin="round" {...common} /> : <circle key={i} cx={sh.cx} cy={sh.cy} r={sh.r} {...common} />;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${r + jit + (1 - Math.min(1, p)) * -25}) scale(${s * p})`} opacity={Math.min(1, p * 1.5)} filter="url(#wob)">
      {draw(true)}
      {draw(false)}
      {children}
    </g>
  );
};
const Heart: React.FC<{x: number; y: number; s?: number; r?: number; p: number; c?: string; face?: boolean}> = ({c = CORAL, face = true, ...o}) => (
  <Stk {...o} shapes={[{d: D_HEART, fill: c}]}>{face && <Face y={-4} k={0.8} />}</Stk>
);
const Cloud: React.FC<{x: number; y: number; s?: number; r?: number; p: number}> = (o) => (
  <Stk {...o} shapes={[{d: D_CLOUD, fill: '#fff'}]}><Face y={-6} /></Stk>
);
const StarS: React.FC<{x: number; y: number; s?: number; r?: number; p: number; c?: string; face?: boolean}> = ({c = BUTTER, face = true, ...o}) => (
  <Stk {...o} shapes={[{d: D_STAR, fill: c}]}>{face && <Face y={2} k={0.8} />}</Stk>
);
const Spark: React.FC<{x: number; y: number; s?: number; p: number; c?: string}> = ({c = BUTTER, ...o}) => <Stk {...o} shapes={[{d: D_SPARK, fill: c}]} />;
const Flower: React.FC<{x: number; y: number; s?: number; p: number; c?: string}> = ({c = PINK, ...o}) => (
  <Stk {...o} shapes={[...[0, 72, 144, 216, 288].map((a) => ({cx: Math.cos((a * Math.PI) / 180) * 24, cy: Math.sin((a * Math.PI) / 180) * 24, r: 19, fill: c})), {cx: 0, cy: 0, r: 15, fill: BUTTER}]} />
);
const Burst: React.FC<{x: number; y: number; s?: number; r?: number; p: number; c?: string; lines: string[]; fs?: number; tc?: string}> = ({lines, fs = 40, c = CORAL, tc = '#fff', ...o}) => (
  <Stk {...o} shapes={[{d: D_BURST, fill: c}]}>
    {lines.map((l, i) => <text key={i} textAnchor="middle" y={-((lines.length - 1) * fs * 0.5) + i * fs + fs * 0.33} fontFamily={H} fontWeight={800} fontSize={fs} fill={tc}>{l}</text>)}
  </Stk>
);
const Shirt: React.FC<{x: number; y: number; s?: number; r?: number; p: number; c?: string}> = ({c = SKY, ...o}) => (
  <Stk {...o} shapes={[{d: D_SHIRT, fill: c}]}><path d="M-12,-38 Q0,-24 12,-38" fill="none" stroke={NAVY} strokeWidth={3} /></Stk>
);
const BottleD: React.FC<{x: number; y: number; s?: number; r?: number; p: number}> = (o) => (
  <Stk {...o} shapes={[
    {d: 'M-18,-8 Q-18,-14 -10,-14 H10 Q18,-14 18,-8 V40 Q18,46 10,46 H-10 Q-18,46 -18,40Z', fill: PINK},
    {d: 'M-9,-14 V-30 H9 V-14Z', fill: '#fff'},
    {d: 'M-14,-30 V-44 H12 L18,-38 V-30Z', fill: '#fff'},
  ]}><Heart x={0} y={18} s={0.35} p={1} c="#fff" face={false} /></Stk>
);
const Wardrobe: React.FC<{x: number; y: number; s?: number; p: number; open: number}> = ({open, ...o}) => (
  <Stk {...o} shapes={[{d: 'M-46,-56 H46 V56 H-46Z', fill: PEACH}]}>
    <path d="M0,-56 V56" stroke={NAVY} strokeWidth={4} />
    <rect x={-40 + open * 6} y={-50} width={38 - open * 22} height={100} fill="#fff" opacity={0.65} stroke={NAVY} strokeWidth={3} rx={4} />
    <circle cx={-10} cy={0} r={4} fill={NAVY} /><circle cx={10} cy={0} r={4} fill={NAVY} />
    <path d="M-30,60 V70 M30,60 V70" stroke={NAVY} strokeWidth={6} strokeLinecap="round" />
  </Stk>
);
const Sun: React.FC<{x: number; y: number; s?: number; p: number}> = ({x, y, s = 1, p}) => (
  <g transform={`translate(${x} ${y}) scale(${s * p})`}>
    <g transform={`rotate(${TNOW * 20})`} stroke={BUTTER} strokeWidth={10} strokeLinecap="round" filter="url(#wob)">
      {Array.from({length: 10}).map((_, i) => <path key={i} d={`M0,-50 V-70`} transform={`rotate(${i * 36})`} />)}
    </g>
    <Stk x={0} y={0} p={1} shapes={[{cx: 0, cy: 0, r: 38, fill: BUTTER}]}><Face /></Stk>
  </g>
);
const Speech: React.FC<{x: number; y: number; p: number; text: string; r?: number}> = ({x, y, p, text, r = -6}) => (
  <Stk x={x} y={y} p={p} r={r} shapes={[{d: 'M-78,-26 Q-78,-48 -46,-48 H46 Q78,-48 78,-26 Q78,-2 46,-2 H24 L12,20 L4,-2 H-46 Q-78,-2 -78,-26Z', fill: '#fff'}]}>
    <text textAnchor="middle" y={-14} fontFamily={H} fontWeight={800} fontSize={36} fill={CORAL}>{text}</text>
  </Stk>
);
const Mist: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  const pulse = 1 + 0.12 * Math.sin(TNOW * 6);
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} filter="url(#wob)">
      {[[0, 0, 15], [-30, -22, 11], [-24, 18, 10], [-58, -4, 8], [-50, 34, 6]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={(r as number) * pulse} fill="#fff" stroke={NAVY} strokeWidth={3.5} />
      ))}
    </g>
  );
};
const Squig: React.FC<{x: number; y: number; r?: number; p: number; c?: string; n?: number}> = ({x, y, r = 0, p, c = CORAL, n = 4}) => (
  <path transform={`translate(${x} ${y}) rotate(${r})`} d={`M0,0 q12,-16 24,0 ${'t24,0 '.repeat(n)}`} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} filter="url(#wob)" />
);
const Dotted: React.FC<{d: string; p: number; head: [number, number, number, number, number, number]}> = ({d, p, head}) => (
  <g fill="none" stroke={CORAL} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={Math.min(1, p * 3)} filter="url(#wob)">
    <path d={d} strokeDasharray="1 18" />
    {p > 0.9 && <path d={`M${head[0]},${head[1]} L${head[2]},${head[3]} L${head[4]},${head[5]}`} />}
  </g>
);
const Washi: React.FC<{x: number; y: number; w: number; r: number; p: number; c?: string}> = ({x, y, w, r, p, c = PEACH}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${p} 1)`} opacity={0.93}>
    <rect x={-w / 2} y={-24} width={w} height={48} fill={c} />
    {Array.from({length: Math.floor(w / 26)}).map((_, i) => <path key={i} d={`M${-w / 2 + i * 26},24 L${-w / 2 + i * 26 + 24},-24`} stroke="#fff" strokeWidth={7} opacity={0.55} />)}
  </g>
);
const Sticky: React.FC<{x: number; y: number; s: number; r: number; p: number; c?: string; lines: string[]; fs?: number}> = ({x, y, s, r, p, c = BUTTER, lines, fs = 38}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${p})`} opacity={Math.min(1, p)}>
    <rect x={-s / 2 + 6} y={-s / 2 + 10} width={s} height={s} fill="rgba(51,71,122,.18)" />
    <path d={`M${-s / 2},${-s / 2} H${s / 2} V${s / 2 - 34} L${s / 2 - 34},${s / 2} H${-s / 2} Z`} fill={c} />
    <path d={`M${s / 2 - 34},${s / 2} L${s / 2},${s / 2 - 34} L${s / 2 - 34},${s / 2 - 34} Z`} fill="rgba(0,0,0,.12)" />
    {lines.map((l, i) => <text key={i} textAnchor="middle" y={-((lines.length - 1) * fs * 0.5) + i * fs * 0.98 + fs * 0.3} fontFamily={HAND} fontSize={fs} fill={NAVY}>{l}</text>)}
  </g>
);
const Polaroid: React.FC<{img: string; x: number; y: number; w: number; r: number; p: number; bg: string; note?: string; tape?: string}> = ({img, x, y, w, r, p, bg, note, tape = PEACH}) => {
  const ph = w * 1.12;
  const total = 28 + ph + 96;
  const cid = `pc${img}${Math.round(x)}${Math.round(y)}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r + (1 - Math.min(1, p)) * -10}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={-w / 2 - 14} y={-total / 2 + 14} width={w + 28} height={total} rx={14} fill="rgba(51,71,122,.2)" />
      <rect x={-w / 2 - 14} y={-total / 2} width={w + 28} height={total} rx={14} fill="#fff" stroke={NAVY} strokeWidth={4} />
      <clipPath id={cid}><rect x={-w / 2} y={-total / 2 + 22} width={w} height={ph} rx={10} /></clipPath>
      <rect x={-w / 2} y={-total / 2 + 22} width={w} height={ph} rx={10} fill={bg} />
      <image clipPath={`url(#${cid})`} href={staticFile(`tap/${img}`)} x={-ph * 0.4 * 1.02} y={-total / 2 + 22} width={ph * 0.8 * 1.02} height={ph * 1.02} />
      {note && <text textAnchor="middle" y={total / 2 - 28} fontFamily={HAND} fontSize={Math.max(26, w * 0.085)} fill={NAVY}>{note}</text>}
      <Washi x={-w / 2 + 20} y={-total / 2 + 10} w={120} r={-35} p={1} c={tape} />
      <Washi x={w / 2 - 20} y={-total / 2 + 10} w={120} r={35} p={1} c={tape} />
    </g>
  );
};
const Check: React.FC<{p: number}> = ({p}) => (
  <g>
    <rect x={-26} y={-26} width={52} height={52} rx={14} fill="#fff" stroke={NAVY} strokeWidth={5} />
    <path d="M-13,1 L-3,12 L16,-12" fill="none" stroke={CORAL} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </g>
);
// tiêu đề kiểu sticker: viền trắng + bóng màu lệch
const Head: React.FC<{x?: number; y: number; p: number; lines: {t: string; size: number; fill: string; shadow?: string}[]; gap?: number}> = ({x = CX, y, p, lines, gap = 1.05}) => {
  let yy = 0;
  return (
    <g transform={`translate(${x} ${y + (1 - Math.min(1, p)) * 30})`} opacity={Math.min(1, p)}>
      {lines.map((l, i) => {
        const cy = yy; yy += l.size * gap;
        return (
          <g key={i}>
            <text textAnchor="middle" x={6} y={cy + 7} fontFamily={H} fontWeight={800} fontSize={l.size} fill={l.shadow || PINK} stroke={l.shadow || PINK} strokeWidth={14} strokeLinejoin="round">{l.t}</text>
            <text textAnchor="middle" y={cy} fontFamily={H} fontWeight={800} fontSize={l.size} fill={l.fill} stroke="#fff" strokeWidth={12} paintOrder="stroke" strokeLinejoin="round">{l.t}</text>
          </g>
        );
      })}
    </g>
  );
};

export const TapTips: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  TNOW = t;
  const idx = Math.max(0, TT_SC.findIndex((s) => t >= s.s && t < s.e));
  const sc = TT_SC[idx];
  const lt = t - sc.s;
  const dur = sc.e - sc.s;
  const sp = (at: number, damping = 10) => Math.max(0, spring({frame: f - Math.round((sc.s + at) * fps), fps, config: {damping, stiffness: 130}}));
  const draw = (at: number, len = 0.9) => ease(interpolate(lt, [at, at + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const enter = spring({frame: f - Math.round(sc.s * fps), fps, config: {damping: 16, stiffness: 100}});
  const exit = ease(interpolate(lt, [dur - 0.35, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const pageX = (1 - Math.min(1, enter)) * 1100 - (1 - exit) * 1100;
  const zoom = 1 + 0.035 * (lt / dur);
  const capP = Math.min(1, sp(0.3, 15));
  const seed = Math.floor(t * 6) % 5 + 1;
  const sw = (at: number) => ease(interpolate(lt, [at, at + 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

  const tipHead = (n: number, l1: string, l2: string) => (
    <g>
      <Washi x={CX} y={250} w={280} r={-2} p={sp(0.05)} c={[PEACH, MINT, LAV][n - 1]} />
      <Burst x={CX} y={400} s={1} r={-6} p={sp(0.15, 8)} c={[CORAL, '#6fc5a0', '#a98be0'][n - 1]} lines={['Mẹo', String(n)]} fs={46} />
      <Head y={590} p={sp(0.3)} lines={[{t: l1, size: 76, fill: NAVY, shadow: [PINK, MINT, LAV][n - 1]}, {t: l2, size: 76, fill: CORAL, shadow: '#fff'}]} gap={1.12} />
    </g>
  );

  let body: React.ReactNode = null;
  if (sc.id === 'cover') {
    body = (
      <g>
        <Washi x={CX} y={250} w={300} r={-3} p={sp(0.05)} c={PEACH} />
        <Burst x={790} y={420} r={12} p={sp(0.2, 8)} c={CORAL} lines={['Mẹo', 'hay']} fs={44} />
        <Head y={500} p={sp(0.2)} lines={[{t: '3 mẹo', size: 150, fill: CORAL, shadow: PINK}, {t: 'giữ tủ đồ đi học', size: 74, fill: NAVY, shadow: SKY}]} gap={0.92} />
        <g transform={`translate(${CX} 700)`}>
          <rect x={-250 * sw(0.9)} y={-22} width={500 * sw(0.9)} height={92} rx={18} fill={BUTTER} transform="rotate(-2)" />
        </g>
        <Head y={718} p={sp(0.6)} lines={[{t: 'thơm tho', size: 104, fill: NAVY, shadow: 'transparent'}]} />
        <Polaroid img="c1.png" x={290} y={1130} w={290} r={-7} p={sp(1.0)} bg={LAV} note="Baby" tape={MINT} />
        <Polaroid img="c2.png" x={690} y={1170} w={290} r={6} p={sp(1.3)} bg="#fde2e4" note="Baby Chuchu" tape={PEACH} />
        <Cloud x={160} y={860} s={1.1} r={-8} p={sp(1.5)} />
        <Heart x={830} y={880} s={1.0} r={10} p={sp(1.7)} />
        <StarS x={170} y={1440} s={1.0} r={-10} p={sp(1.9)} />
        <Flower x={800} y={1450} s={0.9} p={sp(2.1)} />
        <Spark x={120} y={600} s={0.7} p={sp(2.3)} />
        <Squig x={150} y={330} p={draw(2.0)} />
        <Squig x={650} y={340} p={draw(2.3)} c="#6fc5a0" n={3} />
      </g>
    );
  } else if (sc.id === 't1') {
    body = (
      <g>
        {tipHead(1, 'Phơi khô hẳn', 'rồi mới cất')}
        <Sun x={770} y={790} s={1.0} p={sp(0.8, 8)} />
        <path d={`M140,${880} Q490,${940 + Math.sin(t * 2) * 4} 840,880`} fill="none" stroke={NAVY} strokeWidth={5} strokeLinecap="round" opacity={sw(0.6)} />
        {[[260, SKY], [450, PEACH], [640, MINT]].map(([x, c], i) => (
          <g key={i} transform={`translate(${x} ${935 + i * 0})`}>
            <g transform={`rotate(${Math.sin(t * 2.4 + i) * 5} 0 -40)`}>
              <path d="M0,-40 V-56 q0,-10 8,-10" stroke={NAVY} strokeWidth={4} fill="none" />
              <Shirt x={0} y={0} s={1.5} p={sp(1.0 + i * 0.25)} c={c as string} />
            </g>
          </g>
        ))}
        <Sticky x={260} y={1200} s={250} r={-5} p={sp(2.0)} lines={['Khô hẳn', 'mới cất']} fs={46} c={BUTTER} />
        <Heart x={640} y={1230} s={1.2} r={8} p={sp(2.3)} c={PINK} />
        <Spark x={800} y={1180} s={0.9} p={sp(2.5)} />
        <Squig x={440} y={1340} p={draw(2.6)} c={CORAL} n={3} />
        <text x={CX} y={1440} textAnchor="middle" fontFamily={HAND} fontSize={42} fill={NAVY} opacity={sw(3)}>Đồ còn ẩm dễ có mùi hôi đó nha</text>
      </g>
    );
  } else if (sc.id === 't2') {
    body = (
      <g>
        {tipHead(2, 'Cho tủ và balo', 'được thở')}
        <Wardrobe x={330} y={1000} s={2.5} p={sp(0.8)} open={sw(1.4)} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${530 + i * 6},${900 + i * 70} q40,-30 80,0 t80,0 t70,0`} fill="none" stroke="#6fc5a0" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw(1.6 + i * 0.25)} filter="url(#wob)" />
        ))}
        <Cloud x={780} y={850} s={1.0} r={6} p={sp(2.2)} />
        <Sticky x={730} y={1200} s={250} r={6} p={sp(2.0)} lines={['Đừng nhét', 'đồ ẩm', 'chật cứng']} fs={36} c={MINT} />
        <StarS x={160} y={1320} s={0.9} r={-8} p={sp(2.5)} />
        <Spark x={560} y={1350} s={0.8} p={sp(2.7)} />
        <text x={CX} y={1440} textAnchor="middle" fontFamily={HAND} fontSize={42} fill={NAVY} opacity={sw(3)}>Mở cửa tủ cho thoáng sau khi dọn</text>
      </g>
    );
  } else if (sc.id === 't3') {
    body = (
      <g>
        {tipHead(3, 'Thử chỗ khuất', 'trước khi xịt vải')}
        <Polaroid img="c1.png" x={470} y={1070} w={380} r={-3} p={sp(0.8)} bg={LAV} note="Baby · Fabric Perfume" tape={PINK} />
        <Mist x={415} y={880} p={sp(2.0, 8)} />
        <Speech x={165} y={800} p={sp(2.3, 8)} text="psst~" />
        <Sticky x={790} y={860} s={220} r={7} p={sp(1.6)} lines={['Thử chỗ', 'khuất', 'trước nha']} fs={36} c={BUTTER} />
        <Shirt x={170} y={1250} s={1.3} r={-8} p={sp(2.6)} c={SKY} />
        <g transform="translate(170 1262)" opacity={sw(3)}>
          <circle r={22} fill="none" stroke={CORAL} strokeWidth={6} strokeDasharray="10 9" />
        </g>
        <Heart x={800} y={1250} s={1.0} r={8} p={sp(2.9)} />
        <Dotted d="M230,1250 C300,1230 330,1190 360,1150" p={sp(3.1)} head={[350, 1190, 362, 1148, 322, 1162]} />
        <text x={CX} y={1470} textAnchor="middle" fontFamily={HAND} fontSize={38} fill={NAVY} opacity={sw(3.3)}>Mỗi loại vải một khác, thử trước cho yên tâm</text>
      </g>
    );
  } else if (sc.id === 'list') {
    const rows: [string, string][] = [['Phơi khô hẳn rồi mới cất', SKY], ['Để tủ và balo thoáng', MINT], ['Thử chỗ khuất trước khi xịt', LAV]];
    body = (
      <g>
        <Washi x={CX} y={250} w={280} r={2} p={sp(0.05)} c={MINT} />
        <Head y={430} p={sp(0.2)} lines={[{t: 'Nhớ nhanh nha', size: 100, fill: CORAL, shadow: PINK}]} />
        {rows.map(([r, c], i) => {
          const p = sp(0.8 + i * 0.7, 12);
          const ck = draw(1.2 + i * 0.7, 0.4);
          return (
            <g key={i} transform={`translate(${CX - 20} ${640 + i * 190 + (1 - Math.min(1, p)) * 40})`} opacity={Math.min(1, p)}>
              <rect x={-380} y={-72} width={760} height={144} rx={36} fill="#fff" stroke={c} strokeWidth={9} />
              <g transform="translate(-320 0)"><Check p={ck} /></g>
              <text x={-260} y={16} fontFamily={H} fontWeight={600} fontSize={40} fill={NAVY}>{r}</text>
            </g>
          );
        })}
        <Sun x={150} y={1280} s={0.8} p={sp(3.0, 8)} />
        <Wardrobe x={490} y={1290} s={1.1} p={sp(3.2, 8)} open={1} />
        <BottleD x={800} y={1290} s={1.4} r={6} p={sp(3.4, 8)} />
        <Squig x={300} y={1420} p={draw(3.6)} n={5} />
        <Spark x={850} y={540} s={0.8} p={sp(3.0)} />
        <StarS x={130} y={560} s={0.8} r={-10} p={sp(3.2)} />
      </g>
    );
  } else {
    body = (
      <g>
        <Washi x={CX} y={250} w={320} r={-2} p={sp(0.05)} c={PINK} />
        <Head y={430} p={sp(0.2)} lines={[{t: 'TAP Store', size: 134, fill: CORAL, shadow: PINK}]} />
        <text x={CX} y={520} textAnchor="middle" fontFamily={HAND} fontSize={46} fill={NAVY} opacity={sw(0.6)}>Fabric Perfume · Baby &amp; Baby Chuchu</text>
        <Polaroid img="c1.png" x={300} y={960} w={320} r={-7} p={sp(0.6)} bg={LAV} note="Baby" tape={MINT} />
        <Polaroid img="c2.png" x={670} y={1020} w={320} r={6} p={sp(0.9)} bg="#fde2e4" note="Baby Chuchu" tape={PEACH} />
        <g transform={`translate(${CX} 1330) scale(${sp(1.8, 9)})`}>
          <rect x={-250} y={-52} width={500} height={104} rx={52} fill={CORAL} stroke={NAVY} strokeWidth={5} />
          <text textAnchor="middle" y={16} fontFamily={H} fontWeight={800} fontSize={48} fill="#fff">Link ở bio nha</text>
        </g>
        <Heart x={150} y={700} s={1.2} r={-12} p={sp(1.2)} />
        <Heart x={840} y={690} s={1.0} r={10} p={sp(1.4)} c={PINK} />
        <Cloud x={160} y={1190} s={1.0} r={-6} p={sp(1.6)} />
        <StarS x={830} y={1250} s={1.0} r={8} p={sp(1.8)} />
        <Spark x={510} y={700} s={0.8} p={sp(2.0)} />
        <Flower x={150} y={1420} s={0.8} p={sp(2.2)} />
        <text x={CX} y={1480} textAnchor="middle" fontFamily={HAND} fontSize={28} fill="#7a8bb5" opacity={sw(2.4)}>Mẹo chung, làm theo hướng dẫn trên nhãn sản phẩm</text>
      </g>
    );
  }

  return (
    <AbsoluteFill style={{background: sc.bg}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="4" fill="#fff" opacity="0.75" /></pattern>
          <filter id="pgsh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx={0} dy={14} stdDeviation={14} floodColor="#33477a" floodOpacity={0.22} /></filter>
          <filter id="wob" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
          </filter>
        </defs>
        <rect width={1080} height={1920} fill={sc.bg} />
        <rect width={1080} height={1920} fill="url(#dots)" transform={`translate(${t * 12} ${t * 8})`} />
        <g transform={`translate(${CX} 880) scale(${zoom}) translate(${-CX} -880) translate(${pageX} 0) rotate(${(1 - Math.min(1, enter)) * 3} ${CX} 880)`}>
          <rect x={50} y={190} width={880} height={1340} rx={34} fill="#fffdf7" filter="url(#pgsh)" />
          {Array.from({length: 22}).map((_, i) => <line key={i} x1={110} x2={900} y1={300 + i * 56} y2={300 + i * 56} stroke="#e2edf7" strokeWidth={3} />)}
          <line x1={150} x2={150} y1={200} y2={1520} stroke={PINK} strokeWidth={4} opacity={0.8} />
          <rect x={72} y={212} width={836} height={1296} rx={26} fill="none" stroke={PINK} strokeWidth={4} strokeDasharray="12 10" />
          {Array.from({length: 13}).map((_, i) => (
            <g key={i} transform={`translate(52 ${260 + i * 96})`}>
              <circle r={15} fill={sc.bg} stroke="#c9d9e8" strokeWidth={3} />
              <path d="M-26,0 H12" stroke="#9aa9c4" strokeWidth={7} strokeLinecap="round" />
            </g>
          ))}
          {[PEACH, MINT, LAV, BUTTER].map((c, i) => <rect key={i} x={918} y={420 + i * 120} width={46} height={92} rx={14} fill={c} stroke="#fff" strokeWidth={4} />)}
          {body}
        </g>
        <g transform={`translate(${CX} 1625) scale(${0.9 + 0.1 * capP})`} opacity={capP * exit}>
          <rect x={-370} y={-44} width={740} height={88} rx={44} fill="#fff" stroke={NAVY} strokeWidth={4} />
          <text textAnchor="middle" y={14} fontFamily={H} fontWeight={800} fontSize={sc.cap.length > 28 ? 34 : 42} fill={NAVY}>{sc.cap}</text>
        </g>
        <text x={CX} y={1705} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={22} fill="#5b73a8">TAP Store · mẹo cho học sinh</text>
      </svg>
    </AbsoluteFill>
  );
};
