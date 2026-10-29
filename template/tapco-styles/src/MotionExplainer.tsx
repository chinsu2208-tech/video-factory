import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {mx, steps, chart, Step, StepIcon, HOOK_SEC, END_SEC, MX_FPS} from './motionConfig';
import {FONT} from './Template';

const vnd = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useSpring = (delay = 0, damping = 15) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping}});
};

/* ---------- nền ---------- */
const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${mx.bg} 0%, ${mx.bg2} 100%)`}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2px)',
          backgroundSize: '54px 54px',
          backgroundPosition: `0 ${(frame * 0.6) % 54}px`,
        }}
      />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${mx.accent}1f, transparent 55%)`}} />
    </AbsoluteFill>
  );
};

const Handle: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, textAlign: 'center', fontFamily: FONT, fontSize: 36, color: mx.muted, letterSpacing: 2}}>
    {mx.handle}
  </div>
);

/* ---------- icon vẽ nét ---------- */
const Icon: React.FC<{kind: StepIcon; p: number}> = ({kind, p}) => {
  const c = {
    fill: 'none', stroke: mx.accent, strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round',
    pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p,
  } as const;
  return (
    <svg width="230" height="230" viewBox="0 0 120 120">
      {kind === 'search' && (<><circle cx="52" cy="52" r="28" {...c} /><path d="M73 73 L102 102" {...c} /></>)}
      {kind === 'box' && (<><path d="M60 12 L103 35 L103 85 L60 108 L17 85 L17 35 Z" {...c} /><path d="M17 35 L60 58 L103 35" {...c} /><path d="M60 58 L60 108" {...c} /></>)}
      {kind === 'trend' && (<><path d="M14 90 L44 58 L64 76 L104 28" {...c} /><path d="M80 28 L104 28 L104 52" {...c} /></>)}
      {kind === 'loop' && (<>
        <path d="M98 50 A40 40 0 0 0 26 38" {...c} /><path d="M22 18 L26 38 L46 34" {...c} />
        <path d="M22 70 A40 40 0 0 0 94 82" {...c} /><path d="M98 102 L94 82 L74 86" {...c} />
      </>)}
    </svg>
  );
};

/* ---------- cảnh mở đầu ---------- */
const Coin: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const x = 40 + ((i * 137) % 960);
  const delay = (i * 7) % 42;
  const t = interpolate(frame, [delay, delay + 75], [0, 1], clamp);
  const y = interpolate(t, [0, 1], [-140, 2000], {easing: Easing.in(Easing.quad)});
  const size = 70 + ((i * 29) % 40);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, #ffe9a6, ${mx.accent} 60%, #c98a00)`,
        border: '4px solid #fff3c4', color: '#7a5200', fontFamily: FONT, fontWeight: 900, fontSize: size * 0.5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `rotate(${(frame + i * 40) * 4}deg)`, opacity: t > 0 && t < 1 ? 0.95 : 0,
      }}
    >
      ₫
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpring(0);
  const b = useSpring(6);
  const c = useSpring(14);
  const value = interpolate(frame, [10, 80], [0, mx.goal], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Bg />
      {Array.from({length: 16}).map((_, i) => <Coin key={i} i={i} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: FONT}}>
        <div style={{fontSize: 56, fontWeight: 700, letterSpacing: 10, color: mx.muted, opacity: a, transform: `translateY(${(1 - a) * 40}px)`}}>
          {mx.kicker}
        </div>
        <div style={{fontSize: 190, fontWeight: 900, color: mx.text, lineHeight: 1.05, marginTop: 20, transform: `scale(${0.8 + 0.2 * b})`, opacity: b}}>
          {mx.title}
        </div>
        <div style={{fontSize: 130, fontWeight: 900, color: mx.accent, lineHeight: 1.05, opacity: b}}>{mx.titleLine2}</div>
        <div style={{marginTop: 70, fontSize: 112, fontWeight: 800, color: mx.text, fontVariantNumeric: 'tabular-nums', opacity: c}}>
          {vnd(value)}
        </div>
        <div style={{marginTop: 40, fontSize: 46, color: mx.muted, opacity: c}}>{mx.hookSub}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- cảnh từng bước ---------- */
const StepScene: React.FC<{step: Step; idx: number; prev: number}> = ({step, idx, prev}) => {
  const frame = useCurrentFrame();
  const ring = interpolate(frame, [0, 28], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const icon = interpolate(frame, [10, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const t1 = useSpring(14);
  const t2 = useSpring(22);
  const bar = useSpring(8);
  const value = interpolate(frame, [30, 85], [prev, step.target], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const BAR_W = 900;
  const fill = (value / mx.goal) * BAR_W;
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily: FONT, fontSize: 50, fontWeight: 800, letterSpacing: 8, color: mx.accent}}>
        BƯỚC {idx + 1}/{steps.length}
      </div>
      <div style={{position: 'absolute', left: 340, top: 360, width: 400, height: 400}}>
        <svg width="400" height="400" viewBox="0 0 400 400" style={{position: 'absolute'}}>
          <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
          <circle cx="200" cy="200" r="180" fill="none" stroke={mx.accent} strokeWidth="8" strokeLinecap="round" pathLength={1}
            strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-90 200 200)" />
        </svg>
        <div style={{position: 'absolute', left: 85, top: 85}}><Icon kind={step.icon} p={icon} /></div>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 850, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1.15, color: mx.text, opacity: t1, transform: `translateY(${(1 - t1) * 50}px)`}}>
        {step.title}
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1110, textAlign: 'center', fontFamily: FONT, fontSize: 48, lineHeight: 1.35, color: mx.muted, opacity: t2, transform: `translateY(${(1 - t2) * 40}px)`}}>
        {step.sub}
      </div>
      {/* thanh tiến độ */}
      <div style={{position: 'absolute', left: 90, top: 1390, width: BAR_W + 0, opacity: bar, fontFamily: FONT}}>
        <div style={{textAlign: 'center', fontSize: 84, fontWeight: 900, color: mx.text, fontVariantNumeric: 'tabular-nums', marginBottom: 34}}>
          {vnd(value)}
        </div>
        <div style={{position: 'relative', height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.14)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: fill, borderRadius: 15, background: `linear-gradient(90deg, ${mx.accent}, #ffe08a)`, boxShadow: `0 0 24px ${mx.accent}99`}} />
          {steps.map((s, i) => (
            <div key={i} style={{position: 'absolute', left: (s.target / mx.goal) * BAR_W - 3, top: -8, width: 6, height: 46, borderRadius: 3, background: i <= idx ? mx.accent : 'rgba(255,255,255,0.35)'}} />
          ))}
        </div>
        <div style={{position: 'relative', height: 50, marginTop: 14}}>
          {steps.map((s, i) => (
            <div key={i} style={{position: 'absolute', left: (s.target / mx.goal) * BAR_W - 80, width: 160, textAlign: 'center', fontSize: 30, color: i <= idx ? mx.accent : mx.muted, fontWeight: 700}}>
              {Math.round(s.target / 1_000_000)}tr
            </div>
          ))}
        </div>
      </div>
      <Handle />
    </AbsoluteFill>
  );
};

/* ---------- biểu đồ cột ---------- */
const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = useSpring(0);
  const H = 640, W = 900, n = chart.values.length, bw = 96;
  const maxV = Math.max(...chart.values);
  const final = useSpring(Math.round(0.4 * fps + n * 7 + 14), 11);
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', left: 90, right: 90, top: 250, textAlign: 'center', fontFamily: FONT, fontSize: 62, fontWeight: 800, color: mx.text, opacity: head, transform: `translateY(${(1 - head) * 40}px)`}}>
        {chart.title}
      </div>
      <div style={{position: 'absolute', left: 90, top: 450, width: W, height: H + 120, fontFamily: FONT}}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <div key={g} style={{position: 'absolute', left: 0, right: 0, top: (1 - g) * H, borderTop: '2px dashed rgba(255,255,255,0.12)'}} />
        ))}
        {chart.values.map((v, i) => {
          const p = spring({frame: frame - (10 + i * 7), fps, config: {damping: 16}});
          const h = (v / maxV) * H * p;
          const x = (W / n) * i + (W / n - bw) / 2;
          const last = i === n - 1;
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: x, top: H - h, width: bw, height: h, borderRadius: '14px 14px 0 0',
                background: last ? `linear-gradient(180deg, #ffe08a, ${mx.accent})` : 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.22))',
                boxShadow: last ? `0 0 30px ${mx.accent}88` : undefined}} />
              <div style={{position: 'absolute', left: x - 20, width: bw + 40, top: H - h - 56, textAlign: 'center', fontSize: 38, fontWeight: 800, color: last ? mx.accent : mx.text, opacity: p}}>
                {v}{chart.unit}
              </div>
              <div style={{position: 'absolute', left: x - 20, width: bw + 40, top: H + 18, textAlign: 'center', fontSize: 34, color: mx.muted}}>{chart.labels[i]}</div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', fontFamily: FONT, transform: `scale(${0.7 + 0.3 * final})`, opacity: final}}>
        <div style={{fontSize: 140, fontWeight: 900, color: mx.accent, lineHeight: 1}}>{chart.values[n - 1]} TRIỆU</div>
        <div style={{fontSize: 46, color: mx.muted, marginTop: 14}}>sau {n} tháng</div>
      </div>
      <Handle />
    </AbsoluteFill>
  );
};

/* ---------- màn kết ---------- */
const End: React.FC = () => {
  const a = useSpring(0);
  const b = useSpring(10);
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', left: 60, right: 60, top: 640, textAlign: 'center', fontFamily: FONT}}>
        <div style={{fontSize: 104, fontWeight: 900, color: mx.accent, lineHeight: 1.1, transform: `scale(${0.8 + 0.2 * a})`, opacity: a}}>{mx.cta}</div>
        <div style={{marginTop: 50, fontSize: 52, color: mx.text, opacity: b}}>{mx.ctaSub}</div>
        <div style={{marginTop: 30, fontSize: 56, fontWeight: 800, color: mx.muted, opacity: b}}>{mx.handle}</div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, bottom: 110, textAlign: 'center', fontFamily: FONT, fontSize: 32, color: mx.muted, opacity: 0.8}}>
        {mx.disclaimer}
      </div>
    </AbsoluteFill>
  );
};

export const MotionExplainer: React.FC = () => {
  let t = 0;
  const seq = (dur: number, node: React.ReactNode, key: string) => {
    const from = Math.round(t * MX_FPS);
    t += dur;
    return (
      <Sequence key={key} from={from} durationInFrames={Math.max(1, Math.round(t * MX_FPS) - from)}>
        {node}
      </Sequence>
    );
  };
  const out: React.ReactNode[] = [seq(HOOK_SEC, <Hook />, 'hook')];
  let prev = 0;
  steps.forEach((s, i) => {
    out.push(seq(s.dur, <StepScene step={s} idx={i} prev={prev} />, `s${i}`));
    prev = s.target;
  });
  out.push(seq(chart.dur, <Chart />, 'chart'));
  out.push(seq(END_SEC, <End />, 'end'));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {out}
      {mx.voice && <Audio src={staticFile(mx.voice)} />}
      {mx.music && <Audio src={staticFile(mx.music)} volume={0.12} />}
    </AbsoluteFill>
  );
};
