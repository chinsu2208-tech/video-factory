export type Theme = {
  id: string;
  mainFont: string;
  accentFont: string;
  highlight: string; // màu dòng nhấn
  chipBorder: string;
  chipBg: string;
  dot: string;
  bigWeight: number;
};

export const FONT_FILES: Record<string, string> = {
  'Super Kidpop': 'fonts/SuperKidpop.ttf',
  'Burger Steak': 'fonts/BurgerSteak.ttf',
  'TeX Gyre Adventor': 'fonts/Adventor-Bold.otf',
  'Intruding Cat': 'fonts/IntrudingCat.ttf',
  'The Melody': 'fonts/TheMelody.ttf',
};

export const TIET_KIEM: Theme = {
  id: 'tiet-kiem',
  mainFont: 'Super Kidpop',
  accentFont: 'Burger Steak',
  highlight: '#FFC98A',
  chipBorder: 'rgba(255,255,255,.45)',
  chipBg: 'rgba(24,24,24,.40)',
  dot: '#FF8A3D',
  bigWeight: 800,
};

export const THONG_THAI: Theme = {
  id: 'thong-thai',
  mainFont: 'TeX Gyre Adventor',
  accentFont: 'Intruding Cat',
  highlight: '#BFE0FF',
  chipBorder: 'rgba(191,224,255,.60)',
  chipBg: 'rgba(20,32,48,.45)',
  dot: '#FF8A3D',
  bigWeight: 800,
};
