// Nạp font từ public/fonts (không cần mạng khi render). Có đủ subset vietnamese + latin-ext.
import { continueRender, delayRender, staticFile } from "remotion";

const RANGES: Record<string, string> = {
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  "latin-ext": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
  vietnamese: "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB",
};

const faces: { family: string; weights: number[]; slug: string; styles?: ("normal" | "italic")[] }[] = [
  { family: "Nunito", weights: [700, 800, 900], slug: "nunito" },
  { family: "Be Vietnam Pro", weights: [400, 500, 600, 700, 800], slug: "be-vietnam-pro" },
  { family: "Playfair Display", weights: [700, 900], slug: "playfair-display" },
  { family: "Playfair Display", weights: [500, 700], slug: "playfair-display", styles: ["italic"] },
  { family: "Baloo 2", weights: [700, 800], slug: "baloo-2" },
  { family: "Barlow Condensed", weights: [700, 800], slug: "barlow-condensed" },
];

let started = false;
export const loadHynexFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Loading Hynex fonts");
  const jobs: Promise<unknown>[] = [];
  for (const f of faces) {
    for (const st of f.styles ?? ["normal"]) {
      for (const w of f.weights) {
        for (const subset of Object.keys(RANGES)) {
          const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.slug}-${subset}-${w}-${st}.woff2`)}) format("woff2")`, {
            weight: String(w),
            style: st,
            unicodeRange: RANGES[subset],
          });
          jobs.push(face.load().then((l) => document.fonts.add(l)));
        }
      }
    }
  }
  Promise.all(jobs).then(() => continueRender(handle)).catch(() => continueRender(handle));
};
