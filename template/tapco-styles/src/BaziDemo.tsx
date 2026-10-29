import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '@fontsource/noto-serif/latin-700.css';
import '@fontsource/noto-serif/vietnamese-700.css';
import '@fontsource/noto-serif/latin-800.css';
import '@fontsource/noto-serif/vietnamese-800.css';
import '@fontsource/noto-serif-sc/chinese-simplified-700.css';
import '@fontsource/be-vietnam-pro/latin-500.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import '@fontsource/be-vietnam-pro/latin-700.css';
import '@fontsource/be-vietnam-pro/vietnamese-700.css';

// ====== LAYOUT 11: BÁT TỰ · "Bản thảo cổ × Infographic hiện đại" — ảnh demo tĩnh (mỗi frame = 1 cảnh) ======
// Dữ liệu trụ/Chinese chỉ lấy từ bảng tra bên dưới. KHÔNG tự bịa lá số: lá số thật phải do Sếp cung cấp đã kiểm.
const C = {ivory: '#f4ecd8', paper: '#fbf5e6', ink: '#1c1a17', gold: '#b8923a', red: '#b8372b',
  wood: '#5f8f72', fire: '#d9644a', earth: '#c79a3d', metal: '#a9adb3', water: '#2d3f6b'};
const SERIF = '"Noto Serif","Noto Serif SC","Noto Serif CJK SC",serif';
const CJK = '"Noto Serif SC","Noto Serif CJK SC","Noto Sans CJK SC",serif';
const SANS = '"Be Vietnam Pro",sans-serif';

type El = 'Mộc' | 'Hỏa' | 'Thổ' | 'Kim' | 'Thủy';
const EC: Record<El, string> = {Mộc: C.wood, Hỏa: C.fire, Thổ: C.earth, Kim: C.metal, Thủy: C.water};
const EZ: Record<El, string> = {Mộc: '木', Hỏa: '火', Thổ: '土', Kim: '金', Thủy: '水'};
// bảng tra Thiên can / Địa chi: [chữ Hán, âm Việt, hành]
const STEM: Record<string, [string, El]> = {Giáp: ['甲', 'Mộc'], Ất: ['乙', 'Mộc'], Bính: ['丙', 'Hỏa'], Đinh: ['丁', 'Hỏa'], Mậu: ['戊', 'Thổ'], Kỷ: ['己', 'Thổ'], Canh: ['庚', 'Kim'], Tân: ['辛', 'Kim'], Nhâm: ['壬', 'Thủy'], Quý: ['癸', 'Thủy']};
const BR: Record<string, [string, El]> = {Tý: ['子', 'Thủy'], Sửu: ['丑', 'Thổ'], Dần: ['寅', 'Mộc'], Mão: ['卯', 'Mộc'], Thìn: ['辰', 'Thổ'], Tỵ: ['巳', 'Hỏa'], Ngọ: ['午', 'Hỏa'], Mùi: ['未', 'Thổ'], Thân: ['申', 'Kim'], Dậu: ['酉', 'Kim'], Tuất: ['戌', 'Thổ'], Hợi: ['亥', 'Thủy']};
// DỮ LIỆU MẪU (4 cặp Can–Chi hợp lệ, KHÔNG phải lá số thật). Thứ tự hiển thị: Giờ, Ngày, Tháng, Năm.
const SAMPLE = [{label: 'Giờ', s: 'Canh', b: 'Thân'}, {label: 'Ngày', s: 'Mậu', b: 'Ngọ'}, {label: 'Tháng', s: 'Bính', b: 'Dần'}, {label: 'Năm', s: 'Giáp', b: 'Thìn'}];

const Defs = () => (
  <defs>
    <filter id="fiber" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8 0.04" numOctaves="3" seed="4" />
      <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.15  0 0 0 0.16 0" />
    </filter>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#3b2a10" floodOpacity="0.14" /></filter>
    <marker id="ahG" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1 L10 6 L1 11Z" fill={C.gold} /></marker>
    <marker id="ahR" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1 L10 6 L1 11Z" fill={C.red} /></marker>
    <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.ivory} stopOpacity="0" /><stop offset="1" stopColor={C.ivory} stopOpacity="0.9" /></linearGradient>
  </defs>
);

const Paper: React.FC<{mount?: number}> = ({mount = 1}) => (
  <g>
    <rect width={1080} height={1920} fill={C.ivory} />
    <rect width={1080} height={1920} filter="url(#fiber)" />
    {/* mực loang rất nhẹ */}
    <ellipse cx={930} cy={260} rx={150} ry={90} fill={C.ink} opacity={0.035} filter="url(#blur)" />
    <ellipse cx={120} cy={1400} rx={180} ry={110} fill={C.ink} opacity={0.03} filter="url(#blur)" />
    {/* núi mực tàu phía xa */}
    <g opacity={mount} filter="url(#blur)">
      <path d="M0 1650 L140 1520 L260 1610 L420 1440 L600 1600 L760 1500 L900 1580 L1080 1470 V1920 H0Z" fill={C.ink} opacity={0.07} />
      <path d="M0 1760 L180 1640 L330 1730 L520 1600 L720 1720 L900 1630 L1080 1710 V1920 H0Z" fill={C.ink} opacity={0.1} />
    </g>
    <rect y={1500} width={1080} height={420} fill="url(#mist)" opacity={0.7} />
    {/* viền khung chỉ mảnh */}
    <rect x={36} y={36} width={1008} height={1848} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.7} />
    <rect x={48} y={48} width={984} height={1824} fill="none" stroke={C.ink} strokeWidth={1.5} opacity={0.35} />
  </g>
);

const Seal: React.FC<{x: number; y: number; s?: number; ch: string; rot?: number}> = ({x, y, s = 1, ch, rot = -6}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#rough)">
    <rect x={-60} y={-60} width={120} height={120} rx={10} fill={C.red} />
    <rect x={-50} y={-50} width={100} height={100} rx={6} fill="none" stroke={C.ivory} strokeWidth={4} opacity={0.85} />
    <text y={30} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={84} fill={C.ivory}>{ch}</text>
  </g>
);
const Yin: React.FC<{x: number; y: number; r: number; rot?: number}> = ({x, y, r, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill={C.paper} stroke={C.ink} strokeWidth={5} />
    <path d={`M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${r / 2} ${r / 2} 0 0 1 0 0 A${r / 2} ${r / 2} 0 0 0 0 ${-r}Z`} fill={C.ink} />
    <circle cy={-r / 2} r={r / 7} fill={C.paper} /><circle cy={r / 2} r={r / 7} fill={C.ink} />
  </g>
);
const Caption: React.FC<{text: string; y?: number}> = ({text, y = 1640}) => (
  <g transform={`translate(540 ${y})`} filter="url(#shadow)">
    <rect x={-440} y={-62} width={880} height={124} rx={14} fill={C.paper} stroke={C.gold} strokeWidth={3} />
    <rect x={-428} y={-50} width={856} height={100} rx={8} fill="none" stroke={C.ink} strokeWidth={1.5} opacity={0.4} />
    <text y={16} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={40} fill={C.ink}>{text}</text>
  </g>
);
const Foot: React.FC<{t?: string}> = ({t = 'Nội dung tham khảo theo mệnh lý truyền thống · không khẳng định vận mệnh'}) => (
  <text x={540} y={1830} textAnchor="middle" fontFamily={SANS} fontSize={24} fill={C.ink} opacity={0.55}>{t}</text>
);
const Head: React.FC<{kicker: string; title: string; y?: number}> = ({kicker, title, y = 250}) => (
  <g>
    <text x={540} y={y} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill={C.red} letterSpacing={6}>{kicker}</text>
    <text x={540} y={y + 100} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={84} fill={C.ink}>{title}</text>
    <path d={`M440 ${y + 140} H640`} stroke={C.gold} strokeWidth={4} /><circle cx={540} cy={y + 140} r={7} fill={C.red} />
  </g>
);

/* A. MỞ ĐẦU */
const Opening = () => (
  <g>
    <Paper mount={1.6} />
    <text x={540} y={250} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill={C.red} letterSpacing={8}>TẬP 1 · MỆNH LÝ CƠ BẢN</text>
    <text x={540} y={450} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={170} fill={C.ink}>Bát Tự</text>
    <text x={540} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={68} fill={C.ink}>là gì?</text>
    <path d="M400 610 H680" stroke={C.gold} strokeWidth={4} /><circle cx={540} cy={610} r={8} fill={C.red} />
    {/* vòng tròn vũ trụ */}
    <g>
      <circle cx={540} cy={1010} r={290} fill="none" stroke={C.gold} strokeWidth={3} />
      <circle cx={540} cy={1010} r={262} fill="none" stroke={C.ink} strokeWidth={1.5} opacity={0.5} strokeDasharray="3 10" />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const names = '子丑寅卯辰巳午未申酉戌亥';
        return <text key={i} x={540 + Math.cos(a) * 326} y={1010 + Math.sin(a) * 326 + 14} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={36} fill={C.ink} opacity={0.75}>{names[i]}</text>;
      })}
      <Yin x={540} y={1010} r={190} rot={-20} />
    </g>
    <Seal x={880} y={620} ch="命" s={0.95} />
    <Caption text="Bốn trụ, tám chữ, năm hành" />
    <Foot />
  </g>
);

/* D. NGŨ HÀNH */
const Five = () => {
  const cx = 540, cy = 930, R = 330;
  const order: El[] = ['Hỏa', 'Thổ', 'Kim', 'Thủy', 'Mộc']; // chiều kim đồng hồ = chiều tương sinh
  const P = order.map((_, k) => {const a = (-90 + k * 72) * Math.PI / 180; return {x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R};});
  const NR = 92;
  const shrink = (a: {x: number; y: number}, b: {x: number; y: number}, d: number) => {const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy); return {x: a.x + dx / L * d, y: a.y + dy / L * d};};
  return (
    <g>
      <Paper />
      <Head kicker="NGŨ HÀNH · 五行" title="Năm hành" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray="4 12" opacity={0.7} />
      {/* tương khắc (nét đứt đỏ, bên trong) */}
      {order.map((_, i) => {
        const a = P[i], b = P[(i + 2) % 5];
        const s = shrink(a, b, NR + 6), e = shrink(b, a, NR + 10);
        return <path key={'k' + i} d={`M${s.x} ${s.y} L${e.x} ${e.y}`} stroke={C.red} strokeWidth={3.5} strokeDasharray="10 9" markerEnd="url(#ahR)" opacity={0.85} />;
      })}
      {/* tương sinh (cung vàng, bên ngoài) */}
      {order.map((_, i) => {
        const a = P[i], b = P[(i + 1) % 5];
        const s = shrink(a, b, NR + 10), e = shrink(b, a, NR + 14);
        const mx = (s.x + e.x) / 2, my = (s.y + e.y) / 2;
        const dx = mx - cx, dy = my - cy, L = Math.hypot(dx, dy);
        const qx = mx + dx / L * 70, qy = my + dy / L * 70;
        return <path key={'s' + i} d={`M${s.x} ${s.y} Q${qx} ${qy} ${e.x} ${e.y}`} fill="none" stroke={C.gold} strokeWidth={6} markerEnd="url(#ahG)" />;
      })}
      {order.map((el, i) => (
        <g key={el} transform={`translate(${P[i].x} ${P[i].y})`} filter="url(#shadow)">
          <circle r={NR} fill={EC[el]} stroke={C.ink} strokeWidth={4} />
          <circle r={NR - 12} fill="none" stroke={el === 'Kim' ? C.ink : C.ivory} strokeWidth={2} opacity={0.5} />
          <text y={22} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={84} fill={el === 'Kim' ? C.ink : C.ivory}>{EZ[el]}</text>
          <text y={NR + 52} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={42} fill={C.ink}>{el}</text>
        </g>
      ))}
      <g transform={`translate(${cx} ${cy})`}><Yin x={0} y={0} r={74} rot={20} /></g>
      {/* chú giải */}
      <g transform="translate(150 1420)">
        <path d="M0 0 H110" stroke={C.gold} strokeWidth={6} markerEnd="url(#ahG)" /><text x={135} y={10} fontFamily={SANS} fontWeight={700} fontSize={32} fill={C.ink}>Tương sinh</text>
        <path d="M470 0 H580" stroke={C.red} strokeWidth={3.5} strokeDasharray="10 9" markerEnd="url(#ahR)" /><text x={605} y={10} fontFamily={SANS} fontWeight={700} fontSize={32} fill={C.ink}>Tương khắc</text>
      </g>
      <Caption text="Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim…" y={1620} />
      <Foot />
    </g>
  );
};

/* C. BỐN TRỤ */
const Pillars = () => {
  const x0 = 70, w = 220, gap = 20;
  return (
    <g>
      <Paper />
      <Head kicker="BỐN TRỤ · 四柱" title="Lá số tám chữ" />
      {SAMPLE.map((p, i) => {
        const x = x0 + i * (w + gap), day = p.label === 'Ngày';
        const [sc, se] = STEM[p.s], [bc, be] = BR[p.b];
        const Card = (y: number, ch: string, name: string, el: El, kind: string, ring: boolean) => (
          <g transform={`translate(${x} ${y})`} filter="url(#shadow)">
            <rect width={w} height={300} rx={14} fill={C.paper} stroke={C.ink} strokeWidth={3} />
            <rect width={w} height={16} rx={8} fill={EC[el]} />
            <text x={w / 2} y={44} textAnchor="middle" fontFamily={SANS} fontWeight={500} fontSize={22} fill={C.ink} opacity={0.6}>{kind}</text>
            <text x={w / 2} y={170} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={130} fill={C.ink}>{ch}</text>
            <text x={w / 2} y={226} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={40} fill={C.ink}>{name}</text>
            <g transform={`translate(${w / 2 - 54} 244)`}><rect width={108} height={38} rx={19} fill={EC[el]} /><text x={54} y={27} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={24} fill={el === 'Kim' ? C.ink : C.ivory}>{el}</text></g>
            {ring && <rect x={-8} y={-8} width={w + 16} height={316} rx={20} fill="none" stroke={C.red} strokeWidth={5} />}
          </g>
        );
        return (
          <g key={i}>
            <g transform={`translate(${x} 430)`}><rect width={w} height={56} rx={28} fill={C.ink} /><text x={w / 2} y={38} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={32} fill={C.ivory}>{p.label}</text></g>
            {Card(570, sc, p.s, se, 'THIÊN CAN', day)}
            {Card(890, bc, p.b, be, 'ĐỊA CHI', false)}
            {day && <g transform={`translate(${x + w / 2} 530)`}><rect x={-62} y={-26} width={124} height={44} rx={8} fill={C.red} /><text y={6} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={26} fill={C.ivory}>Nhật chủ</text></g>}
          </g>
        );
      })}
      {(['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'] as El[]).map((el, i) => (
        <g key={el} transform={`translate(${96 + i * 182} 1260)`}><circle r={16} fill={EC[el]} stroke={C.ink} strokeWidth={2} /><text x={28} y={9} fontFamily={SANS} fontWeight={700} fontSize={26} fill={C.ink}>{el}</text></g>
      ))}
      <g transform="translate(540 1350)"><rect x={-390} y={-34} width={780} height={68} rx={34} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="8 8" /><text y={10} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill={C.red}>DỮ LIỆU MẪU · không phải lá số thật</text></g>
      <Caption text="Mỗi trụ gồm một Can và một Chi" y={1640} />
      <Foot />
    </g>
  );
};

/* E. BIỂU ĐỒ NGŨ HÀNH */
const Chart = () => {
  const els: El[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
  const count: Record<El, number> = {Mộc: 0, Hỏa: 0, Thổ: 0, Kim: 0, Thủy: 0};
  SAMPLE.forEach((p) => {count[STEM[p.s][1]]++; count[BR[p.b][1]]++;});
  const base = 1300, unit = 200, x0 = 150, bw = 120, gap = 40;
  return (
    <g>
      <Paper />
      <Head kicker="PHÂN BỐ NGŨ HÀNH · 五行分布" title="Hành nào thiếu?" />
      <path d={`M${x0 - 30} 520 V${base} H1000`} fill="none" stroke={C.ink} strokeWidth={3} />
      {[1, 2, 3].map((g) => (
        <g key={g}><line x1={x0 - 30} x2={1000} y1={base - g * unit * 0.9} y2={base - g * unit * 0.9} stroke={C.gold} strokeDasharray="4 12" opacity={0.7} /><text x={x0 - 44} y={base - g * unit * 0.9 + 10} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={28} fill={C.ink} opacity={0.7}>{g}</text></g>
      ))}
      {els.map((el, i) => {
        const x = x0 + i * (bw + gap), h = count[el] * unit * 0.9;
        return (
          <g key={el}>
            {h > 0 ? <rect x={x} y={base - h} width={bw} height={h} rx={8} fill={EC[el]} stroke={C.ink} strokeWidth={3} /> : <rect x={x} y={base - 8} width={bw} height={8} fill={EC[el]} opacity={0.5} />}
            <text x={x + bw / 2} y={base - h - 20} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={48} fill={count[el] === 0 ? C.red : C.ink}>{count[el]}</text>
            <text x={x + bw / 2} y={base + 70} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={56} fill={C.ink}>{EZ[el]}</text>
            <text x={x + bw / 2} y={base + 118} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={36} fill={C.ink}>{el}</text>
            {count[el] === 0 && <circle cx={x + bw / 2} cy={base - 70} r={92} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="14 8" filter="url(#rough)" />}
          </g>
        );
      })}
      <g transform="translate(560 630)" filter="url(#shadow)">
        <rect width={440} height={150} rx={14} fill={C.paper} stroke={C.red} strokeWidth={3} />
        <text x={30} y={60} fontFamily={SERIF} fontWeight={800} fontSize={38} fill={C.red}>Thủy: 0</text>
        <text x={30} y={104} fontFamily={SANS} fontWeight={500} fontSize={27} fill={C.ink}>Chưa tính Tàng can,</text>
        <text x={30} y={136} fontFamily={SANS} fontWeight={500} fontSize={27} fill={C.ink}>chỉ đếm 8 chữ hiển lộ.</text>
      </g>
      <g transform="translate(540 1495)"><text textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={26} fill={C.red}>DỮ LIỆU MẪU · không phải lá số thật</text></g>
      <Caption text="Đếm 8 chữ, xem hành nào nhiều hay thiếu" y={1640} />
      <Foot />
    </g>
  );
};

export const BaziDemo: React.FC = () => {
  const f = useCurrentFrame();
  const Scene = [Opening, Five, Pillars, Chart][Math.min(f, 3)];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"><Defs /><Scene /></svg>
    </AbsoluteFill>
  );
};
