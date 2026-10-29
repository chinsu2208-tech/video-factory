import { Config } from "@remotion/cli/config";

// Chrome: dùng bản có sẵn trong môi trường (không tải được từ remotion.media).
// Trên máy của Sếp: xoá dòng browserExecutable, Remotion tự tải Chrome.
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell");
Config.setConcurrency(2);
Config.setVideoImageFormat("jpeg");
