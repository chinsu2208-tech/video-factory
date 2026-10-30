import React from "react";
import { Composition } from "remotion";
import { format, motion } from "../brand/tokens";
import { SceneRunner, VideoContent, totalFrames } from "../scenes/SceneRunner";
import { eduRegistry } from "../branches/edu/scenes";
import { mediaRegistry } from "../branches/media/scenes";
import { b2bRegistry } from "../branches/b2b/scenes";
import { realRegistry } from "../branches/real/scenes";
import { realDemo } from "../content/real-demo";
import { realHookStyles } from "../content/real-hook-styles";
import { hx01 } from "../content/hx-01";
import { eduAiBai01 } from "../content/edu-ai-bai-01";
import { eduAiBai02 } from "../content/edu-ai-bai-02";
import { realPalettesDemo } from "../content/real-palettes";
import { eduDemo } from "../content/edu-demo";
import { mediaDemo } from "../content/media-demo";
import { b2bDemo } from "../content/b2b-demo";
import { b2bServiceVideo } from "../content/b2b-service-video";
import { b2bBenefitVideo } from "../content/b2b-benefit-video";

// Thêm video mới = thêm 1 file content + 1 dòng ở đây. Không cần viết lại animation.
const videos = [
  { name: "EduDemo", content: eduDemo, registry: eduRegistry },
  { name: "MediaDemo", content: mediaDemo, registry: mediaRegistry },
  { name: "B2BDemo", content: b2bDemo, registry: b2bRegistry },
  { name: "B2BService", content: b2bServiceVideo, registry: b2bRegistry },
  { name: "B2BBenefit", content: b2bBenefitVideo, registry: b2bRegistry },
  { name: "EduAiBai01", content: eduAiBai01, registry: eduRegistry },
  { name: "EduAiBai02", content: eduAiBai02, registry: eduRegistry },
  { name: "RealDemo", content: realDemo, registry: realRegistry },
  { name: "RealHooks", content: realHookStyles, registry: realRegistry },
  { name: "HX01", content: hx01, registry: realRegistry },
  { name: "RealPalettes", content: realPalettesDemo, registry: realRegistry },
];

export const Root: React.FC = () => (
  <>
    {videos.map(({ name, content, registry }) => {
      const f = format[content.orientation];
      return (
        <Composition
          key={name}
          id={name}
          component={() => <SceneRunner content={content as VideoContent} registry={registry} />}
          durationInFrames={totalFrames(content)}
          fps={motion.fps}
          width={f.width}
          height={f.height}
        />
      );
    })}
  </>
);
