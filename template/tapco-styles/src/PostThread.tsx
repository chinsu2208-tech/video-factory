import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, theme} from './config';
import {postScenes, POST_FPS, BgLoop, PostScene} from './postConfig';
import {FONT, Logo, Media} from './Template';

type Title = Extract<PostScene, {type: 'title'}>;
type Post = Extract<PostScene, {type: 'post'}>;

/* nền loop: video/ảnh, hoặc gradient động giữ chỗ */
const LoopBg: React.FC<{bg: BgLoop}> = ({bg}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 300], [1.0, 1.08], {extrapolateRight: 'clamp'});
  if (bg.src) {
    return <Media src={bg.src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />;
  }
  const ang = 150 + Math.sin(frame / 40) * 25;
  return (
    <AbsoluteFill style={{background: `linear-gradient(${ang}deg, ${bg.from ?? '#ddd'}, ${bg.to ?? '#fff'})`}}>
      <div style={{position: 'absolute', top: 1500, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 34, color: 'rgba(0,0,0,0.35)'}}>
        video nền loop đặt ở đây (`bg.src`)
      </div>
    </AbsoluteFill>
  );
};

/* sticker logo góc phải trên, nghiêng nhẹ */
const Sticker: React.FC = () => (
  <div style={{position: 'absolute', right: 70, top: 300, transform: 'rotate(-6deg)'}}>
    <Logo size={190} radius={36} />
  </div>
);

const Avatar: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${brand.accent}, #6b4bd6)`, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: size * 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {brand.logoText.slice(0, 1)}
  </div>
);

const Meta: React.FC<{user: string; time: string; size?: number}> = ({user, time, size = 28}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT}}>
    <Avatar size={size * 1.8} />
    <span style={{fontWeight: 700, fontSize: size, color: theme.postCardText}}>{user}</span>
    <span style={{fontSize: size * 0.85, color: '#9a9a9a'}}>{time}</span>
  </div>
);

const Counter: React.FC<{c: string; size: number}> = ({c, size}) => (
  <span style={{fontSize: size, color: '#9a9a9a', background: '#efefef', borderRadius: 10, padding: '2px 12px', marginLeft: 14, fontWeight: 500}}>{c}</span>
);

const Stat: React.FC<{icon: string; v: string; size: number; color?: string}> = ({icon, v, size, color}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, marginRight: 36, color: color ?? '#666', fontSize: size}}>
    <span>{icon}</span>
    {v}
  </span>
);

const pop = (frame: number, fps: number) => spring({frame, fps, config: {damping: 15, stiffness: 140}});

/* ---- Cảnh mở đầu: thẻ bài đăng + thẻ tiêu đề ---- */
const TitleView: React.FC<{s: Title}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(frame, fps);
  const b = pop(frame - 10, fps);
  return (
    <AbsoluteFill>
      <LoopBg bg={s.bg} />
      <Sticker />
      <div style={{position: 'absolute', left: 80, right: 80, top: 540, transform: `scale(${a})`, background: theme.postCardBg, padding: '34px 40px', fontFamily: FONT, boxShadow: '0 10px 40px rgba(0,0,0,0.18)'}}>
        <Meta user={s.user} time={s.time} size={36} />
        <div style={{marginTop: 30, fontSize: 44, color: theme.postCardText, display: 'flex', alignItems: 'center'}}>
          {s.text}
          <Counter c={s.counter} size={30} />
        </div>
        <div style={{marginTop: 34, fontSize: 36}}>
          <Stat icon="❤" v={s.likes} size={36} color="#e8223c" />
          <Stat icon="◯" v={s.comments} size={36} />
          <Stat icon="⟲" v={s.reposts} size={36} />
          <Stat icon="➤" v={s.shares} size={36} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute', left: 80, right: 80, top: 1000, height: 640,
          transform: `translateY(${(1 - b) * 400}px)`, opacity: b > 0.02 ? 1 : 0,
          background: `radial-gradient(circle at 20% 90%, ${theme.cloudA}, transparent 55%), ${theme.titleCardBg}`,
          border: `6px solid ${theme.titleCardBorder}`, borderRadius: 34,
          boxShadow: `14px 14px 0 ${theme.titleCardBorder}`, fontFamily: FONT,
        }}
      >
        <div style={{position: 'absolute', left: 40, top: 30, fontSize: 52, fontWeight: 900, color: brand.accent, letterSpacing: 1}}>{brand.name}</div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 150, textAlign: 'center', fontSize: 54, lineHeight: 1.35, fontWeight: 900, color: theme.titleCardText}}>
          {s.title}
        </div>
        <div style={{position: 'absolute', right: 40, bottom: 28}}>
          <Logo size={120} radius={26} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---- Cảnh bài đăng ---- */
const PostView: React.FC<{s: Post}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(frame, fps);
  return (
    <AbsoluteFill>
      <LoopBg bg={s.bg} />
      <Sticker />
      <div style={{position: 'absolute', left: 44, right: 44, top: s.image ? 520 : 700, transform: `scale(${0.94 + 0.06 * a})`, opacity: a, display: 'flex', flexDirection: 'column', gap: 0}}>
        <div style={{background: theme.postCardBg, padding: '30px 36px', fontFamily: FONT, boxShadow: '0 10px 40px rgba(0,0,0,0.18)'}}>
          <Meta user={s.user} time={s.time} />
          <div style={{marginTop: 22, fontSize: 31, lineHeight: 1.5, color: theme.postCardText}}>
            {s.text.map((line, i) => (
              <div key={i} style={{fontWeight: i === 0 ? 800 : 400, marginTop: i === 0 ? 0 : 8}}>
                {line}
                {i === s.text.length - 1 && <Counter c={s.counter} size={24} />}
              </div>
            ))}
          </div>
          <div style={{marginTop: 24, fontSize: 28, color: '#777'}}>♡ 24 &nbsp;&nbsp; ◯ 1 &nbsp;&nbsp; ⟲ 3 &nbsp;&nbsp; ➤</div>
        </div>
        {s.image && (
          <Img src={staticFile(s.image)} style={{marginTop: 28, marginLeft: 50, width: 700, background: '#fff', objectFit: 'cover'}} />
        )}
      </div>
    </AbsoluteFill>
  );
};

const EndView: React.FC<{cta: string}> = ({cta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps);
  return (
    <AbsoluteFill style={{background: theme.endBg, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${p})`}}><Logo size={240} radius={54} /></div>
      <div style={{marginTop: 50, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: '#fff'}}>{brand.name}</div>
      <div style={{marginTop: 30, fontFamily: FONT, fontSize: 40, color: '#9aa0b4'}}>{cta}</div>
    </AbsoluteFill>
  );
};

export const PostThread: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {postScenes.map((s, i) => {
      const from = Math.round(s.from * POST_FPS);
      const dur = Math.max(1, Math.round(s.to * POST_FPS) - from);
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          {s.type === 'title' && <TitleView s={s} />}
          {s.type === 'post' && <PostView s={s} />}
          {s.type === 'end' && <EndView cta={s.cta} />}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
