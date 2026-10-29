import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/baloo-2/latin-ext-800.css';
import '@fontsource/baloo-2/vietnamese-800.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/vietnamese-600.css';

// ====== TEMPLATE: NHÀ GIA NHÂN — nhà isometric 3D phẳng + nhân vật chibi + zoom từng phòng ======
// Muốn tập mới: sửa mảng SCENES (camera nhắm phòng nào, ai nói gì, caption). Vùng an toàn TikTok đã tính sẵn.
const H = '"Baloo 2","Be Vietnam Pro",sans-serif';
const INK = '#2b4a46';
const BG = '#edf4f3';
const S = 80;
const pr = (u: number, v: number, z = 0): [number, number] => [(u - v) * 0.866 * S, (u + v) * 0.5 * S - z];
const pts = (a: [number, number][]) => a.map((p) => p.join(',')).join(' ');
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (x: number) => Math.max(0, Math.min(255, Math.round(x * k)));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
const ease = Easing.inOut(Easing.cubic);

type Room = {id: string; label: string; u: number; v: number; c: string};
const ROOMS: Room[] = [
  {id: 'khach', label: 'PHÒNG KHÁCH', u: 0, v: 0, c: '#f4a89a'},
  {id: 'bep', label: 'BẾP', u: 3, v: 0, c: '#f7e2b0'},
  {id: 'suckhoe', label: 'SỨC KHOẺ', u: 0, v: 3, c: '#c99bd1'},
  {id: 'san', label: 'THƯ GIÃN', u: 3, v: 3, c: '#a8d5a2'},
];

type Who = {id: string; name: string; u: number; v: number; sweater: string; hair: string; kind: 'bun' | 'short' | 'spiky'; glasses?: boolean; coat?: boolean};
const WHO: Who[] = [
  {id: 'hoang', name: 'Quản gia Hoàng', u: 2.0, v: 1.9, sweater: '#7cc29a', hair: '#3a2c28', kind: 'short', glasses: true},
  {id: 'linh', name: 'Chef Linh', u: 5.1, v: 1.5, sweater: '#f2a33a', hair: '#5a3a2a', kind: 'bun'},
  {id: 'tam', name: 'Cô Tâm', u: 1.6, v: 4.7, sweater: '#ffffff', hair: '#2d2a33', kind: 'short', glasses: true, coat: true},
  {id: 'nam', name: 'HLV Nam', u: 3.8, v: 4.2, sweater: '#4fb3b0', hair: '#2d2a33', kind: 'spiky'},
];

// ---------- Kịch bản (sửa chỗ này cho tập mới) ----------
type Sc = {s: number; e: number; who?: string; room?: string; head?: string; sub?: string; card?: string; cap: string; cam: [number, number, number]};
export const GN_SCENES: Sc[] = [
  {s: 0, e: 3.4, head: 'Nhà bạn có ai quan tâm không?', cap: 'Nhà AI nơi có nhiều người quan tâm bạn', cam: [3, 3, 1.0]},
  {s: 3.4, e: 7.4, who: 'linh', room: 'bep', card: 'Tối nay nấu canh bí đỏ nhé, nhẹ bụng dễ ngủ.', cap: 'Bữa ăn có Chef Linh lo', cam: [4.6, 1.8, 1.75]},
  {s: 7.4, e: 11.4, who: 'tam', room: 'suckhoe', card: 'Lúc 10:00 nhớ “Uống đủ 2 lít nước trong ngày” nha.', cap: 'Sức khoẻ có người nhắc', cam: [1.6, 4.4, 1.75]},
  {s: 11.4, e: 15.4, who: 'nam', room: 'san', card: 'Ngồi nhiều rồi, đứng dậy đi bộ 15 phút nha.', cap: 'Mệt thì có HLV kéo ra vận động', cam: [4.1, 4.4, 1.75]},
  {s: 15.4, e: 20, head: 'Nhà Gia Nhân', sub: 'Nhà AI nơi có nhiều người quan tâm bạn', cap: 'Link ở bio nha', cam: [3, 3, 1.0]},
];
export const GN_TOTAL = 20;

const Box: React.FC<{u: number; v: number; w: number; d: number; h: number; c: string; children?: React.ReactNode}> = ({u, v, w, d, h, c, children}) => (
  <g>
    <polygon points={pts([pr(u + w, v, h), pr(u + w, v + d, h), pr(u + w, v + d, 0), pr(u + w, v, 0)])} fill={shade(c, 0.78)} />
    <polygon points={pts([pr(u, v + d, h), pr(u + w, v + d, h), pr(u + w, v + d, 0), pr(u, v + d, 0)])} fill={shade(c, 0.9)} />
    <polygon points={pts([pr(u, v, h), pr(u + w, v, h), pr(u + w, v + d, h), pr(u, v + d, h)])} fill={c} />
    {children}
  </g>
);

const Person: React.FC<{w: Who; t: number; active: boolean; pop: number}> = ({w, t, active, pop}) => {
  const [x, y] = pr(w.u, w.v);
  const bob = Math.sin(t * 3 + w.u * 2) * (active ? 4 : 2);
  const sc = active ? 1 + 0.06 * Math.sin(t * 5) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`} opacity={pop}>
      <ellipse cx={0} cy={2} rx={26} ry={10} fill="rgba(0,0,0,.16)" />
      <g transform={`translate(0 ${-bob})`}>
        <rect x={-13} y={-22} width={10} height={22} rx={4} fill="#3b3a4a" />
        <rect x={3} y={-22} width={10} height={22} rx={4} fill="#3b3a4a" />
        <rect x={-20} y={-66} width={40} height={50} rx={16} fill={w.sweater} stroke={shade(w.sweater, 0.7)} strokeWidth={2} />
        {w.coat && <path d="M0,-64 L0,-18" stroke="#d6dde3" strokeWidth={3} />}
        <rect x={-27} y={-60} width={11} height={30} rx={5} fill={shade(w.sweater, 0.92)} />
        <rect x={16} y={-60} width={11} height={30} rx={5} fill={shade(w.sweater, 0.92)} />
        {w.kind === 'bun' && <circle cx={0} cy={-117} r={12} fill={w.hair} />}
        {w.kind === 'spiky' && <path d="M-22,-92 L-18,-116 L-8,-100 L0,-120 L8,-100 L18,-116 L22,-92 Z" fill={w.hair} />}
        <circle cx={0} cy={-88} r={25} fill={w.hair} />
        <circle cx={0} cy={-83} r={22} fill="#ffd9bd" />
        <path d={`M-23,-88 Q0,-${w.kind === 'spiky' ? 112 : 106} 23,-88 Q10,-98 0,-96 Q-12,-98 -23,-88 Z`} fill={w.hair} />
        <circle cx={-8} cy={-82} r={2.8} fill="#2b2b3a" />
        <circle cx={8} cy={-82} r={2.8} fill="#2b2b3a" />
        {w.glasses && (
          <g fill="none" stroke="#2b2b3a" strokeWidth={2}>
            <circle cx={-8} cy={-82} r={7} />
            <circle cx={8} cy={-82} r={7} />
            <path d="M-1,-82 L1,-82" />
          </g>
        )}
        <circle cx={-14} cy={-75} r={3.5} fill="#ffb6a8" opacity={0.8} />
        <circle cx={14} cy={-75} r={3.5} fill="#ffb6a8" opacity={0.8} />
        <path d="M-5,-72 Q0,-67 5,-72" fill="none" stroke="#b5574a" strokeWidth={2.2} strokeLinecap="round" />
      </g>
    </g>
  );
};

const Floor: React.FC<{r: Room; pop: number}> = ({r, pop}) => {
  const [lx, ly] = pr(r.u + 1.5, r.v + 1.5);
  return (
    <g opacity={pop} transform={`translate(0 ${(1 - pop) * -50})`}>
      <polygon points={pts([pr(r.u, r.v), pr(r.u + 3, r.v), pr(r.u + 3, r.v + 3), pr(r.u, r.v + 3)])} fill={r.c} stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
      {r.id === 'bep' &&
        Array.from({length: 24}).map((_, i) => {
          const [x, y] = pr(r.u + 0.25 + (i % 6) * 0.5, r.v + 0.25 + Math.floor(i / 6) * 0.7);
          return <circle key={i} cx={x} cy={y} r={4} fill={i % 2 ? '#8fc9b4' : '#f0b36a'} opacity={0.8} />;
        })}
      <g transform={`translate(${lx} ${ly + 62})`}>
        <rect x={-62} y={-15} width={124} height={30} rx={15} fill="#fff" opacity={0.92} />
        <text textAnchor="middle" y={7} fontFamily={H} fontWeight={800} fontSize={17} fill={INK} letterSpacing={1}>{r.label}</text>
      </g>
    </g>
  );
};

const Furniture: React.FC<{pop: number}> = ({pop}) => {
  const items: {k: number; n: React.ReactNode}[] = [
    {k: 1, n: <Box u={0.3} v={0.3} w={2.2} d={0.8} h={34} c="#7fb59a" />},
    {k: 4, n: <Box u={1.2} v={2.0} w={0.7} d={0.7} h={16} c="#e6cfa8" />},
    {k: 3.5, n: <Box u={3.2} v={0.2} w={2.6} d={0.6} h={38} c="#f4f1ea"><polygon points={pts([pr(3.6, 0.5, 38), pr(4.2, 0.5, 38), pr(4.2, 0.8, 38), pr(3.6, 0.8, 38)])} fill="#34353f" /></Box>},
    {k: 6.5, n: <g><ellipse cx={pr(4.4, 2.2, 22)[0]} cy={pr(4.4, 2.2, 22)[1]} rx={46} ry={22} fill="#e9d5b0" /><rect x={pr(4.4, 2.2)[0] - 6} y={pr(4.4, 2.2)[1] - 24} width={12} height={24} fill="#b99b6c" /><ellipse cx={pr(4.4, 2.2, 22)[0]} cy={pr(4.4, 2.2, 22)[1]} rx={46} ry={22} fill="#e9d5b0" stroke="#fff" strokeWidth={3} /></g>},
    {k: 3.8, n: <Box u={0.3} v={3.3} w={0.8} d={0.8} h={50} c="#ffffff"><g transform={`translate(${pr(1.1, 3.7, 28)[0]} ${pr(1.1, 3.7, 28)[1]})`}><rect x={-3} y={-12} width={6} height={24} fill="#e5484d" /><rect x={-12} y={-3} width={24} height={6} fill="#e5484d" /></g></Box>},
    {k: 5.2, n: <Box u={1.7} v={3.3} w={1.2} d={0.6} h={26} c="#d9d4e8" />},
    {k: 9, n: (() => { const [x, y] = pr(5.3, 3.7); return <g><ellipse cx={x} cy={y} rx={26} ry={10} fill="rgba(0,0,0,.14)" /><rect x={x - 7} y={y - 52} width={14} height={52} fill="#9a6b45" /><circle cx={x} cy={y - 78} r={40} fill="#4f9d6b" /><circle cx={x - 20} cy={y - 62} r={26} fill="#5fb07a" /><circle cx={x + 20} cy={y - 64} r={24} fill="#468e60" /></g>; })()},
    {k: 9.4, n: <g><ellipse cx={pr(4.3, 5.0, 20)[0]} cy={pr(4.3, 5.0, 20)[1]} rx={42} ry={20} fill="#efe3c8" stroke="#fff" strokeWidth={3} /><rect x={pr(4.3, 5.0)[0] - 5} y={pr(4.3, 5.0)[1] - 20} width={10} height={20} fill="#b99b6c" /></g>},
  ];
  return <g opacity={pop}>{items.map((it, i) => <g key={i}>{it.n}</g>)}</g>;
};

const Bubble: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => (
  <g transform={`translate(${x} ${y - 150 - Math.sin(p * 9) * 3}) scale(${Math.min(1, p)})`}>
    <rect x={-28} y={-24} width={56} height={44} rx={16} fill="#fff" stroke={INK} strokeWidth={3} />
    <path d="M-6,20 L0,32 L8,20 Z" fill="#fff" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-8} y={-16} width={4} height={18} rx={2} fill={INK} />
    <circle cx={-6} cy={9} r={2.6} fill={INK} />
    <circle cx={10} cy={-4} r={4} fill="#e5484d" />
  </g>
);

export const NhaGiaNhan: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const idx = GN_SCENES.findIndex((s) => t >= s.s && t < s.e);
  const sc = GN_SCENES[idx < 0 ? GN_SCENES.length - 1 : idx];

  // camera: nội suy giữa các keyframe (đến nơi sau 1s kể từ đầu cảnh)
  const camAt = (): [number, number, number] => {
    const i = GN_SCENES.indexOf(sc);
    const prev = GN_SCENES[Math.max(0, i - 1)].cam;
    const k = ease(interpolate(t - sc.s, [0, 1.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    return [0, 1, 2].map((j) => prev[j] + (sc.cam[j] - prev[j]) * k) as [number, number, number];
  };
  const [cu, cv, cz] = camAt();
  const [cx, cy] = pr(cu, cv);
  const drift = Math.sin(t * 0.5) * 6;

  const pop = (i: number) => spring({frame: f - Math.round((0.1 + i * 0.22) * fps), fps, config: {damping: 14, stiffness: 120}});
  const inScene = (s: Sc) => interpolate(t - s.s, [0.5, 1.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cardP = sc.card ? spring({frame: f - Math.round((sc.s + 1.0) * fps), fps, config: {damping: 13}}) : 0;
  const capP = spring({frame: f - Math.round((sc.s + 0.2) * fps), fps, config: {damping: 15}});

  // thứ tự vẽ: người xếp theo u+v
  const people = [...WHO].sort((a, b) => a.u + a.v - (b.u + b.v));
  const roomOfActive = ROOMS.find((r) => r.id === sc.room);

  return (
    <AbsoluteFill style={{background: BG}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="gnbg" cx="50%" cy="38%" r="70%">
            <stop offset="0" stopColor="#f7fbfa" />
            <stop offset="1" stopColor="#dbe9e7" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#gnbg)" />
        {/* mây nền */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={(160 + i * 380 + t * 14) % 1300 - 100} cy={420 + i * 90} rx={90} ry={26} fill="#fff" opacity={0.55} />
        ))}

        {/* ===== thế giới (camera) ===== */}
        <g transform={`translate(490 ${790 + drift}) scale(${cz}) translate(${-cx} ${-cy})`}>
          {/* tường sau */}
          <g opacity={pop(0)}>
            <polygon points={pts([pr(0, 0, 0), pr(0, 6, 0), pr(0, 6, 78), pr(0, 0, 78)])} fill="#e9dfcb" />
            <polygon points={pts([pr(0, 0, 0), pr(6, 0, 0), pr(6, 0, 78), pr(0, 0, 78)])} fill="#f4ecdc" />
            <polygon points={pts([pr(0, 6, 78), pr(0, 6, 70), pr(0, 0, 70), pr(0, 0, 78)])} fill="#d9ccb2" />
            <polygon points={pts([pr(6, 0, 78), pr(6, 0, 70), pr(0, 0, 70), pr(0, 0, 78)])} fill="#e6dac3" />
            {/* cửa sổ */}
            <polygon points={pts([pr(4.2, 0, 62), pr(5.2, 0, 62), pr(5.2, 0, 30), pr(4.2, 0, 30)])} fill="#cfe8f5" stroke="#fff" strokeWidth={4} />
            <polygon points={pts([pr(0, 4.2, 62), pr(0, 5.2, 62), pr(0, 5.2, 30), pr(0, 4.2, 30)])} fill="#cfe8f5" stroke="#fff" strokeWidth={4} />
          </g>
          {/* bệ nhà */}
          <g opacity={pop(0)}>
            <polygon points={pts([pr(0, 6, 0), pr(6, 6, 0), pr(6, 6, -18), pr(0, 6, -18)])} fill="#c9bfa8" />
            <polygon points={pts([pr(6, 0, 0), pr(6, 6, 0), pr(6, 6, -18), pr(6, 0, -18)])} fill="#b5ab94" />
          </g>
          {ROOMS.map((r, i) => (
            <Floor key={r.id} r={r} pop={Math.min(1, pop(i + 1))} />
          ))}
          {/* vòng sáng phòng đang nói */}
          {roomOfActive && (
            <polygon
              points={pts([pr(roomOfActive.u, roomOfActive.v), pr(roomOfActive.u + 3, roomOfActive.v), pr(roomOfActive.u + 3, roomOfActive.v + 3), pr(roomOfActive.u, roomOfActive.v + 3)])}
              fill="none" stroke="#fff" strokeWidth={7} opacity={0.5 + 0.4 * Math.sin(t * 4)} strokeLinejoin="round"
            />
          )}
          <Furniture pop={Math.min(1, pop(5))} />
          {people.map((w, i) => {
            const active = sc.who === w.id;
            const [x, y] = pr(w.u, w.v);
            return (
              <g key={w.id}>
                <Person w={w} t={t} active={active} pop={Math.min(1, Math.max(0, pop(6 + i)))} />
                {active && inScene(sc) > 0 && <Bubble x={x} y={y} p={inScene(sc)} />}
              </g>
            );
          })}
        </g>

        {/* ===== lớp giao diện (trong vùng an toàn) ===== */}
        {sc.head && (
          <g opacity={inScene(sc)} transform={`translate(490 ${330 + (1 - inScene(sc)) * 24})`}>
            <text textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={sc.sub ? 96 : 54} fill={INK} stroke="#fff" strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">{sc.head}</text>
            {sc.sub && <text textAnchor="middle" y={64} fontFamily={H} fontWeight={600} fontSize={38} fill="#3f6b64" stroke="#fff" strokeWidth={8} paintOrder="stroke">{sc.sub}</text>}
          </g>
        )}
        {sc.card && (
          <g transform={`translate(490 ${1190 + (1 - cardP) * 60}) scale(${0.9 + 0.1 * cardP})`} opacity={Math.min(1, cardP)}>
            <rect x={-380} y={0} width={760} height={190} rx={40} fill="#fff" stroke="#cfe0dd" strokeWidth={3} />
            <rect x={-380} y={0} width={760} height={190} rx={40} fill="none" stroke="#000" opacity={0.05} strokeWidth={10} />
            <circle cx={-310} cy={95} r={44} fill={roomOfActive?.c} />
            <text x={-310} y={112} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={46} fill={INK}>{(WHO.find((w) => w.id === sc.who)?.name || '?').split(' ').pop()![0]}</text>
            <text x={-245} y={62} fontFamily={H} fontWeight={800} fontSize={30} fill="#8aa29e">{WHO.find((w) => w.id === sc.who)?.name} · {roomOfActive?.label.toLowerCase()}</text>
            <foreignObject x={-245} y={72} width={610} height={110}>
              <div style={{fontFamily: H, fontWeight: 600, fontSize: 36, lineHeight: 1.18, color: INK}}>{sc.card}</div>
            </foreignObject>
          </g>
        )}
        {/* caption pill */}
        <g transform={`translate(490 ${1585}) scale(${0.9 + 0.1 * Math.min(1, capP)})`} opacity={Math.min(1, capP)}>
          <rect x={-370} y={-44} width={740} height={88} rx={44} fill="#fff" stroke={INK} strokeWidth={4} />
          <text textAnchor="middle" y={14} fontFamily={H} fontWeight={800} fontSize={sc.cap.length > 30 ? 34 : 42} fill={INK}>{sc.cap}</text>
        </g>
        <text x={490} y={1690} textAnchor="middle" fontFamily={H} fontWeight={600} fontSize={22} fill="#6c8984">Nhà Gia Nhân · cảnh minh hoạ</text>
      </svg>
    </AbsoluteFill>
  );
};
