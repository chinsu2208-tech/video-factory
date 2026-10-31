import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {FONT, Media} from './Template';
import {SceneFx, pickFx, ovFor, BigStat, FollowButton, markup} from './fx';
import {NewsJob, SchedSeg, NewsSeg, scheduleNews, NEWS_FPS} from './newsConfig';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ---------- Theme 2 phong cách ---------- */
export type Theme = {
  accent: string; accent2: string; ink: string; paper: string; radius: number; cardBorder: string;
  grade: string; tint: string; scrim: string; scrimDark: string; hl: string; hlInk: string; upper: boolean;
};
export const THEMES: Record<'A' | 'B' | 'C', Theme> = {
  A: {accent: '#e5162b', accent2: '#ffd400', ink: '#0b0d14', paper: '#ffffff', radius: 8, cardBorder: '#ffffff',
      grade: 'contrast(1.12) saturate(0.92) brightness(0.98)', tint: 'rgba(10,20,60,0.14)',
      scrim: 'linear-gradient(180deg, rgba(5,10,30,0.62), rgba(5,10,30,0.45) 50%, rgba(5,10,30,0.7))',
      scrimDark: 'linear-gradient(180deg, rgba(5,5,15,0.7), rgba(5,5,15,0.5) 50%, rgba(5,5,15,0.78))',
      hl: '#ffd400', hlInk: '#0b0d14', upper: true},
  B: {accent: '#ff7a45', accent2: '#7a5cff', ink: '#2a1f3d', paper: '#fffaf3', radius: 38, cardBorder: '#ffffff',
      grade: 'contrast(1.04) saturate(1.12) brightness(1.05)', tint: 'rgba(255,190,140,0.12)',
      scrim: 'linear-gradient(180deg, rgba(255,244,232,0.55), rgba(255,226,208,0.4))',
      scrimDark: 'linear-gradient(180deg, rgba(40,20,60,0.55), rgba(40,20,60,0.4) 50%, rgba(40,20,60,0.62))',
      hl: '#7a5cff', hlInk: '#ffffff', upper: false},
  C: {accent: '#ff5d73', accent2: '#2f6bff', ink: '#2b2b3a', paper: '#fffdf4', radius: 14, cardBorder: '#ffffff',
      grade: 'contrast(1.03) saturate(1.1) brightness(1.04)', tint: 'rgba(255,230,180,0.12)',
      scrim: 'linear-gradient(180deg, rgba(255,250,235,0.5), rgba(255,240,220,0.4))',
      scrimDark: 'linear-gradient(180deg, rgba(30,30,60,0.55), rgba(30,30,60,0.4) 50%, rgba(30,30,60,0.6))',
      hl: '#fff176', hlInk: '#2b2b3a', upper: false},
};
export const Ctx = React.createContext<{T: Theme; job: NewsJob}>({T: THEMES.A, job: {} as NewsJob});
export const useN = () => React.useContext(Ctx);

/* ---------- Lớp "đồng nhất" nhiều nguồn: chỉnh màu + tint + grain + vignette ---------- */
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
export const Unify: React.FC = () => {
  const {T} = useN();
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: T.tint, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundSize: '220px 220px', backgroundPosition: `${(frame * 37) % 220}px ${(frame * 53) % 220}px`, opacity: 0.1, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
    </>
  );
};

export const Clip: React.FC<{src: string; start?: number; fit?: 'cover' | 'contain'; blur?: number; zoomTo?: number; style?: React.CSSProperties}> = ({src, start, fit = 'cover', blur = 0, zoomTo = 1.06, style}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [1, zoomTo], clamp);
  return (
    <div style={{width: '100%', height: '100%', overflow: 'hidden', ...style}}>
      <div style={{width: '100%', height: '100%', transform: `scale(${z})`, filter: `${T.grade}${blur ? ` blur(${blur}px)` : ''}`}}>
        <Media src={src} startSec={start} style={{width: '100%', height: '100%', objectFit: fit}} />
      </div>
    </div>
  );
};

/* nền cho cảnh đồ hoạ: chính video thật làm mờ */
export const GfxBackdrop: React.FC<{src?: string; start?: number}> = ({src, start}) => {
  const {T} = useN();
  return (
    <AbsoluteFill style={{background: T.ink}}>
      {src && (
        <AbsoluteFill style={{transform: 'scale(1.15)'}}>
          <Clip src={src} start={start} blur={20} zoomTo={1.02} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: T.scrimDark}} />
      <Unify />
    </AbsoluteFill>
  );
};

/* ---------- Thành phần chung ---------- */
const BrandBar: React.FC = () => {
  const {T, job} = useN();
  const frame = useCurrentFrame();
  const dot = 0.5 + 0.5 * Math.sin(frame / 5);
  return (
    <>
      <div style={{position: 'absolute', left: 44, top: 226, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT}}>
        <div style={{width: 70, height: 70, borderRadius: T.radius > 20 ? 22 : 8, background: T.accent, color: '#fff', fontWeight: 900, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          {job.logoImg ? <Img src={staticFile(job.logoImg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : job.brandName.slice(0, 1)}
        </div>
        <div style={{textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>
          <div style={{fontSize: 34, fontWeight: 900, color: '#fff'}}>{job.brandName}</div>
          <div style={{fontSize: 24, fontWeight: 600, color: T.accent2}}>{job.handle}</div>
        </div>
      </div>
      {job.badge && (
        <div style={{position: 'absolute', left: 600, top: 238, display: 'flex', alignItems: 'center', gap: 12, background: T.accent, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 2, padding: '10px 24px', borderRadius: T.radius > 20 ? 40 : 6, boxShadow: '0 8px 22px rgba(0,0,0,0.35)'}}>
          <span style={{width: 16, height: 16, borderRadius: '50%', background: '#fff', opacity: 0.4 + 0.6 * dot}} />
          {job.badge}
        </div>
      )}
    </>
  );
};

const Ticker: React.FC = () => {
  const {T, job} = useN();
  const frame = useCurrentFrame();
  const text = (job.ticker.join('   ◆   ') + '   ◆   ').toUpperCase();
  const unit = text.length * 19; // ước lượng độ rộng
  const x = -((frame * 3.2) % unit);
  return (
    <div style={{position: 'absolute', left: 40, top: 1492, width: 890, height: 58, overflow: 'hidden', borderRadius: T.radius > 20 ? 30 : 6, background: T.accent, boxShadow: '0 8px 22px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center'}}>
      <div style={{whiteSpace: 'nowrap', transform: `translateX(${x}px)`, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: 1}}>
        {text}{text}{text}
      </div>
    </div>
  );
};

const SourceTag: React.FC<{text?: string; left?: number; top?: number}> = ({text, left = 44, top = 330}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!text) return null;
  const s = spring({frame: frame - 6, fps, config: {damping: 14}});
  return (
    <div style={{position: 'absolute', left, top, transform: `translateX(${(1 - s) * -400}px)`, opacity: Math.min(1, s * 2), display: 'flex', alignItems: 'stretch', fontFamily: FONT, fontSize: 26, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.62)', borderRadius: T.radius > 20 ? 30 : 4, overflow: 'hidden', maxWidth: 560}}>
      <div style={{width: 10, background: T.accent2}} />
      <div style={{padding: '8px 18px', whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};

const Rich: React.FC<{text: string; hl: string; hlInk: string; upper: boolean}> = ({text, hl, hlInk, upper}) => (
  <>
    {markup(upper ? text.toUpperCase() : text).map((x, k) =>
      x.hl ? <span key={k} style={{background: hl, color: hlInk, padding: '0 12px', margin: '0 3px', borderRadius: 8, display: 'inline-block'}}>{x.t}</span> : <span key={k}>{x.t}</span>
    )}
  </>
);

const Lower: React.FC<{text?: string; top?: number}> = ({text, top = 1240}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!text) return null;
  const s = spring({frame: frame - 8, fps, config: {damping: 15, stiffness: 130}});
  const A = T.paper === '#ffffff';
  return (
    <div style={{position: 'absolute', left: 50, top, width: 870, transform: `translateY(${(1 - s) * 140}px)`, opacity: Math.min(1, s * 1.8), fontFamily: FONT}}>
      <div style={{background: A ? 'rgba(10,12,20,0.94)' : 'rgba(255,250,243,0.97)', color: A ? '#fff' : T.ink, borderRadius: T.radius, borderLeft: A ? `14px solid ${T.accent2}` : undefined, border: A ? undefined : `5px solid ${T.accent}`, padding: A ? '22px 30px' : '22px 30px', fontSize: 54, fontWeight: 900, lineHeight: 1.25, boxShadow: '0 16px 44px rgba(0,0,0,0.45)'}}>
        <Rich text={text} hl={T.hl} hlInk={T.hlInk} upper={T.upper} />
      </div>
    </div>
  );
};

/* ---------- Các bố cục clip ---------- */
const FullView: React.FC<{s: Extract<NewsSeg, {layout: 'full'}>; hook: boolean}> = ({s, hook}) => {
  const {T, job} = useN();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const punch = hook ? interpolate(frame, [0, 12], [1.14, 1], clamp) : 1;
  const card = spring({frame: frame - 3, fps, config: {damping: 14, stiffness: 120}});
  const A = job.style === 'A';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}><Clip src={s.src} start={s.startSec} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0) 22%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5))'}} />
      <Unify />
      <BrandBar />
      <SourceTag text={s.source} />
      {hook ? (
        <div style={{position: 'absolute', left: 50, top: 1090, width: 870, transform: `translateY(${(1 - card) * 200}px)`, opacity: Math.min(1, card * 1.6), fontFamily: FONT}}>
          {job.titleTag && (
            <div style={{display: 'inline-block', background: T.accent2, color: A ? T.ink : '#fff', fontWeight: 900, fontSize: 34, letterSpacing: 2, padding: '8px 26px', borderRadius: A ? 6 : 30, transform: 'rotate(-2deg)', marginBottom: -6, marginLeft: 24, position: 'relative', zIndex: 2}}>
              {A ? '▶ ' : '✦ '}{job.titleTag.toUpperCase()}
            </div>
          )}
          <div style={{background: A ? T.accent : T.paper, color: A ? '#fff' : T.ink, borderRadius: T.radius, padding: '34px 34px', fontWeight: 900, fontSize: 70, lineHeight: 1.18, boxShadow: '0 22px 60px rgba(0,0,0,0.5)', border: A ? '6px solid #fff' : `6px solid ${T.accent}`}}>
            {job.titleLines.map((l, i) => {
              const sp = spring({frame: frame - 6 - i * 7, fps, config: {damping: 13, stiffness: 150}});
              return <div key={i} style={{opacity: Math.min(1, sp * 2), transform: `translateY(${(1 - sp) * 36}px)`}}><Rich text={l} hl={A ? T.accent2 : T.accent} hlInk={A ? T.ink : '#fff'} upper={T.upper} /></div>;
            })}
          </div>
        </div>
      ) : (
        <Lower text={s.headline} />
      )}
      <Ticker />
    </AbsoluteFill>
  );
};

const FramedView: React.FC<{s: Extract<NewsSeg, {layout: 'framed'}>; bgStart?: number}> = ({s}) => {
  const {T} = useN();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: 'scale(1.2)'}}><Clip src={s.src} start={s.startSec} blur={26} zoomTo={1.02} /></AbsoluteFill>
      <AbsoluteFill style={{background: T.scrim}} />
      <Unify />
      <BrandBar />
      <div style={{position: 'absolute', left: 190, top: 330, width: 600, height: 960, borderRadius: T.radius, overflow: 'hidden', border: `8px solid ${T.cardBorder}`, boxShadow: '0 24px 60px rgba(0,0,0,0.5)'}}>
        <Clip src={s.src} start={s.startSec} />
      </div>
      <SourceTag text={s.source} left={210} top={350} />
      <Lower text={s.headline} top={1310} />
      <Ticker />
    </AbsoluteFill>
  );
};

const SplitView: React.FC<{s: Extract<NewsSeg, {layout: 'split'}>}> = ({s}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: frame - 2, fps, config: {damping: 16}});
  const b = spring({frame: frame - 8, fps, config: {damping: 16}});
  const box = (left: number): React.CSSProperties => ({position: 'absolute', left, top: 330, width: 430, height: 780, borderRadius: T.radius, overflow: 'hidden', border: `7px solid ${T.cardBorder}`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'});
  return (
    <AbsoluteFill style={{background: T.ink}}>
      <AbsoluteFill style={{transform: 'scale(1.2)'}}><Clip src={s.src} start={s.startSec} blur={26} zoomTo={1.02} /></AbsoluteFill>
      <AbsoluteFill style={{background: T.scrimDark}} />
      <Unify />
      <BrandBar />
      <div style={{...box(55), transform: `translateY(${(1 - a) * 900}px)`}}><Clip src={s.src} start={s.startSec} /></div>
      <div style={{...box(495), transform: `translateY(${(1 - b) * 900}px)`}}><Clip src={s.src2} start={s.start2} /></div>
      <div style={{position: 'absolute', left: 430, top: 650, width: 120, height: 120, borderRadius: '50%', background: T.accent, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '6px solid #fff', transform: `scale(${spring({frame: frame - 12, fps, config: {damping: 8}})})`, zIndex: 3}}>VS</div>
      <SourceTag text={s.source} left={70} top={350} />
      <SourceTag text={s.source2} left={510} top={350} />
      <Lower text={s.headline} top={1150} />
      <Ticker />
    </AbsoluteFill>
  );
};

const PipView: React.FC<{s: Extract<NewsSeg, {layout: 'pip'}>}> = ({s}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 10, fps, config: {damping: 12, stiffness: 140}});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Clip src={s.src} start={s.startSec} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0) 22%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5))'}} />
      <Unify />
      <BrandBar />
      <div style={{position: 'absolute', left: 610, top: 360, width: 310, height: 550, borderRadius: T.radius > 20 ? 30 : 8, overflow: 'hidden', border: `7px solid ${T.cardBorder}`, boxShadow: '0 20px 50px rgba(0,0,0,0.55)', transform: `scale(${p}) rotate(${(1 - p) * 8 + 2}deg)`, transformOrigin: 'top right'}}>
        <Clip src={s.src2} start={s.start2} />
      </div>
      <SourceTag text={s.source} />
      {s.source2 && <SourceTag text={s.source2} left={500} top={925} />}
      <Lower text={s.headline} />
      <Ticker />
    </AbsoluteFill>
  );
};

/* ---------- Các cảnh motion graphic giải thích ---------- */
const Card: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 400}) => {
  const {T, job} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14}});
  const A = job.style === 'A';
  return (
    <div style={{position: 'absolute', left: 60, top, width: 860, transform: `scale(${0.92 + 0.08 * s})`, opacity: s, background: A ? 'rgba(10,12,20,0.94)' : 'rgba(255,250,243,0.97)', color: A ? '#fff' : T.ink, borderRadius: T.radius + 6, border: A ? `6px solid ${T.accent}` : `6px solid ${T.accent}`, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', padding: '38px 40px', fontFamily: FONT}}>
      {children}
    </div>
  );
};

const CompareView: React.FC<{s: Extract<NewsSeg, {layout: 'compare'}>; bg: SchedSeg}> = ({s, bg}) => {
  const {T, job} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = job.style === 'A';
  const col = (title: string, items: string[], good: boolean, delay: number) => (
    <div style={{flex: 1}}>
      <div style={{background: good ? '#1fb36b' : T.accent, color: '#fff', fontWeight: 900, fontSize: 42, textAlign: 'center', padding: '12px 0', borderRadius: T.radius}}>{title}</div>
      {items.map((it, i) => {
        const sp = spring({frame: frame - delay - i * 10, fps, config: {damping: 13}});
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '20px 4px', fontSize: 40, fontWeight: 800, opacity: Math.min(1, sp * 2), transform: `translateX(${(1 - sp) * (good ? 60 : -60)}px)`, borderBottom: `2px dashed ${A ? 'rgba(255,255,255,0.25)' : '#e8d8c8'}`}}>
            <span style={{fontSize: 44, color: good ? '#1fb36b' : T.accent, fontWeight: 900}}>{good ? '✓' : '✕'}</span>{it}
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <BrandBar />
      <Card top={470}>
        <div style={{display: 'flex', gap: 30}}>
          {col(s.leftTitle, s.leftItems, false, 8)}
          {col(s.rightTitle, s.rightItems, true, 26)}
        </div>
      </Card>
      <Ticker />
    </AbsoluteFill>
  );
};

const TimelineView: React.FC<{s: Extract<NewsSeg, {layout: 'timeline'}>; bg: SchedSeg}> = ({s, bg}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lineH = interpolate(frame, [6, 6 + s.items.length * 18], [0, 100], clamp);
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <BrandBar />
      <Card top={420}>
        <div style={{fontSize: 56, fontWeight: 900, color: T.accent2, marginBottom: 26}}>{s.title}</div>
        <div style={{position: 'relative', paddingLeft: 70}}>
          <div style={{position: 'absolute', left: 21, top: 20, bottom: 20, width: 8, background: 'rgba(128,128,128,0.3)', borderRadius: 4}}>
            <div style={{width: '100%', height: `${lineH}%`, background: T.accent, borderRadius: 4}} />
          </div>
          {s.items.map((it, i) => {
            const sp = spring({frame: frame - 8 - i * 18, fps, config: {damping: 12}});
            return (
              <div key={i} style={{position: 'relative', padding: '20px 0', opacity: Math.min(1, sp * 2), transform: `translateX(${(1 - sp) * 50}px)`}}>
                <div style={{position: 'absolute', left: -70, top: 26, width: 50, height: 50, borderRadius: '50%', background: T.accent, border: '6px solid #fff', transform: `scale(${sp})`}} />
                <div style={{fontSize: 32, fontWeight: 900, color: T.accent, letterSpacing: 2}}>{it.t.toUpperCase()}</div>
                <div style={{fontSize: 46, fontWeight: 800, lineHeight: 1.2}}>{it.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <Ticker />
    </AbsoluteFill>
  );
};

const BarsView: React.FC<{s: Extract<NewsSeg, {layout: 'bars'}>; bg: SchedSeg}> = ({s, bg}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const max = Math.max(...s.items.map((x) => x.value), 1);
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <BrandBar />
      <Card top={440}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}}>
          <div style={{fontSize: 52, fontWeight: 900, color: T.accent2}}>{s.title}</div>
          {s.note && <div style={{fontSize: 24, fontWeight: 900, background: T.accent, color: '#fff', padding: '6px 16px', borderRadius: 8}}>{s.note}</div>}
        </div>
        {s.items.map((it, i) => {
          const t = Easing.out(Easing.cubic)(interpolate(frame, [8 + i * 8, 34 + i * 8], [0, 1], clamp));
          return (
            <div key={i} style={{marginBottom: 30}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 40, fontWeight: 800, marginBottom: 10}}>
                <span>{it.label}</span>
                <span style={{color: T.accent}}>{Math.round(it.value * t)}{s.unit ?? ''}</span>
              </div>
              <div style={{height: 38, borderRadius: 20, background: 'rgba(128,128,128,0.28)', overflow: 'hidden'}}>
                <div style={{width: `${(it.value / max) * 100 * t}%`, height: '100%', borderRadius: 20, background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`}} />
              </div>
            </div>
          );
        })}
      </Card>
      <Ticker />
    </AbsoluteFill>
  );
};

const StatView: React.FC<{s: Extract<NewsSeg, {layout: 'stat'}>; bg: SchedSeg}> = ({s, bg}) => {
  const {T} = useN();
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <BrandBar />
      <BigStat value={s.value} prefix={s.prefix} suffix={s.suffix} kicker={s.kicker} label={s.label} accent={T.accent} />
      <Ticker />
    </AbsoluteFill>
  );
};


const fmtD = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const OfferView: React.FC<{s: Extract<NewsSeg, {layout: 'offer'}>; bg: SchedSeg}> = ({s, bg}) => {
  const {T} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pct = Math.round((1 - s.price / s.oldPrice) * 100);
  const sp = (d: number, damp = 12) => spring({frame: frame - d, fps, config: {damping: damp, stiffness: 140}});
  const fr = sp(2), burst = sp(10, 7), pr = sp(16, 9), gf = sp(30), st = sp(40);
  const priceT = Easing.out(Easing.cubic)(interpolate(frame, [16, 40], [0, 1], clamp));
  const shown = Math.round(s.oldPrice - (s.oldPrice - s.price) * priceT);
  const left = s.stockLeft ?? 0, total = s.stockTotal ?? 100;
  const fill = interpolate(frame, [44, 70], [1, left / total], clamp);
  const pulse = 1 + Math.sin(frame / 4) * 0.025;
  const bgSrc = 'bgSrc' in bg ? bg.bgSrc : undefined;
  const R = T.radius > 20 ? 34 : 10;
  return (
    <AbsoluteFill>
      <GfxBackdrop src={s.src ?? bgSrc} start={s.src ? s.startSec : 'bgStart' in bg ? bg.bgStart : undefined} />
      <BrandBar />
      {s.src && (
        <div style={{position: 'absolute', left: 60, top: 330, width: 400, height: 640, borderRadius: R, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: `translateY(${(1 - fr) * 700}px) rotate(${-2 * fr}deg)`}}>
          <Clip src={s.src} start={s.startSec} />
        </div>
      )}
      <div style={{position: 'absolute', left: s.src ? 490 : 60, width: s.src ? 440 : 860, top: 330, fontFamily: FONT, color: '#fff', textAlign: s.src ? 'left' : 'center'}}>
        <div style={{display: 'inline-block', background: T.accent2, color: T.hlInk, fontWeight: 900, fontSize: 30, padding: '6px 20px', borderRadius: R / 2, transform: `scale(${burst})`, transformOrigin: 'left center'}}>{T.upper ? 'GIÁ SỐC HÔM NAY' : 'Ưu đãi hôm nay'}</div>
        <div style={{marginTop: 18, fontSize: 44, fontWeight: 900, lineHeight: 1.2, textShadow: '0 3px 14px rgba(0,0,0,0.6)', opacity: Math.min(1, fr * 2)}}>{s.name}</div>
        <div style={{marginTop: 20, fontSize: 40, fontWeight: 700, opacity: 0.85, textDecoration: 'line-through', textDecorationThickness: 5, textDecorationColor: T.accent}}>{fmtD(s.oldPrice)}</div>
        <div style={{marginTop: 4, fontSize: s.src ? 104 : 150, fontWeight: 900, color: '#fff', lineHeight: 1.05, textShadow: `0 6px 0 ${T.accent}, 0 18px 40px rgba(0,0,0,0.5)`, transform: `scale(${0.9 + 0.1 * pr})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{fmtD(shown)}</div>
      </div>
      <div style={{position: 'absolute', left: s.src ? 330 : 700, top: s.src ? 850 : 270, width: 190, height: 190, borderRadius: '50%', background: T.accent, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '6px solid #fff', transform: `scale(${burst * pulse}) rotate(-10deg)`, boxShadow: '0 12px 30px rgba(0,0,0,0.45)', zIndex: 3}}>-{pct}%</div>
      {s.gifts && s.gifts.length > 0 && (
        <div style={{position: 'absolute', left: 60, width: 860, top: 1010, opacity: Math.min(1, gf * 2), transform: `translateY(${(1 - gf) * 60}px)`, background: T.paper, color: T.ink, borderRadius: R, padding: '22px 34px', fontFamily: FONT, border: `5px solid ${T.accent2}`, boxShadow: '0 14px 36px rgba(0,0,0,0.4)'}}>
          <div style={{fontSize: 30, fontWeight: 900, color: T.accent, letterSpacing: 1}}>{T.upper ? 'QUÀ TẶNG KÈM' : 'Quà tặng kèm'}</div>
          {s.gifts.map((g, i) => <div key={i} style={{fontSize: 40, fontWeight: 800, marginTop: 8}}>+ {g}</div>)}
        </div>
      )}
      {s.stockLeft != null && (
        <div style={{position: 'absolute', left: 60, width: 860, top: 1010 + (s.gifts?.length ?? 0) * 56 + 170, opacity: Math.min(1, st * 2), fontFamily: FONT, color: '#fff'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 38, fontWeight: 900, textShadow: '0 3px 12px rgba(0,0,0,0.7)'}}>
            <span>Chỉ còn <span style={{color: T.accent2, fontSize: 52}}>{Math.round(total * fill)}</span>/{total} suất</span>
            {s.deadline && <span style={{fontSize: 30, opacity: 0.95}}>{s.deadline}</span>}
          </div>
          <div style={{marginTop: 12, height: 34, borderRadius: 20, background: 'rgba(255,255,255,0.28)', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.7)'}}>
            <div style={{width: `${fill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, borderRadius: 20}} />
          </div>
        </div>
      )}
      <Ticker />
    </AbsoluteFill>
  );
};

const EndView: React.FC<{bgSrc?: string; bgStart?: number}> = ({bgSrc, bgStart}) => {
  const {T, job} = useN();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <GfxBackdrop src={bgSrc} start={bgStart} />
      <div style={{position: 'absolute', left: 40, width: 900, top: 560, textAlign: 'center', fontFamily: FONT, transform: `scale(${p})`}}>
        <div style={{width: 190, height: 190, margin: '0 auto', borderRadius: T.radius > 20 ? 50 : 14, background: T.accent, color: '#fff', fontWeight: 900, fontSize: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '6px solid #fff'}}>
          {job.logoImg ? <Img src={staticFile(job.logoImg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : job.brandName.slice(0, 1)}
        </div>
        <div style={{marginTop: 30, fontSize: 70, fontWeight: 900, color: '#fff'}}>{job.brandName}</div>
        <div style={{marginTop: 8, fontSize: 38, fontWeight: 700, color: T.accent2}}>{job.handle}</div>
        <div style={{marginTop: 34, fontSize: 38, color: '#fff', opacity: interpolate(frame, [10, 24], [0, 1], clamp), padding: '0 40px'}}>{job.cta}</div>
        <div style={{marginTop: 56}}><FollowButton accent={T.accent} /></div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Ghép ---------- */
export const NewsMix: React.FC<NewsJob> = (job) => {
  const sched = scheduleNews(job);
  const T = THEMES[job.style];
  return (
    <Ctx.Provider value={{T, job}}>
      <AbsoluteFill style={{background: '#000'}}>
        {sched.map((it, i) => {
          const from = Math.round(it.from * NEWS_FPS);
          const dur = Math.max(1, Math.round(it.to * NEWS_FPS) - from);
          const ov = ovFor(i, dur);
          let body: React.ReactNode = null;
          if ('end' in it) body = <EndView bgSrc={it.bgSrc} bgStart={it.bgStart} />;
          else {
            const s = it.seg;
            if (s.layout === 'full') body = <FullView s={s} hook={it.hook} />;
            if (s.layout === 'framed') body = <FramedView s={s} />;
            if (s.layout === 'split') body = <SplitView s={s} />;
            if (s.layout === 'pip') body = <PipView s={s} />;
            if (s.layout === 'stat') body = <StatView s={s} bg={it} />;
            if (s.layout === 'compare') body = <CompareView s={s} bg={it} />;
            if (s.layout === 'timeline') body = <TimelineView s={s} bg={it} />;
            if (s.layout === 'bars') body = <BarsView s={s} bg={it} />;
            if (s.layout === 'offer') body = <OfferView s={s} bg={it} />;
          }
          return (
            <Sequence key={i} from={from - ov} durationInFrames={dur + ov}>
              <SceneFx kind={pickFx(job.fxSeed ?? 0, i)} ov={ov}>{body}</SceneFx>
            </Sequence>
          );
        })}
        {job.voice && <Audio src={staticFile(job.voice)} />}
        {job.music && <Audio src={staticFile(job.music)} volume={0.1} />}
      </AbsoluteFill>
    </Ctx.Provider>
  );
};
