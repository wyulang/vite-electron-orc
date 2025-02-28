export default{
  table: `CREATE SEQUENCE id_user START 1;
   create table user(
    id INTEGER DEFAULT nextval('id_user'),
    name VARCHAR,
    password VARCHAR,
    ctime VARCHAR,
    ltime VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    loginCount INTEGER,
  );
  CREATE SEQUENCE id_category START 1;
  create table category(
    id INTEGER DEFAULT nextval('id_category'),
    name VARCHAR,
    pid INTEGER,
    remark VARCHAR,
    sort INTEGER,
    ctime VARCHAR,
  );
  CREATE SEQUENCE id_exercise START 1;
  create table exercise(
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
  CREATE SEQUENCE id_exerciseList START 1;
  create table exerciseList(
    id INTEGER DEFAULT nextval('id_exerciseList'), 
    tid INTEGER,
    title VARCHAR,
    pic VARCHAR,
    remark VARCHAR,
    ctime VARCHAR,
    ok VARCHAR,
  );
  `
}