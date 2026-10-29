#!/usr/bin/env python3
"""Căn mệnh đề theo giọng bằng quy hoạch động: chọn các chỗ nghỉ làm ranh giới sao cho độ dài mỗi mệnh đề ~ số âm tiết.
Dùng: python3 tools/align_dp.py voice.mp3 script.txt out.json [--num 8]  (--num = số âm tiết khi giọng đọc một năm như 1991)"""
import sys, re, json, argparse, math
sys.path.insert(0, 'tools')
import numpy as np, align
ap = argparse.ArgumentParser(); ap.add_argument('audio'); ap.add_argument('script'); ap.add_argument('out')
ap.add_argument('--num', type=int, default=8); ap.add_argument('--minpause', type=float, default=0.10); ap.add_argument('--maxw', type=int, default=4)
a = ap.parse_args()
x = align.load_pcm(a.audio); m = align.speech_mask(x); rs = align.runs(m)
sp = [(s * .01, e * .01) for s, e, k in rs if k]
end = len(x) / align.SR
# ứng viên ranh giới = giữa các khe nghỉ >= minpause (cả điểm đầu và cuối)
cand = [(sp[0][0], 0.0)]
for (a0, b0), (a1, b1) in zip(sp, sp[1:]):
    g = a1 - b0
    if g >= a.minpause: cand.append(((b0 + a1) / 2, g))
cand.append((sp[-1][1] + 0.05, 0.0))
T = [c[0] for c in cand]; G = [c[1] for c in cand]
txt = open(a.script, encoding='utf-8').read().replace('\n', ' ')
clauses = [c for c in re.split(r'(?<=[,.:?!])\s+', txt) if c]
def syl(c): return sum(a.num if re.fullmatch(r'\d{4}', t.strip(',.:?!')) else 1 for t in c.split())
def band(c):
    toks=[t.strip(',.:?!') for t in c.split()]; y=sum(1 for t in toks if re.fullmatch(r'\d{4}',t)); b=len(toks)-y
    return b+3*y, b+a.num*y
w = [sum(band(c))/2 for c in clauses]; BD=[band(c) for c in clauses]; N = len(clauses); K = len(cand)
voiced = lambda t0, t1: sum(max(0, min(b, t1) - max(a_, t0)) for a_, b in sp)
rate = voiced(T[0], T[-1]) / sum(w)       # giây có tiếng trên mỗi âm tiết
INF = 1e18
cost = np.full((N + 1, K), INF); back = np.zeros((N + 1, K), dtype=int); cost[0][0] = 0
LAM = 1.0
for i in range(1, N + 1):
    for j in range(1, K):
        best, bk = INF, 0
        for k in range(j):
            if cost[i - 1][k] >= INF: continue
            d = voiced(T[k], T[j])
            if d <= 0.05: continue
            lo, hi = BD[i - 1]; r_ = d / rate
            ratio = 0 if lo * 0.75 <= r_ <= hi * 1.35 else math.log(r_ / (lo * 0.75)) if r_ < lo * 0.75 else math.log(r_ / (hi * 1.35))
            endp = clauses[i - 1][-1] in '.?!:'
            c = cost[i - 1][k] + ratio * ratio * 1.5 + (math.log(max(r_, .01) / w[i - 1]) ** 2) * 0.35 - (LAM * 1.6 if endp else LAM) * min(G[j], 0.9) * (1 if i < N else 0)
            if c < best: best, bk = c, k
        cost[i][j], back[i][j] = best, bk
j = K - 1; path = [j]
for i in range(N, 0, -1): j = back[i][j]; path.append(j)
path = path[::-1]
bt = [T[p] for p in path]
res = []
for i, c in enumerate(clauses):
    t0, t1 = bt[i], bt[i + 1]
    toks = c.split(); ws = [a.num if re.fullmatch(r'\d{4}', t.strip(',.:?!')) else 1 for t in toks]
    vt0, vt1 = voiced(0, t0), voiced(0, t1); tot = sum(ws); acc = 0; words = []
    def inv(v):
        c_ = 0
        for a_, b in sp:
            if v <= c_ + (b - a_): return a_ + v - c_
            c_ += b - a_
        return sp[-1][1]
    for t, wt in zip(toks, ws):
        s_ = inv(vt0 + (vt1 - vt0) * acc / tot); acc += wt; e_ = inv(vt0 + (vt1 - vt0) * acc / tot)
        words.append({'text': t, 's': round(s_, 2), 'e': round(e_, 2)})
    res.append({'text': c, 's': round(words[0]['s'], 2), 'e': round(words[-1]['e'], 2), 'words': words, 'syl': w[i]})
phr = []
for r in res:
    ws = r['words']; n = len(ws); k = max(1, math.ceil(n / a.maxw)); per = math.ceil(n / k)
    for q in range(0, n, per):
        g = ws[q:q + per]; phr.append({'text': ' '.join(x_['text'] for x_ in g), 's': g[0]['s'], 'e': g[-1]['e']})
json.dump({'clauses': res, 'phrases': phr, 'voiceEnd': round(sp[-1][1], 2), 'total': round(end, 2), 'cost': float(cost[N][K - 1])}, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('num', a.num, 'cost', round(float(cost[N][K - 1]), 2))
for r in res: print(f"{r['s']:6.2f}-{r['e']:6.2f}  {r['syl']:4.1f}  {r['text'][:60]}")
