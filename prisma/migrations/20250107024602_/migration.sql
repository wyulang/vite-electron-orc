-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 10,
    "ctime" TEXT NOT NULL
);
INSERT INTO "new_category" ("ctime", "id", "name", "pid", "remark", "sort") SELECT "ctime", "id", "name", "pid", "remark", "sort" FROM "category";
DROP TABLE "category";
ALTER TABLE "new_category" RENAME TO "category";
CREATE TABLE "new_topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "ctime" TEXT NOT NULL
);
INSERT INTO "new_topic" ("answer", "ctime", "id", "name", "pic", "remark", "type", "url") SELECT "answer", "ctime", "id", "name", "pic", "remark", "type", "url" FROM "topic";
DROP TABLE "topic";
ALTER TABLE "new_topic" RENAME TO "topic";
CREATE TABLE "new_toplist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "ctime" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL
);
INSERT INTO "new_toplist" ("ctime", "id", "ok", "pic", "remark", "tid", "title") SELECT "ctime", "id", "ok", "pic", "remark", "tid", "title" FROM "toplist";
DROP TABLE "toplist";
ALTER TABLE "new_toplist" RENAME TO "toplist";
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ctime" TEXT NOT NULL,
    "ltime" TEXT NOT NULL DEFAULT ' ',
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL
);
INSERT INTO "new_user" ("ctime", "email", "id", "loginCount", "ltime", "name", "password") SELECT "ctime", "email", "id", "loginCount", "ltime", "name", "password" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
