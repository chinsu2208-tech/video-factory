import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, Media} from './Template';
import {SceneFx, pickFx, ovFor, WordCaption, StarsPop, FollowButton, BenefitTag, BenefitChecklist, BigStat, markup} from './fx';
import {MomJob, MomScene, MomImage, buildMomScenes, momTheme as T, MOM_FPS, HOOK_SEC} from './momConfig';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* Nền cho cảnh đồ hoạ: CHÍNH VIDEO THẬT làm mờ, phủ nhẹ màu kem hồng để chữ/thẻ nổi bật */
const Backdrop: React.FC<{src?: string; start?: number; dark?: boolean}> = ({src, start, dark}) => {
  if (!src) {
    return (
      <AbsoluteFill style={{background: `linear-gradient(170deg, ${T.bg} 0%, ${T.bg2} 100%)`}}>
        <div style={{position: 'absolute', left: -120, top: 1500, width: 420, height: 420, borderRadius: '50%', background: '#ffd3da', opacity: 0.5}} />
        <div style={{position: 'absolute', left: 820, top: 120, width: 360, height: 360, borderRadius: '50%', background: '#ffe8c7', opacity: 0.6}} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: dark ? 'blur(5px) brightness(0.6)' : 'blur(22px) brightness(0.92) saturate(1.1)', transform: 'scale(1.15)'}}>
        <Media src={src} startSec={start} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: dark ? 'linear-gradient(180deg, rgba(40,10,20,0.55), rgba(40,10,20,0.35) 50%, rgba(40,10,20,0.6))' : 'linear-gradient(180deg, rgba(255,240,244,0.45), rgba(255,226,232,0.3))'}} />
    </AbsoluteFill>
  );
};

const Placeholder: React.FC<{label: string}> = ({label}) => (
  <div style={{width: '100%', height: '100%', background: 'linear-gradient(160deg,#ffd9e0,#ffe9d2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, fontFamily: FONT, color: T.ink}}>
    <div style={{fontSize: 60, fontWeight: 800, textAlign: 'center', padding: '0 50px'}}>{label}</div>
    <div style={{fontSize: 32, opacity: 0.5}}>đặt file vào /public</div>
  </div>
);

const TopBar: React.FC<{job: MomJob; light?: boolean}> = ({job, light}) => (
  <>
    <div style={{position: 'absolute', left: 44, top: 230, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT}}>
      <div style={{width: 76, height: 76, borderRadius: 22, background: T.accent, color: '#fff', fontWeight: 900, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        {job.logoImg ? <Img src={staticFile(job.logoImg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : job.brandName.slice(0, 1)}
      </div>
      <div>
        <div style={{fontSize: 38, fontWeight: 900, color: light ? '#fff' : T.ink, textShadow: light ? '0 2px 8px rgba(0,0,0,0.6)' : undefined}}>{job.brandName}</div>
        <div style={{fontSize: 26, fontWeight: 600, color: light ? '#ffd3da' : T.accent, textShadow: light ? '0 2px 8px rgba(0,0,0,0.6)' : undefined}}>{job.handle}</div>
      </div>
    </div>
  </>
);

/* Khung ảnh/clip bo tròn, đúng vùng an toàn */
const Frame: React.FC<{children: React.ReactNode; zoom?: number}> = ({children, zoom = 1}) => (
  <div style={{position: 'absolute', left: 70, top: 340, width: 840, height: 860, borderRadius: 52, overflow: 'hidden', border: `10px solid #fff`, boxShadow: '0 18px 50px rgba(190,90,110,0.25)', background: '#fff'}}>
    <div style={{width: '100%', height: '100%', transform: `scale(${zoom})`}}>{children}</div>
  </div>
);

const HookCard: React.FC<{lines: string[]; tag: string}> = ({lines, tag}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - 2, fps, config: {damping: 15, stiffness: 120}});
  const tagS = spring({frame: frame - 10, fps, config: {damping: 10, stiffness: 160}});
  return (
    <div style={{position: 'absolute', left: 60, top: 1130, width: 860, transform: `translateY(${(1 - card) * 160}px)`, opacity: Math.min(1, card * 1.6), fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 40, top: -34, zIndex: 2, transform: `scale(${tagS}) rotate(-3deg)`, transformOrigin: 'left center', background: `linear-gradient(90deg, ${T.accent2}, ${T.accent})`, color: '#fff', fontWeight: 900, fontSize: 32, letterSpacing: 1.5, padding: '10px 28px', borderRadius: 40, boxShadow: '0 8px 20px rgba(255,122,138,0.55)'}}>
        ✦ {tag.toUpperCase()}
      </div>
      <div style={{background: 'rgba(255,255,255,0.97)', borderRadius: 48, padding: '56px 40px 40px', boxShadow: '0 22px 60px rgba(120,40,60,0.38)', textAlign: 'center'}}>
        {lines.map((l, i) => {
          const last = i === lines.length - 1;
          const s = spring({frame: frame - 8 - i * 7, fps, config: {damping: 13, stiffness: 150}});
          const base: React.CSSProperties = {opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 40}px)`};
          return last ? (
            <div key={i} style={{...base, marginTop: 14, display: 'inline-block', transform: `translateY(${(1 - s) * 40}px) rotate(-1.5deg)`, background: `linear-gradient(90deg, ${T.accent}, #ff9a7a)`, color: '#fff', fontSize: 70, fontWeight: 900, lineHeight: 1.2, padding: '8px 30px', borderRadius: 22, boxShadow: '0 8px 22px rgba(255,122,138,0.5)'}}>{l}</div>
          ) : (
            <div key={i} style={{...base, fontSize: 66, lineHeight: 1.22, fontWeight: 900, color: T.ink}}>{markup(l).map((x, k) => x.hl ? <span key={k} style={{color: '#fff', background: '#ff3b57', padding: '0 14px', borderRadius: 14, margin: '0 4px', display: 'inline-block', transform: 'rotate(-1deg)'}}>{x.t}</span> : <span key={k}>{x.t}</span>)}</div>
          );
        })}
      </div>
    </div>
  );
};

const VideoView: React.FC<{s: Extract<MomScene, {type: 'video'}>; job: MomJob}> = ({s, job}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const zoom = s.hook ? interpolate(frame, [0, 12, durationInFrames], [1.16, 1.04, 1.0], clamp) : interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);
  const pop = spring({frame: frame - 6, fps, config: {damping: 14}});
  const cap = job.captions?.[s.idx];
  const tag = !s.hook && s.idx % 2 === 1 && job.benefits?.length ? job.benefits[Math.floor((s.idx - 1) / 2) % job.benefits.length] : undefined;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* clip FULL MÀN HÌNH 1080x1920 */}
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {s.src ? <Media src={s.src} startSec={s.startSec} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Placeholder label={`CLIP ${s.idx + 1}`} />}
      </AbsoluteFill>
      {/* lớp mờ để chữ dễ đọc */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.45) 100%)'}} />
      <TopBar job={job} light />
      {tag && <BenefitTag text={tag} accent={T.accent} ink={T.ink} />}
      {s.hook && <HookCard lines={job.hookLines} tag={job.hookTag ?? 'Mẹ bỉm cần biết'} />}
      {!s.hook && cap && (
        <div style={{position: 'absolute', left: 70, top: 1240, width: 840, transform: `scale(${pop})`, transformOrigin: 'center top', background: 'rgba(255,255,255,0.95)', borderRadius: 40, padding: '26px 34px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', fontFamily: FONT, border: `6px solid ${T.accent}`}}>
          <WordCaption text={cap} color={T.ink} accent={T.accent} size={46} />
        </div>
      )}
    </AbsoluteFill>
  );
};


const ImageView: React.FC<{img: MomImage; job: MomJob; bg: {bgSrc?: string; bgStart?: number}}> = ({img, job, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 11, stiffness: 110}});
  const fb = img.kind === 'feedback';
  return (
    <AbsoluteFill>
      <Backdrop src={bg.bgSrc} start={bg.bgStart} />
      <TopBar job={job} light={!!bg.bgSrc} />
      <div style={{position: 'absolute', left: 70, top: 340, width: 840, height: 1180, transform: `translateY(${(1 - p) * -1100}px) rotate(${fb ? -2 + (1 - p) * -8 : 0}deg)`, background: fb ? T.feedbackBg : T.card, borderRadius: 44, border: '10px solid #fff', boxShadow: '0 18px 50px rgba(190,90,110,0.3)', padding: 28, display: 'flex', flexDirection: 'column', fontFamily: FONT}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
          <div style={{background: fb ? '#2fb26b' : T.accent, color: '#fff', fontWeight: 800, fontSize: 34, padding: '10px 26px', borderRadius: 40}}>
            {fb ? '💬 Feedback mẹ bỉm' : '🛍 Sản phẩm'}
          </div>
          {fb && <StarsPop />}
        </div>
        <div style={{flex: 1, borderRadius: 28, overflow: 'hidden', background: '#fff'}}>
          {img.src ? <Img src={staticFile(img.src)} style={{width: '100%', height: '100%', objectFit: fb ? 'cover' : 'contain'}} /> : <Placeholder label={fb ? 'ẢNH FEEDBACK' : 'ẢNH SẢN PHẨM'} />}
        </div>
        {img.caption && <div style={{marginTop: 20, fontSize: 38, fontWeight: 700, color: T.ink, textAlign: 'center'}}>{img.caption}</div>}
      </div>
    </AbsoluteFill>
  );
};

const BenefitsView: React.FC<{job: MomJob; bg: {bgSrc?: string; bgStart?: number}}> = ({job, bg}) => (
  <AbsoluteFill>
    <Backdrop src={bg.bgSrc} start={bg.bgStart} />
    <TopBar job={job} light={!!bg.bgSrc} />
    <BenefitChecklist title={job.benefitsTitle ?? 'Công dụng'} items={job.benefits ?? []} accent={T.accent} ink={T.ink} />
  </AbsoluteFill>
);

const StatView: React.FC<{s: Extract<MomScene, {type: 'stat'}>; job: MomJob}> = ({s, job}) => (
  <AbsoluteFill>
    <Backdrop src={s.bgSrc} start={s.bgStart} dark />
    <TopBar job={job} light />
    <BigStat {...s.stat} accent={T.accent} />
  </AbsoluteFill>
);

const EndView: React.FC<{job: MomJob; bg: {bgSrc?: string; bgStart?: number}}> = ({job, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Backdrop src={bg.bgSrc} start={bg.bgStart} />
      <div style={{position: 'absolute', left: 40, width: 900, top: 560, textAlign: 'center', fontFamily: FONT, transform: `scale(${p})`}}>
        <div style={{width: 200, height: 200, margin: '0 auto', borderRadius: 54, background: T.accent, color: '#fff', fontWeight: 900, fontSize: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 14px 40px rgba(255,122,138,0.5)'}}>
          {job.logoImg ? <Img src={staticFile(job.logoImg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : job.brandName.slice(0, 1)}
        </div>
        <div style={{marginTop: 34, fontSize: 72, fontWeight: 900, color: T.ink}}>{job.brandName}</div>
        <div style={{marginTop: 10, fontSize: 40, fontWeight: 700, color: T.accent}}>{job.handle}</div>
        <div style={{marginTop: 40, fontSize: 38, color: T.ink, opacity: interpolate(frame, [10, 24], [0, 1], clamp), padding: '0 40px'}}>{job.cta}</div>
        <div style={{marginTop: 60}}><FollowButton accent={T.accent} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const MomReview: React.FC<MomJob> = (job) => {
  const scenes = buildMomScenes(job);
  return (
    <AbsoluteFill style={{background: T.bg}}>
      {scenes.map((s, i) => {
        const from = Math.round(s.from * MOM_FPS);
        const dur = Math.max(1, Math.round(s.to * MOM_FPS) - from);
        return (
          <Sequence key={i} from={from - ovFor(i, dur)} durationInFrames={dur + ovFor(i, dur)}>
            <SceneFx kind={pickFx(job.fxSeed ?? 0, i)} ov={ovFor(i, dur)}>
              {s.type === 'video' && <VideoView s={s} job={job} />}
              {s.type === 'image' && <ImageView img={s.img} job={job} bg={s} />}
              {s.type === 'benefits' && <BenefitsView job={job} bg={s} />}
              {s.type === 'stat' && <StatView s={s} job={job} />}
              {s.type === 'end' && <EndView job={job} bg={s} />}
            </SceneFx>
          </Sequence>
        );
      })}
      {job.voice && <Audio src={staticFile(job.voice)} />}
      {job.music && <Audio src={staticFile(job.music)} volume={0.1} />}
    </AbsoluteFill>
  );
};
void HOOK_SEC;
