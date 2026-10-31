// ====== BỘ HIỆU ỨNG DÙNG CHUNG (cho TrendNews, PostThread, MomReview) ======
// fxSeed khác nhau => kiểu chuyển cảnh/sticker khác nhau => mỗi video ra một vẻ (dùng số dòng sheet).
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

const FONT = '"Be Vietnam Pro","Inter","Liberation Sans","DejaVu Sans",Arial,sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Chuyển cảnh MƯỢT: hoà tan (cross-dissolve) chồng lên cảnh trước, kèm chuyển động rất nhẹ. Không nháy, không quét.
export type FxKind = 'fade' | 'zoom';
export const FX_KINDS: FxKind[] = ['fade', 'zoom'];
export const pickFx = (seed: number, i: number): FxKind => FX_KINDS[Math.abs(seed * 5 + i) % FX_KINDS.length];
export const OV = 9; // số frame cảnh mới chồng lên cảnh cũ
export const ovFor = (i: number, dur: number) => (i === 0 ? 0 : Math.max(0, Math.min(OV, Math.floor(dur / 2))));

/** Hiệu ứng vào cảnh: đặt trong <Sequence> đã được kéo lùi `ov` frame để chồng lên cảnh trước. */
export const SceneFx: React.FC<{kind: FxKind; ov?: number; children: React.ReactNode}> = ({kind, ov = OV, children}) => {
  const frame = useCurrentFrame();
  const p = ov <= 0 ? 1 : Easing.inOut(Easing.sin)(interpolate(frame, [0, ov], [0, 1], clamp));
  let transform = 'none';
  if (kind === 'fade') transform = `scale(${1.025 - 0.025 * p})`;
  if (kind === 'zoom') transform = `scale(${1.08 - 0.08 * p})`;
  return (
    <AbsoluteFill style={{opacity: p, transform}}>
      {children}
    </AbsoluteFill>
  );
};

/** Phụ đề nảy từng từ; vài từ cuối tô màu nhấn. */
export const WordCaption: React.FC<{text: string; color: string; accent: string; size?: number; highlight?: number}> = ({text, color, accent, size = 46, highlight = 2}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const step = Math.max(2, Math.min(6, Math.floor((durationInFrames * 0.6) / Math.max(1, words.length))));
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.35}}>
      {words.map((w, i) => {
        const s = spring({frame: frame - 4 - i * step, fps, config: {damping: 10, stiffness: 170}});
        return (
          <span key={i} style={{display: 'inline-block', color: i >= words.length - highlight ? accent : color, transform: `scale(${s}) translateY(${(1 - s) * 20}px)`, opacity: Math.min(1, s * 1.5)}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Sticker emoji bật pop-up (đặt trong vùng an toàn: x < 900). */
export const StickerPop: React.FC<{emoji: string; left: number; top: number; size?: number; delay?: number; rot?: number}> = ({emoji, left, top, size = 120, delay = 8, rot = -10}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 8, stiffness: 150}});
  const bob = Math.sin((frame - delay) / 8) * 6;
  return (
    <div style={{position: 'absolute', left, top: top + bob, fontSize: size, transform: `scale(${s}) rotate(${rot}deg)`, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.3))', lineHeight: 1}}>
      {emoji}
    </div>
  );
};

const STICKERS = ['❤️', '⭐', '✅', '💡', '🍼', '👶', '✨', '🔥'];
const SPOTS = [
  {left: 70, top: 400, rot: -12},
  {left: 770, top: 420, rot: 10},
  {left: 80, top: 1080, rot: 8},
  {left: 760, top: 1100, rot: -8},
];
/** Chọn sticker + vị trí theo seed/chỉ số cảnh. */
export const AutoSticker: React.FC<{seed: number; i: number; size?: number}> = ({seed, i, size = 120}) => {
  const spot = SPOTS[Math.abs(seed + i * 2) % SPOTS.length];
  return <StickerPop emoji={STICKERS[Math.abs(seed * 3 + i) % STICKERS.length]} {...spot} size={size} delay={10} />;
};

/** Sao vàng nhảy từng sao. */
export const StarsPop: React.FC<{size?: number}> = ({size = 44}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', gap: 4}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const s = spring({frame: frame - 12 - i * 5, fps, config: {damping: 7, stiffness: 160}});
        return <span key={i} style={{fontSize: size, color: '#ffb400', transform: `scale(${s}) rotate(${(1 - s) * 40}deg)`, display: 'inline-block'}}>★</span>;
      })}
    </div>
  );
};

/** Nút Theo dõi bấm xuống -> "Đã theo dõi" + tim bay. */
export const FollowButton: React.FC<{accent?: string; fontSize?: number}> = ({accent = '#fe2c55', fontSize = 52}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame: frame - 6, fps, config: {damping: 12}});
  const press = interpolate(frame, [30, 34, 40], [1, 0.88, 1], clamp);
  const done = frame >= 34;
  return (
    <div style={{position: 'relative', width: 640, height: 130, margin: '0 auto'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 70, background: done ? '#e9e9ee' : accent, color: done ? '#555' : '#fff', fontFamily: FONT, fontWeight: 900, fontSize, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${appear * press})`, boxShadow: '0 10px 30px rgba(0,0,0,0.25)'}}>
        {done ? '✓ Đã theo dõi' : '+ Theo dõi'}
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const t = interpolate(frame, [34 + i * 3, 70 + i * 3], [0, 1], clamp);
        return (
          <span key={i} style={{position: 'absolute', left: 120 + i * 100, top: -t * 220, fontSize: 56, opacity: t > 0 ? 1 - t : 0, transform: `translateX(${Math.sin(t * 6 + i) * 24}px)`}}>
            ❤️
          </span>
        );
      })}
    </div>
  );
};

const Check: React.FC<{size: number; color: string; start: number}> = ({size, color, start}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 8], [0, 1], clamp);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 L10 17.5 L19 7" strokeDasharray="22" strokeDashoffset={22 * (1 - t)} />
    </svg>
  );
};

/** Nhãn công dụng trượt vào + dấu tick tự vẽ (đặt dưới thanh logo, trong vùng an toàn). */
export const BenefitTag: React.FC<{text: string; accent: string; ink: string; left?: number; top?: number}> = ({text, accent, ink, left = 70, top = 350}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 8, fps, config: {damping: 14, stiffness: 130}});
  return (
    <div style={{position: 'absolute', left, top, transform: `translateX(${(1 - s) * -600}px)`, opacity: Math.min(1, s * 2), display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.95)', borderRadius: 60, padding: '14px 32px 14px 18px', boxShadow: '0 8px 26px rgba(0,0,0,0.25)', fontFamily: FONT, fontWeight: 800, fontSize: 40, color: ink}}>
      <div style={{width: 54, height: 54, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Check size={34} color="#fff" start={14} />
      </div>
      {text}
    </div>
  );
};

/** Thẻ "Công dụng": các ý được tick lần lượt. */
export const BenefitChecklist: React.FC<{title: string; items: string[]; accent: string; ink: string}> = ({title, items, accent, ink}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame, fps, config: {damping: 14}});
  return (
    <div style={{position: 'absolute', left: 70, top: 600, width: 840, transform: `scale(${0.9 + 0.1 * card})`, opacity: card, background: '#fff', borderRadius: 48, border: `8px solid ${accent}`, boxShadow: '0 18px 50px rgba(190,90,110,0.3)', padding: '40px 44px', fontFamily: FONT}}>
      <div style={{fontSize: 56, fontWeight: 900, color: accent, marginBottom: 26}}>{title}</div>
      {items.map((it, i) => {
        const st = 10 + i * 16;
        const s = spring({frame: frame - st, fps, config: {damping: 14}});
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 0', borderTop: i ? '2px dashed #f3d3d9' : 'none', opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * 60}px)`}}>
            <div style={{width: 64, height: 64, borderRadius: '50%', background: accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Check size={40} color="#fff" start={st + 4} />
            </div>
            <div style={{fontSize: 46, fontWeight: 800, color: ink, lineHeight: 1.25}}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};

/** CON SỐ KHỔNG LỒ đếm tăng dần, đập mạnh khi chốt số (đặt trên video thật đã làm tối). */
export const BigStat: React.FC<{value: number; prefix?: string; suffix?: string; kicker?: string; label: string; accent: string}> = ({value, prefix = '', suffix = '', kicker, label, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const COUNT = 20;
  const t = Easing.out(Easing.cubic)(interpolate(frame, [4, 4 + COUNT], [0, 1], clamp));
  const shown = Math.round(value * t);
  const landed = frame - (4 + COUNT);
  const punch = landed >= 0 ? spring({frame: landed, fps, config: {damping: 6, stiffness: 260}}) : 0;
  const scale = 0.85 + 0.15 * Math.min(1, frame / 6) + (landed >= 0 ? (1 - punch) * -0.0 + 0.12 * (1 - Math.min(1, punch)) : 0);
  const finalStr = `${prefix}${value.toLocaleString('vi-VN')}`;
  const em = finalStr.length * 0.78 + suffix.length * 0.45 * 0.6;
  const size = Math.min(340, Math.floor(880 / Math.max(1, em)));
  const numStr = shown.toLocaleString('vi-VN');
  const shake = landed >= 0 && landed < 8 ? ((landed * 53) % 9) - 4 : 0;
  const kick = spring({frame: frame - 2, fps, config: {damping: 12}});
  const lab = spring({frame: frame - (6 + COUNT), fps, config: {damping: 11}});
  return (
    <div style={{position: 'absolute', left: 40, width: 900, top: 520, textAlign: 'center', fontFamily: FONT}}>
      {kicker && (
        <div style={{display: 'inline-block', transform: `scale(${kick})`, background: '#fff', color: accent, fontWeight: 900, fontSize: 44, letterSpacing: 2, padding: '10px 36px', borderRadius: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>
          {kicker.toUpperCase()}
        </div>
      )}
      <div style={{marginTop: 20, fontWeight: 900, fontSize: size, lineHeight: 1.05, letterSpacing: -6, whiteSpace: 'nowrap', color: '#fff', transform: `translateX(${shake}px) scale(${scale + 0.15 * Math.min(1, frame / 6)})`, WebkitTextStroke: `10px ${accent}`, paintOrder: 'stroke fill', textShadow: `0 14px 0 ${accent}, 0 28px 60px rgba(0,0,0,0.55)`}}>
        {prefix}{numStr}
        {suffix && <span style={{fontSize: size * 0.45, letterSpacing: 0, marginLeft: size * 0.02}}>{suffix}</span>}
      </div>
      <div style={{marginTop: 46, display: 'inline-block', transform: `scale(${lab}) rotate(-2deg)`, background: accent, color: '#fff', fontWeight: 900, fontSize: 60, lineHeight: 1.25, padding: '14px 40px', borderRadius: 26, boxShadow: '0 14px 36px rgba(0,0,0,0.4)'}}>
        {label}
      </div>
    </div>
  );
};

/** Tách *từ khoá* trong chuỗi thành đoạn được tô nổi. */
export const markup = (text: string): {t: string; hl: boolean}[] =>
  text.split('*').map((t, i) => ({t, hl: i % 2 === 1})).filter((x) => x.t !== '');
