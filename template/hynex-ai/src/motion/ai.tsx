// 14 MOTION ĐẶC TRƯNG HYNEX AI (UI animation · infographic động). Mỗi cái vừa vùng 880×~540.
import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, C, HEAD, clamp } from "../brand";
import { ease } from "./base";

type S = { start?: number };
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const fmt = (v: number, d = 0) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// 1 · PROMPT TYPING: gõ prompt → "đang tạo" → kết quả hiện từng dòng
export const PromptTyping: React.FC<S & { prompt: string; output: string[] }> = ({ start = 0, prompt, output }) => {
  const f = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor((f / fps) * 34));
  const typed = prompt.slice(0, n);
  const typedEnd = Math.ceil((prompt.length / 34) * fps);
  const gen = f > typedEnd + 4 && f < typedEnd + 22;
  return (
    <div style={{ width: 880, fontFamily: BODY }}>
      <div style={{ background: C.bg3, border: `2px solid ${C.blue}`, borderRadius: 24, padding: "24px 28px", color: C.white, fontSize: 36, lineHeight: 1.4, minHeight: 120 }}>
        <span style={{ color: C.lime, fontFamily: mono, fontWeight: 700 }}>{"> "}</span>
        {typed}
        <span style={{ display: "inline-block", width: 14, height: 38, background: C.lime, marginLeft: 4, verticalAlign: "text-bottom", opacity: n < prompt.length || Math.floor(f / 12) % 2 ? 1 : 0 }} />
      </div>
      <div style={{ marginTop: 22, background: C.bg2, border: `2px solid ${C.line}`, borderRadius: 24, padding: "22px 28px", minHeight: 220 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.blueSoft, fontFamily: HEAD, fontWeight: 700, fontSize: 26, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.blue}, ${C.lime})`, rotate: `${f * 6}deg` }} />
          {gen ? "Generating" + ".".repeat(1 + (Math.floor(f / 5) % 3)) : f > typedEnd ? "AI output" : "Waiting for prompt"}
        </div>
        {output.map((o, i) => {
          const s = typedEnd + 22 + i * 10;
          return (
            <div key={i} style={{ color: C.text, fontSize: 32, lineHeight: 1.45, opacity: interpolate(f, [s, s + 8], [0, 1], clamp), translate: `0px ${interpolate(f, [s, s + 8], [14, 0], clamp)}px` }}>
              <span style={{ color: C.lime }}>✓ </span>
              {o}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2 · NEURAL NETWORK: các node nối nhau, xung dữ liệu chạy qua
export const NeuralNetwork: React.FC<S> = ({ start = 0 }) => {
  const f = useCurrentFrame() - start;
  const layers = [3, 5, 5, 2];
  const X = (l: number) => 90 + l * 230;
  const Y = (l: number, i: number) => 270 + (i - (layers[l] - 1) / 2) * 100;
  const draw = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: ease });
  const edges: [number, number, number, number][] = [];
  layers.forEach((n, l) => {
    if (l === layers.length - 1) return;
    for (let i = 0; i < n; i++) for (let j = 0; j < layers[l + 1]; j++) edges.push([X(l), Y(l, i), X(l + 1), Y(l + 1, j)]);
  });
  return (
    <svg width={880} height={540} viewBox="0 0 880 540">
      {edges.map(([x1, y1, x2, y2], k) => (
        <line key={k} x1={x1} y1={y1} x2={x1 + (x2 - x1) * draw} y2={y1 + (y2 - y1) * draw} stroke={C.line} strokeWidth={2} />
      ))}
      {edges.filter((_, k) => k % 4 === 0).map(([x1, y1, x2, y2], k) => {
        const t = ((f - 30 + k * 7) % 40) / 40;
        if (f < 30) return null;
        return <circle key={k} cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={6} fill={k % 2 ? C.lime : C.blueSoft} />;
      })}
      {layers.map((n, l) =>
        Array.from({ length: n }).map((_, i) => {
          const pulse = Math.sin((f - l * 6) / 6) * 0.5 + 0.5;
          return (
            <g key={`${l}-${i}`} opacity={interpolate(f, [l * 4, l * 4 + 8], [0, 1], clamp)}>
              <circle cx={X(l)} cy={Y(l, i)} r={26} fill={C.bg3} stroke={l === layers.length - 1 ? C.lime : C.blue} strokeWidth={5} />
              <circle cx={X(l)} cy={Y(l, i)} r={10 + pulse * 4} fill={l === layers.length - 1 ? C.lime : C.blue} opacity={0.4 + pulse * 0.6} />
            </g>
          );
        }),
      )}
    </svg>
  );
};

// 3 · MODEL BATTLE: so sánh 2 model theo từng tiêu chí, có badge thắng
export const ModelBattle: React.FC<S & { a: string; b: string; rows: { label: string; a: number; b: number; unit?: string; lowerIsBetter?: boolean }[] }> = ({ start = 0, a, b, rows }) => {
  const f = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const vs = spring({ frame: f, fps, config: { damping: 9, stiffness: 200 } });
  return (
    <div style={{ width: 880, fontFamily: BODY }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        {[a, b].map((n, i) => (
          <div key={n} style={{ width: 360, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 44, color: C.white, background: i ? `${C.lime}22` : `${C.blue}33`, border: `3px solid ${i ? C.lime : C.blue}`, borderRadius: 22, padding: "18px 0", translate: `${(1 - vs) * (i ? 200 : -200)}px 0px` }}>
            {n}
          </div>
        ))}
        <div style={{ position: "absolute", left: 400, width: 80, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 44, color: C.amber, scale: `${vs}` }}>VS</div>
      </div>
      {rows.map((r, i) => {
        const s = 14 + i * 12;
        const p = interpolate(f, [s, s + 24], [0, 1], { ...clamp, easing: ease });
        const max = Math.max(r.a, r.b);
        const aWin = r.lowerIsBetter ? r.a < r.b : r.a > r.b;
        return (
          <div key={i} style={{ marginBottom: 22 }}>
            <div style={{ color: C.muted, fontSize: 28, fontWeight: 600, textAlign: "center", marginBottom: 8 }}>{r.label}</div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              {[r.a, r.b].map((v, j) => (
                <div key={j} style={{ flex: 1, display: "flex", justifyContent: j ? "flex-start" : "flex-end", alignItems: "center", gap: 12, flexDirection: j ? "row" : "row-reverse" }}>
                  <div style={{ height: 46, width: (360 * v * p) / max, borderRadius: 12, background: j ? C.lime : C.blue, opacity: (j ? !aWin : aWin) ? 1 : 0.45 }} />
                  <div style={{ color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 34, opacity: p }}>
                    {fmt(v * p, v % 1 ? 1 : 0)}
                    {r.unit ?? ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 4 · WORKFLOW FLOW (và AI Workflow nhận diện): các khối nối nhau, gói dữ liệu chạy qua, lần lượt sáng và tích xong
export const WorkflowFlow: React.FC<S & { steps: string[]; every?: number }> = ({ start = 0, steps, every = 22 }) => {
  const f = useCurrentFrame() - start;
  const rowH = Math.min(120, 520 / steps.length);
  return (
    <div style={{ position: "relative", width: 880, height: steps.length * rowH, fontFamily: BODY }}>
      <svg width={880} height={steps.length * rowH} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={60} y1={rowH / 2} x2={60} y2={rowH / 2 + (steps.length - 1) * rowH * interpolate(f, [0, steps.length * every], [0, 1], clamp)} stroke={C.blue} strokeWidth={6} />
        {f > 4 && f < steps.length * every ? (
          <circle cx={60} cy={rowH / 2 + (((f % every) / every) + Math.floor(f / every)) * rowH} r={12} fill={C.lime} />
        ) : null}
      </svg>
      {steps.map((s, i) => {
        const on = f >= i * every + every * 0.6;
        const appear = interpolate(f, [i * every - 6, i * every + 4], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: i * rowH, height: rowH, display: "flex", alignItems: "center", gap: 26, opacity: Math.max(0.35, appear) }}>
            <div style={{ width: 120, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 58, height: 58, borderRadius: 18, background: on ? C.lime : C.bg3, border: `4px solid ${on ? C.lime : C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.bg, fontWeight: 800, fontSize: 30 }}>
                {on ? "✓" : ""}
              </div>
            </div>
            <div style={{ width: 720, background: on ? `${C.lime}18` : C.bg2, border: `2px solid ${on ? C.lime : C.line}`, borderRadius: 20, padding: "18px 24px", color: C.white, fontSize: 34, fontWeight: 600, boxShadow: on ? `0 0 30px ${C.lime}33` : undefined }}>
              {s}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 5 · FEATURE REVEAL: thẻ mở ra từ một vạch sáng, tính năng tích lần lượt
export const FeatureReveal: React.FC<S & { name: string; features: string[] }> = ({ start = 0, name, features }) => {
  const f = useCurrentFrame() - start;
  const open = interpolate(f, [6, 22], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ width: 880, position: "relative" }}>
      <div style={{ height: 6, width: interpolate(f, [0, 8], [0, 880], clamp), background: C.lime, borderRadius: 3, opacity: 1 - open * 0.8 }} />
      <div style={{ background: `linear-gradient(160deg, ${C.blue}40, ${C.bg2} 60%)`, border: `2px solid ${C.blue}`, borderRadius: 28, padding: "28px 34px", scale: `1 ${open}`, transformOrigin: "top", marginTop: -6 }}>
        <div style={{ color: C.lime, fontFamily: HEAD, fontWeight: 700, fontSize: 28, letterSpacing: "0.08em" }}>NEW FEATURE</div>
        <div style={{ color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 56, margin: "6px 0 18px" }}>{name}</div>
        {features.map((t, i) => {
          const s = 26 + i * 10;
          return (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", color: C.text, fontSize: 34, lineHeight: 1.6, opacity: interpolate(f, [s, s + 8], [0, 1], clamp), translate: `${interpolate(f, [s, s + 8], [30, 0], clamp)}px 0px` }}>
              <span style={{ color: C.bg, background: C.lime, borderRadius: 8, width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24 }}>✓</span>
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 6 · SCREEN ZOOM: cửa sổ phần mềm, chuột di chuyển, bấm, camera phóng vào vùng nút
export const ScreenZoom: React.FC<S & { app: string; button: string; src?: string }> = ({ start = 0, app, button, src }) => {
  const f = useCurrentFrame() - start;
  const z = interpolate(f, [40, 70], [1, 1.7], { ...clamp, easing: ease });
  const cx = interpolate(f, [8, 36], [120, 600], { ...clamp, easing: ease });
  const cy = interpolate(f, [8, 36], [440, 330], { ...clamp, easing: ease });
  const click = interpolate(f, [36, 40, 46], [1, 0.8, 1], clamp);
  const pressed = f > 38;
  return (
    <div style={{ width: 880, height: 540, overflow: "hidden", borderRadius: 26, border: `2px solid ${C.line}`, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, scale: `${z}`, transformOrigin: "640px 330px" }}>
        <div style={{ height: 52, background: C.bg3, display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
          {[C.red, C.amber, C.lime].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
          ))}
          <div style={{ marginLeft: 16, color: C.muted, fontSize: 22, fontFamily: HEAD }}>{app}</div>
        </div>
        {src ? (
          <Img src={staticFile(src)} style={{ width: 880, height: 488, objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", height: 488, background: C.bg2 }}>
            <div style={{ width: 200, borderRight: `2px solid ${C.line}`, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ height: 22, borderRadius: 8, background: i === 1 ? C.blue : C.line, width: i % 2 ? 120 : 150 }} />
              ))}
            </div>
            <div style={{ flex: 1, padding: 26 }}>
              <div style={{ height: 34, width: 380, borderRadius: 10, background: C.line }} />
              <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ flex: 1, height: 130, borderRadius: 16, background: C.bg3, border: `2px solid ${C.line}` }} />
                ))}
              </div>
              <div style={{ marginTop: 30, marginLeft: 280, width: 260, height: 64, borderRadius: 16, background: pressed ? C.lime : C.blue, color: pressed ? C.bg : C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 26, boxShadow: pressed ? `0 0 40px ${C.lime}88` : undefined }}>
                {button}
              </div>
            </div>
          </div>
        )}
        <svg width={40} height={48} viewBox="0 0 40 48" style={{ position: "absolute", left: cx, top: cy, scale: `${click}` }}>
          <path d="M4 2l30 26-14 2 8 16-6 3-8-16-10 9z" fill={C.white} stroke={C.bg} strokeWidth={3} strokeLinejoin="round" />
        </svg>
        {pressed ? <div style={{ position: "absolute", left: cx - 30 + 4, top: cy - 30 + 4, width: 60, height: 60, borderRadius: 30, border: `4px solid ${C.lime}`, opacity: interpolate(f, [38, 52], [1, 0], clamp), scale: `${interpolate(f, [38, 52], [0.4, 1.6], clamp)}` }} /> : null}
      </div>
    </div>
  );
};

// 7 · BEFORE & AFTER: thanh trượt quét từ "trước" sang "sau khi dùng AI"
export const BeforeAfter: React.FC<S & { before: string[]; after: string[]; beforeLabel?: string; afterLabel?: string }> = ({ start = 0, before, after, beforeLabel = "BEFORE", afterLabel = "WITH AI" }) => {
  const f = useCurrentFrame() - start;
  const x = interpolate(f, [16, 50], [880, 0], { ...clamp, easing: ease });
  const Side: React.FC<{ items: string[]; label: string; on: boolean }> = ({ items, label, on }) => (
    <div style={{ position: "absolute", inset: 0, background: on ? `linear-gradient(160deg, ${C.blue}55, ${C.bg2}), ${C.bg2}` : C.bg2, padding: 34 }}>
      <div style={{ color: on ? C.lime : C.muted, fontFamily: HEAD, fontWeight: 700, fontSize: 30, letterSpacing: "0.08em" }}>{label}</div>
      {items.map((t, i) => (
        <div key={i} style={{ color: on ? C.white : C.muted, fontSize: 36, fontWeight: on ? 600 : 500, marginTop: 22, textDecoration: on ? "none" : "line-through", textDecorationColor: C.red }}>
          {on ? "✓ " : "× "}
          {t}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ width: 880, height: 460, position: "relative", borderRadius: 26, overflow: "hidden", border: `2px solid ${C.line}`, fontFamily: BODY }}>
      <Side items={before} label={beforeLabel} on={false} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${x}px)` }}>
        <Side items={after} label={afterLabel} on />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: x - 3, width: 6, background: C.lime, boxShadow: `0 0 24px ${C.lime}` }} />
    </div>
  );
};

// 8 · TOKEN STREAM: chữ tách thành token, chạy theo dòng vào model rồi ra
export const TokenStream: React.FC<S & { text: string }> = ({ start = 0, text }) => {
  const f = useCurrentFrame() - start;
  const toks = text.match(/\S+\s?/g) ?? [];
  return (
    <div style={{ width: 880, height: 460, position: "relative", fontFamily: mono }}>
      <div style={{ position: "absolute", left: 340, top: 150, width: 200, height: 160, borderRadius: 30, background: `linear-gradient(135deg, ${C.blue}, ${C.lime})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 40 }}>
        MODEL
      </div>
      {toks.map((t, i) => {
        const s = i * 5;
        const p = interpolate(f, [s, s + 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
        const lane = i % 3;
        const x = interpolate(p, [0, 0.45, 0.55, 1], [-180, 300, 520, 960]);
        const y = 90 + lane * 120 + Math.sin(p * Math.PI * 2) * 10;
        const inside = p > 0.45 && p < 0.55;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: inside ? 0 : 1, background: p > 0.5 ? `${C.lime}22` : `${C.blue}33`, border: `2px solid ${p > 0.5 ? C.lime : C.blue}`, color: C.white, borderRadius: 10, padding: "6px 12px", fontSize: 28, whiteSpace: "pre" }}>
            {t.trim()}
          </div>
        );
      })}
    </div>
  );
};

// 9 · MODEL RANKING: bảng xếp hạng, các dòng đổi chỗ theo điểm
export const ModelRanking: React.FC<S & { rows: { name: string; before: number; after: number }[]; metric?: string }> = ({ start = 0, rows, metric = "Score" }) => {
  const f = useCurrentFrame() - start;
  const t = interpolate(f, [24, 56], [0, 1], { ...clamp, easing: ease });
  const score = (r: { before: number; after: number }) => r.before + (r.after - r.before) * t;
  const ordBefore = [...rows].sort((a, b) => b.before - a.before).map((r) => r.name);
  const ordAfter = [...rows].sort((a, b) => b.after - a.after).map((r) => r.name);
  const max = Math.max(...rows.map((r) => Math.max(r.before, r.after)));
  return (
    <div style={{ width: 880, height: rows.length * 96 + 50, position: "relative", fontFamily: BODY }}>
      <div style={{ color: C.muted, fontSize: 26, fontWeight: 600, textAlign: "right" }}>{metric}</div>
      {rows.map((r, i) => {
        const y = 50 + interpolate(t, [0, 1], [ordBefore.indexOf(r.name), ordAfter.indexOf(r.name)]) * 96;
        const rank = Math.round(interpolate(t, [0, 1], [ordBefore.indexOf(r.name), ordAfter.indexOf(r.name)])) + 1;
        const top = rank === 1;
        return (
          <div key={r.name} style={{ position: "absolute", left: 0, top: y, width: 880, height: 80, display: "flex", alignItems: "center", gap: 18, opacity: interpolate(f, [i * 4, i * 4 + 8], [0, 1], clamp) }}>
            <div style={{ width: 64, color: top ? C.lime : C.muted, fontFamily: HEAD, fontWeight: 700, fontSize: 40 }}>#{rank}</div>
            <div style={{ width: 230, color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 36 }}>{r.name}</div>
            <div style={{ flex: 1, height: 44, background: C.bg2, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(score(r) / max) * 100}%`, background: top ? `linear-gradient(90deg, ${C.blue}, ${C.lime})` : C.blue, borderRadius: 12 }} />
            </div>
            <div style={{ width: 100, textAlign: "right", color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 34 }}>{fmt(score(r))}</div>
          </div>
        );
      })}
    </div>
  );
};

// 10 · COST COUNTER: chi phí API chạy số, kèm đơn vị
export const CostCounter: React.FC<S & { from: number; to: number; unit?: string; label?: string; decimals?: number }> = ({ start = 0, from, to, unit = "per 1M tokens", label = "API cost", decimals = 2 }) => {
  const f = useCurrentFrame() - start;
  const v = interpolate(f, [8, 46], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  const down = to < from;
  const pct = Math.round(((to - from) / from) * 100);
  return (
    <div style={{ width: 880, fontFamily: BODY }}>
      <div style={{ color: C.muted, fontSize: 32, fontWeight: 600 }}>{label}</div>
      <div style={{ color: down ? C.lime : C.red, fontFamily: HEAD, fontWeight: 700, fontSize: 200, lineHeight: 1.05, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>${fmt(v, decimals)}</div>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <div style={{ color: C.text, fontSize: 34 }}>{unit}</div>
        <div style={{ background: down ? `${C.lime}22` : `${C.red}22`, border: `2px solid ${down ? C.lime : C.red}`, color: down ? C.lime : C.red, borderRadius: 999, padding: "6px 18px", fontFamily: HEAD, fontWeight: 700, fontSize: 30, opacity: interpolate(f, [44, 52], [0, 1], clamp) }}>
          {pct > 0 ? "+" : ""}
          {pct}%
        </div>
        <div style={{ color: C.muted, fontSize: 30, textDecoration: "line-through", opacity: interpolate(f, [44, 52], [0, 1], clamp) }}>${fmt(from, decimals)}</div>
      </div>
    </div>
  );
};

// 11 · SPEED COMPARISON: hai thanh chạy đua, đồng hồ đếm thời gian
export const SpeedRace: React.FC<S & { a: { name: string; seconds: number }; b: { name: string; seconds: number } }> = ({ start = 0, a, b }) => {
  const f = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const maxS = Math.max(a.seconds, b.seconds);
  const scale = 60 / maxS; // cuộc đua dài tối đa 2 giây hình
  const Lane: React.FC<{ r: { name: string; seconds: number }; col: string }> = ({ r, col }) => {
    const p = interpolate(f - 10, [0, r.seconds * scale], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
    const t = Math.min(r.seconds, ((f - 10) / (r.seconds * scale)) * r.seconds);
    const fin = p >= 1;
    return (
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 38, marginBottom: 10 }}>
          <span>{r.name}</span>
          <span style={{ color: fin ? col : C.muted, fontVariantNumeric: "tabular-nums" }}>{fmt(Math.max(0, t), 1)}s</span>
        </div>
        <div style={{ height: 56, background: C.bg2, borderRadius: 16, overflow: "hidden", border: `2px solid ${C.line}` }}>
          <div style={{ height: "100%", width: `${p * 100}%`, background: col, borderRadius: 14 }} />
        </div>
      </div>
    );
  };
  const winner = a.seconds < b.seconds ? a.name : b.name;
  return (
    <div style={{ width: 880, fontFamily: BODY }}>
      <Lane r={a} col={C.blue} />
      <Lane r={b} col={C.lime} />
      <div style={{ color: C.amber, fontFamily: HEAD, fontWeight: 700, fontSize: 36, opacity: interpolate(f, [10 + 60 + 4, 10 + 60 + 12], [0, 1], clamp), scale: `${spring({ frame: f - 74, fps, config: { damping: 9 } })}`, transformOrigin: "left" }}>
        ⚡ {winner} {Math.round((Math.max(a.seconds, b.seconds) / Math.min(a.seconds, b.seconds)) * 10) / 10}x faster
      </div>
    </div>
  );
};

// 12 · MORPHING: ảnh tĩnh biến thành video (khung ảnh nở thành trình phát có thanh thời gian)
export const Morphing: React.FC<S & { src?: string; label?: string }> = ({ start = 0, src, label = "Image → Video" }) => {
  const f = useCurrentFrame() - start;
  const m = interpolate(f, [20, 46], [0, 1], { ...clamp, easing: ease });
  const play = interpolate(f, [46, 120], [0, 1], clamp);
  return (
    <div style={{ width: 880, height: 520, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: HEAD }}>
      <div style={{ color: C.lime, fontWeight: 700, fontSize: 30, letterSpacing: "0.06em", marginBottom: 16 }}>{label.toUpperCase()}</div>
      <div style={{ position: "relative", width: interpolate(m, [0, 1], [360, 780]), height: interpolate(m, [0, 1], [360, 440]), borderRadius: interpolate(m, [0, 1], [180, 24]), overflow: "hidden", border: `4px solid ${m > 0.5 ? C.lime : C.blue}` }}>
        {src ? (
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: `${1 + play * 0.12}` }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(${135 + play * 90}deg, ${C.blue}, ${C.bg3} 50%, ${C.lime})` }} />
        )}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: `${C.bg}CC`, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", opacity: m }}>
          <svg width={28} height={30} viewBox="0 0 28 30"><path d="M2 2l24 13L2 28z" fill={C.white} /></svg>
          <div style={{ flex: 1, height: 8, background: C.line, borderRadius: 4 }}>
            <div style={{ width: `${play * 100}%`, height: "100%", background: C.lime, borderRadius: 4 }} />
          </div>
          <div style={{ color: C.white, fontSize: 22 }}>0:0{Math.floor(play * 8)}</div>
        </div>
      </div>
    </div>
  );
};

// 13 · DATA SCAN: quét tài liệu, các trường thông tin bay ra thành bảng
export const DataScan: React.FC<S & { fields: { key: string; value: string }[] }> = ({ start = 0, fields }) => {
  const f = useCurrentFrame() - start;
  const scan = interpolate(f, [6, 46], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <div style={{ width: 880, height: 500, display: "flex", gap: 34, fontFamily: BODY }}>
      <div style={{ position: "relative", width: 320, height: 440, background: C.text, borderRadius: 18, padding: 26, overflow: "hidden" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ height: 16, borderRadius: 8, background: i === 0 ? C.bg : "#B9BEDF", width: i === 0 ? 160 : [260, 220, 250, 200, 240, 180, 260, 210, 150][i - 1], marginBottom: 22 }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: scan * 440 - 60, height: 60, background: `linear-gradient(180deg, ${C.lime}00, ${C.lime}66)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: scan * 440, height: 5, background: C.lime, boxShadow: `0 0 18px ${C.lime}` }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 10 }}>
        {fields.map((fl, i) => {
          const s = 12 + i * 9;
          return (
            <div key={i} style={{ background: C.bg2, border: `2px solid ${C.lime}`, borderRadius: 16, padding: "14px 20px", opacity: interpolate(f, [s, s + 8], [0, 1], clamp), translate: `${interpolate(f, [s, s + 10], [-160, 0], { ...clamp, easing: ease })}px 0px` }}>
              <div style={{ color: C.lime, fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}>{fl.key.toUpperCase()}</div>
              <div style={{ color: C.white, fontSize: 32, fontWeight: 600 }}>{fl.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 14 · AGENT AUTOMATION: agent tự xử lý từng việc: đang chạy → xong
export const AgentAutomation: React.FC<S & { tasks: string[]; every?: number }> = ({ start = 0, tasks, every = 20 }) => {
  const f = useCurrentFrame() - start;
  return (
    <div style={{ width: 880, fontFamily: BODY }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg, ${C.blue}, ${C.lime})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: 5, background: C.white }} />
          <div style={{ width: 9, height: 9, borderRadius: 5, background: C.white }} />
        </div>
        <div style={{ color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 36 }}>Agent running</div>
        <div style={{ marginLeft: "auto", color: C.lime, fontFamily: HEAD, fontWeight: 700, fontSize: 32 }}>
          {Math.min(tasks.length, Math.max(0, Math.floor((f - 10) / every)))}/{tasks.length}
        </div>
      </div>
      {tasks.map((t, i) => {
        const s = 10 + i * every;
        const doneT = f >= s + every;
        const running = f >= s && !doneT;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, background: doneT ? `${C.lime}14` : C.bg2, border: `2px solid ${doneT ? C.lime : running ? C.blue : C.line}`, borderRadius: 18, padding: "18px 22px", marginBottom: 14, opacity: f >= s - 8 ? 1 : 0.4 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: doneT ? C.lime : "transparent", border: doneT ? "none" : `4px solid ${running ? C.blue : C.line}`, borderTopColor: running ? C.lime : undefined, rotate: running ? `${f * 18}deg` : "0deg", color: C.bg, fontWeight: 800, fontSize: 24 }}>
              {doneT ? "✓" : ""}
            </div>
            <div style={{ color: doneT ? C.white : C.text, fontSize: 32, fontWeight: 600 }}>{t}</div>
          </div>
        );
      })}
    </div>
  );
};
