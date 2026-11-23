import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// HYNEX AI · Tech Editorial Motion · màu chuẩn Hynex (navy, Hynex Blue, lime)
export const C = {
  bg: "#0B1F44", // Hynex Navy
  bg2: "#16306A", // nền thẻ
  bg3: "#1C3A7A", // nền thẻ nổi
  line: "#2A4785",
  blue: "#2563FF", // Hynex Blue, màu chủ đạo
  blueSoft: "#5B8CFF",
  blueDeep: "#1A4FE0",
  lime: "#C8FF00", // điểm nhấn nhận diện, chỉ đặt trên navy hoặc làm nền chữ navy
  white: "#FFFFFF",
  text: "#F8FAFC",
  muted: "#A9B6D3",
  red: "#FF5C7A",
  amber: "#FFC24B",
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const SAFE = { top: 240, bottom: 480, right: 140, left: 60 };
export const BOX = { left: 60, top: 240, width: 880, height: 1200 };

export const HEAD = "Manrope";
export const BODY = "Manrope";

const R: Record<string, string> = {
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  "latin-ext": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
  vietnamese: "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB",
};

let done = false;
export const loadBrandFonts = () => {
  if (done) return;
  done = true;
  for (const s of Object.keys(R)) {
    for (const w of ["400", "500", "600", "700", "800"]) loadFont({ family: HEAD, url: staticFile(`fonts/manrope-${s}-${w}-normal.woff2`), weight: w, unicodeRange: R[s] });
  }
};

export const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
