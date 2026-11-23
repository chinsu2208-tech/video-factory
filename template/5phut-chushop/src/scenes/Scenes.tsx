import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BOX, C, clamp } from "../brand";
import type { Episode, NewsItem, Visual } from "../data/types";
import { CalendarFlip, CartMove, ChecklistTick, CoinWallet, ConveyorBox, ReceiptPrinter, StampDoc, TrendChart } from "../motion/icons";
import { BarCompare, Countdown, DonutChart, NumberCounter, PriceTransition } from "../motion/numbers";
import { KindChip, OpportunityBulb, UrgentBell, UrgentFrame } from "../motion/signature";
import { KineticTitle, NewsTicker, RichText, Typewriter, WordPop } from "../motion/text";
import { ScreenshotCard } from "../motion/source";
import { CardFlip, Push, SpringIn, Swipe } from "../motion/transitions";
import { At, Bg, Card, Logo, Pill, SampleTag } from "./parts";

// ---------- Thời lượng cảnh (frame, 30fps) ----------
export const DUR = {
  intro: 105,
  news: 300,
  number: 180,
  deadline: 150,
  todo: (n: number) => 70 + n * 24 + 50,
  outro: 120,
};

// ---------- INTRO ----------
export const Intro: React.FC<{ ep: Episode }> = ({ ep }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: f, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <Bg>
      {ep.sample ? <SampleTag /> : null}
      <At y={300}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ scale: `${logo}`, rotate: `${interpolate(logo, [0, 1], [-20, 0])}deg` }}>
            <Logo size={150} />
          </div>
          <div style={{ opacity: interpolate(f, [8, 16], [0, 1], clamp) }}>
            <div style={{ color: C.white, fontWeight: 900, fontSize: 64, lineHeight: 1 }}>5 PHÚT</div>
            <div style={{ color: C.flame, fontWeight: 900, fontSize: 64, lineHeight: 1.05 }}>CHỦ SHOP</div>
          </div>
        </div>
      </At>
      <At y={520}>
        <div style={{ color: C.muted, fontSize: 40, fontWeight: 600, opacity: interpolate(f, [14, 22], [0, 1], clamp) }}>{ep.date}</div>
      </At>
      <At y={620}>
        <KineticTitle text={`**${ep.news.length} tin** chủ shop cần biết sáng nay`} start={18} size={96} />
      </At>
      <At y={900}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {ep.news.map((n, i) => (
            <SpringIn key={i} start={34 + i * 6} from="left">
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ color: C.flame, fontSize: 44, fontWeight: 900, width: 70 }}>0{i + 1}</div>
                <KindChip kind={n.kind} start={34 + i * 6} />
              </div>
            </SpringIn>
          ))}
        </div>
      </At>
      <At y={1330}>
        <SpringIn start={30}>
          <NewsTicker items={ep.ticker} />
        </SpringIn>
      </At>
    </Bg>
  );
};

// ---------- Minh họa theo loại tin ----------
const defaultVisual: Record<string, Visual> = {
  urgent: "bell",
  opportunity: "bulb",
  cost: "coins-out",
  policy: "stamp",
  info: "cart",
  todo: "receipt",
};

const VisualBlock: React.FC<{ item: NewsItem; start: number }> = ({ item, start }) => {
  if (item.shot) return <ScreenshotCard shot={item.shot} start={start - 10} />;
  if (item.chart) {
    const c = item.chart;
    if (c.type === "bars") return <BarCompare items={c.items} start={start} />;
    if (c.type === "donut") return <DonutChart items={c.items} start={start} />;
    if (c.type === "price") return <PriceTransition from={c.from} to={c.to} label={c.label} up={c.up ?? true} start={start} />;
    if (c.type === "counter")
      return (
        <div>
          <NumberCounter to={c.to} decimals={c.decimals} prefix={c.prefix} suffix={c.suffix} start={start} size={220} />
          {c.label ? <div style={{ color: C.muted, fontSize: 38, fontWeight: 700, marginTop: 8 }}>{c.label}</div> : null}
        </div>
      );
  }
  if (item.quote) {
    return (
      <div style={{ borderLeft: `8px solid ${C.flame}`, paddingLeft: 30, borderRadius: 0 }}>
        <Typewriter text={`“${item.quote}”`} start={start} size={40} />
      </div>
    );
  }
  const v = item.visual ?? defaultVisual[item.kind];
  const map: Record<Visual, React.ReactNode> = {
    conveyor: <ConveyorBox start={start} size={480} />,
    receipt: <ReceiptPrinter start={start} size={430} />,
    "coins-in": <CoinWallet start={start} size={460} />,
    "coins-out": <CoinWallet start={start} size={460} out />,
    stamp: <StampDoc start={start} size={440} stampText="MỚI" />,
    cart: <CartMove start={start} size={480} />,
    "trend-up": <TrendChart start={start} size={480} />,
    "trend-down": <TrendChart start={start} size={480} down />,
    bell: <UrgentBell start={start} size={300} />,
    bulb: <OpportunityBulb start={start} size={320} />,
  };
  return <SpringIn start={start} from="scale" style={{ transformOrigin: "left center" }}>{map[v]}</SpringIn>;
};

// ---------- THẺ TIN ----------
export const NewsScene: React.FC<{ item: NewsItem; index: number; total: number; sample?: boolean }> = ({ item, index, total, sample }) => {
  const f = useCurrentFrame();
  const urgent = item.kind === "urgent";
  return (
    <>
      <Swipe dur={DUR.news}>
        <Bg>
          {sample ? <SampleTag /> : null}
          <At y={262}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Pill text={`TIN 0${index + 1}/0${total}`} bg={C.white} color={C.night} />
              <KindChip kind={item.kind} start={4} />
            </div>
          </At>
          <At y={362}>
            <KineticTitle text={item.title} start={8} size={80} />
          </At>
          <At y={650} style={{ height: 330, display: "flex", alignItems: "center" }}>
            <VisualBlock item={item} start={40} />
          </At>
          {item.pop ? (
            <At x={BOX.left + BOX.width - 360} y={item.shot ? 900 : 640} w={360} style={{ display: "flex", justifyContent: "flex-end", zIndex: 2 }}>
              <WordPop text={item.pop} start={86} size={64} bg={urgent || item.kind === "cost" ? C.alert : C.flame} />
            </At>
          ) : null}
          <At y={1000}>
            <SpringIn start={110}>
              <Card label="ẢNH HƯỞNG AI">
                <RichText text={item.affects} start={122} />
              </Card>
            </SpringIn>
          </At>
          <At y={1196}>
            <SpringIn start={150}>
              <Card label="CẦN LÀM GÌ" bg={C.alert} labelColor={C.white}>
                <RichText text={item.action} start={164} color={C.night} />
              </Card>
            </SpringIn>
          </At>
          <At y={986} style={{ textAlign: "right", display: item.shot ? "none" : "block" }}>
            <div style={{ color: C.muted, fontSize: 24, fontWeight: 500, opacity: interpolate(f, [60, 70], [0, 1], clamp), marginTop: -34 }}>
              Nguồn: {item.source}
            </div>
          </At>
        </Bg>
      </Swipe>
      {urgent ? <UrgentFrame /> : null}
    </>
  );
};

// ---------- CON SỐ HÔM NAY ----------
export const NumberScene: React.FC<{ ep: Episode }> = ({ ep }) => {
  const n = ep.number;
  return (
    <CardFlip dur={DUR.number}>
      <Bg>
        {ep.sample ? <SampleTag /> : null}
        <At y={262}>
          <Pill text="CON SỐ HÔM NAY" bg={C.alert} />
        </At>
        <At y={380}>
          <NumberCounter to={n.to} decimals={n.decimals} prefix={n.prefix} suffix={n.suffix} start={10} />
        </At>
        <At y={710}>
          <div style={{ color: C.white, fontSize: 58, fontWeight: 800, lineHeight: 1.25 }}>
            <RichText text={n.label} start={56} />
          </div>
        </At>
        {n.price ? (
          <At y={930}>
            <PriceTransition from={n.price.from} to={n.price.to} label={n.price.label} up={n.price.up ?? true} start={80} />
          </At>
        ) : null}
        <At y={1300}>
          <Pill text={`Nguồn: ${n.source}`} bg={C.card} color={C.muted} start={70} />
        </At>
      </Bg>
    </CardFlip>
  );
};

// ---------- HẠN CHÓT ----------
export const DeadlineScene: React.FC<{ ep: Episode }> = ({ ep }) => {
  const d = ep.deadline;
  return (
    <Push dur={DUR.deadline}>
      <Bg>
        {ep.sample ? <SampleTag /> : null}
        <At y={262}>
          <Pill text="HẠN CHÓT" bg={C.alert} />
        </At>
        <At y={380} w={420}>
          <CalendarFlip day={d.day} month={d.month} start={8} size={400} />
        </At>
        <At y={900}>
          <Countdown days={d.daysLeft} start={40} />
        </At>
        <At y={1150}>
          <div style={{ color: C.white, fontSize: 54, fontWeight: 800, lineHeight: 1.3 }}>
            <RichText text={d.label} start={80} />
          </div>
        </At>
      </Bg>
    </Push>
  );
};

// ---------- VIỆC CẦN LÀM ----------
export const TodoScene: React.FC<{ ep: Episode }> = ({ ep }) => (
  <Push dur={DUR.todo(ep.todo.length)}>
    <Bg>
      {ep.sample ? <SampleTag /> : null}
      <At y={262}>
        <Pill text="VIỆC CẦN LÀM HÔM NAY" />
      </At>
      <At y={400}>
        <ChecklistTick items={ep.todo} start={14} every={24} />
      </At>
    </Bg>
  </Push>
);

// ---------- KẾT ----------
export const Outro: React.FC<{ ep: Episode }> = ({ ep }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: f, fps, config: { damping: 10, stiffness: 150 } });
  return (
    <Bg>
      <At y={360} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ scale: `${logo}` }}>
          <Logo size={220} />
        </div>
      </At>
      <At y={660} style={{ textAlign: "center" }}>
        <div style={{ color: C.white, fontSize: 64, fontWeight: 800, lineHeight: 1.3, opacity: interpolate(f, [10, 20], [0, 1], clamp) }}>
          Muốn nhận <RichText text="**bản tin đầy đủ**" start={22} />
          <br />mỗi sáng?
        </div>
      </At>
      <At y={1010} style={{ display: "flex", justifyContent: "center" }}>
        <WordPop text={ep.cta} start={40} size={72} />
      </At>
      <At y={1200} style={{ textAlign: "center" }}>
        <div style={{ color: C.muted, fontSize: 34, fontWeight: 600, opacity: interpolate(f, [50, 60], [0, 1], clamp) }}>
          5 Phút Chủ Shop · mỗi sáng 7 giờ
        </div>
      </At>
    </Bg>
  );
};
