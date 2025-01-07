https://help.aliyun.com/document_detail/212729.html?spm=a2c4g.101645.0.0.341a190aws1qNx 

<!-- https://github.com/TryGhost/node-sqlite3/releases -->
<!-- C:\Users\Administrator\AppData\Local\npm-cache\_prebuilds\69004f-sqlite3-v5.1.7-napi-v36-win32-x64.tar.gz -->

完整配置
https://www.jianshu.com/p/4699b825d285?from=timeline

英语单词朗读器
美音
https://dict.youdao.com/dictvoice?type=0&audio=Chinese
英音
https://dict.youdao.com/dictvoice?type=1&audio=Chinese

翻译接口
https://dict.youdao.com/suggest?num=5&ver=3.0&doctype=json&cache=false&le=en&q=%E4%B8%AD%E5%9B%BD

百度发音 
https://sensearch.baidu.com/gettts?lan=uk&spd=1&source=alading&text=word

人人发音
https://mp3.91dict.com/word/word_e.mp3
https://mp3.91dict.com/word/word_a.mp3

//识别图片类内容
https://www.npmjs.com/package/tesseract.js 英音

屏幕取词、OCR、翻译、取色工具
https://github.com/danger-dream/dta/blob/master/src/translate/lib/translate/wechat.ts

PaddleOCR-json.exe

<!-- 接口地址 -->
https://m.youdao.com/m/result?word=%E6%88%91%E4%BB%AC&lang=en


https://api.bilibili.com/x/player/playurl?cid=26252152481&avid=113298653578818&platform=html5&otype=json&qn=16&type=mp4&html5=1

https://api.bilibili.com/x/player/wbi/playurl?avid=948944564&type=mp4&platform=html5&web_location=1315875



Electron下载超时失败
https://blog.csdn.net/weixin_62338560/article/details/135930995


Electron 框架 + Vue3 + Prisma + SQLite笔记
https://blog.csdn.net/zsyok/article/details/138590971

npx Prisma 是一个用于数据库访问和管理的工具。以下是一些常用的 npx Prisma 命令和用途：

1、npx prisma init
在项目中初始化 Prisma 配置文件和数据模型文件。

2、npx prisma generate
根据数据模型生成 Prisma Client，用于与数据库交互。

3、npx prisma studio
启动可视化工具，帮助你查看和管理数据库中的数据。

4、npx prisma migrate dev
创建数据库迁移并将其应用于开发数据库。

5、npx prisma migrate deploy
将数据库迁移应用于生产数据库。

6、npx prisma introspect
从现有数据库自动生成 Prisma 数据模型。

7、npx prisma db push
将数据模型部署到数据库。



    "extraResources": [
      {
        "from": "node_modules/.prisma/client/",
        "to": "www/@prisma/client/.prisma/client/"
      },
      {
        "from": "node_modules/@prisma/client/",
        "to": "www/@prisma/client/"
      }
    ]

