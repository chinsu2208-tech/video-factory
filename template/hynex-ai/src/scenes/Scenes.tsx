import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BODY, C, HEAD, clamp } from "../brand";
import type { Episode, Labels, Motion, Scene } from "../data/types";
import {
  AgentAutomation, BeforeAfter, CostCounter, DataScan, FeatureReveal, ModelBattle, ModelRanking, Morphing,
  NeuralNetwork, PromptTyping, ScreenZoom, SpeedRace, TokenStream, WorkflowFlow,
} from "../motion/ai";
import { At, Chip, KineticTitle, Panel, RichText, Slide, SpringIn, TechBg } from "../motion/base";
import { AILaunch, AIUpgrade, AIWorkflow, DataLogo } from "../motion/signature";

export const DUR = { opening: 110, scene: 270, ending: 120 };

export const MotionView: React.FC<{ m: Motion; start: number }> = ({ m, start }) => {
  switch (m.kind) {
    case "prompt": return <PromptTyping start={start} prompt={m.prompt} output={m.output} />;
    case "neural": return <NeuralNetwork start={start} />;
    case "battle": return <ModelBattle start={start} a={m.a} b={m.b} rows={m.rows} />;
    case "workflow": return <WorkflowFlow start={start} steps={m.steps} />;
    case "feature": return <FeatureReveal start={start} name={m.name} features={m.features} />;
    case "screen": return <ScreenZoom start={start} app={m.app} button={m.button} src={m.src} />;
    case "beforeafter": return <BeforeAfter start={start} before={m.before} after={m.after} />;
    case "tokens": return <TokenStream start={start} text={m.text} />;
    case "ranking": return <ModelRanking start={start} rows={m.rows} metric={m.metric} />;
    case "cost": return <CostCounter start={start} from={m.from} to={m.to} unit={m.unit} label={m.label} />;
    case "speed": return <SpeedRace start={start} a={m.a} b={m.b} />;
    case "morph": return <Morphing start={start} src={m.src} label={m.label} />;
    case "scan": return <DataScan start={start} fields={m.fields} />;
    case "agent": return <AgentAutomation start={start} tasks={m.tasks} />;
    case "launch": return <AILaunch start={start} name={m.name} maker={m.maker} />;
    case "upgrade": return <AIUpgrade start={start} from={m.from} to={m.to} note={m.note} />;
    case "aiworkflow": return <AIWorkflow start={start} steps={m.steps} />;
  }
};

const Sample: React.FC<{ L: Labels }> = ({ L }) => (
  <div style={{ position: "absolute", left: 760, top: 240, fontFamily: HEAD, fontSize: 22, fontWeight: 700, color: C.muted, border: `2px solid ${C.line}`, borderRadius: 999, padding: "6px 16px" }}>{L.sample}</div>
);

// ---------- OPENING: logo dựng từ điểm dữ liệu ----------
export const Opening: React.FC<{ ep: Episode; L: Labels }> = ({ ep, L }) => {
  const f = useCurrentFrame();
  return (
    <TechBg>
      {ep.sample ? <Sample L={L} /> : null}
      <At y={330}>
        <DataLogo />
      </At>
      <At y={920}>
        <div style={{ display: "flex", justifyContent: "center", opacity: interpolate(f, [34, 42], [0, 1], clamp) }}>
          <Chip text={ep.date} bg={C.lime} color={C.bg} start={34} />
        </div>
      </At>
      <At y={1040}>
        <div style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
          <KineticTitle text={L.today.replace("{n}", String(ep.scenes.length))} start={44} size={76} />
        </div>
      </At>
    </TechBg>
  );
};

// ---------- MỘT CẢNH TIN ----------
const chipOf = (s: Scene, L: Labels) => ({ breaking: L.breaking, tool: L.tool, battle: L.battle, usecase: L.usecase, tip: L.tip })[s.type];
const noteLabel = (s: Scene, L: Labels) => (s.type === "tip" || s.type === "usecase" || s.type === "tool" ? L.try : L.why);

export const SceneCard: React.FC<{ s: Scene; i: number; n: number; L: Labels; sample?: boolean }> = ({ s, i, n, L, sample }) => (
  <Slide dur={DUR.scene}>
    <TechBg glow={s.type === "battle" ? C.lime : C.blue}>
      {sample ? <Sample L={L} /> : null}
      <At y={262}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Chip text={`${String(i + 1).padStart(2, "0")}/${String(n).padStart(2, "0")}`} bg="transparent" border={C.line} color={C.muted} />
          <Chip text={chipOf(s, L)} bg={s.type === "breaking" ? C.blue : C.bg3} border={s.type === "breaking" ? undefined : C.blue} start={3} />
          {s.maker ? <Chip text={s.maker} bg={C.white} color={C.bg} start={6} /> : null}
        </div>
      </At>
      <At y={356}>
        <KineticTitle text={s.title} start={8} size={78} />
      </At>
      <At y={650} style={{ height: 530, display: "flex", alignItems: "center" }}>
        <MotionView m={s.motion} start={36} />
      </At>
      <At y={1200}>
        <SpringIn start={130}>
          <Panel accent={C.lime} style={{ padding: "24px 32px" }}>
            <div style={{ color: C.lime, fontFamily: HEAD, fontWeight: 700, fontSize: 28, letterSpacing: "0.08em", marginBottom: 8 }}>{noteLabel(s, L)}</div>
            <div style={{ color: C.white, fontFamily: BODY, fontWeight: 600, fontSize: 40, lineHeight: 1.35 }}>
              <RichText text={s.note} start={144} />
            </div>
          </Panel>
        </SpringIn>
      </At>
    </TechBg>
  </Slide>
);

// ---------- ENDING: logo HYNEX AI + CTA ----------
export const Ending: React.FC<{ L: Labels }> = ({ L }) => {
  const f = useCurrentFrame();
  return (
    <TechBg>
      <At y={260}>
        <DataLogo />
      </At>
      <At y={780} style={{ textAlign: "center" }}>
        <div style={{ color: C.white, fontFamily: HEAD, fontWeight: 700, fontSize: 64, lineHeight: 1.2, opacity: interpolate(f, [12, 22], [0, 1], clamp) }}>{L.ctaLine}</div>
      </At>
      <At y={1000} style={{ display: "flex", justifyContent: "center" }}>
        <SpringIn start={26} from="scale">
          <div style={{ background: C.lime, color: C.bg, fontFamily: HEAD, fontWeight: 800, fontSize: 64, borderRadius: 28, padding: "22px 48px" }}>{L.cta}</div>
        </SpringIn>
      </At>
      <At y={1220} style={{ textAlign: "center" }}>
        <div style={{ color: C.muted, fontFamily: HEAD, fontWeight: 700, fontSize: 34, letterSpacing: "0.12em", opacity: interpolate(f, [40, 50], [0, 1], clamp) }}>
          HYNEX <span style={{ color: C.lime }}>AI</span> · AI · AUTOMATION · GROWTH
        </div>
      </At>
    </TechBg>
  );
};
