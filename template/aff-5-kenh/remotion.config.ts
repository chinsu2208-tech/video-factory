import {Config} from '@remotion/cli/config';
if (process.env.CHROME_PATH) Config.setBrowserExecutable(process.env.CHROME_PATH); // chỉ đặt khi cần (vd Linux server)
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setCrf(18);
