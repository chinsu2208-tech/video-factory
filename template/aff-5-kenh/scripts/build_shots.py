#!/usr/bin/env python3
"""python3 build_shots.py props/SP5-X.json(cũ, lấy paras+text) out.json clipA,clipB,clipC clip_len
Mỗi đoạn voice -> nhiều shot ngắn (~2-3.2s), xoay clip + crop; chữ lớn chỉ ở shot đầu của đoạn."""
import json, re, subprocess, sys
XF, PAD, TARGET = 0.4, 0.8, 2.8
old = json.load(open(sys.argv[1], encoding="utf-8")); clips = sys.argv[3].split(","); clip_len = float(sys.argv[4])
dur = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0","public/voice/"+old["voice"]]).decode()) - 0.15
CROPS = [dict(scale=1,fx=.5,fy=.5),dict(scale=1.3,fx=.3,fy=.7),dict(scale=1.15,fx=.7,fy=.4),dict(scale=1.4,fx=.4,fy=.85),dict(scale=1.2,fx=.6,fy=.6),dict(scale=1.5,fx=.5,fy=.3)]
paras=[s["sub"] for s in old["scenes"]]; texts=[{k:v for k,v in s.items() if k in("lead","big","bigSize","line","small")} for s in old["scenes"]]
tot=sum(len(p) for p in paras)
def split(p, n):
    parts=[x.strip() for x in re.split(r'(?<=[.!?])\s+',p) if x.strip()]
    while len(parts)<n:  # tách tiếp theo dấu phẩy
        i=max(range(len(parts)),key=lambda k:len(parts[k])); m=[x.start() for x in re.finditer(r', | và ',parts[i])]
        if not m: m=[x.start() for x in re.finditer(r' ',parts[i])]
        if len(parts[i])<28 or not m: break
        c=min(m,key=lambda x:abs(x-len(parts[i])/2)); a,b=parts[i][:c+1].strip(),parts[i][c+1:].strip()
        parts[i:i+1]=[a,b]
    while len(parts)>n and len(parts)>1:
        i=min(range(len(parts)-1),key=lambda k:len(parts[k])+len(parts[k+1])); parts[i:i+2]=[parts[i]+" "+parts[i+1]]
    return parts
scenes=[]; k=0; tot_shots=0
for pi,(p,t) in enumerate(zip(paras,texts)):
    d=dur*len(p)/tot; n=max(1,round(d/TARGET+0.3)); parts=split(p,n); cs=sum(len(x) for x in parts)
    for j,x in enumerate(parts):
        sd=d*len(x)/cs; last=(pi==len(paras)-1 and j==len(parts)-1)
        sec=sd+(PAD if last else XF)
        f=clips[k%len(clips)]; st=round(((k*1.7)%max(0.5,clip_len-sec-0.2)),2)
        sc={"src":{"type":"clip","file":f,"startSec":st},"sub":x,"sec":round(sec,2),"crop":CROPS[k%len(CROPS)]}
        if j==0: sc.update(t)
        scenes.append(sc); k+=1
json.dump({"scenes":scenes,"sceneSec":2.6,"xfSec":XF,"voice":old["voice"],"debug":False},open(sys.argv[2],"w",encoding="utf-8"),ensure_ascii=False,indent=1)
print(len(scenes),"shots; video",round(sum(s["sec"] for s in scenes)-(len(scenes)-1)*XF,2),"voice",round(dur+.15,2))
