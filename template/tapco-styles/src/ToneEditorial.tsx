import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/playfair-display/vietnamese-600.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/playfair-display/vietnamese-700.css';
import '@fontsource/playfair-display/latin-600-italic.css';
import '@fontsource/playfair-display/vietnamese-600-italic.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';

// ===== Tonelux editorial graphic motion (Remotion, 1080x1920) =====
export const TE_TOTAL = 56; // seconds
const IV = '#F5F0E8', ES = '#302720', BU = '#743D4B', OL = '#85866A', RO = '#D6A6A5', TA = '#B9AA98';
const SERIF = "'Playfair Display', serif", SANS = "'Be Vietnam Pro', sans-serif";
const e1 = Easing.bezier(0.65, 0, 0.35, 1), e2 = Easing.bezier(0.16, 1, 0.3, 1);
const pr = (f: number, a: number, b: number, ea = e2) =>
  interpolate(f, [a * 30, b * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ea});
const CX = 490, L = 110, R = 870; // safe axis and margins

// ---------- caption chunks (seconds) ----------
const CAPS: [number, number, string][] = [
  [0, 2.2, 'Một buổi test màu cho bạn 3 thứ'], [2.2, 3.1, 'nguyên nhân,'], [3.1, 4.0, 'bằng chứng,'], [4.0, 4.9, 'và bảng màu.'],
  [4.9, 7.1, '1. Nguyên nhân'],
  [7.1, 8.2, 'Nhiều bạn mua son, áo, màu tóc'], [8.2, 9.9, 'mà không hợp, rồi nghĩ'], [9.9, 10.9, '“chắc da mình có vấn đề”'],
  [10.9, 12.4, 'Thực tế phần lớn là'], [12.4, 13.5, 'lệch undertone.'],
  [13.5, 15.8, 'Màu lệch tông làm da xỉn,'], [15.8, 17.7, 'quầng mắt rõ hơn,'], [17.7, 19.0, 'nhìn mệt dù ngủ đủ.'],
  [19.0, 21.0, '2. Bằng chứng'],
  [21.0, 22.4, 'Chuyên viên đặt từng tấm vải cạnh mặt,'], [22.4, 24.5, 'cùng ánh sáng,'], [24.5, 26.4, 'cùng khoảng cách.'],
  [26.4, 28.5, 'Màu hợp thì da đều và sáng lên,'], [28.5, 30.3, 'màu lệch thì thấy xỉn ngay.'],
  [30.3, 31.5, 'Bạn nhìn bằng mắt mình,'], [31.5, 32.8, 'không cần tin lời ai.'],
  [32.8, 34.8, '3. Bảng màu'],
  [34.8, 36.7, 'Cuối buổi bạn có bảng màu cố định:'], [36.7, 37.7, 'màu nên dùng,'], [37.7, 38.8, 'màu nên né.'],
  [38.8, 40.9, 'Mua son, áo, nhuộm tóc theo bảng này,'], [40.9, 43.4, 'giảm hẳn chuyện mua rồi bỏ xó.'],
  [43.4, 45.5, 'Tự soi gương rất khó chuẩn'], [45.5, 46.5, 'vì ánh sáng đổi liên tục'], [46.5, 48.5, 'và mắt mình quen với mặt mình.'],
  [48.5, 50.8, 'Test là cách nhanh nhất'], [50.8, 52.5, 'để có đáp án chắc chắn.'],
  [52.5, 53.9, 'Muốn biết bảng màu của mình,'], [53.9, 56, 'đặt lịch tư vấn ở link trong bio'],
];

// ---------- primitives ----------
const Words: React.FC<{text: string; f: number; start?: number; size: number; color?: string; italic?: boolean; font?: string; lh?: number; gap?: number; align?: 'left' | 'center'; w?: number; weight?: number; ls?: number}> = ({text, f, start = 0, size, color = ES, italic, font = SERIF, lh = 1.08, gap = 0.1, align = 'left', w = R - L, weight = 600, ls = 0}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', width: w, columnGap: size * 0.26, rowGap: 0}}>
    {text.split(' ').map((t, i) => {
      const p = pr(f, start + i * gap, start + i * gap + 0.55);
      return (
        <span key={i} style={{display: 'inline-block', overflow: 'hidden', lineHeight: lh, paddingBottom: size * 0.12}}>
          <span style={{display: 'inline-block', fontFamily: font, fontStyle: italic ? 'italic' : 'normal', fontWeight: weight, fontSize: size, color, letterSpacing: ls, transform: `translateY(${(1 - p) * 115}%)`}}>{t}</span>
        </span>
      );
    })}
  </div>
);
const Line: React.FC<{x: number; y: number; w: number; f: number; start?: number; dur?: number; color?: string; th?: number}> = ({x, y, w, f, start = 0, dur = 0.7, color = ES, th = 2}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w * pr(f, start, start + dur, e1), height: th, background: color}} />
);
const Small: React.FC<{x: number; y: number; text: string; f: number; start?: number; color?: string; size?: number; align?: 'left' | 'right' | 'center'; w?: number}> = ({x, y, text, f, start = 0, color = ES, size = 26, align = 'left', w = 700}) => {
  const p = pr(f, start, start + 0.5);
  const left = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
  return <div style={{position: 'absolute', left, top: y, width: w, textAlign: align, fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: size * 0.16, textTransform: 'uppercase', color, opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>{text}</div>;
};
const Header: React.FC<{idx: string; label: string; f: number; color: string; ink?: string}> = ({idx, label, f, color, ink = ES}) => (
  <>
    <Small x={L} y={292} text="Tonelux · Personal Color" f={f} color={ink} size={20} />
    <div style={{position: 'absolute', left: R - 200, top: 276, width: 200, textAlign: 'right', fontFamily: SERIF, fontWeight: 700, fontSize: 54, color, opacity: pr(f, 0.1, 0.5)}}>{idx}</div>
    <Small x={R} y={340} text={label} f={f} start={0.15} color={ink} size={20} align="right" w={400} />
    <Line x={L} y={332} w={R - L - 0} f={f} start={0.1} color={ink} th={1.5} />
  </>
);

// real footage pane with geometric mask reveal + offset colour block
const VideoPane: React.FC<{f: number; x?: number; y: number; w?: number; h: number; oy?: number; src0: number; block?: string; reveal?: number}> = ({f, x = L, y, w = 760, h, oy = 0, src0, block = BU, reveal = 0}) => {
  const p = pr(f, reveal, reveal + 0.7, e1);
  return (
    <>
      <div style={{position: 'absolute', left: x + 18, top: y + 18, width: w, height: h * p, background: block}} />
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, background: ES}}>
        <OffthreadVideo src={staticFile('tl/src.mp4')} startFrom={Math.round(src0 * 30)} muted style={{position: 'absolute', left: 0, top: -oy, width: w, height: (w * 1280) / 720}} />
      </div>
    </>
  );
};

// annotation: dot on the footage + thin leader + label tag
const Marker: React.FC<{f: number; start: number; dx: number; dy: number; lx: number; ly: number; text: string; color?: string}> = ({f, start, dx, dy, lx, ly, text, color = IV}) => {
  const p = pr(f, start, start + 0.6);
  const len = Math.hypot(lx - dx, ly - dy);
  const ang = (Math.atan2(ly - dy, lx - dx) * 180) / Math.PI;
  return (
    <>
      <div style={{position: 'absolute', left: dx - 9, top: dy - 9, width: 18, height: 18, borderRadius: 9, border: `3px solid ${color}`, background: 'rgba(48,39,32,.35)', transform: `scale(${p})`}} />
      <div style={{position: 'absolute', left: dx, top: dy, width: len * p, height: 2, background: color, transformOrigin: '0 50%', transform: `rotate(${ang}deg)`}} />
      <div style={{position: 'absolute', left: lx, top: ly - 26, padding: '9px 18px', background: color, color: ES, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', opacity: pr(f, start + 0.35, start + 0.7), transform: `translateX(${(1 - pr(f, start + 0.35, start + 0.8)) * 24}px)`, whiteSpace: 'nowrap'}}>{text}</div>
    </>
  );
};

const Swatch: React.FC<{x: number; y: number; w: number; h: number; color: string; f: number; start: number; from?: 'left' | 'bottom'; r?: number}> = ({x, y, w, h, color, f, start, from = 'left', r = 0}) => {
  const p = pr(f, start, start + 0.7);
  const tx = from === 'left' ? (1 - p) * -120 : 0, ty = from === 'bottom' ? (1 - p) * 120 : 0;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: color, borderRadius: r, opacity: Math.min(1, p * 2), transform: `translate(${tx}px,${ty}px) scaleX(${0.3 + 0.7 * p})`, transformOrigin: 'left center'}} />;
};

// scene wrapper: colour wipe in (8f) + out (12f) then content
const Scene: React.FC<{s: number; e: number; bg: string; wipe: string; children: (f: number) => React.ReactNode}> = ({s, e, bg, wipe, children}) => {
  const f0 = useCurrentFrame();
  const x = interpolate(f0, [0, 8, 20], [-1080, 0, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e1});
  return (
    <Sequence from={Math.round(s * 30) - 8} durationInFrames={Math.round((e - s) * 30) + 8}>
      <Sequence from={8}>
        <ContentFrame bg={bg}>{children}</ContentFrame>
      </Sequence>
      <WipeBlock color={wipe} />
    </Sequence>
  );
};
const WipeBlock: React.FC<{color: string}> = ({color}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 8, 20], [-1080, 0, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e1});
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: color, transform: `translateX(${x}px)`}} />;
};
const ContentFrame: React.FC<{bg: string; children: (f: number) => React.ReactNode}> = ({bg, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '7px 7px'}} />
      {children(f)}
    </AbsoluteFill>
  );
};

const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const c = CAPS.find(([a, b]) => t >= a && t < b);
  if (!c) return null;
  const p = pr(f, c[0], c[0] + 0.25);
  const dark = (t >= 4.7 && t < 7.1) || (t >= 13.5 && t < 19) || (t >= 32.8 && t < 34.8) || (t >= 43.4 && t < 48.5) || t >= 52.5;
  return (
    <div style={{position: 'absolute', left: CX - 370, top: 1585, width: 740, display: 'flex', justifyContent: 'center', opacity: p}}>
      <div style={{background: dark ? IV : ES, color: dark ? ES : IV, fontFamily: SANS, fontWeight: 600, fontSize: 36, padding: '8px 26px', whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * 10}px)`}}>{c[2]}</div>
    </div>
  );
};

// ---------- scenes ----------
const Intro = (f: number) => (
  <>
    <Small x={L} y={292} text="Tonelux · Personal Color" f={f} size={20} />
    <Line x={L} y={332} w={R - L} f={f} start={0.1} th={1.5} />
    <div style={{position: 'absolute', left: L, top: 350}}><Words text="Buổi test màu" f={f} start={0.15} size={64} italic w={R - L} /></div>
    <div style={{position: 'absolute', left: L, top: 420}}><Words text="cho bạn 3 thứ" f={f} start={0.5} size={96} color={BU} w={R - L} /></div>
    <div style={{position: 'absolute', left: 0, top: 0}}><VideoPane f={f} y={560} h={780} oy={63} src0={0} block={RO} reveal={0.3} /></div>
    {[['01', 'Nguyên nhân', 2.5], ['02', 'Bằng chứng', 3.3], ['03', 'Bảng màu', 4.1]].map(([n, t, s], i) => {
      const p = pr(f, s as number, (s as number) + 0.5);
      return (
        <div key={i} style={{position: 'absolute', left: L + i * 260, top: 1392, width: 240, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
          <div style={{width: 240 * p, height: 3, background: [BU, OL, RO][i]}} />
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: ES, marginTop: 8}}>{n}</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: ES}}>{t}</div>
        </div>
      );
    })}
  </>
);

const Heading: (num: string, word: string, fg: string, accent: string, strip?: string[]) => (f: number) => React.ReactNode = (num, word, fg, accent, strip) => (f) => {
  const p = pr(f, 0, 0.9, e1);
  return (
    <>
      <div style={{position: 'absolute', left: L - 10, top: 360, height: 520, overflow: 'hidden'}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 520, lineHeight: 1, color: accent, transform: `translateY(${(1 - p) * 100}%)`}}>{num}</div>
      </div>
      <div style={{position: 'absolute', left: L, top: 900}}><Words text={word} f={f} start={0.4} size={120} color={fg} italic w={R - L} /></div>
      <Line x={L} y={1090} w={R - L} f={f} start={0.7} color={fg} th={2} />
      {strip && strip.map((c, i) => <Swatch key={i} x={L + i * ((R - L) / strip.length)} y={1130} w={(R - L) / strip.length - 8} h={90} color={c} f={f} start={0.8 + i * 0.1} />)}
    </>
  );
};

const Shop = (f: number) => {
  const items: [string, string, number][] = [['Son', '#A94A5C', 0.2], ['Áo', OL, 0.5], ['Màu tóc', '#5A3A2A', 0.8]];
  const dim = pr(f, 2.0, 2.8, e1);
  return (
    <>
      <Header idx="01" label="Nguyên nhân" f={f} color={BU} />
      {items.map(([t, c, s], i) => (
        <React.Fragment key={t}>
          <Swatch x={L + i * 260} y={420} w={240} h={400} color={interpolateColors(dim, [0, 1], [c, TA])} f={f} start={s} from="bottom" />
          <Small x={L + i * 260} y={840} text={t} f={f} start={s + 0.3} size={26} />
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: L, top: 905}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: BU, opacity: pr(f, 1.1, 1.5)}}>không hợp</div>
        <div style={{width: 300 * pr(f, 1.15, 1.9, e1), height: 3, background: BU, marginTop: 8}} />
      </div>
      <div style={{position: 'absolute', left: L - 6, top: 960, fontFamily: SERIF, fontWeight: 700, fontSize: 260, lineHeight: 0.8, color: RO, opacity: pr(f, 2.2, 2.7)}}>“</div>
      <div style={{position: 'absolute', left: L, top: 1090}}><Words text="Chắc da mình có vấn đề?" f={f} start={2.5} size={92} italic color={ES} w={R - L} lh={1.12} /></div>
    </>
  );
};

const Under = (f: number) => {
  const bx = L, bw = R - L, by = 640;
  const m1 = bx + bw * 0.24, m2 = bx + bw * 0.8;
  const gap = pr(f, 1.0, 1.9, e1);
  return (
    <>
      <Header idx="01" label="Nguyên nhân" f={f} color={BU} />
      <div style={{position: 'absolute', left: bx, top: by, width: bw * pr(f, 0.1, 0.9, e1), height: 56, overflow: 'hidden'}}>
        <div style={{width: bw, height: 56, background: 'linear-gradient(90deg,#D9A35F 0%,#E8C9A0 28%,#E9DCCB 50%,#B9C4D3 74%,#8BA3C4 100%)'}} />
      </div>
      <Small x={bx} y={by - 46} text="Ấm" f={f} start={0.5} size={24} />
      <Small x={R} y={by - 46} text="Lạnh" f={f} start={0.5} size={24} align="right" w={200} />
      {/* skin marker (above) */}
      <div style={{position: 'absolute', left: m1 - 3, top: by - 90 + 0, width: 6, height: 90 * pr(f, 0.5, 1.0), background: ES, bottom: 0}} />
      <div style={{position: 'absolute', left: m1 - 90, top: by - 170, width: 180, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: ES, opacity: pr(f, 0.8, 1.2)}}>Da bạn</div>
      {/* purchased colour marker (below) */}
      <div style={{position: 'absolute', left: m2 - 3, top: by + 56, width: 6, height: 100 * pr(f, 0.8, 1.3), background: BU}} />
      <div style={{position: 'absolute', left: m2 - 100, top: by + 166, width: 200, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: BU, opacity: pr(f, 1.1, 1.5)}}>Màu đã mua</div>
      {/* bracket showing the offset */}
      <div style={{position: 'absolute', left: m1, top: by + 250, width: (m2 - m1) * gap, height: 3, background: BU}} />
      <div style={{position: 'absolute', left: m1 - 1.5, top: by + 236, width: 3, height: 30, background: BU}} />
      <div style={{position: 'absolute', left: m1 + (m2 - m1) * gap - 1.5, top: by + 236, width: 3, height: 30, background: BU, opacity: gap}} />
      <div style={{position: 'absolute', left: L, top: 1010}}><Words text="Lệch undertone" f={f} start={1.5} size={118} color={BU} w={R - L} /></div>
      <Small x={L} y={1190} text="Hình minh hoạ khái niệm" f={f} start={2.0} size={18} color={TA} />
    </>
  );
};

const Effects = (f: number) => {
  const cards: [string, string, string, string, number][] = [
    ['a', 'Da xỉn', '#E3B895', '#9C8E80', 1.1],
    ['b', 'Quầng mắt rõ hơn', '#E3B895', '#8B7077', 3.0],
    ['c', 'Nhìn mệt dù ngủ đủ', '#E3B895', '#A29A86', 4.5],
  ];
  return (
    <>
      <Header idx="01" label="Nguyên nhân" f={f} color={RO} ink={IV} />
      {cards.map(([k, t, c0, c1, s], i) => {
        const y = 420 + i * 300;
        const p = pr(f, s - 0.7, s);
        const flow = pr(f, s, s + 1.0, e1);
        return (
          <div key={k}>
            <div style={{position: 'absolute', left: L, top: y, width: (R - L) * p, height: 260, border: `2px solid ${IV}`, boxSizing: 'border-box', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 30, top: 28, fontFamily: SERIF, fontWeight: 600, fontSize: 40, fontStyle: 'italic', color: RO}}>0{i + 1}</div>
              <div style={{position: 'absolute', left: 30, top: 100, width: 420, fontFamily: SERIF, fontWeight: 700, fontSize: 52, lineHeight: 1.08, color: IV}}>{t}</div>
              <div style={{position: 'absolute', right: 0, top: 0, width: 220, height: 260, background: interpolateColors(flow, [0, 1], [c0, c1]), opacity: pr(f, s - 0.1, s + 0.2)}} />
              <div style={{position: 'absolute', right: 0, top: 0, width: 220, height: 260 * (1 - flow), background: 'rgba(255,255,255,.0)'}} />
              <div style={{position: 'absolute', right: 230, top: 205, fontFamily: SANS, fontWeight: 600, fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', color: TA, width: 0, whiteSpace: 'nowrap'}} />
            </div>
          </div>
        );
      })}
      <Small x={L} y={1330} text="Mẫu màu minh hoạ độ xỉn của da" f={f} start={4.8} size={18} color={TA} />
    </>
  );
};

const Evidence = (f: number) => (
  <>
    <Header idx="02" label="Bằng chứng" f={f} color={OL} />
    <VideoPane f={f} y={400} h={900} oy={0} src0={5} block={OL} reveal={0.1} />
    <Marker f={f} start={2.2} dx={410} dy={650} lx={150} ly={1100} text="Từng tấm vải cạnh mặt" color={IV} />
    <Marker f={f} start={3.6} dx={700} dy={470} lx={420} ly={1170} text="Cùng ánh sáng" color={IV} />
    <div style={{position: 'absolute', left: L + 30, top: 1233, width: (R - L - 60) * pr(f, 5.5, 6.3, e1), height: 2, background: IV}} />
    <div style={{position: 'absolute', left: L + 30, top: 1220, width: 2, height: 28, background: IV, opacity: pr(f, 5.5, 5.8)}} />
    <div style={{position: 'absolute', left: R - 32, top: 1220, width: 2, height: 28, background: IV, opacity: pr(f, 6.2, 6.4)}} />
    <div style={{position: 'absolute', left: CX - 130, top: 1252, width: 260 + 0, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: IV, opacity: pr(f, 6.0, 6.5)}} />
    <div style={{position: 'absolute', left: L + 30, top: 1178, padding: '9px 18px', background: IV, color: ES, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', opacity: pr(f, 5.7, 6.2), display: 'none'}} />
    <div style={{position: 'absolute', left: L + 30, top: 1262, padding: '9px 18px', background: IV, color: ES, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', opacity: pr(f, 5.8, 6.3)}}>Cùng khoảng cách</div>
  </>
);

const Compare = (f: number) => {
  const col = (x: number, drape: string, label: string, sub: string, tint: number, s: number) => {
    const p = pr(f, s, s + 0.8, e1);
    return (
      <div style={{position: 'absolute', left: x, top: 420, width: 365, height: 760, overflow: 'hidden', clipPath: `inset(${(1 - p) * 100}% 0 0 0)`, background: '#EADFCF'}}>
        <div style={{position: 'absolute', left: 82, top: 90, width: 200, height: 270, borderRadius: '50%', background: interpolateColors(tint, [0, 1], ['#E8BE9E', '#B8A58F'])}} />
        <div style={{position: 'absolute', left: -20, top: 400, width: 405, height: 420, borderRadius: '50% 50% 0 0', background: drape}} />
        <div style={{position: 'absolute', left: 140, top: 330, width: 85, height: 90, background: interpolateColors(tint, [0, 1], ['#DDAF8F', '#A69582'])}} />
        <div style={{position: 'absolute', left: 82, top: 90, width: 200, height: 270, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,' + (0.35 * (1 - tint)) + '), transparent 60%)'}} />
      </div>
    );
  };
  const t2 = pr(f, 2.2, 3.0, e1);
  return (
    <>
      <Header idx="02" label="Bằng chứng" f={f} color={OL} />
      {col(L, '#C9786F', 'Hợp', 'da đều và sáng lên', 0, 0.2)}
      {col(L + 395, '#6F8478', 'Lệch tông', 'thấy xỉn ngay', t2, 0.4)}
      <div style={{position: 'absolute', left: L, top: 1215}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: ES, opacity: pr(f, 0.9, 1.4)}}>Hợp</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: OL, opacity: pr(f, 1.0, 1.5)}}>da đều, sáng lên</div>
      </div>
      <div style={{position: 'absolute', left: L + 395, top: 1215, opacity: pr(f, 2.2, 2.7)}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: BU}}>Lệch tông</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: BU}}>xỉn ngay</div>
      </div>
      <Small x={L} y={1390} text="Hình minh hoạ · không phải kết quả của một người cụ thể" f={f} start={2.8} size={16} color={TA} w={760} />
    </>
  );
};

const Eye = (f: number) => (
  <>
    <Header idx="02" label="Bằng chứng" f={f} color={OL} />
    <VideoPane f={f} y={400} h={760} oy={0} src0={13} block={RO} reveal={0.05} />
    <div style={{position: 'absolute', left: L, top: 1195}}><Words text="Tự nhìn bằng mắt mình" f={f} start={0.2} size={60} color={ES} w={R - L} /></div>
    <div style={{position: 'absolute', left: L, top: 1300}}><Words text="không cần tin lời ai" f={f} start={1.3} size={54} italic color={BU} w={R - L} /></div>
  </>
);

const GOOD = ['#C9786F', RO, '#B88A5A', OL, BU, '#E0C3A0'];
const BAD = ['#5F7F9C', '#9AA6B8', '#B9B0C9', '#4A6B5D', '#C7D0D8', '#8A7AA6'];
const Palette = (f: number) => {
  const sw = (R - L) / 6;
  return (
    <>
      <Header idx="03" label="Bảng màu" f={f} color={RO} />
      <div style={{position: 'absolute', left: L, top: 410}}><Words text="Bảng màu cố định" f={f} start={0.1} size={84} color={ES} w={R - L} /></div>
      <Small x={L} y={600} text="Nên dùng" f={f} start={1.9} size={26} color={BU} />
      {GOOD.map((c, i) => <Swatch key={i} x={L + i * sw} y={650} w={sw - 10} h={230} color={c} f={f} start={1.9 + i * 0.08} from="bottom" />)}
      <Small x={L} y={960} text="Nên né" f={f} start={3.0} size={26} color={OL} />
      {BAD.map((c, i) => <Swatch key={i} x={L + i * sw} y={1010} w={sw - 10} h={230} color={c} f={f} start={3.0 + i * 0.06} from="bottom" />)}
      <div style={{position: 'absolute', left: L, top: 1010 + 230, width: 0}} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={L} y1={1250} x2={L + (R - L) * pr(f, 3.4, 3.95, e1)} y2={1000} stroke={ES} strokeWidth={3} opacity={0.0} />
        <line x1={L} y1={1240} x2={L + (R - L) * pr(f, 3.4, 3.95, e1)} y2={1240 - 240 * pr(f, 3.4, 3.95, e1)} stroke={ES} strokeWidth={3} />
      </svg>
      <Small x={L} y={1290} text="Ví dụ minh hoạ, bảng thật lập riêng cho từng người" f={f} start={3.2} size={16} color={TA} w={760} />
    </>
  );
};

const Apply = (f: number) => {
  const rows: [string, string, number][] = [['Son', '#C9786F', 0.2], ['Áo', OL, 0.8], ['Nhuộm tóc', '#B88A5A', 1.4]];
  const strike = pr(f, 2.3, 2.9, e1);
  return (
    <>
      <Header idx="03" label="Bảng màu" f={f} color={RO} />
      {rows.map(([t, c, s], i) => {
        const y = 420 + i * 220;
        const p = pr(f, s, s + 0.7, e1);
        return (
          <div key={t}>
            <div style={{position: 'absolute', left: L, top: y, width: (R - L) * p, height: 190, border: `2px solid ${ES}`, boxSizing: 'border-box'}} />
            <Swatch x={L + 12} y={y + 12} w={166} h={166} color={c} f={f} start={s + 0.1} />
            <div style={{position: 'absolute', left: L + 215, top: y + 52, fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: ES, opacity: pr(f, s + 0.3, s + 0.8)}}>{t}</div>
            <svg width={120} height={120} style={{position: 'absolute', left: R - 150, top: y + 35, opacity: pr(f, s + 0.6, s + 0.9)}}>
              <path d="M18 62 L50 92 L104 28" fill="none" stroke={OL} strokeWidth={12} strokeDasharray={140} strokeDashoffset={140 * (1 - pr(f, s + 0.6, s + 1.1, e1))} />
            </svg>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: L, top: 1120}}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 80, color: TA, opacity: pr(f, 2.1, 2.5)}}>mua rồi bỏ xó</div>
          <div style={{position: 'absolute', left: 0, top: 54, width: `${strike * 100}%`, height: 5, background: BU}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: L, top: 1260}}><Words text="giảm hẳn" f={f} start={2.9} size={110} color={BU} w={R - L} /></div>
    </>
  );
};

const Mirror = (f: number) => {
  const cx = CX, cy = 800, R0 = 280;
  const spin = f * 1.8;
  const tint = pr(f, 0.6, 4.2, Easing.linear);
  const skin = interpolateColors(tint, [0, 0.35, 0.7, 1], ['#EFC49C', '#E8BE9E', '#D4B3A4', '#C6B2B6']);
  return (
    <>
      <Header idx="03" label="Bảng màu" f={f} color={RO} ink={IV} />
      <div style={{position: 'absolute', left: L, top: 400}}><Words text="Tự soi gương rất khó chuẩn" f={f} start={0.1} size={58} color={IV} w={R - L} italic /></div>
      <div style={{position: 'absolute', left: cx - R0, top: cy - R0, width: R0 * 2, height: R0 * 2, borderRadius: '50%', background: 'conic-gradient(from ' + spin + 'deg,#F0C98E,#E6A872,#D6A6A5,#A9B4CC,#8BA3C4,#C9D6E3,#F0E6CE,#F0C98E)', transform: `scale(${pr(f, 0.3, 1.0)})`}} />
      <div style={{position: 'absolute', left: cx - 190, top: cy - 190, width: 380, height: 380, borderRadius: '50%', background: ES}} />
      <div style={{position: 'absolute', left: cx - 150, top: cy - 150, width: 300, height: 300, borderRadius: '50%', background: skin, transform: `scale(${pr(f, 0.6, 1.2)})`}} />
      <Small x={cx} y={1130} text="Ánh sáng đổi liên tục" f={f} start={2.1} size={28} color={IV} align="center" w={700} />
      <Line x={cx - 160} y={1180} w={320} f={f} start={2.2} color={RO} />
      <div style={{position: 'absolute', left: L, top: 1230}}><Words text="Mắt mình quen với mặt mình" f={f} start={3.1} size={62} color={IV} w={R - L} /></div>
    </>
  );
};

const TestV = (f: number) => (
  <>
    <Header idx="03" label="Bảng màu" f={f} color={RO} />
    <VideoPane f={f} y={400} h={780} oy={0} src0={17.2} block={BU} reveal={0.05} />
    <div style={{position: 'absolute', left: L, top: 1215}}><Words text="Test là cách nhanh nhất" f={f} start={0.1} size={66} color={ES} w={R - L} /></div>
    <div style={{position: 'absolute', left: L, top: 1325}}><Words text="để có đáp án chắc chắn" f={f} start={2.3} size={66} italic color={BU} w={R - L} /></div>
  </>
);

const Cta = (f: number) => {
  const cols = [IV, '#4A3D33', BU, OL, RO, TA];
  return (
    <>
      {cols.map((c, i) => <Swatch key={i} x={L + i * ((R - L) / 6)} y={300} w={(R - L) / 6 - 6} h={110} color={c} f={f} start={0.1 + i * 0.08} from="bottom" />)}
      <div style={{position: 'absolute', left: L, top: 520}}><Words text="Bảng màu của bạn" f={f} start={0.4} size={88} color={IV} w={R - L} /></div>
      <div style={{position: 'absolute', left: L, top: 640}}><Words text="là gì?" f={f} start={1.0} size={110} italic color={RO} w={R - L} /></div>
      <Line x={L} y={900} w={R - L} f={f} start={1.2} color={IV} th={2} />
      <div style={{position: 'absolute', left: L, top: 960, width: 600 * pr(f, 1.4, 2.0, e1), height: 120, background: BU, overflow: 'hidden'}}>
        <div style={{width: 600, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 5, color: IV, textTransform: 'uppercase'}}>Đặt lịch tư vấn</div>
      </div>
      <Small x={L} y={1120} text="Link trong bio" f={f} start={2.1} size={28} color={IV} />
      <Small x={L} y={1300} text="Tonelux · Personal Color" f={f} start={2.4} size={20} color={TA} />
    </>
  );
};

export const ToneEditorial: React.FC = () => (
  <AbsoluteFill style={{background: IV}}>
    <Audio src={staticFile('tl/voice.mp3')} />
    <Scene s={0} e={4.7} bg={IV} wipe={BU}>{Intro}</Scene>
    <Scene s={4.7} e={7.1} bg={BU} wipe={ES}>{Heading('01', 'Nguyên nhân', IV, RO, ['#A94A5C', OL, '#5A3A2A', TA, RO, IV])}</Scene>
    <Scene s={7.1} e={10.9} bg={IV} wipe={BU}>{Shop}</Scene>
    <Scene s={10.9} e={13.5} bg={IV} wipe={RO}>{Under}</Scene>
    <Scene s={13.5} e={19.0} bg={ES} wipe={BU}>{Effects}</Scene>
    <Scene s={19.0} e={26.4} bg={IV} wipe={OL}>{Evidence}</Scene>
    <Scene s={26.4} e={30.3} bg={IV} wipe={ES}>{Compare}</Scene>
    <Scene s={30.3} e={32.8} bg={IV} wipe={OL}>{Eye}</Scene>
    <Scene s={32.8} e={34.8} bg={OL} wipe={ES}>{Heading('03', 'Bảng màu', IV, ES, GOOD)}</Scene>
    <Scene s={34.8} e={38.8} bg={IV} wipe={RO}>{Palette}</Scene>
    <Scene s={38.8} e={43.4} bg={IV} wipe={BU}>{Apply}</Scene>
    <Scene s={43.4} e={48.5} bg={ES} wipe={RO}>{Mirror}</Scene>
    <Scene s={48.5} e={52.5} bg={IV} wipe={BU}>{TestV}</Scene>
    <Scene s={52.5} e={56} bg={ES} wipe={BU}>{Cta}</Scene>
    <Caption />
  </AbsoluteFill>
);
