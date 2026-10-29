import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from './Template';

// ====== LAYOUT 5: 2D CUT-OUT / PAPER ANIMATION (10s) — sửa nội dung ở đây ======
export const paper = {
  bg: '#e6cfa3', ink: '#2b2118', accent: '#e8472b', accent2: '#2f7d6b', gold: '#f5b82e',
  kicker: 'CÁCH KIẾM', big: '100 TRIỆU', sub: 'ĐẦU TIÊN', handle: '@tenkenh',
  tags: ['10tr', '35tr', '70tr'],
};
export const PAPER_FPS = 30;
export const PAPER_SEC = 10;
const STEP = 3; // 30fps / 3 = 10 hình/giây (stop-motion)
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// miếng giấy: viền trắng + mép lởm chởm + bóng
const Cut: React.FC<{x?: number; y?: number; rot?: number; s?: number; children: React.ReactNode}> = ({x = 0, y = 0, rot = 0, s = 1, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#cut)">{children}</g>
);
const W = {stroke: '#fffaf0', strokeWidth: 12, strokeLinejoin: 'round', paintOrder: 'stroke'} as const;

const Person: React.FC<{t: number}> = ({t}) => {
  const bob = Math.sin(t / 3) * 8;
  const arm = Math.sin(t / 2.2) * 14;
  return (
    <g transform={`translate(0 ${bob})`}>
      <rect x={-70} y={170} width={50} height={190} rx={22} fill={paper.ink} {...W} />
      <rect x={20} y={170} width={50} height={190} rx={22} fill={paper.ink} {...W} />
      <rect x={-95} y={-30} width={190} height={230} rx={60} fill={paper.accent2} {...W} />
      <rect x={-150} y={-20 + arm} width={60} height={170} rx={28} fill={paper.accent2} {...W} transform={`rotate(14 -120 -20)`} />
      <rect x={90} y={-120 - arm} width={60} height={190} rx={28} fill={paper.accent2} {...W} transform={`rotate(-25 120 -100)`} />
      <circle cx={0} cy={-120} r={80} fill="#f2c9a0" {...W} />
      <path d="M-84 -125 Q-70 -215 10 -205 Q86 -200 84 -120 Q40 -170 -84 -125Z" fill={paper.ink} {...W} />
      <circle cx={-28} cy={-112} r={8} fill={paper.ink} />
      <circle cx={30} cy={-112} r={8} fill={paper.ink} />
      <path d="M-26 -78 Q0 -56 28 -78" stroke={paper.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Coin: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={70} ry={26} fill={paper.gold} {...W} strokeWidth={9} />
    <ellipse cx={0} cy={-8} rx={44} ry={13} fill="none" stroke="#c98a00" strokeWidth={6} />
  </g>
);
const Stack: React.FC<{n: number; shown: number}> = ({n, shown}) => (
  <g>{Array.from({length: n}).map((_, i) => (i < shown ? <Coin key={i} x={0} y={-i * 30} /> : null))}</g>
);

export const PaperCutout: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = Math.floor(f / STEP) * STEP;
  const pop = (start: number, damp = 10) => spring({frame: t - start, fps, config: {damping: damp, stiffness: 140}});
  const wob = (k: number) => Math.sin(t / 4 + k) * 1.6;

  const walkX = interpolate(t, [20, 85], [-300, 270], {...C, easing: Easing.out(Easing.cubic)});
  const stacks = [
    {x: 560, n: 3, at: 100, tag: paper.tags[0]},
    {x: 760, n: 6, at: 130, tag: paper.tags[1]},
    {x: 960, n: 10, at: 160, tag: paper.tags[2]},
  ];
  const bigP = pop(235, 7);
  const burst = interpolate(t, [235, 250], [0, 1], C);
  const out = interpolate(t, [225, 235], [1, 0], C); // phần giữa mờ ra khi chốt "100 TRIỆU"

  return (
    <AbsoluteFill style={{background: paper.bg}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        <defs>
          <filter id="cut" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="d" />
            <feDropShadow in="d" dx="7" dy="11" stdDeviation="4" floodColor="#3a2610" floodOpacity="0.38" />
          </filter>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="8" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0.22 0" />
          </filter>
        </defs>
        <rect width={1080} height={1920} filter="url(#grain)" />

        {/* tiêu đề: dải giấy đỏ + tờ trắng rách */}
        <g opacity={out}>
          <Cut x={540} y={250 + (1 - pop(0)) * -300} rot={-3 + wob(0)}>
            <rect x={-330} y={-70} width={660} height={140} rx={8} fill={paper.accent} {...W} />
            <text y={32} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={92} fill="#fffaf0" letterSpacing={8}>{paper.kicker}</text>
          </Cut>
          <Cut x={540} y={470 + (1 - pop(8)) * -500} rot={2 + wob(1)} s={0.8 + 0.2 * pop(8)}>
            <path d="M-420 -110 L-380 -125 L-300 -105 L0 -130 L300 -108 L400 -125 L430 -90 L418 100 L380 118 L0 98 L-300 124 L-410 100Z" fill="#fffaf0" {...W} stroke="#fffaf0" />
            <text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={paper.ink}>{paper.big}</text>
          </Cut>
          <Cut x={540} y={640 + (1 - pop(16)) * -400} rot={-2 + wob(2)}>
            <rect x={-230} y={-55} width={460} height={110} rx={8} fill={paper.gold} {...W} />
            <text y={32} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={paper.ink}>{paper.sub}</text>
          </Cut>
        </g>

        {/* mặt đất giấy */}
        <g opacity={out}>
          <Cut x={540} y={1650} rot={0.6}>
            <rect x={-620} y={0} width={1240} height={300} fill={paper.accent2} {...W} />
          </Cut>

          {/* nhân vật đi vào */}
          <Cut x={walkX} y={1180} rot={wob(3)} s={1.05}>
            <Person t={t} />
          </Cut>

          {/* cột xu mọc lên + thẻ giá */}
          {stacks.map((st, i) => {
            const p = pop(st.at, 12);
            const shown = Math.round(interpolate(t, [st.at, st.at + 26], [0, st.n], C));
            return (
              <g key={i} opacity={p > 0.01 ? 1 : 0}>
                <Cut x={st.x} y={1620} rot={wob(i + 4)}>
                  <Stack n={st.n} shown={shown} />
                </Cut>
                <Cut x={st.x} y={1700 + (1 - p) * 120} rot={(i - 1) * 4}>
                  <rect x={-75} y={-38} width={150} height={76} rx={10} fill="#fffaf0" {...W} />
                  <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={paper.accent}>{st.tag}</text>
                </Cut>
              </g>
            );
          })}

          {/* mũi tên giấy đi lên */}
          <Cut x={800} y={1150 + (1 - pop(175)) * 200} rot={-8 + wob(7)} s={pop(175)}>
            <path d="M-60 90 L-60 -10 L-110 -10 L0 -130 L110 -10 L60 -10 L60 90Z" fill={paper.accent} {...W} />
          </Cut>
        </g>

        {/* chốt: 100 TRIỆU đóng dấu */}
        {t >= 235 && (
          <g>
            <g transform="translate(540 900)" opacity={burst}>
              {Array.from({length: 14}).map((_, i) => (
                <polygon key={i} points="-34,0 0,-420 34,0" fill={i % 2 ? paper.gold : paper.accent} transform={`rotate(${i * (360 / 14) + t * 1.5}) scale(${0.35 + 0.65 * burst})`} opacity={0.9} />
              ))}
            </g>
            <Cut x={540} y={900} rot={-5 + wob(9)} s={0.4 + 0.6 * bigP}>
              <circle r={330} fill="#fffaf0" {...W} />
              <circle r={290} fill="none" stroke={paper.accent} strokeWidth={10} strokeDasharray="26 16" />
              <text y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={paper.ink}>100</text>
              <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={paper.accent}>TRIỆU</text>
            </Cut>
            <text x={540} y={1450} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill={paper.ink} opacity={burst}>LƯU LẠI ĐỂ LÀM THEO</text>
            <text x={540} y={1530} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={paper.ink} opacity={burst * 0.7}>{paper.handle}</text>
            <text x={540} y={1850} textAnchor="middle" fontFamily={FONT} fontSize={28} fill={paper.ink} opacity={0.6}>Số liệu minh hoạ</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
