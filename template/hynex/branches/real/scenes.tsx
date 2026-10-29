// HYNEX REAL — nhánh độc lập cho nội dung thật.
// Quy tắc: video quay thật luôn có HOOK TEXT (serif lớn, màu lime) + caption chạy từng chữ.
// Phần minh hoạ vẫn là motion graphic (nhãn marker, nét vẽ, thẻ ảnh viền trắng) xếp trên ẢNH/VIDEO B-ROLL THẬT.
// Tham số `src` trỏ tới file trong public/ (vd "broll/anh.jpg", "clips/talking.mp4"). Bỏ `src` = khung giữ chỗ.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { color, font, radius } from "../../brand/tokens";
import { Button, Cursor, HynexLogo, PhoneVideo, useEnter, useFloat } from "../../core-components";
import { Stage } from "../../scenes/SceneRunner";

const isImage = (src?: string) => !!src && /\.(png|jpe?g|webp)$/i.test(src);
const SERIF = font.soft; // chữ mềm bo tròn (Baloo 2)
const HARD = font.hard; // chữ cứng condensed (Barlow Condensed)
const PINK = color.pink;

/** Bảng màu chữ (hook, tiêu đề, caption) của nhánh Real. Chọn bằng prop `palette` của cảnh. hard=chữ cứng, soft=chữ mềm, lead=dòng dẫn, hl=từ nhấn caption. */
export const realPalettes = {
  brand: { hard: "#FFFFFF", soft: color.lime, lead: color.pink, hl: color.lime },
  "lime-mono": { hard: "#FFFFFF", soft: color.lime, lead: color.lime, hl: color.lime },
  "kem-hong": { hard: "#FFF1D6", soft: color.pink, lead: "#FFE08A", hl: "#FFE08A" },
  "sky-lime": { hard: "#FFFFFF", soft: "#7FD3FF", lead: color.lime, hl: color.lime },
  "nang-sanho": { hard: "#FFFFFF", soft: "#FFD84D", lead: "#FF7A6B", hl: "#FFD84D" },
} as const;
export type PaletteName = keyof typeof realPalettes;
const PaletteCtx = React.createContext<(typeof realPalettes)[PaletteName]>(realPalettes.brand);
const shadowText = "0 3px 18px rgba(12,20,29,.45), 0 1px 3px rgba(12,20,29,.5)";

/** Phủ toàn khung hình (không bị giới hạn trong safe zone). */
const FullBleed: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  return <div style={{ position: "fixed", left: 0, top: 0, width, height, overflow: "hidden" }}>{children}</div>;
};

/** Lớp nền thật: video (có tiếng nếu `sound`), ảnh (Ken Burns), hoặc khung giữ chỗ. Kèm scrim để chữ dễ đọc. */
const MediaLayer: React.FC<{ src?: string; startFrom?: number; sound?: boolean; pos?: string; scrim?: number; placeholder?: string }> = ({ src, startFrom = 0, sound = false, pos = "center", scrim = 0.5, placeholder = "Chèn video thật" }) => {
  const frame = useCurrentFrame();
  return (
    <FullBleed>
      {!src && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg,#8E8678,#4B463E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 64, bottom: 330, color: "rgba(255,255,255,.7)", fontFamily: font.body, fontWeight: 700, fontSize: 28, border: "3px dashed rgba(255,255,255,.4)", borderRadius: 14, padding: "12px 22px" }}>🎥 {placeholder}</div>
        </div>
      )}
      {src && isImage(src) && <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.04 + frame * 0.0009})` }} />}
      {src && !isImage(src) && <Loop durationInFrames={150}><OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted={!sound} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} /></Loop>}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(12,20,29,${scrim}) 0%, rgba(12,20,29,0) 32%, rgba(12,20,29,0) 62%, rgba(12,20,29,${scrim * 0.8}) 100%)` }} />
    </FullBleed>
  );
};

/** Hook text: dòng dẫn cong (chữ mềm hồng) + tiêu đề đan xen: dòng chẵn CỨNG (condensed, hoa, trắng), dòng lẻ MỀM (bo tròn, lime). */
const ArcLead: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const pal = React.useContext(PaletteCtx);
  const p = useEnter(delay, "soft");
  const id = React.useId().replace(/:/g, "");
  return (
    <svg width="677" height="96" viewBox="0 0 677 96" style={{ display: "block", overflow: "visible", opacity: Math.min(1, p * 1.6) }}>
      <defs><path id={`arc${id}`} d="M 20 84 Q 338 20 657 84" /></defs>
      <text style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 38, fill: pal.lead, filter: "drop-shadow(0 3px 10px rgba(12,20,29,.55))" }} textAnchor="middle"><textPath href={`#arc${id}`} startOffset="50%">{text}</textPath></text>
    </svg>
  );
};
/** Kiểu hook dựng sẵn cho 0–5 giây đầu (đồng thời là khung thumbnail). Mỗi video chọn một `preset`, các cảnh sau giữ nguyên. */
export const hookPresets = {
  stack: { layout: "stack", align: "center", leadStyle: "arc", scale: 1 },
  "center-pill": { layout: "center", align: "center", leadStyle: "pill", scale: 1.15 },
  "left-bottom": { layout: "bottom", align: "left", leadStyle: "pill", scale: 1.05 },
  "split-right": { layout: "split", align: "right", leadStyle: "pill", scale: 0.95 },
  "left-top": { layout: "stack", align: "left", leadStyle: "plain", scale: 1.1 },
  "center-big": { layout: "center", align: "center", leadStyle: "arc", scale: 1.3 },
  "right-bottom": { layout: "bottom", align: "right", leadStyle: "pill", scale: 1 },
  "split-left": { layout: "split", align: "left", leadStyle: "arc", scale: 1 },
} as const;
const hash = (str: string) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
/** preset "auto": mỗi video tự có bố cục riêng, chọn cố định theo `seed` (mặc định = nội dung hook). Đổi cả vị trí, căn lề, cỡ, kiểu dòng dẫn, thứ tự cứng/mềm, màu chữ mềm, độ nghiêng. */
const autoHook = (seed: string): Required<Omit<HookStyle, never>> => {
  const keys = Object.keys(hookPresets) as (keyof typeof hookPresets)[];
  const h = hash(seed);
  const base = hookPresets[keys[h % keys.length]];
  return { ...base, order: ((h >> 5) & 1) ? "soft-first" : "hard-first", softColor: (["lime", "pink", "lime"] as const)[(h >> 8) % 3], tilt: -2 - ((h >> 11) % 4) } as Required<Omit<HookStyle, never>>;
};
export type HookStyle = { layout?: "stack" | "center" | "bottom" | "split"; align?: "left" | "center" | "right"; scale?: number; leadStyle?: "arc" | "pill" | "plain"; order?: "hard-first" | "soft-first"; softColor?: "lime" | "pink" | "white"; tilt?: number };
const HookTitle: React.FC<{ lead?: string; lines: string[]; delay?: number; align?: "left" | "center" | "right"; scale?: number; leadStyle?: "arc" | "pill" | "plain"; order?: "hard-first" | "soft-first"; softColor?: "lime" | "pink" | "white"; tilt?: number }> = ({ lead, lines, delay = 0, align = "center", scale = 1, leadStyle = "arc", order = "hard-first", softColor = "lime", tilt = -3 }) => {
  const pal = React.useContext(PaletteCtx);
  const lp = useEnter(delay, "soft");
  const jc = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  return (
    <div style={{ textAlign: align, width: "100%", display: "flex", flexDirection: "column", alignItems: jc }}>
      {lead && leadStyle === "arc" && <ArcLead text={lead} delay={delay} />}
      {lead && leadStyle === "pill" && <div style={{ marginBottom: 10, padding: "6px 22px", borderRadius: 30, background: pal.lead, color: color.ink, fontFamily: SERIF, fontWeight: 800, fontSize: 38 * scale, transform: `rotate(-3deg) scale(${Math.min(1, lp)})`, opacity: Math.min(1, lp * 1.6) }}>{lead}</div>}
      {lead && leadStyle === "plain" && <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40 * scale, color: pal.lead, textShadow: shadowText, opacity: Math.min(1, lp * 1.6) }}>{lead}</div>}
      {lines.map((l, i) => <HookLine key={i} text={l} soft={(i % 2 === 1) === (order === "hard-first")} delay={delay + 6 + i * 6} scale={scale} softColor={softColor} tilt={tilt} />)}
    </div>
  );
};
/** Dòng hook: mặc định dòng chẵn cứng / lẻ mềm; hoặc đánh dấu từ mềm bằng *sao*, vd "BÁO CÁO *tự chạy*". */
const HookLine: React.FC<{ text: string; soft: boolean; delay: number; scale?: number; softColor?: "lime" | "pink" | "white"; tilt?: number }> = ({ text, soft, delay, scale = 1, softColor, tilt = -3 }) => {
  const pal = React.useContext(PaletteCtx);
  const sc = softColor === "white" ? "#fff" : pal.soft;
  const p = useEnter(delay, "snappy");
  const base = { opacity: Math.min(1, p * 1.5), textShadow: shadowText } as const;
  if (text.includes("*")) {
    return (
      <div style={{ ...base, lineHeight: 0.95, transform: `translateY(${(1 - p) * 40}px)` }}>
        {text.split("*").map((t, i) => i % 2 === 1
          ? <span key={i} style={{ display: "inline-block", fontFamily: SERIF, fontWeight: 800, fontSize: 118 * scale, letterSpacing: -2, color: sc, margin: "0 8px", transform: `rotate(${tilt}deg)` }}>{t}</span>
          : <span key={i} style={{ fontFamily: HARD, fontWeight: 800, textTransform: "uppercase", fontSize: 132 * scale, letterSpacing: 1, color: pal.hard }}>{t}</span>)}
      </div>
    );
  }
  return soft
    ? <div style={{ ...base, fontFamily: SERIF, fontWeight: 800, fontSize: 118 * scale, lineHeight: 0.9, letterSpacing: -2, color: sc, transform: `translateY(${(1 - p) * 40}px) rotate(${tilt}deg)` }}>{text}</div>
    : <div style={{ ...base, fontFamily: HARD, fontWeight: 800, textTransform: "uppercase", fontSize: 132 * scale, lineHeight: 0.92, letterSpacing: 1, color: pal.hard, transform: `translateY(${(1 - p) * 40}px)` }}>{text}</div>;
};

/** Caption chạy từng chữ. phrases: khoảng frame hiển thị + câu; `hl` là các từ được nhấn màu lime. */
export type Phrase = { from: number; to: number; text: string; hl?: string[] };
const Captions: React.FC<{ phrases: Phrase[] }> = ({ phrases }) => {
  const pal = React.useContext(PaletteCtx);
  const frame = useCurrentFrame();
  const cur = phrases.find((p) => frame >= p.from && frame < p.to);
  if (!cur) return <div style={{ height: 150 }} />;
  const words = cur.text.split(" ");
  const step = Math.max(2, Math.min(7, (cur.to - cur.from) / (words.length * 1.7)));
  return (
    <div style={{ minHeight: 150, display: "flex", flexWrap: "wrap", justifyContent: "center", alignContent: "center", gap: "0 16px", textAlign: "center" }}>
      {words.map((w, i) => {
        const t = Math.min(1, Math.max(0, (frame - cur.from - i * step) / 5));
        const hl = cur.hl?.some((h) => w.toLowerCase().replace(/[.,!?]/g, "").includes(h.toLowerCase()));
        return <span key={i} style={{ fontFamily: hl ? HARD : SERIF, textTransform: hl ? "uppercase" : "none", fontWeight: hl ? 800 : 700, fontSize: hl ? 74 : 54, lineHeight: 1.2, color: hl ? pal.hl : "#fff", textShadow: shadowText, opacity: t, transform: `translateY(${(1 - t) * 14}px)` }}>{w}</span>;
      })}
    </div>
  );
};


/** Nhãn nhỏ tinh gọn (thay sticker): chữ in hoa nhỏ, vạch lime bên trái. Dùng tiết chế, tối đa 1–2 nhãn mỗi cảnh. */
export const Tag: React.FC<{ text: string; at?: number; style?: React.CSSProperties }> = ({ text, at = 0, style }) => {
  const p = useEnter(at, "soft");
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 12px", background: "rgba(12,20,29,.78)", borderLeft: `5px solid ${color.lime}`, borderRadius: 6, color: "#fff", fontFamily: font.body, fontWeight: 700, fontSize: 26, letterSpacing: 1.2, textTransform: "uppercase", opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -24}px)`, ...style }}>{text}</div>
  );
};

/** Tiêu đề đan xen: từ thường = CỨNG (Barlow Condensed, hoa, trắng); từ nhấn (accent) = MỀM bo tròn, hồng, hơi nghiêng. */
const Headline: React.FC<{ text: string; accent?: string[]; size?: number; delay?: number; align?: "left" | "center" }> = ({ text, accent = [], size = 72, delay = 4, align = "left" }) => {
  const pal = React.useContext(PaletteCtx);
  const p = useEnter(delay, "snappy");
  const words = text.split(" ");
  return (
    <div style={{ lineHeight: 1.02, textShadow: shadowText, textAlign: align, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
      {words.map((word, i) => {
        const hit = accent.some((a) => word.toLowerCase().includes(a.toLowerCase()));
        return (
          <React.Fragment key={i}>
            {hit
              ? <span style={{ display: "inline-block", fontFamily: SERIF, fontWeight: 800, fontSize: size * 1.02, color: pal.soft, margin: `0 ${size * 0.1}px`, transform: `rotate(-3deg) translateY(2px)` }}>{word.toLowerCase()}</span>
              : <span style={{ fontFamily: HARD, fontWeight: 800, fontSize: size * 1.22, letterSpacing: 0.5, textTransform: "uppercase", color: pal.hard, marginRight: size * 0.2 }}>{word}</span>}
            {i < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Đưa nội dung lên trên các lớp nền (fixed) — nếu không, phần tử không có position sẽ bị nền che. */
const Over: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "relative", zIndex: 2 }}>{children}</div>;

const Dim: React.FC<{ a?: number }> = ({ a = 0.45 }) => <FullBleed><div style={{ position: "absolute", inset: 0, background: `rgba(12,20,29,${a})` }} /></FullBleed>;

// ================= SCENES =================

/** 1) HOOK: video thật + chữ hook serif lớn + caption chạy từng chữ. */
export const RealTalk: React.FC<{ src?: string; startFrom?: number; sound?: boolean; lead?: string; lines?: string[]; captions?: Phrase[]; placeholder?: string; bg?: string; pos?: string } & HookStyle & { preset?: keyof typeof hookPresets | "auto"; seed?: string }> = ({ src, bg, pos, startFrom, sound = true, lead, lines, captions = [], placeholder, preset, seed, ...own }) => {
  const base = preset === "auto" ? autoHook(seed ?? (lines ?? []).join("|") + (lead ?? "")) : preset ? hookPresets[preset] : {};
  const { layout = "stack", align = "center", scale = 1, leadStyle = "arc", order, softColor, tilt } = { ...base, ...own } as HookStyle;
  const hp = { align, scale, leadStyle, order, softColor, tilt };
  const cap = <Captions phrases={captions} />;
  let body: React.ReactNode;
  if (!lines) body = <><div />{cap}</>;
  else if (layout === "bottom") body = <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", gap: 14 }}><HookTitle lead={lead} lines={lines} delay={2} {...hp} />{cap}</div>;
  else if (layout === "center") body = <><div /><HookTitle lead={lead} lines={lines} delay={2} {...hp} />{cap}</>;
  else if (layout === "split" && lines.length > 1) body = <><HookTitle lead={lead} lines={[lines[0]]} delay={2} {...hp} /><div style={{ flex: 1 }} /><HookTitle lines={lines.slice(1)} delay={10} {...hp} />{cap}</>;
  else body = <><HookTitle lead={lead} lines={lines} delay={2} {...hp} />{cap}</>;
  return (
    <>
      <MediaLayer src={src ?? bg} pos={pos} startFrom={startFrom} sound={sound} scrim={0.6} placeholder={placeholder ?? "Chèn video quay thật (talking head)"} />
      <Over><Stage justify="space-between" gap={0}>{body}</Stage></Over>
    </>
  );
};

/** 2) FOOTAGE + SỐ TIỀN: số lime lớn đếm lên trên cảnh làm việc; có thể kèm số đối chứng gạch ngang. */
export const RealStat: React.FC<{ src?: string; startFrom?: number; pos?: string; lead: string; value: number; decimals?: number; prefix?: string; unit: string; caption?: string; versus?: { label: string; value: string }; tag?: string }> = ({ src, startFrom, pos, lead, value, decimals = 0, prefix = "", unit, caption, versus, tag }) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, Math.max(0, (frame - 14) / 36));
  const eased = 1 - Math.pow(1 - t, 3);
  const num = (value * eased).toFixed(decimals).replace(".", ",");
  const lp = useEnter(2, "soft");
  const vp = useEnter(52, "soft");
  const rule = interpolate(frame, [40, 62], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <MediaLayer src={src} startFrom={startFrom} pos={pos} scrim={0.7} placeholder="Chèn footage làm việc" />
      <Dim a={0.35} />
      <Over><Stage justify="center" gap={14}>
        {tag && <div><Tag text={tag} at={4} /></div>}
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: PINK, textShadow: shadowText, opacity: Math.min(1, lp * 1.5) }}>{lead}</div>
        <div style={{ fontFamily: HARD, fontWeight: 800, fontSize: 300, lineHeight: 0.9, letterSpacing: -2, color: color.lime, textShadow: shadowText }}>{prefix}{num}</div>
        <div style={{ fontFamily: HARD, fontWeight: 800, textTransform: "uppercase", fontSize: 58, color: "#fff", textShadow: shadowText, letterSpacing: 1.5 }}>{unit}</div>
        <div style={{ height: 6, width: `${rule}%`, background: color.lime, borderRadius: 3, maxWidth: 520 }} />
        {versus && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 10, opacity: Math.min(1, vp * 1.5) }}>
            <span style={{ fontFamily: font.body, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,.85)", textShadow: shadowText }}>{versus.label}</span>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: "#fff", textDecoration: "line-through", textDecorationColor: color.lime, textDecorationThickness: 5, textShadow: shadowText }}>{versus.value}</span>
          </div>
        )}
        {caption && <div style={{ fontFamily: font.body, fontWeight: 500, fontSize: 30, lineHeight: 1.4, color: "rgba(255,255,255,.92)", textShadow: shadowText, marginTop: 8 }}>{caption}</div>}
      </Stage></Over>
    </>
  );
};

/** 3) ĐỒ HOẠ EDITORIAL: tiêu đề serif, ảnh thật xếp lệch kiểu tạp chí, chú thích đánh số, nét lime mảnh. */
export const RealEditorial: React.FC<{ bg?: string; kicker?: string; headline: string; accent?: string[]; photos: { src: string; caption: string; w?: number; align?: "left" | "right"; at: number }[]; footnote?: string }> = ({ bg, kicker, headline, accent, photos, footnote }) => {
  const fp = useEnter(60, "soft");
  return (
    <>
      <MediaLayer src={bg} scrim={0.7} placeholder="Nền b-roll" />
      <Dim a={bg ? 0.55 : 0.2} />
      <Over><Stage justify="start" gap={22}>
        {kicker && <div style={{ fontFamily: font.body, fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: color.lime }}>{kicker}</div>}
        <Headline text={headline} accent={accent} size={68} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
          {photos.map((p, i) => <EditorialPhoto key={i} n={i + 1} {...p} />)}
        </div>
        {footnote && <div style={{ fontFamily: SERIF, fontSize: 32, color: "#fff", textShadow: shadowText, opacity: Math.min(1, fp * 1.5) }}>{footnote}</div>}
      </Stage></Over>
    </>
  );
};
const EditorialPhoto: React.FC<{ n: number; src: string; caption: string; w?: number; align?: "left" | "right"; at: number }> = ({ n, src, caption, w = 400, align = "left", at }) => {
  const p = useEnter(at, "soft");
  const fl = useFloat(3, 40, at * 2);
  return (
    <div style={{ alignSelf: align === "left" ? "flex-start" : "flex-end", width: w, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - Math.min(1, p)) * 70 + fl}px)` }}>
      <div style={{ padding: 8, background: "#fff", borderRadius: 4, boxShadow: "0 18px 40px rgba(12,20,29,.4)" }}>
        <Img src={staticFile(src)} style={{ display: "block", width: "100%", height: w * 0.62, objectFit: "cover", objectPosition: "top" }} />
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 28, color: color.lime }}>0{n}</span>
        <span style={{ height: 2, width: 36, background: color.lime }} />
        <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 24, color: "#fff", letterSpacing: 1, textTransform: "uppercase", textShadow: shadowText }}>{caption}</span>
      </div>
    </div>
  );
};

/** 4) QUY TRÌNH AI: các khối kính tối nối bằng đường lime, mỗi khối có icon + UI giả lập nhỏ. */
type FlowKind = "script" | "voice" | "edit" | "done" | "spark" | "gear";
const Icon: React.FC<{ kind: FlowKind }> = ({ kind }) => {
  const st = { fill: "none", stroke: color.ink, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      {kind === "script" && <><rect x="7" y="4" width="20" height="26" rx="3" {...st} /><path d="M12 12h10M12 17h10M12 22h6" {...st} /></>}
      {kind === "voice" && <><rect x="12" y="4" width="10" height="17" rx="5" {...st} /><path d="M7 16a10 10 0 0 0 20 0M17 26v4" {...st} /></>}
      {kind === "edit" && <><rect x="4" y="8" width="26" height="18" rx="3" {...st} /><path d="M14 13l7 4-7 4z" {...st} /></>}
      {kind === "spark" && <path d="M17 3l3 10 10 4-10 4-3 10-3-10-10-4 10-4z" {...st} />}
      {kind === "gear" && <><circle cx="17" cy="17" r="5" {...st} /><path d="M17 3v5M17 26v5M3 17h5M26 17h5M7 7l3.5 3.5M23.5 23.5L27 27M27 7l-3.5 3.5M10.5 23.5L7 27" {...st} /></>}
      {kind === "done" && <path d="M6 18l8 8 14-16" {...st} />}
    </svg>
  );
};
const MiniUI: React.FC<{ kind: FlowKind; local: number }> = ({ kind, local }) => {
  if (kind === "spark" || kind === "gear") return null;
  if (kind === "script") {
    const lines = [0.9, 0.7, 0.82];
    return <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 250 }}>{lines.map((l, i) => <div key={i} style={{ height: 10, borderRadius: 5, background: i === 0 ? color.lime : "rgba(255,255,255,.55)", width: `${Math.min(l, Math.max(0, (local - i * 8) / 18)) * 100}%` }} />)}</div>;
  }
  if (kind === "voice") {
    return <div style={{ display: "flex", alignItems: "center", gap: 5, height: 46 }}>{Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ width: 7, borderRadius: 4, background: color.lime, height: 10 + Math.abs(Math.sin((local + i * 3) / 4)) * 34 }} />)}</div>;
  }
  if (kind === "edit") {
    return (
      <div style={{ width: 250 }}>
        <div style={{ display: "flex", gap: 4 }}>{[0.35, 0.2, 0.3, 0.15].map((w, i) => <div key={i} style={{ height: 24, flex: w, borderRadius: 4, background: i % 2 ? "rgba(255,255,255,.6)" : color.lime, opacity: Math.min(1, Math.max(0, (local - i * 6) / 8)) }} />)}</div>
        <div style={{ position: "relative", height: 4, marginTop: 8, background: "rgba(255,255,255,.25)", borderRadius: 2 }}><div style={{ position: "absolute", left: `${Math.min(100, local * 2.2)}%`, top: -5, width: 4, height: 14, background: "#fff", borderRadius: 2 }} /></div>
      </div>
    );
  }
  return <div style={{ fontFamily: font.body, fontWeight: 800, fontSize: 24, color: color.lime }}>9:16 · 1080×1920 · MP4</div>;
};
export const RealFlow: React.FC<{ bg?: string; pos?: string; kicker?: string; title: string; accent?: string[]; steps: { kind: FlowKind; title: string; detail: string }[]; gap?: number }> = ({ bg, pos, kicker, title, accent, steps, gap = 26 }) => {
  const frame = useCurrentFrame();
  const per = 26;
  const active = Math.min(steps.length - 1, Math.floor(Math.max(0, frame - 18) / per));
  return (
    <>
      <MediaLayer src={bg} pos={pos} scrim={0.9} placeholder="Nền b-roll" />
      <Dim a={0.62} />
      <Over><Stage justify="start" gap={gap}>
        {kicker && <div style={{ fontFamily: font.body, fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: color.lime }}>{kicker}</div>}
        <Headline text={title} accent={accent} size={62} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ position: "absolute", left: 36, top: 40, bottom: 40, width: 4, background: "rgba(255,255,255,.2)", borderRadius: 2 }}>
            <div style={{ width: "100%", height: `${Math.min(100, ((frame - 18) / (per * steps.length)) * 100)}%`, background: color.lime, borderRadius: 2 }} />
          </div>
          {steps.map((st, i) => <FlowCard key={i} i={i} active={i <= active} start={18 + i * per} {...st} frame={frame} />)}
        </div>
      </Stage></Over>
    </>
  );
};
const FlowCard: React.FC<{ i: number; active: boolean; start: number; frame: number; kind: FlowKind; title: string; detail: string }> = ({ i, active, start, frame, kind, title, detail }) => {
  const p = useEnter(start, "snappy");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 22px", borderRadius: 18, background: "rgba(12,20,29,.82)", border: `2px solid ${active ? color.lime : "rgba(255,255,255,.18)"}`, boxShadow: "0 14px 34px rgba(0,0,0,.35)", opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 50}px)` }}>
      <div style={{ width: 54, height: 54, flexShrink: 0, borderRadius: 27, background: color.lime, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}><Icon kind={kind} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 38, lineHeight: 1.1, color: "#fff" }}>{title}</div>
        <div style={{ fontFamily: font.body, fontWeight: 500, fontSize: 25, color: "rgba(255,255,255,.75)", margin: "4px 0 10px" }}>{detail}</div>
        <MiniUI kind={kind} local={Math.max(0, frame - start)} />
      </div>
    </div>
  );
};

/** 5) KẾT: logo Hynex + lời mời xem hướng dẫn chi tiết. */
export const RealCTA: React.FC<{ bg?: string; pos?: string; lead?: string; headline: string; accent?: string[]; button: string; handle?: string }> = ({ bg, pos, lead, headline, accent, button, handle }) => {
  const hp = useEnter(40);
  const lg = useEnter(2, "bounce");
  return (
    <>
      <MediaLayer src={bg} pos={pos} scrim={0.9} placeholder="Nền b-roll" />
      <Dim a={0.62} />
      <Over><Stage justify="center" gap={30}>
        <div style={{ display: "flex", justifyContent: "center", transform: `scale(${Math.min(1, lg)})` }}><HynexLogo size={150} /></div>
        {lead && <div style={{ fontFamily: SERIF, fontSize: 40, color: "#fff", textShadow: shadowText, textAlign: "center" }}>{lead}</div>}
        <Headline text={headline} accent={accent} size={76} align="center" delay={10} />
        <div style={{ display: "flex", justifyContent: "center" }}><Button label={button} delay={22} pressedAt={70} size={40} /></div>
        {handle && <div style={{ textAlign: "center", fontFamily: font.body, fontWeight: 700, fontSize: 34, color: color.lime, textShadow: shadowText, opacity: Math.min(1, hp) }}>{handle}</div>}
      </Stage></Over>
    </>
  );
};

const MONO = "'SF Mono',Menlo,Consolas,'Courier New',monospace";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/** 4a) THAO TÁC KÉO THẢ: con trỏ kéo từng khối từ khay vào canvas rồi nối lại. */
export const RealDrag: React.FC<{ bg?: string; pos?: string; step?: string; title: string; accent?: string[]; blocks: { icon: string; label: string; sub: string }[]; caption?: string }> = ({ bg, pos, step, title, accent, blocks, caption }) => {
  const frame = useCurrentFrame();
  const W = 677, H = 780, bw = 420, bh = 128, per = 38, t0 = 22, dur = 24;
  const slot = (i: number) => ({ x: 128, y: 26 + i * 205 });
  const tray = (i: number) => ({ x: 14 + i * 218, y: 668, w: 205, h: 76 });
  const path = blocks.flatMap((_, i) => {
    const a = tray(i), b = slot(i), st = t0 + i * per;
    return [{ x: a.x + 90, y: a.y + 30, at: st - 8 }, { x: a.x + 90, y: a.y + 30, at: st }, { x: b.x + bw / 2, y: b.y + bh / 2, at: st + dur }];
  });
  const linesAt = t0 + blocks.length * per + 4;
  const lt = Math.min(1, Math.max(0, (frame - linesAt) / 16));
  return (
    <>
      <MediaLayer src={bg} pos={pos} scrim={0.9} placeholder="Nền b-roll" />
      <Dim a={0.6} />
      <Over><Stage justify="start" gap={20}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>{step && <Tag text={step} at={2} />}</div>
        <Headline text={title} accent={accent} size={58} />
        <div style={{ position: "relative", width: W, height: H, borderRadius: 18, background: "rgba(12,20,29,.86)", border: "2px solid rgba(255,255,255,.18)", backgroundImage: "radial-gradient(rgba(255,255,255,.14) 1.5px, transparent 1.6px)", backgroundSize: "28px 28px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,.4)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "rgba(255,255,255,.07)", borderTop: "2px solid rgba(255,255,255,.16)" }} />
          <div style={{ position: "absolute", left: 18, bottom: 128, fontFamily: font.body, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>Khay khối</div>
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            {blocks.slice(1).map((_, i) => { const a = slot(i), b = slot(i + 1); return <path key={i} d={`M${a.x + bw / 2} ${a.y + bh} L${b.x + bw / 2} ${b.y}`} pathLength={1} stroke={color.lime} strokeWidth={5} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - lt} fill="none" />; })}
          </svg>
          {blocks.map((b, i) => {
            const st = t0 + i * per, k = ease((frame - st) / dur), a = tray(i), sl = slot(i);
            const x = lerp(a.x, sl.x, k), y = lerp(a.y, sl.y, k), w = lerp(a.w, bw, k), h = lerp(a.h, bh, k);
            const big = k > 0.5;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 14, background: "#fff", border: `3px solid ${k >= 1 ? color.lime : "rgba(12,20,29,.2)"}`, boxShadow: k > 0 && k < 1 ? "0 18px 30px rgba(0,0,0,.45)" : "0 6px 14px rgba(0,0,0,.25)", display: "flex", alignItems: "center", gap: big ? 18 : 10, padding: big ? "0 22px" : "0 12px", zIndex: k > 0 && k < 1 ? 5 : 1 }}>
                <span style={{ fontSize: big ? 46 : 32 }}>{b.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: big ? 34 : 19, lineHeight: 1.1, color: color.ink, whiteSpace: "nowrap" }}>{b.label}</div>
                  {big && <div style={{ fontFamily: font.body, fontWeight: 500, fontSize: 22, color: "#5B5446", marginTop: 2 }}>{b.sub}</div>}
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", inset: 0, zIndex: 9 }}><Cursor path={path} /></div>
        </div>
        {caption && <div style={{ fontFamily: SERIF, fontSize: 34, color: "#fff", textShadow: shadowText }}>{caption}</div>}
      </Stage></Over>
    </>
  );
};

/** 4b) GÕ CODE: cửa sổ editor, chữ hiện dần có tô màu cú pháp, kết quả chạy hiện sau cùng. */
const tokenize = (line: string) => line.split(/(\s+|[(){}.,;+\[\]]|"[^"]*"|\/\/.*)/).filter(Boolean);
const tokColor = (t: string) => /^\/\//.test(t) ? "#7F8B99" : /^"/.test(t) ? "#FFD28A" : /^(function|const|let|return|if|for)$/.test(t) ? color.lime : "#F4F6F8";
export const RealCode: React.FC<{ bg?: string; pos?: string; step?: string; title: string; accent?: string[]; file: string; lines: string[]; output?: string; caption?: string }> = ({ bg, pos, step, title, accent, file, lines, output, caption }) => {
  const frame = useCurrentFrame();
  const speed = 1.7, start = 16;
  const total = lines.join("\n").length;
  const typed = Math.min(total, Math.max(0, Math.floor((frame - start) * speed)));
  const done = typed >= total;
  const doneAt = start + total / speed;
  const op = useEnter(Math.round(doneAt) + 8, "soft");
  let left = typed;
  return (
    <>
      <MediaLayer src={bg} pos={pos} scrim={0.9} placeholder="Nền b-roll" />
      <Dim a={0.6} />
      <Over><Stage justify="start" gap={20}>
        <div>{step && <Tag text={step} at={2} />}</div>
        <Headline text={title} accent={accent} size={58} />
        <div style={{ width: 640, borderRadius: 16, overflow: "hidden", background: "#0E1822", border: "2px solid rgba(255,255,255,.18)", boxShadow: "0 20px 50px rgba(0,0,0,.45)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#16232F" }}>
            {["#FF6B6B", "#FFD166", color.lime].map((c, i) => <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
            <span style={{ marginLeft: 10, fontFamily: MONO, fontSize: 20, color: "rgba(255,255,255,.7)" }}>{file}</span>
          </div>
          <div style={{ padding: "20px 22px", minHeight: 300 }}>
            {lines.map((ln, i) => {
              const before = left;
              const n = Math.max(0, Math.min(ln.length, before)); left -= ln.length + 1;
              const caret = !done && before >= 0 && before <= ln.length ? Math.floor(frame / 8) % 2 === 0 : false;
              let used = 0;
              return (
                <div key={i} style={{ display: "flex", gap: 16, fontFamily: MONO, fontSize: 25, lineHeight: 1.65, whiteSpace: "pre" }}>
                  <span style={{ color: "rgba(255,255,255,.28)", width: 22, textAlign: "right" }}>{i + 1}</span>
                  <span>{tokenize(ln).map((t, j) => { const vis = t.slice(0, Math.max(0, n - used)); used += t.length; return <span key={j} style={{ color: tokColor(t) }}>{vis}</span>; })}{caret && <span style={{ color: color.lime }}>▍</span>}</span>
                </div>
              );
            })}
          </div>
          {output && (
            <div style={{ padding: "14px 22px", background: "#16232F", borderTop: "2px solid rgba(255,255,255,.12)", fontFamily: MONO, fontSize: 22, color: color.lime, opacity: Math.min(1, op * 1.6) }}>▶ {output}</div>
          )}
        </div>
        {caption && <div style={{ fontFamily: SERIF, fontSize: 34, color: "#fff", textShadow: shadowText }}>{caption}</div>}
      </Stage></Over>
    </>
  );
};

/** 4c) DEMO THẬT TRONG APP: ảnh chụp màn hình app thật trong khung cửa sổ, zoom/pan vào vùng cần xem + khung nhấn lime. */
export const RealScreen: React.FC<{ bg?: string; step?: string; title: string; accent?: string[]; src: string; ratio: number; url?: string; from: { x: number; y: number; s: number }; to: { x: number; y: number; s: number }; marks?: { x: number; y: number; w: number; h: number; at: number; label?: string }[]; caption?: string }> = ({ bg, step, title, accent, src, ratio, url = "app.hynexvn.com", from, to, marks = [], caption }) => {
  const frame = useCurrentFrame();
  const W = 677;
  const k = ease((frame - 10) / 150);
  const sc = lerp(from.s, to.s, k), ox = lerp(from.x, to.x, k), oy = lerp(from.y, to.y, k);
  const p = useEnter(4, "soft");
  const imgH = W * ratio;
  const H = 800;
  const base = Math.max(1, H / imgH);
  return (
    <>
      <MediaLayer src={bg} scrim={0.9} placeholder="Nền b-roll" />
      <Dim a={0.62} />
      <Over><Stage justify="start" gap={20}>
        <div>{step && <Tag text={step} at={2} />}</div>
        <Headline text={title} accent={accent} size={58} />
        <div style={{ width: W, borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 24px 56px rgba(0,0,0,.5)", border: "2px solid rgba(255,255,255,.25)", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 40}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#EEF0F4" }}>
            {["#FF6B6B", "#FFD166", "#5CD68A"].map((c, i) => <span key={i} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
            <span style={{ marginLeft: 10, flex: 1, padding: "4px 14px", borderRadius: 14, background: "#fff", fontFamily: font.body, fontWeight: 600, fontSize: 18, color: "#5B6573" }}>🔒 {url}</span>
          </div>
          <div style={{ position: "relative", width: W, height: H, overflow: "hidden", background: "#F3F1FA" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: imgH, transformOrigin: `${ox}% ${oy}%`, transform: `scale(${sc * base})` }}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />
              {marks.map((m, i) => <Mark key={i} {...m} />)}
            </div>
          </div>
        </div>
        {caption && <div style={{ fontFamily: SERIF, fontSize: 34, color: "#fff", textShadow: shadowText }}>{caption}</div>}
      </Stage></Over>
    </>
  );
};
const Mark: React.FC<{ x: number; y: number; w: number; h: number; at: number; label?: string }> = ({ x, y, w, h, at, label }) => {
  const p = useEnter(at, "snappy");
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, border: `4px solid ${color.lime}`, borderRadius: 10, boxShadow: `0 0 0 3px rgba(12,20,29,.55), 0 0 28px ${color.lime}`, opacity: Math.min(1, p * 1.6), transform: `scale(${0.96 + 0.04 * Math.min(1, p)})` }}>
      {label && <div style={{ position: "absolute", left: 0, top: -34, background: color.lime, color: color.ink, fontFamily: font.body, fontWeight: 800, fontSize: 16, padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};

/** Icon tròn lime nổi/xoay quanh khung chính cho sinh động (hoạt cảnh icon). */
const OrbitIcon: React.FC<{ kind: FlowKind; x: number; y: number; at: number; size?: number; spin?: boolean }> = ({ kind, x, y, at, size = 78, spin = false }) => {
  const frame = useCurrentFrame();
  const p = useEnter(at, "bounce");
  const fl = useFloat(8, 26, at * 2);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: size / 2, background: color.lime, border: `4px solid ${color.ink}`, boxShadow: "0 12px 26px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 8, opacity: Math.min(1, p * 2), transform: `translateY(${fl}px) scale(${Math.min(1, p)}) rotate(${spin ? frame * 4 : 0}deg)` }}>
      <div style={{ transform: `scale(${size / 54})` }}><Icon kind={kind} /></div>
    </div>
  );
};

/** 4d) MÔ PHỎNG PROMPT AI: gõ prompt (từ khoá **in đậm** tô lime) → AI xử lý (icon xoay) → kết quả hiện từng dòng. */
export const RealPrompt: React.FC<{ bg?: string; step?: string; title: string; accent?: string[]; app?: string; prompt: string; outputTitle: string; output: { kind: FlowKind; text: string }[]; caption?: string }> = ({ bg, step, title, accent, app = "Claude", prompt, outputTitle, output, caption }) => {
  const frame = useCurrentFrame();
  const W = 677, start = 14, speed = 1.7;
  const segs = prompt.split("**").map((t, i) => ({ t, hl: i % 2 === 1 }));
  const total = segs.reduce((a, b) => a + b.t.length, 0);
  const typed = Math.min(total, Math.max(0, Math.floor((frame - start) * speed)));
  const doneAt = start + total / speed;
  const thinkEnd = doneAt + 28;
  const thinking = frame >= doneAt && frame < thinkEnd;
  const showOut = frame >= thinkEnd;
  const p = useEnter(4, "soft");
  let left = typed;
  return (
    <>
      <MediaLayer src={bg} scrim={0.9} placeholder="Nền b-roll" />
      <Dim a={0.66} />
      <Over><Stage justify="start" gap={18}>
        <div>{step && <Tag text={step} at={2} />}</div>
        <Headline text={title} accent={accent} size={54} />
        <div style={{ position: "relative", width: W, opacity: Math.min(1, p * 1.6) }}>
          <OrbitIcon kind="spark" x={W - 60} y={-34} at={12} />
          {thinking && <OrbitIcon kind="gear" x={-26} y={380} at={0} spin />}
          <div style={{ borderRadius: 18, background: "#fff", boxShadow: "0 24px 56px rgba(0,0,0,.5)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "#F4EFE6", fontFamily: font.body, fontWeight: 800, fontSize: 22, color: color.ink }}>
              <span style={{ width: 26, height: 26, borderRadius: 13, background: color.lime, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><span style={{ transform: "scale(.5)" }}><Icon kind="spark" /></span></span>{app}
            </div>
            <div style={{ padding: "22px 26px", minHeight: 380, fontFamily: font.body, fontWeight: 600, fontSize: 38, lineHeight: 1.45, color: color.ink }}>
              {segs.map((sg, i) => { const n = Math.max(0, Math.min(sg.t.length, left)); left -= sg.t.length; return <span key={i} style={sg.hl ? { background: color.lime, padding: "0 6px", borderRadius: 4, fontWeight: 800 } : undefined}>{sg.t.slice(0, n)}</span>; })}
              {typed < total && Math.floor(frame / 8) % 2 === 0 && <span style={{ color: color.ink }}>▍</span>}
            </div>
            <div style={{ padding: "0 22px 16px", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: typed >= total ? color.ink : "#D9D2C3", color: color.lime, fontSize: 30, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${typed >= total && frame < doneAt + 6 ? 0.88 : 1})` }}>↑</div>
            </div>
          </div>
          {(thinking || showOut) && (
            <div style={{ marginTop: 18, borderRadius: 18, background: "rgba(12,20,29,.9)", border: `2px solid ${color.lime}`, padding: "18px 22px", boxShadow: "0 20px 44px rgba(0,0,0,.45)" }}>
              {thinking ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: font.body, fontWeight: 700, fontSize: 28, color: color.lime }}>
                  AI đang viết {[0, 1, 2].map((d) => <span key={d} style={{ width: 12, height: 12, borderRadius: 6, background: color.lime, opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame + d * 5) / 5)) }} />)}
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: "#fff", marginBottom: 14 }}>{outputTitle}</div>
                  {output.map((o, i) => <OutRow key={i} {...o} start={Math.round(thinkEnd) + i * 16} />)}
                </>
              )}
            </div>
          )}
        </div>
        {caption && <div style={{ fontFamily: SERIF, fontSize: 34, color: "#fff", textShadow: shadowText }}>{caption}</div>}
      </Stage></Over>
    </>
  );
};
const OutRow: React.FC<{ kind: FlowKind; text: string; start: number }> = ({ kind, text, start }) => {
  const p = useEnter(start, "snappy");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 30}px)` }}>
      <div style={{ width: 58, height: 58, flexShrink: 0, borderRadius: 29, background: color.lime, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ transform: "scale(.78)" }}><Icon kind={kind} /></div></div>
      <div style={{ fontFamily: font.body, fontWeight: 600, fontSize: 34, color: "#fff" }}>{text}</div>
    </div>
  );
};

/** 5) KẾT QUẢ ĐẦU RA: điện thoại lớn chiếu video thành phẩm thật + icon nổi quanh. */
export const RealResult: React.FC<{ bg?: string; step?: string; title: string; accent?: string[]; src?: string; startFrom?: number; handle?: string; chips?: { kind: FlowKind; x: number; y: number; at: number }[] }> = ({ bg, step, title, accent, src, startFrom, handle = "@tapstore", chips = [] }) => (
  <>
    <MediaLayer src={bg} scrim={0.9} placeholder="Nền b-roll" />
    <Dim a={0.7} />
    <Over><Stage justify="start" gap={14}>
      <div>{step && <Tag text={step} at={2} />}</div>
      <Headline text={title} accent={accent} size={54} />
      <div style={{ position: "relative", display: "flex", justifyContent: "center", flex: 1 }}>
        <PhoneVideo src={src} startFrom={startFrom} width={440} handle={handle} caption="Video thành phẩm 9:16" sound={false} />
        {chips.map((c, i) => <OrbitIcon key={i} {...c} />)}
      </div>
    </Stage></Over>
  </>
);

// ================= KHUNG GIAO DIỆN ĐIỆN THOẠI (tìm kiếm, menu chọn chữ, nhãn thông tin) =================
export type UIItem =
  | { kind: "search"; text: string; x: number; y: number; at: number; w?: number }
  | { kind: "menu"; items?: string[]; x: number; y: number; at: number; cursor?: boolean }
  | { kind: "pill"; text: string; icon?: "pin" | "cal" | "tag" | "search"; x: number; y: number; at: number };

const UIIcon: React.FC<{ kind: "pin" | "cal" | "tag" | "search"; c?: string; size?: number }> = ({ kind, c = "#fff", size = 26 }) => {
  const st = { fill: "none", stroke: c, strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      {kind === "pin" && <><path d="M14 26s8-7.4 8-13a8 8 0 1 0-16 0c0 5.6 8 13 8 13z" {...st} /><circle cx="14" cy="13" r="3" {...st} /></>}
      {kind === "cal" && <><rect x="4" y="6" width="20" height="18" rx="3" {...st} /><path d="M4 12h20M10 3v5M18 3v5" {...st} /></>}
      {kind === "tag" && <><path d="M4 4h10l10 10-10 10L4 14z" {...st} /><circle cx="10" cy="10" r="1.6" fill={c} /></>}
      {kind === "search" && <><circle cx="12" cy="12" r="7.5" {...st} /><path d="M18 18l6 6" {...st} /></>}
    </svg>
  );
};

/** Thanh tìm kiếm: gõ chữ dần, có kính lúp + con trỏ nhấp nháy. */
const SearchBar: React.FC<{ text: string; x: number; y: number; at: number; w?: number }> = ({ text, x, y, at, w = 620 }) => {
  const frame = useCurrentFrame();
  const p = useEnter(at, "snappy");
  const n = Math.min(text.length, Math.max(0, Math.floor((frame - at - 8) * 0.8)));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 84, borderRadius: 42, background: "rgba(255,255,255,.95)", boxShadow: "0 14px 34px rgba(12,20,29,.35)", display: "flex", alignItems: "center", gap: 16, padding: "0 28px", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + 0.04 * Math.min(1, p)})` }}>
      <UIIcon kind="search" c="#5B6573" size={34} />
      <div style={{ fontFamily: font.body, fontWeight: 600, fontSize: 34, color: color.ink, whiteSpace: "nowrap", overflow: "hidden" }}>{text.slice(0, n)}{n < text.length && Math.floor(frame / 8) % 2 === 0 ? <span style={{ color: "#5B6573" }}>|</span> : null}</div>
    </div>
  );
};

/** Menu chọn chữ kiểu iOS: Copy | Select All | Look Up, kèm con trỏ chạm vào. */
const SelectionMenu: React.FC<{ items?: string[]; x: number; y: number; at: number; cursor?: boolean }> = ({ items = ["Copy", "Select All", "Look Up"], x, y, at, cursor = false }) => {
  const p = useEnter(at, "pop");
  const path = [{ x: x + 330, y: y + 80, at: at + 10 }, { x: x + 70, y: y + 30, at: at + 30 }];
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", background: "rgba(28,28,30,.96)", borderRadius: 14, boxShadow: "0 12px 28px rgba(0,0,0,.4)", opacity: Math.min(1, p * 1.8), transform: `scale(${Math.min(1, p)})`, transformOrigin: "left bottom" }}>
        {items.map((t, i) => (
          <div key={i} style={{ padding: "14px 24px", fontFamily: font.body, fontWeight: 600, fontSize: 28, color: "#fff", borderRight: i < items.length - 1 ? "1.5px solid rgba(255,255,255,.2)" : "none", whiteSpace: "nowrap" }}>{t}</div>
        ))}
        <div style={{ padding: "14px 20px", color: "#fff", fontSize: 28 }}>›</div>
      </div>
      {cursor && <div style={{ position: "absolute", inset: 0 }}><Cursor path={path} /></div>}
    </>
  );
};

/** Nhãn thông tin dạng kính mờ: icon + chữ in hoa (địa điểm, ngày, vai trò). */
const InfoPill: React.FC<{ text: string; icon?: "pin" | "cal" | "tag" | "search"; x: number; y: number; at: number }> = ({ text, icon = "tag", x, y, at }) => {
  const p = useEnter(at, "soft");
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 26px 12px 20px", borderRadius: 40, background: "rgba(255,255,255,.28)", border: "2px solid rgba(255,255,255,.55)", backdropFilter: "blur(8px)", boxShadow: "0 8px 22px rgba(12,20,29,.25)", opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * -30}px)` }}>
      <UIIcon kind={icon} />
      <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 28, letterSpacing: 1.6, textTransform: "uppercase", color: "#fff", textShadow: shadowText, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};

/** Lớp giao diện phủ toàn khung hình (toạ độ px theo khung 1080×1920, nhớ giữ trong vùng an toàn). */
const UIOverlay: React.FC<{ items: UIItem[] }> = ({ items }) => (
  <FullBleed>
    <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>
      {items.map((it, i) => it.kind === "search" ? <SearchBar key={i} {...it} /> : it.kind === "menu" ? <SelectionMenu key={i} {...it} /> : <InfoPill key={i} {...it} />)}
    </div>
  </FullBleed>
);
/** Bọc cảnh bất kỳ để nhận thêm prop `ui` (danh sách khung giao diện nổi). */
const withUI = <P extends object>(C: React.ComponentType<P>): React.FC<P & { ui?: UIItem[]; palette?: PaletteName }> => ({ ui, palette = "brand", ...rest }) => (
  <PaletteCtx.Provider value={realPalettes[palette]}>
    <C {...(rest as unknown as P)} />
    {ui && ui.length > 0 && <UIOverlay items={ui} />}
  </PaletteCtx.Provider>
);

export const realRegistry = {
  talk: withUI(RealTalk),
  stat: withUI(RealStat),
  editorial: withUI(RealEditorial),
  flow: withUI(RealFlow),
  drag: withUI(RealDrag),
  code: withUI(RealCode),
  screen: withUI(RealScreen),
  prompt: withUI(RealPrompt),
  result: withUI(RealResult),
  cta: withUI(RealCTA),
};
