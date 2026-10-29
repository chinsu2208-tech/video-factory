import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/vietnamese-500.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import '@fontsource/plus-jakarta-sans/vietnamese-800.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/vietnamese-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/vietnamese-500.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';

// ====== LAYOUT 9: HƯỚNG DẪN THAO TÁC bằng KHUNG GIẢ LẬP (mockup) — theo brand Hynex.Solutions ======
// Sửa `tut` để ra tập mới: nhãn bước, chữ gõ, dữ liệu mẫu, phụ đề theo mốc giây.
export const tut = {
  step: 'Bước 1 · Tìm sản phẩm bán chạy',
  appTitle: 'Công cụ tìm sản phẩm',
  typed: 'đồ dùng cho bé',
  chips: ['Mẹ & bé', 'Làm đẹp', 'Gia dụng'],
  rows: [ // theo thứ tự ban đầu (chưa sắp xếp); rev = doanh thu (triệu)
    {name: 'Khăn ướt không mùi', rev: 54, com: '10%'},
    {name: 'Bình sữa chống sặc', rev: 128, com: '12%'},
    {name: 'Tã quần size M', rev: 71, com: '8%'},
    {name: 'Sữa tắm gội 2in1', rev: 33, com: '15%'},
    {name: 'Gối chống trào ngược', rev: 96, com: '11%'},
  ],
  callout: 'Chọn món này ↓',
  captions: [
    [0, 2.6, 'Mở công cụ tìm sản phẩm'],
    [2.6, 5.0, 'Gõ ngành hàng bạn muốn bán'],
    [5.0, 8.0, 'Xếp theo doanh thu, chọn món đứng đầu'],
    [8.0, 10, 'Xong bước 1 ✓'],
  ] as [number, number, string][],
  note: 'Dữ liệu mẫu minh hoạ',
};
export const TUT_FPS = 30;
export const TUT_SEC = 10;

const C = {navy: '#0C141D', blue: '#2986FF', tint: '#D6E9FF', paper: '#F6F9F7', soft: '#141E2B', lime: '#C8FF3D'};
const HEAD = '"Plus Jakarta Sans","Be Vietnam Pro",sans-serif';
const BODY = 'Inter,"Be Vietnam Pro",sans-serif';
const MONO = '"IBM Plex Mono",monospace';
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sec = (s: number) => Math.round(s * TUT_FPS);

// đường đi của con trỏ: [giây, x, y]
const PATH: [number, number, number][] = [
  [0.4, 900, 1500], [1.6, 330, 505], [2.6, 330, 505], [3.2, 870, 505], [3.5, 870, 505],
  [5.0, 600, 760], [5.5, 790, 760], [5.8, 790, 760], [6.8, 520, 880], [7.6, 520, 880], [9, 540, 880],
];
const CLICKS = [1.7, 3.3, 5.6, 7.4]; // giây

const Cursor: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 L0 62 L16 48 L28 76 L42 70 L30 43 L52 43Z" fill="#fff" stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

export const TutorialMock: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const pop = spring({frame: f, fps, config: {damping: 14}});
  const lab = spring({frame: f - 6, fps, config: {damping: 14}});

  // con trỏ
  const cx = interpolate(t, PATH.map((p) => p[0]), PATH.map((p) => p[1]), {...CL, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(t, PATH.map((p) => p[0]), PATH.map((p) => p[2]), {...CL, easing: Easing.inOut(Easing.cubic)});
  const clickAt = CLICKS.find((c) => t >= c && t < c + 0.5);
  const press = CLICKS.some((c) => t >= c && t < c + 0.12) ? 0.9 : 1;

  // gõ chữ
  const typedN = Math.floor(interpolate(t, [1.8, 2.9], [0, tut.typed.length], CL));
  const typing = t >= 1.7 && t < 3.2;
  const focus = t >= 1.7 && t < 3.3;
  const caret = Math.floor(f / 8) % 2 === 0;

  // bảng kết quả
  const showRows = t >= 3.5;
  const order = tut.rows.map((r, i) => i);
  const sorted = [...tut.rows.keys()].sort((a, b) => tut.rows[b].rev - tut.rows[a].rev);
  const sortP = interpolate(t, [5.7, 6.6], [0, 1], {...CL, easing: Easing.inOut(Easing.cubic)});
  const rowY = (i: number) => {
    const from = order.indexOf(i), to = sorted.indexOf(i);
    return 800 + (from + (to - from) * sortP) * 128;
  };
  const picked = t >= 7.5;
  const topIdx = sorted[0];
  const cal = spring({frame: f - sec(7.6), fps, config: {damping: 12}});

  // máy quay: zoom nhẹ vào bảng cuối clip
  const zoom = interpolate(t, [6.8, 8.2], [1, 1.07], {...CL, easing: Easing.inOut(Easing.cubic)});
  const zy = interpolate(t, [6.8, 8.2], [0, -50], {...CL, easing: Easing.inOut(Easing.cubic)});

  const cap = tut.captions.find(([a, b]) => t >= a && t < b);
  const capP = cap ? spring({frame: f - sec(cap[0]), fps, config: {damping: 16}}) : 0;

  return (
    <AbsoluteFill style={{background: C.paper}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        <defs>
          <filter id="win" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="22" stdDeviation="26" floodColor="#0c141d" floodOpacity="0.16" /></filter>
        </defs>
        {/* nhãn bước */}
        <g transform={`translate(80 ${150 + (1 - lab) * -80})`} opacity={lab}>
          <rect width={920} height={110} rx={28} fill={C.tint} />
          <text x={460} y={72} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={52} fill={C.navy}>{tut.step}</text>
        </g>

        <g transform={`translate(540 ${870 + zy}) scale(${zoom}) translate(-540 -870)`}>
          <g transform={`translate(540 880) scale(${0.92 + 0.08 * pop}) translate(-540 -880)`} opacity={pop}>
            {/* cửa sổ app */}
            <g filter="url(#win)">
              <rect x={60} y={330} width={960} height={1110} rx={28} fill="#fff" />
              <rect x={60} y={330} width={960} height={82} rx={28} fill="#EEF2F6" />
              <rect x={60} y={380} width={960} height={32} fill="#EEF2F6" />
              {['#ff6b6b', '#ffc23d', '#3ddc84'].map((c, i) => <circle key={i} cx={110 + i * 36} cy={371} r={11} fill={c} />)}
              <text x={540} y={382} textAnchor="middle" fontFamily={BODY} fontWeight={500} fontSize={28} fill={C.navy} opacity={0.65}>{tut.appTitle}</text>
            </g>
            {/* ô tìm kiếm */}
            <rect x={100} y={460} width={660} height={90} rx={22} fill={C.paper} stroke={focus ? C.blue : '#d9e2ea'} strokeWidth={focus ? 5 : 3} />
            <text x={132} y={518} fontFamily={BODY} fontSize={36} fill={C.navy} opacity={typedN > 0 ? 1 : 0.4}>
              {typedN > 0 ? tut.typed.slice(0, typedN) : 'Gõ ngành hàng…'}
              {focus && caret && typing ? <tspan fill={C.blue}>|</tspan> : ''}
            </text>
            <g transform={`translate(790 460) scale(${t >= 3.3 && t < 3.42 ? 0.95 : 1})`}>
              <rect width={190} height={90} rx={45} fill={C.navy} />
              <text x={95} y={59} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={36} fill="#fff">Tìm ↗</text>
            </g>
            {/* chip ngành */}
            {tut.chips.map((c, i) => (
              <g key={c} transform={`translate(${100 + i * 200} 590)`}>
                <rect width={180} height={64} rx={32} fill={i === 0 && t >= 3.3 ? C.tint : '#fff'} stroke={i === 0 && t >= 3.3 ? C.blue : '#d9e2ea'} strokeWidth={3} />
                <text x={90} y={43} textAnchor="middle" fontFamily={BODY} fontWeight={500} fontSize={28} fill={C.navy}>{c}</text>
              </g>
            ))}
            {/* tiêu đề bảng */}
            <g opacity={showRows ? 1 : 0.25}>
              <rect x={100} y={700} width={880} height={72} rx={14} fill={C.paper} />
              <text x={130} y={747} fontFamily={MONO} fontWeight={600} fontSize={26} fill={C.navy} opacity={0.6}>SẢN PHẨM</text>
              <text x={610} y={747} fontFamily={MONO} fontWeight={600} fontSize={26} fill={C.blue}>DOANH THU {sortP > 0.5 ? '↓' : '↕'}</text>
              <text x={860} y={747} fontFamily={MONO} fontWeight={600} fontSize={26} fill={C.navy} opacity={0.6}>HH</text>
            </g>
            {/* hàng */}
            {showRows && tut.rows.map((r, i) => {
              const appear = spring({frame: f - sec(3.6) - i * 4, fps, config: {damping: 16}});
              const y = rowY(i);
              const hot = picked && i === topIdx;
              return (
                <g key={r.name} transform={`translate(0 ${y - 800 + (1 - appear) * 40})`} opacity={appear}>
                  <rect x={100} y={800} width={880} height={110} rx={18} fill={hot ? C.tint : '#fff'} stroke={hot ? C.blue : '#e3eaf0'} strokeWidth={hot ? 6 : 3} />
                  <text x={130} y={868} fontFamily={HEAD} fontWeight={800} fontSize={36} fill={C.navy}>{r.name}</text>
                  <text x={610} y={868} fontFamily={MONO} fontWeight={600} fontSize={38} fill={C.blue}>{r.rev}tr</text>
                  <text x={860} y={868} fontFamily={MONO} fontWeight={500} fontSize={32} fill={C.navy} opacity={0.7}>{r.com}</text>
                </g>
              );
            })}
            {/* callout */}
            {picked && (
              <g transform={`translate(850 ${622 + (1 - cal) * 30}) scale(${0.6 + 0.4 * cal})`} opacity={cal}>
                <rect x={-150} y={-34} width={300} height={68} rx={34} fill={C.navy} />
                <circle cx={-124} cy={0} r={9} fill={C.lime} />
                <text x={22} y={11} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={29} fill="#fff">{tut.callout}</text>
              </g>
            )}
            {/* con trỏ + vòng click */}
            {clickAt !== undefined && (
              <circle cx={cx} cy={cy} r={interpolate(t - clickAt, [0, 0.5], [10, 70], CL)} fill="none" stroke={C.blue} strokeWidth={6} opacity={interpolate(t - clickAt, [0, 0.5], [0.9, 0], CL)} />
            )}
            <g transform={`translate(${cx} ${cy}) scale(${press}) translate(${-cx} ${-cy})`}><Cursor x={cx} y={cy} /></g>
          </g>
        </g>

        {/* phụ đề */}
        {cap && (
          <g transform={`translate(540 ${1640 + (1 - capP) * 30})`} opacity={capP}>
            <rect x={-440} y={-62} width={880} height={124} rx={62} fill={C.navy} />
            <text y={16} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={40} fill="#fff">{cap[2]}</text>
          </g>
        )}
        <text x={540} y={1800} textAnchor="middle" fontFamily={MONO} fontSize={26} fill={C.navy} opacity={0.5}>{tut.note}</text>
      </svg>
    </AbsoluteFill>
  );
};
