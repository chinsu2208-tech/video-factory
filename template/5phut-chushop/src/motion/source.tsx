// MOTION ẢNH CHỤP NGUỒN: ảnh chụp bài báo, văn bản, bài đăng thật làm bằng chứng cho tin.
// Thẻ ảnh trượt vào, zoom chậm về dòng quan trọng, khung cam vẽ quanh dòng đó, phần còn lại tối đi.
import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, clamp } from "../brand";

export type Shot = {
  src: string; // đường dẫn trong public/, vd "shots/2026-11-23-tin1.png"
  ratio?: number; // rộng/cao của ảnh, mặc định 1.6
  focus?: { x: number; y: number; w: number; h: number }; // vùng cần nhấn, tỉ lệ 0–1 theo ảnh
  label?: string; // "Ảnh chụp văn bản", "Ảnh chụp bài báo", "Bài đăng trong nhóm"
  source: string; // tên trang / văn bản, luôn hiện
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const ScreenshotCard: React.FC<{ shot: Shot; start?: number; width?: number; height?: number }> = ({
  shot,
  start = 0,
  width = 880,
  height = 330,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - start;
  const ratio = shot.ratio ?? 1.6;
  const imgH = width / ratio;
  const fo = shot.focus ?? { x: 0.03, y: 0.18, w: 0.94, h: 0.14 };

  // vào: trượt từ phải, xoay nhẹ như tờ giấy đặt xuống
  const enter = spring({ frame: f, fps, config: { damping: 15, stiffness: 140 } });
  // zoom chậm về vùng focus
  const z = interpolate(f, [18, 70], [0, 1], { ...clamp, easing: ease });
  const target = Math.max(1, Math.min(2.2, 0.92 / fo.w, (0.5 * height) / (fo.h * imgH)));
  const scale = 1 + (target - 1) * z;
  const cx = (fo.x + fo.w / 2) * width;
  const cy = (fo.y + fo.h / 2) * imgH;
  const tx = interpolate(z, [0, 1], [0, width / 2 - cx * scale]);
  const ty = interpolate(z, [0, 1], [(height - imgH) / 2, height / 2 - cy * scale]);
  // khung nhấn
  const box = interpolate(f, [62, 76], [0, 1], { ...clamp, easing: ease });

  const bx = fo.x * width * scale + tx;
  const by = fo.y * imgH * scale + ty;
  const bw = fo.w * width * scale;
  const bh = fo.h * imgH * scale;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity: interpolate(f, [0, 6], [0, 1], clamp),
        translate: `${interpolate(enter, [0, 1], [160, 0])}px 0px`,
        rotate: `${interpolate(enter, [0, 1], [5, -1.2])}deg`,
        fontFamily: FONT,
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden", background: "#EDEDED", border: `4px solid ${C.white}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width, height: imgH, translate: `${tx}px ${ty}px`, scale: `${scale}`, transformOrigin: "0 0" }}>
          <Img src={staticFile(shot.src)} style={{ width, height: imgH, display: "block" }} />
        </div>
        {/* làm tối phần ngoài vùng nhấn */}
        <div
          style={{
            position: "absolute",
            left: bx,
            top: by,
            width: bw,
            height: bh,
            borderRadius: 10,
            boxShadow: `0 0 0 2000px rgba(17,17,17,${0.5 * box})`,
          }}
        />
        <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect
            x={bx - 8}
            y={by - 8}
            width={bw + 16}
            height={bh + 16}
            rx={12}
            fill="none"
            stroke={C.flame}
            strokeWidth={8}
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 * (1 - box)}
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          top: -26,
          background: C.white,
          color: C.night,
          fontWeight: 800,
          fontSize: 26,
          borderRadius: 999,
          padding: "8px 20px",
          rotate: "1.2deg",
        }}
      >
        {(shot.label ?? "Ảnh chụp nguồn").toUpperCase()} · {shot.source}
      </div>
    </div>
  );
};
