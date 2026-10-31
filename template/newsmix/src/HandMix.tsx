// ====== NEWSMIX C – "SỔ TAY VIẾT TAY" cho tệp học sinh – sinh viên (gần gũi, nhiều doodle) ======
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Media} from './Template';
import {SceneFx, pickFx, ovFor, markup} from './fx';
import {NewsJob, NewsSeg, SchedSeg, scheduleNews, NEWS_FPS} from './newsConfig';
import {Clip, Unify, GfxBackdrop} from './NewsMix';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const HF = '"Mali","Be Vietnam Pro","Liberation Sans",sans-serif';
const INK = '#2b2b3a';
const BLUE = '#2f6bff';
const PINK = '#ff5d73';
const YEL = '#fff176';
const NJ = React.createContext<NewsJob>({} as NewsJob);

/* nạp font Mali (latin + vietnamese) */
const useFont = () => {
  const [h] = React.useState(() => delayRender('mali-font'));
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = staticFile('fonts/mali.css');
    document.head.appendChild(link);
    link.onload = () => {
      Promise.all([document.fonts.load('700 40px Mali', 'Việt'), document.fonts.load('700 40px Mali', 'abc'), document.fonts.load('400 40px Mali', 'Việt abc')]).then(() => continueRender(h));
    };
    link.onerror = () => continueRender(h);
  }, [h]);
};

/* ---------- Doodle vẽ dần ---------- */
const Draw: React.FC<{d: string; w: number; h: number; color?: string; sw?: number; start?: number; dur?: number; style?: React.CSSProperties; fill?: string}> = ({d, w, h, color = PINK, sw = 8, start = 8, dur = 14, style, fill = 'none'}) => {
  const frame = useCurrentFrame();
  const t = Easing.out(Easing.cubic)(interpolate(frame, [start, start + dur], [0, 1], clamp));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', overflow: 'visible', ...style}} fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    </svg>
  );
};
const Squiggle: React.FC<{w: number; style?: React.CSSProperties; color?: string; start?: number}> = ({w, style, color = PINK, start}) => {
  let d = 'M4 14';
  for (let x = 4; x < w - 20; x += 36) d += ` q9 -14 18 0 t18 0`;
  return <Draw d={d} w={w} h={28} style={style} color={color} start={start} dur={16} />;
};
const Circle: React.FC<{w: number; h: number; style?: React.CSSProperties; color?: string; start?: number}> = ({w, h, style, color = PINK, start}) => (
  <Draw d={`M${w * 0.5} 6 C${w * 0.95} 0 ${w + 6} ${h * 0.5} ${w * 0.9} ${h * 0.85} C${w * 0.6} ${h + 6} ${w * 0.1} ${h * 0.95} 6 ${h * 0.55} C-6 ${h * 0.2} ${w * 0.3} 4 ${w * 0.7} 10`} w={w} h={h} style={style} color={color} sw={9} start={start} dur={18} />
);
const Arrow: React.FC<{style?: React.CSSProperties; color?: string; start?: number; flip?: boolean}> = ({style, color = BLUE, start, flip}) => (
  <Draw d="M6 70 C40 10 120 0 170 40 M170 40 L140 36 M170 40 L162 68" w={190} h={90} style={{transform: flip ? 'scaleX(-1)' : undefined, ...style}} color={color} sw={8} start={start} dur={16} />
);
const Star: React.FC<{size?: number; style?: React.CSSProperties; color?: string; start?: number}> = ({size = 80, style, color = '#ffc400', start = 10}) => (
  <Draw d="M40 6 L50 30 L76 32 L56 48 L63 74 L40 60 L17 74 L24 48 L4 32 L30 30 Z" w={80} h={80} style={{width: size, height: size, ...style}} color={color} sw={6} start={start} fill={color + '55'} />
);

/* chữ có *highlight bút dạ* */
const Hand: React.FC<{text: string; size: number; color?: string; weight?: number; hl?: string; style?: React.CSSProperties}> = ({text, size, color = INK, weight = 700, hl = YEL, style}) => (
  <div style={{fontFamily: HF, fontWeight: weight, fontSize: size, lineHeight: 1.3, color, ...style}}>
    {markup(text).map((x, k) =>
      x.hl ? <span key={k} style={{background: `linear-gradient(transparent 38%, ${hl} 38% 92%, transparent 92%)`, padding: '0 8px', margin: '0 2px'}}>{x.t}</span> : <span key={k}>{x.t}</span>
    )}
  </div>
);

const Tape: React.FC<{style?: React.CSSProperties; color?: string}> = ({style, color = 'rgba(255,214,102,0.85)'}) => (
  <div style={{position: 'absolute', width: 130, height: 38, background: color, boxShadow: '0 2px 6px rgba(0,0,0,0.2)', ...style}} />
);

const Note: React.FC<{children: React.ReactNode; left: number; top: number; width: number; rot?: number; bg?: string; delay?: number}> = ({children, left, top, width, rot = -1.5, bg = '#fffbe0', delay = 6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 130}});
  return (
    <div style={{position: 'absolute', left, top, width, transform: `translateY(${(1 - s) * 160}px) rotate(${rot}deg) scale(${0.9 + 0.1 * s})`, opacity: Math.min(1, s * 2), background: bg, borderRadius: 10, padding: '24px 30px', boxShadow: '4px 8px 0 rgba(0,0,0,0.18), 0 18px 40px rgba(0,0,0,0.3)'}}>
      <Tape style={{left: width / 2 - 65, top: -22, transform: 'rotate(-3deg)'}} />
      {children}
    </div>
  );
};

/* tờ giấy vở kẻ ô li */
const Sheet: React.FC<{children: React.ReactNode; top: number; height?: number; rot?: number}> = ({children, top, height, rot = -1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14}});
  return (
    <div style={{position: 'absolute', left: 60, top, width: 860, height, transform: `rotate(${rot * s}deg) scale(${0.92 + 0.08 * s})`, opacity: s, background: '#fffdf4', backgroundImage: 'repeating-linear-gradient(transparent 0 61px, #bcd6f5 61px 63px)', backgroundPosition: '0 28px', borderRadius: 12, boxShadow: '5px 10px 0 rgba(0,0,0,0.16), 0 26px 60px rgba(0,0,0,0.4)', padding: '34px 44px 34px 120px', overflow: 'visible'}}>
      <div style={{position: 'absolute', left: 84, top: 0, bottom: 0, width: 3, background: '#ff9aa8'}} />
      {[110, 420, 730].map((y) => <div key={y} style={{position: 'absolute', left: 24, top: y, width: 30, height: 30, borderRadius: '50%', background: '#2b2b3a', opacity: 0.55}} />)}
      {children}
    </div>
  );
};

const Brand: React.FC = () => {
  const job = React.useContext(NJ);
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', left: 44, top: 226, display: 'flex', alignItems: 'center', gap: 14, fontFamily: HF}}>
        <div style={{width: 72, height: 72, borderRadius: '50%', background: PINK, color: '#fff', fontWeight: 700, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.35)'}}>
          {job.logoImg ? <Img src={staticFile(job.logoImg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : job.brandName.slice(0, 1)}
        </div>
        <div style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>
          <div style={{fontSize: 34, fontWeight: 700, color: '#fff'}}>{job.brandName}</div>
          <div style={{fontSize: 24, fontWeight: 400, color: YEL}}>{job.handle}</div>
        </div>
      </div>
      {job.badge && (
        <div style={{position: 'absolute', left: 640, top: 232, background: YEL, color: INK, fontFamily: HF, fontWeight: 700, fontSize: 30, padding: '8px 22px', borderRadius: 8, transform: `rotate(${3 + Math.sin(frame / 12) * 1.5}deg)`, boxShadow: '3px 5px 0 rgba(0,0,0,0.25)'}}>
          ★ {job.badge}
        </div>
      )}
    </>
  );
};

const Src: React.FC<{text?: string; left?: number; top?: number}> = ({text, left = 44, top = 330}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!text) return null;
  const s = spring({frame: frame - 6, fps, config: {damping: 14}});
  return <div style={{position: 'absolute', left, top, opacity: Math.min(1, s * 2), transform: `rotate(-2deg) translateX(${(1 - s) * -300}px)`, fontFamily: HF, fontSize: 26, fontWeight: 400, color: INK, background: 'rgba(255,255,255,0.92)', padding: '6px 16px', borderRadius: 6, boxShadow: '2px 3px 0 rgba(0,0,0,0.2)'}}>📎 {text.replace('Nguồn: ', 'nguồn: ')}</div>;
};

const TapeStrip: React.FC = () => {
  const job = React.useContext(NJ);
  const frame = useCurrentFrame();
  const text = (job.ticker.join('   ★   ') + '   ★   ').toLowerCase();
  const x = -((frame * 2.4) % (text.length * 17));
  return (
    <div style={{position: 'absolute', left: 40, top: 1494, width: 890, height: 54, overflow: 'hidden', background: 'rgba(255,214,102,0.92)', transform: 'rotate(-0.6deg)', boxShadow: '2px 4px 0 rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', clipPath: 'polygon(0 8%, 2% 0, 4% 10%, 6% 0, 100% 0, 100% 100%, 96% 92%, 94% 100%, 0 100%)'}}>
      <div style={{whiteSpace: 'nowrap', transform: `translateX(${x}px)`, fontFamily: HF, fontWeight: 700, fontSize: 28, color: INK}}>{text}{text}{text}</div>
    </div>
  );
};

const Polaroid: React.FC<{src: string; start?: number; width: number; height: number; left: number; top: number; rot: number; caption?: string; delay?: number}> = ({src, start, width, height, left, top, rot, caption, delay = 2}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 120}});
  return (
    <div style={{position: 'absolute', left, top, width, transform: `translateY(${(1 - s) * 900}px) rotate(${rot}deg)`, background: '#fff', padding: '18px 18px 70px', boxShadow: '4px 8px 0 rgba(0,0,0,0.2), 0 22px 50px rgba(0,0,0,0.45)'}}>
      <Tape style={{left: width / 2 - 65, top: -24, transform: 'rotate(2deg)'}} />
      <div style={{width: '100%', height, overflow: 'hidden'}}><Clip src={src} start={start} /></div>
      {caption && <div style={{position: 'absolute', left: 18, right: 18, bottom: 14, textAlign: 'center', fontFamily: HF, fontSize: 28, color: INK}}>{caption.replace('Nguồn: ', 'nguồn: ')}</div>}
    </div>
  );
};

/* ---------- Các cảnh ---------- */
const FullH: React.FC<{s: Extract<NewsSeg, {layout: 'full'}>; hook: boolean}> = ({s, hook}) => {
  const job = React.useContext(NJ);
  const frame = useCurrentFrame();
  const punch = hook ? interpolate(frame, [0, 12], [1.14, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}><Clip src={s.src} start={s.startSec} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5))'}} />
      <Unify />
      <Brand />
      <Src text={s.source} />
      {hook ? (
        <>
          <Note left={50} top={1010} width={870} rot={-1.5} bg="#fffbe0">
            {job.titleTag && <div style={{position: 'absolute', right: 26, top: -50, background: PINK, color: '#fff', fontFamily: HF, fontWeight: 700, fontSize: 32, padding: '6px 22px', borderRadius: 10, transform: 'rotate(4deg)', boxShadow: '3px 5px 0 rgba(0,0,0,0.25)'}}>{job.titleTag} !</div>}
            {job.titleLines.map((l, i) => <Hand key={i} text={l} size={58} />)}
            <Squiggle w={420} color={PINK} start={26} style={{left: 30, bottom: -8}} />
          </Note>
          <Arrow style={{left: 700, top: 880}} start={20} flip />
          <Star size={90} style={{left: 820, top: 330}} start={14} />
        </>
      ) : (
        s.headline && (
          <>
            <Note left={50} top={1230} width={870} rot={-1.2}><Hand text={s.headline} size={52} /></Note>
            <Squiggle w={360} color={BLUE} start={24} style={{left: 90, top: 1450}} />
          </>
        )
      )}
      <TapeStrip />
    </AbsoluteFill>
  );
};

const FramedH: React.FC<{s: Extract<NewsSeg, {layout: 'framed'}>}> = ({s}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <AbsoluteFill style={{transform: 'scale(1.2)'}}><Clip src={s.src} start={s.startSec} blur={26} zoomTo={1.02} /></AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,250,235,0.5), rgba(255,236,210,0.38))'}} />
    <Unify />
    <Brand />
    <Polaroid src={s.src} start={s.startSec} width={560} height={800} left={230} top={340} rot={-2.2} caption={s.source} />
    <Circle w={150} h={110} start={18} style={{left: 700, top: 360}} />
    <Arrow style={{left: 690, top: 480}} start={26} flip color={BLUE} />
    {s.headline && <Note left={50} top={1290} width={870} rot={1}><Hand text={s.headline} size={50} /></Note>}
    <TapeStrip />
  </AbsoluteFill>
);

const SplitH: React.FC<{s: Extract<NewsSeg, {layout: 'split'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = spring({frame: frame - 12, fps, config: {damping: 8}});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: 'scale(1.2)'}}><Clip src={s.src} start={s.startSec} blur={26} zoomTo={1.02} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,250,235,0.5), rgba(255,236,210,0.38))'}} />
      <Unify />
      <Brand />
      <Polaroid src={s.src} start={s.startSec} width={430} height={650} left={55} top={350} rot={-3} caption={s.source} />
      <Polaroid src={s.src2} start={s.start2} width={430} height={650} left={495} top={380} rot={3} caption={s.source2} delay={8} />
      <div style={{position: 'absolute', left: 440, top: 640, width: 110, height: 110, borderRadius: '50%', background: YEL, color: INK, fontFamily: HF, fontWeight: 700, fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `5px solid ${INK}`, transform: `scale(${v}) rotate(-8deg)`, zIndex: 4}}>vs</div>
      {s.headline && <Note left={50} top={1180} width={870} rot={-1}><Hand text={s.headline} size={50} /></Note>}
      <TapeStrip />
    </AbsoluteFill>
  );
};

const PipH: React.FC<{s: Extract<NewsSeg, {layout: 'pip'}>}> = ({s}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Clip src={s.src} start={s.startSec} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5))'}} />
    <Unify />
    <Brand />
    <Polaroid src={s.src2} start={s.start2} width={290} height={440} left={620} top={350} rot={5} caption={undefined} delay={10} />
    <Src text={s.source} />
    {s.headline && <Note left={50} top={1230} width={870} rot={-1}><Hand text={s.headline} size={52} /></Note>}
    <TapeStrip />
  </AbsoluteFill>
);

const StatH: React.FC<{s: Extract<NewsSeg, {layout: 'stat'}>; bg: SchedSeg}> = ({s, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = Easing.out(Easing.cubic)(interpolate(frame, [4, 24], [0, 1], clamp));
  const shown = Math.round(s.value * t);
  const land = spring({frame: frame - 24, fps, config: {damping: 6, stiffness: 240}});
  const str = `${s.prefix ?? ''}${shown.toLocaleString('vi-VN')}`;
  const size = Math.min(330, Math.floor(820 / Math.max(1, (`${s.prefix ?? ''}${s.value}`.length) * 0.7 + (s.suffix?.length ?? 0) * 0.3)));
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <Brand />
      {s.kicker && <Note left={300} top={470} width={480} rot={-4} bg={YEL}><Hand text={s.kicker} size={48} style={{textAlign: 'center'}} /></Note>}
      <div style={{position: 'absolute', left: 40, width: 900, top: 640, textAlign: 'center', fontFamily: HF, fontWeight: 700, color: '#fff', fontSize: size, lineHeight: 1.1, transform: `scale(${0.92 + 0.08 * Math.min(1, land)}) rotate(-3deg)`, textShadow: '0 6px 0 rgba(0,0,0,0.35), 0 20px 50px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>
        {str}{s.suffix && <span style={{fontSize: size * 0.42}}>{s.suffix}</span>}
      </div>
      <Circle w={820} h={size * 1.2} color={YEL} start={26} style={{left: 130, top: 610}} />
      <div style={{position: 'absolute', left: 90, width: 900, top: 640 + size * 1.25, textAlign: 'center'}}>
        <span style={{display: 'inline-block', background: PINK, color: '#fff', fontFamily: HF, fontWeight: 700, fontSize: 54, padding: '10px 36px', borderRadius: 14, transform: `rotate(2deg) scale(${Math.min(1, land)})`, boxShadow: '4px 6px 0 rgba(0,0,0,0.3)'}}>{s.label}</span>
      </div>
      <TapeStrip />
    </AbsoluteFill>
  );
};

const CompareH: React.FC<{s: Extract<NewsSeg, {layout: 'compare'}>; bg: SchedSeg}> = ({s, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const note = (title: string, items: string[], good: boolean, left: number, rot: number, delay: number) => (
    <Note left={left} top={600} width={420} rot={rot} bg={good ? '#e4ffe8' : '#ffe4ea'} delay={delay}>
      <div style={{fontFamily: HF, fontWeight: 700, fontSize: 58, color: good ? '#14a85a' : PINK, marginBottom: 10}}>{title}</div>
      {items.map((it, i) => {
        const sp = spring({frame: frame - delay - 8 - i * 9, fps, config: {damping: 13}});
        return <div key={i} style={{display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: HF, fontWeight: 700, fontSize: 44, lineHeight: 1.3, margin: '22px 0', opacity: Math.min(1, sp * 2), transform: `translateX(${(1 - sp) * 40}px)`, color: INK}}><span style={{color: good ? '#14a85a' : PINK}}>{good ? '✓' : '✗'}</span>{it}</div>;
      })}
    </Note>
  );
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <Brand />
      {note(s.leftTitle, s.leftItems, false, 60, -3, 4)}
      {note(s.rightTitle, s.rightItems, true, 510, 3, 18)}
      <Arrow style={{left: 420, top: 520}} start={30} color={YEL} />
      <TapeStrip />
    </AbsoluteFill>
  );
};

const TimelineH: React.FC<{s: Extract<NewsSeg, {layout: 'timeline'}>; bg: SchedSeg}> = ({s, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <Brand />
      <Sheet top={400} rot={-1.2}>
        <Hand text={s.title} size={56} color={BLUE} />
        <Squiggle w={300} color={YEL} start={8} style={{left: 114, top: 108}} />
        <div style={{marginTop: 30}}>
          {s.items.map((it, i) => {
            const sp = spring({frame: frame - 10 - i * 16, fps, config: {damping: 12}});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, minHeight: 126, opacity: Math.min(1, sp * 2), transform: `translateX(${(1 - sp) * 50}px)`}}>
                <div style={{width: 74, height: 74, borderRadius: '50%', border: `6px solid ${PINK}`, color: PINK, fontFamily: HF, fontWeight: 700, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fff'}}>{i + 1}</div>
                <div>
                  <div style={{fontFamily: HF, fontSize: 28, color: '#8a8a9a'}}>{it.t}</div>
                  <Hand text={it.label} size={44} />
                </div>
              </div>
            );
          })}
        </div>
      </Sheet>
      <TapeStrip />
    </AbsoluteFill>
  );
};

const BarsH: React.FC<{s: Extract<NewsSeg, {layout: 'bars'}>; bg: SchedSeg}> = ({s, bg}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...s.items.map((x) => x.value), 1);
  const cols = [PINK, BLUE, '#14a85a', '#ffa000'];
  return (
    <AbsoluteFill>
      <GfxBackdrop src={'bgSrc' in bg ? bg.bgSrc : undefined} start={'bgStart' in bg ? bg.bgStart : undefined} />
      <Brand />
      <Sheet top={420} rot={1}>
        <Hand text={s.title} size={52} color={BLUE} />
        {s.note && <div style={{position: 'absolute', right: 30, top: 30, background: YEL, fontFamily: HF, fontWeight: 700, fontSize: 24, padding: '4px 14px', borderRadius: 6, transform: 'rotate(4deg)'}}>{s.note}</div>}
        <div style={{marginTop: 28}}>
          {s.items.map((it, i) => {
            const t = Easing.out(Easing.cubic)(interpolate(frame, [8 + i * 8, 34 + i * 8], [0, 1], clamp));
            return (
              <div key={i} style={{marginBottom: 24}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: HF, fontWeight: 700, fontSize: 38, color: INK}}>
                  <span>{it.label}</span><span style={{color: cols[i % 4]}}>{Math.round(it.value * t)}{s.unit ?? ''}</span>
                </div>
                <div style={{height: 44, borderRadius: '24px 18px 26px 16px', background: 'rgba(0,0,0,0.07)'}}>
                  <div style={{width: `${(it.value / max) * 100 * t}%`, height: '100%', borderRadius: '24px 18px 26px 16px', background: cols[i % 4], opacity: 0.9}} />
                </div>
              </div>
            );
          })}
        </div>
      </Sheet>
      <TapeStrip />
    </AbsoluteFill>
  );
};


const fmtD = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const OfferH: React.FC<{s: Extract<NewsSeg, {layout: 'offer'}>; bg: SchedSeg}> = ({s, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (d: number, damp = 11) => spring({frame: frame - d, fps, config: {damping: damp, stiffness: 130}});
  const pct = Math.round((1 - s.price / s.oldPrice) * 100);
  const priceT = Easing.out(Easing.cubic)(interpolate(frame, [16, 40], [0, 1], clamp));
  const shown = Math.round(s.oldPrice - (s.oldPrice - s.price) * priceT);
  const left = s.stockLeft ?? 0, total = s.stockTotal ?? 100;
  const fill = interpolate(frame, [44, 70], [1, left / total], clamp);
  const burst = sp(10, 6), pr = sp(16, 8);
  const gifts = s.gifts ?? [];
  return (
    <AbsoluteFill>
      <GfxBackdrop src={s.src ?? ('bgSrc' in bg ? bg.bgSrc : undefined)} start={s.src ? s.startSec : 'bgStart' in bg ? bg.bgStart : undefined} />
      <Brand />
      {s.src && <Polaroid src={s.src} start={s.startSec} width={400} height={540} left={50} top={340} rot={-3} />}
      <Note left={s.src ? 480 : 80} top={360} width={s.src ? 460 : 840} rot={2} delay={6}>
        <Hand text={s.name} size={40} />
        <div style={{fontFamily: HF, fontSize: 38, color: '#888', textDecoration: 'line-through', textDecorationColor: PINK, textDecorationThickness: 5, marginTop: 8}}>{fmtD(s.oldPrice)}</div>
        <div style={{fontFamily: HF, fontWeight: 700, fontSize: s.src ? 92 : 130, color: PINK, lineHeight: 1.1, whiteSpace: 'nowrap', transform: `scale(${0.9 + 0.1 * pr})`, transformOrigin: 'left center'}}>{fmtD(shown)}</div>
        <Circle w={s.src ? 400 : 560} h={s.src ? 110 : 150} start={40} color={BLUE} style={{left: 20, top: s.src ? 205 : 230}} />
      </Note>
      <div style={{position: 'absolute', left: s.src ? 330 : 700, top: s.src ? 800 : 270, width: 170, height: 170, borderRadius: '50%', background: YEL, color: INK, fontFamily: HF, fontWeight: 700, fontSize: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `5px solid ${INK}`, transform: `scale(${burst}) rotate(-12deg)`, boxShadow: '4px 6px 0 rgba(0,0,0,0.25)', zIndex: 4}}>-{pct}%</div>
      {gifts.length > 0 && (
        <Note left={60} top={1000} width={860} rot={-1} bg="#e4ffe8" delay={26}>
          <div style={{fontFamily: HF, fontWeight: 700, fontSize: 36, color: '#14a85a'}}>quà tặng kèm nè</div>
          {gifts.map((g, i) => <Hand key={i} text={`+ ${g}`} size={40} style={{marginTop: 4}} />)}
        </Note>
      )}
      {s.stockLeft != null && (
        <div style={{position: 'absolute', left: 60, width: 860, top: 1000 + gifts.length * 56 + 190, opacity: Math.min(1, sp(40) * 2)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: HF, fontWeight: 700, fontSize: 38, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,0.7)'}}>
            <span>chỉ còn <span style={{color: YEL, fontSize: 54}}>{Math.round(total * fill)}</span>/{total} suất</span>
            {s.deadline && <span style={{fontSize: 28, color: YEL}}>{s.deadline}</span>}
          </div>
          <div style={{marginTop: 12, height: 40, borderRadius: '24px 18px 26px 16px', background: 'rgba(255,255,255,0.85)', overflow: 'hidden', border: `4px solid ${INK}`}}>
            <div style={{width: `${fill * 100}%`, height: '100%', background: PINK}} />
          </div>
        </div>
      )}
      <TapeStrip />
    </AbsoluteFill>
  );
};

const EndH: React.FC<{bgSrc?: string; bgStart?: number}> = ({bgSrc, bgStart}) => {
  const job = React.useContext(NJ);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 12}});
  const btn = spring({frame: frame - 14, fps, config: {damping: 10}});
  const done = frame >= 36;
  return (
    <AbsoluteFill>
      <GfxBackdrop src={bgSrc} start={bgStart} />
      <div style={{position: 'absolute', left: 40, width: 900, top: 520, textAlign: 'center', fontFamily: HF, transform: `scale(${p}) rotate(-2deg)`}}>
        <div style={{width: 190, height: 190, margin: '0 auto', borderRadius: '50%', background: PINK, color: '#fff', fontWeight: 700, fontSize: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '8px solid #fff', boxShadow: '4px 8px 0 rgba(0,0,0,0.25)'}}>
          {job.logoImg ? <Img src={staticFile(job.logoImg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : job.brandName.slice(0, 1)}
        </div>
        <div style={{marginTop: 26, fontSize: 70, fontWeight: 700, color: '#fff', textShadow: '0 4px 0 rgba(0,0,0,0.3)'}}>{job.brandName}</div>
        <div style={{marginTop: 4, fontSize: 38, color: YEL}}>{job.handle}</div>
        <Note left={90} top={420} width={720} rot={2} bg="#fffbe0" delay={10}><Hand text={job.cta} size={42} style={{textAlign: 'center'}} /></Note>
        <div style={{position: 'absolute', left: 150, top: 640, width: 600, height: 120, borderRadius: 60, background: done ? '#eee' : PINK, color: done ? '#666' : '#fff', fontWeight: 700, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${btn * (frame >= 32 && frame < 38 ? 0.9 : 1)})`, boxShadow: '4px 8px 0 rgba(0,0,0,0.25)'}}>{done ? '✓ đã theo dõi nha' : '+ theo dõi nha!'}</div>
      </div>
      <Star size={110} style={{left: 110, top: 380}} start={16} />
      <Star size={90} style={{left: 810, top: 760}} start={22} color={PINK} />
    </AbsoluteFill>
  );
};

export const HandMix: React.FC<NewsJob> = (job) => {
  useFont();
  const sched = scheduleNews(job);
  return (
    <NJ.Provider value={job}>
      <AbsoluteFill style={{background: '#000'}}>
        {sched.map((it, i) => {
          const from = Math.round(it.from * NEWS_FPS);
          const dur = Math.max(1, Math.round(it.to * NEWS_FPS) - from);
          const ov = ovFor(i, dur);
          let body: React.ReactNode = null;
          if ('end' in it) body = <EndH bgSrc={it.bgSrc} bgStart={it.bgStart} />;
          else {
            const s = it.seg;
            if (s.layout === 'full') body = <FullH s={s} hook={it.hook} />;
            if (s.layout === 'framed') body = <FramedH s={s} />;
            if (s.layout === 'split') body = <SplitH s={s} />;
            if (s.layout === 'pip') body = <PipH s={s} />;
            if (s.layout === 'stat') body = <StatH s={s} bg={it} />;
            if (s.layout === 'compare') body = <CompareH s={s} bg={it} />;
            if (s.layout === 'timeline') body = <TimelineH s={s} bg={it} />;
            if (s.layout === 'bars') body = <BarsH s={s} bg={it} />;
            if (s.layout === 'offer') body = <OfferH s={s} bg={it} />;
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
    </NJ.Provider>
  );
};
void Media;
