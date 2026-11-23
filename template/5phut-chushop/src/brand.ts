import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bảng màu theo design system "5 Phút Chủ Shop"
export const C = {
  flame: "#F25C05",
  flameLight: "#FF7A2E",
  alert: "#D7261E",
  night: "#111111",
  card: "#1E1E1E",
  cardLine: "#2C2C2C",
  soft: "#FFE6D3",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.62)",
  // chỉ dùng cho motion "Cơ hội kinh doanh"
  green: "#22C55E",
  gold: "#FFC21A",
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Vùng an toàn TikTok (px trên khung 1080×1920)
export const SAFE = { top: 240, bottom: 480, right: 140, left: 60 };
export const BOX = {
  left: SAFE.left,
  top: SAFE.top,
  width: W - SAFE.left - SAFE.right, // 880
  height: H - SAFE.top - SAFE.bottom, // 1200
};

export const FONT = "Be Vietnam Pro";

const RANGES: Record<string, string> = {
  latin:
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  "latin-ext":
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
  vietnamese:
    "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB",
};

let loaded = false;
export const loadBrandFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const w of ["400", "500", "700", "800", "900"]) {
    for (const s of Object.keys(RANGES)) {
      loadFont({
        family: FONT,
        url: staticFile(`fonts/be-vietnam-pro-${s}-${w}-normal.woff2`),
        weight: w,
        unicodeRange: RANGES[s],
      });
    }
  }
};

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
