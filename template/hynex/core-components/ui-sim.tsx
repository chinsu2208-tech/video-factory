import React from "react";
import { OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { color, font, radius, shadow, space } from "../brand/tokens";
import { Avatar, cardStyle, useEnter, useFloat, useHynex, useWiggle } from "./primitives";
import { HynexLogo } from "./Logo";

// ---------- ChatBubble ----------
export type ChatBubbleProps = {
  side: "left" | "right";
  text: string;
  author?: string;
  kind?: "human" | "ai";
  delay?: number;
  typing?: boolean;
  typeFrames?: number;
  charsPerFrame?: number;
  size?: number;
  reaction?: string; // emoji nhỏ bật ra ở góc bubble
  bubble?: "accent" | "surface"; // ép kiểu bong bóng (mặc định: human = accent, ai = surface)
};
export const ChatBubble: React.FC<ChatBubbleProps> = ({ side, text, author, kind = "human", delay = 0, typing = false, typeFrames = 20, charsPerFrame = 0, size = 34, reaction, bubble }) => {
  const { theme } = useHynex();
  const frame = useCurrentFrame();
  const p = useEnter(delay, "pop");
  const r = useEnter(delay + typeFrames + 14, "bounce");
  const f = frame - delay;
  const showTyping = typing && f < typeFrames;
  let shown = text;
  if (charsPerFrame > 0) shown = text.slice(0, Math.max(0, Math.floor((f - (typing ? typeFrames : 0)) * charsPerFrame)));
  const mine = side === "right";
  const ai = bubble ? bubble === "surface" : kind === "ai";
  const bg = ai ? theme.surface : theme.accent;
  const fg = ai ? theme.text : theme.onAccent;
  const edge = theme.dark ? color.lime : color.ink;
  return (
    <div style={{ display: "flex", flexDirection: mine ? "row-reverse" : "row", gap: space.sm, alignItems: "flex-end", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 34}px) scale(${0.85 + p * 0.15})`, transformOrigin: mine ? "bottom right" : "bottom left" }}>
      <Avatar name={author ?? "User"} kind={kind} size={72} />
      <div style={{ maxWidth: "78%", position: "relative" }}>
        {author && <div style={{ fontFamily: font.display, fontSize: 24, fontWeight: 800, color: theme.muted, margin: mine ? "0 10px 6px 0" : "0 0 6px 10px", textAlign: mine ? "right" : "left" }}>{author}</div>}
        <div style={{ padding: "20px 28px", borderRadius: radius.md, borderBottomLeftRadius: mine ? radius.md : 6, borderBottomRightRadius: mine ? 6 : radius.md, background: bg, color: fg, fontSize: size, lineHeight: 1.4, fontWeight: 600, border: `4px solid ${edge}`, boxShadow: theme.dark ? undefined : shadow.hard(color.ink, 6) }}>
          {showTyping ? <TypingDots color={fg} /> : shown}
        </div>
        {reaction && (
          <div style={{ position: "absolute", [mine ? "left" : "right"]: -18, bottom: -26, fontSize: 52, fontFamily: font.emoji, transform: `scale(${Math.max(0, r)}) rotate(${(1 - Math.min(1, r)) * 30}deg)` }}>{reaction}</div>
        )}
      </div>
    </div>
  );
};
const TypingDots: React.FC<{ color: string }> = ({ color: c }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 10, padding: "8px 4px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - i * 4) / 4)), transform: `translateY(${-Math.max(0, Math.sin((frame - i * 4) / 4)) * 8}px)` }} />
      ))}
    </div>
  );
};

// ---------- ChatConversation ----------
export type ChatMessage = Omit<ChatBubbleProps, "delay"> & { at: number };
export const ChatConversation: React.FC<{ messages: ChatMessage[]; gap?: number }> = ({ messages, gap = space.md }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {messages.map((m, i) => (
      <ChatBubble key={i} {...m} delay={m.at} />
    ))}
  </div>
);

// ---------- BrowserWindow ----------
export type BrowserWindowProps = { url: string; children: React.ReactNode; delay?: number; height?: number | string };
export const BrowserWindow: React.FC<BrowserWindowProps> = ({ url, children, delay = 0, height = "100%" }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ ...cardStyle(theme, { radius: radius.md }), height, overflow: "hidden", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", background: theme.dark ? "#0E1626" : color.limeSoft, borderBottom: `4px solid ${theme.dark ? color.lime : color.ink}` }}>
        {[color.coral, color.sun, color.mint].map((c) => (
          <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c, border: `3px solid ${color.ink}` }} />
        ))}
        <div style={{ flex: 1, marginLeft: 12, padding: "8px 22px", borderRadius: radius.pill, background: "#fff", border: `3px solid ${color.ink}`, fontSize: 24, color: color.ink, fontFamily: font.mono, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{url}</div>
      </div>
      <div style={{ flex: 1, position: "relative", padding: space.md }}>{children}</div>
    </div>
  );
};

// ---------- AppWindow ----------
export type AppWindowProps = { title: string; children: React.ReactNode; sidebar?: string[]; activeIndex?: number; delay?: number; height?: number | string };
export const AppWindow: React.FC<AppWindowProps> = ({ title, children, sidebar, activeIndex = 0, delay = 0, height = "100%" }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "snappy");
  return (
    <div style={{ ...cardStyle(theme), height, overflow: "hidden", opacity: Math.min(1, p * 1.5), transform: `scale(${0.92 + p * 0.08})`, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 26px", fontFamily: font.display, fontSize: 30, fontWeight: 900, borderBottom: `4px solid ${color.ink}`, display: "flex", alignItems: "center", gap: 14, background: color.limeSoft }}>
        <HynexLogo size={36} />
        {title}
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        {sidebar && (
          <div style={{ width: 240, borderRight: `4px solid ${color.ink}`, padding: space.sm, display: "flex", flexDirection: "column", gap: 10 }}>
            {sidebar.map((s, i) => (
              <div key={s} style={{ padding: "12px 16px", borderRadius: radius.sm, fontFamily: font.display, fontSize: 26, fontWeight: 800, background: i === activeIndex ? color.lime : "transparent", color: color.ink, border: i === activeIndex ? `3px solid ${color.ink}` : "3px solid transparent" }}>
                {s}
              </div>
            ))}
          </div>
        )}
        <div style={{ flex: 1, padding: space.md, position: "relative" }}>{children}</div>
      </div>
    </div>
  );
};

// ---------- Cursor ----------
export type CursorPoint = { x: number; y: number; at: number };
export const Cursor: React.FC<{ path: CursorPoint[] }> = ({ path }) => {
  const frame = useCurrentFrame();
  if (path.length === 0) return null;
  const xs = path.map((p) => p.at);
  const clampF = Math.min(Math.max(frame, xs[0]), xs[xs.length - 1]);
  const ease = (t: number) => t * t * (3 - 2 * t);
  const x = interpolate(clampF, xs, path.map((p) => p.x), { easing: ease });
  const y = interpolate(clampF, xs, path.map((p) => p.y), { easing: ease });
  const appear = interpolate(frame, [xs[0] - 6, xs[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, opacity: appear, filter: "drop-shadow(3px 4px 0 rgba(12,20,29,.35))", zIndex: 50 }}>
      <path d="M3 2l7.5 18 2.6-7.4L20.5 10z" fill={color.ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
};

// ---------- ClickRipple ----------
export const ClickRipple: React.FC<{ x: number; y: number; at: number; size?: number }> = ({ x, y, at, size = 150 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 16;
  if (t < 0 || t > 1) return null;
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", border: `7px solid ${color.coral}`, opacity: 1 - t, transform: `scale(${0.3 + t * 0.9})`, zIndex: 40 }} />;
};

// ============================================================
// PHONE MOCKUP — dùng để trình chiếu video thành phẩm / màn hình app
// ============================================================

/** Khung điện thoại. `children` là nội dung màn hình (video, UI...). */
export type PhoneMockupProps = {
  width?: number; // chiều rộng thân máy, mặc định 440 (cao ≈ 2.05x)
  children: React.ReactNode;
  delay?: number;
  rotate?: number;
  float?: boolean;
  statusBar?: boolean;
  bezel?: string; // màu viền máy
};
export const PhoneMockup: React.FC<PhoneMockupProps> = ({ width = 440, children, delay = 0, rotate = 0, float = true, statusBar = true, bezel = color.ink }) => {
  const p = useEnter(delay, "bounce");
  const fl = useFloat(float ? 10 : 0, 26, delay);
  const w = useWiggle(float ? 0.8 : 0, 40, delay);
  const height = Math.round(width * 2.05);
  const pad = Math.round(width * 0.035);
  return (
    <div style={{ width, height, position: "relative", transform: `translateY(${(1 - Math.min(1, p)) * 160 + fl}px) rotate(${rotate + w}deg) scale(${0.85 + 0.15 * Math.min(1, p)})`, opacity: Math.min(1, p * 2) }}>
      {/* nút bên hông */}
      <div style={{ position: "absolute", right: -7, top: height * 0.22, width: 7, height: height * 0.1, background: bezel, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: -7, top: height * 0.18, width: 7, height: height * 0.06, background: bezel, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: -7, top: height * 0.27, width: 7, height: height * 0.09, background: bezel, borderRadius: 4 }} />
      <div style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: pad, borderRadius: width * 0.16, background: bezel, boxShadow: `${width * 0.03}px ${width * 0.03}px 0 ${color.coral}, 0 30px 60px rgba(12,20,29,0.25)`, border: `3px solid ${color.ink}` }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: width * 0.13, overflow: "hidden", background: "#fff" }}>
          {children}
          {statusBar && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: width * 0.1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: `0 ${width * 0.07}px`, fontFamily: font.body, fontWeight: 800, fontSize: width * 0.036, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.5)", zIndex: 5 }}>
              <span>9:41</span>
              <span>●●● 5G ▮</span>
            </div>
          )}
          {/* dynamic island */}
          <div style={{ position: "absolute", left: "50%", top: width * 0.025, width: width * 0.28, height: width * 0.075, marginLeft: -width * 0.14, background: bezel, borderRadius: 99, zIndex: 6 }} />
          {/* home indicator */}
          <div style={{ position: "absolute", left: "50%", bottom: width * 0.02, width: width * 0.34, height: 6, marginLeft: -width * 0.17, background: "#fff", borderRadius: 4, opacity: 0.85, zIndex: 6 }} />
        </div>
      </div>
    </div>
  );
};

/** Màn hình video trong điện thoại. `src` là file trong public/ (vd "clips/edu-demo.mp4").
 *  Không có `src` thì hiện khung giữ chỗ "VIDEO THÀNH PHẨM" để biết chỗ thay video. */
export type PhoneVideoProps = { src?: string; startFrom?: number; caption?: string; handle?: string; likes?: string; comments?: string; shares?: string; showUI?: boolean; width?: number; sound?: boolean };
export const PhoneVideo: React.FC<PhoneVideoProps> = ({ src, startFrom = 0, caption, handle = "@hynex", likes = "12.8K", comments = "326", shares = "1.2K", showUI = true, width = 440, sound = false }) => {
  const frame = useCurrentFrame();
  const heart = Math.sin(frame / 7) * 0.08 + 1;
  return (
    <div style={{ position: "absolute", inset: 0, background: color.ink }}>
      {src ? (
        <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted={!sound} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${color.lime}, ${color.sky})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, fontFamily: font.display, fontWeight: 900, color: color.ink }}>
          <div style={{ fontSize: width * 0.2, fontFamily: font.emoji }}>▶️</div>
          <div style={{ fontSize: width * 0.055, letterSpacing: 1, textAlign: "center", lineHeight: 1.25, padding: "0 12%" }}>VIDEO<br />THÀNH PHẨM</div>
        </div>
      )}
      {showUI && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", background: "linear-gradient(transparent, rgba(12,20,29,.75))" }} />
          <div style={{ position: "absolute", right: width * 0.04, bottom: width * 0.2, display: "flex", flexDirection: "column", alignItems: "center", gap: width * 0.05, color: "#fff", fontFamily: font.display, fontWeight: 800, fontSize: width * 0.04 }}>
            <div style={{ width: width * 0.12, height: width * 0.12, borderRadius: "50%", background: color.ink, border: `3px solid #fff`, display: "flex", alignItems: "center", justifyContent: "center" }}><HynexLogo size={width * 0.09} /></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: width * 0.1, transform: `scale(${heart})`, fontFamily: font.emoji }}>❤️</div>{likes}</div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: width * 0.09, fontFamily: font.emoji }}>💬</div>{comments}</div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: width * 0.09, fontFamily: font.emoji }}>↗️</div>{shares}</div>
          </div>
          <div style={{ position: "absolute", left: width * 0.05, right: width * 0.22, bottom: width * 0.09, color: "#fff", fontFamily: font.body }}>
            <div style={{ fontWeight: 800, fontSize: width * 0.05 }}>{handle}</div>
            {caption && <div style={{ fontWeight: 500, fontSize: width * 0.042, lineHeight: 1.3, marginTop: 4 }}>{caption}</div>}
          </div>
        </>
      )}
    </div>
  );
};

/** Thông báo nổi (notification) trượt vào, dùng cho demo app / tool. */
export const Notification: React.FC<{ title: string; body: string; icon?: string; delay?: number; width?: number }> = ({ title, body, icon = "🔔", delay = 0, width = 640 }) => {
  const { theme } = useHynex();
  const p = useEnter(delay, "pop");
  return (
    <div style={{ ...cardStyle(theme, { radius: radius.md, shadowOffset: 6 }), width, boxSizing: "border-box", padding: "18px 24px", display: "flex", gap: 18, alignItems: "center", transform: `translateY(${(1 - Math.min(1, p)) * -120}px) scale(${0.9 + 0.1 * Math.min(1, p)})`, opacity: Math.min(1, p * 2) }}>
      <div style={{ fontSize: 46, fontFamily: font.emoji }}>{icon}</div>
      <div>
        <div style={{ fontFamily: font.display, fontWeight: 900, fontSize: 30 }}>{title}</div>
        <div style={{ fontSize: 25, color: theme.muted, fontWeight: 500 }}>{body}</div>
      </div>
    </div>
  );
};
