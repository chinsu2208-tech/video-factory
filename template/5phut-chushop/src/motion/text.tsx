// NHÓM 1 · MOTION CHỮ
// KineticTitle · Highlight (+ RichText) · Typewriter · WordPop · NewsTicker
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, clamp } from "../brand";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Text Highlight: vệt bút dạ cam quét qua từ khóa, chữ đổi sang trắng. */
export const Highlight: React.FC<{
  children: React.ReactNode;
  start: number;
  color?: string;
  duration?: number;
}> = ({ children, start, color = C.flame, duration = 12 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: ease });
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      <span
        style={{
          position: "absolute",
          left: -10,
          right: -10,
          top: "8%",
          bottom: "4%",
          background: color,
          borderRadius: 10,
          transformOrigin: "left center",
          scale: `${p} 1`,
          rotate: "-1.2deg",
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};

/** Tách chuỗi có **từ khóa** thành chữ thường + Highlight nối tiếp nhau. */
export const RichText: React.FC<{
  text: string;
  start: number;
  gap?: number;
  color?: string;
}> = ({ text, start, gap = 10, color }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  let k = 0;
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**")) {
          const s = start + k * gap;
          k++;
          return (
            <Highlight key={i} start={s} color={color}>
              {p.slice(2, -2)}
            </Highlight>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
};

/** Kinetic Typography: từng chữ bật lên theo nhịp đọc; từ trong highlight được tô sau khi hiện đủ. */
export const KineticTitle: React.FC<{
  text: string; // dùng **từ khóa** để highlight
  start?: number;
  size?: number;
  stagger?: number;
  color?: string;
}> = ({ text, start = 0, size = 84, stagger = 3, color = C.white }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens: { w: string; hl: boolean }[] = [];
  text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).forEach((part) => {
    const hl = part.startsWith("**");
    const clean = hl ? part.slice(2, -2) : part;
    clean.split(/\s+/).filter(Boolean).forEach((w) => tokens.push({ w, hl }));
  });
  const doneAt = start + tokens.length * stagger + 6;
  let hlIndex = 0;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.12,
        color,
        letterSpacing: "-0.01em",
        display: "flex",
        flexWrap: "wrap",
        columnGap: size * 0.26,
        rowGap: size * 0.08,
      }}
    >
      {tokens.map((t, i) => {
        const s = start + i * stagger;
        const sp = spring({ frame: frame - s, fps, config: { damping: 14, stiffness: 180 } });
        const word = (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(frame, [s, s + 4], [0, 1], clamp),
              translate: `0px ${interpolate(sp, [0, 1], [size * 0.55, 0])}px`,
            }}
          >
            {t.hl ? <Highlight start={doneAt + hlIndex++ * 4}>{t.w}</Highlight> : t.w}
          </span>
        );
        return word;
      })}
    </div>
  );
};

/** Typewriter: gõ dần đoạn trích văn bản chính sách, có con trỏ nhấp nháy. */
export const Typewriter: React.FC<{
  text: string;
  start?: number;
  charsPerSecond?: number;
  size?: number;
}> = ({ text, start = 0, charsPerSecond = 32, size = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - start) / fps) * charsPerSecond));
  const shown = text.slice(0, n);
  const typing = n < text.length;
  const cursorOn = typing || Math.floor(frame / 15) % 2 === 0;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        lineHeight: 1.4,
        color: C.white,
        fontWeight: 500,
      }}
    >
      {shown}
      <span
        style={{
          display: "inline-block",
          width: size * 0.12,
          height: size * 1.05,
          marginLeft: 4,
          background: C.flame,
          verticalAlign: "text-bottom",
          opacity: cursorOn ? 1 : 0,
        }}
      />
    </div>
  );
};

/** Word Pop: nhấn mạnh mức phí, thời hạn — bật to, nảy nhẹ, có vòng sáng. */
export const WordPop: React.FC<{
  text: string;
  start?: number;
  size?: number;
  color?: string;
  bg?: string;
}> = ({ text, start = 0, size = 96, color = C.white, bg = C.flame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - start, fps, config: { damping: 8, stiffness: 220, mass: 0.8 } });
  const ring = interpolate(frame, [start + 4, start + 22], [0, 1], clamp);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 28,
          border: `6px solid ${bg}`,
          opacity: frame < start + 4 ? 0 : interpolate(ring, [0, 1], [0.9, 0]),
          scale: `${interpolate(ring, [0, 1], [1, 1.35])}`,
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1,
          color,
          background: bg,
          padding: `${size * 0.16}px ${size * 0.3}px`,
          borderRadius: 24,
          scale: `${interpolate(sp, [0, 1], [0.2, 1])}`,
          opacity: interpolate(frame, [start, start + 3], [0, 1], clamp),
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** News Ticker: thanh tin chạy ngang, nhãn "TIN NHANH" cố định bên trái. */
export const NewsTicker: React.FC<{
  items: string[];
  speed?: number; // px mỗi frame
  width?: number;
}> = ({ items, speed = 5, width = 880 }) => {
  const frame = useCurrentFrame();
  const line = items.join("     •     ");
  const approx = line.length * 22 + 200;
  const x = width - ((frame * speed) % (approx + width));
  return (
    <div
      style={{
        width,
        height: 84,
        display: "flex",
        alignItems: "center",
        background: C.card,
        borderRadius: 18,
        overflow: "hidden",
        fontFamily: FONT,
        border: `2px solid ${C.cardLine}`,
      }}
    >
      <div
        style={{
          flex: "none",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          background: C.alert,
          color: C.white,
          fontWeight: 800,
          fontSize: 30,
          zIndex: 1,
        }}
      >
        TIN NHANH
      </div>
      <div style={{ position: "relative", flex: 1, height: "100%", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            left: x,
            whiteSpace: "nowrap",
            color: C.white,
            fontSize: 34,
            fontWeight: 500,
          }}
        >
          {line}
        </div>
      </div>
    </div>
  );
};
