import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from './Template';

// ====== LAYOUT 6: KÊNH "CÁCH KIẾM TIỀN" (doodle stick-figure) → CTA khoá học ======
// Mỗi tập = 1 object `ep`. Đổi nội dung là ra tập mới. Cấu trúc cố định: Hook → Cách kiếm → 3 bước → CTA.
export const dm = {
  bg: '#f4efe6', ink: '#2b2118', orange: '#f08a24', soft: '#fbe3c6',
  channel: '@tenkenh',
  course: 'HYNEX EDU', ctaLine: 'Muốn làm bài bản, có người chỉ từng bước?', ctaBtn: 'Xem khoá học ở link bio',
  disclaimer: 'Nội dung tham khảo, không cam kết thu nhập. Kết quả tuỳ mỗi người.',
};
export const ep = {
  num: 1,
  hook: 'Hiện nay kiếm tiền online bằng gì?',
  method: 'Làm affiliate TikTok Shop',
  one: 'Quay video giới thiệu sản phẩm, có đơn thì nhận hoa hồng',
  chips: [['Vốn', 'Thấp'], ['Thời gian', '1–3 tháng'], ['Độ khó', 'Vừa']] as [string, string][],
  steps: ['Chọn sản phẩm đang bán chạy', 'Quay 10 video thử nội dung', 'Nhân bản video ra đơn'],
};
export const DM_FPS = 30;
export const DM_SEC = 20;
const STEP = 3; // 10 hình/giây cho cảm giác nét vẽ tay
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = {stroke: dm.ink, strokeWidth: 7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

const Stick: React.FC<{t: number; mood?: 'shrug' | 'happy' | 'point'; walk?: boolean}> = ({t, mood = 'happy', walk}) => {
  const sw = Math.sin(t / 2.5);
  const arm = mood === 'shrug' ? [[-60, -20], [60, -20]] : mood === 'point' ? [[-60, 40], [90, -70 + sw * 10]] : [[-60, -60 + sw * 20], [60, -60 - sw * 20]];
  const leg = walk ? sw * 30 : 0;
  return (
    <g>
      <circle cx={0} cy={-150} r={52} {...S} fill="#fff" fillOpacity={1} />
      <circle cx={-18} cy={-158} r={5} fill={dm.ink} />
      <circle cx={18} cy={-158} r={5} fill={dm.ink} />
      {mood === 'shrug' ? <path d="M-18 -128 L18 -128" {...S} strokeWidth={5} /> : <path d="M-20 -132 Q0 -112 20 -132" {...S} strokeWidth={5} />}
      <path d="M0 -98 L0 40" {...S} />
      <rect x={-22} y={-86} width={44} height={86} rx={10} fill={dm.ink} stroke="none" />
      <path d={`M0 -80 L${arm[0][0]} ${arm[0][1] + 40}`} {...S} />
      <path d={`M0 -80 L${arm[1][0]} ${arm[1][1] + 40}`} {...S} />
      <path d={`M0 40 L${-40 + leg} 150`} {...S} />
      <path d={`M0 40 L${40 - leg} 150`} {...S} />
      <ellipse cx={0} cy={158} rx={90} ry={14} fill="#00000014" stroke="none" />
    </g>
  );
};

const Squig: React.FC<{w: number; color?: string; p: number}> = ({w, color = dm.orange, p}) => (
  <path d={`M0 0 Q${w * 0.15} -14 ${w * 0.3} 0 T${w * 0.6} 0 T${w} 0`} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
);

const Box: React.FC<{x: number; y: number; w: number; h: number; title?: string; p: number; children?: React.ReactNode}> = ({x, y, w, h, title, p, children}) => (
  <g transform={`translate(${x} ${y}) scale(${0.9 + 0.1 * p})`} opacity={p}>
    <rect x={0} y={0} width={w} height={h} rx={14} {...S} fill="#fff" fillOpacity={1} />
    {title && (<>
      <rect x={30} y={-34} width={w - 60} height={60} rx={10} {...S} fill={dm.bg} fillOpacity={1} />
      <text x={w / 2} y={8} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={dm.ink}>{title}</text>
    </>)}
    {children}
  </g>
);

export const DoodleMoney: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = Math.floor(f / STEP) * STEP;
  const sp = (s: number, d = 12) => spring({frame: t - s, fps, config: {damping: d, stiffness: 130}});
  const sec = t / fps;
  const scene = sec < 3 ? 0 : sec < 8 ? 1 : sec < 15 ? 2 : 3;
  const fade = (a: number, b: number) => interpolate(sec, [a, a + 0.25, b - 0.2, b], [0, 1, 1, 0], C);

  return (
    <AbsoluteFill style={{background: dm.bg}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        <defs>
          <filter id="hand" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed={Math.floor(t / 6) % 4} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
          </filter>
        </defs>
        <g filter="url(#hand)">
          {/* nhãn tập */}
          <g transform="translate(70 110)">
            <rect width={560} height={64} rx={32} fill={dm.orange} />
            <text x={280} y={44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff">TẬP {ep.num} · CÁCH KIẾM TIỀN</text>
          </g>

          {/* 0: HOOK */}
          {scene === 0 && (
            <g opacity={fade(0, 3)}>
              <text x={540} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={dm.ink}>
                {wrap(ep.hook, 16).map((l, i) => <tspan key={i} x={540} dy={i ? 112 : 0}>{l}</tspan>)}
              </text>
              <g transform="translate(300 780)" opacity={sp(8)}><Squig w={480} p={sp(8)} /></g>
              <g transform={`translate(540 1250)`}><Stick t={t} mood="shrug" /></g>
              <text x={700} y={1060} fontFamily={FONT} fontWeight={900} fontSize={150} fill={dm.orange} opacity={sp(14)} transform={`rotate(${Math.sin(t / 3) * 6} 700 1060)`}>?</text>
            </g>
          )}

          {/* 1: CÁCH KIẾM */}
          {scene === 1 && (
            <g opacity={fade(3, 8)}>
              <Box x={90} y={380} w={900} h={520} title={`CÁCH ${ep.num}`} p={sp(3 * fps)}>
                <text x={450} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={dm.ink}>
                  {wrap(ep.method, 17).map((l, i) => <tspan key={i} x={450} dy={i ? 100 : 0}>{l}</tspan>)}
                </text>
                <g transform="translate(160 330)"><Squig w={580} p={sp(3 * fps + 6)} /></g>
                <text x={450} y={430} textAnchor="middle" fontFamily={FONT} fontSize={40} fill={dm.ink} opacity={0.85}>
                  {wrap(ep.one, 34).map((l, i) => <tspan key={i} x={450} dy={i ? 52 : 0}>{l}</tspan>)}
                </text>
              </Box>
              {ep.chips.map(([k, v], i) => {
                const p = sp(Math.round(4.2 * fps + i * 5));
                return (
                  <g key={i} transform={`translate(${90 + i * 310} ${1010 + (1 - p) * 80})`} opacity={p}>
                    <rect width={280} height={190} rx={16} {...S} fill={dm.soft} fillOpacity={1} />
                    <text x={140} y={70} textAnchor="middle" fontFamily={FONT} fontSize={34} fill={dm.ink} opacity={0.7}>{k}</text>
                    <text x={140} y={135} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={dm.orange}>{v}</text>
                  </g>
                );
              })}
              <g transform="translate(300 1560)"><Stick t={t} mood="happy" /></g>
            </g>
          )}

          {/* 2: 3 BƯỚC (cầu thang) */}
          {scene === 2 && (
            <g opacity={fade(8, 15)}>
              <text x={540} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={dm.ink}>3 bước để bắt đầu</text>
              <g transform="translate(330 360)"><Squig w={420} p={sp(8 * fps)} /></g>
              {ep.steps.map((s, i) => {
                const p = sp(Math.round((8.5 + i * 1.8) * fps));
                const y = 560 + i * 250;
                return (
                  <g key={i} transform={`translate(${130 + (1 - p) * 500} ${y})`} opacity={p}>
                    <rect width={820} height={170} rx={16} {...S} fill="#fff" fillOpacity={1} />
                    <circle cx={90} cy={85} r={52} fill={dm.orange} stroke="none" />
                    <text x={90} y={105} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#fff">{i + 1}</text>
                    <text x={170} y={100} fontFamily={FONT} fontWeight={800} fontSize={44} fill={dm.ink}>
                      {wrap(s, 22).map((l, k) => <tspan key={k} x={170} dy={k ? 52 : 0}>{l}</tspan>)}
                    </text>
                  </g>
                );
              })}
              <g transform={`translate(${200 + interpolate(sec, [8.5, 14], [0, 120], C)} 1620) scale(0.8)`}><Stick t={t} mood="point" walk /></g>
            </g>
          )}

          {/* 3: CTA HYNEX EDU */}
          {scene === 3 && (
            <g>
              <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={68} fill={dm.ink} opacity={sp(15 * fps)}>
                {wrap(dm.ctaLine, 20).map((l, i) => <tspan key={i} x={540} dy={i ? 84 : 0}>{l}</tspan>)}
              </text>
              <g transform={`translate(540 760) scale(${0.6 + 0.4 * sp(Math.round(15.6 * fps), 8)})`}>
                <rect x={-380} y={-110} width={760} height={220} rx={28} {...S} fill={dm.orange} />
                <text y={35} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill="#fff">{dm.course}</text>
              </g>
              <g transform="translate(240 1000)" opacity={sp(Math.round(16.4 * fps))}>
                <rect width={600} height={96} rx={48} {...S} fill="#fff" fillOpacity={1} />
                <text x={300} y={64} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={dm.ink}>{dm.ctaBtn}</text>
              </g>
              <g transform="translate(540 1500) scale(0.95)"><Stick t={t} mood="point" /></g>
              <text x={540} y={1790} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={dm.ink} opacity={0.8}>{dm.channel}</text>
              <text x={540} y={1850} textAnchor="middle" fontFamily={FONT} fontSize={26} fill={dm.ink} opacity={0.55}>{dm.disclaimer}</text>
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

function wrap(s: string, n: number): string[] {
  const out: string[] = []; let cur = '';
  s.split(' ').forEach((w) => { if ((cur + ' ' + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += ' ' + w; });
  if (cur.trim()) out.push(cur.trim());
  return out;
}
