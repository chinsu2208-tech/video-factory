import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {timedShots as shots, vlog, VLOG_FPS, VLOG_END_SEC, Shot, Sticker, captions, voiceDriven} from './vlogConfig';
import {FONT, EndSceneView} from './Template';

const isVideo = (s: string) => /\.(mp4|mov|webm)$/i.test(s);

const outline = (c = '#1a1a1a', r = 4) =>
  [[-r, 0], [r, 0], [0, -r], [0, r], [-r, -r], [r, -r], [-r, r], [r, r]]
    .map(([x, y]) => `${x}px ${y}px 0 ${c}`)
    .join(',') + ', 0 6px 18px rgba(0,0,0,0.45)';

/* ---------- nền: clip thật hoặc khung giữ chỗ ---------- */
const ShotMedia: React.FC<{shot: Shot; index: number}> = ({shot, index}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  // Zoom nhẹ, xen kẽ vào/ra để tạo nhịp
  const dir = index % 2 === 0 ? [1, 1.08] : [1.08, 1];
  const z = interpolate(frame, [0, durationInFrames], dir, {extrapolateRight: 'clamp'});
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`};
  if (shot.src) {
    return isVideo(shot.src) ? (
      <OffthreadVideo
        src={staticFile(shot.src)}
        startFrom={Math.round((shot.startAt ?? 0) * VLOG_FPS)}
        muted={!vlog.keepClipAudio}
        style={style}
      />
    ) : (
      <Img src={staticFile(shot.src)} style={style} />
    );
  }
  const hue = (index * 47 + 20) % 360;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${150 + (index % 3) * 20}deg, hsl(${hue} 55% 38%), hsl(${(hue + 40) % 360} 60% 18%))`,
        transform: `scale(${z})`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        color: 'rgba(255,255,255,0.75)',
      }}
    >
      <div style={{fontSize: 70, fontWeight: 800, textAlign: 'center', padding: '0 80px', lineHeight: 1.2}}>
        {shot.label ?? 'CLIP'}
      </div>
      <div style={{fontSize: 34, marginTop: 20, opacity: 0.7}}>đặt clip vào /public rồi điền `src`</div>
    </AbsoluteFill>
  );
};

/* ---------- phụ đề: *từ* tô vàng, nhảy vào mỗi shot ---------- */
const Caption: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 13, stiffness: 220}, durationInFrames: 10});
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: vlog.captionY,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 68,
        lineHeight: 1.18,
        color: vlog.captionColor,
        textShadow: outline(),
        transform: `scale(${0.82 + 0.18 * p})`,
        opacity: Math.min(1, p * 1.6),
      }}
    >
      {parts.map((t, i) =>
        t.startsWith('*') ? (
          <span key={i} style={{color: vlog.highlight}}>{t.slice(1, -1)}</span>
        ) : (
          <span key={i}>{t}</span>
        ),
      )}
    </div>
  );
};

/* ---------- phụ đề chạy theo giọng đọc ---------- */
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const keyMarks = (toks: string[]): boolean[] => {
  const n = toks.map(norm);
  const marks = n.map((t) => vlog.highlightNumbers && /\d/.test(t));
  for (const kw of vlog.keywords) {
    const k = kw.split(/\s+/).map(norm).filter(Boolean);
    if (!k.length) continue;
    for (let i = 0; i + k.length <= n.length; i++) {
      if (k.every((x, j) => n[i + j] === x)) for (let j = 0; j < k.length; j++) marks[i + j] = true;
    }
  }
  return marks;
};

const CaptionTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const phs = captions.phrases;
  let idx = -1;
  for (let i = 0; i < phs.length; i++) if (phs[i].s <= t + 0.02) idx = i; else break;
  if (idx < 0) return null;
  const ph = phs[idx];
  const nextS = idx + 1 < phs.length ? phs[idx + 1].s : Infinity;
  if (t > Math.min(ph.e + vlog.holdAfter, nextS)) return null;
  const ws = captions.words.filter((w) => w.s >= ph.s - 0.001 && w.e <= ph.e + 0.001);
  const marks = keyMarks(ws.map((w) => w.w));
  const local = frame - Math.round(ph.s * fps);
  const p = spring({frame: local, fps, config: {damping: 13, stiffness: 220}, durationInFrames: 10});
  return (
    <div
      style={{
        position: 'absolute', left: 40, right: 40, top: vlog.captionY, textAlign: 'center', fontFamily: FONT,
        fontWeight: 800, fontSize: 68, lineHeight: 1.18, color: vlog.captionColor, textShadow: outline(),
        transform: `scale(${0.82 + 0.18 * p})`, opacity: Math.min(1, p * 1.6),
      }}
    >
      {ws.map((w, i) => {
        const speaking = vlog.highlightSpoken && t >= w.s && t < w.e;
        return (
          <span key={i} style={{color: marks[i] || speaking ? vlog.highlight : undefined}}>
            {w.w}{i < ws.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- nhãn dán ---------- */
const Sparkle: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <span style={{position: 'absolute', left: x, top: y, fontSize: s, color: '#fff', textShadow: '0 0 10px rgba(255,255,255,.8)'}}>✦</span>
);

const StickerView: React.FC<{st: Sticker}> = ({st}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 4, fps, config: {damping: 11}});
  const wrap: React.CSSProperties = {
    position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center',
    transform: `scale(${p})`, opacity: Math.min(1, p * 2), fontFamily: FONT,
  };
  if (st.kind === 'label') {
    return (
      <div style={wrap}>
        <div style={{position: 'relative', padding: '0 70px', color: '#fff', fontSize: 52, fontWeight: 700, textShadow: outline('#00000088', 3)}}>
          <Sparkle x={0} y={-14} s={34} />
          {st.text}
          <Sparkle x={st.text.length * 26 + 70} y={-26} s={28} />
        </div>
      </div>
    );
  }
  if (st.kind === 'bubble') {
    return (
      <div style={{...wrap, top: 290}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, background: '#fff', borderRadius: 18, padding: '22px 30px', boxShadow: '0 10px 30px rgba(0,0,0,.3)', maxWidth: 800}}>
          <div style={{fontSize: 40, fontWeight: 700, color: '#222', textAlign: 'center', lineHeight: 1.25}}>{st.text}</div>
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" /><path d="M16 16 L21 21" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div style={{...wrap, top: 300, flexDirection: 'column', alignItems: 'center'}}>
      <div style={{fontSize: 96, fontWeight: 900, color: vlog.highlight, textShadow: outline('#7a3b00', 5), letterSpacing: 2}}>{st.big}</div>
      <div style={{fontSize: 56, fontWeight: 800, color: '#fff', textShadow: outline('#7a3b00', 4)}}>{st.text}</div>
    </div>
  );
};

/* ---------- bìa tiêu đề đầu video ---------- */
const CoverView: React.FC<{c: NonNullable<Shot['cover']>}> = ({c}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 12}});
  return (
    <div style={{position: 'absolute', left: 48, top: 250, transform: `scale(${p})`, transformOrigin: '0 0', fontFamily: FONT}}>
      <div style={{fontSize: 92, fontWeight: 900, color: '#ff8fc0', textShadow: outline('#fff', 3), fontStyle: 'italic'}}>{c.line1}</div>
      <div style={{fontSize: 108, fontWeight: 800, color: '#fff', fontStyle: 'italic', marginTop: -6, textShadow: outline('#c0407a', 3), whiteSpace: 'nowrap'}}>
        {c.line2}
      </div>
      <div
        style={{
          position: 'absolute', left: 520, top: -74, background: '#1f3f9e', border: '6px solid #ffd84a', borderRadius: '50%',
          padding: '8px 40px', fontSize: 98, fontWeight: 900, color: '#fff', transform: 'rotate(-6deg)', boxShadow: '0 8px 20px rgba(0,0,0,.35)',
        }}
      >
        {c.badge}
      </div>
      <Sparkle x={460} y={-40} s={52} />
      <Sparkle x={-10} y={120} s={48} />
      {c.small && (
        <div style={{position: 'absolute', left: 120, top: 1050, fontSize: 70, fontWeight: 900, color: vlog.highlight, textShadow: outline('#222', 4)}}>{c.small}</div>
      )}
    </div>
  );
};

/* ---------- thẻ tên quán + địa chỉ ---------- */
const PlaceCard: React.FC<{p: NonNullable<Shot['place']>}> = ({p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = spring({frame, fps, config: {damping: 14}});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - k) * -80}px)`, opacity: k, fontFamily: FONT}}>
      <div style={{textAlign: 'center'}}>
        <div style={{display: 'inline-block', background: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: '14px 56px', fontSize: 62, fontWeight: 800, color: '#111', borderTop: `10px solid ${vlog.stickerAccent}`}}>
          {p.name}
        </div>
        <div style={{display: 'block', background: vlog.stickerAccent, borderRadius: 14, padding: '12px 30px', marginTop: 10, fontSize: 36, fontWeight: 700, color: '#fff'}}>
          {p.address}
        </div>
      </div>
    </div>
  );
};

const ShotView: React.FC<{shot: Shot; index: number}> = ({shot, index}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <ShotMedia shot={shot} index={index} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(0,0,0,0) 62%,rgba(0,0,0,0.38) 100%)'}} />
    {shot.cover && <CoverView c={shot.cover} />}
    {shot.sticker && <StickerView st={shot.sticker} />}
    {shot.place && <PlaceCard p={shot.place} />}
    {!voiceDriven && shot.caption && <Caption text={shot.caption} />}
  </AbsoluteFill>
);

export const VlogReview: React.FC = () => {
  let t = 0;
  const seqs = shots.map((s, i) => {
    const from = Math.round(t * VLOG_FPS);
    t += s.dur;
    const dur = Math.max(1, Math.round(t * VLOG_FPS) - from);
    return (
      <Sequence key={i} from={from} durationInFrames={dur}>
        <ShotView shot={s} index={i} />
      </Sequence>
    );
  });
  const endFrom = Math.round(t * VLOG_FPS);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {seqs}
      <Sequence from={endFrom} durationInFrames={Math.round(VLOG_END_SEC * VLOG_FPS)}>
        <EndSceneView s={{type: 'end', from: 0, to: VLOG_END_SEC, cta: vlog.cta}} />
      </Sequence>
      {voiceDriven && <CaptionTrack />}
      {vlog.voice && <Audio src={staticFile(vlog.voice)} />}
      {vlog.music && <Audio src={staticFile(vlog.music)} volume={0.12} />}
    </AbsoluteFill>
  );
};
