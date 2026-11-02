import React from 'react';
import {Composition} from 'remotion';
import {makeAffVideo, totalFrames} from './AffVideo';
import {THONG_THAI, TIET_KIEM} from './themes';
import type {AffProps} from './types';
import tk from '../props/tiet-kiem.json';
import tt from '../props/thong-thai.json';

const TietKiemComp = makeAffVideo(TIET_KIEM);
const ThongThaiComp = makeAffVideo(THONG_THAI);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TietKiem"
      component={TietKiemComp}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={totalFrames(tk as AffProps)}
      defaultProps={tk as AffProps}
      calculateMetadata={({props}) => ({durationInFrames: totalFrames(props as AffProps)})}
    />
    <Composition
      id="ThongThai"
      component={ThongThaiComp}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={totalFrames(tt as AffProps)}
      defaultProps={tt as AffProps}
      calculateMetadata={({props}) => ({durationInFrames: totalFrames(props as AffProps)})}
    />
  </>
);
