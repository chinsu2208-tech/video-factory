import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence } from "remotion";
import { C, loadBrandFonts } from "./brand";
import { labelsFor } from "./data/labels";
import type { Episode as Ep } from "./data/types";
import { ScanWipe } from "./motion/base";
import { DUR, Ending, Opening, SceneCard } from "./scenes/Scenes";

loadBrandFonts();

export const totalFrames = (ep: Ep) => DUR.opening + ep.scenes.length * DUR.scene + DUR.ending;
export const calcEpisode: CalculateMetadataFunction<{ ep: Ep }> = ({ props }) => ({ durationInFrames: totalFrames(props.ep) });

export const Episode: React.FC<{ ep: Ep }> = ({ ep }) => {
  const L = labelsFor(ep.lang, ep.labels);
  const items: { key: string; dur: number; el: React.ReactNode; wipe?: boolean }[] = [
    { key: "opening", dur: DUR.opening, el: <Opening ep={ep} L={L} />, wipe: true },
    ...ep.scenes.map((s, i) => ({ key: `scene-${i}`, dur: DUR.scene, el: <SceneCard s={s} i={i} n={ep.scenes.length} L={L} sample={ep.sample} />, wipe: i === ep.scenes.length - 1 })),
    { key: "ending", dur: DUR.ending, el: <Ending L={L} /> },
  ];
  let t = 0;
  const out: React.ReactNode[] = [];
  const wipes: React.ReactNode[] = [];
  for (const it of items) {
    out.push(<Sequence key={it.key} name={it.key} from={t} durationInFrames={it.dur} layout="absolute-fill">{it.el}</Sequence>);
    t += it.dur;
    if (it.wipe) wipes.push(<Sequence key={`w-${it.key}`} name="Scan Wipe" from={t - 9} durationInFrames={18} layout="absolute-fill"><ScanWipe /></Sequence>);
  }
  return <AbsoluteFill style={{ background: C.bg }}>{out}{wipes}</AbsoluteFill>;
};
