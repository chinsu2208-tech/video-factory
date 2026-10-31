import React from 'react';
import {Composition} from 'remotion';
import {TrendNews} from './Template';
import {FPS, DURATION_SEC} from './config';
import {PostThread} from './PostThread';
import {POST_FPS, POST_DURATION_SEC} from './postConfig';
import {MomReview} from './MomReview';
import {defaultMomJob, MOM_FPS} from './momConfig';
import {NewsMix} from './NewsMix';
import {demoNewsA, demoNewsB, demoNewsC, NEWS_FPS} from './newsConfig';
import {HandMix} from './HandMix';

export const Root: React.FC = () => (
  <>
  <Composition
    id="TrendNews"
    component={TrendNews}
    defaultProps={{fxSeed: 0}}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={Math.round(DURATION_SEC * FPS)}
  />
  <Composition
    id="PostThread"
    component={PostThread}
    defaultProps={{fxSeed: 0}}
    width={1080}
    height={1920}
    fps={POST_FPS}
    durationInFrames={Math.round(POST_DURATION_SEC * POST_FPS)}
  />
  <Composition
    id="MomReview"
    component={MomReview}
    width={1080}
    height={1920}
    fps={MOM_FPS}
    durationInFrames={Math.round(defaultMomJob.durationSec * MOM_FPS)}
    defaultProps={defaultMomJob}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, Math.round(props.durationSec * MOM_FPS))})}
  />
  <Composition
    id="NewsMixA"
    component={NewsMix}
    width={1080}
    height={1920}
    fps={NEWS_FPS}
    durationInFrames={Math.round(demoNewsA.durationSec * NEWS_FPS)}
    defaultProps={demoNewsA}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, Math.round(props.durationSec * NEWS_FPS))})}
  />
  <Composition
    id="NewsMixB"
    component={NewsMix}
    width={1080}
    height={1920}
    fps={NEWS_FPS}
    durationInFrames={Math.round(demoNewsB.durationSec * NEWS_FPS)}
    defaultProps={demoNewsB}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, Math.round(props.durationSec * NEWS_FPS))})}
  />
  <Composition
    id="NewsMixC"
    component={HandMix}
    width={1080}
    height={1920}
    fps={NEWS_FPS}
    durationInFrames={Math.round(demoNewsC.durationSec * NEWS_FPS)}
    defaultProps={demoNewsC}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, Math.round(props.durationSec * NEWS_FPS))})}
  />
  </>
);
