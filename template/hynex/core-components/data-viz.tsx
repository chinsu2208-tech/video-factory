import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { color, font, radius, shadow, space, tilePalette } from "../brand/tokens";
import { Button, Confetti, IconTile, Sticker, cardStyle, useEnter, useFloat, useHynex } from "./primitives";

const edge = (dark: boolean) => (dark ? color.lime : color.ink);

// ---------- MetricCard ----------
export type MetricCardProps = { label: string; value: number; prefix?: string; suffix?: string; delta?: string; deltaGood?: boolean; delay?: number; decimals?: number; icon?: string; index?: number };
export const MetricCard: React.FC<MetricCardProps> = ({ label, value, prefix = "", suffix = "", delta, deltaGood = true, delay = 0, decimals = 0, icon, index = 0 }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const p = useEnter(delay, "snappy");
  const count = interpolate(frame - delay, [0, 30], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <div style={{ ...cardStyle(theme), padding: space.md, display: "flex", gap: space.sm, alignItems: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
      {icon && <IconTile icon={icon} index={index} delay={delay + 4} size={84} />}
      <div>
        <div style={{ fontFamily: theme.fontBody, fontSize: 24, fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>{label}</div>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 76, fontWeight: 900, letterSpacing: -2, color: theme.text, lineHeight: 1.1 }}>
          {prefix}
          {count.toFixed(decimals)}
          {suffix}
        </div>
        {delta && <div style={{ display: "inline-block", marginTop: 6, padding: "4px 14px", borderRadius: radius.pill, background: deltaGood ? color.lime : "#FFD9D1", color: color.ink, fontSize: 26, fontWeight: 800 }}>{delta}</div>}
      </div>
    </div>
  );
};

// ---------- Chart (bar / line) ----------
export type ChartProps = { type?: "bar" | "line"; data: { label: string; value: number }[]; width: number; height: number; delay?: number; unit?: string };
export const Chart: React.FC<ChartProps> = ({ type = "bar", data, width, height, delay = 0, unit = "" }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const max = Math.max(...data.map((d) => d.value)) * 1.18;
  const padB = 64, padT = 40;
  const ch = height - padB - padT;
  const slot = width / data.length;
  const grow = (i: number) => interpolate(frame - delay - i * 4, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const pts = data.map((d, i) => ({ x: slot * i + slot / 2, y: padT + ch - (d.value / max) * ch * grow(i) }));
  const ink = edge(theme.dark);
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {[0, 0.5, 1].map((g) => (
        <line key={g} x1={0} x2={width} y1={padT + ch * g} y2={padT + ch * g} stroke={theme.line} strokeWidth={2} strokeDasharray={g === 1 ? undefined : "8 8"} />
      ))}
      {type === "bar" &&
        data.map((d, i) => {
          const h = (d.value / max) * ch * grow(i);
          const w = slot * 0.56;
          const last = i === data.length - 1;
          return (
            <g key={d.label}>
              <rect x={slot * i + (slot - w) / 2} y={padT + ch - h} width={w} height={h} rx={12} fill={last ? color.lime : tilePalette[(i + 1) % tilePalette.length]} stroke={ink} strokeWidth={4} />
              <text x={slot * i + slot / 2} y={padT + ch - h - 14} textAnchor="middle" fontSize={28} fontWeight={900} fontFamily={font.display} fill={theme.text} opacity={grow(i)}>{d.value}{unit}</text>
            </g>
          );
        })}
      {type === "line" && (
        <>
          <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={ink} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={14} fill={color.lime} stroke={ink} strokeWidth={5} opacity={grow(i)} />
          ))}
        </>
      )}
      {data.map((d, i) => (
        <text key={d.label} x={slot * i + slot / 2} y={height - 18} textAnchor="middle" fontSize={26} fontWeight={700} fill={theme.muted} fontFamily={font.body}>{d.label}</text>
      ))}
    </svg>
  );
};

// ---------- ComparisonCard ----------
export type ComparisonCardProps = {
  left: { title: string; points: string[]; icon?: string };
  right: { title: string; points: string[]; icon?: string };
  delay?: number;
  stacked?: boolean;
};
const Side: React.FC<{ s: ComparisonCardProps["left"]; good: boolean; delay: number; dir: number }> = ({ s, good, delay, dir }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  const bg = good ? (theme.dark ? color.inkSoft : color.limeSoft) : "#FFE6DF";
  const accent = good ? color.green : color.red;
  return (
    <div style={{ ...cardStyle(theme, { tilt: (good ? 0.8 : -0.8) * Math.min(1, p) }), flex: 1, padding: space.md, background: bg, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 60 * dir}px) rotate(${(good ? 0.8 : -0.8) * Math.min(1, p)}deg)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        {s.icon && <IconTile icon={s.icon} size={72} tone={good ? color.lime : color.coral} delay={delay + 4} index={good ? 0 : 2} />}
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 42, fontWeight: 900, color: theme.text }}>{s.title}</div>
      </div>
      {s.points.map((pt) => (
        <div key={pt} style={{ fontSize: 33, lineHeight: 1.4, display: "flex", gap: 14, marginBottom: 10, fontWeight: 600, color: theme.text }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, flexShrink: 0, marginTop: 2 }}>{good ? "✓" : "✕"}</span>
          <span>{pt}</span>
        </div>
      ))}
    </div>
  );
};
export const ComparisonCard: React.FC<ComparisonCardProps> = ({ left, right, delay = 0, stacked = true }) => (
  <div style={{ display: "flex", flexDirection: stacked ? "column" : "row", gap: space.md }}>
    <Side s={left} good={false} delay={delay} dir={-1} />
    <Side s={right} good delay={delay + 10} dir={1} />
  </div>
);

// ---------- BeforeAfter: thanh trượt tiết lộ ----------
export type BeforeAfterProps = { before: React.ReactNode; after: React.ReactNode; width: number; height: number; revealAt?: number; revealDuration?: number };
export const BeforeAfter: React.FC<BeforeAfterProps> = ({ before, after, width, height, revealAt = 20, revealDuration = 40 }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const t = interpolate(frame, [revealAt, revealAt + revealDuration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => x * x * (3 - 2 * x) });
  const x = t * width;
  return (
    <div style={{ ...cardStyle(theme), position: "relative", width, height, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>{before}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${width - x}px 0 0)` }}>{after}</div>
      <div style={{ position: "absolute", left: x - 4, top: 0, bottom: 0, width: 8, background: color.ink }} />
      <div style={{ position: "absolute", left: x - 28, top: height / 2 - 28, width: 56, height: 56, borderRadius: 28, background: color.lime, border: `5px solid ${color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900 }}>⇄</div>
      <div style={{ position: "absolute", right: 16, top: 16, padding: "6px 18px", borderRadius: radius.pill, background: "#fff", border: `3px solid ${color.ink}`, fontFamily: font.display, fontWeight: 900, fontSize: 26 }}>TRƯỚC</div>
      <div style={{ position: "absolute", left: 16, top: 16, padding: "6px 18px", borderRadius: radius.pill, background: color.lime, border: `3px solid ${color.ink}`, fontFamily: font.display, fontWeight: 900, fontSize: 26 }}>SAU ✨</div>
    </div>
  );
};

// ---------- FlowDiagram ----------
export type FlowNode = { label: string; sub?: string; icon?: string };
export type FlowDiagramProps = { nodes: FlowNode[]; direction?: "vertical" | "horizontal"; delay?: number; stagger?: number; nodeSize?: number };
export const FlowDiagram: React.FC<FlowDiagramProps> = ({ nodes, direction = "vertical", delay = 0, stagger = 14, nodeSize = 34 }) => {
  const vertical = direction === "vertical";
  return (
    <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "stretch" }}>
      {nodes.map((n, i) => (
        <FlowItem key={n.label} node={n} index={i} total={nodes.length} delay={delay + i * stagger} vertical={vertical} size={nodeSize} />
      ))}
    </div>
  );
};
const FlowItem: React.FC<{ node: FlowNode; index: number; total: number; delay: number; vertical: boolean; size: number }> = ({ node, index, total, delay, vertical, size }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  const arrow = useEnter(delay + 8, "pop");
  const bob = useFloat(4, 18, index * 6);
  return (
    <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "center", flex: vertical ? undefined : 1 }}>
      <div style={{ ...cardStyle(theme, { shadowOffset: 6 }), width: vertical ? "100%" : undefined, flex: vertical ? undefined : 1, boxSizing: "border-box", padding: "18px 24px", display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, p * 1.5), transform: `translateY(${bob * 0.4}px) scale(${0.9 + p * 0.1})` }}>
        <IconTile icon={node.icon ?? String(index + 1)} index={index} delay={delay + 2} size={80} />
        <div>
          <div style={{ fontFamily: theme.fontDisplay, fontSize: size, fontWeight: 900, lineHeight: 1.2 }}>{node.label}</div>
          {node.sub && <div style={{ fontSize: size * 0.72, color: theme.muted, marginTop: 4, fontWeight: 500 }}>{node.sub}</div>}
        </div>
      </div>
      {index < total - 1 && (
        <div style={{ width: 52, height: 52, borderRadius: 26, margin: vertical ? "6px 0" : "0 8px", background: color.lime, border: `4px solid ${edge(theme.dark)}`, color: color.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, transform: `scale(${Math.max(0, arrow)})` }}>{vertical ? "↓" : "→"}</div>
      )}
    </div>
  );
};

// ---------- StepByStep ----------
export type StepByStepProps = { steps: { title: string; detail?: string; icon?: string }[]; activeIndex: number; delay?: number };
export const StepByStep: React.FC<StepByStepProps> = ({ steps, activeIndex, delay = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: space.sm + 4 }}>
    {steps.map((s, i) => (
      <StepRow key={s.title} s={s} i={i} active={i === activeIndex} done={i < activeIndex} delay={delay + i * 8} />
    ))}
  </div>
);
const StepRow: React.FC<{ s: { title: string; detail?: string; icon?: string }; i: number; active: boolean; done: boolean; delay: number }> = ({ s, i, active, done, delay }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  const pop = useEnter(active ? delay : 9999, "bounce");
  return (
    <div style={{ ...cardStyle(theme, { shadowOffset: active ? 10 : 5 }), display: "flex", gap: 22, alignItems: "center", padding: "18px 24px", background: active ? (theme.dark ? color.inkSoft : color.limeSoft) : theme.surface, opacity: Math.min(1, p * 1.5) * (active || done ? 1 : 0.55), transform: `translateX(${(1 - p) * -50}px) scale(${active ? 1.02 : 1})` }}>
      <IconTile icon={done ? "✅" : s.icon ?? String(i + 1)} index={i} size={84} delay={delay + 2} wiggle={active} tone={done ? color.mint : undefined} />
      <div>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, fontWeight: 900 }}>{s.title}</div>
        {s.detail && <div style={{ fontSize: 29, color: theme.muted, marginTop: 4, fontWeight: 500 }}>{s.detail}</div>}
      </div>
    </div>
  );
};

// ---------- ProductShowcase ----------
export type ProductShowcaseProps = { name: string; tagline: string; features: string[]; badge?: string; delay?: number; mock?: React.ReactNode };
export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ name, tagline, features, badge, delay = 0, mock }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "pop");
  return (
    <div style={{ opacity: Math.min(1, p * 2), transform: `scale(${0.9 + p * 0.1})` }}>
      <div style={{ ...cardStyle(theme, { radius: radius.lg }), padding: space.lg, position: "relative" }}>
        {badge && <div style={{ position: "absolute", right: 24, top: -28 }}><Sticker text={badge} tone={color.sun} rotate={6} delay={delay + 8} size={30} /></div>}
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 64, fontWeight: 900, letterSpacing: -1.5 }}>{name}</div>
        <div style={{ fontSize: 32, color: theme.muted, margin: "6px 0 22px", fontWeight: 500 }}>{tagline}</div>
        {mock}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: mock ? 22 : 0 }}>
          <Features items={features} delay={delay + 10} />
        </div>
      </div>
    </div>
  );
};
const Features: React.FC<{ items: string[]; delay: number }> = ({ items, delay }) => (
  <>
    {items.map((f, i) => (
      <FeatureRow key={f} text={f} delay={delay + i * 6} />
    ))}
  </>
);
const FeatureRow: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const p = useEnter(delay, "pop");
  return (
    <div style={{ fontSize: 33, fontWeight: 600, display: "flex", gap: 14, alignItems: "center", opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -30}px)` }}>
      <span style={{ width: 40, height: 40, borderRadius: 20, background: color.lime, border: `3px solid ${color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, flexShrink: 0 }}>✓</span>
      {text}
    </div>
  );
};

// ---------- CTA ----------
export type CTAProps = { headline: string; sub?: string; button: string; handle?: string; delay?: number; emoji?: string };
export const CTA: React.FC<CTAProps> = ({ headline, sub, button, handle, delay = 0, emoji = "🚀" }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  const sp = useEnter(delay + 8);
  const hp = useEnter(delay + 24);
  return (
    <div style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: space.md }}>
      <Confetti at={delay + 16} width={677} height={900} />
      <div style={{ fontSize: 120, fontFamily: font.emoji, transform: `scale(${Math.max(0, p)}) rotate(${(1 - Math.min(1, p)) * 40}deg)` }}>{emoji}</div>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 74, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1.5, color: theme.text, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)` }}>{headline}</div>
      {sub && <div style={{ fontSize: 36, color: theme.muted, fontWeight: 600, opacity: Math.min(1, sp) }}>{sub}</div>}
      <Button label={button} delay={delay + 14} pressedAt={delay + 70} size={40} />
      {handle && <div style={{ fontFamily: theme.fontDisplay, fontSize: 38, fontWeight: 900, color: theme.accentText, opacity: Math.min(1, hp) }}>{handle}</div>}
    </div>
  );
};
