#!/usr/bin/env bash
# HYNEX SOUND IDENTITY — DRAFT v0.1 (tổng hợp bằng ffmpeg, chưa phải sound design chính thức)
# Ý tưởng: âm "bong bóng" tròn, sáng, vui như chấm lime ở logo. Thang âm Đô trưởng (C major).
set -e
OUT="$(dirname "$0")/../public/sfx"; mkdir -p "$OUT"
f() { ffmpeg -y -loglevel error "$@"; }
note() { # note freq t0 decay amp
  echo "($4)*gte(t,$2)*(sin(2*PI*$1*(t-$2))+0.25*sin(4*PI*$1*(t-$2)))*exp(-(t-$2)*$3)"
}
# logo: 4 nốt đi lên G5-B5-D6-G6 (mở đầu video, "chấm lime nảy lên")
f -f lavfi -i "aevalsrc='$(note 784 0 7 0.35)+$(note 988 0.11 7 0.35)+$(note 1175 0.22 7 0.35)+$(note 1568 0.33 5 0.4)':d=1.3:s=44100" -af "volume=0.9,afade=t=out:st=1.0:d=0.3" $OUT/logo.wav
# end: 3 nốt đi xuống nhẹ, kết thúc êm
f -f lavfi -i "aevalsrc='$(note 1568 0 8 0.3)+$(note 1175 0.12 8 0.3)+$(note 784 0.24 5 0.4)':d=1.1:s=44100" -af "afade=t=out:st=0.8:d=0.3" $OUT/end.wav
# pop: quét tần số lên nhanh (bong bóng nổ)
f -f lavfi -i "aevalsrc='sin(2*PI*(420*t+3200*t*t))*exp(-t*26)*0.8':d=0.2:s=44100" $OUT/pop.wav
# ding: chuông nhỏ báo thành công
f -f lavfi -i "aevalsrc='(sin(2*PI*1319*t)+0.4*sin(2*PI*2638*t)+0.2*sin(2*PI*3957*t))*exp(-t*6)*0.5':d=0.8:s=44100" $OUT/ding.wav
# tick: click ngắn (gõ phím, nút bấm)
f -f lavfi -i "aevalsrc='sin(2*PI*1800*t)*exp(-t*160)*0.7':d=0.06:s=44100" $OUT/tick.wav
# whoosh: nhiễu hồng lọc, chuyển cảnh
f -f lavfi -i "anoisesrc=d=0.5:c=pink:r=44100:a=0.6" -af "highpass=f=400,lowpass=f=3500,afade=t=in:d=0.18,afade=t=out:st=0.2:d=0.3,volume=3.2" $OUT/whoosh.wav
# swipe: whoosh ngắn, nhẹ hơn
f -f lavfi -i "anoisesrc=d=0.3:c=pink:r=44100:a=0.5" -af "highpass=f=800,lowpass=f=5000,afade=t=in:d=0.08,afade=t=out:st=0.1:d=0.2,volume=3.5" $OUT/swipe.wav
ls -la $OUT
