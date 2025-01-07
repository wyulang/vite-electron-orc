-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ctime" INTEGER NOT NULL,
    "ltime" INTEGER NOT NULL DEFAULT 0,
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "ctime" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "toplist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "ctime" INTEGER NOT NULL,
    "ok" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 10,
    "ctime" INTEGER NOT NULL
);
