// HYNEX EDU — giọng: truyền cảm hứng, tận tình, ví dụ dễ hiểu và trực quan.
// Ngôn ngữ hình ảnh: giấy kem ấm, ICON TILE nhiều màu ở mọi bước, thẻ nghiêng nhẹ, bóng cứng kiểu sticker, linh vật 💡 "thầy/cô" nhắc ý.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { color, font, radius, space, tilePalette } from "../../brand/tokens";
import { AnimatedHeadline, Button, ChatBubble, ClickRipple, Notification, PhoneMockup, ComparisonCard, Confetti, FlowDiagram, IconTile, InfoCard, KineticText, ProgressBar, Squiggle, StepByStep, Sticker, cardStyle, useEnter, useFloat, useHynex, useWiggle } from "../../core-components";
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


// ============================================================
// LINH KIỆN MỚI (thêm 10/2026) — chỉ THÊM, không đổi các cảnh cũ.
// chat, phone, prompt, bignum, beforeafter, checklist, myth, timeline, countdown, notify, table, photo
// ============================================================

/** chat: khung chat giả lập (hỏi – AI trả lời). Có thể gõ từng chữ. */
export const EduChat: React.FC<{ title?: string; messages: { side?: "left" | "right"; kind?: "human" | "ai"; author?: string; text: string; at?: number; typing?: boolean; reaction?: string }[]; tip?: string }> = ({ title, messages, tip }) => {
  const { theme } = useHynex();
  let t = 14;
  const ms = messages.map((m) => {
    const kind = m.kind ?? (m.side === "left" ? "ai" : "human");
    const at = m.at ?? t;
    const typing = m.typing ?? kind === "ai";
    t = at + (typing ? 20 : 0) + Math.ceil(m.text.length / 1.3) + 12;
    return { ...m, kind, at, typing, side: m.side ?? (kind === "ai" ? "left" : "right") } as const;
  });
  return (
    <Stage justify="start" gap={24}>
      <Label n="💬" text="Trò chuyện với AI" />
      {title && <AnimatedHeadline text={title} size={54} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {ms.map((m, i) => (
          <ChatBubble key={i} side={m.side} kind={m.kind} author={m.author ?? (m.kind === "ai" ? "AI" : "Bạn")} text={m.text} delay={m.at} typing={m.typing} typeFrames={20} charsPerFrame={m.kind === "ai" ? 1.3 : 0} size={32} reaction={m.reaction} />
        ))}
      </div>
      {tip && <Tip text={tip} delay={t} />}
    </Stage>
  );
};

/** phone: điện thoại với danh sách/ứng dụng bên trong, có chạm (ripple) vào một dòng. */
export const EduPhone: React.FC<{ title: string; appTitle?: string; rows: { icon: string; text: string; sub?: string }[]; tapIndex?: number; tapAt?: number; caption?: string }> = ({ title, appTitle = "Điện thoại của bạn", rows, tapIndex = 0, tapAt = 60, caption }) => {
  const frame = useCurrentFrame();
  const W = 360;
  const headH = 130, rowH = 92;
  const tapped = frame >= tapAt;
  return (
    <Stage justify="start" gap={18}>
      <Label n="📱" text="Trên điện thoại" />
      <AnimatedHeadline text={title} size={50} />
      <div style={{ alignSelf: "center" }}>
        <PhoneMockup width={W} delay={6} float={false}>
          <div style={{ position: "absolute", inset: 0, background: "#F6F7F9", fontFamily: font.body }}>
            <div style={{ height: headH, background: color.ink, color: "#fff", display: "flex", alignItems: "flex-end", padding: "0 22px 14px", fontFamily: font.display, fontWeight: 900, fontSize: 28 }}>{appTitle}</div>
            {rows.map((r, i) => {
              const p = Math.min(1, Math.max(0, (frame - (14 + i * 7)) / 8));
              const hit = tapped && i === tapIndex;
              return (
                <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", borderBottom: "2px solid #E4E7EC", background: hit ? color.lime : "#fff", opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
                  <div style={{ fontSize: 44, fontFamily: font.emoji }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800 }}>{r.text}</div>
                    {r.sub && <div style={{ fontSize: 20, color: color.muted, fontWeight: 600 }}>{r.sub}</div>}
                  </div>
                </div>
              );
            })}
            <ClickRipple x={W * 0.5} y={headH + tapIndex * rowH + rowH / 2} at={tapAt} size={120} />
          </div>
        </PhoneMockup>
      </div>
      {caption && <Tip text={caption} delay={tapAt + 10} emoji="👆" />}
    </Stage>
  );
};

/** prompt: ô nhập câu lệnh gõ dần, rồi hiện kết quả của AI. */
export const EduPrompt: React.FC<{ title: string; prompt: string; result: string; tip?: string }> = ({ title, prompt, result, tip }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const typeEnd = 18 + prompt.length * 1.2;
  const shown = prompt.slice(0, Math.max(0, Math.floor((frame - 18) / 1.2)));
  const cursor = Math.floor(frame / 8) % 2 === 0 ? "▍" : " ";
  const pr = useEnter(Math.ceil(typeEnd) + 14, "pop");
  const shownRes = result.slice(0, Math.max(0, Math.floor((frame - typeEnd - 24) * 1.4)));
  return (
    <Stage justify="start" gap={24}>
      <Label n="⌨️" text="Gõ câu lệnh" />
      <AnimatedHeadline text={title} size={54} />
      <div style={{ ...cardStyle(theme, { shadowOffset: 6 }), padding: "22px 28px", minHeight: 150, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ fontSize: 46, fontFamily: font.emoji }}>🧑</div>
        <div style={{ fontSize: 36, lineHeight: 1.4, fontWeight: 700 }}>{shown}<span style={{ color: color.limeDeep }}>{cursor}</span></div>
      </div>
      {frame > typeEnd + 8 && (
        <div style={{ ...cardStyle(theme, { shadowOffset: 6 }), background: color.limeSoft, padding: "22px 28px", display: "flex", gap: 16, alignItems: "flex-start", opacity: Math.min(1, pr * 2), transform: `translateY(${(1 - Math.min(1, pr)) * 30}px)` }}>
          <div style={{ fontSize: 46, fontFamily: font.emoji }}>🤖</div>
          <div style={{ fontSize: 34, lineHeight: 1.42, fontWeight: 600 }}>{shownRes}</div>
        </div>
      )}
      {tip && <Tip text={tip} delay={Math.ceil(typeEnd) + 24 + Math.ceil(result.length / 1.4)} />}
    </Stage>
  );
};

/** bignum: một con số lớn đếm lên + một câu giải thích. */
export const EduBigNumber: React.FC<{ label?: string; value: number; prefix?: string; suffix?: string; sub: string; icon?: string; tip?: string }> = ({ label = "Con số đáng nhớ", value, prefix = "", suffix = "", sub, icon = "📈", tip }) => {
  const frame = useCurrentFrame();
  const c = interpolate(frame, [8, 50], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const p = useEnter(4, "pop");
  return (
    <Stage justify="center" gap={26}>
      <Label n={icon} text={label} />
      <div style={{ fontFamily: font.display, fontSize: 210, fontWeight: 900, letterSpacing: -6, lineHeight: 1, transform: `scale(${0.85 + 0.15 * Math.min(1, p)})`, color: color.ink }}>
        {prefix}{Math.round(c).toLocaleString("vi-VN")}{suffix}
      </div>
      <Squiggle width={360} delay={20} />
      <KineticText text={sub} size={46} delay={24} stagger={3} />
      {tip && <Tip text={tip} delay={70} />}
    </Stage>
  );
};

/** beforeafter: cách làm chưa tốt (✗) và cách tốt hơn (✓), hiện lần lượt. */
export const EduBeforeAfter: React.FC<{ title: string; before: { label?: string; text: string }; after: { label?: string; text: string }; tip?: string }> = ({ title, before, after, tip }) => {
  const { theme } = useHynex();
  const a = useEnter(12, "pop");
  const b = useEnter(52, "pop");
  const Card: React.FC<{ p: number; bg: string; mark: string; label: string; text: string; tilt: number }> = ({ p, bg, mark, label, text, tilt }) => (
    <div style={{ ...cardStyle(theme, { shadowOffset: 7 }), background: bg, padding: "22px 28px", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 50}px) rotate(${tilt * Math.min(1, p)}deg)` }}>
      <div style={{ fontFamily: font.display, fontWeight: 900, fontSize: 28, letterSpacing: 2, textTransform: "uppercase" }}>{mark} {label}</div>
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.32, marginTop: 8 }}>{text}</div>
    </div>
  );
  return (
    <Stage justify="start" gap={26}>
      <Label n="⇄" text="Trước và sau" />
      <AnimatedHeadline text={title} size={54} />
      <Card p={a} bg="#FFD9D1" mark="❌" label={before.label ?? "Chưa tốt"} text={before.text} tilt={-1.2} />
      <Card p={b} bg={color.lime} mark="✅" label={after.label ?? "Tốt hơn"} text={after.text} tilt={1.2} />
      {tip && <Tip text={tip} delay={96} />}
    </Stage>
  );
};

/** checklist: danh sách việc nên làm (✓) / không nên (✗). */
export const EduChecklist: React.FC<{ title: string; items: { text: string; ok?: boolean }[]; tip?: string }> = ({ title, items, tip }) => (
  <Stage justify="start" gap={22}>
    <Label n="☑" text="Nên và không nên" />
    <AnimatedHeadline text={title} size={56} />
    {items.map((it, i) => (
      <CheckRow key={i} text={it.text} ok={it.ok ?? true} delay={14 + i * 16} index={i} />
    ))}
    {tip && <Tip text={tip} delay={20 + items.length * 16} />}
  </Stage>
);
const CheckRow: React.FC<{ text: string; ok: boolean; delay: number; index: number }> = ({ text, ok, delay, index }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ ...cardStyle(theme, { shadowOffset: 5 }), display: "flex", gap: 20, alignItems: "center", padding: "16px 24px", background: ok ? theme.surface : "#FFE9E4", opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -50}px)` }}>
      <IconTile icon={ok ? "✅" : "❌"} size={72} index={index} delay={delay + 2} tone={ok ? color.lime : "#FFD9D1"} />
      <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 900, lineHeight: 1.2 }}>{text}</div>
    </div>
  );
};

/** myth: hiểu lầm vs sự thật. */
export const EduMyth: React.FC<{ myth: string; fact: string; tip?: string }> = ({ myth, fact, tip }) => {
  const { theme } = useHynex();
  const a = useEnter(10, "pop");
  const b = useEnter(56, "bounce");
  return (
    <Stage justify="start" gap={28}>
      <Label n="🤔" text="Hiểu lầm hay sự thật" />
      <div style={{ ...cardStyle(theme, { shadowOffset: 7 }), background: "#FFE9E4", padding: "26px 30px", opacity: Math.min(1, a * 2), transform: `rotate(${-1.2 * Math.min(1, a)}deg) translateY(${(1 - Math.min(1, a)) * 40}px)` }}>
        <div style={{ fontFamily: font.display, fontWeight: 900, fontSize: 28, letterSpacing: 2 }}>❌ HIỂU LẦM</div>
        <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.3, marginTop: 8, textDecoration: "line-through", textDecorationColor: color.red, textDecorationThickness: 4 }}>{myth}</div>
      </div>
      <div style={{ ...cardStyle(theme, { shadowOffset: 9 }), background: color.lime, padding: "26px 30px", opacity: Math.min(1, b * 2), transform: `rotate(${1.2 * Math.min(1, b)}deg) scale(${0.9 + 0.1 * Math.min(1, b)})` }}>
        <div style={{ fontFamily: font.display, fontWeight: 900, fontSize: 28, letterSpacing: 2 }}>✅ SỰ THẬT</div>
        <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.3, marginTop: 8 }}>{fact}</div>
      </div>
      {tip && <Tip text={tip} delay={96} />}
    </Stage>
  );
};

/** timeline: các mốc nối nhau (ngày/bước theo thời gian). */
export const EduTimeline: React.FC<{ title: string; events: { time: string; title: string; detail?: string }[]; tip?: string }> = ({ title, events, tip }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  return (
    <Stage justify="start" gap={22}>
      <Label n="⏱" text="Dòng thời gian" />
      <AnimatedHeadline text={title} size={54} />
      <div style={{ position: "relative", paddingLeft: 8 }}>
        <div style={{ position: "absolute", left: 38, top: 20, bottom: 20, width: 8, background: color.ink, borderRadius: 4 }} />
        {events.map((e, i) => {
          const p = Math.min(1, Math.max(0, (frame - (14 + i * 18)) / 10));
          return (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 26, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
              <div style={{ minWidth: 64, height: 64, borderRadius: 32, background: tilePalette[i % tilePalette.length], border: `5px solid ${color.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.display, fontWeight: 900, fontSize: 28, zIndex: 2 }}>{i + 1}</div>
              <div style={{ ...cardStyle(theme, { shadowOffset: 5 }), padding: "14px 22px", flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: color.limeDeep, letterSpacing: 1 }}>{e.time}</div>
                <div style={{ fontFamily: font.display, fontSize: 36, fontWeight: 900, lineHeight: 1.2 }}>{e.title}</div>
                {e.detail && <div style={{ fontSize: 26, color: theme.muted, fontWeight: 600 }}>{e.detail}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {tip && <Tip text={tip} delay={20 + events.length * 18} />}
    </Stage>
  );
};

/** countdown: 3-2-1 rồi "Thử ngay". */
export const EduCountdown: React.FC<{ from?: number; lead?: string; go?: string; sub?: string }> = ({ from = 3, lead = "Chuẩn bị nhé", go = "Thử ngay!", sub }) => {
  const frame = useCurrentFrame();
  const per = 26;
  const n = from - Math.floor(frame / per);
  const phase = (frame % per) / per;
  const done = n <= 0;
  const gp = useEnter(from * per, "bounce");
  return (
    <Stage justify="center" gap={30}>
      <Label n="⏳" text={lead} />
      <div style={{ alignSelf: "center", textAlign: "center" }}>
        {!done ? (
          <div style={{ fontFamily: font.display, fontSize: 420, fontWeight: 900, lineHeight: 1, color: tilePalette[n % tilePalette.length], WebkitTextStroke: `10px ${color.ink}`, transform: `scale(${1.25 - 0.25 * Math.min(1, phase * 3)})`, opacity: 1 - Math.max(0, phase - 0.8) * 5 }}>{n}</div>
        ) : (
          <div style={{ fontFamily: font.display, fontSize: 100, whiteSpace: "nowrap", fontWeight: 900, color: color.ink, background: color.lime, border: `8px solid ${color.ink}`, borderRadius: 40, padding: "20px 50px", boxShadow: `10px 10px 0 ${color.ink}`, transform: `scale(${0.7 + 0.3 * Math.min(1.1, gp)}) rotate(-3deg)` }}>{go}</div>
        )}
      </div>
      {sub && <div style={{ fontSize: 40, fontWeight: 700, textAlign: "center", opacity: done ? Math.min(1, gp) : 0.7 }}>{sub}</div>}
    </Stage>
  );
};

/** notify: các thông báo nổi trên điện thoại (ví dụ AI nhắc việc). */
export const EduNotify: React.FC<{ title: string; items: { title: string; body: string; icon?: string }[]; tip?: string }> = ({ title, items, tip }) => (
  <Stage justify="start" gap={22}>
    <Label n="🔔" text="Thông báo" />
    <AnimatedHeadline text={title} size={54} />
    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      {items.map((it, i) => (
        <Notification key={i} {...it} delay={16 + i * 22} width={660} />
      ))}
    </div>
    {tip && <Tip text={tip} delay={24 + items.length * 22} />}
  </Stage>
);

/** table: bảng tổng hợp nhỏ (tối đa ~4 dòng × 3 cột). */
export const EduTable: React.FC<{ title: string; columns: string[]; rows: string[][]; tip?: string }> = ({ title, columns, rows, tip }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  return (
    <Stage justify="start" gap={22}>
      <Label n="📋" text="Bảng tóm tắt" />
      <AnimatedHeadline text={title} size={54} />
      <div style={{ ...cardStyle(theme, { shadowOffset: 7 }), overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, background: color.ink, color: "#fff" }}>
          {columns.map((c) => (
            <div key={c} style={{ padding: "16px 20px", fontFamily: font.display, fontSize: 30, fontWeight: 900 }}>{c}</div>
          ))}
        </div>
        {rows.map((r, i) => {
          const p = Math.min(1, Math.max(0, (frame - (14 + i * 14)) / 8));
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, background: i % 2 ? "#fff" : color.limeSoft, opacity: p, transform: `translateY(${(1 - p) * 20}px)`, borderTop: `3px solid ${color.ink}` }}>
              {r.map((cell, j) => (
                <div key={j} style={{ padding: "18px 20px", fontSize: 32, fontWeight: j === 0 ? 900 : 600, lineHeight: 1.25 }}>{cell}</div>
              ))}
            </div>
          );
        })}
      </div>
      {tip && <Tip text={tip} delay={20 + rows.length * 14} />}
    </Stage>
  );
};

/** photo: ảnh/clip nền trong khung + chú thích lớn (ảnh đặt ở public/, vd "broll/product.jpg"). */
export const EduPhoto: React.FC<{ title: string; src: string; caption?: string; tip?: string }> = ({ title, src, caption, tip }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const p = useEnter(8, "soft");
  return (
    <Stage justify="start" gap={22}>
      <Label n="🖼" text="Xem thử" />
      <AnimatedHeadline text={title} size={52} />
      <div style={{ ...cardStyle(theme, { shadowOffset: 8 }), overflow: "hidden", height: 520, position: "relative", opacity: Math.min(1, p * 2), transform: `rotate(${-1 * Math.min(1, p)}deg)` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + frame * 0.0006})` }} />
        {caption && <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, background: color.ink, color: "#fff", borderRadius: 18, padding: "14px 22px", fontSize: 34, fontWeight: 800, lineHeight: 1.3 }}>{caption}</div>}
      </div>
      {tip && <Tip text={tip} delay={30} />}
    </Stage>
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
  chat: EduChat,
  phone: EduPhone,
  prompt: EduPrompt,
  bignum: EduBigNumber,
  beforeafter: EduBeforeAfter,
  checklist: EduChecklist,
  myth: EduMyth,
  timeline: EduTimeline,
  countdown: EduCountdown,
  notify: EduNotify,
  table: EduTable,
  photo: EduPhoto,
};
