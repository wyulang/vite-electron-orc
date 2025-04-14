import { app } from "electron";
const bindingPath = path.join(
  __dirname,
  'node_modules/duckdb/lib/binding/duckdb.node'
);

process.dlopen(module, bindingPath);
let isDev = process.env.npm_lifecycle_event != 'dev';
// import duckdb from 'duckdb';
const path = require('path');
let duckdb;
try {
  duckdb = require('duckdb');
} catch (err) {
  const duckDbPath = path.join(process.resourcesPath, 'node_modules/duckdb')
  duckdb = require(duckDbPath);
}

class DuckDBService {
  db: any = null;
  connection: any = null;
  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'data.db');
    this.db = new duckdb['Database'](dbPath);
    this.connection = this.db.connect();
    this.initDatabase();
  }

  async initDatabase() {
    await this.run({
      sql: `
    CREATE SEQUENCE if not exists id_user START 1;
    create table if not exists user(
     id INTEGER DEFAULT nextval('id_user'),
     name VARCHAR,
     password VARCHAR,
     ctime VARCHAR,
     ltime VARCHAR,
     email VARCHAR,
     phone VARCHAR,
     loginCount INTEGER,
   );
   CREATE SEQUENCE if not exists id_category START 1;
   create table if not exists category(
     id INTEGER DEFAULT nextval('id_category'),
     name VARCHAR,
     pid INTEGER,
     remark VARCHAR,
     sort INTEGER,
     ctime VARCHAR,
   );
   CREATE SEQUENCE if not exists id_exercise START 1;
   create table if not exists exercise(
     id INTEGER DEFAULT nextval('id_exercise'),
     name VARCHAR,
     nianji VARCHAR,
     kemu VARCHAR,
     type VARCHAR,
     pic text,
     titlePic text,
     url VARCHAR,
     remark VARCHAR,
     answer VARCHAR,
     ctime VARCHAR, 
     isheng INT, 
   );
   CREATE SEQUENCE if not exists id_exerciseList START 1;
   create table if not exists exerciseList(
     id INTEGER DEFAULT nextval('id_exerciseList'), 
     tid INTEGER,
     title VARCHAR,
     pic VARCHAR,
     remark VARCHAR,
     ctime VARCHAR,
     ok VARCHAR,
   );`})
  }
  // 不返回
  run(data) {
    return new Promise((resolve, reject) => {
      this.connection.run(data.sql, (err, res) => {
        if (err) {
          reject({ code: 100, msg: err })
        } else {
          resolve({ code: 200, msg: '操作成功', data: res })
        }
      })
    })
  }
  // 返回列表
  all(data) {
    return new Promise((resolve, reject) => {
      this.connection.all(data.sql, (err, res) => {
        if (err) {
          reject({ code: 100, msg: err })
        } else {
          resolve({ code: 200, msg: '操作成功', data: res })
        }
      })
    })
  }
  // 返回单个列表
  each(data) {
    return new Promise((resolve, reject) => {
      this.connection.each(data.sql, (err, res) => {
        if (err) {
          reject({ code: 100, msg: err })
        } else {
          resolve({ code: 200, msg: '操作成功', data: res })
        }
      })
    })
  }
}

export default DuckDBService;