import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Branch, Orientation, Theme, branchTheme, brand, color, font, format, inkTone, motion, radius, safeBox, shadow, space, tilePalette } from "../brand/tokens";
import { loadHynexFonts } from "../brand/fonts";
import { HynexLogo } from "./Logo";

loadHynexFonts();

// ---------- Theme context ----------
type Ctx = { branch: Branch; theme: Theme; orientation: Orientation };
const HynexCtx = createContext<Ctx>({ branch: "media", theme: branchTheme.media, orientation: "vertical" });
export const useHynex = () => useContext(HynexCtx);

// ---------- Animation helpers ----------
/** Spring bắt đầu tại `delay` frame (trong Sequence hiện tại). "pop"/"bounce" nảy nhẹ cho cảm giác vui. */
export const useEnter = (delay = 0, kind: keyof typeof motion.spring = "soft") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: motion.spring[kind] });
};
/** Lắc nhẹ liên tục, dùng cho icon/sticker để không "đứng im". */
export const useWiggle = (amp = 3, speed = 9, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin((frame + phase) / speed) * amp;
};
/** Nhấp nhô lên xuống nhẹ. */
export const useFloat = (amp = 8, speed = 22, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin((frame + phase) / speed) * amp;
};

// ---------- Style helpers ----------
export const cardStyle = (theme: Theme, o: { tilt?: number; radius?: number; shadowOffset?: number } = {}): React.CSSProperties => ({
  background: theme.surface,
  borderRadius: o.radius ?? radius.md,
  border: theme.hardShadow ? `4px solid ${theme.outline}` : `2px solid ${theme.line}`,
  boxShadow: theme.hardShadow ? shadow.hard(theme.outline, o.shadowOffset ?? 8) : shadow.soft,
  transform: o.tilt ? `rotate(${o.tilt}deg)` : undefined,
});

/** Màu tô nổi (highlighter) cho từ khoá: tuỳ nền để luôn đọc được. */
export const markerFor = (theme: Theme) => (theme.dark ? null : theme.bg === color.lime ? color.white : color.lime);

// ---------- Tone (đổi tông theo cảnh để tạo nhịp: sáng / tối / pastel) ----------
export type ToneName = "default" | "ink" | "white" | "sky" | "peach" | "violet" | "sun";
const pastel = (bg: string): Theme => ({ ...branchTheme.media, bg, surface: color.white });
export const sceneTones: Record<ToneName, (base: Theme) => Theme> = {
  default: (b) => b,
  ink: () => inkTone,
  white: () => pastel("#FFFFFF"),
  sky: () => pastel("#CFF1FF"),
  peach: () => pastel("#FFDCCF"),
  violet: () => pastel("#E5E0FF"),
  sun: () => pastel("#FFF0B0"),
};

/** SceneBg: nền full-bleed + đổi theme cho phần con. Dùng ở đầu mỗi scene Media để đổi nhịp màu. */
export const SceneBg: React.FC<{ tone: ToneName; children: React.ReactNode }> = ({ tone, children }) => {
  const ctx = useHynex();
  const { width, height } = useVideoConfig();
  const theme = sceneTones[tone](ctx.theme);
  return (
    <HynexCtx.Provider value={{ ...ctx, theme }}>
      {tone !== "default" && (
        // position:fixed = phủ toàn khung hình (không bị giới hạn trong safe zone)
        <div style={{ position: "fixed", left: 0, top: 0, width, height, background: theme.bg, overflow: "hidden" }}>
          <Blobs theme={theme} />
        </div>
      )}
      {children}
    </HynexCtx.Provider>
  );
};

// ---------- Backgrounds ----------
const Blobs: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const dark = theme.dark;
  const c1 = dark ? `${color.lime}22` : theme.bg === color.lime ? "#E6FF9A" : `${color.lime}88`;
  const c2 = dark ? "#FF8A6B22" : theme.bg === color.lime ? "#FFFFFF66" : `${color.sky}55`;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 760, height: 700, left: -220 + Math.sin(frame / 40) * 36, top: 120 + Math.cos(frame / 50) * 30, background: c1, borderRadius: "58% 42% 55% 45% / 48% 58% 42% 52%", transform: `rotate(${frame / 4}deg)` }} />
      <div style={{ position: "absolute", width: 820, height: 760, right: -300 - Math.sin(frame / 45) * 30, bottom: 60, background: c2, borderRadius: "45% 55% 40% 60% / 55% 45% 55% 45%", transform: `rotate(${-frame / 5}deg)` }} />
    </AbsoluteFill>
  );
};

/** Hoạ tiết nhỏ trôi nổi (dấu cộng, sao, chấm) để nền sống động. */
const Floaters: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const ink = theme.dark ? color.lime : color.ink;
  const items = Array.from({ length: 9 }).map((_, i) => ({
    x: random(`fx${i}`) * 1000 + 20,
    y: random(`fy${i}`) * 1800 + 40,
    s: 22 + random(`fs${i}`) * 26,
    k: i % 3,
    sp: 18 + random(`fp${i}`) * 20,
  }));
  return (
    <AbsoluteFill style={{ opacity: 0.35 }}>
      {items.map((it, i) => (
        <div key={i} style={{ position: "absolute", left: it.x, top: it.y + Math.sin((frame + i * 9) / it.sp) * 14, transform: `rotate(${frame * (i % 2 ? 1.2 : -1.2)}deg)` }}>
          {it.k === 0 && <svg width={it.s} height={it.s} viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke={ink} strokeWidth="3.5" strokeLinecap="round" /></svg>}
          {it.k === 1 && <svg width={it.s} height={it.s} viewBox="0 0 24 24"><path d="M12 1l2.6 7.4L22 12l-7.4 2.6L12 23l-2.6-8.4L2 12l7.4-2.6z" fill={ink} /></svg>}
          {it.k === 2 && <svg width={it.s * 0.6} height={it.s * 0.6} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={ink} strokeWidth="4" /></svg>}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Background: React.FC<{ branch: Branch }> = ({ branch }) => {
  const { theme } = useHynex();
  if (branch === "edu") {
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ backgroundImage: `radial-gradient(${color.ink}22 3px, transparent 3px)`, backgroundSize: "56px 56px" }} />
        <Blobs theme={theme} />
        <Floaters theme={theme} />
      </AbsoluteFill>
    );
  }
  if (branch === "media") {
    return (
      <AbsoluteFill>
        <Blobs theme={theme} />
        <Floaters theme={theme} />
      </AbsoluteFill>
    );
  }
  if (branch === "real") return <AbsoluteFill style={{ background: "#EFEAE0" }} />;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, background: color.ink }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 220, height: 12, background: color.lime }} />
      <div style={{ position: "absolute", right: -160, bottom: -160, width: 460, height: 460, borderRadius: "50%", border: `3px solid ${color.lime}`, opacity: 0.8 }} />
      <div style={{ position: "absolute", right: -100, bottom: -100, width: 340, height: 340, borderRadius: "50%", border: `3px solid ${"#DCE3D2"}` }} />
    </AbsoluteFill>
  );
};

// ---------- Frame: nền + safe zone + wordmark ----------
export type FrameProps = {
  branch: Branch;
  orientation?: Orientation;
  children: React.ReactNode;
  showWordmark?: boolean;
  showSafeGuide?: boolean;
};
export const Frame: React.FC<FrameProps> = ({ branch, orientation = "vertical", children, showWordmark = true, showSafeGuide = false }) => {
  const theme = branchTheme[branch];
  const box = safeBox(orientation);
  return (
    <HynexCtx.Provider value={{ branch, theme, orientation }}>
      <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontBody, color: theme.text }}>
        <Background branch={branch} />
        <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h }}>{children}</div>
        {showWordmark && <Wordmark orientation={orientation} />}
        {showSafeGuide && <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, border: "3px dashed #ff3366", pointerEvents: "none" }} />}
      </AbsoluteFill>
    </HynexCtx.Provider>
  );
};

/** Wordmark: logo thật + chữ Hynex + nhãn nhánh, nằm trong viên thuốc trắng nên đọc được trên mọi nền. */
export const Wordmark: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  const { theme, branch } = useHynex();
  const f = format[orientation];
  const top = orientation === "vertical" ? 78 : 30;
  const p = useEnter(0, "pop");
  const tag = branchTheme[branch].name.replace("Hynex ", "");
  if (branch === "real") return null; // nhánh Real: không đặt nhãn thương hiệu ở góc, logo chỉ xuất hiện ở cảnh kết
  return (
    <div style={{ position: "absolute", left: f.safe.left, top, display: "flex", alignItems: "center", gap: 14, padding: "8px 22px 8px 10px", borderRadius: radius.pill, background: "#fff", border: `3px solid ${color.ink}`, boxShadow: shadow.hard(color.ink, 4), transform: `scale(${Math.min(1, p)})`, transformOrigin: "left center" }}>
      <HynexLogo size={52} />
      <div style={{ fontFamily: font.display, fontWeight: 900, fontSize: 40, letterSpacing: -0.5, color: color.ink }}>{brand.wordmark}</div>
      <div style={{ fontFamily: font.display, fontWeight: 900, fontSize: 22, letterSpacing: 1.5, padding: "4px 12px", borderRadius: radius.pill, background: color.lime, color: color.ink }}>{tag}</div>
    </div>
  );
};

// ---------- Highlighted text (vệt bút dạ quét ra) ----------
const Marked: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 10 }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const m = markerFor(theme);
  const w = interpolate(frame - delay, [0, 14], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!m) return <span style={{ color: theme.accentText }}>{children}</span>;
  return (
    <span style={{ padding: "0 0.14em", margin: "0 -0.04em", borderRadius: "0.18em", color: color.ink, backgroundImage: `linear-gradient(${m}, ${m})`, backgroundRepeat: "no-repeat", backgroundPosition: "left 70%", backgroundSize: `${w}% 62%` }}>{children}</span>
  );
};

// ---------- AnimatedHeadline ----------
export type AnimatedHeadlineProps = { text: string; size?: number; weight?: number; align?: "left" | "center"; delay?: number; highlight?: string; color?: string };
export const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({ text, size = 84, weight = font.weight.heavy, align = "left", delay = 0, highlight, color: c }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  const parts = highlight && text.includes(highlight) ? text.split(highlight) : [text];
  return (
    <div style={{ fontFamily: theme.fontDisplay, fontSize: size, fontWeight: weight, lineHeight: 1.14, letterSpacing: -1, textAlign: align, color: c ?? theme.text, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px) rotate(${(1 - p) * -1.5}deg)` }}>
      {parts[0]}
      {parts.length > 1 && <Marked delay={delay + 8}>{highlight}</Marked>}
      {parts[1]}
    </div>
  );
};

// ---------- KineticText: từng từ nảy vào, có xoay nhẹ ----------
export type KineticTextProps = { text: string; size?: number; delay?: number; stagger?: number; weight?: number; align?: "left" | "center"; color?: string; accentWords?: string[] };
export const KineticText: React.FC<KineticTextProps> = ({ text, size = 72, delay = 0, stagger = 4, weight = font.weight.heavy, align = "left", color: c, accentWords = [] }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ fontFamily: theme.fontDisplay, display: "flex", flexWrap: "wrap", gap: `4px ${size * 0.26}px`, justifyContent: align === "center" ? "center" : "flex-start", fontSize: size, fontWeight: weight, lineHeight: 1.16, letterSpacing: -1 }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: motion.spring.pop });
        const accent = accentWords.some((a) => w.replace(/[.,!?…]/g, "").toLowerCase() === a.toLowerCase());
        const inner = accent ? <Marked delay={delay + i * stagger + 6}>{w}</Marked> : w;
        return (
          <span key={i} style={{ display: "inline-block", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px) scale(${0.7 + p * 0.3}) rotate(${(1 - p) * (i % 2 ? 6 : -6)}deg)`, color: c ?? theme.text }}>
            {inner}
          </span>
        );
      })}
    </div>
  );
};

// ---------- IconTile: ô icon màu có viền, nảy + lắc nhẹ ----------
export type IconTileProps = { icon: string; size?: number; tone?: string; delay?: number; index?: number; wiggle?: boolean };
export const IconTile: React.FC<IconTileProps> = ({ icon, size = 96, tone, delay = 0, index = 0, wiggle = true }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "bounce");
  const w = useWiggle(wiggle ? 4 : 0, 10, index * 7);
  const bg = tone ?? tilePalette[index % tilePalette.length];
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: size * 0.3, background: bg, border: `4px solid ${theme.dark ? color.lime : color.ink}`, boxShadow: theme.dark ? undefined : shadow.hard(color.ink, 5), display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.56, lineHeight: 1, fontFamily: font.emoji, transform: `scale(${Math.max(0, p)}) rotate(${w * Math.min(1, p)}deg)` }}>
      {icon}
    </div>
  );
};

// ---------- Sticker: nhãn dán nghiêng, nảy ----------
export type StickerProps = { text?: string; emoji?: string; tone?: string; rotate?: number; delay?: number; size?: number };
export const Sticker: React.FC<StickerProps> = ({ text, emoji, tone, rotate = -6, delay = 0, size = 34 }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "bounce");
  const w = useWiggle(2, 12, delay);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.3}px ${size * 0.6}px`, borderRadius: radius.pill, background: tone ?? color.sun, color: color.ink, border: `4px solid ${color.ink}`, boxShadow: shadow.hard(color.ink, 5), fontFamily: font.display, fontWeight: 900, fontSize: size, transform: `scale(${Math.max(0, p)}) rotate(${rotate + w}deg)` }}>
      {emoji && <span style={{ fontFamily: font.emoji }}>{emoji}</span>}
      {text}
    </div>
  );
};

// ---------- Squiggle: gạch chân lượn sóng vẽ dần ----------
export const Squiggle: React.FC<{ width?: number; delay?: number; stroke?: string }> = ({ width = 320, delay = 0, stroke }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={width} height={28} viewBox="0 0 320 28">
      <path d="M4 14 Q 24 -4 44 14 T 84 14 T 124 14 T 164 14 T 204 14 T 244 14 T 284 14 T 316 14" fill="none" stroke={stroke ?? (theme.dark ? color.lime : color.coral)} strokeWidth="7" strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420 * (1 - p)} />
    </svg>
  );
};

// ---------- Confetti ----------
export const Confetti: React.FC<{ at?: number; count?: number; width?: number; height?: number }> = ({ at = 0, count = 28, width = 846, height = 900 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 40;
  if (t < 0 || t > 1.4) return null;
  const cols = [color.lime, color.coral, color.sky, color.sun, color.violet, color.pink];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => {
        const ang = random(`ca${i}`) * Math.PI * 2;
        const sp = 260 + random(`cs${i}`) * 520;
        const x = width / 2 + Math.cos(ang) * sp * t;
        const y = height * 0.4 + Math.sin(ang) * sp * t + 520 * t * t;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 16, height: i % 2 ? 16 : 28, borderRadius: i % 3 ? 4 : 8, background: cols[i % cols.length], opacity: 1 - Math.max(0, t - 0.8) / 0.6, transform: `rotate(${t * 720 * (i % 2 ? 1 : -1)}deg)` }} />;
      })}
    </div>
  );
};

// ---------- InfoCard: tile icon + tiêu đề + mô tả, hơi nghiêng ----------
export type InfoCardProps = { title: string; body?: string; icon?: string; accent?: string; delay?: number; width?: number | string; tone?: "default" | "accent"; index?: number; tilt?: number };
export const InfoCard: React.FC<InfoCardProps> = ({ title, body, icon, accent, delay = 0, width = "100%", tone = "default", index = 0, tilt }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  const t = tilt ?? (index % 2 ? 0.8 : -0.8);
  const filled = tone === "accent";
  const bg = filled ? accent ?? (theme.dark ? color.lime : theme.accent) : theme.surface;
  const fg = filled ? (bg === color.ink ? color.lime : color.ink) : theme.text;
  return (
    <div style={{ ...cardStyle(theme, { tilt: t * Math.min(1, p) }), background: bg, color: fg, width, boxSizing: "border-box", padding: space.md, display: "flex", gap: space.sm + 4, alignItems: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 44}px) rotate(${t * Math.min(1, p)}deg) scale(${0.94 + 0.06 * Math.min(1, p)})` }}>
      {icon && <IconTile icon={icon} index={index} delay={delay + 4} tone={accent && !filled ? accent : undefined} />}
      <div>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, fontWeight: 900, lineHeight: 1.18 }}>{title}</div>
        {body && <div style={{ fontSize: 29, marginTop: 6, lineHeight: 1.4, color: filled ? fg : theme.muted, fontWeight: 500 }}>{body}</div>}
      </div>
    </div>
  );
};

// ---------- Button ----------
export type ButtonProps = { label: string; delay?: number; pressedAt?: number; variant?: "solid" | "outline"; size?: number };
export const Button: React.FC<ButtonProps> = ({ label, delay = 0, pressedAt, variant = "solid", size = 34 }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const p = useEnter(delay, "pop");
  const float = useFloat(4, 14, delay);
  const press = pressedAt !== undefined ? interpolate(frame, [pressedAt, pressedAt + 4, pressedAt + 10], [1, 0.93, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const solid = variant === "solid";
  return (
    <div style={{ display: "inline-block", fontFamily: theme.fontDisplay, padding: `${size * 0.5}px ${size * 1.3}px`, borderRadius: radius.pill, fontSize: size, fontWeight: 900, background: solid ? theme.accent : "transparent", color: solid ? theme.onAccent : theme.text, border: `4px solid ${theme.dark ? color.lime : color.ink}`, boxShadow: theme.hardShadow || solid ? shadow.hard(theme.dark ? color.lime : color.ink, 6) : undefined, transform: `translateY(${float}px) scale(${Math.max(0, p) * press})` }}>
      {label}
    </div>
  );
};

// ---------- Avatar ----------
export type AvatarProps = { name: string; size?: number; color?: string; kind?: "human" | "ai" };
export const Avatar: React.FC<AvatarProps> = ({ name, size = 84, color: c, kind = "human" }) => {
  const { theme } = useHynex();
  const bg = c ?? (kind === "ai" ? color.lime : color.coral);
  const initials = kind === "ai" ? "✦" : name.split(" ").map((s) => s[0]).slice(-2).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: color.ink, border: `4px solid ${theme.dark ? color.lime : color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.display, fontWeight: 900, fontSize: size * 0.42, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

// ---------- ProgressBar ----------
export type ProgressBarProps = { value: number; label?: string; delay?: number; height?: number };
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, delay = 0, height = 30 }) => {
  const { theme } = useHynex();
  const p = useEnter(delay);
  return (
    <div>
      {label && <div style={{ fontFamily: theme.fontDisplay, fontSize: 30, fontWeight: 800, marginBottom: 10, color: theme.muted }}>{label}</div>}
      <div style={{ height, borderRadius: height, background: theme.surface, border: `4px solid ${theme.dark ? color.lime : color.ink}`, overflow: "hidden", boxSizing: "content-box" }}>
        <div style={{ height: "100%", width: `${Math.max(0, Math.min(1, value)) * Math.min(1, p) * 100}%`, background: theme.accent, borderRadius: height }} />
      </div>
    </div>
  );
};

// ---------- Tooltip ----------
export type TooltipProps = { text: string; delay?: number; direction?: "up" | "down" };
export const Tooltip: React.FC<TooltipProps> = ({ text, delay = 0, direction = "up" }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "pop");
  return (
    <div style={{ position: "relative", display: "inline-block", padding: "14px 24px", borderRadius: radius.sm + 6, fontFamily: font.display, fontSize: 30, fontWeight: 900, background: color.ink, color: color.lime, transform: `scale(${Math.max(0, p)}) rotate(${(1 - Math.min(1, p)) * -8}deg)` }}>
      {text}
      <div style={{ position: "absolute", left: 30, [direction === "up" ? "bottom" : "top"]: -10, width: 22, height: 22, background: color.ink, transform: "rotate(45deg)" }} />
    </div>
  );
};
