import {TapTips, TT_TOTAL} from './TapTips';
import {ToneEditorial, TE_TOTAL} from './ToneEditorial';
import {ToneEditorial2, TE2_TOTAL} from './ToneEditorial2';
import {ToneEditorial3, TE3_TOTAL} from './ToneEditorial3';
import {TapScrapbook, TS_TOTAL} from './TapScrapbook';
import {NhaGiaNhanReal, GR_TOTAL} from './NhaGiaNhanReal';
import React from 'react';
import {Composition} from 'remotion';
import {TrendNews} from './Template';
import {FPS, DURATION_SEC} from './config';
import {PostThread} from './PostThread';
import {POST_FPS, POST_DURATION_SEC} from './postConfig';
import {VlogReview} from './VlogReview';
import {VLOG_FPS, vlogTotalSec} from './vlogConfig';
import {MotionExplainer} from './MotionExplainer';
import {MX_FPS, motionTotalSec} from './motionConfig';
import {BaziHand} from './BaziHand';
import {BaziScript, BZ_TOTAL} from './BaziScript';
import {NhaGiaNhan, GN_TOTAL} from './NhaGiaNhan';
import {BaziEp2, EP2_TOTAL} from './BaziEp2';
import {BaziDemo} from './BaziDemo';
import {Map10, M_FPS, M_SEC} from './Map10';
import {TutorialMock, TUT_FPS, TUT_SEC} from './TutorialMock';
import {HynexSolDemo} from './HynexSolDemo';
import {NotebookDemo} from './NotebookDemo';
import {DoodleMoney, DM_FPS, DM_SEC} from './DoodleMoney';
import {PaperCutout, PAPER_FPS, PAPER_SEC} from './PaperCutout';

export const Root: React.FC = () => (
  <>
  <Composition
    id="TrendNews"
    component={TrendNews}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={Math.round(DURATION_SEC * FPS)}
  />
  <Composition
    id="PostThread"
    component={PostThread}
    width={1080}
    height={1920}
    fps={POST_FPS}
    durationInFrames={Math.round(POST_DURATION_SEC * POST_FPS)}
  />
  <Composition
    id="VlogReview"
    component={VlogReview}
    width={1080}
    height={1920}
    fps={VLOG_FPS}
    durationInFrames={Math.round(vlogTotalSec * VLOG_FPS)}
  />
  <Composition
    id="MotionExplainer"
    component={MotionExplainer}
    width={1080}
    height={1920}
    fps={MX_FPS}
    durationInFrames={Math.round(motionTotalSec * MX_FPS)}
  />
  <Composition id="PaperCutout" component={PaperCutout} width={1080} height={1920} fps={PAPER_FPS} durationInFrames={PAPER_SEC * PAPER_FPS} />
  <Composition id="DoodleMoney" component={DoodleMoney} width={1080} height={1920} fps={DM_FPS} durationInFrames={DM_SEC * DM_FPS} />
  <Composition id="NotebookDemo" component={NotebookDemo} width={1080} height={1920} fps={30} durationInFrames={4} />
  <Composition id="HynexSolDemo" component={HynexSolDemo} width={1080} height={1920} fps={30} durationInFrames={4} />
  <Composition id="TutorialMock" component={TutorialMock} width={1080} height={1920} fps={TUT_FPS} durationInFrames={TUT_SEC * TUT_FPS} />
  <Composition id="Map10" component={Map10} width={1080} height={1920} fps={M_FPS} durationInFrames={M_SEC * M_FPS} />
  <Composition id="BaziDemo" component={BaziDemo} width={1080} height={1920} fps={30} durationInFrames={4} />
  <Composition id="BaziScript" component={BaziScript} width={1080} height={1920} fps={30} durationInFrames={BZ_TOTAL} />
  <Composition id="BaziScript15" component={BaziScript} width={1080} height={1920} fps={15} durationInFrames={Math.round(BZ_TOTAL / 2)} />
  <Composition id="BaziEp2" component={BaziEp2} width={1080} height={1920} fps={30} durationInFrames={EP2_TOTAL} />
  <Composition id="BaziEp2-15" component={BaziEp2} width={1080} height={1920} fps={15} durationInFrames={Math.round(EP2_TOTAL / 2)} />
  <Composition id="NhaGiaNhan" component={NhaGiaNhan} width={1080} height={1920} fps={30} durationInFrames={GN_TOTAL*30} />
  <Composition id="NhaGiaNhan-15" component={NhaGiaNhan} width={1080} height={1920} fps={15} durationInFrames={GN_TOTAL*15} />
  <Composition id="NhaGiaNhanReal" component={NhaGiaNhanReal} width={1080} height={1920} fps={30} durationInFrames={GR_TOTAL*30} />
  <Composition id="NhaGiaNhanReal-15" component={NhaGiaNhanReal} width={1080} height={1920} fps={15} durationInFrames={GR_TOTAL*15} />
  <Composition id="TapScrapbook" component={TapScrapbook} width={1080} height={1920} fps={30} durationInFrames={Math.round(TS_TOTAL*30)} />
  <Composition id="ToneEditorial" component={ToneEditorial} width={1080} height={1920} fps={30} durationInFrames={Math.round(TE_TOTAL*30)} />
  <Composition id="ToneEditorial2" component={ToneEditorial2} width={1080} height={1920} fps={30} durationInFrames={Math.round(TE2_TOTAL*30)} />
  <Composition id="ToneEditorial3" component={ToneEditorial3} width={1080} height={1920} fps={30} durationInFrames={Math.round(TE3_TOTAL*30)} />
  <Composition id="TapTips" component={TapTips} width={1080} height={1920} fps={30} durationInFrames={Math.round(TT_TOTAL*30)} />
  <Composition id="BaziHand" component={BaziHand} width={1080} height={1920} fps={30} durationInFrames={4} />
  </>
);
