#!/usr/bin/env python3
"""Căn thời gian phụ đề theo giọng đọc.

Dùng:  python3 tools/align.py public/voice.mp3 script.txt --out src/captions.json [--max-words 4]

Ý tưởng: tiếng Việt mỗi chữ là một âm tiết, nên trong một đoạn nói liền, các chữ chia thời gian khá đều.
  1. Đo năng lượng giọng mỗi 10ms để biết đâu là có tiếng, đâu là nghỉ.
  2. Chia kịch bản thành các mệnh đề theo dấu câu (, . ? ! ; : …).
  3. Chọn (số mệnh đề - 1) chỗ nghỉ dài nhất trong giọng làm ranh giới mệnh đề.
  4. Trong từng mệnh đề, chia thời gian có tiếng cho từng chữ theo trọng số.
Kết quả: captions.json gồm words, phrases (cụm 2-4 chữ để hiện phụ đề) và cuts (gợi ý điểm cắt cảnh).
Kịch bản phải khớp lời đọc từng chữ. Nếu lời đọc lệch kịch bản thì thời gian sẽ lệch theo.
"""
import argparse, json, math, re, subprocess, sys
import numpy as np

SR = 16000
HOP = 0.01
WIN = 0.03


def load_pcm(path):
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def speech_mask(x):
    h, w = int(SR * HOP), int(SR * WIN)
    n = max(0, (len(x) - w) // h)
    idx = np.arange(w)[None, :] + (np.arange(n) * h)[:, None]
    e = np.sqrt(np.mean(x[idx] ** 2, axis=1))
    db = 20 * np.log10(e + 1e-9)
    hi = np.percentile(db, 95)
    thr = max(np.percentile(db, 10) + 6, hi - 28)
    m = db > thr
    # lấp khe ngắn < 80ms (khoảng nghỉ giữa âm tiết), bỏ nhiễu < 50ms
    return fill_runs(fill_runs(m, False, 8), True, 5)


def fill_runs(m, value, max_len):
    m = m.copy()
    i, n = 0, len(m)
    while i < n:
        j = i
        while j < n and m[j] == m[i]:
            j += 1
        if m[i] == value and (j - i) < max_len and i > 0 and j < n:
            m[i:j] = not value
        i = j
    return m


def runs(m):
    """[(start_idx, end_idx, is_speech)]"""
    out, i, n = [], 0, len(m)
    while i < n:
        j = i
        while j < n and m[j] == m[i]:
            j += 1
        out.append((i, j, bool(m[i])))
        i = j
    return out


def weight(tok):
    t = re.sub(r'[^\wÀ-ỹ]', '', tok, flags=re.UNICODE)
    digits = sum(c.isdigit() for c in t)
    if digits:
        return 2.0 + 0.6 * digits  # "169K" được đọc thành nhiều âm tiết
    if len(t) <= 4:
        return 1.0
    return 1.0 + 0.12 * (len(t) - 4)


def split_clauses(text):
    toks = text.split()
    clauses, cur = [], []
    for t in toks:
        cur.append(t)
        if re.search(r'[,.;:!?…]$', t):
            clauses.append(cur)
            cur = []
    if cur:
        clauses.append(cur)
    return clauses


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('audio')
    ap.add_argument('script')
    ap.add_argument('--out', default='src/captions.json')
    ap.add_argument('--max-words', type=int, default=4)
    ap.add_argument('--min-pause', type=float, default=0.22, help='chỗ nghỉ tối thiểu (giây) để coi là ranh giới mệnh đề')
    a = ap.parse_args()

    text = open(a.script, encoding='utf-8').read().strip()
    clauses = split_clauses(text)
    x = load_pcm(a.audio)
    m = speech_mask(x)
    rs = runs(m)
    speech = [(s, e) for s, e, v in rs if v]
    if not speech:
        sys.exit('Không thấy tiếng nói trong file audio.')
    t0, t1 = speech[0][0], speech[-1][1]  # cắt lặng đầu/cuối

    # trục thời gian chỉ gồm các khung có tiếng (bỏ qua mọi chỗ nghỉ)
    vidx = np.nonzero(m)[0]
    vidx = vidx[(vidx >= t0) & (vidx < t1)]
    V = len(vidx)

    # các chỗ nghỉ giữa lời nói, đổi sang vị trí trên trục có tiếng
    cand = []  # (vị trí trên trục có tiếng, độ dài nghỉ tính bằng khung 10ms)
    for (s_, e_, v_) in rs:
        if not v_ and s_ > t0 and e_ < t1 and (e_ - s_) * HOP >= a.min_pause:
            cand.append((int(np.searchsorted(vidx, s_)), e_ - s_))

    toks = [t for c in clauses for t in c]
    ws = np.array([weight(t) for t in toks])
    cumw = np.concatenate([[0], np.cumsum(ws)])
    total_w = cumw[-1]
    # ranh giới mệnh đề: vị trí lý thuyết theo trọng số, rồi hít vào chỗ nghỉ gần nhất
    tol = max(80, int(0.12 * V))
    anchors, prev, used, snapped = [0], 0, set(), 0
    ntok = 0
    for c in clauses[:-1]:
        ntok += len(c)
        target = cumw[ntok] / total_w * V
        best, best_score = None, None
        for vp, ln in cand:
            if vp > prev and vp not in used and abs(vp - target) <= tol:
                score = abs(vp - target) - 0.3 * ln
                if best_score is None or score < best_score:
                    best, best_score = vp, score
        if best is not None:
            used.add(best)
            snapped += 1
            anchors.append(best)
            prev = best
        else:
            anchors.append(max(prev + 1, int(target)))
            prev = anchors[-1]
    anchors.append(V)
    warn = None
    if len(clauses) > 1 and snapped < len(clauses) - 1:
        warn = (f'{len(clauses) - 1 - snapped}/{len(clauses) - 1} dấu ngắt trong kịch bản không khớp chỗ nghỉ của giọng '
                '(chia theo tỉ lệ). Nên kiểm tra lại mốc thời gian.')

    words, k0 = [], 0
    for j, c in enumerate(clauses):
        lo, hi = anchors[j], anchors[j + 1]
        w = ws[k0:k0 + len(c)]
        cw = np.concatenate([[0], np.cumsum(w)]) / w.sum()
        for k, tok in enumerate(c):
            i0 = vidx[min(V - 1, lo + int(cw[k] * (hi - lo)))]
            i1 = vidx[min(V - 1, max(lo + int(cw[k + 1] * (hi - lo)) - 1, lo))]
            words.append({'w': tok, 's': round(i0 * HOP, 3), 'e': round((i1 + 1) * HOP, 3)})
        k0 += len(c)
    exact = True

    # gom cụm phụ đề: trong từng mệnh đề, chia đều thành cụm <= max_words
    phrases, p = [], 0
    for toks in clauses:
        n = len(toks)
        k = max(1, math.ceil(n / a.max_words))
        size = n / k
        for q in range(k):
            lo, hi = round(q * size), round((q + 1) * size)
            seg = words[p + lo:p + hi]
            if seg:
                phrases.append({'text': ' '.join(w['w'] for w in seg), 's': seg[0]['s'], 'e': seg[-1]['e']})
        p += n

    # gợi ý điểm cắt cảnh: đầu mỗi cụm, gộp các cụm ngắn để mỗi cảnh >= 0.9s
    cuts, last = [0.0], 0.0
    for ph in phrases:
        if ph['s'] - last >= 0.9:
            cuts.append(ph['s'])
            last = ph['s']
    total = round(t1 * HOP + 0.3, 3)

    out = {'words': words, 'phrases': phrases, 'cuts': cuts, 'voiceEnd': round(t1 * HOP, 3), 'total': total,
           'warning': warn}
    json.dump(out, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{len(words)} chữ, {len(phrases)} cụm, {len(cuts)} điểm cắt gợi ý, lời đọc kết thúc ở {t1 * HOP:.2f}s -> {a.out}')
    if warn:
        print('CẢNH BÁO:', warn)


if __name__ == '__main__':
    main()
