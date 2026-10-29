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
import {brand, theme, scenes, FPS, voice, music, ClipScene, HeadlineScene, EndScene, Bg} from './config';

export const FONT = '"Be Vietnam Pro","Inter","Liberation Sans","DejaVu Sans",Arial,sans-serif';

const isVideo = (s: string) => /\.(mp4|mov|webm)$/i.test(s);

export const Media: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) =>
  isVideo(src) ? (
    <OffthreadVideo src={staticFile(src)} style={style} muted />
  ) : (
    <Img src={staticFile(src)} style={style} />
  );

export const Logo: React.FC<{size: number; radius: number}> = ({size, radius}) => {
  if (brand.logoImg && brand.logoShape === 'free') {
    return (
      <Img
        src={staticFile(brand.logoImg)}
        style={{width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'}}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: brand.logoShape === 'circle' ? size / 2 : radius,
        background: brand.logoBox,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size * 0.5,
        color: brand.logoTextColor,
        boxShadow: `0 0 28px ${brand.accent}88`,
      }}
    >
      {brand.logoImg ? (
        <Img src={staticFile(brand.logoImg)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      ) : (
        brand.logoText
      )}
    </div>
  );
};

/* ---------- Nền ---------- */
const GridBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: theme.gridBg,
      backgroundImage:
        `linear-gradient(${theme.gridLine} 3px, transparent 3px), linear-gradient(90deg, ${theme.gridLine} 3px, transparent 3px)`,
      backgroundSize: '98px 98px',
      backgroundPosition: '4px 10px',
    }}
  >
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)'}}
    />
  </AbsoluteFill>
);

export const Background: React.FC<{bg: Bg}> = ({bg}) => {
  if (bg.kind === 'grid') return <GridBg />;
  if (bg.kind === 'solid') return <AbsoluteFill style={{background: bg.color}} />;
  if (bg.kind === 'gradient')
    return <AbsoluteFill style={{background: `linear-gradient(${bg.angle ?? 160}deg, ${bg.from}, ${bg.to})`}} />;
  return <Media src={bg.src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
};

/* ---------- Cảnh clip trong khung ---------- */
const ClipSceneView: React.FC<{s: ClipScene}> = ({s}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Background bg={s.bg} />
      {/* khung clip */}
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 356,
          width: 1016,
          height: 1210,
          overflow: 'hidden',
          background: '#111',
          borderRadius: 6,
          boxShadow: '0 12px 50px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{width: '100%', height: '100%', transform: `scale(${zoom})`}}>
          {s.src ? (
            <Media src={s.src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(160deg,#2b3350 0%,#10131f 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                color: '#fff',
                fontFamily: FONT,
              }}
            >
              <div style={{fontSize: 64, fontWeight: 800, opacity: 0.9, textAlign: 'center', padding: '0 60px'}}>
                {s.label ?? 'CLIP'}
              </div>
              <div style={{fontSize: 34, opacity: 0.5}}>đặt file vào /public rồi điền `src`</div>
            </div>
          )}
        </div>
      </div>
      {/* logo kênh góc phải trên */}
      {brand.logoImg ? (
        <div style={{position: 'absolute', right: 50, top: 190}}>
          <Logo size={190} radius={24} />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            right: 50,
            top: 226,
            textAlign: 'center',
            fontFamily: FONT,
            color: '#fff',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
          }}
        >
          <div style={{fontSize: 54, fontWeight: 900, letterSpacing: 4}}>{brand.name}</div>
          <div style={{fontSize: 22, letterSpacing: 14, color: '#c9a7ff', borderTop: '2px solid #8a5cf0', paddingTop: 6}}>
            {brand.sub}
          </div>
        </div>
      )}
      {/* handle góc phải dưới */}
      <div
        style={{
          position: 'absolute',
          right: 50,
          bottom: 330,
          fontFamily: FONT,
          fontSize: 34,
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
        }}
      >
        {brand.handle}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Thẻ tiêu đề mở đầu ---------- */
const Icon: React.FC<{kind: 'play' | 'star' | 'bars' | 'flame'; size: number}> = ({kind, size}) => {
  const c = brand.accent;
  const inner = {
    play: <path d="M38 28 L72 50 L38 72 Z" fill={c} />,
    star: <path d="M50 24 L58 42 L78 44 L63 57 L68 77 L50 66 L32 77 L37 57 L22 44 L42 42 Z" fill={c} />,
    bars: (
      <g fill={c}>
        <rect x="26" y="56" width="12" height="20" />
        <rect x="44" y="44" width="12" height="32" />
        <rect x="62" y="30" width="12" height="46" />
      </g>
    ),
    flame: <path d="M50 22 C56 38 74 44 70 64 C68 76 58 80 50 80 C40 80 30 74 30 62 C30 50 42 46 44 36 C46 30 48 26 50 22 Z" fill={c} />,
  }[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="rgba(20,10,5,0.75)" stroke={c} strokeWidth="2.5" opacity="0.9" />
      {inner}
    </svg>
  );
};

const HeadlineSceneView: React.FC<{s: HeadlineScene}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panel = spring({frame, fps, config: {damping: 18}, durationInFrames: 24});
  const pill = spring({frame: frame - 8, fps, config: {damping: 16}});
  return (
    <AbsoluteFill style={{background: '#222'}}>
      {/* nền mờ */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        {s.bgSrc ? (
          <Media
            src={s.bgSrc}
            style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(26px) brightness(0.85)', transform: 'scale(1.15)'}}
          />
        ) : (
          <AbsoluteFill style={{background: `linear-gradient(180deg,${theme.headlineBg[0]} 0%,${theme.headlineBg[1]} 60%,${theme.headlineBg[2]} 100%)`, filter: 'blur(12px)'}} />
        )}
      </AbsoluteFill>
      {/* panel tối phía dưới */}
      <AbsoluteFill
        style={{
          top: 1080 + (1 - panel) * 300,
          background: `linear-gradient(180deg, rgba(8,6,6,0) 0%, ${theme.panel}ee 14%, ${theme.panel} 100%)`,
        }}
      />
      {/* trang trí */}
      <div style={{position: 'absolute', left: 800, top: 1180, opacity: 0.35}}>
        <Icon kind="flame" size={150} />
      </div>
      <div style={{position: 'absolute', left: 880, top: 1420, opacity: 0.35}}>
        <Icon kind="bars" size={170} />
      </div>
      <div style={{position: 'absolute', left: 760, top: 1650, opacity: 0.35}}>
        <Icon kind="play" size={150} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 1700, opacity: 0.35}}>
        <Icon kind="star" size={140} />
      </div>
      {/* khung cam phát sáng */}
      <div
        style={{
          position: 'absolute',
          inset: 22,
          borderRadius: 34,
          border: `5px solid ${brand.accent}`,
          boxShadow: `0 0 28px ${brand.accent}aa, inset 0 0 22px ${brand.accent}55`,
        }}
      />
      {/* thẻ thương hiệu */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 1050,
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${(1 - pill) * -700}px)`,
        }}
      >
        <div style={{zIndex: 2}}>
          <Logo size={170} radius={28} />
        </div>
        <div
          style={{
            marginLeft: -22,
            height: 112,
            width: 700,
            borderRadius: 30,
            border: `4px solid ${brand.accent}`,
            background: 'linear-gradient(90deg,#1b0f08,#2b1608)',
            boxShadow: `0 0 26px ${brand.accent}88`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 56,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 58,
            color: '#fff',
            letterSpacing: 1,
          }}
        >
          {brand.label}
        </div>
      </div>
      {/* chip ngày */}
      <div
        style={{
          position: 'absolute',
          left: 118,
          top: 1262,
          background: '#8a3b10',
          borderRadius: 12,
          padding: '12px 26px',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 36,
          color: '#ffe9d6',
          opacity: interpolate(frame, [14, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        📅 : {s.date}
      </div>
      {/* tiêu đề, hiện từng dòng */}
      <div style={{position: 'absolute', left: 118, top: 1368, width: 880, fontFamily: FONT}}>
        {s.lines.map((line, i) => {
          const start = 22 + i * 9;
          const o = interpolate(frame, [start, start + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [start, start + 10], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={i}
              style={{
                opacity: o,
                transform: `translateY(${y}px)`,
                color: '#fff',
                fontWeight: 800,
                fontSize: 44,
                lineHeight: 1.45,
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Cảnh kết ---------- */
export const EndSceneView: React.FC<{s: EndScene}> = ({s}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14}});
  const chars = Math.floor(interpolate(frame, [12, 12 + brand.handle.length * 3], [0, brand.handle.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{background: theme.endBg, alignItems: 'center'}}>
      <div style={{marginTop: 560, transform: `scale(${pop})`}}>
        <Logo size={220} radius={50} />
      </div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: 3}}>
        {brand.name}
      </div>
      {/* ô tìm kiếm */}
      <div
        style={{
          marginTop: 130,
          width: 800,
          height: 112,
          borderRadius: 14,
          background: '#fff',
          boxShadow: `-8px 0 0 #25f4ee, 8px 0 0 #fe2c55`,
          display: 'flex',
          alignItems: 'center',
          padding: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            height: '100%',
            borderRadius: 10,
            background: '#161823',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 28,
            gap: 22,
            fontFamily: FONT,
            fontSize: 46,
            color: '#e8e8ee',
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M16 16 L21 21" />
          </svg>
          <span>{brand.handle.slice(0, chars)}{caret ? '|' : ''}</span>
        </div>
      </div>
      <div style={{marginTop: 60, fontFamily: FONT, fontSize: 38, color: '#9aa0b4', opacity: interpolate(frame, [30, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {s.cta}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Ghép tất cả ---------- */
export const TrendNews: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s, i) => {
        const from = Math.round(s.from * FPS);
        const dur = Math.max(1, Math.round(s.to * FPS) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {s.type === 'headline' && <HeadlineSceneView s={s} />}
            {s.type === 'clip' && <ClipSceneView s={s} />}
            {s.type === 'end' && <EndSceneView s={s} />}
          </Sequence>
        );
      })}
      {voice && <Audio src={staticFile(voice)} />}
      {music && <Audio src={staticFile(music)} volume={0.12} />}
    </AbsoluteFill>
  );
};
