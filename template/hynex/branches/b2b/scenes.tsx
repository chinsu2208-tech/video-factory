// HYNEX B2B — giọng: ngắn gọn, chuyên nghiệp, NÊU BẬT LỢI ÍCH (mỗi cảnh mở bằng kết quả khách hàng nhận được).
// Hình ảnh: nền trắng sạch, navy + lime tiết chế, bóng mềm, icon tile tĩnh (không lắc), đường kẻ mảnh.
// Ưu tiên 9:16 (xếp dọc); tự chuyển bố cục ngang khi orientation = horizontal (YouTube).
import React from "react";
import { Audio, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { color, font, radius, space } from "../../brand/tokens";
import { ChatConversation, ChatMessage, PhoneMockup, PhoneVideo, Chart, CTA, IconTile, MetricCard, ProductShowcase, StepByStep, cardStyle, useEnter, useHynex } from "../../core-components";
import { Stage } from "../../scenes/SceneRunner";

/** Tiêu đề phần: chip số lime + tiêu đề (nêu lợi ích) + đường kẻ chạy ngang */
const Section: React.FC<{ n: string; title: string; sub?: string; size?: number }> = ({ n, title, sub, size = 46 }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 22], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = useEnter(2, "snappy");
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 20}px)` }}>
        <span style={{ minWidth: 60, height: 60, borderRadius: 16, background: color.lime, border: `3px solid ${color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.mono, fontSize: 28, fontWeight: 700 }}>{n}</span>
        <span style={{ fontFamily: theme.fontDisplay, fontSize: size, fontWeight: 800, letterSpacing: -1, lineHeight: 1.15 }}>{title}</span>
      </div>
      {sub && <div style={{ fontSize: 28, color: theme.muted, marginTop: 10, fontWeight: 500, opacity: Math.min(1, useEnter(10)) }}>{sub}</div>}
      <div style={{ height: 3, width: `${line}%`, background: color.ink, marginTop: 18 }} />
    </div>
  );
};

const useHoriz = () => useHynex().orientation === "horizontal";

/** Intro: kết quả khách nhận được + 3 con số */
export const B2BIntro: React.FC<{ eyebrow?: string; company: string; line: string; facts: { value: string; label: string }[] }> = ({ eyebrow = "Giải pháp", company, line, facts }) => {
  const { theme } = useHynex();
  const p = useEnter(4, "snappy");
  return (
    <Stage justify="center" gap={30}>
      <div style={{ alignSelf: "flex-start", padding: "6px 20px", borderRadius: radius.pill, background: color.lime, border: `3px solid ${color.ink}`, fontFamily: font.display, fontWeight: 800, fontSize: 26, letterSpacing: 2, textTransform: "uppercase", opacity: Math.min(1, useEnter(0)) }}>{eyebrow}</div>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 76, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.08, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>{company}</div>
      <div style={{ fontSize: 36, color: theme.muted, lineHeight: 1.4, fontWeight: 500, opacity: Math.min(1, useEnter(16)) }}>{line}</div>
      <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
        {facts.map((f, i) => (
          <Fact key={f.label} {...f} delay={26 + i * 8} />
        ))}
      </div>
    </Stage>
  );
};
const Fact: React.FC<{ value: string; label: string; delay: number }> = ({ value, label, delay }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ flex: 1, borderTop: `5px solid ${color.ink}`, paddingTop: 14, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 24}px)` }}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 60, fontWeight: 800, letterSpacing: -2 }}>{value}</div>
      <div style={{ fontSize: 24, color: theme.muted, fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
};

/** Service: dịch vụ + lợi ích mỗi dịch vụ */
export const B2BService: React.FC<{ title: string; services: { name: string; benefit: string; icon?: string }[]; note?: string }> = ({ title, services, note }) => {
  const horiz = useHoriz();
  const compact = services.length > 3;
  return (
    <Stage justify="center" gap={compact ? 22 : 32}>
      <Section n="01" title={title} />
      <div style={{ display: "flex", flexDirection: horiz ? "row" : "column", gap: 22 }}>
        {services.map((s, i) => (
          <ServiceCard key={s.name} {...s} delay={12 + i * 10} compact={compact} />
        ))}
      </div>
      {note && <div style={{ fontSize: 26, fontWeight: 700, color: "#5B6670", padding: "12px 18px", borderLeft: `6px solid ${color.lime}`, opacity: Math.min(1, useEnter(12 + services.length * 10 + 8)) }}>{note}</div>}
    </Stage>
  );
};
const ServiceCard: React.FC<{ name: string; benefit: string; icon?: string; delay: number; compact?: boolean }> = ({ name, benefit, icon = "✔", delay, compact }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ ...cardStyle(theme), flex: 1, padding: compact ? "14px 22px" : "22px 26px", display: "flex", gap: compact ? 16 : 20, alignItems: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
      <IconTile icon={icon} size={compact ? 64 : 84} tone={color.lime} wiggle={false} delay={delay + 2} />
      <div>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: compact ? 32 : 36, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: compact ? 24 : 28, color: theme.muted, fontWeight: 500, marginTop: 4, lineHeight: 1.35 }}>{benefit}</div>
      </div>
    </div>
  );
};

/** Problem → Solution: hai khối, lợi ích nổi bật */
export const B2BProblemSolution: React.FC<{ title: string; problems: string[]; solutions: string[] }> = ({ title, problems, solutions }) => {
  const horiz = useHoriz();
  return (
    <Stage justify="center" gap={30}>
      <Section n="02" title={title} />
      <div style={{ display: "flex", flexDirection: horiz ? "row" : "column", gap: 24 }}>
        <Panel head="Hiện trạng" rows={problems} bad delay={12} />
        <Panel head="Với Hynex" rows={solutions} delay={26} />
      </div>
    </Stage>
  );
};
const Panel: React.FC<{ head: string; rows: string[]; bad?: boolean; delay: number }> = ({ head, rows, bad, delay }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ ...cardStyle(theme), flex: 1, padding: "22px 28px", background: bad ? "#fff" : color.limeSoft, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ fontFamily: font.display, fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: bad ? color.red : color.limeDeep, marginBottom: 8 }}>{head}</div>
      {rows.map((r, i) => (
        <div key={r} style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 33, fontWeight: 600, padding: "12px 0", borderTop: i ? `2px solid ${theme.line}` : undefined, opacity: Math.min(1, useEnter(delay + 6 + i * 6)) }}>
          <span style={{ width: 38, height: 38, borderRadius: 19, background: bad ? color.red : color.ink, color: bad ? "#fff" : color.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, flexShrink: 0 }}>{bad ? "✕" : "✓"}</span>
          {r}
        </div>
      ))}
    </div>
  );
};

/** Workflow: dọc (9:16) hoặc ngang (16:9), mốc thời gian rõ ràng */
export const B2BWorkflow: React.FC<{ title: string; steps: { label: string; sub: string; time?: string }[]; activeFrames?: number }> = ({ title, steps, activeFrames = 20 }) => {
  const horiz = useHoriz();
  const frame = useCurrentFrame();
  const active = Math.min(steps.length - 1, Math.floor(Math.max(0, frame - 24) / activeFrames));
  return (
    <Stage justify="center" gap={28}>
      <Section n="03" title={title} />
      <div style={{ position: "relative", display: "flex", flexDirection: horiz ? "row" : "column", gap: horiz ? 12 : 14, marginTop: 6 }}>
        {!horiz && <div style={{ position: "absolute", left: 36, top: 40, bottom: 40, width: 5, background: "#DCE3D2" }} />}
        {steps.map((s, i) => (
          <WfStep key={s.label} s={s} i={i} on={i <= active} cur={i === active} horiz={horiz} delay={14 + i * 8} />
        ))}
      </div>
    </Stage>
  );
};
const WfStep: React.FC<{ s: { label: string; sub: string; time?: string }; i: number; on: boolean; cur: boolean; horiz: boolean; delay: number }> = ({ s, i, on, cur, horiz, delay }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ position: "relative", flex: horiz ? 1 : undefined, display: "flex", flexDirection: horiz ? "column" : "row", alignItems: horiz ? "center" : "flex-start", gap: 18, textAlign: horiz ? "center" : "left", opacity: Math.min(1, p * 1.5) * (on ? 1 : 0.5), transform: `translateX(${horiz ? 0 : (1 - p) * -30}px)` }}>
      <div style={{ width: 74, height: 74, borderRadius: 37, flexShrink: 0, background: on ? color.lime : "#fff", border: `4px solid ${color.ink}`, boxShadow: cur ? `0 0 0 8px ${color.lime}66` : undefined, fontFamily: font.mono, fontSize: 34, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>{i + 1}</div>
      <div style={{ paddingTop: horiz ? 0 : 4 }}>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 36, fontWeight: 800, lineHeight: 1.2 }}>{s.label}</div>
        <div style={{ fontSize: 27, color: theme.muted, fontWeight: 500, lineHeight: 1.3, marginTop: 2 }}>{s.sub}</div>
        {s.time && <div style={{ display: "inline-block", marginTop: 6, padding: "2px 12px", borderRadius: radius.pill, background: on ? color.ink : "#E7EBDF", color: on ? color.lime : theme.muted, fontFamily: font.mono, fontSize: 23, fontWeight: 700 }}>{s.time}</div>}
      </div>
    </div>
  );
};

/** Data story: 2 chỉ số lợi ích + biểu đồ */
export const B2BDataStory: React.FC<{ title: string; metrics: (Parameters<typeof MetricCard>[0])[]; chart: { label: string; value: number }[]; chartTitle: string; unit?: string }> = ({ title, metrics, chart, chartTitle, unit }) => {
  const { theme } = useHynex();
  const horiz = useHoriz();
  return (
    <Stage justify="center" gap={26}>
      <Section n="04" title={title} />
      <div style={{ display: "flex", flexDirection: horiz ? "row" : "column", gap: 22 }}>
        <div style={{ width: horiz ? 600 : undefined, display: "flex", flexDirection: "column", gap: 18 }}>
          {metrics.map((m, i) => (
            <MetricCard key={m.label} {...m} index={i} delay={12 + i * 10} />
          ))}
        </div>
        <div style={{ ...cardStyle(theme), flex: 1, padding: "20px 22px", opacity: Math.min(1, useEnter(26)) }}>
          <div style={{ fontFamily: font.display, fontSize: 26, fontWeight: 800, color: theme.muted, marginBottom: 6 }}>{chartTitle}</div>
          <Chart type="bar" data={chart} width={horiz ? 900 : 600} height={horiz ? 440 : 300} delay={26} unit={unit} />
        </div>
      </div>
    </Stage>
  );
};

/** Case study: bảng trước / sau */
export const B2BCase: React.FC<{ title: string; client: string; challenge: string; rows: { metric: string; before: string; after: string }[] }> = ({ title, client, challenge, rows }) => {
  const { theme } = useHynex();
  return (
    <Stage justify="center" gap={28}>
      <Section n="05" title={title} sub={`${client} · ${challenge}`} />
      <div style={{ ...cardStyle(theme), overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", padding: "16px 26px", background: color.ink, color: color.lime, fontFamily: font.display, fontSize: 24, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
          <span>Chỉ số</span><span>Trước</span><span>Sau</span>
        </div>
        {rows.map((r, i) => (
          <CaseRow key={r.metric} {...r} delay={14 + i * 10} />
        ))}
      </div>
    </Stage>
  );
};
const CaseRow: React.FC<{ metric: string; before: string; after: string; delay: number }> = ({ metric, before, after, delay }) => {
  const { theme } = useHynex();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", alignItems: "center", padding: "22px 26px", fontSize: 32, borderTop: `2px solid ${theme.line}`, opacity: Math.min(1, useEnter(delay)) }}>
      <span style={{ fontWeight: 600 }}>{metric}</span>
      <span style={{ color: theme.muted }}>{before}</span>
      <span style={{ justifySelf: "start", padding: "2px 14px", borderRadius: radius.pill, background: color.lime, border: `3px solid ${color.ink}`, fontWeight: 800 }}>{after}</span>
    </div>
  );
};

/** Product demo */
export const B2BProductDemo: React.FC<{ name: string; tagline: string; features: string[]; badge?: string }> = (p) => (
  <Stage justify="center">
    <ProductShowcase {...p} />
  </Stage>
);

/** Proposal: các gói, gói đề xuất nổi bật */
export const B2BProposal: React.FC<{ title: string; plans: { name: string; price: string; items: string[]; highlight?: boolean }[] }> = ({ title, plans }) => {
  const { theme } = useHynex();
  const horiz = useHoriz();
  return (
    <Stage justify="center" gap={28}>
      <Section n="06" title={title} />
      <div style={{ display: "flex", flexDirection: horiz ? "row" : "column", gap: 20 }}>
        {plans.map((p, i) => (
          <Plan key={p.name} {...p} delay={12 + i * 10} />
        ))}
      </div>
    </Stage>
  );
};
const Plan: React.FC<{ name: string; price: string; items: string[]; highlight?: boolean; delay: number }> = ({ name, price, items, highlight, delay }) => {
  const { theme } = useHynex();
  const e = useEnter(delay, "snappy");
  return (
    <div style={{ ...cardStyle(theme), flex: 1, padding: "20px 28px", background: highlight ? color.ink : "#fff", color: highlight ? "#fff" : color.ink, border: `3px solid ${color.ink}`, boxShadow: highlight ? `0 0 0 6px ${color.lime}` : theme.hardShadow ? undefined : "0 12px 32px rgba(12,20,29,0.10)", opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 30}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 800 }}>{name}</div>
        <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 800, color: highlight ? color.lime : color.ink }}>{price}</div>
      </div>
      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
        {items.map((it) => (
          <div key={it} style={{ fontSize: 27, fontWeight: 500, opacity: 0.92 }}>✓ {it}</div>
        ))}
      </div>
    </div>
  );
};

/** Training */
export const B2BTraining: React.FC<{ title: string; steps: { title: string; detail?: string; icon?: string }[] }> = ({ title, steps }) => {
  const frame = useCurrentFrame();
  const active = Math.min(steps.length - 1, Math.floor(Math.max(0, frame - 18) / 26));
  return (
    <Stage justify="center" gap={28}>
      <Section n="07" title={title} />
      <StepByStep steps={steps} activeIndex={active} delay={8} />
    </Stage>
  );
};

/** Closing */
export const B2BClosing: React.FC<{ headline: string; sub?: string; button: string; handle?: string; emoji?: string }> = (p) => (
  <Stage>
    <CTA emoji="🤝" {...p} />
  </Stage>
);

/** Hook mở đầu: nhắm 1 nhóm cụ thể + câu hook lớn */
export const B2BHook: React.FC<{ audience: string; hook: string; promise: string; icons?: string[] }> = ({ audience, hook, promise, icons = ["📸", "💬", "🎬"] }) => {
  const { theme } = useHynex();
  const p = useEnter(6, "snappy");
  return (
    <Stage justify="center" gap={30}>
      <div style={{ alignSelf: "flex-start", padding: "8px 22px", borderRadius: radius.pill, background: color.lime, border: `3px solid ${color.ink}`, fontFamily: font.display, fontWeight: 800, fontSize: 28, opacity: Math.min(1, useEnter(0)) }}>{audience}</div>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 84, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.08, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>{hook}</div>
      <div style={{ display: "flex", gap: 16 }}>
        {icons.map((e, i) => <IconTile key={i} icon={e} size={96} delay={18 + i * 8} wiggle={false} />)}
      </div>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 52, fontWeight: 800, lineHeight: 1.2, background: `linear-gradient(transparent 62%, ${color.lime} 62%)`, alignSelf: "flex-start", opacity: Math.min(1, useEnter(38)) }}>{promise}</div>
    </Stage>
  );
};

/** Khung chat hỏi đáp (mock chat) */
export const B2BChat: React.FC<{ title: string; messages: ChatMessage[] }> = ({ title, messages }) => {
  const { theme } = useHynex();
  const p = useEnter(0, "snappy");
  return (
    <Stage justify="center" gap={24}>
      <div style={{ ...cardStyle(theme), padding: 0, overflow: "hidden", flexShrink: 0, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 24}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 26px", background: color.ink, color: "#fff" }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: color.lime }} />
          <span style={{ fontFamily: font.display, fontWeight: 800, fontSize: 30 }}>{title}</span>
        </div>
        <div style={{ padding: 26, background: "#F4F7EE" }}>
          <ChatConversation messages={messages} gap={24} />
        </div>
      </div>
    </Stage>
  );
};

/** Ô tư liệu b-roll: có `src` (ảnh/video trong public/) thì hiện, chưa có thì hiện khung giữ chỗ để thêm sau */
const BrollTile: React.FC<{ label: string; src?: string; delay: number; h?: number }> = ({ label, src, delay, h = 300 }) => {
  const p = useEnter(delay, "snappy");
  const isImg = !!src && /\.(png|jpe?g|webp)$/i.test(src);
  return (
    <div style={{ flex: 1, height: h, borderRadius: radius.md, overflow: "hidden", position: "relative", border: src ? `4px solid ${color.ink}` : `4px dashed ${color.ink}88`, background: src ? "#000" : "#F4F7EE", display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, p * 1.5), transform: `scale(${0.9 + p * 0.1})` }}>
      {src && (isImg ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} /> : <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />)}
      {!src && <div style={{ textAlign: "center", fontFamily: font.display, fontWeight: 800, fontSize: 26, color: "#5B6B57", lineHeight: 1.3 }}>🎞️<br />{label}<div style={{ fontSize: 20, fontWeight: 600 }}>(chèn tư liệu)</div></div>}
      {src && <div style={{ position: "absolute", left: 10, bottom: 10, padding: "2px 12px", borderRadius: radius.pill, background: color.lime, border: `3px solid ${color.ink}`, fontFamily: font.display, fontWeight: 800, fontSize: 20 }}>{label}</div>}
    </div>
  );
};

export type ProcessKind = "research" | "hook" | "broll" | "script" | "voice" | "final";
/** Một bước trong quy trình làm video. `kind` chọn minh hoạ; nội dung lấy từ props. */
export const B2BProcessStep: React.FC<{
  n: number; total: number; kind: ProcessKind; title: string; sub: string;
  items?: string[];       // research: feedback; hook: các hook; script: các phần kịch bản
  pickIndex?: number;     // hook: hook được chọn
  tiles?: { label: string; src?: string }[]; // broll
  product?: string; src?: string; caption?: string; // research / final
  srcStart?: number;      // final: bắt đầu phát từ frame (30fps) của clip
  comments?: string[];  // final: bình luận mô phỏng bên phải
  voiceSrc?: string; voiceStart?: number; voiceLine?: string; // voice: file âm thanh mẫu (clip trong public/), điểm bắt đầu, câu thoại
}> = ({ n, total, kind, title, sub, items = [], pickIndex = 0, tiles = [], product, src, caption, srcStart = 0, voiceSrc, voiceStart = 0, voiceLine, comments = [] }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  return (
    <Stage justify="center" gap={26}>
      {kind !== "final" && <Section n={`${n}/${total}`} title={title} sub={sub} size={50} />}
      {kind === "final" && (
        <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, useEnter(0)) }}>
          <span style={{ minWidth: 60, height: 52, borderRadius: 14, background: color.lime, border: `3px solid ${color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.mono, fontSize: 26, fontWeight: 700 }}>{n}/{total}</span>
          <span style={{ fontFamily: theme.fontDisplay, fontSize: 40, fontWeight: 800 }}>{title}</span>
        </div>
      )}
      {kind === "research" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...cardStyle(theme), padding: "20px 26px", display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, useEnter(14)) }}>
            <span style={{ fontSize: 56, fontFamily: font.emoji }}>🧴</span>
            <div><div style={{ fontSize: 22, color: theme.muted, fontWeight: 700 }}>SẢN PHẨM</div><div style={{ fontFamily: theme.fontDisplay, fontSize: 40, fontWeight: 800 }}>{product}</div></div>
          </div>
          {items.map((t, i) => <FeedbackChip key={i} text={t} delay={26 + i * 12} />)}
        </div>
      )}
      {kind === "hook" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((t, i) => {
            const pick = frame > 70 && i === pickIndex;
            const p = useEnter(16 + i * 12, "snappy");
            return (
              <div key={i} style={{ ...cardStyle(theme), padding: "22px 28px", fontFamily: theme.fontDisplay, fontSize: 36, fontWeight: 800, lineHeight: 1.25, background: pick ? color.lime : "#fff", opacity: Math.min(1, p * 1.5) * (frame > 70 && !pick ? 0.45 : 1), transform: `translateX(${(1 - p) * 40}px) scale(${pick ? 1.03 : 1})` }}>
                {pick && <span style={{ fontSize: 30 }}>✅ </span>}{t}
              </div>
            );
          })}
        </div>
      )}
      {kind === "broll" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 16 }}>{tiles.slice(0, 2).map((t, i) => <BrollTile key={i} {...t} delay={16 + i * 8} />)}</div>
          <div style={{ display: "flex", gap: 16 }}>{tiles.slice(2, 4).map((t, i) => <BrollTile key={i} {...t} delay={32 + i * 8} />)}</div>
        </div>
      )}
      {kind === "script" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((t, i) => {
            const p = useEnter(16 + i * 14, "snappy");
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -30}px)` }}>
                <div style={{ width: 14, alignSelf: "stretch", borderRadius: 7, background: i === 0 ? color.lime : color.ink }} />
                <div style={{ ...cardStyle(theme), flex: 1, padding: "18px 24px", fontSize: 32, fontWeight: 700, lineHeight: 1.3 }}>{t}</div>
              </div>
            );
          })}
        </div>
      )}
      {kind === "voice" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {voiceSrc && <Audio src={staticFile(voiceSrc)} startFrom={voiceStart} volume={1} />}
          <div style={{ ...cardStyle(theme), padding: "26px 30px", fontFamily: theme.fontDisplay, fontSize: 40, fontWeight: 800, lineHeight: 1.25, opacity: Math.min(1, useEnter(12)) }}>
            <div style={{ fontSize: 22, color: theme.muted, fontWeight: 700, marginBottom: 8 }}>LỜI THOẠI</div>
            “{voiceLine}”
          </div>
          <Waveform />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {items.map((t, i) => <span key={i} style={{ padding: "8px 20px", borderRadius: radius.pill, background: i === 0 ? color.lime : "#fff", border: `3px solid ${color.ink}`, fontFamily: font.display, fontWeight: 800, fontSize: 26, opacity: Math.min(1, useEnter(30 + i * 8)) }}>{t}</span>)}
          </div>
        </div>
      )}
      {kind === "final" && (
        <div style={{ position: "relative", display: "flex", gap: 16, alignItems: "flex-start", marginTop: -4 }}>
          <PhoneMockup width={470} delay={6} float>
            <PhoneVideo src={src} startFrom={srcStart} sound showUI={!src} caption={caption} handle="@shopcuaban" width={470} />
          </PhoneMockup>
          <EngagementRail comments={comments} />
        </div>
      )}
    </Stage>
  );
};
/** Cột tương tác giả lập bên phải điện thoại: tim bay, bộ đếm tăng, bình luận liên tục */
const EngagementRail: React.FC<{ comments: string[] }> = ({ comments }) => {
  const frame = useCurrentFrame();
  const { theme } = useHynex();
  const hearts = ["❤️", "💖", "🔥", "😍", "👏", "❤️", "💕"];
  const likes = Math.round(interpolate(frame, [10, 150], [8200, 12800], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cmts = Math.round(interpolate(frame, [10, 150], [210, 326], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const every = 16;
  const shown = comments.map((t, i) => ({ t, at: 20 + i * every })).filter((c) => frame >= c.at).slice(-6);
  return (
    <div style={{ position: "relative", width: 215, height: 964 }}>
      <div style={{ display: "flex", gap: 10, opacity: Math.min(1, useEnter(14)) }}>
        {[{ e: "❤️", v: `${(likes / 1000).toFixed(1)}K` }, { e: "💬", v: `${cmts}` }].map((c) => (
          <div key={c.e} style={{ ...cardStyle(theme), padding: "6px 14px", borderRadius: radius.pill, fontFamily: font.display, fontWeight: 800, fontSize: 24, display: "flex", gap: 6, alignItems: "center" }}><span style={{ fontFamily: font.emoji }}>{c.e}</span>{c.v}</div>
        ))}
      </div>
      {hearts.map((e, i) => {
        const t = (frame - 12 - i * 11) % 80;
        if (frame - 12 - i * 11 < 0) return null;
        const pr = t / 80;
        return <div key={i} style={{ position: "absolute", left: 80 + Math.sin(pr * 7 + i * 2) * 60, top: 640 - pr * 520, fontSize: 44 + (i % 3) * 8, fontFamily: font.emoji, opacity: Math.sin(pr * Math.PI), transform: `scale(${0.7 + pr * 0.5}) rotate(${Math.sin(pr * 5 + i) * 16}deg)` }}>{e}</div>;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", gap: 10, justifyContent: "flex-end" }}>
        {shown.map((c, i) => {
          const age = shown.length - 1 - i;
          const pop = Math.min(1, (frame - c.at) / 8);
          return (
            <div key={c.at} style={{ display: "flex", alignItems: "center", gap: 8, opacity: pop * Math.max(0.25, 1 - age * 0.16), transform: `translateY(${(1 - pop) * 24}px)` }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, flexShrink: 0, background: ["#FFB4A2", "#B5E48C", "#A0C4FF", "#FFD6A5", "#CDB4DB"][c.at % 5], border: `3px solid ${color.ink}` }} />
              <div style={{ ...cardStyle(theme), padding: "8px 14px", borderRadius: 18, fontSize: 21, fontWeight: 700, lineHeight: 1.25 }}>{c.t}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Sóng âm đang thu (minh hoạ lồng tiếng) */
const Waveform: React.FC = () => {
  const frame = useCurrentFrame();
  const { theme } = useHynex();
  return (
    <div style={{ ...cardStyle(theme), padding: "18px 26px", display: "flex", alignItems: "center", gap: 18 }}>
      <span style={{ fontSize: 46, fontFamily: font.emoji }}>🎙️</span>
      <div style={{ flex: 1, height: 90, display: "flex", alignItems: "center", gap: 6 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const h = 14 + Math.abs(Math.sin(frame / 4 + i * 0.9) * Math.cos(frame / 9 + i * 0.35)) * 70;
          return <div key={i} style={{ flex: 1, height: h, borderRadius: 6, background: i % 5 === 0 ? color.lime : color.ink }} />;
        })}
      </div>
      <span style={{ width: 16, height: 16, borderRadius: 8, background: "#E5484D", opacity: frame % 30 < 18 ? 1 : 0.25 }} />
    </div>
  );
};
const FeedbackChip: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 40}px)` }}>
      <span style={{ fontSize: 44, fontFamily: font.emoji }}>💬</span>
      <div style={{ ...cardStyle(theme), padding: "14px 24px", fontSize: 32, fontWeight: 700, borderRadius: radius.pill }}>“{text}”</div>
    </div>
  );
};

/** So sánh 2 lựa chọn theo từng mục (tiền / nhân sự / thời gian) + banner chênh lệch */
export type VersusRow = { label: string; icon: string; left: { value: string; sub?: string; bar?: number }; right: { value: string; sub?: string; bar?: number } };
export const B2BVersus: React.FC<{
  title: string; left: { name: string; icon: string }; right: { name: string; icon: string };
  rows: VersusRow[];
  banner?: { label: string; value: number; decimals?: number; suffix: string; sub?: string; at?: number };
}> = ({ title, left, right, rows, banner }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const bp = useEnter(banner?.at ?? 100, "bounce");
  const count = banner ? interpolate(frame, [(banner.at ?? 100) + 4, (banner.at ?? 100) + 40], [0, banner.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <Stage justify="center" gap={20}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 44, fontWeight: 800, letterSpacing: -1, opacity: Math.min(1, useEnter(0)) }}>{title}</div>
      <div style={{ display: "flex", gap: 14 }}>
        {[left, right].map((c, i) => {
          const p = useEnter(4 + i * 4, "snappy");
          return (
            <div key={c.name} style={{ flex: 1, padding: "12px 16px", borderRadius: radius.md, border: `3px solid ${color.ink}`, background: i === 1 ? color.lime : "#fff", fontFamily: font.display, fontWeight: 800, fontSize: 30, textAlign: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 20}px)` }}>
              <span style={{ fontFamily: font.emoji }}>{c.icon}</span> {c.name}
            </div>
          );
        })}
      </div>
      {rows.map((r, i) => {
        const p = useEnter(16 + i * 22, "snappy");
        return (
          <div key={r.label} style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 24}px)` }}>
            <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: theme.muted, marginBottom: 6 }}>{r.icon} {r.label.toUpperCase()}</div>
            <div style={{ display: "flex", gap: 14 }}>
              {[r.left, r.right].map((c, k) => (
                <div key={k} style={{ ...cardStyle(theme), flex: 1, padding: "14px 18px", background: k === 1 ? "#F6FFD9" : "#fff", borderColor: color.ink }}>
                  <div style={{ fontFamily: theme.fontDisplay, fontSize: 46, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, color: k === 1 ? color.ink : "#5B6670" }}>{c.value}</div>
                  {c.sub && <div style={{ fontSize: 22, fontWeight: 600, color: theme.muted, lineHeight: 1.3, marginTop: 4 }}>{c.sub}</div>}
                  {c.bar !== undefined && (
                    <div style={{ height: 16, borderRadius: 8, background: "#E7EBDF", marginTop: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c.bar * 100 * Math.min(1, Math.max(0, (frame - 24 - i * 22) / 24))}%`, background: k === 1 ? color.lime : "#8B96A0", borderRight: `3px solid ${color.ink}` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {banner && (
        <div style={{ marginTop: 4, padding: "18px 24px", borderRadius: radius.md, background: color.ink, color: "#fff", opacity: Math.min(1, bp * 1.5), transform: `scale(${0.9 + Math.min(1, bp) * 0.1})` }}>
          <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.85 }}>{banner.label}</div>
          <div style={{ fontFamily: theme.fontDisplay, fontSize: 76, fontWeight: 800, letterSpacing: -2, color: color.lime, lineHeight: 1.05 }}>{count.toFixed(banner.decimals ?? 0).replace(".", ",")}{banner.suffix}</div>
          {banner.sub && <div style={{ fontSize: 24, fontWeight: 600, opacity: 0.8 }}>{banner.sub}</div>}
        </div>
      )}
    </Stage>
  );
};

/** Danh sách ✔/✕ nói thẳng giới hạn */
export const B2BChecklist: React.FC<{ title: string; sub?: string; items: { text: string; ok: boolean }[] }> = ({ title, sub, items }) => {
  const { theme } = useHynex();
  return (
    <Stage justify="center" gap={26}>
      <Section n="!" title={title} sub={sub} size={50} />
      {items.map((it, i) => {
        const p = useEnter(18 + i * 18, "snappy");
        return (
          <div key={i} style={{ ...cardStyle(theme), padding: "20px 26px", display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 40}px)` }}>
            <span style={{ width: 56, height: 56, borderRadius: 28, flexShrink: 0, background: it.ok ? color.lime : "#fff", border: `3px solid ${color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800 }}>{it.ok ? "✔" : "✕"}</span>
            <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.3 }}>{it.text}</span>
          </div>
        );
      })}
    </Stage>
  );
};

export const b2bRegistry = {
  versus: B2BVersus,
  checklist: B2BChecklist,
  hook: B2BHook,
  chat: B2BChat,
  processStep: B2BProcessStep,

  intro: B2BIntro,
  service: B2BService,
  problemSolution: B2BProblemSolution,
  workflow: B2BWorkflow,
  dataStory: B2BDataStory,
  case: B2BCase,
  productDemo: B2BProductDemo,
  proposal: B2BProposal,
  training: B2BTraining,
  closing: B2BClosing,
};
