// 3 MOTION NHẬN DIỆN RIÊNG + logo dựng từ điểm dữ liệu
import React from "react";
import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, HEAD, clamp } from "../brand";
import { ease } from "./base";
import { WorkflowFlow as Flow } from "./ai";

// AI LAUNCH: khối chip mở ra, tên model mới xuất hiện
export const AILaunch: React.FC<{ name: string; maker?: string; start?: number }> = ({ name, maker, start = 0 }) => {
  const f = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const open = interpolate(f, [22, 40], [0, 1], { ...clamp, easing: ease });
  const shake = f > 8 && f < 22 ? Math.sin(f * 3) * 3 : 0;
  const nameIn = spring({ frame: f - 34, fps, config: { damping: 11, stiffness: 160 } });
  const Pins: React.FC<{ side: "l" | "r" }> = ({ side }) => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", [side === "l" ? "left" : "right"]: -26, top: 40 + i * 50, width: 26, height: 12, background: C.blueSoft, borderRadius: 3 }} />
      ))}
    </>
  );
  return (
    <div style={{ width: 880, height: 520, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = interpolate(f, [34, 56], [120, 330], { ...clamp, easing: Easing.out(Easing.quad) });
        return <div key={i} style={{ position: "absolute", left: 440 + Math.cos(a) * r - 4, top: 260 + Math.sin(a) * r - 18, width: 8, height: 36, borderRadius: 4, background: i % 2 ? C.lime : C.blue, rotate: `${(a * 180) / Math.PI + 90}deg`, opacity: interpolate(f, [34, 40, 56], [0, 1, 0], clamp) }} />;
      })}
      <div style={{ position: "absolute", top: 260 - 130 - 18, left: 440 - 130 + shake, width: 260, height: 130, background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`, borderRadius: "28px 28px 0 0", translate: `0px ${-open * 140}px`, opacity: 1 - open * 0.7 }}>
        <Pins side="l" />
        <Pins side="r" />
      </div>
      <div style={{ position: "absolute", top: 260 - 18, left: 440 - 130 + shake, width: 260, height: 130, background: `linear-gradient(135deg, ${C.blueDeep}, ${C.blue})`, borderRadius: "0 0 28px 28px", translate: `0px ${open * 140}px`, opacity: 1 - open * 0.7 }} />
      <div style={{ position: "absolute", top: 260 - 6 - 18, left: 440 - 130, width: 260, height: 12, background: C.lime, boxShadow: `0 0 40px ${C.lime}`, opacity: interpolate(f, [14, 22, 40], [0, 1, 0], clamp) }} />
      <div style={{ textAlign: "center", scale: `${nameIn}`, opacity: nameIn }}>
        {maker ? <div style={{ color: C.lime, fontFamily: HEAD, fontWeight: 700, fontSize: 32, letterSpacing: "0.1em" }}>{maker.toUpperCase()}</div> : null}
        <div style={{ color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 96, letterSpacing: "-0.02em", textShadow: `0 0 40px ${C.blue}` }}>{name}</div>
      </div>
    </div>
  );
};

// AI UPGRADE: thanh tiến trình nâng cấp từ bản cũ lên bản mới
export const AIUpgrade: React.FC<{ from: string; to: string; start?: number; note?: string }> = ({ from, to, start = 0, note }) => {
  const f = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const p = interpolate(f, [10, 60], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const doneS = spring({ frame: f - 62, fps, config: { damping: 9, stiffness: 200 } });
  return (
    <div style={{ width: 880, fontFamily: HEAD }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ color: p < 1 ? C.white : C.muted, fontWeight: 700, fontSize: 56, textDecoration: p >= 1 ? "line-through" : "none" }}>{from}</div>
        <div style={{ color: C.lime, fontWeight: 700, fontSize: 72, opacity: interpolate(p, [0.6, 1], [0.2, 1]) }}>{to}</div>
      </div>
      <div style={{ marginTop: 26, height: 64, borderRadius: 20, background: C.bg2, border: `2px solid ${C.line}`, overflow: "hidden", position: "relative" }}>
        <div style={{ height: "100%", width: `${p * 100}%`, background: `repeating-linear-gradient(-45deg, ${C.blue} 0 26px, ${C.blueSoft} 26px 52px)`, backgroundPosition: `${f * 3}px 0px` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 700, fontSize: 30 }}>
          {p < 1 ? `Upgrading… ${Math.round(p * 100)}%` : "Upgrade complete"}
        </div>
      </div>
      <div style={{ marginTop: 26, display: "inline-block", background: C.lime, color: C.bg, borderRadius: 999, padding: "10px 26px", fontWeight: 700, fontSize: 32, scale: `${doneS}`, transformOrigin: "left" }}>
        ↑ {note ?? "Now live"}
      </div>
    </div>
  );
};

// AI WORKFLOW: các khối công việc nối nhau, lần lượt sáng và tự hoàn thành
export const AIWorkflow = Flow;

// LOGO HYNEX AI xuất hiện từ các điểm dữ liệu
export const DataLogo: React.FC<{ start?: number; size?: number }> = ({ start = 0, size = 1 }) => {
  const f = useCurrentFrame() - start;
  const pts = Array.from({ length: 36 }).map((_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const ring = i % 2 ? 120 : 80;
    return { tx: Math.cos(a) * ring, ty: Math.sin(a) * ring, sx: (random(`x${i}`) - 0.5) * 1400, sy: (random(`y${i}`) - 0.5) * 1600 };
  });
  const t = interpolate(f, [0, 26], [0, 1], { ...clamp, easing: ease });
  const word = interpolate(f, [24, 34], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: 880, height: 520, scale: `${size}` }}>
      <div style={{ position: "absolute", left: 440, top: 190 }}>
        {pts.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.sx + (p.tx - p.sx) * t - 6, top: p.sy + (p.ty - p.sy) * t - 6, width: 12, height: 12, borderRadius: 3, background: i % 3 ? C.blue : C.lime, opacity: 1 - word * 0.3 }} />
        ))}
        <div style={{ position: "absolute", left: -56, top: -56, width: 112, height: 112, borderRadius: 30, background: C.blue, border: `4px solid ${C.lime}`, opacity: word, scale: `${word}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 64 }}>
          H
        </div>
      </div>
      <div style={{ position: "absolute", top: 360, width: 880, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 96, letterSpacing: "0.04em", color: C.white, opacity: word, filter: `blur(${(1 - word) * 10}px)` }}>
        HYNEX <span style={{ color: C.lime }}>AI</span>
      </div>
    </div>
  );
};
