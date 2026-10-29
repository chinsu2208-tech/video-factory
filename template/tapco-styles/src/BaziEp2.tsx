import React from 'react';
import {P, CAL, H, HAND, CJK, L, EC, STEM, BR, Page, Wavy, Star, Title} from './BaziHand';
import type {El} from './BaziHand';
import {EpisodeShell, Person, Coin, Tick, Cross, Calendar, Clock, Tag, TT, Card, Pop, Fade, Gauge, A, POP, cl, lerp} from './BaziScript';
import type {SP, Sc} from './BaziScript';
import cap from './ep2Cap.json';

// ====== TẬP 2: SINH 1993 · NĂM 2020 (Quý Dậu × Canh Tý) ======
// Mốc giờ lấy từ ep2Cap.json (tools/align_dp.py). Can chi dùng bảng STEM/BR trong BaziHand. Ví dụ nhật chủ vững/yếu chỉ minh hoạ.
export const EP2_FPS = 30;
export const EP2_TOTAL = 2190;

/* ---------- icon riêng của tập ---------- */
const House: React.FC<{crack?: number}> = ({crack = 0}) => (
  <g>
    <rect x={-90} y={-110} width={180} height={110} fill={P.cream} {...L} />
    <path d="M-110 -110 L0 -190 L110 -110Z" fill={P.coral} {...L} />
    <rect x={-24} y={-70} width={48} height={70} fill={P.blue} {...L} strokeWidth={5} />
    {crack > 0 && <path d="M62 -108 L42 -80 L66 -58 L44 -30 L58 0" fill="none" stroke={P.navy} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${crack} 1`} />}
  </g>
);
const Briefcase: React.FC = () => (
  <g>
    <rect x={-70} y={-70} width={140} height={100} rx={14} fill={P.orange} {...L} />
    <path d="M-26 -70 V-92 H26 V-70" fill="none" {...L} />
    <path d="M-70 -26 H70" stroke={P.navy} strokeWidth={5} />
    <rect x={-12} y={-36} width={24} height={20} rx={4} fill={P.yellow} {...L} strokeWidth={4} />
  </g>
);
const Gear: React.FC<{r?: number; c?: string}> = ({r = 120, c = P.yellow}) => (
  <g>
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={-16} y={-r - 22} width={32} height={44} rx={8} transform={`rotate(${i * 36})`} fill={c} {...L} strokeWidth={5} />)}
    <circle r={r} fill={c} {...L} />
    <circle r={r * 0.42} fill={P.cream} {...L} />
  </g>
);
const Swirl: React.FC<{k: number}> = ({k}) => (
  <path d="M0 0 C22 -34 66 -12 44 32 C22 76 -54 54 -54 0 C-54 -66 32 -88 88 -44" fill="none" stroke={P.coral} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
);

/* thẻ một trụ: thiên can trên, địa chi dưới; hành lấy từ bảng STEM/BR */
const PillarCard: React.FC<{label: string; stem: string; branch: string; w?: number; hiS?: number; hiB?: number}> = ({label, stem, branch, w = 300, hiS = 0, hiB = 0}) => {
  const [sc, se] = STEM[stem] as [string, El];
  const [bc, be] = BR[branch] as [string, El];
  const sq = (yy: number, ch: string, nm: string, el: El, hi: number) => (
    <g>
      <rect x={20} y={yy} width={w - 40} height={200} rx={16} fill={EC[el]} {...L} strokeWidth={5} />
      <text x={w / 2} y={yy + 124} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={124} fill={P.navy}>{ch}</text>
      <text x={w / 2} y={yy + 184} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={36} fill={P.navy}>{nm}</text>
      <text x={w - 34} y={yy + 36} textAnchor="end" fontFamily={HAND} fontSize={28} fill={P.navy} opacity={0.75}>{el}</text>
      {hi > 0 && <rect x={10} y={yy - 10} width={w - 20} height={220} rx={22} fill="none" stroke={P.red} strokeWidth={8} opacity={hi} />}
    </g>
  );
  return (
    <g filter="url(#sh)">
      <rect width={w} height={540} rx={18} fill={P.cream} {...L} />
      <rect x={12} y={12} width={w - 24} height={516} rx={12} fill="#fff" opacity={0.78} />
      <text x={w / 2} y={50} textAnchor="middle" fontFamily={HAND} fontSize={32} fill={P.navy} opacity={0.8}>{label}</text>
      {sq(70, sc, stem, se, hiS)}
      {sq(290, bc, branch, be, hiB)}
    </g>
  );
};

/* ---------- cảnh ---------- */
const S1: React.FC<SP> = ({t}) => {
  const jig = (i: number) => Math.sin((t - 8.6) * 7 + i * 1.7) * A(t, 8.8, 0.5);
  const things: {x: number; y: number; at: number; C: React.ReactNode; r: number}[] = [
    {x: 250, y: 1190, at: 8.7, C: <House />, r: -10}, {x: 440, y: 1150, at: 9.0, C: <Briefcase />, r: 8}, {x: 660, y: 1100, at: 9.3, C: <Coin r={44} />, r: 0}, {x: 880, y: 1150, at: 9.6, C: <g transform="scale(0.7)"><Calendar /></g>, r: 6},
  ];
  return (
    <g>
      <Page tint={P.sky} />
      <Fade o={A(t, 0.1, 0.4)}><Title note="Bát tự · 八字" text="1993 và 2020" y={330} size={130} /></Fade>
      <g filter="url(#wob)">
        <Pop t={t} at={0.11} x={120} y={470} r={-2}>
          <g filter="url(#sh)"><rect width={300} height={340} rx={16} fill={P.blue} {...L} /><rect x={14} y={14} width={272} height={312} rx={10} fill="#fff" opacity={0.78} /></g>
          <text x={150} y={70} textAnchor="middle" fontFamily={HAND} fontSize={34} fill={P.navy} opacity={0.75}>sinh năm</text>
          <text x={150} y={190} textAnchor="middle" fontFamily={CAL} fontSize={104} fill={P.navy}>1993</text>
          <text x={150} y={276} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={46} fill={P.navy}>Quý Dậu</text>
        </Pop>
        <Pop t={t} at={1.91} x={660} y={470} r={2}>
          <g filter="url(#sh)"><rect width={300} height={340} rx={16} fill={P.peach} {...L} /><rect x={14} y={14} width={272} height={312} rx={10} fill="#fff" opacity={0.78} /></g>
          <text x={150} y={70} textAnchor="middle" fontFamily={HAND} fontSize={34} fill={P.navy} opacity={0.75}>năm</text>
          <text x={150} y={190} textAnchor="middle" fontFamily={CAL} fontSize={104} fill={P.navy}>2020</text>
          <text x={150} y={276} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={46} fill={P.navy}>Canh Tý</text>
        </Pop>
        <path d="M430 640 Q540 560 650 640" fill="none" stroke={P.navy} strokeWidth={6} strokeLinecap="round" strokeDasharray="12 12" markerEnd="url(#aN)" opacity={A(t, 3.0, 0.4)} />
        <g opacity={1 - A(t, 8.4, 0.3)}><Pop t={t} at={4.3} x={540} y={960}><TT size={200} fill={P.coral}>?</TT></Pop><Star x={300} y={930} s={A(t, 4.6, 0.4)} /><Star x={780} y={900} s={A(t, 4.8, 0.4)} /></g>
        {things.map((o, i) => (
          <Pop key={i} t={t} at={o.at} x={o.x} y={o.y} r={o.r}><g transform={`rotate(${jig(i) * 14}) translate(${jig(i) * 12} ${jig(i + 3) * 8})`}>{o.C}</g></Pop>
        ))}
        <Pop t={t} at={10.4} x={540} y={1560} s={1.05}><Person c={P.coral} mood="sad" /></Pop>
        <g transform="translate(470 1330) scale(0.8)" opacity={A(t, 10.7, 0.3)}><Swirl k={A(t, 10.7, 1.2)} /></g>
        <Pop t={t} at={12.0} x={810} y={1420} r={3}><Tag w={290} h={66} fill={P.coral}><TT size={36} y={13}>xáo trộn</TT></Tag></Pop>
      </g>
    </g>
  );
};

const S2: React.FC<SP> = ({t}) => {
  const out = 1 - A(t, 15.9, 0.3);
  const rot = (t - 13) * 38;
  return (
    <g>
      <Page tint={P.mint} />
      <Fade o={A(t, 12.7, 0.4)}><Title note="Nhìn từ lá số" text="Cơ chế cụ thể" y={330} size={120} /></Fade>
      <g filter="url(#wob)">
        <g opacity={out}>
          <Pop t={t} at={13.0} x={500} y={900} s={1.6}><g transform={`rotate(${rot})`}><Gear r={110} /></g></Pop>
          <Pop t={t} at={13.5} x={800} y={1170} s={1}><g transform={`rotate(${-rot * 1.4 + 18})`}><Gear r={80} c={P.coral} /></g></Pop>
          <Pop t={t} at={14.0} x={260} y={1240} s={0.7}><g transform={`rotate(${rot * 1.2})`}><Gear r={80} c={P.blue} /></g></Pop>
        </g>
        <g transform={`translate(${390} ${lerp(560, 520, A(t, 16.21, 0.5))})`}>
          <Pop t={t} at={16.21} x={0} y={0}><PillarCard label="Trụ năm" stem="Quý" branch="Dậu" /></Pop>
        </g>
        <Pop t={t} at={17.4} x={540} y={1240} r={-2}><Tag w={560} h={72} fill={P.yellow}><TT size={38} y={14}>sinh 1993 = Quý Dậu</TT></Tag></Pop>
        <rect x={376} y={506} width={328} height={568} rx={26} fill="none" stroke={P.red} strokeWidth={7} strokeDasharray="1700 80" opacity={A(t, 19.2, 0.3)} />
      </g>
    </g>
  );
};

const S3: React.FC<SP> = ({t}) => {
  const lx = lerp(390, 90, A(t, 19.9, 0.7));
  const crack = A(t, 27.85, 0.9), bend = A(t, 28.6, 0.9);
  const shake = Math.sin((t - 27.9) * 30) * 3 * (A(t, 27.85, 0.1) * (1 - A(t, 29.0, 0.4)));
  return (
    <g>
      <Page tint={P.peach} />
      <Fade o={A(t, 20.0, 0.4)}><Title note="Năm 2020" text="Canh Tý" y={330} size={150} /></Fade>
      <g filter="url(#wob)">
        <g transform={`translate(${lx} 470)`}><PillarCard label="Trụ năm · 1993" stem="Quý" branch="Dậu" hiB={A(t, 24.5, 0.3)} /></g>
        <Pop t={t} at={20.55} x={840} y={420} r={2}><rect x={-80} y={-28} width={160} height={56} rx={28} fill={P.navy} /><TT size={36} fill="#fff" y={12}>2020</TT></Pop>
        <g transform="translate(690 470)"><Pop t={t} at={21.6} x={0} y={0}><PillarCard label="Năm 2020" stem="Canh" branch="Tý" hiB={A(t, 23.6, 0.3)} /></Pop></g>
        <path d="M372 860 H708" fill="none" stroke={P.red} strokeWidth={7} strokeLinecap="round" strokeDasharray="14 14" opacity={A(t, 25.4, 0.3)} />
        <Pop t={t} at={25.92} x={540} y={860} r={-6}>
          <circle r={74} fill="#fff" stroke={P.red} strokeWidth={8} />
          <text y={30} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={92} fill={P.red}>破</text>
        </Pop>
        <Pop t={t} at={26.3} x={540} y={1090} r={-2}><Tag w={520} h={70} fill={P.coral}><TT size={36} y={13}>Tý gặp Dậu = “phá”</TT></Tag></Pop>
        <Pop t={t} at={26.9} x={290} y={1360} s={1.2}><g transform={`rotate(${shake} 0 0)`}><House crack={crack} /></g></Pop>
        <Pop t={t} at={27.85} x={290} y={1470} r={-3}><Tag w={300} h={60} fill={P.yellow}><TT size={34} y={12}>lung lay</TT></Tag></Pop>
        <path d="M480 1330 H690 Q790 1330 820 1230" fill="none" stroke={P.red} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${bend} 1`} markerEnd={bend > 0.98 ? 'url(#aR)' : undefined} opacity={bend > 0 ? 1 : 0} />
        <Pop t={t} at={29.17} x={780} y={1450} r={3}><Tag w={310} h={60} fill={P.mint}><TT size={34} y={12}>đổi hướng đi</TT></Tag></Pop>
      </g>
    </g>
  );
};

const Slab: React.FC<{y: number; fill: string; at: number; t: number; label: string; sub?: string; hl?: number; from?: number; children?: React.ReactNode}> = ({y, fill, at, t, label, sub, hl = 0, from = -260, children}) => (
  <g transform={`translate(140 ${y + (1 - POP(t, at, 0.55)) * from})`} opacity={cl((t - at) / 0.15)}>
    <g filter="url(#sh)"><rect width={800} height={150} rx={18} fill={fill} {...L} /><rect x={12} y={12} width={776} height={126} rx={12} fill="#fff" opacity={0.55} /></g>
    <text x={40} y={92} fontFamily={H} fontWeight={800} fontSize={50} fill={P.navy}>{label}</text>
    {sub && <text x={760} y={92} textAnchor="end" fontFamily={CJK} fontWeight={700} fontSize={46} fill={P.navy}>{sub}</text>}
    {hl > 0 && <rect x={-10} y={-10} width={820} height={170} rx={26} fill="none" stroke={P.red} strokeWidth={8} opacity={hl} />}
    {children}
  </g>
);

const S4: React.FC<SP> = ({t}) => {
  const pulse = 0.5 + 0.5 * Math.sin((t - 36.0) * 8);
  return (
    <g>
      <Page tint={P.sky} />
      <Fade o={A(t, 29.95, 0.4)}><Title note="Chỉ là một tầng" text="Lưu niên" y={330} size={150} /></Fade>
      <g filter="url(#wob)">
        <Slab y={1030} fill={P.cream} at={30.3} t={t} label="Lá số gốc" from={200}>
          <g opacity={A(t, 35.3, 0.3)} transform="translate(560 28)"><rect width={220} height={94} rx={22} fill={P.yellow} {...L} strokeWidth={5} /><text x={110} y={42} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={32} fill={P.navy}>Nhật chủ</text><text x={110} y={80} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={32} fill={P.navy}>日主</text></g>
        </Slab>
        <Slab y={660} fill={P.yellow} at={31.3} t={t} label="Lưu niên 2020" hl={A(t, 31.8, 0.3) * (1 - A(t, 33.3, 0.3)) } />
        <Slab y={845} fill={P.mint} at={33.5} t={t} label="Đại vận" sub="大运" hl={A(t, 36.0, 0.2) * (0.4 + 0.6 * pulse)} from={-120} />
        <Pop t={t} at={36.3} x={540} y={1300} r={-2}><Tag w={720} h={72} fill="#fff"><TT size={36} font={HAND} w={400} y={13}>mức ảnh hưởng tuỳ từng người</TT></Tag></Pop>
      </g>
    </g>
  );
};

const S5: React.FC<SP> = ({t}) => {
  const arrows = [0, 1, 2, 3, 4];
  return (
    <g>
      <Page tint={P.peach} />
      <Fade o={A(t, 37.1, 0.4)}><Title note="Cùng một lưu niên" text="Hai cách đón" y={330} size={120} /></Fade>
      <g filter="url(#wob)">
        <Pop t={t} at={37.2} x={540} y={540}><Tag w={440} h={72} fill={P.yellow}><TT size={38} y={14}>Lưu niên 2020</TT></Tag></Pop>
        <g fill="none" stroke={P.navy} strokeWidth={6} strokeLinecap="round" strokeDasharray="12 12" opacity={A(t, 37.6, 0.4)}>
          <path d="M440 585 Q380 650 320 720" markerEnd="url(#aN)" /><path d="M640 585 Q700 650 760 720" markerEnd="url(#aN)" />
        </g>
        <g transform="translate(90 880)"><Gauge t={t} at={39.4} v={0.9} c={P.mint} label="Nhật chủ: vững" /></g>
        <g transform="translate(590 880)"><Gauge t={t} at={42.0} v={0.2} c={P.coral} label="Nhật chủ: yếu" /></g>
        <Pop t={t} at={39.0} x={290} y={1290} s={1.4}><Person c={P.blue} mood="smile" /></Pop>
        <Pop t={t} at={41.6} x={790} y={1290} s={1.4}><Person c={P.coral} mood="sad" /></Pop>
        <Pop t={t} at={39.2} x={290} y={1370}><rect x={-110} y={-28} width={220} height={54} rx={27} fill={P.navy} /><TT size={30} fill="#fff" y={9}>vững</TT></Pop>
        <Pop t={t} at={41.8} x={790} y={1370}><rect x={-110} y={-28} width={220} height={54} rx={27} fill={P.navy} /><TT size={30} fill="#fff" y={9}>yếu</TT></Pop>
        <Pop t={t} at={40.2} x={290} y={1450} r={-2}><Tag w={440} h={62} fill={P.mint}><TT size={32} y={12}>chủ động chuyển hướng</TT></Tag></Pop>
        {arrows.map((i) => {
          const k = A(t, 43.3 + i * 0.18, 0.4);
          return k > 0 ? <path key={i} d={`M${1000 - (1 - k) * 50} ${1020 + i * 70} L${900 - (1 - k) * 50} ${1060 + i * 52}`} stroke={P.red} strokeWidth={7} strokeLinecap="round" markerEnd="url(#aR)" opacity={k} /> : null;
        })}
        <Pop t={t} at={42.9} x={790} y={1450} r={3}><Tag w={300} h={62} fill={P.coral}><TT size={32} y={12}>bị động</TT></Tag></Pop>
        <Pop t={t} at={44.3} x={790} y={1520} r={-2}><Tag w={300} h={56} fill="#fff"><TT size={30} font={HAND} w={400} y={11}>thay đổi dồn dập</TT></Tag></Pop>
      </g>
    </g>
  );
};

const S6: React.FC<SP> = ({t}) => {
  const rows = [{y: 1060, at: 50.16, tk: 50.9, label: 'Công việc', ic: <g transform="translate(0 18) scale(0.6)"><Briefcase /></g>}, {y: 1190, at: 51.19, tk: 51.7, label: 'Nơi ở', ic: <g transform="translate(0 43) scale(0.45)"><House /></g>}, {y: 1320, at: 51.96, tk: 52.8, label: 'Kế hoạch tài chính', ic: <Coin r={34} />}];
  return (
    <g>
      <Page tint={P.mint} />
      <Fade o={A(t, 44.95, 0.4)}><Title note="Cách kiểm tra rất đơn giản" text="Tự kiểm tra" y={330} size={140} /></Fade>
      <g filter="url(#wob)">
        <Pop t={t} at={46.74} x={540} y={760} s={1.5}><Calendar /></Pop>
        <Pop t={t} at={47.7} x={540} y={960}><TT size={96} font={CAL}>2020</TT></Pop>
        {rows.map((r) => (
          <Pop key={r.label} t={t} at={r.at} x={0} y={0}>
            <g filter="url(#sh)"><rect x={140} y={r.y - 50} width={800} height={100} rx={18} fill={P.cream} {...L} /></g>
            <g transform={`translate(215 ${r.y})`}>{r.ic}</g>
            <text x={290} y={r.y + 15} fontFamily={H} fontWeight={800} fontSize={44} fill={P.navy}>{r.label}</text>
            <circle cx={870} cy={r.y} r={32} fill="#fff" {...L} strokeWidth={5} />
            <g transform={`translate(870 ${r.y}) scale(${0.85 * POP(t, r.tk, 0.4)})`}><path d="M-16 0 L-4 14 L18 -14" fill="none" stroke="#2f9e6f" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></g>
          </Pop>
        ))}
        <path d="M540 1385 V1430" stroke={P.red} strokeWidth={7} strokeLinecap="round" markerEnd="url(#aR)" opacity={A(t, 53.2, 0.3)} />
        <Pop t={t} at={53.3} x={540} y={1490} r={-2}><Tag w={700} h={76} fill={P.yellow}><TT size={38} y={14}>đối chiếu nhật chủ <tspan fontFamily={CJK} fontWeight={700}>日主</tspan></TT></Tag></Pop>
      </g>
    </g>
  );
};

const S7: React.FC<SP> = ({t}) => {
  const ext = A(t, 58.5, 1.2);
  const nodes = [{x: 170, lbl: '2020', fill: P.coral, at: 56.2}, {x: 420, lbl: '?', fill: P.cream, at: 58.7}, {x: 670, lbl: '?', fill: P.cream, at: 59.0}, {x: 920, lbl: '?', fill: P.cream, at: 59.3}];
  return (
    <g>
      <Page tint={P.sky} />
      <Fade o={A(t, 55.8, 0.4)}><Title note="Muốn biết đầy đủ" text="Ngày giờ sinh" y={330} size={120} /></Fade>
      <g filter="url(#wob)">
        <Pop t={t} at={56.3} x={300} y={640} r={-3}><Tag w={440} h={66} fill={P.coral}><TT size={34} y={13}>năm 2020 tác động?</TT></Tag></Pop>
        <clipPath id="tl2"><rect x={120} y={850} width={lerp(60, 840, ext)} height={100} /></clipPath>
        <path d="M170 900 H940" stroke={P.navy} strokeWidth={7} strokeLinecap="round" strokeDasharray="14 14" clipPath="url(#tl2)" />
        {nodes.map((n, i) => (
          <Pop key={i} t={t} at={n.at} x={n.x} y={900}><circle r={46} fill={n.fill} {...L} /><TT size={i === 0 ? 34 : 56} y={i === 0 ? 12 : 20} font={i === 0 ? H : CAL}>{n.lbl}</TT></Pop>
        ))}
        <Pop t={t} at={59.2} x={670} y={1010}><TT size={36} font={HAND} w={400}>những năm tới</TT></Pop>
        <Pop t={t} at={59.9} x={150} y={1140} r={-3}><g filter="url(#sh)"><rect width={380} height={250} rx={16} fill={P.sky} {...L} /></g><g transform="translate(190 112) scale(0.9)"><Calendar /></g><g transform="translate(300 250)"></g><TT x={190} y={232} size={42}>Ngày</TT><g transform="translate(330 20)"><Tick /></g></Pop>
        <Pop t={t} at={60.5} x={550} y={1140} r={3}><g filter="url(#sh)"><rect width={380} height={250} rx={16} fill={P.sky} {...L} /></g><g transform="translate(190 112) scale(0.9)"><Clock /></g><TT x={190} y={232} size={42}>Giờ</TT><g transform="translate(330 20)"><Tick /></g></Pop>
        <Pop t={t} at={61.4} x={540} y={1490} s={1}><Tag w={860} h={110}><TT size={50} y={18}>Xem lá số ở link trong bio</TT></Tag></Pop>
      </g>
    </g>
  );
};

const S8: React.FC<SP> = ({t}) => {
  const k1 = A(t, 64.8, 0.9), k2 = A(t, 67.8, 0.9);
  return (
    <g>
      <Page tint={P.peach} />
      <Fade o={A(t, 63.4, 0.4)}><Title note="Trước lập xuân" text="Lưu ý nhỏ" y={330} size={140} /></Fade>
      <g filter="url(#wob)">
        <g opacity={A(t, 64.6, 0.3)}>
          <rect x={90} y={980} width={360 * k1} height={70} rx={20} fill={P.coral} {...L} />
          <rect x={450} y={980} width={540 * k2} height={70} rx={20} fill={P.mint} {...L} />
          <TT x={170} y={1128} size={34} font={HAND} w={400}>tháng 1</TT>
        </g>
        <g opacity={A(t, 66.4, 0.3)}><text x={450} y={1128} textAnchor="middle" fontFamily={HAND} fontSize={34} fill={P.navy}>đầu tháng 2</text></g>
        <g opacity={A(t, 67.6, 0.3)}>
          <path d="M450 1050 V1200" stroke={P.red} strokeWidth={6} strokeDasharray="10 10" strokeLinecap="round" />
          <g filter="url(#sh)" transform="translate(450 1260) rotate(-2)"><rect x={-190} y={-40} width={380} height={80} rx={14} fill={P.yellow} {...L} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={42} fill={P.navy}>Lập xuân <tspan fontFamily={CJK} fontWeight={700}>立春</tspan></text></g>
        </g>
        <g transform="translate(150 520) scale(0.8)"><Pop t={t} at={69.0} x={0} y={0}><PillarCard label="Trước lập xuân" stem="Nhâm" branch="Thân" /></Pop></g>
        <g transform="translate(600 520) scale(0.8)"><Pop t={t} at={71.0} x={0} y={0}><PillarCard label="Sau lập xuân" stem="Quý" branch="Dậu" /></Pop></g>
        <Pop t={t} at={70.5} x={392} y={530}><Tick /></Pop>
        <Pop t={t} at={71.35} x={640} y={1440} r={-2}><Tag w={640} h={80} fill={P.coral}><TT size={40} y={15}>không phải Quý Dậu</TT></Tag></Pop>
        <Pop t={t} at={71.45} x={210} y={1440}><Cross /></Pop>
      </g>
    </g>
  );
};

const SCENES: Sc[] = [
  {s: 0, e: 12.64, C: S1}, {s: 12.64, e: 19.85, C: S2}, {s: 19.85, e: 29.93, C: S3}, {s: 29.93, e: 37.05, C: S4},
  {s: 37.05, e: 44.87, C: S5}, {s: 44.87, e: 55.72, C: S6}, {s: 55.72, e: 63.33, C: S7}, {s: 63.33, e: 73, C: S8},
];

export const BaziEp2: React.FC = () => (
  <EpisodeShell phrases={cap.phrases as {text: string; s: number; e: number}[]} voice="bazi-voice2.mp3" scenes={SCENES} />
);
