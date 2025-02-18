import duckdb from 'duckdb';
const db = new duckdb.Database('mydatabase.db');
// 创建一个连接
const conn = db.connect();
