// Thư viện motion: chiếu lần lượt 25 component, mỗi cái 2,5 giây, kèm tên để chọn dùng.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { BOX, C, FONT, loadBrandFonts } from "./brand";
import { CalendarFlip, CartMove, ChecklistTick, CoinWallet, ConveyorBox, ReceiptPrinter, StampDoc, TrendChart } from "./motion/icons";
import { BarCompare, Countdown, DonutChart, NumberCounter, PriceTransition } from "./motion/numbers";
import { OpportunityBulb, UrgentBell, UrgentFrame } from "./motion/signature";
import { KineticTitle, NewsTicker, RichText, Typewriter, WordPop } from "./motion/text";
import { CardFlip, Push, ShapeWipe, SpringIn, Swipe } from "./motion/transitions";

loadBrandFonts();

export const EACH = 75;

const Demo: React.FC<{ child: React.ReactNode }> = ({ child }) => <>{child}</>;
const Box: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: BOX.left, top: 640, width: BOX.width }}>{children}</div>
);
const Sample: React.FC = () => (
  <div style={{ position: "absolute", left: BOX.left, top: 640, width: BOX.width, height: 600, background: C.card, borderRadius: 28, padding: 40, color: C.white, fontSize: 56, fontWeight: 800 }}>
    Thẻ tin mẫu
  </div>
);

export const ITEMS: [string, string, React.ReactNode][] = [
  ["1 · Chữ", "Kinetic Typography", <Box><KineticTitle text="Từ 2026 hộ kinh doanh **bỏ thuế khoán**" size={80} /></Box>],
  ["1 · Chữ", "Text Highlight", <Box><div style={{ color: C.white, fontSize: 56, fontWeight: 700, lineHeight: 1.4 }}><RichText text="Chuẩn bị **kê khai theo doanh thu thật** và giữ đủ **hóa đơn**" start={6} gap={16} /></div></Box>],
  ["1 · Chữ", "Typewriter", <Box><Typewriter text="“Hộ kinh doanh nộp thuế theo phương pháp kê khai…”" start={4} /></Box>],
  ["1 · Chữ", "Word Pop", <Box><WordPop text="6%" start={6} size={160} bg={C.alert} /></Box>],
  ["1 · Chữ", "News Ticker", <Box><NewsTicker items={["TikTok Shop thu phí xử lý 3.000đ/đơn", "Hạn tờ khai quý 4: 31/01/2027"]} speed={8} /></Box>],
  ["2 · Số liệu", "Number Counter", <Box><NumberCounter to={17} suffix="%" start={4} /></Box>],
  ["2 · Số liệu", "Animated Bar Chart", <Box><BarCompare items={[{ label: "Trước 09/05", value: 5, display: "5%" }, { label: "Từ 09/05/2026", value: 6, display: "6%" }]} start={4} /></Box>],
  ["2 · Số liệu", "Donut Chart", <Box><DonutChart items={[{ label: "Phí sàn", value: 20 }, { label: "Quảng cáo", value: 15 }, { label: "Vận hành", value: 10 }, { label: "Lãi", value: 20 }]} start={4} /></Box>],
  ["2 · Số liệu", "Price Transition", <Box><PriceTransition from="5%" to="6%" label="Phí giao dịch" start={4} /></Box>],
  ["2 · Số liệu", "Countdown", <Box><Countdown days={69} start={4} /></Box>],
  ["3 · Minh họa", "Kiện hàng trên băng chuyền", <Box><ConveyorBox size={600} /></Box>],
  ["3 · Minh họa", "Hóa đơn từ máy in", <Box><ReceiptPrinter size={560} /></Box>],
  ["3 · Minh họa", "Đồng xu rơi vào ví", <Box><CoinWallet size={580} /></Box>],
  ["3 · Minh họa", "Lịch lật đến hạn", <Box><CalendarFlip day={31} month="THÁNG 1 · 2027" size={420} /></Box>],
  ["3 · Minh họa", "Văn bản đóng dấu", <Box><StampDoc size={560} /></Box>],
  ["3 · Minh họa", "Giỏ hàng di chuyển", <Box><CartMove size={600} /></Box>],
  ["3 · Minh họa", "Biểu đồ tăng giảm", <Box><TrendChart size={600} /></Box>],
  ["3 · Minh họa", "Checklist tự tích", <Box><ChecklistTick items={["Xuất báo cáo lãi SKU", "Rà hóa đơn đầu vào"]} start={4} every={20} /></Box>],
  ["4 · Chuyển cảnh", "Push", <Push dur={EACH}><Sample /></Push>],
  ["4 · Chuyển cảnh", "Card Flip", <CardFlip dur={EACH}><Sample /></CardFlip>],
  ["4 · Chuyển cảnh", "Swipe", <Swipe dur={EACH}><Sample /></Swipe>],
  ["4 · Chuyển cảnh", "Shape Wipe", <><Sample /><ShapeWipe duration={40} /></>],
  ["4 · Chuyển cảnh", "Spring Animation", <Box><SpringIn start={6} from="scale"><div style={{ width: 300, height: 300, borderRadius: 40, background: C.flame }} /></SpringIn></Box>],
  ["5 · Nhận diện", "Tin khẩn: chuông + viền đỏ", <><Box><UrgentBell size={360} /></Box><UrgentFrame /></>],
  ["5 · Nhận diện", "Cơ hội: bóng đèn + mũi tên xanh", <Box><OpportunityBulb size={420} /></Box>],
];

const Label: React.FC<{ group: string; name: string; i: number }> = ({ group, name, i }) => {
  useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: BOX.left, top: 280, width: BOX.width, fontFamily: FONT }}>
      <div style={{ color: C.flame, fontSize: 34, fontWeight: 800 }}>
        {String(i + 1).padStart(2, "0")}/25 · NHÓM {group}
      </div>
      <div style={{ color: C.white, fontSize: 72, fontWeight: 800, marginTop: 10, lineHeight: 1.15 }}>{name}</div>
    </div>
  );
};

export const MotionLibrary: React.FC = () => (
  <AbsoluteFill style={{ background: C.night, fontFamily: FONT }}>
    {ITEMS.map(([g, n, el], i) => (
      <Sequence key={n} name={n} from={i * EACH} durationInFrames={EACH} layout="absolute-fill">
        <Demo child={el} />
        <Label group={g} name={n} i={i} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
