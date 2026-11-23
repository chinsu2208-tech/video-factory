// Nền, chữ động, highlight, chuyển cảnh dùng chung cho HYNEX AI
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, C, H, HEAD, W, clamp } from "../brand";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inout = Easing.bezier(0.65, 0, 0.35, 1);

/** Nền: navy + lưới tọa độ + chấm pixel + quầng tím nhẹ (texture nhận diện) */
export const TechBg: React.FC<{ children?: React.ReactNode; glow?: string }> = ({ children, glow = C.blue }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: BODY, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `0px ${(f * 0.4) % 60}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.lime}40 1.6px, transparent 1.6px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: "30px 30px",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: -520,
          top: -460,
          borderRadius: 9999,
          background: `radial-gradient(circle, ${glow}55 0%, ${glow}00 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -500,
          bottom: 200,
          borderRadius: 9999,
          background: `radial-gradient(circle, ${C.lime}22 0%, ${C.lime}00 65%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const At: React.FC<{ x?: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x = 60, y, w = 880, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, ...style }}>{children}</div>
);

/** Highlight: vệt lime quét qua từ khóa */
export const Highlight: React.FC<{ children: React.ReactNode; start: number; color?: string; text?: string; joinRight?: number; inline?: boolean }> = ({ children, start, color = C.lime, text = C.bg, joinRight = 0, inline }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 12], [0, 1], { ...clamp, easing: ease });
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", margin: inline ? "0 0.2em" : undefined, color: p > 0.5 && text ? text : undefined }}>
      <span style={{ position: "absolute", left: -6, right: -6 - joinRight, top: "10%", bottom: "4%", background: color, borderRadius: 8, transformOrigin: "left center", scale: `${p} 1` }} />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};

export const RichText: React.FC<{ text: string; start: number; color?: string; textColor?: string }> = ({ text, start, color, textColor }) => {
  let k = 0;
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((p, i) =>
        p.startsWith("**") ? (
          <Highlight key={i} start={start + 10 * k++} color={color} text={textColor} inline>
            {p.slice(2, -2)}
          </Highlight>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
};

/** Kinetic Typography: chữ bật lên theo nhịp, từ highlight được tô sau */
export const KineticTitle: React.FC<{ text: string; start?: number; size?: number }> = ({ text, start = 0, size = 80 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const toks: { w: string; hl: boolean }[] = [];
  text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).forEach((p) => {
    const hl = p.startsWith("**");
    (hl ? p.slice(2, -2) : p).split(/\s+/).filter(Boolean).forEach((w) => toks.push({ w, hl }));
  });
  const doneAt = start + toks.length * 3 + 6;
  let k = 0;
  return (
    <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 1.1, color: C.white, display: "flex", flexWrap: "wrap", columnGap: size * 0.25, rowGap: size * 0.08, letterSpacing: "-0.02em" }}>
      {toks.map((t, i) => {
        const s = start + i * 3;
        const sp = spring({ frame: f - s, fps, config: { damping: 14, stiffness: 180 } });
        return (
          <span key={i} style={{ display: "inline-block", opacity: interpolate(f, [s, s + 4], [0, 1], clamp), translate: `0px ${interpolate(sp, [0, 1], [size * 0.5, 0])}px`, filter: `blur(${interpolate(f, [s, s + 6], [6, 0], clamp)}px)` }}>
            {t.hl ? <Highlight start={doneAt + 4 * k++} joinRight={toks[i + 1]?.hl ? size * 0.25 : 0}>{t.w}</Highlight> : t.w}
          </span>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{ text: string; bg?: string; color?: string; start?: number; border?: string }> = ({ text, bg = C.blue, color = C.white, start = 0, border }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: "0.06em",
        color,
        background: bg,
        border: border ? `2px solid ${border}` : undefined,
        borderRadius: 999,
        padding: "10px 26px",
        opacity: interpolate(f, [start, start + 6], [0, 1], clamp),
        translate: `${interpolate(f, [start, start + 10], [-20, 0], { ...clamp, easing: ease })}px 0px`,
      }}
    >
      {text}
    </div>
  );
};

/** Thẻ kính mờ dùng chung */
export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({ children, style, accent }) => (
  <div style={{ background: `${C.bg2}E6`, border: `2px solid ${accent ?? C.line}`, borderRadius: 28, padding: 32, ...style }}>{children}</div>
);

export const SpringIn: React.FC<{ start?: number; children: React.ReactNode; from?: "bottom" | "scale" | "right"; style?: React.CSSProperties }> = ({ start = 0, children, from = "bottom", style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - start, fps, config: { damping: 13, stiffness: 160 } });
  return (
    <div
      style={{
        ...style,
        opacity: interpolate(f, [start, start + 5], [0, 1], clamp),
        translate: from === "bottom" ? `0px ${(1 - sp) * 80}px` : from === "right" ? `${(1 - sp) * 140}px 0px` : undefined,
        scale: from === "scale" ? `${interpolate(sp, [0, 1], [0.5, 1])}` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/** Chuyển cảnh: Slide (vào từ phải, ra trái, có mờ chuyển động) */
export const Slide: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const x = f < dur - 12 ? interpolate(f, [0, 14], [W * 0.6, 0], { ...clamp, easing: ease }) : interpolate(f, [dur - 12, dur], [0, -W * 0.6], { ...clamp, easing: inout });
  const o = f < dur - 12 ? interpolate(f, [0, 8], [0, 1], clamp) : interpolate(f, [dur - 12, dur], [1, 0], clamp);
  return <div style={{ position: "absolute", inset: 0, translate: `${x}px 0px`, opacity: o }}>{children}</div>;
};

/** Chuyển cảnh: Scan Wipe — dải quét tím/cyan như máy quét đi ngang màn hình */
export const ScanWipe: React.FC<{ duration?: number }> = ({ duration = 18 }) => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, duration], [-H * 0.3, H * 1.1], { ...clamp, easing: inout });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, width: W, top: y - 260, height: 260, background: `linear-gradient(180deg, ${C.blue}00, ${C.blue}CC)` }} />
      <div style={{ position: "absolute", left: 0, width: W, top: y, height: 8, background: C.lime }} />
      <div style={{ position: "absolute", left: 0, width: W, top: y + 8, height: H, background: C.bg, opacity: interpolate(f, [duration * 0.4, duration * 0.6], [0, 0], clamp) }} />
    </div>
  );
};
