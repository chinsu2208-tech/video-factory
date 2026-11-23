// NHÓM 3 · MOTION ICON VÀ MINH HỌA (vẽ bằng SVG, nét trắng + điểm nhấn cam/đỏ)
// ConveyorBox · ReceiptPrinter · CoinWallet · CalendarFlip · StampDoc · CartMove · TrendChart · ChecklistTick
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, clamp } from "../brand";

const S = { stroke: C.white, strokeWidth: 8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ease = Easing.bezier(0.16, 1, 0.3, 1);

type P = { start?: number; size?: number };

const Frame: React.FC<{ size: number; children: React.ReactNode; vb?: string }> = ({ size, children, vb = "0 0 400 300" }) => (
  <svg width={size} height={(size * 3) / 4} viewBox={vb} style={{ overflow: "visible" }}>
    {children}
  </svg>
);

/** Kiện hàng trượt trên băng chuyền */
export const ConveyorBox: React.FC<P> = ({ start = 0, size = 520 }) => {
  const f = useCurrentFrame() - start;
  const boxes = [0, 1, 2];
  return (
    <Frame size={size}>
      <rect x={20} y={200} width={360} height={36} rx={18} {...S} />
      {[50, 110, 170, 230, 290, 350].map((x) => (
        <g key={x} transform={`rotate(${f * 12} ${x} 218)`}>
          <circle cx={x} cy={218} r={10} stroke={C.flame} strokeWidth={6} fill="none" />
          <line x1={x - 8} y1={218} x2={x + 8} y2={218} stroke={C.flame} strokeWidth={4} />
        </g>
      ))}
      {boxes.map((i) => {
        const x = ((f * 4 + i * 150) % 450) - 70;
        return (
          <g key={i} transform={`translate(${x} 110)`} opacity={interpolate(f, [0, 8], [0, 1], clamp)}>
            <rect x={0} y={0} width={86} height={86} rx={8} fill={C.flame} />
            <path d="M0 26h86M43 0v26" stroke={C.night} strokeWidth={6} />
          </g>
        );
      })}
      <path d="M30 260h340" stroke={C.cardLine} strokeWidth={6} />
    </Frame>
  );
};

/** Hóa đơn chạy ra từ máy in */
export const ReceiptPrinter: React.FC<P> = ({ start = 0, size = 520 }) => {
  const f = useCurrentFrame() - start;
  const len = interpolate(f, [6, 50], [0, 170], { ...clamp, easing: Easing.out(Easing.quad) });
  const shake = f < 50 && f > 6 ? Math.sin(f * 2.4) * 1.5 : 0;
  return (
    <Frame size={size} vb="0 0 400 340">
      <g transform={`translate(${shake} 0)`}>
        <rect x={90} y={30} width={220} height={90} rx={18} {...{ ...S, fill: C.card }} />
        <rect x={120} y={100} width={160} height={14} rx={7} fill={C.night} />
        <circle cx={270} cy={62} r={9} fill={C.flame} opacity={Math.floor(f / 6) % 2 ? 1 : 0.3} />
      </g>
      <clipPath id="paper">
        <rect x={120} y={106} width={160} height={len} />
      </clipPath>
      <g clipPath="url(#paper)">
        <g transform={`translate(0 ${len - 170})`}>
          <path d="M130 106h140v160l-14 10-14-10-14 10-14-10-14 10-14-10-14 10-14-10-14 10-14-10z" fill={C.white} />
          {[136, 160, 184, 208].map((y, i) => (
            <rect key={y} x={146} y={y} width={i === 3 ? 60 : 108} height={10} rx={5} fill={i === 3 ? C.flame : "#BDBDBD"} />
          ))}
          <rect x={146} y={232} width={108} height={14} rx={7} fill={C.alert} />
        </g>
      </g>
    </Frame>
  );
};

/** Đồng xu rơi vào ví (out=true: xu bay ra khỏi ví — dùng cho "Chi phí tăng") */
export const CoinWallet: React.FC<P & { out?: boolean }> = ({ start = 0, size = 520, out = false }) => {
  const f = useCurrentFrame() - start;
  return (
    <Frame size={size}>
      {[0, 1, 2, 3].map((i) => {
        const s = i * 9;
        const t = interpolate(f, [s, s + 24], [0, 1], { ...clamp, easing: out ? Easing.out(Easing.quad) : Easing.in(Easing.quad) });
        const y = out ? interpolate(t, [0, 1], [150, -40 - i * 10]) : interpolate(t, [0, 1], [-60, 150]);
        const x = out ? 200 + (i - 1.5) * 70 * t : 200 + (i - 1.5) * 8;
        const op = out ? interpolate(t, [0, 0.8, 1], [1, 1, 0]) : interpolate(t, [0, 0.9, 1], [1, 1, 0]);
        return (
          <g key={i} opacity={op} transform={`translate(${x} ${y}) scale(${Math.abs(Math.cos((f + i * 7) / 5)) * 0.5 + 0.5} 1)`}>
            <circle r={30} fill={C.gold} />
            <text y={11} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.night}>
              đ
            </text>
          </g>
        );
      })}
      <rect x={95} y={140} width={210} height={130} rx={22} fill={out ? C.alert : C.flame} />
      <rect x={235} y={180} width={90} height={50} rx={14} fill={C.night} />
      <circle cx={262} cy={205} r={9} fill={C.gold} />
    </Frame>
  );
};

/** Lịch lật đến ngày hết hạn */
export const CalendarFlip: React.FC<P & { day: number; month: string }> = ({ start = 0, size = 420, day, month }) => {
  const f = useCurrentFrame() - start;
  const steps = 8;
  const t = interpolate(f, [0, 40], [0, steps], { ...clamp, easing: Easing.out(Easing.quad) });
  const idx = Math.min(steps, Math.floor(t));
  const shown = Math.max(1, day - (steps - idx));
  const flip = t - Math.floor(t);
  return (
    <div style={{ width: size, fontFamily: FONT, perspective: 900 }}>
      <div style={{ background: C.alert, borderRadius: "28px 28px 0 0", color: C.white, fontWeight: 800, fontSize: size * 0.11, textAlign: "center", padding: "18px 0" }}>
        {month}
      </div>
      <div
        style={{
          background: C.white,
          borderRadius: "0 0 28px 28px",
          color: C.night,
          fontWeight: 900,
          fontSize: size * 0.42,
          lineHeight: 1,
          textAlign: "center",
          padding: "34px 0 40px",
          rotate: idx < steps ? `1 0 0 ${interpolate(flip, [0, 1], [-70, 0])}deg` : "1 0 0 0deg",
          transformOrigin: "top center",
        }}
      >
        {shown}
      </div>
    </div>
  );
};

/** Văn bản mở ra + đóng dấu */
export const StampDoc: React.FC<P & { stampText?: string }> = ({ start = 0, size = 520, stampText = "MỚI" }) => {
  const f = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const open = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const hit = spring({ frame: f - 22, fps, config: { damping: 11, stiffness: 260 } });
  const shake = f >= 26 && f < 34 ? Math.sin(f * 3) * 4 : 0;
  return (
    <Frame size={size} vb="0 0 400 320">
      <g transform={`translate(${shake} 0)`}>
        <g transform={`translate(110 20) scale(1 ${open})`}>
          <path d="M0 0h140l40 40v240H0z" fill={C.white} />
          <path d="M140 0v40h40" fill="#DADADA" />
          {[70, 100, 130, 160, 190].map((y, i) => (
            <rect key={y} x={24} y={y} width={i % 2 ? 100 : 132} height={10} rx={5} fill="#BDBDBD" />
          ))}
          <rect x={24} y={34} width={90} height={16} rx={8} fill={C.night} />
        </g>
        <g
          transform={`translate(250 ${interpolate(hit, [0, 1], [-120, 220])}) rotate(-14) scale(${interpolate(hit, [0, 1], [1.4, 1])})`}
          opacity={interpolate(f, [20, 24], [0, 1], clamp)}
        >
          <rect x={-90} y={-38} width={180} height={76} rx={14} fill="none" stroke={C.alert} strokeWidth={8} />
          <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.alert}>
            {stampText}
          </text>
        </g>
      </g>
    </Frame>
  );
};

/** Giỏ hàng di chuyển, bánh xe quay, có vệt tốc độ */
export const CartMove: React.FC<P> = ({ start = 0, size = 520 }) => {
  const f = useCurrentFrame() - start;
  const x = interpolate(f, [0, 30], [-160, 120], { ...clamp, easing: ease }) + Math.sin(f / 6) * 4;
  return (
    <Frame size={size}>
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={x - 30 - i * 10}
          x2={x + 10 - i * 30}
          y1={120 + i * 34}
          y2={120 + i * 34}
          stroke={C.flame}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={interpolate(f, [0, 30, 40], [1, 1, 0.3], clamp)}
        />
      ))}
      <g transform={`translate(${x} 60)`}>
        <path d="M0 20h40l30 120h120l26-86H56" {...S} strokeWidth={12} />
        <rect x={70} y={70} width={44} height={40} rx={6} fill={C.flame} />
        <rect x={120} y={60} width={44} height={50} rx={6} fill={C.alert} />
        {[92, 172].map((cx) => (
          <g key={cx} transform={`rotate(${f * 14} ${cx} 176)`}>
            <circle cx={cx} cy={176} r={18} fill={C.white} />
            <line x1={cx - 12} y1={176} x2={cx + 12} y2={176} stroke={C.night} strokeWidth={5} />
          </g>
        ))}
      </g>
    </Frame>
  );
};

/** Biểu đồ tăng/giảm: đường kẻ tự vẽ, điểm cuối nhấp nháy */
export const TrendChart: React.FC<P & { down?: boolean }> = ({ start = 0, size = 520, down = false }) => {
  const f = useCurrentFrame() - start;
  const pts = down ? [[30, 60], [110, 110], [180, 90], [260, 170], [360, 230]] : [[30, 230], [110, 180], [180, 200], [260, 110], [360, 50]];
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const len = 520;
  const p = interpolate(f, [0, 34], [0, 1], { ...clamp, easing: ease });
  const end = pts[pts.length - 1];
  const col = down ? C.alert : C.flame;
  return (
    <Frame size={size}>
      {[60, 120, 180, 240].map((y) => (
        <line key={y} x1={20} x2={380} y1={y} y2={y} stroke={C.cardLine} strokeWidth={3} />
      ))}
      <path d={d} stroke={col} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <circle cx={end[0]} cy={end[1]} r={interpolate(f % 20, [0, 20], [16, 30])} fill={col} opacity={p >= 1 ? interpolate(f % 20, [0, 20], [0.6, 0]) : 0} />
      <circle cx={end[0]} cy={end[1]} r={16} fill={col} opacity={p >= 1 ? 1 : 0} />
    </Frame>
  );
};

/** Checklist tự động tích từng mục */
export const ChecklistTick: React.FC<P & { items: string[]; every?: number; width?: number }> = ({ start = 0, items, every = 22, width = 880 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 22, fontFamily: FONT }}>
      {items.map((it, i) => {
        const s = start + i * every;
        const appear = spring({ frame: frame - s, fps, config: { damping: 16, stiffness: 160 } });
        const tick = interpolate(frame, [s + 10, s + 20], [0, 1], { ...clamp, easing: ease });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              background: C.card,
              border: `2px solid ${tick >= 1 ? C.flame : C.cardLine}`,
              borderRadius: 26,
              padding: "26px 30px",
              opacity: appear,
              translate: `${interpolate(appear, [0, 1], [80, 0])}px 0px`,
            }}
          >
            <svg width={64} height={64} viewBox="0 0 64 64" style={{ flex: "none" }}>
              <rect x={4} y={4} width={56} height={56} rx={14} fill={tick > 0 ? C.flame : "none"} stroke={tick > 0 ? C.flame : C.muted} strokeWidth={5} />
              <path d="M18 33l10 10 18-20" stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - tick)} />
            </svg>
            <div style={{ color: C.white, fontSize: 44, fontWeight: 700, lineHeight: 1.25 }}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};
