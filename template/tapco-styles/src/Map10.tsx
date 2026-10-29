import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {hs, Mark, Coin, CoinStack, Bag, Box, Phone, Laptop, Magnifier, Gear, Arrow, Dot, Plus, B2} from './HynexSolDemo';

// ====== LAYOUT 10: "BẢN ĐỒ 10 HƯỚNG" (35–40s) — brand Hynex.Solutions ======
export const M_FPS = 30;
export const M_SEC = 40;
const HEAD = '"Plus Jakarta Sans","Be Vietnam Pro",sans-serif';
const BODY = 'Inter,"Be Vietnam Pro",sans-serif';
const MONO = '"IBM Plex Mono",monospace';
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Item = {n: number; at: number; title: string; sub: string; icon: string};
export const items: Item[] = [
  {n: 1, at: 5.0, title: 'Sản phẩm vật lý', sub: 'Hàng thật: làm, nhập, bán', icon: 'bag'},
  {n: 2, at: 7.5, title: 'Sản phẩm số', sub: 'Ebook · template · khoá học', icon: 'doc'},
  {n: 3, at: 10.0, title: 'Bán dịch vụ', sub: 'Bán chuyên môn của bạn', icon: 'service'},
  {n: 4, at: 12.0, title: 'Làm affiliate', sub: 'Giới thiệu, nhận hoa hồng', icon: 'aff'},
  {n: 5, at: 13.5, title: 'Xây kênh nội dung', sub: 'Kiếm tiền từ khán giả', icon: 'channel'},
  {n: 6, at: 16.0, title: 'Phần mềm & công cụ AI', sub: 'Làm công cụ, bán cho người dùng', icon: 'code'},
  {n: 7, at: 18.5, title: 'Tài sản trí tuệ', sub: 'Bản quyền · thương hiệu · nội dung', icon: 'ip'},
  {n: 8, at: 20.5, title: 'Hệ thống tìm khách', sub: 'Tạo khách hàng cho doanh nghiệp', icon: 'funnel'},
  {n: 9, at: 23.0, title: 'Doanh nghiệp dịch vụ', sub: 'Có quy trình, có đội, tự vận hành', icon: 'org'},
  {n: 10, at: 26.5, title: 'Đầu tư & tích luỹ', sub: 'Dùng vốn để tạo thêm tài sản', icon: 'invest'},
];
const blocks = [
  {a: 5, b: 10, tag: 'NHÓM 1 · BÁN SẢN PHẨM', ids: [1, 2]},
  {a: 10, b: 16, tag: 'NHÓM 2 · BÁN NĂNG LỰC', ids: [3, 4, 5]},
  {a: 16, b: 23, tag: 'NHÓM 3 · XÂY HỆ THỐNG', ids: [6, 7, 8]},
  {a: 23, b: 29, tag: 'NHÓM 4 · MỞ RỘNG & TÍCH LŨY', ids: [9, 10]},
];
export const caps: [number, number, string][] = [
  [0, 2.6, 'Muốn kiếm 10 tỷ đầu tiên cùng AI?'],
  [2.6, 5, 'Có ít nhất 10 hướng, nhưng không hướng nào cũng hợp với bạn'],
  [5, 7.5, 'Một là bán sản phẩm vật lý'],
  [7.5, 10, 'Hai là bán sản phẩm số: ebook, template, khoá học'],
  [10, 12, 'Ba là bán dịch vụ'],
  [12, 13.5, 'Bốn là làm affiliate'],
  [13.5, 16, 'Năm là xây kênh nội dung để kiếm tiền từ khán giả'],
  [16, 18.5, 'Sáu là phát triển phần mềm hoặc công cụ AI'],
  [18.5, 20.5, 'Bảy là bán tài sản trí tuệ'],
  [20.5, 23, 'Tám là xây hệ thống tìm khách cho doanh nghiệp'],
  [23, 26.5, 'Chín là xây doanh nghiệp dịch vụ có hệ thống'],
  [26.5, 29, 'Mười là dùng vốn để đầu tư và tích luỹ tài sản'],
  [29, 34, 'AI giúp bạn nghiên cứu thị trường, tạo sản phẩm, tìm khách và tự động hoá công việc'],
  [34, 37, 'Nhưng đừng chọn cả mười. Chọn một hướng phù hợp, tạo ra lợi nhuận rồi mở rộng'],
  [37, 40, 'Đó là bản đồ đầu tiên trên hành trình kiếm 10 tỷ của bạn'],
];
const money = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
const wrapT = (s: string, n: number) => { const o: string[] = []; let c = ''; s.split(' ').forEach((w) => { if ((c + ' ' + w).trim().length > n) { o.push(c.trim()); c = w; } else c += ' ' + w; }); if (c.trim()) o.push(c.trim()); return o; };

/* ---- icon mới (gốc tâm, nửa kích thước ~70) ---- */
const Doc: React.FC = () => (
  <g>
    <rect x={-52} y={-62} width={100} height={128} rx={12} fill={B2} transform="rotate(-8)" />
    <rect x={-46} y={-70} width={100} height={132} rx={12} fill="#fff" stroke={hs.blue} strokeWidth={6} />
    <rect x={-30} y={-52} width={60} height={14} rx={7} fill={hs.blue} />
    {[0, 1, 2].map((i) => <rect key={i} x={-30} y={-22 + i * 24} width={i === 2 ? 36 : 68} height={10} rx={5} fill={hs.tint} />)}
  </g>
);
const Service: React.FC = () => (
  <g>
    <circle cx={-14} cy={-30} r={30} fill={hs.navy} />
    <path d="M-70 62 Q-70 6 -14 6 Q42 6 42 62Z" fill={hs.blue} />
    <g transform="translate(36 -32)"><rect x={-40} y={-30} width={80} height={56} rx={16} fill="#fff" stroke={hs.navy} strokeWidth={5} /><path d="M-18 -2 L-6 10 L18 -18" fill="none" stroke={hs.blue} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></g>
  </g>
);
const Aff: React.FC = () => (
  <g>
    <g transform="rotate(-40)" fill="none" stroke={hs.blue} strokeWidth={14}>
      <rect x={-72} y={-24} width={78} height={48} rx={24} /><rect x={-6} y={-24} width={78} height={48} rx={24} />
    </g>
    <circle cx={44} cy={46} r={32} fill={hs.navy} />
    <text x={44} y={58} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={36} fill="#fff">%</text>
  </g>
);
const Channel: React.FC = () => (
  <g>
    <rect x={-70} y={-48} width={140} height={100} rx={20} fill={hs.navy} />
    <path d="M-14 -22 L28 2 L-14 26Z" fill="#fff" />
    <circle cx={52} cy={-48} r={26} fill={hs.blue} /><path d="M52 -38 C36 -50 40 -62 52 -56 C64 -62 68 -50 52 -38Z" fill="#fff" />
    <rect x={-50} y={66} width={100} height={12} rx={6} fill={hs.blue} />
  </g>
);
const Code: React.FC = () => (
  <g>
    <rect x={-72} y={-56} width={144} height={116} rx={16} fill="#fff" stroke={hs.navy} strokeWidth={6} />
    <rect x={-72} y={-56} width={144} height={30} rx={16} fill={hs.navy} /><rect x={-72} y={-42} width={144} height={16} fill={hs.navy} />
    {[-52, -36, -20].map((x, i) => <circle key={i} cx={x} cy={-41} r={5} fill={i === 2 ? hs.lime : '#fff'} />)}
    <text x={0} y={30} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={56} fill={hs.blue}>{'</>'}</text>
    <path d="M58 -78 l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z" fill={hs.blue} />
  </g>
);
const IP: React.FC = () => (
  <g>
    <circle cx={0} cy={-18} r={46} fill={hs.tint} stroke={hs.blue} strokeWidth={8} />
    <path d="M-16 24 H16 V38 H-16Z" fill={hs.navy} /><rect x={-12} y={42} width={24} height={10} rx={5} fill={hs.navy} />
    <path d="M-14 -4 L0 -30 L14 -4" fill="none" stroke={hs.blue} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={50} cy={46} r={26} fill={hs.navy} /><text x={50} y={57} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={30} fill="#fff">©</text>
  </g>
);
const Funnel: React.FC = () => (
  <g>
    <path d="M-72 -50 H72 L18 18 V66 L-18 50 V18Z" fill={hs.blue} />
    {[-48, -16, 16, 48].map((x, i) => <circle key={i} cx={x} cy={-72 + (i % 2) * 6} r={9} fill={i === 1 ? hs.navy : hs.tint} stroke={hs.navy} strokeWidth={0} />)}
    <circle cx={0} cy={82} r={11} fill={hs.lime} stroke={hs.navy} strokeWidth={4} />
  </g>
);
const Org: React.FC = () => (
  <g>
    <path d="M0 -20 V4 M-52 28 V4 H52 V28" fill="none" stroke={hs.navy} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={-34} y={-62} width={68} height={42} rx={12} fill={hs.blue} />
    {[-52, 0, 52].map((x, i) => <rect key={i} x={x - 26} y={28} width={52} height={40} rx={11} fill={i === 1 ? hs.blue : '#fff'} stroke={hs.navy} strokeWidth={5} />)}
  </g>
);
const Invest: React.FC = () => (
  <g>
    <CoinStack x={-26} y={44} n={3} s={0.62} />
    <Arrow x={26} y={-20} s={0.5} />
  </g>
);
const Chat: React.FC = () => null;
const icons: Record<string, React.ReactNode> = {
  bag: <Bag x={0} y={6} s={0.7} />, doc: <Doc />, service: <Service />, aff: <Aff />, channel: <Channel />,
  code: <Code />, ip: <IP />, funnel: <Funnel />, org: <Org />, invest: <Invest />,
};

const Card: React.FC<{y: number; h: number; it: Item; p: number; dark: boolean; fresh: boolean}> = ({y, h, it, p, dark, fresh}) => {
  const bs = h - 60;
  return (
    <g transform={`translate(${(1 - p) * 420 + 60} ${y})`} opacity={p}>
      <rect width={960} height={h} rx={28} fill={dark ? hs.soft : '#fff'} stroke={fresh ? hs.blue : 'none'} strokeWidth={fresh ? 5 : 0} />
      <g transform="translate(30 30)">
        <rect width={bs} height={bs} rx={34} fill={hs.tint} />
        <g transform={`translate(${bs / 2} ${bs / 2}) scale(${bs / 170})`}>{icons[it.icon]}</g>
      </g>
      <text x={bs + 76} y={h / 2 - 34} fontFamily={MONO} fontWeight={600} fontSize={34} fill={hs.blue}>{String(it.n).padStart(2, '0')}</text>
      <text x={bs + 76} y={h / 2 + 22} fontFamily={HEAD} fontWeight={800} fontSize={h > 350 ? 46 : 44} fill={dark ? '#fff' : hs.navy}>{it.title}</text>
      <text x={bs + 76} y={h / 2 + 72} fontFamily={BODY} fontSize={h > 350 ? 32 : 28} fill={dark ? '#fff' : hs.navy} opacity={0.66}>{it.sub}</text>
    </g>
  );
};

export const Map10: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const sp = (at: number, d = 15) => spring({frame: f - Math.round(at * fps), fps, config: {damping: d, stiffness: 120}});
  const dk = interpolate(t, [15.7, 16.1, 22.7, 23.1, 28.7, 29.1], [0, 1, 1, 0, 0, 1], CL);
  const dark = dk > 0.5;
  const bg = interpolateColors(dk, [0, 1], [hs.paper, hs.navy]);
  const fg = dark ? '#fff' : hs.navy;
  const block = blocks.find((b) => t >= b.a && t < b.b);
  const cap = caps.find(([a, b]) => t >= a && t < b);
  const capP = cap ? sp(cap[0], 18) : 0;
  const stripOn = interpolate(t, [4.8, 5.4], [0, 1], CL) * interpolate(t, [33.8, 34.4], [1, 0], CL) + interpolate(t, [36.6, 37.2], [0, 1], CL) * 0;

  // ---- HOOK 0–5 ----
  const hook = interpolate(t, [4.6, 5.1], [1, 0], CL);
  const counter = interpolate(t, [0.5, 3.0], [0, 1e10], {...CL, easing: Easing.out(Easing.cubic)});
  const O = {x: 540, y: 1340}, R = 420;
  // ---- AI 29–34 ----
  const aiOn = interpolate(t, [29, 29.4], [0, 1], CL) * interpolate(t, [33.7, 34.2], [1, 0], CL);
  const aiItems = [
    {at: 29.6, label: 'Nghiên cứu thị trường', node: <Magnifier x={0} y={0} s={1.2} />},
    {at: 30.8, label: 'Tạo sản phẩm', node: <Box x={0} y={10} s={1.1} dark />},
    {at: 32.0, label: 'Tìm khách hàng', node: <g transform="scale(1.15) translate(0 6)"><Funnel /></g>},
    {at: 33.1, label: 'Tự động hoá công việc', node: <Gear x={0} y={0} r={52} />},
  ];
  // ---- CHỌN 1: 34–37 ----
  const pickOn = interpolate(t, [34, 34.4], [0, 1], CL) * interpolate(t, [36.7, 37.1], [1, 0], CL);
  const dim = interpolate(t, [35.0, 35.6], [1, 0.22], CL);
  // ---- KẾT 37–40 ----
  const endOn = interpolate(t, [37, 37.4], [0, 1], CL);

  return (
    <AbsoluteFill style={{background: bg}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        <defs><filter id="cd" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0c141d" floodOpacity="0.10" /></filter></defs>
        <Mark x={80} y={90} s={0.7} dark={dark} />
        {block && (
          <g transform={`translate(80 ${236 + (1 - sp(block.a)) * -30})`} opacity={sp(block.a)}>
            <rect width={block.tag.length * 19 + 60} height={64} rx={32} fill={dark ? hs.soft : hs.tint} />
            <text x={30} y={43} fontFamily={MONO} fontWeight={600} fontSize={28} fill={hs.blue}>{block.tag}</text>
          </g>
        )}

        {/* HOOK */}
        {hook > 0.01 && (
          <g opacity={hook}>
            <text fontFamily={HEAD} fontWeight={800} fontSize={128} fill={hs.navy}>
              <tspan x={80} y={440}>Kiếm <tspan fill={hs.blue}>10 tỷ</tspan></tspan><tspan x={80} y={575}>đầu tiên cùng AI?</tspan>
            </text>
            <text x={80} y={730} fontFamily={MONO} fontWeight={600} fontSize={70} fill={hs.navy}>{money(counter)}</text>
            <rect x={80} y={760} width={920} height={20} rx={10} fill={hs.tint} /><rect x={80} y={760} width={920 * (counter / 1e10)} height={20} rx={10} fill={hs.blue} />
            {Array.from({length: 10}).map((_, i) => {
              const a = (-72 + i * 16) * Math.PI / 180, x = O.x + Math.sin(a) * R, y = O.y - Math.cos(a) * R;
              const p = sp(2.2 + i * 0.16, 14);
              return (
                <g key={i} opacity={p}>
                  <path d={`M${O.x} ${O.y} L${O.x + (x - O.x) * p} ${O.y + (y - O.y) * p}`} stroke={hs.navy} strokeWidth={5} strokeDasharray="2 16" strokeLinecap="round" opacity={0.5} />
                  <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p})`}><circle r={44} fill="#fff" stroke={hs.blue} strokeWidth={6} /><text y={13} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={36} fill={hs.blue}>{i + 1}</text></g>
                </g>
              );
            })}
            <g transform={`translate(${O.x} ${O.y})`}><circle r={34} fill={hs.navy} /><circle cx={24} cy={24} r={11} fill={hs.lime} stroke={hs.paper} strokeWidth={4} /><text y={80} textAnchor="middle" fontFamily={MONO} fontSize={28} fill={hs.navy} opacity={0.7}>bạn ở đây</text></g>
          </g>
        )}

        {/* NHÓM 1–4: thẻ hướng */}
        {block && (() => {
          const list = items.filter((i) => block.ids.includes(i.n));
          const h = list.length === 2 ? 410 : 300;
          const gap = 36;
          return list.map((it, k) => {
            const p = sp(it.at, 14);
            const fresh = t >= it.at && t < it.at + 1.8;
            return <Card key={it.n} y={400 + k * (h + gap)} h={h} it={it} p={p} dark={dark} fresh={fresh} />;
          });
        })()}

        {/* AI 29–34 */}
        {aiOn > 0.01 && (
          <g opacity={aiOn}>
            <text fontFamily={HEAD} fontWeight={800} fontSize={96} fill="#fff"><tspan x={80} y={380}>AI giúp bạn</tspan><tspan x={80} y={485} fill={hs.blue}>làm gì?</tspan></text>
            {aiItems.map((a, i) => {
              const p = sp(a.at, 14);
              const x = 60 + (i % 2) * 500, y = 560 + Math.floor(i / 2) * 400;
              return (
                <g key={i} transform={`translate(${x} ${y + (1 - p) * 40})`} opacity={p}>
                  <rect width={460} height={360} rx={28} fill={hs.soft} />
                  <rect x={130} y={26} width={200} height={200} rx={44} fill={hs.tint} />
                  <g transform="translate(230 126) scale(0.85)">{a.node}</g>
                  <text x={230} y={296} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={36} fill="#fff">{wrapT(a.label, 18)[0]}</text>
                  {wrapT(a.label, 18)[1] && <text x={230} y={338} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={36} fill="#fff">{wrapT(a.label, 18)[1]}</text>}
                </g>
              );
            })}
            <g transform={`translate(850 440) scale(${0.5 + 0.5 * sp(29.5, 10)})`}>
              <rect x={-96} y={-96} width={192} height={192} rx={48} fill={hs.blue} stroke={hs.navy} strokeWidth={10} />
              <text y={30} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={96} fill="#fff">AI</text>
              <circle cx={84} cy={84} r={16} fill={hs.lime} stroke={hs.navy} strokeWidth={6} />
            </g>
          </g>
        )}

        {/* CHỌN 1 */}
        {pickOn > 0.01 && (
          <g opacity={pickOn}>
            <text fontFamily={HEAD} fontWeight={800} fontSize={104} fill="#fff"><tspan x={80} y={400}>Đừng chọn</tspan><tspan x={80} y={515} fill={hs.blue}>cả mười.</tspan></text>
            {Array.from({length: 10}).map((_, i) => {
              const x = 170 + (i % 5) * 185, y = 760 + Math.floor(i / 5) * 200;
              const chosen = i === 2;
              const o = chosen ? 1 : dim;
              const sc = chosen ? 1 + 0.18 * interpolate(t, [35.0, 35.6], [0, 1], CL) : 1;
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${sc})`} opacity={o}>
                  {chosen && t > 35 && <circle r={72} fill="none" stroke={hs.lime} strokeWidth={8} />}
                  <circle r={60} fill={chosen ? hs.blue : hs.soft} stroke={hs.blue} strokeWidth={5} />
                  <text y={14} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={42} fill="#fff">{i + 1}</text>
                </g>
              );
            })}
            {['1 hướng phù hợp', 'Lợi nhuận', 'Mở rộng'].map((s, i) => {
              const p = sp(35.2 + i * 0.7, 14);
              const w = [380, 250, 220][i], x0 = [80, 80 + 380 + 60, 80 + 380 + 60 + 250 + 60][i];
              return (
                <g key={i} transform={`translate(${x0} ${1130 + (1 - p) * 30})`} opacity={p}>
                  <rect width={w} height={96} rx={48} fill={i === 2 ? hs.lime : hs.soft} stroke={i === 2 ? 'none' : hs.blue} strokeWidth={4} />
                  <text x={w / 2} y={63} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={36} fill={i === 2 ? hs.navy : '#fff'}>{s}</text>
                  {i < 2 && <path d={`M${w + 14} 48 H${w + 46} M${w + 36} 38 L${w + 46} 48 L${w + 36} 58`} fill="none" stroke={hs.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
                </g>
              );
            })}
          </g>
        )}

        {/* KẾT */}
        {endOn > 0.01 && (
          <g opacity={endOn}>
            <Mark x={290} y={500} s={1.4} dark />
            <text textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={112} fill="#fff"><tspan x={540} y={850}>Bản đồ đầu tiên</tspan></text>
            <text x={540} y={980} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={64} fill={hs.blue}>trên hành trình kiếm 10 tỷ</text>
            <g transform={`translate(260 1100) scale(${0.7 + 0.3 * sp(37.6, 12)})`}><rect width={560} height={112} rx={56} fill={hs.lime} /><text x={280} y={73} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={46} fill={hs.navy}>Bắt đầu học ↗</text></g>
          </g>
        )}

        {/* DẢI BẢN ĐỒ 10 NÚT */}
        {stripOn > 0.01 && (
          <g opacity={stripOn}>
            <line x1={100} x2={980} y1={1730} y2={1730} stroke={dark ? '#fff' : hs.navy} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={0.35} />
            {items.map((it, i) => {
              const lit = t >= it.at;
              const pulse = lit && t < it.at + 1.2;
              return (
                <g key={i} transform={`translate(${100 + i * 97.7} 1730)`}>
                  {pulse && <circle r={26 + (t - it.at) * 14} fill="none" stroke={hs.blue} strokeWidth={4} opacity={1 - (t - it.at) / 1.2} />}
                  <circle r={28} fill={lit ? hs.blue : dark ? hs.soft : hs.tint} />
                  <text y={10} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={26} fill={lit ? '#fff' : hs.blue} opacity={lit ? 1 : 0.7}>{it.n}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* PHỤ ĐỀ */}
        {cap && (() => {
          const lines = wrapT(cap[2], 32);
          const ph = 56 + lines.length * 56;
          return (
            <g transform={`translate(540 ${1560 + (1 - capP) * 24})`} opacity={capP}>
              <rect x={-460} y={-ph / 2} width={920} height={ph} rx={ph > 130 ? 44 : 56} fill={dark ? '#fff' : hs.navy} />
              {lines.map((l, i) => <text key={i} y={-ph / 2 + 70 + i * 56 - 14} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={44} fill={dark ? hs.navy : '#fff'}>{l}</text>)}
            </g>
          );
        })()}
        <text x={540} y={1860} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={fg} opacity={0.5}>Nội dung tham khảo · không cam kết thu nhập</text>
      </svg>
    </AbsoluteFill>
  );
};
