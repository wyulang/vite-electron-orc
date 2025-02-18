"use strict";
const { PrismaClient } = require("../../generated/client");
const duckdb = require("duckdb");
const api = new PrismaClient({
  datasources: {
    db: {
      url: process.env.npm_lifecycle_event == "dev" ? "file:./xiaoxuebao.db" : "file:../../db/xiaoxuebao.db"
    }
  }
});
const { contextBridge, ipcRenderer } = require("electron");
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
  db: (data) => {
    let db = new duckdb.Database("E:/db/xiaoxuebao.db");
    let con = db.connect();
    return {
      run: new Promise((resolve, reject) => {
        con.run(data.sql, (err, res) => {
          resolve({ data: { err, res } });
          con.close();
        });
      }),
      all: new Promise((resolve, reject) => {
        con.all(data.sql, (err, res) => {
          resolve({ data: res });
          reject({ data: err });
          con.close();
        });
      })
    };
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
