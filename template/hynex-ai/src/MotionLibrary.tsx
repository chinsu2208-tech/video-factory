// Video thư viện: chiếu lần lượt 17 motion (14 đặc trưng + 3 nhận diện), mỗi cái 3 giây.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C, HEAD, loadBrandFonts } from "./brand";
import type { Motion } from "./data/types";
import { At, TechBg } from "./motion/base";
import { MotionView } from "./scenes/Scenes";

loadBrandFonts();
export const EACH = 90;

export const LIB: [string, Motion][] = [
  ["Prompt Typing", { kind: "prompt", prompt: "Write 3 hooks for a summer body mist.", output: ["Hook one", "Hook two", "Hook three"] }],
  ["Neural Network", { kind: "neural" }],
  ["Model Battle", { kind: "battle", a: "Model A", b: "Model B", rows: [{ label: "Quality", a: 86, b: 81 }, { label: "Speed", a: 4.2, b: 2.1, unit: "s", lowerIsBetter: true }] }],
  ["Workflow Flow", { kind: "workflow", steps: ["Collect ideas", "AI writes script", "Auto-edit video", "Post and report"] }],
  ["Feature Reveal", { kind: "feature", name: "Memory", features: ["Remembers your brand", "Works across chats"] }],
  ["Screen Zoom", { kind: "screen", app: "Ad Studio", button: "Generate ad" }],
  ["Before & After", { kind: "beforeafter", before: ["2 hours per listing", "Generic copy"], after: ["5 minutes per listing", "On-brand copy"] }],
  ["Token Stream", { kind: "tokens", text: "Turn one photo into five ads in minutes" }],
  ["Model Ranking", { kind: "ranking", metric: "Score", rows: [{ name: "Model A", before: 82, after: 84 }, { name: "Model B", before: 85, after: 83 }, { name: "Model C", before: 78, after: 88 }] }],
  ["Cost Counter", { kind: "cost", from: 15, to: 3, unit: "per 1M tokens" }],
  ["Speed Comparison", { kind: "speed", a: { name: "Model A", seconds: 4.2 }, b: { name: "Model B", seconds: 2.1 } }],
  ["Morphing", { kind: "morph", label: "Image → Video" }],
  ["Data Scan", { kind: "scan", fields: [{ key: "Invoice no.", value: "INV-0423" }, { key: "Total", value: "$1,240" }, { key: "Due", value: "Dec 15" }] }],
  ["Agent Automation", { kind: "agent", tasks: ["Read new orders", "Update stock sheet", "Email the supplier"] }],
  ["AI Launch (nhận diện)", { kind: "launch", name: "Nova 2", maker: "Sample Lab" }],
  ["AI Upgrade (nhận diện)", { kind: "upgrade", from: "v1.5", to: "v2.0", note: "2x faster" }],
  ["AI Workflow (nhận diện)", { kind: "aiworkflow", steps: ["New message", "AI reads order", "Draft reply", "Approve"] }],
];

export const MotionLibrary: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {LIB.map(([name, m], i) => (
      <Sequence key={name} name={name} from={i * EACH} durationInFrames={EACH} layout="absolute-fill">
        <TechBg>
          <At y={290}>
            <div style={{ color: C.lime, fontFamily: HEAD, fontWeight: 700, fontSize: 32 }}>{String(i + 1).padStart(2, "0")}/{LIB.length}</div>
            <div style={{ color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 76, marginTop: 6 }}>{name}</div>
          </At>
          <At y={620} style={{ height: 540, display: "flex", alignItems: "center" }}>
            <MotionView m={m} start={6} />
          </At>
        </TechBg>
      </Sequence>
    ))}
  </AbsoluteFill>
);
