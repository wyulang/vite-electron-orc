import { app, BrowserWindow, desktopCapturer, ipcMain, clipboard } from "electron";
const { execFile } = require('child_process');
const { createWorker } = require('tesseract.js');
import path from "node:path";
const sharp = require('sharp');
let isDev = process.env.npm_lifecycle_event == 'dev';
// import * as ocr from '@paddlejs-models/ocr';
// const orc = require('@paddlejs-models/ocr')
export default (win) => {

  ipcMain.handle('capture-image', (e, data) => {
    win.hide();
    let spawn = require("child_process").spawn;
    // let child = spawn("./ScreenCapture.exe")
    let child = spawn(path.join(__dirname, isDev ? "../electron/main/ScreenCapture.exe" : '../../db/ScreenCapture.exe'))
    return new Promise((resolve, reject) => {
      child.on("close", async (code) => {
        win.show();
        /// when code is:
        /// 0 undefined
        /// 1 quit by press close btn;
        /// 2 quit by press right mouse btn;
        /// 3 quit by press esc keyboard
        /// 4 quit when copy rgb color
        /// 5 quit when copy hex color
        /// 6 quit when save to file
        /// 7 quit when save to clipboard
        if (code == 7) {
          if (data.orc) {
            const OCR = require('paddleocrjson');
            let orcFile = path.join(__dirname, isDev ? "../PaddleOCR-json/PaddleOCR-json.exe" : '../../db/ScreenCapture.exe');
            let orcCwd = path.join(__dirname, isDev ? "../PaddleOCR-json" : '../../db/ScreenCapture.exe');
            let orc = new OCR(orcFile, [], { cwd: orcCwd }, false);

            orc.flush({ image_base64: clipboard.readImage().toDataURL().replace(/^data:image\/\w+;base64,/, '') }).then(res => {
              resolve({ image: clipboard.readImage().toDataURL(), text: res });
              orc.terminate();
            })
          } else if (data.sharp) {
            const buffer = Buffer.from(clipboard.readImage().toDataURL().replace(/^data:image\/\w+;base64,/, ""), 'base64');
            sharp(buffer)
              .png({ quality: 30,compressionLevel:9 })
              .tint({ r: 255, g: 255, b: 255 })
              .toBuffer((err, sdata, info) => {
                if (err) {
                  reject({ msg: '压缩图片时出错' + err })
                } else {
                  const compressedBase64 = sdata.toString('base64');
                  resolve({ image: 'data:image/png;base64,' + compressedBase64 })
                }
              })
              .toFile('demo.png')
          } else {
            resolve({ image: clipboard.readImage().toDataURL() });
          }
        } else {
          reject("user no capture image")
        }
      });
    })
  })
}


