// NHÓM 2 · MOTION SỐ LIỆU
// NumberCounter · BarCompare · DonutChart · PriceTransition · Countdown
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, clamp } from "../brand";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const fmt = (v: number, decimals = 0) =>
  v.toLocaleString("vi-VN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Number Counter: số chạy từ 0 đến giá trị cuối, nảy nhẹ khi chạm đích. */
export const NumberCounter: React.FC<{
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  start?: number;
  duration?: number;
  size?: number;
  color?: string;
}> = ({ to, from = 0, decimals = 0, prefix = "", suffix = "", start = 0, duration = 36, size = 300, color = C.flame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [start, start + duration], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  const land = spring({ frame: frame - start - duration, fps, config: { damping: 9, stiffness: 260 } });
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        color,
        letterSpacing: "-0.03em",
        fontVariantNumeric: "tabular-nums",
        scale: `${interpolate(land, [0, 0.5, 1], [1, 1.06, 1])}`,
        transformOrigin: "left bottom",
      }}
    >
      {prefix}
      {fmt(v, decimals)}
      <span style={{ fontSize: size * 0.55 }}>{suffix}</span>
    </div>
  );
};

/** Animated Bar Chart: so sánh trước và sau (vd. phí sàn). Cột cuối màu đỏ. */
export const BarCompare: React.FC<{
  items: { label: string; value: number; display?: string }[];
  start?: number;
  width?: number;
}> = ({ items, start = 0, width = 880 }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 28, fontFamily: FONT }}>
      {items.map((it, i) => {
        const s = start + i * 10;
        const p = interpolate(frame, [s, s + 26], [0, 1], { ...clamp, easing: ease });
        const last = i === items.length - 1;
        return (
          <div key={i}>
            <div style={{ color: C.muted, fontSize: 34, fontWeight: 700, marginBottom: 10 }}>{it.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  height: 88,
                  width: ((width - 230) * it.value * p) / max,
                  background: last ? C.alert : C.flame,
                  borderRadius: 14,
                }}
              />
              <div
                style={{
                  color: C.white,
                  fontSize: 64,
                  fontWeight: 900,
                  opacity: interpolate(frame, [s + 16, s + 24], [0, 1], clamp),
                }}
              >
                {it.display ?? fmt(it.value * p)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Donut Chart: cơ cấu chi phí, từng phần vẽ dần theo vòng. */
export const DonutChart: React.FC<{
  items: { label: string; value: number }[];
  start?: number;
  size?: number;
}> = ({ items, start = 0, size = 380 }) => {
  const frame = useCurrentFrame();
  const total = items.reduce((a, b) => a + b.value, 0);
  const palette = [C.flame, C.alert, C.soft, "#8A8A8A", C.flameLight];
  const r = 140;
  const circ = 2 * Math.PI * r;
  const p = interpolate(frame, [start, start + 40], [0, 1], { ...clamp, easing: ease });
  let acc = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40, fontFamily: FONT }}>
      <svg width={size} height={size} viewBox="0 0 360 360" style={{ flex: "none" }}>
        <circle cx={180} cy={180} r={r} fill="none" stroke={C.cardLine} strokeWidth={56} />
        {items.map((it, i) => {
          const frac = it.value / total;
          const seg = circ * frac * p;
          const off = -circ * acc * p;
          acc += frac;
          return (
            <circle
              key={i}
              cx={180}
              cy={180}
              r={r}
              fill="none"
              stroke={palette[i % palette.length]}
              strokeWidth={56}
              strokeDasharray={`${Math.max(0, seg - 4)} ${circ}`}
              strokeDashoffset={off}
              transform="rotate(-90 180 180)"
            />
          );
        })}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: interpolate(frame, [start + 10 + i * 6, start + 18 + i * 6], [0, 1], clamp),
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: 6, background: palette[i % palette.length] }} />
            <div style={{ color: C.white, fontSize: 36, fontWeight: 700 }}>
              {it.label} <span style={{ color: C.muted }}>{Math.round((it.value / total) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Price Transition: giá cũ bị gạch rồi trượt đi, giá mới bật lên kèm mũi tên. */
export const PriceTransition: React.FC<{
  from: string;
  to: string;
  start?: number;
  label?: string;
  up?: boolean;
}> = ({ from, to, start = 0, label, up = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(frame, [start + 8, start + 20], [0, 1], { ...clamp, easing: ease });
  const pop = spring({ frame: frame - start - 22, fps, config: { damping: 10, stiffness: 200 } });
  const col = up ? C.alert : "#22C55E";
  return (
    <div style={{ fontFamily: FONT }}>
      {label ? <div style={{ color: C.muted, fontSize: 34, fontWeight: 700, marginBottom: 12 }}>{label}</div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative", color: C.muted, fontSize: 120, fontWeight: 800 }}>
          {from}
          <div
            style={{
              position: "absolute",
              left: -6,
              top: "52%",
              height: 12,
              width: `calc(${strike * 100}% + 12px)`,
              background: col,
              borderRadius: 6,
              rotate: "-6deg",
            }}
          />
        </div>
        <svg width={100} height={80} viewBox="0 0 100 80" style={{ opacity: pop }}>
          <path d="M6 40h74M56 14l28 26-28 26" stroke={C.white} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div
          style={{
            color: col,
            fontSize: 150,
            fontWeight: 900,
            scale: `${interpolate(pop, [0, 1], [0.3, 1])}`,
            opacity: interpolate(frame, [start + 22, start + 26], [0, 1], clamp),
          }}
        >
          {to}
        </div>
      </div>
    </div>
  );
};

/** Countdown: số ngày còn lại đếm lùi rồi dừng ở mốc thật, mỗi nhịp lật nhẹ. */
export const Countdown: React.FC<{
  days: number;
  start?: number;
  label?: string;
}> = ({ days, start = 0, label = "NGÀY NỮA" }) => {
  const frame = useCurrentFrame();
  const from = days + 12;
  const t = interpolate(frame, [start, start + 36], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const v = Math.round(from - (from - days) * t);
  const tick = (frame - start) % 3;
  const settled = t >= 1;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 24, fontFamily: FONT }}>
      <div
        style={{
          color: C.white,
          background: C.alert,
          borderRadius: 28,
          padding: "10px 34px",
          fontSize: 190,
          fontWeight: 900,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          rotate: settled ? "0deg" : `${tick === 0 ? -4 : 0}deg`,
        }}
      >
        {v}
      </div>
      <div style={{ color: C.white, fontSize: 56, fontWeight: 800 }}>{label}</div>
    </div>
  );
};
