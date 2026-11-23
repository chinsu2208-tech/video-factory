// Một "motion" = một hiệu ứng trong thư viện, AI chọn theo nội dung tin.
export type Motion =
  | { kind: "prompt"; prompt: string; output: string[] }
  | { kind: "neural" }
  | { kind: "battle"; a: string; b: string; rows: { label: string; a: number; b: number; unit?: string; lowerIsBetter?: boolean }[] }
  | { kind: "workflow"; steps: string[] }
  | { kind: "feature"; name: string; features: string[] }
  | { kind: "screen"; app: string; button: string; src?: string }
  | { kind: "beforeafter"; before: string[]; after: string[] }
  | { kind: "tokens"; text: string }
  | { kind: "ranking"; metric?: string; rows: { name: string; before: number; after: number }[] }
  | { kind: "cost"; from: number; to: number; unit?: string; label?: string }
  | { kind: "speed"; a: { name: string; seconds: number }; b: { name: string; seconds: number } }
  | { kind: "morph"; src?: string; label?: string }
  | { kind: "scan"; fields: { key: string; value: string }[] }
  | { kind: "agent"; tasks: string[] }
  // 3 motion nhận diện
  | { kind: "launch"; name: string; maker?: string }
  | { kind: "upgrade"; from: string; to: string; note?: string }
  | { kind: "aiworkflow"; steps: string[] };

export type SceneType = "breaking" | "tool" | "battle" | "usecase" | "tip";

export type Scene = {
  type: SceneType;
  maker?: string; // tên hãng hiển thị dạng chữ (không dùng logo hãng)
  title: string; // **từ khóa** để highlight, dưới 10 từ
  motion: Motion;
  note: string; // dòng ở thẻ dưới (Why it matters / Try this) — có thể có **từ khóa**
};

export type Labels = {
  breaking: string;
  tool: string;
  battle: string;
  usecase: string;
  tip: string;
  why: string;
  try: string;
  today: string; // "Today's {n} AI moves" — dùng {n}
  cta: string; // "Comment BRIEF"
  ctaLine: string; // dòng dưới CTA
  sample: string;
};

export type Episode = {
  lang: "en" | "vi" | string;
  date: string; // "MON · NOV 23"
  sample?: boolean;
  labels?: Partial<Labels>;
  scenes: Scene[];
};
