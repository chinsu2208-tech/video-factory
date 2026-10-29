import React from "react";
import { AbsoluteFill, Audio, Sequence, Series, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Branch, Orientation, safeBox } from "../brand/tokens";
import { Frame, useHynex } from "../core-components";

export type SfxName = "logo" | "end" | "pop" | "ding" | "tick" | "whoosh" | "swipe";
export type SfxCue = { at: number; name: SfxName; volume?: number };
/** Một scene = loại + thời lượng + props nội dung + (tuỳ chọn) âm thanh. */
export type SceneDef = { type: string; duration: number; props?: Record<string, any>; sfx?: SfxCue[]; silentTransition?: boolean };
export type VideoContent = {
  id: string;
  branch: Branch;
  orientation: Orientation;
  scenes: SceneDef[];
  showSafeGuide?: boolean;
  voice?: string; // file giọng đọc trong public/ (vd "voice-hx01.mp3"), phát suốt video
  sound?: boolean; // mặc định bật: sting đầu/cuối + whoosh chuyển cảnh
};
export type SceneRegistry = Record<string, React.FC<any>>;

export const VERTICAL_ZOOM = 1.25;
export const totalFrames = (c: VideoContent) => c.scenes.reduce((a, s) => a + s.duration, 0);

/** Khung vùng nội dung: fill safe box. 9:16 phóng 1.25x để chữ đủ lớn trên điện thoại. */
export const Stage: React.FC<{ children: React.ReactNode; justify?: "start" | "center" | "end" | "space-between"; gap?: number; direction?: "column" | "row" }> = ({ children, justify = "center", gap = 32, direction = "column" }) => {
  const { orientation } = useHynex();
  const b = safeBox(orientation);
  const z = orientation === "vertical" ? VERTICAL_ZOOM : 1;
  return (
    <div style={{ width: b.w, height: b.h }}>
      <div style={{ zoom: z, width: b.w / z, height: b.h / z, display: "flex", flexDirection: direction, justifyContent: justify, gap }}>{children}</div>
    </div>
  );
};

const SceneFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5, duration - 8, duration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Sfx: React.FC<{ cue: SfxCue }> = ({ cue }) => (
  <Sequence from={cue.at} layout="none">
    <Audio src={staticFile(`sfx/${cue.name}.wav`)} volume={cue.volume ?? 0.6} />
  </Sequence>
);

export const SceneRunner: React.FC<{ content: VideoContent; registry: SceneRegistry }> = ({ content, registry }) => {
  const sound = content.sound ?? true;
  const total = totalFrames(content);
  return (
    <Frame branch={content.branch} orientation={content.orientation} showSafeGuide={content.showSafeGuide}>
      <Series>
        {content.scenes.map((s, i) => {
          const Comp = registry[s.type];
          if (!Comp) throw new Error(`Scene type "${s.type}" chưa có trong registry của nhánh ${content.branch}`);
          return (
            <Series.Sequence key={i} durationInFrames={s.duration}>
              <SceneFade duration={s.duration}>
                <Comp {...(s.props ?? {})} />
              </SceneFade>
              {sound && i > 0 && !s.silentTransition && <Sfx cue={{ at: 0, name: "whoosh", volume: 0.5 }} />}
              {sound && (s.sfx ?? []).map((c, j) => <Sfx key={j} cue={c} />)}
            </Series.Sequence>
          );
        })}
      </Series>
      {content.voice && <Audio src={staticFile(content.voice)} volume={1} />}
      {sound && <Sfx cue={{ at: 0, name: "logo", volume: 0.5 }} />}
      {sound && <Sfx cue={{ at: Math.max(0, total - 34), name: "end", volume: 0.5 }} />}
    </Frame>
  );
};
