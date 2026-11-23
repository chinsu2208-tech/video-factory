import React from "react";
import { Composition } from "remotion";
import { FPS, H, W } from "./brand";
import episode from "./data/episode.json";
import type { Episode as Ep } from "./data/types";
import { Episode, calcEpisode, totalFrames } from "./Episode";
import { EACH, ITEMS, MotionLibrary } from "./MotionLibrary";

const ep = episode as Ep;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Episode"
      component={Episode}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={totalFrames(ep)}
      defaultProps={{ ep }}
      calculateMetadata={calcEpisode}
    />
    <Composition id="MotionLibrary" component={MotionLibrary} width={W} height={H} fps={FPS} durationInFrames={ITEMS.length * EACH} />
  </>
);
