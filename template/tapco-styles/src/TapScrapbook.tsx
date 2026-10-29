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

// ====== TEMPLATE: CUTE BEAUTY SCRAPBOOK × ẢNH THẬT (TAP Store) ======
// Trang sổ tay + washi + polaroid ảnh sản phẩm thật (cutout giữ nguyên chai) + sticky + sticker + checklist.
// Tập mới: đổi ảnh public/tap/cN.png và sửa SCENES. Chỉ ghi thông tin thấy trên chai, không hứa công dụng.
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

type Sc = {id: string; s: number; e: number; cap: string};
export const TS_SC: Sc[] = [
  {id: 'cover', s: 0, e: 4.5, cap: 'Mùi nào hợp bạn?'},
  {id: 'p1', s: 4.5, e: 9.5, cap: 'Baby · Fabric Perfume 50ml'},
  {id: 'p2', s: 9.5, e: 14.5, cap: 'Baby Chuchu · 50ml'},
  {id: 'list', s: 14.5, e: 19.5, cap: 'Chọn nhẹ nhàng, hợp là được'},
  {id: 'end', s: 19.5, e: 24.5, cap: 'Hẹn gặp ở TAP Store'},
];
export const TS_TOTAL = 24.5;

// ---------- sticker & vật liệu ----------
const Heart: React.FC<{x: number; y: number; s: number; p: number; c?: string; r?: number}> = ({x, y, s, p, c = CORAL, r = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s * p})`} opacity={Math.min(1, p)}>
    <path d="M0,14 C-34,-8 -18,-38 0,-20 C18,-38 34,-8 0,14Z" fill={c} stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
  </g>
);
const Spark: React.FC<{x: number; y: number; s: number; p: number; c?: string}> = ({x, y, s, p, c = BUTTER}) => (
  <path transform={`translate(${x} ${y}) rotate(${p * 40}) scale(${s * p})`} d="M0,-30 Q5,-5 30,0 Q5,5 0,30 Q-5,5 -30,0 Q-5,-5 0,-30Z" fill={c} stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
);
const Flower: React.FC<{x: number; y: number; s: number; p: number; c?: string}> = ({x, y, s, p, c = PINK}) => (
  <g transform={`translate(${x} ${y}) rotate(${p * 30}) scale(${s * p})`}>
    {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 22} cy={Math.sin((a * Math.PI) / 180) * 22} r={17} fill={c} stroke="#fff" strokeWidth={3} />)}
    <circle r={13} fill={BUTTER} stroke="#fff" strokeWidth={3} />
  </g>
);
const Cloud: React.FC<{x: number; y: number; s: number; p: number}> = ({x, y, s, p}) => (
  <g transform={`translate(${x} ${y}) scale(${s * p})`}>
    <path d="M-50,18 a22,22 0 0 1 8,-42 a30,30 0 0 1 56,-8 a24,24 0 0 1 36,24 a18,18 0 0 1 -6,26 Z" fill="#fff" stroke={SKY} strokeWidth={5} strokeLinejoin="round" />
  </g>
);
const Smile: React.FC<{x: number; y: number; s: number; p: number}> = ({x, y, s, p}) => (
  <g transform={`translate(${x} ${y}) scale(${s * p})`}>
    <circle r={32} fill={BUTTER} stroke="#fff" strokeWidth={5} />
    <circle cx={-11} cy={-6} r={4} fill={NAVY} /><circle cx={11} cy={-6} r={4} fill={NAVY} />
    <path d="M-12,8 Q0,22 12,8" fill="none" stroke={NAVY} strokeWidth={4} strokeLinecap="round" />
    <circle cx={-20} cy={6} r={5} fill={PINK} opacity={0.8} /><circle cx={20} cy={6} r={5} fill={PINK} opacity={0.8} />
  </g>
);
const Bow: React.FC<{x: number; y: number; s: number; p: number; c?: string}> = ({x, y, s, p, c = CORAL}) => (
  <g transform={`translate(${x} ${y}) scale(${s * p})`}>
    <path d="M0,0 L-38,-22 L-38,22 Z M0,0 L38,-22 L38,22 Z" fill={c} stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
    <circle r={10} fill={c} stroke="#fff" strokeWidth={4} />
  </g>
);
const Washi: React.FC<{x: number; y: number; w: number; r: number; p: number; c?: string}> = ({x, y, w, r, p, c = PEACH}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${p} 1)`} opacity={0.92}>
    <rect x={-w / 2} y={-24} width={w} height={48} fill={c} />
    {Array.from({length: Math.floor(w / 26)}).map((_, i) => <path key={i} d={`M${-w / 2 + i * 26},24 L${-w / 2 + i * 26 + 24},-24`} stroke="#fff" strokeWidth={7} opacity={0.55} />)}
    <path d={`M${-w / 2},-24 l-6,8 l6,8 l-6,8 l6,8 l-6,8 M${w / 2},-24 l6,8 l-6,8 l6,8 l-6,8 l6,8`} fill="none" stroke="none" />
  </g>
);
const Sticky: React.FC<{x: number; y: number; s: number; r: number; p: number; c?: string; lines: string[]; fs?: number}> = ({x, y, s, r, p, c = BUTTER, lines, fs = 36}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${p})`} opacity={Math.min(1, p)}>
    <rect x={-s / 2 + 6} y={-s / 2 + 10} width={s} height={s} fill="rgba(51,71,122,.18)" />
    <path d={`M${-s / 2},${-s / 2} H${s / 2} V${s / 2 - 34} L${s / 2 - 34},${s / 2} H${-s / 2} Z`} fill={c} />
    <path d={`M${s / 2 - 34},${s / 2} L${s / 2},${s / 2 - 34} L${s / 2 - 34},${s / 2 - 34} Z`} fill="rgba(0,0,0,.12)" />
    {lines.map((l, i) => <text key={i} textAnchor="middle" y={-((lines.length - 1) * fs * 0.62) / 2 + i * fs * 0.95 + 10} fontFamily={HAND} fontSize={fs} fill={NAVY}>{l}</text>)}
  </g>
);
const Arrow: React.FC<{d: string; head: [number, number, number, number, number, number]; p: number; c?: string}> = ({d, head, p, c = CORAL}) => (
  <g fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    {p > 0.96 && <path d={`M${head[0]},${head[1]} L${head[2]},${head[3]} L${head[4]},${head[5]}`} />}
  </g>
);
const Underline: React.FC<{x: number; y: number; w: number; p: number; c?: string}> = ({x, y, w, p, c = CORAL}) => (
  <path d={`M${x},${y} q${w * 0.12},-14 ${w * 0.25},0 t${w * 0.25},0 t${w * 0.25},0 t${w * 0.25},0`} fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
);

// polaroid: khung trắng, ô ảnh pastel + cutout ảnh thật (giữ nguyên chai), băng keo 2 góc
const Polaroid: React.FC<{img: string; x: number; y: number; w: number; r: number; p: number; bg: string; note?: string; tape?: string}> = ({img, x, y, w, r, p, bg, note, tape = PEACH}) => {
  const ph = w * 1.12;
  const total = 28 + ph + 96;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r + (1 - p) * -10}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={-w / 2 - 14} y={-total / 2 + 14} width={w + 28} height={total} rx={14} fill="rgba(51,71,122,.2)" />
      <rect x={-w / 2 - 14} y={-total / 2} width={w + 28} height={total} rx={14} fill="#fff" />
      <clipPath id={`pc${img}${Math.round(x)}`}><rect x={-w / 2} y={-total / 2 + 22} width={w} height={ph} rx={10} /></clipPath><rect x={-w / 2} y={-total / 2 + 22} width={w} height={ph} rx={10} fill={bg} />
      <image clipPath={`url(#pc${img}${Math.round(x)})`} href={staticFile(`tap/${img}`)} x={-ph * 0.4 * 1.02} y={-total / 2 + 22 + ph * 0.0} width={ph * 0.8 * 1.02} height={ph * 1.02} />
      {note && <text textAnchor="middle" y={total / 2 - 28} fontFamily={HAND} fontSize={40} fill={NAVY}>{note}</text>}
      <g><Washi x={-w / 2 + 20} y={-total / 2 + 10} w={130} r={-35} p={1} c={tape} /><Washi x={w / 2 - 20} y={-total / 2 + 10} w={130} r={35} p={1} c={tape} /></g>
    </g>
  );
};

const Check: React.FC<{p: number}> = ({p}) => (
  <g>
    <rect x={-26} y={-26} width={52} height={52} rx={14} fill="#fff" stroke={NAVY} strokeWidth={5} />
    <path d="M-13,1 L-3,12 L16,-12" fill="none" stroke={CORAL} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </g>
);

const Tab: React.FC<{text: string; p: number; c: string}> = ({text, p, c}) => (
  <g transform={`translate(${CX - 330} ${300 - (1 - p) * 30}) rotate(-3)`} opacity={Math.min(1, p)}>
    <rect x={-130} y={-30} width={260} height={60} rx={16} fill={c} stroke="#fff" strokeWidth={5} />
    <text textAnchor="middle" y={11} fontFamily={H} fontWeight={800} fontSize={32} fill={NAVY}>{text}</text>
  </g>
);

export const TapScrapbook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const idx = Math.max(0, TS_SC.findIndex((s) => t >= s.s && t < s.e));
  const sc = TS_SC[idx];
  const lt = t - sc.s;
  const dur = sc.e - sc.s;
  const sp = (at: number, damping = 11) => Math.max(0, spring({frame: f - Math.round((sc.s + at) * fps), fps, config: {damping, stiffness: 130}}));
  const draw = (at: number, len = 0.9) => ease(interpolate(lt, [at, at + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const enter = spring({frame: f - Math.round(sc.s * fps), fps, config: {damping: 16, stiffness: 100}});
  const exit = ease(interpolate(lt, [dur - 0.35, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const pageX = (1 - Math.min(1, enter)) * 1100 - (1 - exit) * 1100;
  const zoom = 1 + 0.035 * (lt / dur); // camera zoom nhẹ
  const bob = (i: number) => Math.sin(t * 2.6 + i * 1.7) * 6;
  const capP = Math.min(1, sp(0.3, 15));

  let body: React.ReactNode = null;
  if (sc.id === 'cover') {
    body = (
      <g>
        <Washi x={CX} y={250} w={300} r={-3} p={sp(0.1)} c={PEACH} />
        <g opacity={sp(0.25)} transform={`translate(${CX} 440)`}>
          <text textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={104} fill={NAVY}>Tủ đồ đi học</text>
          <text textAnchor="middle" y={112} fontFamily={H} fontWeight={800} fontSize={92} fill={CORAL}>thơm chưa nè?</text>
        </g>
        <Underline x={CX - 270} y={578} w={540} p={draw(0.9)} c={PINK} />
        <Polaroid img="c1.png" x={CX - 20} y={1010} w={470} r={-4} p={sp(0.6, 10)} bg={SKY} note="Baby · 50ml" tape={MINT} />
        <Sticky x={760} y={800} s={210} r={7} p={sp(1.3)} lines={['TAP', 'Store']} fs={44} />
        <Heart x={160} y={740} s={1.3} p={sp(1.5, 8)} r={-12} />
        <Spark x={820} y={620} s={1.1} p={sp(1.7, 8)} />
        <Flower x={800} y={1230} s={1.2} p={sp(1.9, 8)} />
        <Cloud x={190} y={1230} s={1.2} p={sp(2.1, 12)} />
        <Smile x={150} y={980} s={1.0} p={sp(2.3, 8)} />
      </g>
    );
  } else if (sc.id === 'p1' || sc.id === 'p2') {
    const one = sc.id === 'p1';
    const name = one ? 'Baby' : 'Baby Chuchu';
    body = (
      <g>
        <Tab text={one ? 'Sản phẩm 1' : 'Sản phẩm 2'} p={sp(0.1)} c={one ? LAV : PEACH} />
        <g opacity={sp(0.25)} transform={`translate(${CX} 440)`}>
          <text textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={one ? 128 : 104} fill={CORAL}>{name}</text>
          <text textAnchor="middle" y={64} fontFamily={HAND} fontSize={44} fill={NAVY}>Fabric Perfume · 50ml</text>
        </g>
        <Underline x={CX - (one ? 130 : 230)} y={532} w={one ? 260 : 460} p={draw(0.8)} c={one ? LAV : PEACH} />
        <Polaroid img={one ? 'c1.png' : 'c2.png'} x={CX - 20} y={1030} w={500} r={one ? 3 : -3} p={sp(0.5, 10)} bg={one ? LAV : '#fde2e4'} note={one ? 'Baby' : 'Baby Chuchu'} tape={one ? PINK : MINT} />
        <Sticky x={one ? 730 : 250} y={780} s={230} r={one ? 6 : -6} p={sp(1.4)} lines={one ? ['Mini', '50ml'] : ['Hồng', 'pastel']} fs={46} c={one ? BUTTER : MINT} />
        <Arrow
          d={one ? 'M700,890 C640,960 600,1010 560,1060' : 'M290,890 C340,960 380,1010 420,1060'}
          head={one ? [585, 1030, 560, 1060, 596, 1070] : [395, 1030, 420, 1060, 384, 1070]}
          p={draw(2.0, 0.8)}
        />
        <Heart x={one ? 190 : 800} y={700} s={1.2} p={sp(1.8, 8)} r={-10} c={one ? CORAL : PINK} />
        <Spark x={one ? 810 : 170} y={1330} s={1.1} p={sp(2.1, 8)} />
        <Flower x={one ? 170 : 810} y={1280} s={1.1} p={sp(2.4, 8)} c={one ? LAV : PEACH} />
      </g>
    );
  } else if (sc.id === 'list') {
    const rows = ['Dạng xịt mini 50ml', 'Dành cho đồ vải', 'Có Baby và Baby Chuchu', 'Phân vân? Hỏi TAP Store'];
    body = (
      <g>
        <Washi x={CX} y={250} w={280} r={2} p={sp(0.1)} c={MINT} />
        <g opacity={sp(0.25)} transform={`translate(${CX} 440)`}>
          <text textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={82} fill={NAVY}>Chọn mùi cho</text>
          <text textAnchor="middle" y={94} fontFamily={H} fontWeight={800} fontSize={82} fill={CORAL}>tủ đồ của bạn</text>
        </g>
        {rows.map((r, i) => {
          const p = sp(0.9 + i * 0.7, 12);
          const ck = draw(1.3 + i * 0.7, 0.4);
          return (
            <g key={i} transform={`translate(${CX - 40} ${680 + i * 165 + (1 - p) * 40})`} opacity={Math.min(1, p)}>
              <rect x={-390} y={-62} width={780} height={124} rx={32} fill="#fff" stroke={[SKY, PEACH, LAV, MINT][i]} strokeWidth={8} />
              <g transform="translate(-330 0)"><Check p={ck} /></g>
              <text x={-270} y={16} fontFamily={H} fontWeight={600} fontSize={44} fill={NAVY}>{r}</text>
            </g>
          );
        })}
        <Polaroid img="c1.png" x={250} y={1360} w={190} r={-8} p={sp(3.9, 10)} bg={LAV} />
        <Polaroid img="c2.png" x={720} y={1360} w={190} r={7} p={sp(4.1, 10)} bg="#fde2e4" />
        <Smile x={130} y={560} s={0.9} p={sp(2, 8)} />
        <Spark x={850} y={560} s={1} p={sp(2.3, 8)} />
      </g>
    );
  } else {
    body = (
      <g>
        <Washi x={CX} y={250} w={320} r={-2} p={sp(0.1)} c={PINK} />
        <g opacity={sp(0.25)} transform={`translate(${CX} 440)`}>
          <text textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={132} fill={CORAL}>TAP Store</text>
          <text textAnchor="middle" y={70} fontFamily={HAND} fontSize={48} fill={NAVY}>Fabric Perfume cho đồ vải</text>
        </g>
        <Polaroid img="c1.png" x={300} y={980} w={330} r={-7} p={sp(0.6, 10)} bg={LAV} note="Baby" tape={MINT} />
        <Polaroid img="c2.png" x={660} y={1040} w={330} r={6} p={sp(0.9, 10)} bg="#fde2e4" note="Baby Chuchu" tape={PEACH} />
        <g transform={`translate(${CX} 1330) scale(${sp(1.8, 9)})`}>
          <rect x={-250} y={-50} width={500} height={100} rx={50} fill={CORAL} stroke="#fff" strokeWidth={6} />
          <text textAnchor="middle" y={16} fontFamily={H} fontWeight={800} fontSize={48} fill="#fff">Link ở bio nha</text>
        </g>
        <Heart x={160} y={720} s={1.3} p={sp(1.2, 8)} r={-12} />
        <Heart x={830} y={700} s={1.1} p={sp(1.4, 8)} r={10} c={PINK} />
        <Spark x={820} y={860} s={1} p={sp(1.6, 8)} />
        <Flower x={150} y={1230} s={1.1} p={sp(1.8, 8)} />
        <Bow x={850} y={1260} s={0.9} p={sp(2.0, 8)} />
      </g>
    );
  }

  return (
    <AbsoluteFill style={{background: SKY}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="4" fill="#fff" opacity="0.7" /></pattern>
          <filter id="pgsh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx={0} dy={14} stdDeviation={14} floodColor="#33477a" floodOpacity={0.22} /></filter>
        </defs>
        <rect width={1080} height={1920} fill={SKY} />
        <rect width={1080} height={1920} fill="url(#dots)" transform={`translate(${t * 12} ${t * 8})`} />
        <g transform={`translate(${CX} 880) scale(${zoom}) translate(${-CX} -880) translate(${pageX} 0) rotate(${(1 - Math.min(1, enter)) * 3} ${CX} 880)`}>
          {/* trang sổ tay */}
          <rect x={50} y={190} width={880} height={1340} rx={34} fill="#fffdf7" filter="url(#pgsh)" />
          {Array.from({length: 22}).map((_, i) => <line key={i} x1={110} x2={900} y1={300 + i * 56} y2={300 + i * 56} stroke="#d9e8f5" strokeWidth={3} />)}
          <line x1={150} x2={150} y1={200} y2={1520} stroke="#f7b6c5" strokeWidth={4} opacity={0.8} />
          {Array.from({length: 13}).map((_, i) => (
            <g key={i} transform={`translate(52 ${260 + i * 96})`}>
              <circle r={15} fill={SKY} stroke="#c9d9e8" strokeWidth={3} />
              <path d="M-26,0 H12" stroke="#9aa9c4" strokeWidth={7} strokeLinecap="round" />
            </g>
          ))}
          {/* tab màu mép phải trang */}
          {[PEACH, MINT, LAV, BUTTER].map((c, i) => <rect key={i} x={918} y={420 + i * 120} width={46} height={92} rx={14} fill={c} stroke="#fff" strokeWidth={4} />)}
          <g transform={`translate(0 ${bob(0) * 0.4})`}>{body}</g>
        </g>
        {/* caption */}
        <g transform={`translate(${CX} 1625) scale(${0.9 + 0.1 * capP})`} opacity={capP * exit}>
          <rect x={-370} y={-44} width={740} height={88} rx={44} fill="#fff" stroke={NAVY} strokeWidth={4} />
          <text textAnchor="middle" y={14} fontFamily={H} fontWeight={800} fontSize={sc.cap.length > 28 ? 34 : 42} fill={NAVY}>{sc.cap}</text>
        </g>
        <text x={CX} y={1705} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={22} fill="#5b73a8">TAP Store · Fabric Perfume</text>
      </svg>
    </AbsoluteFill>
  );
};
