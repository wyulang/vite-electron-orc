import mysql from 'mysql2';
const con = mysql.createConnection({ host: 'localhost', user: 'root', password: 'wyulang', database: 'xiaoxuebao' });
const tableDefinitions = [
  `create table if not exists user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
    password VARCHAR(30),
    ctime VARCHAR(30),
    ltime VARCHAR(30),
    email VARCHAR(30),
    phone VARCHAR(30),
    loginCount INT 
  );`,
  `create table if not exists category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
    pid INT,
    remark VARCHAR(200),
    sort INT,
    ctime VARCHAR(30) 
  );`,
  `create table if not exists exercise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(300),
    nianji VARCHAR(30),
    kemu VARCHAR(30),
    type VARCHAR(30),
    pic text,
    titlePic text,
    url VARCHAR(50),
    remark VARCHAR(300),
    answer VARCHAR(300),
    ctime VARCHAR(30), 
    isheng INT 
  );`,
  `create table if not exists exerciseList (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    tid INT,
    title VARCHAR(300),
    pic text,
    remark VARCHAR(300),
    ctime VARCHAR(30),
    ok VARCHAR(30) 
  );`
];
function initCreateTable() {
  try {
    for (const table of tableDefinitions) {
      con.query(table);
    }
    console.log('Dynamic tables created successfully');
  } catch (error) {
    console.error('Error creating dynamic tables:', error);
  }
}

export default{
  initCreateTable,
  con
}