export type Source =
  | {type: 'clip'; file: string; startSec: number}
  | {type: 'still'; file: string};

export type Callout = {
  dot: [number, number]; // toạ độ chấm cam trên khung 1080x1920
  text: string;
  top: number; // y của chip bên trái (giữ top + 112 < 1270 để không đè sub)
};

export type Scene = {
  src: Source;
  lead?: string; // câu dẫn nhỏ (font phụ viết tay)
  big?: string; // dòng lớn
  bigSize?: number;
  line?: string; // dòng nhấn màu
  small?: string; // dòng nhỏ
  callouts?: Callout[];
  sub: string; // dòng sub
  scrim?: boolean; // mặc định true khi có chữ
};

export type AffProps = {
  scenes: Scene[];
  sceneSec: number; // mặc định 2.6
  xfSec: number; // mặc định 0.4
  debug?: boolean; // vẽ khung vùng an toàn
};
