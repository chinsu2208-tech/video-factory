import {continueRender, delayRender, staticFile} from 'remotion';
import {FONT_FILES} from './themes';

let started = false;
export const loadFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender('fonts');
  Promise.all(
    Object.entries(FONT_FILES).map(async ([name, file]) => {
      const face = new FontFace(name, `url(${staticFile(file)})`, {weight: '100 900'});
      await face.load();
      document.fonts.add(face);
    }),
  )
    .catch((e) => console.error('font load failed', e))
    .finally(() => continueRender(handle));
};
