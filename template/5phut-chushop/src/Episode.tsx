import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence } from "remotion";
import { loadBrandFonts } from "./brand";
import type { Episode as Ep } from "./data/types";
import { ShapeWipe } from "./motion/transitions";
import { DUR, DeadlineScene, Intro, NewsScene, NumberScene, Outro, TodoScene } from "./scenes/Scenes";

loadBrandFonts();

type Block = { key: string; dur: number; el: React.ReactNode; wipeAfter?: boolean };

const blocks = (ep: Ep): Block[] => [
  { key: "intro", dur: DUR.intro, el: <Intro ep={ep} />, wipeAfter: true },
  ...ep.news.map((n, i) => ({
    key: `news-${i}`,
    dur: DUR.news,
    el: <NewsScene item={n} index={i} total={ep.news.length} sample={ep.sample} />,
    wipeAfter: i === ep.news.length - 1,
  })),
  { key: "number", dur: DUR.number, el: <NumberScene ep={ep} /> },
  { key: "deadline", dur: DUR.deadline, el: <DeadlineScene ep={ep} /> },
  { key: "todo", dur: DUR.todo(ep.todo.length), el: <TodoScene ep={ep} />, wipeAfter: true },
  { key: "outro", dur: DUR.outro, el: <Outro ep={ep} /> },
];

export const totalFrames = (ep: Ep) => blocks(ep).reduce((a, b) => a + b.dur, 0);

export const calcEpisode: CalculateMetadataFunction<{ ep: Ep }> = ({ props }) => ({
  durationInFrames: totalFrames(props.ep),
});

export const Episode: React.FC<{ ep: Ep }> = ({ ep }) => {
  let t = 0;
  const seq: React.ReactNode[] = [];
  const wipes: React.ReactNode[] = [];
  for (const b of blocks(ep)) {
    seq.push(
      <Sequence key={b.key} name={b.key} from={t} durationInFrames={b.dur} layout="absolute-fill">
        {b.el}
      </Sequence>,
    );
    t += b.dur;
    if (b.wipeAfter) {
      wipes.push(
        <Sequence key={`wipe-${b.key}`} name="Shape Wipe" from={t - 9} durationInFrames={18} layout="absolute-fill">
          <ShapeWipe duration={18} />
        </Sequence>,
      );
    }
  }
  return (
    <AbsoluteFill style={{ background: "#111111" }}>
      {seq}
      {wipes}
    </AbsoluteFill>
  );
};
