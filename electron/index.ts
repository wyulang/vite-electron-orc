import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import log from 'electron-log/main';
import path from "node:path";
import './fanyi';
import './baidu';
import './tts';
let win: any = null;
// import log from 'electron-log/renderer';

// 当启动项目遇到Electron Security Warning (Insecure Content-Security-Policy)警告信息时
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// Electron 的硬件加速功能，在 win7 或者 Linux 系统上，容易出现黑屏或者卡死。禁用当前应用程序的硬件加速。
app.disableHardwareAcceleration();

// 为Windows 10+通知设置应用程序名称
if (process.platform === "win32") app.setAppUserModelId(app.getName());

// 限制只启动一个应用，防止多个实例
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
async function initWindow() {
  win = new BrowserWindow({
    width: 900,
    minWidth: 700,
    // minHeight: 650,
    height: 700,
    frame: false,
    hasShadow: false,
    resizable: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, 
    }
  })
  // win.webContents.openDevTools();
  if (process.env.npm_lifecycle_event == 'dev') {
    win.loadURL('http://localhost:3009/');
  } else {
    win.loadFile(path.join(__dirname, "./index.html"))
  }
}

app.whenReady().then(initWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    process.exit()
  }
})


ipcMain.handle('open-dev', (e, data) => {
  win.webContents.openDevTools();
})

ipcMain.handle('win-bar', async (event, data) => {
  if (win) {
    if (data == 'close') {
      win.close();
      process.exit()
    } else if (data == 'max') {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    } else if (data == 'min') {
      if (win.isMinimized()) {
        win.restore();
      } else {
        win.minimize();
      }
    }
  }
})