// NHÓM 5 · MOTION NHẬN DIỆN CỦA BẢN TIN (lặp lại mỗi ngày)
// UrgentBell + UrgentFrame (Tin khẩn) · OpportunityBulb (Cơ hội) ·
// Chi phí tăng = CoinWallet out · Chính sách mới = StampDoc · Việc cần làm = ChecklistTick
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, H, W, clamp } from "../brand";

/** Tin khẩn: chuông rung + sóng âm */
export const UrgentBell: React.FC<{ start?: number; size?: number }> = ({ start = 0, size = 300 }) => {
  const f = useCurrentFrame() - start;
  const ring = f > 0 ? Math.sin(f * 1.3) * interpolate(f % 45, [0, 30, 45], [22, 0, 0], clamp) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      {[0, 1].map((i) => {
        const t = ((f + i * 10) % 30) / 30;
        return (
          <g key={i} opacity={interpolate(t, [0, 1], [0.9, 0])}>
            <path d={`M${40 - t * 20} ${70 - t * 10} q-${14 + t * 10} 30 0 60`} stroke={C.alert} strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d={`M${160 + t * 20} ${70 - t * 10} q${14 + t * 10} 30 0 60`} stroke={C.alert} strokeWidth={8} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      <g transform={`rotate(${ring} 100 30)`}>
        <path d="M100 30c-30 0-46 22-46 52v34l-14 22h120l-14-22V82c0-30-16-52-46-52z" fill={C.alert} />
        <circle cx={100} cy={26} r={8} fill={C.alert} />
        <circle cx={100 + ring * 0.6} cy={150} r={14} fill={C.white} />
      </g>
    </svg>
  );
};

/** Tin khẩn: viền đỏ nhấp nhẹ quanh khung hình (đặt ở lớp ngoài cùng) */
export const UrgentFrame: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(Math.sin(f / 6), [-1, 1], [0.35, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: H,
        boxShadow: `inset 0 0 0 18px rgba(215,38,30,${o})`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Cơ hội kinh doanh: bóng đèn sáng dần + mũi tên xanh vút lên */
export const OpportunityBulb: React.FC<{ start?: number; size?: number }> = ({ start = 0, size = 360 }) => {
  const f = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const glow = interpolate(f, [6, 20], [0, 1], clamp);
  const arrow = spring({ frame: f - 18, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ overflow: "visible" }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1={100}
          y1={20}
          x2={100}
          y2={2}
          stroke={C.gold}
          strokeWidth={8}
          strokeLinecap="round"
          transform={`rotate(${a} 100 90) translate(0 ${-glow * 8})`}
          opacity={glow}
        />
      ))}
      <circle cx={100} cy={90} r={60} fill={C.gold} opacity={glow * 0.25} />
      <path d="M100 36c-30 0-52 22-52 50 0 18 9 30 20 40v18h64v-18c11-10 20-22 20-40 0-28-22-50-52-50z" fill={glow > 0.5 ? C.gold : "#555"} />
      <rect x={70} y={150} width={60} height={12} rx={6} fill={C.white} />
      <rect x={76} y={168} width={48} height={12} rx={6} fill={C.white} />
      <g transform={`translate(${interpolate(arrow, [0, 1], [-40, 0])} ${interpolate(arrow, [0, 1], [40, 0])})`} opacity={arrow}>
        <path d="M150 200l70-70" stroke={C.green} strokeWidth={16} strokeLinecap="round" />
        <path d="M180 126h44v44" stroke={C.green} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Nhãn loại tin (chip) dùng chung cho 5 tình huống */
export const KIND = {
  urgent: { label: "TIN KHẨN", bg: C.alert },
  opportunity: { label: "CƠ HỘI", bg: C.green },
  cost: { label: "CHI PHÍ TĂNG", bg: C.alert },
  policy: { label: "CHÍNH SÁCH MỚI", bg: C.flame },
  todo: { label: "VIỆC CẦN LÀM", bg: C.flame },
  info: { label: "TIN SÀN", bg: C.flame },
} as const;
export type Kind = keyof typeof KIND;

export const KindChip: React.FC<{ kind: Kind; start?: number }> = ({ kind, start = 0 }) => {
  const f = useCurrentFrame();
  const k = KIND[kind];
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 32,
        color: kind === "opportunity" ? C.night : C.white,
        background: k.bg,
        borderRadius: 999,
        padding: "12px 28px",
        opacity: interpolate(f, [start, start + 6], [0, 1], clamp),
      }}
    >
      {k.label}
    </div>
  );
};
