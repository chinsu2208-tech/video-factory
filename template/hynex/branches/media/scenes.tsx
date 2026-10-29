// HYNEX MEDIA — giọng: có HOOK mạnh, vui vẻ, giàu cảm xúc, nhịp nhanh.
// Ngôn ngữ hình ảnh: nền xanh chanh SÁNG, đổi tông từng cảnh (ink/trắng/pastel) để tạo nhịp,
// sticker + emoji nảy, chat, giao diện mô phỏng và ĐIỆN THOẠI mockup trình chiếu video thành phẩm.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { color, font, radius, space } from "../../brand/tokens";
import {
  AnimatedHeadline, AppWindow, BeforeAfter, BrowserWindow, ChatConversation, ChatMessage, ClickRipple, CTA, Confetti, Cursor, FlowDiagram,
  InfoCard, KineticText, Notification, PhoneMockup, PhoneVideo, ProductShowcase, SceneBg, Sticker, Squiggle, Tooltip, cardStyle, useEnter, useFloat, useHynex, ToneName,
} from "../../core-components";
import { Stage } from "../../scenes/SceneRunner";

/** Emoji cảm xúc bay lên (tim, lửa...) quanh điện thoại */
const Reactions: React.FC<{ items: string[]; x: number; y: number; start?: number }> = ({ items, x, y, start = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {items.map((e, i) => {
        const t = (frame - start - i * 14) % 90;
        if (frame - start - i * 14 < 0) return null;
        const prog = t / 90;
        return (
          <div key={i} style={{ position: "absolute", left: x + Math.sin(prog * 8 + i) * 26, top: y - prog * 420, fontSize: 54, fontFamily: font.emoji, opacity: Math.sin(prog * Math.PI), transform: `scale(${0.7 + prog * 0.6}) rotate(${Math.sin(prog * 6 + i) * 18}deg)`, pointerEvents: "none" }}>{e}</div>
        );
      })}
    </>
  );
};

/** HOOK: nền tối làm điểm nhấn, chữ nảy từng từ, sticker cảm xúc */
export const MediaHook: React.FC<{ text: string; accentWords?: string[]; kicker?: string; emoji?: string; sticker?: string }> = ({ text, accentWords, kicker, emoji = "😩", sticker }) => {
  const p = useEnter(0, "bounce");
  const wob = useFloat(10, 16);
  return (
    <SceneBg tone="ink">
      <Stage gap={34}>
        {kicker && <div style={{ alignSelf: "flex-start" }}><Sticker text={kicker} tone={color.lime} rotate={-3} delay={2} size={32} /></div>}
        <div style={{ fontSize: 150, fontFamily: font.emoji, lineHeight: 1, transform: `scale(${Math.max(0, p)}) translateY(${wob}px) rotate(${(1 - Math.min(1, p)) * -30}deg)` }}>{emoji}</div>
        <KineticText text={text} size={92} accentWords={accentWords} stagger={4} delay={6} />
        {sticker && <div style={{ alignSelf: "flex-end" }}><Sticker text={sticker} emoji="👇" tone={color.sun} rotate={4} delay={48} /></div>}
      </Stage>
    </SceneBg>
  );
};

/** Hội thoại AI: bubble nảy, AI "đang gõ", có reaction emoji */
export const MediaChat: React.FC<{ title?: string; messages: ChatMessage[]; tone?: ToneName }> = ({ title, messages, tone = "default" }) => (
  <SceneBg tone={tone}>
    <Stage justify="start" gap={28}>
      {title && <AnimatedHeadline text={title} size={58} />}
      <ChatConversation messages={messages} gap={34} />
    </Stage>
  </SceneBg>
);

/** Tool tutorial: trình duyệt mô phỏng, con trỏ, click, tooltip, thông báo */
export const MediaTutorial: React.FC<{ step: string; url: string; fieldLabel: string; typed: string; buttonLabel: string; resultTitle: string; resultLines: string[]; tooltip: string; notice?: string; tone?: ToneName }> = ({
  step, url, fieldLabel, typed, buttonLabel, resultTitle, resultLines, tooltip, notice, tone = "white",
}) => {
  const frame = useCurrentFrame();
  const { theme } = useHynex();
  const chars = Math.floor(interpolate(frame, [18, 52], [0, typed.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const clickAt = 78;
  const result = useEnter(clickAt + 6, "snappy");
  const btn = { x: 185, y: 298 };
  return (
    <SceneBg tone={tone}>
      <Stage justify="start" gap={22}>
        <div><Sticker text={step} emoji="👆" rotate={-2} tone={color.lime} delay={0} size={30} /></div>
        <div style={{ height: 800, position: "relative" }}>
          <BrowserWindow url={url} delay={0}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <div style={{ fontFamily: font.display, fontSize: 28, fontWeight: 900, marginBottom: 10 }}>{fieldLabel}</div>
              <div style={{ height: 96, borderRadius: radius.sm + 4, border: `4px solid ${color.ink}`, padding: "20px 24px", fontSize: 34, fontWeight: 700, background: color.limeSoft, boxSizing: "border-box" }}>
                {typed.slice(0, chars)}
                <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>|</span>
              </div>
              <div style={{ position: "absolute", left: 0, top: 250, width: 370, height: 96, borderRadius: radius.pill, background: theme.accent, color: theme.onAccent, border: `4px solid ${color.ink}`, boxShadow: `6px 6px 0 ${color.coral}`, fontFamily: font.display, fontSize: 36, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${frame >= clickAt && frame < clickAt + 6 ? 0.94 : 1})` }}>
                {buttonLabel}
              </div>
              {frame < clickAt && (
                <div style={{ position: "absolute", left: 20, top: 366 }}>
                  <Tooltip text={tooltip} delay={50} direction="up" />
                </div>
              )}
              <div style={{ position: "absolute", left: 0, right: 0, top: 400, opacity: Math.min(1, result), transform: `translateY(${(1 - Math.min(1, result)) * 40}px)` }}>
                <div style={{ ...cardStyle(theme, { shadowOffset: 6 }), background: color.limeSoft, padding: 26 }}>
                  <div style={{ fontFamily: font.display, fontSize: 34, fontWeight: 900, marginBottom: 10 }}>✨ {resultTitle}</div>
                  {resultLines.map((l, i) => (
                    <ResultLine key={l} text={l} delay={clickAt + 14 + i * 8} />
                  ))}
                </div>
              </div>
              <ClickRipple x={btn.x} y={btn.y} at={clickAt} />
              <Cursor path={[{ x: 560, y: 120, at: 40 }, { x: btn.x, y: btn.y - 10, at: clickAt - 4 }, { x: btn.x + 30, y: btn.y + 20, at: clickAt + 30 }]} />
            </div>
          </BrowserWindow>
          {notice && (
            <div style={{ position: "absolute", left: 20, top: 740 }}>
              <Notification title="Hynex AI" body={notice} icon="🎉" delay={clickAt + 36} width={600} />
            </div>
          )}
        </div>
      </Stage>
    </SceneBg>
  );
};
const ResultLine: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const p = useEnter(delay, "pop");
  return <div style={{ fontSize: 32, lineHeight: 1.5, fontWeight: 700, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -20}px)` }}>{text}</div>;
};

/** PHONE DEMO: điện thoại chiếu video thành phẩm + sticker + cảm xúc bay lên */
export const MediaPhoneDemo: React.FC<{ headline: string; src?: string; caption?: string; stickers?: { text: string; emoji?: string; tone?: string; x: number; y: number; rotate?: number; at: number }[]; reactions?: string[]; tone?: ToneName; startFrom?: number }> = ({
  headline, src, caption, stickers = [], reactions = ["❤️", "🔥", "😍", "👏"], tone = "violet", startFrom = 0,
}) => {
  const W = 400;
  const left = (677 - W) / 2;
  return (
    <SceneBg tone={tone}>
      <Stage justify="start" gap={18}>
        <AnimatedHeadline text={headline} size={56} />
        <div style={{ position: "relative", height: Math.round(W * 2.05) + 24 }}>
          <div style={{ position: "absolute", left, top: 6 }}>
            <PhoneMockup width={W} delay={6} rotate={-2}>
              <PhoneVideo src={src} startFrom={startFrom} caption={caption} width={W} />
            </PhoneMockup>
          </div>
          {stickers.map((s, i) => (
            <div key={i} style={{ position: "absolute", left: s.x, top: s.y, zIndex: 20 }}>
              <Sticker text={s.text} emoji={s.emoji} tone={s.tone} rotate={s.rotate ?? -5} delay={s.at} size={30} />
            </div>
          ))}
          <Reactions items={reactions} x={left + W - 30} y={Math.round(W * 1.9)} start={40} />
        </div>
      </Stage>
    </SceneBg>
  );
};

/** Problem → Solution, cảm xúc: 😩 bị gạch, 🤩 bật lên */
export const MediaProblemSolution: React.FC<{ problem: string; solution: string; solutionSub?: string; tone?: ToneName }> = ({ problem, solution, solutionSub, tone = "sun" }) => {
  const frame = useCurrentFrame();
  const { theme } = useHynex();
  const strike = interpolate(frame, [40, 56], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneBg tone={tone}>
      <Stage gap={34}>
        <div style={{ position: "relative" }}>
          <InfoCard icon="😩" title={problem} accent={color.coral} index={2} tilt={-1.5} />
          <div style={{ position: "absolute", left: 28, top: "50%", height: 8, width: `calc(${strike}% - 56px)`, background: color.ink, borderRadius: 4 }} />
        </div>
        <div style={{ textAlign: "center", fontSize: 90, fontFamily: font.emoji, opacity: Math.min(1, useEnter(46)), transform: `translateY(${useFloat(8, 10)}px)` }}>👇</div>
        <InfoCard icon="🤩" title={solution} body={solutionSub} tone="accent" accent={color.lime} delay={54} index={0} tilt={1.5} />
      </Stage>
    </SceneBg>
  );
};

/** Before / After */
export const MediaBeforeAfter: React.FC<{ title: string; before: string[]; after: string[]; tone?: ToneName }> = ({ title, before, after, tone = "white" }) => {
  const W = 660, H = 660;
  const panel = (lines: string[], bg: string, c: string, big = false) => (
    <div style={{ width: W, height: H, background: bg, boxSizing: "border-box", padding: "100px 36px 36px", color: c, fontFamily: font.display, fontSize: big ? 48 : 42, lineHeight: 1.45, fontWeight: 800 }}>
      {lines.map((l) => (
        <div key={l} style={{ marginBottom: 18 }}>{l}</div>
      ))}
    </div>
  );
  return (
    <SceneBg tone={tone}>
      <Stage justify="start" gap={26}>
        <AnimatedHeadline text={title} size={58} />
        <BeforeAfter width={W} height={H} before={panel(before, "#E7E9E4", "#7A8290")} after={panel(after, color.lime, color.ink, true)} />
      </Stage>
    </SceneBg>
  );
};

/** Listicle */
export const MediaListicle: React.FC<{ title: string; items: { title: string; body?: string; icon?: string }[]; tone?: ToneName }> = ({ title, items, tone = "peach" }) => (
  <SceneBg tone={tone}>
    <Stage justify="start" gap={24}>
      <AnimatedHeadline text={title} size={66} highlight={undefined} />
      {items.map((it, i) => (
        <InfoCard key={it.title} icon={it.icon ?? ["🎯", "📝", "🔁", "💡"][i % 4]} title={it.title} body={it.body} delay={14 + i * 16} index={i} />
      ))}
    </Stage>
  </SceneBg>
);

/** Workflow */
export const MediaWorkflow: React.FC<{ title: string; nodes: { label: string; sub?: string; icon?: string }[]; tone?: ToneName }> = ({ title, nodes, tone = "sky" }) => (
  <SceneBg tone={tone}>
    <Stage justify="start" gap={26}>
      <AnimatedHeadline text={title} size={58} />
      <FlowDiagram nodes={nodes} direction="vertical" stagger={14} nodeSize={34} />
    </Stage>
  </SceneBg>
);

/** Product demo */
export const MediaProductDemo: React.FC<{ name: string; tagline: string; features: string[]; badge?: string; tone?: ToneName }> = ({ tone = "white", ...p }) => (
  <SceneBg tone={tone}>
    <Stage>
      <ProductShowcase {...p} />
    </Stage>
  </SceneBg>
);

/** Simulated interface */
export const MediaSimUI: React.FC<{ title: string; sidebar: string[]; rows: { name: string; status: string }[]; tone?: ToneName }> = ({ title, sidebar, rows, tone = "white" }) => {
  const { theme } = useHynex();
  return (
    <SceneBg tone={tone}>
      <Stage justify="start">
        <div style={{ height: 860 }}>
          <AppWindow title={title} sidebar={sidebar} activeIndex={1}>
            {rows.map((r, i) => (
              <SimRow key={r.name} {...r} delay={10 + i * 8} />
            ))}
          </AppWindow>
        </div>
      </Stage>
    </SceneBg>
  );
};
const SimRow: React.FC<{ name: string; status: string; delay: number }> = ({ name, status, delay }) => {
  const p = useEnter(delay, "pop");
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 8px", borderBottom: `3px dashed ${color.ink}33`, fontSize: 28, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * 30}px)` }}>
      <span style={{ fontWeight: 800 }}>{name}</span>
      <span style={{ padding: "4px 14px", borderRadius: radius.pill, background: color.lime, border: `3px solid ${color.ink}`, fontWeight: 900, fontSize: 24 }}>{status}</span>
    </div>
  );
};

/** CTA ending: nền tối, pháo giấy, nút nảy */
export const MediaCTA: React.FC<{ headline: string; sub?: string; button: string; handle?: string; emoji?: string }> = (p) => (
  <SceneBg tone="ink">
    <Stage>
      <CTA {...p} />
    </Stage>
  </SceneBg>
);

export const mediaRegistry = {
  hook: MediaHook,
  chat: MediaChat,
  tutorial: MediaTutorial,
  phoneDemo: MediaPhoneDemo,
  problemSolution: MediaProblemSolution,
  beforeAfter: MediaBeforeAfter,
  listicle: MediaListicle,
  workflow: MediaWorkflow,
  productDemo: MediaProductDemo,
  simUI: MediaSimUI,
  cta: MediaCTA,
};
