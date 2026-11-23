import type { Labels } from "./types";

// Nhãn theo ngôn ngữ. Thêm ngôn ngữ mới: thêm một khối ở đây, hoặc ghi đè trong episode.json → "labels".
export const LABELS: Record<string, Labels> = {
  en: {
    breaking: "BREAKING",
    tool: "TOOL UPDATE",
    battle: "AI BATTLE",
    usecase: "USE CASE",
    tip: "AI TIP",
    why: "WHY IT MATTERS",
    try: "TRY THIS",
    today: "Today's **{n} AI moves**",
    cta: "Comment BRIEF",
    ctaLine: "Get the full brief every morning",
    sample: "SAMPLE",
  },
  vi: {
    breaking: "TIN NÓNG",
    tool: "CẬP NHẬT CÔNG CỤ",
    battle: "SO KÈ AI",
    usecase: "ỨNG DỤNG",
    tip: "MẸO AI",
    why: "VÌ SAO QUAN TRỌNG",
    try: "THỬ NGAY",
    today: "Hôm nay có **{n} tin AI**",
    cta: "Bình luận BẢN TIN",
    ctaLine: "Nhận bản tin đầy đủ mỗi sáng",
    sample: "BẢN MẪU",
  },
};

export const labelsFor = (lang: string, over?: Partial<Labels>): Labels => ({ ...(LABELS[lang] ?? LABELS.en), ...(over ?? {}) });
