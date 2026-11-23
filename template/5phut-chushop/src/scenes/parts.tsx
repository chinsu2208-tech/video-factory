import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BOX, C, FONT, clamp } from "../brand";

/** Nền đêm + một mảng cam mờ ở góc (tĩnh) */
export const Bg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.night, fontFamily: FONT }}>
    <div
      style={{
        position: "absolute",
        right: -260,
        top: -260,
        width: 720,
        height: 720,
        borderRadius: 9999,
        background: C.flame,
        opacity: 0.08,
      }}
    />
    {children}
  </AbsoluteFill>
);

/** Đặt nội dung theo tọa độ tuyệt đối trên khung 1080×1920 */
export const At: React.FC<{ x?: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x = BOX.left,
  y,
  w = BOX.width,
  children,
  style,
}) => <div style={{ position: "absolute", left: x, top: y, width: w, ...style }}>{children}</div>;

export const Pill: React.FC<{ text: string; bg?: string; color?: string; start?: number }> = ({ text, bg = C.flame, color = C.white, start = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        display: "inline-block",
        background: bg,
        color,
        fontWeight: 800,
        fontSize: 34,
        borderRadius: 28,
        padding: "12px 30px",
        letterSpacing: "0.02em",
        lineHeight: 1.3,
        opacity: interpolate(f, [start, start + 6], [0, 1], clamp),
        translate: `0px ${interpolate(f, [start, start + 10], [20, 0], clamp)}px`,
      }}
    >
      {text}
    </div>
  );
};

export const Card: React.FC<{ label: string; bg?: string; labelColor?: string; children: React.ReactNode }> = ({
  label,
  bg = C.card,
  labelColor = C.flame,
  children,
}) => (
  <div style={{ background: bg, borderRadius: 28, padding: "26px 34px 30px" }}>
    <div style={{ color: labelColor, fontWeight: 800, fontSize: 30, letterSpacing: "0.04em", marginBottom: 10 }}>{label}</div>
    <div style={{ color: C.white, fontSize: 42, lineHeight: 1.35, fontWeight: 600 }}>{children}</div>
  </div>
);

export const Logo: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <Img src={staticFile("icons/5p-mark.svg")} style={{ width: size, height: size }} />
);

export const SampleTag: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: BOX.left + BOX.width - 190,
      top: BOX.top - 2,
      fontSize: 24,
      fontWeight: 700,
      color: C.muted,
      border: `2px solid ${C.cardLine}`,
      borderRadius: 999,
      padding: "6px 16px",
    }}
  >
    BẢN MẪU
  </div>
);
