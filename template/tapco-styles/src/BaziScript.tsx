import React from 'react';
import {AbsoluteFill, Audio, Easing, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {P, CAL, H, HAND, CJK, L, EC, EZ, Page, Wavy, Star, Title, Foot, Doodle, SAFE, SafeCtx} from './BaziHand';
import type {El} from './BaziHand';
import cap from './baziScriptCap.json';

// ====== LAYOUT 13: BÁT TỰ · VẼ TAY CÓ GIỌNG (kịch bản + mp3 → 9 cảnh, phụ đề chạy theo giọng) ======
// Mốc thời gian: src/baziScriptCap.json (tools/align_dp.py). Dữ liệu trong cảnh là minh hoạ, không phải lá số thật.
export const BZ_FPS = 30;
export const BZ_TOTAL = 2310;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const A = (t: number, at: number, d = 0.4) => Easing.out(Easing.cubic)(cl((t - at) / d));
const POP = (t: number, at: number, d = 0.5) => Easing.out(Easing.back(1.8))(cl((t - at) / d));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const Pop: React.FC<{t: number; at: number; x: number; y: number; r?: number; s?: number; children: React.ReactNode}> = ({t, at, x, y, r = 0, s = 1, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${Math.max(0.0001, s * POP(t, at))})`} opacity={cl((t - at) / 0.15)}>{children}</g>
);
const Fade: React.FC<{o: number; children: React.ReactNode}> = ({o, children}) => <g opacity={o}>{children}</g>;

/* ---------- icon vẽ tay ---------- */
const Person: React.FC<{c?: string; hair?: string; mood?: 'smile' | 'flat' | 'sad'}> = ({c = P.blue, hair = P.navy, mood = 'smile'}) => (
  <g>
    <path d="M-62 0 C-62 -70 -40 -100 0 -100 C40 -100 62 -70 62 0Z" fill={c} {...L} />
    <circle cx={0} cy={-150} r={52} fill={P.peach} {...L} />
    <path d="M-52 -156 C-50 -208 50 -208 52 -156 C30 -178 -30 -178 -52 -156Z" fill={hair} {...L} strokeWidth={4} />
    <circle cx={-18} cy={-146} r={5} fill={P.navy} /><circle cx={18} cy={-146} r={5} fill={P.navy} />
    {mood === 'smile' && <path d="M-15 -126 Q0 -112 15 -126" fill="none" stroke={P.navy} strokeWidth={4} strokeLinecap="round" />}
    {mood === 'flat' && <path d="M-12 -122 H12" fill="none" stroke={P.navy} strokeWidth={4} strokeLinecap="round" />}
    {mood === 'sad' && <g><path d="M-14 -118 Q0 -130 14 -118" fill="none" stroke={P.navy} strokeWidth={4} strokeLinecap="round" /><path d="M44 -150 q6 14 0 22 q-8 -8 0 -22z" fill={P.sky} stroke={P.navy} strokeWidth={3} /></g>}
  </g>
);
const Coin: React.FC<{r?: number}> = ({r = 34}) => (
  <g><circle r={r} fill={P.yellow} {...L} strokeWidth={4} /><circle r={r * 0.6} fill="none" stroke={P.orange} strokeWidth={3} /><path d={`M${-r * 0.35} ${-r * 0.25} q${r * 0.2} ${-r * 0.3} ${r * 0.5} ${-r * 0.3}`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" /></g>
);
const Pile: React.FC<{t: number; at: number; n: number}> = ({t, at, n}) => (
  <g>{Array.from({length: n}).map((_, i) => (
    <g key={i} transform={`translate(${(i % 2 ? 5 : -5)} ${-i * 24 - 12 + (1 - POP(t, at + i * 0.1, 0.4)) * -160}) `} opacity={cl((t - at - i * 0.1) / 0.1)}>
      <rect x={-46} y={-12} width={92} height={26} rx={10} fill={P.yellow} {...L} strokeWidth={4} /><path d="M-30 -2 H30" stroke={P.orange} strokeWidth={3} strokeLinecap="round" />
    </g>
  ))}</g>
);
const Bag: React.FC<{c?: string; hole?: boolean}> = ({c = P.mint, hole = false}) => (
  <g>
    <path d="M-56 0 C-84 -64 -46 -96 -22 -122 L22 -122 C46 -96 84 -64 56 0Z" fill={c} {...L} />
    <path d="M-28 -122 Q0 -146 28 -122" fill="none" {...L} strokeWidth={5} />
    <path d="M-20 -140 L-8 -122 M20 -140 L8 -122" stroke={P.navy} strokeWidth={5} strokeLinecap="round" />
    <g transform="translate(0 -56) scale(0.9)"><Coin r={26} /></g>
    {hole && <ellipse cx={20} cy={-8} rx={16} ry={10} fill={P.navy} />}
  </g>
);
const Shop: React.FC = () => (
  <g>
    <rect x={-100} y={-120} width={200} height={120} fill={P.cream} {...L} />
    <path d="M-112 -120 H112 L96 -176 H-96Z" fill={P.coral} {...L} />
    {[-64, -20, 24, 68].map((x) => <path key={x} d={`M${x} -176 L${x - 8} -120`} stroke={P.navy} strokeWidth={4} />)}
    <rect x={-30} y={-74} width={60} height={74} fill={P.blue} {...L} />
    <rect x={44} y={-92} width={42} height={36} fill="#fff" {...L} strokeWidth={4} />
  </g>
);
const Crown: React.FC = () => <path d="M-50 0 L-58 -56 L-26 -28 L0 -72 L26 -28 L58 -56 L50 0Z" fill={P.yellow} {...L} strokeWidth={5} />;
const Tick: React.FC = () => <g><circle r={34} fill={P.mint} {...L} strokeWidth={5} /><path d="M-16 0 L-4 14 L18 -14" fill="none" stroke={P.navy} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></g>;
const Cross: React.FC = () => <g><circle r={34} fill={P.coral} {...L} strokeWidth={5} /><path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke={P.navy} strokeWidth={8} strokeLinecap="round" /></g>;
const Calendar: React.FC = () => (
  <g>
    <rect x={-90} y={-80} width={180} height={160} rx={14} fill="#fff" {...L} />
    <path d="M-90 -80 H90 V-36 H-90Z" fill={P.coral} {...L} />
    <path d="M-48 -100 V-62 M48 -100 V-62" stroke={P.navy} strokeWidth={9} strokeLinecap="round" />
    {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => <circle key={r * 4 + c} cx={-54 + c * 36} cy={-8 + r * 36} r={7} fill={r === 1 && c === 2 ? P.red : P.navy} opacity={r === 1 && c === 2 ? 1 : 0.4} />))}
  </g>
);
const Clock: React.FC = () => (
  <g><circle r={84} fill="#fff" {...L} />{[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -72 V-58" stroke={P.navy} strokeWidth={6} strokeLinecap="round" />)}<path d="M0 0 V-52" stroke={P.navy} strokeWidth={8} strokeLinecap="round" /><path d="M0 0 L38 20" stroke={P.red} strokeWidth={8} strokeLinecap="round" /><circle r={9} fill={P.navy} /></g>
);
const Tag: React.FC<{w: number; h?: number; fill?: string; children: React.ReactNode; r?: number}> = ({w, h = 76, fill = P.yellow, children, r = 0}) => (
  <g transform={`rotate(${r})`} filter="url(#sh)"><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={fill} {...L} strokeWidth={5} />{children}</g>
);
const TT: React.FC<{y?: number; size?: number; fill?: string; w?: number; children: React.ReactNode; font?: string; x?: number}> = ({y = 14, size = 40, fill = P.navy, w = 800, children, font = H, x = 0}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight={w} fontSize={size} fill={fill}>{children}</text>
);
const Card: React.FC<{x: number; y: number; w: number; h: number; fill: string; label?: string; r?: number; dash?: boolean; children?: React.ReactNode}> = ({x, y, w, h, fill, label, r = 0, dash, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${r} ${w / 2} ${h / 2})`} filter="url(#sh)">
    <rect width={w} height={h} rx={16} fill={fill} {...L} strokeDasharray={dash ? '14 12' : undefined} />
    <rect x={12} y={12} width={w - 24} height={h - 24} rx={10} fill="#fff" opacity={0.78} />
    {label && <text x={w / 2} y={50} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={P.navy} opacity={0.75}>{label}</text>}
    {children}
  </g>
);

/* ---------- cảnh ---------- */
export type SP = {t: number};

const S1: React.FC<SP> = ({t}) => {
  const ys = [{y: '1991', n: 'Tân Mùi', el: 'Kim' as El, at: 0.17, x: 90, r: -3}, {y: '1992', n: 'Nhâm Thân', el: 'Thủy' as El, at: 1.6, x: 420, r: 2}, {y: '1993', n: 'Quý Dậu', el: 'Thủy' as El, at: 3.57, x: 750, r: -2}];
  const piles = [7, 3, 0];
  return (
    <g>
      <Page tint={P.sky} />
      <Fade o={A(t, 0.05, 0.4)}><Title note="Bát tự · 八字" text="Cùng năm sinh" y={330} size={130} /></Fade>
      <g filter="url(#wob)">
        {ys.map((o) => (
          <Pop key={o.y} t={t} at={o.at} x={o.x} y={520} r={o.r}>
            <g filter="url(#sh)"><rect width={240} height={300} rx={16} fill={EC[o.el]} {...L} /><rect x={14} y={14} width={212} height={272} rx={10} fill="#fff" opacity={0.78} /></g>
            <text x={120} y={66} textAnchor="middle" fontFamily={HAND} fontSize={32} fill={P.navy} opacity={0.75}>sinh năm</text>
            <text x={120} y={170} textAnchor="middle" fontFamily={CAL} fontSize={86} fill={P.navy}>{o.y}</text>
            <text x={120} y={240} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={40} fill={P.navy}>{o.n}</text>
          </Pop>
        ))}
        <Pop t={t} at={4.75} x={375} y={690}><TT size={84} fill={P.coral}>=</TT></Pop>
        <Pop t={t} at={5.05} x={705} y={690}><TT size={84} fill={P.coral}>=</TT></Pop>
        {[210, 540, 870].map((x, i) => (
          <g key={x} transform={`translate(${x} 1270)`}>
            <Pile t={t} at={6.9 + i * 0.15} n={piles[i]} />
            {piles[i] === 0 && <g opacity={A(t, 7.6, 0.3)}><ellipse cx={0} cy={-8} rx={56} ry={14} fill="none" stroke={P.navy} strokeWidth={4} strokeDasharray="8 10" /></g>}
          </g>
        ))}
        <Wavy x={90} y={1292} w={900} c={P.navy} />
        <Pop t={t} at={7.9} x={540} y={1000}><TT size={190} fill={P.coral}>?</TT></Pop>
        <Star x={210} y={1020} s={A(t, 8.2, 0.4)} />
      </g>
    </g>
  );
};

const S2: React.FC<SP> = ({t}) => {
  const xs = [210, 540, 870], cs = [P.blue, P.coral, P.mint], yrs = ['1991', '1992', '1993'], at = [9.66, 11.15, 12.88], hs = [330, 190, 70];
  const dim = A(t, 16.03, 0.4);
  const stamp = POP(t, 16.2, 0.6);
  return (
    <g>
      <Page tint={P.peach} />
      <Fade o={1 - A(t, 15.9, 0.3)}><Title note="Cùng năm sinh nhưng…" text="Vì sao khác?" y={330} size={140} /></Fade>
      <Fade o={A(t, 16.1, 0.4)}><Title note="Lý do nằm ở" text="Trụ ngày" y={330} size={150} /></Fade>
      <g filter="url(#wob)">
        <g opacity={1 - 0.5 * dim}>
          {xs.map((x, i) => (
            <g key={x}>
              <Pop t={t} at={at[i]} x={x} y={900} s={1.15}><Person c={cs[i]} mood={i === 2 ? 'sad' : 'smile'} /></Pop>
              <Pop t={t} at={at[i] + 0.1} x={x} y={968}><rect x={-70} y={-30} width={140} height={56} rx={28} fill={P.navy} /><TT size={34} fill="#fff" y={9}>{yrs[i]}</TT></Pop>
            </g>
          ))}
        </g>
        <g opacity={1 - 0.7 * dim}>
          {xs.map((x, i) => {
            const k = A(t, 14.3 + i * 0.3, 0.9), h = hs[i] * k;
            return (
              <g key={x}>
                <rect x={x - 65} y={1480 - h} width={130} height={h} rx={10} fill={P.yellow} {...L} />
                {k > 0.5 && <g transform={`translate(${x} ${1480 - h - 44})`} opacity={cl((k - 0.5) * 3)}><Coin r={30} /></g>}
              </g>
            );
          })}
          <Wavy x={100} y={1494} w={880} c={P.navy} />
          <Fade o={A(t, 14.2, 0.4)}><text x={540} y={1544} textAnchor="middle" fontFamily={HAND} fontSize={36} fill={P.navy}>tài chính mỗi người một khác</text></Fade>
        </g>
        <g transform={`translate(540 ${1230 + (1 - stamp) * 300}) rotate(-3)`} opacity={cl((t - 16.2) / 0.2)}>
          <g filter="url(#sh)"><rect x={-170} y={-210} width={340} height={420} rx={20} fill={P.yellow} {...L} /><rect x={-154} y={-194} width={308} height={388} rx={12} fill="#fff" opacity={0.8} /></g>
          <text y={-130} textAnchor="middle" fontFamily={HAND} fontSize={42} fill={P.navy}>Trụ</text>
          <text y={30} textAnchor="middle" fontFamily={CJK} fontWeight={700} fontSize={190} fill={P.navy}>日</text>
          <text y={140} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={66} fill={P.red}>NGÀY</text>
          <ellipse cx={0} cy={0} rx={196} ry={238} fill="none" stroke={P.red} strokeWidth={7} strokeDasharray="640 50" />
        </g>
      </g>
    </g>
  );
};

const PILLARS = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
const S3: React.FC<SP> = ({t}) => {
  const at = [22.31, 23.01, 23.56, 24.02], hl = A(t, 24.84, 0.4);
  return (
    <g>
      <Page tint={P.mint} />
      <Fade o={A(t, 19.2, 0.4)}><Title note="Lá số bát tự có" text="Bốn trụ" y={330} size={150} /></Fade>
      <g filter="url(#wob)">
        {PILLARS.map((n, i) => {
          const x = 80 + i * 234, op = i === 0 ? 1 : 1 - 0.65 * hl;
          return (
            <Pop key={n} t={t} at={at[i]} x={0} y={0}>
              <g opacity={op}>
                <g transform={`translate(${x} 470) rotate(${i % 2 ? 1.5 : -1.5} 107 30)`}><rect width={214} height={60} rx={30} fill={P.navy} /><TT x={107} y={44} size={36} fill="#fff">{n}</TT></g>
                <Card x={x} y={560} w={214} h={260} fill={P.cream} label="Thiên can" dash><TT x={107} y={190} size={110} fill={P.navy}>?</TT></Card>
                <Card x={x} y={850} w={214} h={260} fill={P.cream} label="Địa chi" dash><TT x={107} y={190} size={110} fill={P.navy}>?</TT></Card>
              </g>
            </Pop>
          );
        })}
        <rect x={68} y={450} width={238} height={680} rx={30} fill="none" stroke={P.red} strokeWidth={7} strokeDasharray="1500 60" opacity={hl} />
        <g transform="translate(540 1500) rotate(-2)" opacity={A(t, 25.0, 0.3)}><Tag w={640} h={64} fill={P.yellow}><TT size={32} font={HAND} w={400} y={11}>Khung minh hoạ, chưa có dữ liệu thật</TT></Tag></g>
        <Pop t={t} at={26.98} x={300} y={1320} s={0.92}>
          <circle r={130} fill="#fff" {...L} />
          <path d="M0 0 L0 -130 A130 130 0 0 1 130 0Z" fill={P.coral} {...L} />
          <path d="M-130 0 H130 M0 -130 V130" stroke={P.navy} strokeWidth={4} strokeDasharray="6 12" />
        </Pop>
        <Pop t={t} at={27.2} x={700} y={1330}><TT size={150} font={CAL} fill={P.navy}>1/4</TT><TT y={70} size={44} font={HAND} w={400}>một phần tư lá số</TT></Pop>
      </g>
    </g>
  );
};

const S4: React.FC<SP> = ({t}) => {
  const colA = [null, null, 'Hỏa', 'Kim'] as (El | null)[], colB = [null, null, 'Thổ', 'Thủy'] as (El | null)[];
  const flip = A(t, 32.5, 0.4);
  const chart = (y0: number, name: string, cols: (El | null)[], at: number) => (
    <Pop t={t} at={at} x={0} y={0}>
      <g transform={`translate(95 ${y0}) rotate(-1.5)`}><rect width={210} height={56} rx={28} fill={P.navy} /><TT x={105} y={40} size={34} fill="#fff">{name}</TT></g>
      {PILLARS.map((n, i) => {
        const x = 95 + i * 224, year = i === 0, el = cols[i];
        const fill = year ? EC['Thủy'] : el && flip > 0.5 ? EC[el] : P.cream;
        return (
          <Card key={n} x={x} y={y0 + 80} w={200} h={330} fill={fill} label={n} dash={!year && !(el && flip > 0.5)}>
            {year ? (
              <g opacity={A(t, 30.0, 0.4)}><TT x={100} y={165} size={104} font={CJK} fill={P.navy} w={700}>壬</TT><TT x={100} y={275} size={104} font={CJK} fill={P.navy} w={700}>申</TT><TT x={100} y={318} size={28} w={800}>Nhâm Thân</TT></g>
            ) : <TT x={100} y={215} size={110} font={CAL} fill={P.navy}>?</TT>}
          </Card>
        );
      })}
    </Pop>
  );
  return (
    <g>
      <Page tint={P.sky} />
      <Fade o={A(t, 28.8, 0.4)}><Title note="Cùng sinh 1992" text="Hai lá số" y={330} size={130} /></Fade>
      <g filter="url(#wob)">
        {chart(480, 'Người A', colA, 28.9)}
        {chart(1010, 'Người B', colB, 29.4)}
        <Pop t={t} at={30.6} x={195} y={948}><circle r={38} fill="#fff" {...L} stroke={P.red} /><TT size={60} fill={P.red} y={20}>=</TT></Pop>
        <Pop t={t} at={32.9} x={643} y={948}><circle r={38} fill="#fff" {...L} stroke={P.red} /><TT size={56} fill={P.red} y={19}>≠</TT></Pop>
      </g>
    </g>
  );
};

const S5: React.FC<SP> = ({t}) => {
  const pulse = 1 + 0.03 * Math.sin((t - 37.4) * 6) * A(t, 37.4, 0.1);
  const arr = A(t, 40.5, 0.5);
  return (
    <g>
      <Page tint={P.peach} />
      <Fade o={A(t, 35.4, 0.4)}><Title note="Nhật chủ · 日主" text="Trụ ngày" y={330} size={150} /></Fade>
      <g filter="url(#wob)">
        {[{n: 'Năm', x: 90, y: 500, at: 40.5}, {n: 'Tháng', x: 790, y: 500, at: 40.8}, {n: 'Giờ', x: 440, y: 1270, at: 41.1}].map((o) => (
          <Pop key={o.n} t={t} at={o.at} x={o.x} y={o.y} s={1}><Card x={0} y={0} w={200} h={170} fill={P.cream} label={o.n} dash><TT x={100} y={140} size={80}>?</TT></Card></Pop>
        ))}
        <g opacity={arr} fill="none" stroke={P.navy} strokeWidth={6} strokeLinecap="round" strokeDasharray="12 12" markerEnd="url(#aN)">
          <path d="M240 690 Q290 790 334 830" markerEnd="url(#aN)" /><path d="M840 690 Q790 790 746 830" markerEnd="url(#aN)" /><path d="M540 1262 L540 1136" markerEnd="url(#aN)" />
        </g>
        <Pop t={t} at={36.2} x={540} y={880} s={pulse}>
          <g filter="url(#sh)"><rect x={-200} y={-240} width={400} height={480} rx={20} fill={P.yellow} {...L} /><rect x={-184} y={-224} width={368} height={448} rx={12} fill="#fff" opacity={0.8} /></g>
          <TT y={-170} size={34} font={HAND} w={400}>Thiên can của ngày</TT>
          <TT y={0} size={134} font={CJK} w={700}>日主</TT>
          <TT y={120} size={64} fill={P.red}>Nhật chủ</TT>
          <Wavy x={-150} y={150} w={300} c={P.yellow} />
        </Pop>
        <Pop t={t} at={39.4} x={880} y={1440} s={1}><Person c={P.blue} /><g transform="translate(0 56)"><rect x={-60} y={-28} width={120} height={52} rx={26} fill={P.red} /><TT size={32} fill="#fff" y={9}>BẠN</TT></g></Pop>
        <path d="M744 1010 Q820 1060 852 1220" fill="none" stroke={P.red} strokeWidth={6} strokeLinecap="round" markerEnd="url(#aR)" opacity={A(t, 39.5, 0.4)} />
        <g transform="translate(270 1200) rotate(-3)" opacity={arr}><Tag w={250} h={60} fill="#fff"><TT size={32} font={HAND} w={400} y={10}>đọc so với nhật chủ</TT></Tag></g>
      </g>
    </g>
  );
};

const Gauge: React.FC<{t: number; at: number; v: number; c: string; label: string}> = ({t, at, v, c, label}) => (
  <g opacity={cl((t - at) / 0.2)}>
    <TT y={-30} size={40} x={200} w={800}>{label}</TT>
    <rect x={0} y={0} width={400} height={50} rx={25} fill="#fff" {...L} />
    <rect x={5} y={5} width={Math.max(0, 390 * v * A(t, at + 0.1, 0.9))} height={40} rx={20} fill={c} />
  </g>
);

const S6: React.FC<SP> = ({t}) => {
  const focus = A(t, 47.6, 0.5);
  return (
    <g>
      <Page tint={P.mint} />
      <Fade o={1 - A(t, 47.4, 0.3)}><Title note="Ví dụ · cùng sinh 1992" text="Hai người" y={330} size={130} /></Fade>
      <Fade o={A(t, 47.6, 0.4)}><Title note="Người 1 · 1992" text="Người thứ nhất" y={330} size={120} /></Fade>
      <g filter="url(#wob)"><g transform="translate(0 120)">
        <Pop t={t} at={44.5} x={300} y={1000} s={1.4}><Person c={P.blue} mood="smile" /></Pop>
        <Pop t={t} at={45.4} x={780} y={1000} s={1.4}><g opacity={1 - focus}><Person c={P.coral} mood="flat" /></g></Pop>
        {[{x: 300, n: 'Người 1', at: 44.8}, {x: 780, n: 'Người 2', at: 45.6}].map((o, i) => (
          <Pop key={o.n} t={t} at={o.at} x={o.x} y={1075}><g opacity={i === 1 ? 1 - focus : 1}><rect x={-125} y={-30} width={250} height={56} rx={28} fill={P.navy} /><TT size={32} fill="#fff" y={9}>{o.n} · 1992</TT></g></Pop>
        ))}
        <g transform="translate(540 700)"><Gauge t={t} at={48.0} v={0.9} c={P.mint} label="Nhật chủ: mạnh" /></g>
        {Array.from({length: 6}).map((_, i) => {
          const k = A(t, 49.5 + i * 0.12, 0.8), x = lerp(900 - i * 40, 330 + (i % 3) * 18, k), y = lerp(780 - i * 8, 930 + Math.floor(i / 3) * 40, k);
          return k > 0 && k < 1 ? <g key={i} transform={`translate(${x} ${y})`}><Coin r={30} /></g> : null;
        })}
        <Pop t={t} at={49.6} x={760} y={910} r={3}><Tag w={250} h={64}><TT size={34} y={12}>tài tinh</TT></Tag></Pop>
        <Pop t={t} at={50.6} x={500} y={1010} s={1.2}><Bag c={P.mint} /></Pop>
        <Pop t={t} at={50.9} x={590} y={940}><Tick /></Pop>
        <Pop t={t} at={51.62} x={300} y={745} s={0.9}><Crown /></Pop>
        <Pop t={t} at={51.7} x={900} y={1010}><Tag w={230} h={60} fill={P.mint}><TT size={32} y={11}>làm chủ</TT></Tag></Pop>
        <Pop t={t} at={52.56} x={780} y={1330} s={1.1}><Shop /></Pop>
        <Pop t={t} at={52.7} x={780} y={1360} r={-3}><Tag w={250} h={60} fill={P.yellow}><TT size={32} y={11}>kinh doanh</TT></Tag></Pop>
      </g></g>
    </g>
  );
};

const S7: React.FC<SP> = ({t}) => {
  const lost = A(t, 57.2, 0.9);
  return (
    <g>
      <Page tint={P.peach} />
      <Fade o={A(t, 53.4, 0.4)}><Title note="Người 2 · 1992" text="Người thứ hai" y={330} size={120} /></Fade>
      <g filter="url(#wob)"><g transform="translate(0 120)">
        <Pop t={t} at={53.4} x={300} y={1000} s={1.4}><Person c={P.coral} mood={t > 55.4 ? 'sad' : 'flat'} /></Pop>
        <Pop t={t} at={53.6} x={300} y={1075}><rect x={-125} y={-30} width={250} height={56} rx={28} fill={P.navy} /><TT size={32} fill="#fff" y={9}>Người 2 · 1992</TT></Pop>
        <g transform="translate(540 700)"><Gauge t={t} at={54.0} v={0.2} c={P.coral} label="Nhật chủ: yếu" /></g>
        <Pop t={t} at={55.4} x={620} y={1060} s={1.3}><Bag c={P.peach} hole /></Pop>
        {Array.from({length: 6}).map((_, i) => {
          const a = 55.6 + i * 0.22, k = A(t, a, 0.6);
          const x = 560 + (i % 3) * 40, y = lerp(760, 980, k);
          const out = lost * (i % 2 ? 1 : 0.8);
          return k > 0 ? <g key={i} transform={`translate(${x + out * 40} ${y + out * 360})`} opacity={1 - out}><Coin r={26} /></g> : null;
        })}
        <Pop t={t} at={56.4} x={880} y={860} r={3}><Tag w={270} h={64}><TT size={34} y={12}>tiền đến</TT></Tag></Pop>
        <Pop t={t} at={57.4} x={880} y={1130} r={-3}><Tag w={270} h={64} fill={P.coral}><TT size={34} y={12}>khó giữ</TT></Tag></Pop>
        {[330, 470, 610].map((x, i) => (
          <Pop key={x} t={t} at={58.4 + i * 0.2} x={x} y={1380} s={0.7}><Person c={[P.blue, P.mint, P.yellow][i]} /></Pop>
        ))}
        <Pop t={t} at={59.2} x={770} y={1330}><Tick /></Pop>
        <Pop t={t} at={59.6} x={930} y={1380} s={0.7}><g opacity={0.45}><Person c={P.silver} mood="flat" /></g></Pop>
        <Pop t={t} at={60.0} x={930} y={1230}><Cross /></Pop>
        <Pop t={t} at={58.7} x={500} y={1190} r={-2}><Tag w={520} h={64} fill="#fff"><TT size={32} font={HAND} w={400} y={11}>có người hỗ trợ hơn là đứng một mình</TT></Tag></Pop>
      </g></g>
    </g>
  );
};

const S8: React.FC<SP> = ({t}) => {
  const els: El[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'], cx = 540, cy = 900, R = 250;
  const ring = t >= 63.2 && t < 65.5 ? Math.floor((t - 63.2) / 0.45) % 5 : -1;
  const tagO = A(t, 63.2, 0.3) * (1 - A(t, 65.3, 0.2));
  return (
    <g>
      <Page tint={P.sky} />
      <Fade o={A(t, 61.1, 0.4)}><Title note="Dụng thần · 用神" text="Dụng thần" y={330} size={150} /></Fade>
      <g filter="url(#wob)">
        <Pop t={t} at={61.6} x={cx} y={cy}><circle r={92} fill="#fff" {...L} /><TT y={-4} size={40}>Lá số</TT><TT y={42} size={40}>của bạn</TT></Pop>
        {els.map((el, i) => {
          const a = (-90 + i * 72) * Math.PI / 180, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          return (
            <Pop key={el} t={t} at={62.0 + i * 0.15} x={x} y={y}>
              <circle r={74} fill={EC[el]} {...L} />
              <g transform="scale(0.6) translate(0 4)"><Doodle el={el} /></g>
              <TT y={ (el === 'Kim' || el === 'Thủy') ? 112 : -90} size={36}>{el} <tspan fontFamily={CJK} fontWeight={700} fontSize={30}>{EZ[el]}</tspan></TT>
              {ring === i && <circle r={92} fill="none" stroke={P.red} strokeWidth={8} strokeDasharray="420 40" />}
            </Pop>
          );
        })}
        <g opacity={tagO} transform={`translate(540 1335) rotate(-2)`}><Tag w={780} h={84}><TT size={42} y={14}>Dụng thần = yếu tố cần bổ trợ</TT></Tag></g>
        {[{x: 240, el: 'Hỏa' as El, c: P.coral}, {x: 540, el: 'Mộc' as El, c: P.mint}, {x: 840, el: 'Thủy' as El, c: P.blue}].map((o, i) => (
          <g key={o.x}>
            <Pop t={t} at={65.6 + i * 0.25} x={o.x} y={1500} s={0.8}><Person c={o.c} /></Pop>
            <Pop t={t} at={66.0 + i * 0.25} x={o.x} y={1295}><circle r={52} fill={EC[o.el]} {...L} /><g transform="scale(0.42)"><Doodle el={o.el} /></g></Pop>
            <Pop t={t} at={67.2 + i * 0.2} x={o.x} y={1552}><TT size={34} fill={P.red}>cách {i + 1}</TT></Pop>
          </g>
        ))}
      </g>
    </g>
  );
};

const S9: React.FC<SP> = ({t}) => {
  const items = [{n: 'Ngày', at: 71.4, Ic: Calendar, x: 70}, {n: 'Giờ', at: 71.9, Ic: Clock, x: 400}, {n: 'Năm', at: 72.9, Ic: null, x: 730}] as const;
  return (
    <g>
      <Page tint={P.mint} />
      <Fade o={A(t, 68.95, 0.4)}><Title note="Muốn biết nhật chủ & dụng thần?" text="Cần đủ ngày giờ" y={330} size={120} /></Fade>
      <g filter="url(#wob)">
        <Pop t={t} at={69.2} x={150} y={570} r={-3}><g filter="url(#sh)"><rect width={380} height={170} rx={16} fill={P.yellow} {...L} /></g><TT x={190} y={98} size={84} font={CJK} w={700}>日主</TT><TT x={190} y={146} size={34} w={800}>Nhật chủ</TT></Pop>
        <Pop t={t} at={69.9} x={550} y={570} r={3}><g filter="url(#sh)"><rect width={380} height={170} rx={16} fill={P.blue} {...L} /></g><TT x={190} y={98} size={84} font={CJK} w={700}>用神</TT><TT x={190} y={146} size={34} w={800}>Dụng thần</TT></Pop>
        {items.map((o) => (
          <Pop key={o.n} t={t} at={o.at} x={o.x} y={840}>
            <g opacity={o.n === 'Năm' ? 1 - 0.55 * A(t, 73.2, 0.3) : 1}>
              <Card x={0} y={0} w={280} h={350} fill={o.n === 'Năm' ? P.cream : P.sky} r={o.n === 'Giờ' ? 1.5 : -1.5}>
                <g transform="translate(140 170)">{o.Ic ? <o.Ic /> : <TT y={34} size={120} font={CAL}>1992</TT>}</g>
                <TT x={140} y={318} size={44}>{o.n}</TT>
              </Card>
              {o.n !== 'Năm' && <g transform={`translate(${o.x < 400 ? 250 : 250} 20)`}><Tick /></g>}
            </g>
          </Pop>
        ))}
        <Pop t={t} at={73.3} x={870} y={1215} r={-6}><Tag w={290} h={64} fill={P.coral}><TT size={34} y={12}>chưa đủ</TT></Tag></Pop>
        <Pop t={t} at={74.1} x={540} y={1340} s={1}><Tag w={880} h={130}><TT size={52} y={20}>Xem lá số ở link trong bio</TT></Tag></Pop>
        <g opacity={A(t, 74.6, 0.3)} transform={`translate(540 ${1445 + 14 * Math.sin((t - 74.6) * 6)})`}>
          <path d="M0 0 V90" stroke={P.red} strokeWidth={14} strokeLinecap="round" /><path d="M-36 56 L0 100 L36 56" fill="none" stroke={P.red} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </g>
  );
};

export type Sc = {s: number; e: number; C: React.FC<SP>};
const SCENES: Sc[] = [
  {s: 0, e: 9.36, C: S1}, {s: 9.36, e: 19.1, C: S2}, {s: 19.1, e: 28.69, C: S3}, {s: 28.69, e: 35.33, C: S4}, {s: 35.33, e: 44.32, C: S5},
  {s: 44.32, e: 53.34, C: S6}, {s: 53.34, e: 61.02, C: S7}, {s: 61.02, e: 68.85, C: S8}, {s: 68.85, e: 77, C: S9},
];

const Caption: React.FC<{t: number; ph: {text: string; s: number; e: number}[]}> = ({t, ph}) => {
  let cur: {text: string; s: number; e: number} | null = null;
  for (const p of ph) if (p.s <= t + 0.03) cur = p;
  if (!cur || t > cur.e + 0.5) return null;
  const k = Easing.out(Easing.cubic)(cl((t - cur.s + 0.03) / 0.14));
  const w = Math.min(800, Math.max(300, cur.text.length * 25 + 90));
  return (
    <g transform={`translate(480 1585) scale(${0.92 + 0.08 * k})`} opacity={k} filter="url(#sh)">
      <rect x={-w / 2} y={-58} width={w} height={116} rx={28} fill="#fff" {...L} />
      <text y={16} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={44} fill={P.navy}>{cur.text}</text>
    </g>
  );
};

export const EpisodeShell: React.FC<{phrases: {text: string; s: number; e: number}[]; voice: string; scenes: Sc[]}> = ({phrases, voice, scenes}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const [handle] = React.useState(() => delayRender('font'));
  React.useEffect(() => {
    const ff = new FontFace('QuangNinh', `url(${staticFile('fonts/QuangNinhThuphap.ttf')})`);
    ff.load().then((r) => {document.fonts.add(r); return document.fonts.ready;}).then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const seed = 3 + (Math.floor(t * 7.5) % 5);
  return (
    <AbsoluteFill style={{background: P.cream}}>
      <Audio src={staticFile(voice)} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed={seed} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="5" /></filter>
          <filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="6" dy="9" stdDeviation="5" floodColor="#1f2f5c" floodOpacity="0.18" /></filter>
          <marker id="aN" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto"><path d="M2 2 L11 7 L2 12" fill="none" stroke={P.navy} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></marker>
          <marker id="aR" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto"><path d="M2 2 L11 7 L2 12" fill="none" stroke={P.red} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></marker>
        </defs>
        {scenes.map((sc, i) => {
          if (t < sc.s - 0.01 || t > sc.e + 0.55) return null;
          const nxt = scenes[i + 1];
          const p = i === 0 ? 1 : Easing.inOut(Easing.cubic)(cl((t - sc.s) / 0.5));
          const q = nxt ? Easing.inOut(Easing.cubic)(cl((t - nxt.s) / 0.5)) : 0;
          const z = 1 + 0.035 * cl((t - sc.s) / (sc.e - sc.s));
          return (
            <g key={i} transform={`translate(${(1 - p) * 1080 - q * 200} 0)`}>
              <g transform={`translate(${SAFE.tx} ${SAFE.ty}) scale(${SAFE.s})`}><SafeCtx.Provider value={SAFE}><g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}><sc.C t={t} /></g></SafeCtx.Provider></g>
              <rect width={1080} height={1920} fill="#1f2f5c" opacity={q * 0.25} />
            </g>
          );
        })}
        <Foot />
        <Caption t={t} ph={phrases} />
      </svg>
    </AbsoluteFill>
  );
};

export const BaziScript: React.FC = () => <EpisodeShell phrases={cap.phrases as {text: string; s: number; e: number}[]} voice="bazi-voice.mp3" scenes={SCENES} />;

export {Person, Coin, Pile, Bag, Shop, Crown, Tick, Cross, Calendar, Clock, Tag, TT, Card, Pop, Fade, Gauge, A, POP, cl, lerp};
