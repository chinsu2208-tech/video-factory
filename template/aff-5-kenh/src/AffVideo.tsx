import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {AffProps, Callout, Scene} from './types';
import type {Theme} from './themes';
import {loadFonts} from './fonts';

// VÙNG AN TOÀN TIKTOK (đã đo từ ảnh chụp thật, màn hình dài ~9:20 phóng video nên cắt ~100px mỗi bên):
// x 130–850 (phải chừa cột icon x>870), y 220–1380 (trên: thanh tìm kiếm; dưới: chip sản phẩm + tên kênh từ y≈1410).
// Chữ chính nằm trên y 1255; sub (tối đa 2 dòng) y 1280–1390.
const SAFE = {x0: 130, x1: 850, y0: 220, y1: 1390, textBottom: 1255, subTop: 1280};
const SAFE_W = SAFE.x1 - SAFE.x0;
// cỡ chữ lớn tự co để từ dài nhất không tràn vùng an toàn (≈0.66*size mỗi ký tự với font đậm)
const fitBig = (txt: string, size: number) => {
  const longest = Math.max(...txt.split(/\s+/).map((w) => w.length), 1);
  return Math.min(size, Math.floor(SAFE_W / (0.66 * longest)));
};

const splitSub = (t: string, max = 28): string[] => {
  const parts = t.split(/(?<=[.,;!?])\s+/);
  const out: string[] = [];
  let cur = '';
  for (const part of parts) {
    if ((cur + ' ' + part).trim().length <= max) cur = (cur + ' ' + part).trim();
    else {
      if (cur) out.push(cur);
      if (part.length <= max) cur = part;
      else {
        const words = part.split(' ');
        cur = '';
        for (const w of words) {
          if ((cur + ' ' + w).trim().length <= max) cur = (cur + ' ' + w).trim();
          else {
            out.push(cur);
            cur = w;
          }
        }
      }
    }
  }
  if (cur) out.push(cur);
  if (out.length > 1 && out[out.length - 1].length < 14) {
    const last = out.pop() as string;
    out[out.length - 1] = `${out[out.length - 1]} ${last}`;
  }
  return out;
};

const shadow = '0 2px 14px rgba(0,0,0,.55)';

const Background: React.FC<{scene: Scene; frames: number}> = ({scene, frames}) => {
  const frame = useCurrentFrame();
  if (scene.src.type === 'clip') {
    const c = scene.crop ?? {scale: 1, fx: 0.5, fy: 0.5};
    const z = c.scale * interpolate(frame, [0, frames], [1, 1.04]);
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <OffthreadVideo
          src={staticFile(`clips/${scene.src.file}.mp4`)}
          startFrom={Math.round(scene.src.startSec * 30)}
          muted
          style={{width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${z})`, transformOrigin: `${c.fx * 100}% ${c.fy * 100}%`}}
        />
      </AbsoluteFill>
    );
  }
  const zoom = interpolate(frame, [0, frames], [1, 1.035]);
  return (
    <Img
      src={staticFile(`stills/${scene.src.file}.png`)}
      style={{width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${zoom})`}}
    />
  );
};

const Rise: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay, children, style}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{opacity: t, transform: `translateY(${(1 - t) * 18}px)`, ...style}}>{children}</div>;
};

const TextStack: React.FC<{scene: Scene; theme: Theme}> = ({scene, theme}) => {
  if (!scene.lead && !scene.big && !scene.line && !scene.small) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x0,
        top: SAFE.y0,
        width: SAFE.x1 - SAFE.x0,
        height: SAFE.textBottom - SAFE.y0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        color: '#fff',
        textShadow: shadow,
      }}
    >
      {scene.lead && (
        <Rise delay={4}>
          <div style={{fontFamily: theme.accentFont, fontSize: 54, opacity: 0.92, lineHeight: 1.15}}>{scene.lead}</div>
        </Rise>
      )}
      {scene.big && (
        <Rise delay={8} style={{marginTop: 6}}>
          <div style={{fontFamily: theme.mainFont, fontWeight: theme.bigWeight, fontSize: fitBig(scene.big, scene.bigSize ?? 150), lineHeight: 1.05}}>
            {scene.big}
          </div>
        </Rise>
      )}
      {scene.line && (
        <Rise delay={12} style={{marginTop: 12}}>
          <div style={{fontFamily: theme.mainFont, fontWeight: 700, fontSize: 50, color: theme.highlight}}>{scene.line}</div>
        </Rise>
      )}
      {scene.small && (
        <Rise delay={16} style={{marginTop: 12}}>
          <div style={{fontFamily: theme.mainFont, fontWeight: 600, fontSize: 40, opacity: 0.85}}>{scene.small}</div>
        </Rise>
      )}
    </div>
  );
};

const CalloutView: React.FC<{c: Callout; i: number; theme: Theme}> = ({c, i, theme}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = 14 + i * 8;
  const s = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 120}});
  const draw = interpolate(frame, [start, start + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x1 = SAFE.x0 + 290;
  const y1 = c.top + 56;
  const [dx, dy] = c.dot;
  const len = Math.hypot(dx - x1, dy - y1);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <g fill="none" strokeLinecap="round">
          <polyline points={`${x1},${y1} ${dx},${dy}`} stroke="rgba(0,0,0,.28)" strokeWidth={6} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
          <polyline points={`${x1},${y1} ${dx},${dy}`} stroke="rgba(255,255,255,.92)" strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: dx - 13,
          top: dy - 13,
          width: 26,
          height: 26,
          borderRadius: 13,
          background: theme.dot,
          border: '4px solid #fff',
          boxSizing: 'border-box',
          boxShadow: '0 0 0 6px rgba(255,138,61,.35)',
          transform: `scale(${Math.max(0, s)})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: SAFE.x0,
          top: c.top,
          width: 290,
          height: 112,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px',
          borderRadius: 30,
          background: theme.chipBg,
          border: `1.5px solid ${theme.chipBorder}`,
          color: '#fff',
          fontFamily: theme.mainFont,
          fontWeight: 700,
          fontSize: 33,
          lineHeight: 1.15,
          textShadow: '0 2px 10px rgba(0,0,0,.45)',
          opacity: Math.min(1, Math.max(0, s)),
          transform: `translateX(${(1 - Math.min(1, Math.max(0, s))) * -30}px)`,
        }}
      >
        {c.text}
      </div>
    </>
  );
};

const SceneView: React.FC<{scene: Scene; theme: Theme; frames: number; fadeIn: number; debug?: boolean}> = ({scene, theme, frames, fadeIn, debug}) => {
  const frame = useCurrentFrame();
  const hasText = !!(scene.lead || scene.big || scene.line || scene.small);
  const showScrim = scene.scrim ?? hasText;
  const opacity = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  const subOp = interpolate(frame, [6, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const chunks = splitSub(scene.sub);
  const total = chunks.reduce((a, b) => a + b.length, 0) || 1;
  const prog = Math.min(0.999, frame / Math.max(1, frames - 12));
  let acc = 0;
  let subText = chunks[chunks.length - 1] ?? '';
  for (const ch of chunks) {
    acc += ch.length / total;
    if (prog < acc) {
      subText = ch;
      break;
    }
  }
  return (
    <AbsoluteFill style={{opacity}}>
      <Background scene={scene} frames={frames} />
      {showScrim && (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,.42) 78%, rgba(0,0,0,.5) 100%)'}} />
      )}
      <TextStack scene={scene} theme={theme} />
      {scene.callouts?.map((c, i) => <CalloutView key={i} c={c} i={i} theme={theme} />)}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x0,
          top: SAFE.subTop,
          width: SAFE.x1 - SAFE.x0,
          textAlign: 'center',
          color: '#fff',
          fontFamily: theme.mainFont,
          fontWeight: 700,
          fontSize: 42,
          textWrap: 'balance' as const,
          lineHeight: 1.25,
          textShadow: '0 2px 12px rgba(0,0,0,.7), 0 0 4px rgba(0,0,0,.5)',
          opacity: subOp,
        }}
      >
        {subText}
      </div>
      {debug && (
        <div
          style={{
            position: 'absolute',
            left: SAFE.x0,
            top: SAFE.y0,
            width: SAFE.x1 - SAFE.x0,
            height: SAFE.y1 - SAFE.y0,
            border: '3px dashed rgba(0,255,120,.8)',
            boxSizing: 'border-box',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const sceneFrames = (p: AffProps, fps: number) => p.scenes.map((sc) => Math.round((sc.sec ?? p.sceneSec) * fps));

export const makeAffVideo = (theme: Theme): React.FC<AffProps> => {
  const Comp: React.FC<AffProps> = (props) => {
    loadFonts();
    const {fps} = useVideoConfig();
    const xf = Math.round(props.xfSec * fps);
    const frames = sceneFrames(props, fps);
    let from = 0;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        {props.scenes.map((scene, i) => {
          const start = from;
          from += frames[i] - xf;
          return (
            <Sequence key={i} from={start} durationInFrames={frames[i]}>
              <SceneView scene={scene} theme={theme} frames={frames[i]} fadeIn={i === 0 ? 0 : xf} debug={props.debug} />
            </Sequence>
          );
        })}
        {props.voice ? <Audio src={staticFile(`voice/${props.voice}`)} /> : null}
      </AbsoluteFill>
    );
  };
  return Comp;
};

export const totalFrames = (p: AffProps, fps = 30) => {
  const xf = Math.round(p.xfSec * fps);
  const fr = sceneFrames(p, fps);
  return fr.reduce((a, b) => a + b, 0) - (fr.length - 1) * xf;
};
