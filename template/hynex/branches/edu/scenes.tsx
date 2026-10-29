// HYNEX EDU — giọng: truyền cảm hứng, tận tình, ví dụ dễ hiểu và trực quan.
// Ngôn ngữ hình ảnh: giấy kem ấm, ICON TILE nhiều màu ở mọi bước, thẻ nghiêng nhẹ, bóng cứng kiểu sticker, linh vật 💡 "thầy/cô" nhắc ý.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { color, font, radius, space } from "../../brand/tokens";
import { AnimatedHeadline, Button, ComparisonCard, Confetti, FlowDiagram, IconTile, InfoCard, KineticText, ProgressBar, Squiggle, StepByStep, Sticker, cardStyle, useEnter, useFloat, useHynex, useWiggle } from "../../core-components";
import { Stage } from "../../scenes/SceneRunner";

/** Nhãn mục: số + tên mục, dạng viên thuốc */
const Label: React.FC<{ n?: string; text: string }> = ({ n, text }) => {
  const { theme } = useHynex();
  const p = useEnter(0, "pop");
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, alignSelf: "flex-start", padding: "6px 22px 6px 8px", borderRadius: radius.pill, background: "#fff", border: `4px solid ${color.ink}`, boxShadow: `4px 4px 0 ${color.ink}`, transform: `scale(${Math.min(1, p)}) rotate(-1.5deg)`, transformOrigin: "left center" }}>
      {n && <span style={{ minWidth: 44, height: 44, borderRadius: 22, background: color.lime, border: `3px solid ${color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.display, fontSize: 26, fontWeight: 900 }}>{n}</span>}
      <span style={{ fontFamily: font.display, fontSize: 28, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{text}</span>
    </div>
  );
};

/** Bong bóng lời thầy/cô: 💡 + một câu động viên hoặc mẹo nhỏ. */
const Tip: React.FC<{ text: string; delay?: number; emoji?: string }> = ({ text, delay = 0, emoji = "💡" }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "pop");
  const w = useWiggle(3, 11, delay);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 30}px)` }}>
      <div style={{ fontSize: 64, fontFamily: font.emoji, transform: `rotate(${w}deg)` }}>{emoji}</div>
      <div style={{ ...cardStyle(theme, { shadowOffset: 5 }), background: color.sun, padding: "14px 24px", fontSize: 30, fontWeight: 700, lineHeight: 1.35, borderRadius: radius.md }}>{text}</div>
    </div>
  );
};

/** Hook: câu hỏi gần gũi + ba icon minh hoạ */
export const EduHook: React.FC<{ question: string; highlight?: string; sub?: string; icons?: string[]; sticker?: string }> = ({ question, highlight, sub, icons = [], sticker }) => {
  const { theme } = useHynex();
  return (
    <Stage gap={34} justify="center">
      <Label text="Cùng học nhé" n="✨" />
      <AnimatedHeadline text={question} highlight={highlight} size={84} />
      {sub && <div style={{ fontSize: 36, color: theme.muted, fontWeight: 600, lineHeight: 1.4, opacity: Math.min(1, useEnter(30)) }}>{sub}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        {icons.map((ic, i) => (
          <React.Fragment key={i}>
            <IconTile icon={ic} index={i} delay={38 + i * 8} size={112} />
            {i < icons.length - 1 && <div style={{ fontSize: 44, fontWeight: 900, opacity: Math.min(1, useEnter(44 + i * 8)) }}>→</div>}
          </React.Fragment>
        ))}
      </div>
      {sticker && <div style={{ alignSelf: "flex-end" }}><Sticker text={sticker} emoji="😉" rotate={5} delay={60} /></div>}
    </Stage>
  );
};

/** Concept: tên khái niệm + định nghĩa 1 câu + phép ẩn dụ bằng icon */
export const EduConcept: React.FC<{ term: string; definition: string; analogy: { role: string; maps: string; icon: string }[]; tip?: string }> = ({ term, definition, analogy, tip }) => {
  const { theme } = useHynex();
  return (
    <Stage justify="start" gap={22}>
      <Label n="01" text="Khái niệm" />
      <div>
        <div style={{ fontFamily: font.display, fontSize: 120, fontWeight: 900, letterSpacing: -3, lineHeight: 1, display: "inline-block", opacity: Math.min(1, useEnter(2)), transform: `scale(${0.8 + 0.2 * Math.min(1, useEnter(2, "pop"))})` }}>{term}</div>
        <Squiggle width={300} delay={14} />
      </div>
      <KineticText text={definition} size={46} delay={10} stagger={3} />
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {analogy.map((a, i) => (
          <InfoCard key={a.role} icon={a.icon} title={a.role} body={`= ${a.maps}`} delay={36 + i * 12} index={i} />
        ))}
      </div>
      {tip && <Tip text={tip} delay={36 + analogy.length * 12 + 6} />}
    </Stage>
  );
};

/** Steps: bước đang chạy sáng lên, các bước xong có ✅ */
export const EduSteps: React.FC<{ title: string; steps: { title: string; detail?: string; icon?: string }[]; stepFrames?: number; tip?: string }> = ({ title, steps, stepFrames = 30, tip }) => {
  const frame = useCurrentFrame();
  const active = Math.min(steps.length - 1, Math.floor(Math.max(0, frame - 20) / stepFrames));
  return (
    <Stage justify="start" gap={26}>
      <Label n="02" text="Từng bước một" />
      <AnimatedHeadline text={title} size={60} />
      <StepByStep steps={steps} activeIndex={active} delay={6} />
      {tip && <Tip text={tip} delay={20 + steps.length * stepFrames} />}
    </Stage>
  );
};

/** Comparison */
export const EduComparison: React.FC<{ title: string; left: { title: string; points: string[]; icon?: string }; right: { title: string; points: string[]; icon?: string } }> = ({ title, left, right }) => (
  <Stage justify="start" gap={26}>
    <Label n="03" text="So sánh nhanh" />
    <AnimatedHeadline text={title} size={60} />
    <ComparisonCard left={left} right={right} delay={14} />
  </Stage>
);

/** Process: sơ đồ luồng có icon từng bước */
export const EduProcess: React.FC<{ title: string; nodes: { label: string; sub?: string; icon?: string }[]; tip?: string }> = ({ title, nodes, tip }) => (
  <Stage justify="start" gap={22}>
    <Label n="04" text="Sơ đồ" />
    <AnimatedHeadline text={title} size={56} />
    <FlowDiagram nodes={nodes} direction="vertical" stagger={16} delay={10} nodeSize={34} />
    {tip && <Tip text={tip} delay={10 + nodes.length * 16 + 6} />}
  </Stage>
);

/** Case: ví dụ đời thực 3 ghi chú dán có icon */
export const EduCase: React.FC<{ title: string; situation: string; action: string; result: string }> = ({ title, situation, action, result }) => {
  const rows = [
    { k: "Tình huống", v: situation, c: color.sun, icon: "🤔" },
    { k: "Cách làm", v: action, c: color.sky, icon: "🛠️" },
    { k: "Kết quả", v: result, c: color.lime, icon: "🎉" },
  ];
  return (
    <Stage justify="start" gap={26}>
      <Label n="05" text="Ví dụ đời thực" />
      <AnimatedHeadline text={title} size={58} />
      {rows.map((r, i) => (
        <Note key={r.k} {...r} delay={14 + i * 16} tilt={i % 2 ? 1.2 : -1.2} index={i} />
      ))}
    </Stage>
  );
};
const Note: React.FC<{ k: string; v: string; c: string; icon: string; delay: number; tilt: number; index: number }> = ({ k, v, c, icon, delay, tilt, index }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "pop");
  return (
    <div style={{ ...cardStyle(theme, { shadowOffset: 7 }), background: c, padding: "22px 26px", display: "flex", gap: 20, alignItems: "center", opacity: Math.min(1, p * 2), transform: `rotate(${tilt * Math.min(1, p)}deg) translateY(${(1 - Math.min(1, p)) * 50}px)` }}>
      <IconTile icon={icon} size={88} tone="#fff" index={index} delay={delay + 4} />
      <div>
        <div style={{ fontFamily: font.display, fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{k}</div>
        <div style={{ fontSize: 36, lineHeight: 1.32, marginTop: 4, fontWeight: 700 }}>{v}</div>
      </div>
    </div>
  );
};

/** Quiz: đáp án có emoji, đếm ngược, lộ đáp án + pháo giấy */
export const EduQuiz: React.FC<{ question: string; options: { text: string; icon: string }[]; correctIndex: number; revealAt?: number; explain?: string }> = ({ question, options, correctIndex, revealAt = 70, explain }) => {
  const frame = useCurrentFrame();
  const reveal = frame >= revealAt;
  const t = Math.max(0, 1 - (frame - 20) / (revealAt - 20));
  const explainP = useEnter(revealAt, "pop");
  return (
    <Stage justify="start" gap={24}>
      <Label n="?" text="Thử trí nhớ nào" />
      <AnimatedHeadline text={question} size={54} />
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {options.map((o, i) => (
          <Option key={o.text} letter={"ABC"[i]} {...o} delay={10 + i * 8} state={reveal ? (i === correctIndex ? "right" : "dim") : "idle"} index={i} revealAt={revealAt} />
        ))}
      </div>
      {!reveal && <ProgressBar value={t} label="Bạn nghĩ sao nè…" delay={20} />}
      {reveal && explain && (
        <div style={{ fontSize: 36, fontWeight: 800, color: color.limeDeep, opacity: Math.min(1, explainP), transform: `translateY(${(1 - Math.min(1, explainP)) * 20}px)` }}>🎉 {explain}</div>
      )}
      {reveal && <div style={{ position: "relative", height: 0 }}><Confetti at={revealAt} width={677} height={600} count={24} /></div>}
    </Stage>
  );
};
const Option: React.FC<{ letter: string; text: string; icon: string; delay: number; state: "idle" | "right" | "dim"; index: number; revealAt: number }> = ({ letter, text, icon, delay, state, index, revealAt }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  const win = useEnter(state === "right" ? revealAt : 99999, "bounce");
  return (
    <div style={{ ...cardStyle(theme, { shadowOffset: state === "right" ? 10 : 5 }), display: "flex", alignItems: "center", gap: 20, padding: "16px 24px", background: state === "right" ? color.lime : theme.surface, opacity: Math.min(1, p * 1.5) * (state === "dim" ? 0.35 : 1), transform: `translateX(${(1 - p) * -50}px) scale(${1 + 0.04 * Math.min(1, win)})` }}>
      <IconTile icon={icon} size={76} index={index} delay={delay + 2} wiggle={state === "idle"} />
      <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 900 }}>
        <span style={{ opacity: 0.45, marginRight: 14 }}>{letter}.</span>
        {text}
      </div>
    </div>
  );
};

/** Recap: ba ý + lời động viên + nút theo dõi */
export const EduRecap: React.FC<{ title?: string; points: string[]; cta?: string; cheer?: string }> = ({ title = "Bạn vừa học được", points, cta, cheer }) => {
  const { theme } = useHynex();
  return (
    <Stage justify="center" gap={26}>
      <Label n="✓" text="Ghi nhớ" />
      <AnimatedHeadline text={title} size={68} />
      {points.map((p, i) => (
        <RecapRow key={p} text={p} i={i} />
      ))}
      {cheer && <Tip text={cheer} delay={22 + points.length * 14} emoji="👏" />}
      {cta && (
        <div style={{ marginTop: 8 }}>
          <Button label={cta} delay={30 + points.length * 14} size={36} />
        </div>
      )}
    </Stage>
  );
};
const RecapRow: React.FC<{ text: string; i: number }> = ({ text, i }) => {
  const { theme } = useHynex();
  const p = useEnter(14 + i * 14, "snappy");
  return (
    <div style={{ ...cardStyle(theme, { shadowOffset: 5 }), display: "flex", gap: 20, alignItems: "center", padding: "16px 24px", opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -50}px) rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
      <IconTile icon="✅" size={72} index={i} delay={16 + i * 14} tone={color.lime} />
      <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 900, lineHeight: 1.2 }}>{text}</div>
    </div>
  );
};

export const eduRegistry = {
  hook: EduHook,
  concept: EduConcept,
  steps: EduSteps,
  comparison: EduComparison,
  process: EduProcess,
  case: EduCase,
  quiz: EduQuiz,
  recap: EduRecap,
};
