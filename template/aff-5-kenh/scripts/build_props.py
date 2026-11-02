#!/usr/bin/env python3
"""Tạo props Remotion từ spec: python3 scripts/build_props.py spec.json props/out.json
spec = {"voice": "SP5_kenhA.mp3", "clips": ["nutriaz1"], "clip_len": 10.1,
        "paras": ["câu 1", ...], "texts": [{"lead":..,"big":..,"bigSize":..,"line":..,"small":..}, ...]}
Mỗi đoạn script = 1 cảnh, thời lượng chia theo số ký tự để khớp độ dài voice. Cần ffprobe."""
import json, subprocess, sys
XF, PAD = 0.4, 0.8
CROPS = [{"scale": 1, "fx": .5, "fy": .5}, {"scale": 1.3, "fx": .3, "fy": .75}, {"scale": 1.15, "fx": .7, "fy": .4},
         {"scale": 1.35, "fx": .4, "fy": .85}, {"scale": 1.2, "fx": .6, "fy": .6}, {"scale": 1, "fx": .5, "fy": .5}]
spec = json.load(open(sys.argv[1], encoding="utf-8"))
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                     "public/voice/" + spec["voice"]]).decode()) - 0.15
paras, texts, clips = spec["paras"], spec["texts"], spec["clips"]
clip_len = spec.get("clip_len", 10)
chars = [len(p) for p in paras]; tot = sum(chars)
scenes = []
for i, (p, t) in enumerate(zip(paras, texts)):
    d = dur * chars[i] / tot
    sec = d + XF if i < len(paras) - 1 else d + PAD
    start = min(i * 1.5 % max(1.0, clip_len - sec - 0.1), clip_len - sec - 0.05)
    sc = {"src": {"type": "clip", "file": clips[i % len(clips)], "startSec": round(max(0, start), 2)},
          "sub": p, "sec": round(sec, 2), "crop": CROPS[i % len(CROPS)]}
    sc.update(t); scenes.append(sc)
json.dump({"scenes": scenes, "sceneSec": 2.6, "xfSec": XF, "voice": spec["voice"], "debug": False},
          open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("video", round(sum(s["sec"] for s in scenes) - (len(scenes) - 1) * XF, 2), "s | voice", round(dur + .15, 2), "s")
