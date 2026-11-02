#!/usr/bin/env bash
# Bỏ tiếng, ghép clip + bản đảo ngược (boomerang) để cảnh dài hơn clip gốc. Dùng: scripts/prep_clip.sh in.mov public/clips/ten.mp4
ffmpeg -v error -y -i "$1" -an -filter_complex "[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" -map "[v]" -c:v libx264 -crf 17 -pix_fmt yuv420p -r 30 "$2"
