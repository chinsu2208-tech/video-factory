import type { Kind } from "../motion/signature";
import type { Shot } from "../motion/source";

/** Minh họa động cho thẻ tin (khi tin không có biểu đồ) */
export type Visual =
  | "conveyor" // kiện hàng trên băng chuyền: vận chuyển, kho
  | "receipt" // hóa đơn từ máy in: hóa đơn điện tử, kê khai
  | "coins-in" // xu rơi vào ví: hoàn tiền, trợ giá, giảm phí
  | "coins-out" // xu bay khỏi ví: tăng phí, tăng thuế
  | "stamp" // văn bản đóng dấu: luật, nghị định, thông tư mới
  | "cart" // giỏ hàng: chính sách sàn, mùa sale
  | "trend-up"
  | "trend-down"
  | "bell" // tin khẩn
  | "bulb"; // cơ hội

export type Chart =
  | { type: "bars"; items: { label: string; value: number; display?: string }[] }
  | { type: "donut"; items: { label: string; value: number }[] }
  | { type: "price"; from: string; to: string; label?: string; up?: boolean }
  | { type: "counter"; to: number; decimals?: number; prefix?: string; suffix?: string; label?: string };

export type NewsItem = {
  kind: Kind; // urgent | opportunity | cost | policy | info
  title: string; // dùng **từ khóa** để highlight, dưới ~12 chữ
  affects: string; // Ảnh hưởng ai — có thể có **từ khóa**
  action: string; // Cần làm gì — có thể có **từ khóa**
  source: string; // tên văn bản / nguồn
  visual?: Visual; // không ghi thì tự chọn theo kind
  chart?: Chart; // có biểu đồ thì thay cho minh họa
  quote?: string; // trích văn bản — hiện kiểu máy đánh chữ (thay cho minh họa)
  shot?: Shot; // ảnh chụp bài báo / văn bản / bài đăng thật — ưu tiên cao nhất ở vùng minh họa
  pop?: string; // chữ nhấn kiểu Word Pop: "6%", "31/01"
};

export type Episode = {
  date: string; // "Thứ Hai, 23/11/2026"
  sample?: boolean; // true: hiện nhãn BẢN MẪU
  ticker: string[];
  news: NewsItem[]; // nên 3 tin
  number: {
    to: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    label: string;
    source: string;
    price?: { from: string; to: string; label?: string; up?: boolean };
  };
  deadline: { day: number; month: string; daysLeft: number; label: string };
  todo: string[];
  cta: string;
};
