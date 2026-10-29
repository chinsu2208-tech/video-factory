import React from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/patrick-hand/latin-400.css';
import '@fontsource/patrick-hand/latin-ext-400.css';
import '@fontsource/patrick-hand/vietnamese-400.css';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/baloo-2/latin-ext-800.css';
import '@fontsource/baloo-2/vietnamese-800.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/vietnamese-600.css';
import '@fontsource/noto-serif-sc/chinese-simplified-700.css';

// ====== LAYOUT 12: BÁT TỰ · VẼ TAY (sổ tay nhiều màu) — font thư pháp MTD Quảng Ninh cho tiêu đề ======
// Font nằm ở public/fonts/QuangNinhThuphap.ttf (không có ký tự ₫ — dùng chữ "đ"/"triệu" khi cần).
export const P = {navy: '#1f2f5c', sky: '#cfe6f7', cream: '#fbf6e9', coral: '#f4907b', peach: '#fbd3bd', mint: '#a9dfc4', yellow: '#fbd35b', orange: '#e8924a', blue: '#8bbdf0', silver: '#dfe6ee', red: '#e2574c'};
export const CAL = '"QuangNinh","Baloo 2",sans-serif';
export const H = '"Baloo 2","Be Vietnam Pro",sans-serif';
export const HAND = '"Patrick Hand","Be Vietnam Pro",sans-serif';
export const CJK = '"Noto Serif SC","Noto Serif CJK SC","Noto Sans CJK SC",serif';
export const L = {stroke: P.navy, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

export type El = 'Mộc' | 'Hỏa' | 'Thổ' | 'Kim' | 'Thủy';
export const EC: Record<El, string> = {Mộc: P.mint, Hỏa: P.coral, Thổ: P.yellow, Kim: P.silver, Thủy: P.blue}; // màu cố định theo hành, không đổi giữa các cảnh
export const EZ: Record<El, string> = {Mộc: '木', Hỏa: '火', Thổ: '土', Kim: '金', Thủy: '水'};
export const STEM: Record<string, [string, El]> = {Giáp: ['甲', 'Mộc'], Ất: ['乙', 'Mộc'], Bính: ['丙', 'Hỏa'], Đinh: ['丁', 'Hỏa'], Mậu: ['戊', 'Thổ'], Kỷ: ['己', 'Thổ'], Canh: ['庚', 'Kim'], Tân: ['辛', 'Kim'], Nhâm: ['壬', 'Thủy'], Quý: ['癸', 'Thủy']};
export const BR: Record<string, [string, El]> = {Tý: ['子', 'Thủy'], Sửu: ['丑', 'Thổ'], Dần: ['寅', 'Mộc'], Mão: ['卯', 'Mộc'], Thìn: ['辰', 'Thổ'], Tỵ: ['巳', 'Hỏa'], Ngọ: ['午', 'Hỏa'], Mùi: ['未', 'Thổ'], Thân: ['申', 'Kim'], Dậu: ['酉', 'Kim'], Tuất: ['戌', 'Thổ'], Hợi: ['亥', 'Thủy']};
const BR_ORDER = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
// DỮ LIỆU MẪU (4 cặp Can–Chi hợp lệ, KHÔNG phải lá số thật). Thứ tự hiển thị: Giờ, Ngày, Tháng, Năm.
const SAMPLE = [{label: 'Giờ', s: 'Canh', b: 'Thân'}, {label: 'Ngày', s: 'Mậu', b: 'Ngọ'}, {label: 'Tháng', s: 'Bính', b: 'Dần'}, {label: 'Năm', s: 'Giáp', b: 'Thìn'}];

export const Defs = () => (
  <defs>
    <filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="5" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="6" /></filter>
    <filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="6" dy="9" stdDeviation="5" floodColor="#1f2f5c" floodOpacity="0.18" /></filter>
    <marker id="aN" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto"><path d="M2 2 L11 7 L2 12" fill="none" stroke={P.navy} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></marker>
    <marker id="aR" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto"><path d="M2 2 L11 7 L2 12" fill="none" stroke={P.red} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></marker>
  </defs>
);
// VÙNG AN TOÀN TIKTOK (1080x1920): thanh tìm kiếm che y<260, caption/tên kênh che y>1700, cột icon phải che x>880 khi y>1090.
// Shell thu nhỏ nội dung cảnh vào khung an toàn; Page dùng context để vẫn phủ kín màn hình.
export const SAFE = {s: 0.88, tx: 20, ty: 115};
export const SafeCtx = React.createContext({s: 1, tx: 0, ty: 0});
export const Page: React.FC<{tint: string}> = ({tint}) => {
  const k = React.useContext(SafeCtx);
  return (
  <g transform={`scale(${1 / k.s}) translate(${-k.tx} ${-k.ty})`}>
    <rect width={1080} height={1920} fill={tint} />
    <g filter="url(#sh)"><rect x={50} y={90} width={980} height={1740} rx={14} fill={P.cream} stroke={P.navy} strokeWidth={5} /></g>
    {Array.from({length: 33}).map((_, i) => <line key={i} x1={70} x2={1010} y1={190 + i * 50} y2={190 + i * 50} stroke="#b9d3ea" strokeWidth={2} />)}
    <line x1={170} x2={170} y1={100} y2={1820} stroke={P.coral} strokeWidth={3} opacity={0.7} />
    {Array.from({length: 14}).map((_, i) => <circle key={i} cx={50} cy={160 + i * 125} r={14} fill={tint} stroke={P.navy} strokeWidth={4} />)}
  </g>
  );
};
export const Wavy: React.FC<{x: number; y: number; w: number; c?: string}> = ({x, y, w, c = P.coral}) => <path d={`M${x} ${y} q${w / 8} -16 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0`} stroke={c} strokeWidth={9} fill="none" strokeLinecap="round" />;
export const Star: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -26 L7 -7 L27 -7 L11 5 L17 25 L0 13 L-17 25 L-11 5 L-27 -7 L-7 -7Z" fill={P.yellow} {...L} strokeWidth={4} />;
const Caption: React.FC<{text: string; y?: number}> = ({text, y = 1650}) => (
  <g transform={`translate(540 ${y})`} filter="url(#sh)"><rect x={-430} y={-60} width={860} height={120} rx={28} fill="#fff" {...L} /><text y={16} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={40} fill={P.navy}>{text}</text></g>
);
export const Foot: React.FC = () => <text x={480} y={1690} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={P.navy} opacity={0.65}>Tham khảo theo mệnh lý truyền thống · không khẳng định vận mệnh</text>;
export const Title: React.FC<{note: string; text: string; y?: number; size?: number}> = ({note, text, y = 380, size = 150}) => (
  <g>
    <text x={230} y={y - size * 0.85} fontFamily={HAND} fontSize={52} fill={P.navy}>{note}</text>
    <text x={230} y={y} fontFamily={CAL} fontSize={size} fill={P.navy}>{text}</text>
    <Wavy x={230} y={y + 34} w={text.length * size * 0.42 + 80} c={P.yellow} />
  </g>
);

/* --- doodle 5 hành (gốc tâm, trong vòng r~80) --- */
export const Doodle: React.FC<{el: El}> = ({el}) => {
  if (el === 'Mộc') return <g><rect x={-12} y={8} width={24} height={52} rx={8} fill={P.peach} {...L} strokeWidth={5} /><circle cx={-24} cy={-8} r={30} fill="#7ec9a3" {...L} strokeWidth={5} /><circle cx={26} cy={-10} r={28} fill="#7ec9a3" {...L} strokeWidth={5} /><circle cx={0} cy={-34} r={30} fill="#8fd5b0" {...L} strokeWidth={5} /></g>;
  if (el === 'Hỏa') return <g><path d="M0 -62 C30 -30 52 -6 40 28 C32 52 -32 52 -40 28 C-50 -4 -14 -26 0 -62Z" fill={P.coral} {...L} strokeWidth={5} /><path d="M0 -6 C16 10 24 24 14 38 C6 48 -8 48 -14 38 C-22 24 -8 8 0 -6Z" fill={P.yellow} {...L} strokeWidth={4} /></g>;
  if (el === 'Thổ') return <g><path d="M-62 46 L-18 -26 L24 46Z" fill={P.orange} {...L} strokeWidth={5} /><path d="M-6 46 L34 -8 L66 46Z" fill={P.yellow} {...L} strokeWidth={5} /><path d="M-34 4 L-18 -26 L-2 0" fill="#fff" {...L} strokeWidth={4} /></g>;
  if (el === 'Kim') return <g><path d="M-62 30 L-40 -26 H40 L62 30Z" fill="#fff" {...L} strokeWidth={5} /><path d="M-42 6 H42" stroke={P.navy} strokeWidth={4} /><path d="M-26 -12 L-16 -12 M12 18 L26 18" stroke="#9fb0cc" strokeWidth={5} strokeLinecap="round" /><path d="M46 -52 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill={P.yellow} stroke={P.navy} strokeWidth={3} strokeLinejoin="round" /></g>;
  return <g><path d="M0 -62 C34 -14 48 6 40 30 C32 54 -32 54 -40 30 C-48 6 -34 -14 0 -62Z" fill="#6aa7e8" {...L} strokeWidth={5} /><path d="M-18 26 C-22 12 -14 2 -6 -6" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" /></g>;
};

/* 1. MỞ ĐẦU */
const Opening = () => (
  <g>
    <Page tint={P.sky} />
    <Title note="Tập 1 · Mệnh lý cơ bản" text="Bát Tự" y={470} size={230} />
      <g filter="url(#wob)">
      <text x={230} y={610} fontFamily={H} fontWeight={800} fontSize={100} fill={P.coral}>là gì?</text>
      <Star x={930} y={300} s={1.3} /><Star x={170} y={1500} s={1} />
      {/* vòng 12 con giáp (địa chi) + âm dương */}
      <circle cx={540} cy={1060} r={330} fill="none" stroke={P.navy} strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" />
      {BR_ORDER.map((n, i) => {
        const a = (i * 30 - 90) * Math.PI / 180, x = 540 + Math.cos(a) * 330, y = 1060 + Math.sin(a) * 330;
        return <g key={n} transform={`translate(${x} ${y})`}><circle r={44} fill={EC[BR[n][1]]} {...L} strokeWidth={5} /><text y={11} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={32} fill={P.navy}>{n}</text></g>;
      })}
      <g transform="translate(540 1060) rotate(-15)">
        <circle r={200} fill="#fff" {...L} />
        <path d="M0 -200 A200 200 0 0 1 0 200 A100 100 0 0 1 0 0 A100 100 0 0 0 0 -200Z" fill={P.navy} />
        <circle cy={-100} r={28} fill="#fff" /><circle cy={100} r={28} fill={P.navy} />
      </g>
      <g transform="translate(880 700) rotate(6)"><rect x={-90} y={-70} width={180} height={140} fill={P.yellow} {...L} /><text y={22} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={96} fill={P.navy}>命</text></g>
    </g>
    <Caption text="Bốn trụ, tám chữ, năm hành" />
    <Foot />
  </g>
);

/* 2. NGŨ HÀNH */
const Five = () => {
  const cx = 540, cy = 960, R = 330, NR = 98;
  const order: El[] = ['Hỏa', 'Thổ', 'Kim', 'Thủy', 'Mộc'];
  const Pt = order.map((_, k) => {const a = (-90 + k * 72) * Math.PI / 180; return {x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R};});
  const sh = (a: {x: number; y: number}, b: {x: number; y: number}, d: number) => {const dx = b.x - a.x, dy = b.y - a.y, Ln = Math.hypot(dx, dy); return {x: a.x + dx / Ln * d, y: a.y + dy / Ln * d};};
  return (
    <g>
      <Page tint={P.mint} />
      <Title note="Ngũ hành · 五行" text="Năm hành" y={330} size={150} />
      <g filter="url(#wob)">
        {order.map((_, i) => {const a = Pt[i], b = Pt[(i + 2) % 5], s = sh(a, b, NR + 8), e = sh(b, a, NR + 14); return <path key={'k' + i} d={`M${s.x} ${s.y} L${e.x} ${e.y}`} stroke={P.red} strokeWidth={5} strokeDasharray="12 12" strokeLinecap="round" markerEnd="url(#aR)" />;})}
        {order.map((_, i) => {
          const a = Pt[i], b = Pt[(i + 1) % 5], s = sh(a, b, NR + 12), e = sh(b, a, NR + 18);
          const mx = (s.x + e.x) / 2, my = (s.y + e.y) / 2, dx = mx - cx, dy = my - cy, Ln = Math.hypot(dx, dy);
          return <path key={'s' + i} d={`M${s.x} ${s.y} Q${mx + dx / Ln * 78} ${my + dy / Ln * 78} ${e.x} ${e.y}`} fill="none" stroke={P.navy} strokeWidth={7} strokeLinecap="round" markerEnd="url(#aN)" />;
        })}
        {order.map((el, i) => (
          <g key={el} transform={`translate(${Pt[i].x} ${Pt[i].y})`}>
            <circle r={NR} fill={EC[el]} {...L} />
            <g transform="scale(0.95) translate(0 4)"><Doodle el={el} /></g>
            <text y={(el === 'Kim' || el === 'Thủy') ? NR + 54 : -(NR + 24)} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={44} fill={P.navy}>{el} <tspan fontFamily={CJK} fontWeight={700} fontSize={38}>{EZ[el]}</tspan></text>
          </g>
        ))}
        <g transform={`translate(${cx} ${cy})`}><circle r={96} fill="#fff" {...L} /><text y={-6} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={44} fill={P.navy}>Ngũ</text><text y={44} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={44} fill={P.navy}>hành</text></g>
        <g transform="translate(200 1480)"><path d="M0 0 H110" stroke={P.navy} strokeWidth={7} strokeLinecap="round" markerEnd="url(#aN)" /><text x={135} y={12} fontFamily={H} fontWeight={600} fontSize={34} fill={P.navy}>Tương sinh</text>
          <path d="M430 0 H540" stroke={P.red} strokeWidth={5} strokeDasharray="12 12" strokeLinecap="round" markerEnd="url(#aR)" /><text x={565} y={12} fontFamily={H} fontWeight={600} fontSize={34} fill={P.navy}>Tương khắc</text></g>
      </g>
      <Caption text="Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim…" y={1660} />
      <Foot />
    </g>
  );
};

/* 3. BỐN TRỤ */
const Pillars = () => {
  const x0 = 80, w = 214, gap = 20;
  return (
    <g>
      <Page tint={P.peach} />
      <Title note="Bốn trụ · 四柱" text="Lá số tám chữ" y={330} size={112} />
      <g filter="url(#wob)">
        {SAMPLE.map((p, i) => {
          const x = x0 + i * (w + gap), day = p.label === 'Ngày';
          const [sc, se] = STEM[p.s], [bc, be] = BR[p.b];
          const note = (y: number, ch: string, name: string, el: El, kind: string, rot: number) => (
            <g transform={`translate(${x} ${y}) rotate(${rot} ${w / 2} 150)`} filter="url(#sh)">
              <rect width={w} height={300} rx={16} fill={EC[el]} {...L} />
              <rect x={14} y={14} width={w - 28} height={272} rx={10} fill="#fff" opacity={0.78} />
              <text x={w / 2} y={52} textAnchor="middle" fontFamily={kind === 'NHẬT CHỦ' ? H : HAND} fontWeight={kind === 'NHẬT CHỦ' ? 800 : 400} fontSize={kind === 'NHẬT CHỦ' ? 30 : 28} fill={kind === 'NHẬT CHỦ' ? P.red : P.navy} opacity={kind === 'NHẬT CHỦ' ? 1 : 0.7}>{kind}</text>
              <text x={w / 2} y={172} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={118} fill={P.navy}>{ch}</text>
              <text x={w / 2} y={236} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={44} fill={P.navy}>{name}</text>
              <text x={w / 2} y={272} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={P.navy}>{el}</text>
            </g>
          );
          return (
            <g key={i}>
              <g transform={`translate(${x} 470) rotate(${i % 2 ? 1.5 : -1.5} ${w / 2} 30)`}><rect width={w} height={60} rx={30} fill={P.navy} /><text x={w / 2} y={44} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={36} fill="#fff">{p.label}</text></g>
              {note(570, sc, p.s, se, day ? 'NHẬT CHỦ' : 'Thiên can', i % 2 ? 1.2 : -1.2)}
              {note(900, bc, p.b, be, 'Địa chi', i % 2 ? -1 : 1)}
              {day && <ellipse cx={x + w / 2} cy={735} rx={w / 2 + 14} ry={176} fill="none" stroke={P.red} strokeWidth={7} strokeDasharray="520 40" />}
                          </g>
          );
        })}
        <g transform="translate(540 1330) rotate(-2)"><rect x={-330} y={-52} width={660} height={104} fill={P.yellow} {...L} /><text y={14} textAnchor="middle" fontFamily={HAND} fontSize={42} fill={P.navy}>Dữ liệu mẫu, không phải lá số thật</text></g>
      </g>
      <Caption text="Mỗi trụ gồm một Can và một Chi" y={1660} />
      <Foot />
    </g>
  );
};

/* 4. BIỂU ĐỒ */
const Chart = () => {
  const els: El[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
  const count: Record<El, number> = {Mộc: 0, Hỏa: 0, Thổ: 0, Kim: 0, Thủy: 0};
  SAMPLE.forEach((p) => {count[STEM[p.s][1]]++; count[BR[p.b][1]]++;});
  const base = 1300, unit = 190, x0 = 190, bw = 118, gap = 36;
  return (
    <g>
      <Page tint={P.sky} />
      <Title note="Phân bố ngũ hành · 五行分布" text="Hành nào thiếu?" y={330} size={104} />
      <g filter="url(#wob)">
        <path d={`M${x0 - 30} 560 V${base} H1010`} fill="none" {...L} />
        {[1, 2, 3].map((g) => <g key={g}><line x1={x0 - 30} x2={1010} y1={base - g * unit} y2={base - g * unit} stroke={P.navy} strokeDasharray="4 16" strokeLinecap="round" opacity={0.35} strokeWidth={3} /><text x={x0 - 46} y={base - g * unit + 12} textAnchor="end" fontFamily={HAND} fontSize={38} fill={P.navy}>{g}</text></g>)}
        {els.map((el, i) => {
          const x = x0 + i * (bw + gap), h = count[el] * unit, z = count[el] === 0;
          return (
            <g key={el}>
              {h > 0 && <><rect x={x} y={base - h} width={bw} height={h} rx={8} fill={EC[el]} {...L} />{[0.3, 0.6, 0.85].map((q) => <line key={q} x1={x + 16} x2={x + 46} y1={base - h * q} y2={base - h * q - 24} stroke={P.navy} strokeWidth={3} opacity={0.3} />)}</>}
              <text x={x + bw / 2} y={base - h - 20} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={50} fill={z ? P.red : P.navy}>{count[el]}</text>
              <g transform={`translate(${x + bw / 2} ${base + 80}) scale(0.5)`}><Doodle el={el} /></g>
              <text x={x + bw / 2} y={base + 150} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={38} fill={P.navy}>{el}</text>
              {z && <circle cx={x + bw / 2} cy={base - 64} r={90} fill="none" stroke={P.red} strokeWidth={7} strokeDasharray="480 40" />}
            </g>
          );
        })}
        <g transform="translate(540 640) rotate(-2)" filter="url(#sh)"><rect x={-450} y={-20} width={520} height={150} fill={P.yellow} {...L} /><text x={-420} y={44} fontFamily={H} fontWeight={800} fontSize={52} fill={P.red}>Thủy: 0</text><text x={-420} y={86} fontFamily={HAND} fontSize={32} fill={P.navy}>Chưa tính Tàng can, chỉ đếm</text><text x={-420} y={120} fontFamily={HAND} fontSize={32} fill={P.navy}>8 chữ hiển lộ.</text></g>
        <text x={540} y={1525} textAnchor="middle" fontFamily={HAND} fontSize={36} fill={P.red}>Dữ liệu mẫu, không phải lá số thật</text>
      </g>
      <Caption text="Đếm 8 chữ, xem hành nào nhiều hay thiếu" y={1660} />
      <Foot />
    </g>
  );
};

export const BaziHand: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender('font'));
  React.useEffect(() => {
    const ff = new FontFace('QuangNinh', `url(${staticFile('fonts/QuangNinhThuphap.ttf')})`);
    ff.load().then((r) => {document.fonts.add(r); return document.fonts.ready;}).then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const Scene = [Opening, Five, Pillars, Chart][Math.min(f, 3)];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><Defs /><Scene /></svg>
    </AbsoluteFill>
  );
};
