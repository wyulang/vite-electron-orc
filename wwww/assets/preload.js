"use strict";
const { PrismaClient } = require("../../generated/client");
const duckdb = require("duckdb");
let db = new duckdb.Database("E:/db/duckdb.db", { access_mode: "READ_WRITE" });
require("node:path");
let con = db.connect();
const api = new PrismaClient({
  datasources: {
    db: {
      url: process.env.npm_lifecycle_event == "dev" ? "file:./xiaoxuebao.db" : "file:../../db/xiaoxuebao.db"
    }
  }
});
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("ddb", {
  run: (data) => {
    return new Promise((resolve, reject) => {
      con.run(data.sql, (err, res) => {
        if (err) {
          reject({ code: 100, msg: err });
        } else {
          resolve({ code: 200, msg: "操作成功", data: res });
        }
      });
    });
  },
  all: (data) => {
    return new Promise((resolve, reject) => {
      con.all(data.sql, (err, res) => {
        if (err) {
          reject({ code: 100, msg: err });
        } else {
          resolve({ code: 200, msg: "操作成功", data: res });
        }
      });
    });
  },
  each: (data) => {
    return new Promise((resolve, reject) => {
      con.each(data.sql, (err, res) => {
        if (err) {
          reject({ code: 100, msg: err });
        } else {
          resolve({ code: 200, msg: "操作成功", data: res });
        }
      });
    });
  }
});
contextBridge.exposeInMainWorld("storeApi", {
  setUser: (data) => {
    return api.user.create({
      data: {
        name: "wyulang",
        password: "111111",
        email: "wyulang@163.com",
        ctime: (/* @__PURE__ */ new Date()).getTime().toString()
      }
    }).then((res) => {
      return JSON.stringify(res);
    });
  },
  getUser: (data) => {
    return api.user.findFirst().then((res) => {
      return res;
    });
  },
  ipcRenderer: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  },
  send: (channel, data) => {
    return ipcRenderer.send(channel, data);
  },
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  }
});
