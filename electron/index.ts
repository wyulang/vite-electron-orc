
import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import log from 'electron-log/main';
import path from "path";
let win: any = null;
import mysql from './mysql';
import capture from './capture';
const fs = require('fs');
const csv = require('csv-parser');
import './baidu';
import './tts';

// 当启动项目遇到Electron Security Warning (Insecure Content-Security-Policy)警告信息时
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

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
    width: 1200,
    minWidth: 900,
    height: 750,
    frame: false,
    resizable: true,
    // transparent: true,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
    }
  })
  // win.webContents.openDevTools();
  mysql.con.connect();
  capture(win);
  if (process.env.npm_lifecycle_event == 'dev') {
    win.loadURL('http://localhost:3009/');
  } else {
    win.loadFile(path.join(__dirname, "./index.html"))
  }
}

app.whenReady().then(initWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mysql.con.end()
    process.exit()
  }
})


ipcMain.handle('open-dev', (e, data) => {
  win.webContents.openDevTools();
})

ipcMain.handle('words', (e, data) => {
  return new Promise((resolve, reject) => {
    mysql.con.query(data.sql, (err, res) => {
      resolve(res);
      reject(err)
    })
  })
})

ipcMain.handle('mysql', (e, data) => {
  return mysql.con;
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