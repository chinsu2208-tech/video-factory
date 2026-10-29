import React from "react";
import { color } from "../brand/tokens";

/** Logo Hynex dạng vector, dựng lại theo ảnh Sếp gửi (ô vuông bo navy, chữ H trắng, chấm lime viền trắng).
 *  Nếu có file logo gốc dạng SVG, thay component này bằng <Img src={staticFile("logo/hynex.svg")} />. */
export const HynexLogo: React.FC<{ size?: number; dotScale?: number; rotate?: number }> = ({ size = 64, dotScale = 1, rotate = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", transform: `rotate(${rotate}deg)` }}>
    <rect x="0" y="0" width="100" height="100" rx="23" fill={color.ink} />
    {/* chữ H: tỉ lệ đo từ logo gốc */}
    <rect x="33.1" y="34.5" width="8.3" height="39.7" fill="#fff" />
    <rect x="58.6" y="34.5" width="8.3" height="39.7" fill="#fff" />
    <rect x="33.1" y="50.3" width="33.8" height="6.9" fill="#fff" />
    {/* chấm lime viền trắng */}
    <g transform={`translate(86.5 86.5) scale(${dotScale}) translate(-86.5 -86.5)`}>
      <circle cx="86.5" cy="86.5" r="6.5" fill="#fff" />
      <circle cx="86.5" cy="86.5" r="4.8" fill={color.lime} />
    </g>
  </svg>
);
