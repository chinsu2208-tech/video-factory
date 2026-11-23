// NHÓM 4 · MOTION CHUYỂN CẢNH
// Push · CardFlip · Swipe · ShapeWipe · SpringIn
// Cách dùng: bọc nội dung một cảnh. `dur` = độ dài cảnh (frame) để tự chạy hiệu ứng ra.
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, H, W, clamp } from "../brand";

const ease = Easing.bezier(0.65, 0, 0.35, 1);
const IN = 14;
const OUT = 12;

/** Push: tin cũ bị đẩy sang trái, tin mới vào từ phải. */
export const Push: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const x =
    f < dur - OUT
      ? interpolate(f, [0, IN], [W, 0], { ...clamp, easing: ease })
      : interpolate(f, [dur - OUT, dur], [0, -W], { ...clamp, easing: ease });
  return <div style={{ position: "absolute", inset: 0, translate: `${x}px 0px` }}>{children}</div>;
};

/** Card Flip: thẻ lật quanh trục dọc khi vào và ra. */
export const CardFlip: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const a =
    f < dur - OUT
      ? interpolate(f, [0, IN], [90, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) })
      : interpolate(f, [dur - OUT, dur], [0, -90], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2200 }}>
      <div style={{ position: "absolute", inset: 0, rotate: `0 1 0 ${a}deg`, backfaceVisibility: "hidden" }}>{children}</div>
    </div>
  );
};

/** Swipe: chuyển giữa Tin 01, 02, 03 — vào từ dưới, nghiêng nhẹ, ra lên trên. */
export const Swipe: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f, fps, config: { damping: 18, stiffness: 140 } });
  const out = interpolate(f, [dur - OUT, dur], [0, 1], { ...clamp, easing: ease });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        translate: `0px ${interpolate(sp, [0, 1], [H * 0.6, 0]) - out * H * 0.6}px`,
        rotate: `${interpolate(sp, [0, 1], [4, 0]) - out * 3}deg`,
        opacity: interpolate(f, [0, 6], [0, 1], clamp),
      }}
    >
      {children}
    </div>
  );
};

/** Shape Wipe: mảng cam quét chéo che màn hình rồi rút đi (đặt đè lên chỗ nối 2 cảnh). */
export const ShapeWipe: React.FC<{ duration?: number; color?: string }> = ({ duration = 18, color = C.flame }) => {
  const f = useCurrentFrame();
  const half = duration / 2;
  const a = interpolate(f, [0, half], [-1.4, 0], { ...clamp, easing: ease });
  const b = interpolate(f, [half, duration], [0, 1.4], { ...clamp, easing: ease });
  const x = (f < half ? a : b) * W;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -H * 0.2,
          height: H * 1.4,
          width: W * 1.3,
          left: -W * 0.15,
          background: color,
          translate: `${x}px 0px`,
          rotate: "-12deg",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -H * 0.2,
          height: H * 1.4,
          width: 70,
          left: W * 1.15,
          background: C.night,
          translate: `${x}px 0px`,
          rotate: "-12deg",
        }}
      />
    </div>
  );
};

/** Spring Animation: icon, thẻ bật nhẹ khi xuất hiện. */
export const SpringIn: React.FC<{
  start?: number;
  from?: "bottom" | "left" | "right" | "scale";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start = 0, from = "bottom", children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - start, fps, config: { damping: 12, stiffness: 170 } });
  const d = interpolate(sp, [0, 1], [1, 0]);
  const translate =
    from === "bottom" ? `0px ${d * 90}px` : from === "left" ? `${-d * 120}px 0px` : from === "right" ? `${d * 120}px 0px` : "0px 0px";
  return (
    <div
      style={{
        ...style,
        opacity: interpolate(f, [start, start + 5], [0, 1], clamp),
        translate,
        scale: from === "scale" ? `${interpolate(sp, [0, 1], [0.4, 1])}` : undefined,
      }}
    >
      {children}
    </div>
  );
};
