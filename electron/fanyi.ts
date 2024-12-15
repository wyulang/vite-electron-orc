// cheerio puppeteer
import { ipcMain } from "electron";
import * as cheerio from 'cheerio';
import { executablePath } from "puppeteer";
const puppeteer = require('puppeteer')
import path from "node:path";
const md5 = require('md5');


ipcMain.handle('youdao', async (e, data) => {
  let from = "en";
  if (checkChinese(data.word)) {
    from = "zh";
  }
  return puppeteer.launch({
     headless: true,
    //  executablePath:path.join(__dirname, "./chrome.exe"),
      defaultViewport: { width: 375, height: 900, isMobile: true, deviceScaleFactor: 2, devtools: true }
     }).then(browser => {
    return browser.newPage().then(async page => {
      await page.setUserAgent("Mozilla/5.0 (Linux; Android 9; COL-AL10 Build/HUAWEICOL-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36")
      await page.goto(`https://youdao.com/m/result?word=${data.word}&lang=en`);
      const html = await page.content();
      await browser.close();
      const $ = cheerio.load(html);
      let text: any = $('.phone_con').text().split('/').map(v => v.trim()).filter(v => v);
      let audio: any = $('.phone_con .pronounce').toArray().map(v => v.children[0]['attribs'].src) || [];
      let pingyin = {};
      let detail: any = [];
      let cnDetail: any = [];
      if (text.includes('英')) {
        pingyin = [
          {
            title: text[0],
            value: text[1],
            src: audio[0]
          }, {
            title: text[2],
            value: text[3],
            src: audio[1]
          }
        ]
        text = null;
        audio = null;
      } else {
        pingyin = text[0] && [{
          value: text[0],
          src: ""
        }] || "";
      }

      if ($('.basic').find('.word-exp-ce').length) {
        cnDetail = $('.basic .word-exp-ce').toArray().map(item => {
          return {
            pingyin: {
              title: $(item).find('.trans-ce').text(),
              src: $(item).find('.phrase-ce audio').attr('src')
            },
            detail: $(item).find('.word-exp_tran').text()
          }
        })
      } else {
        detail = $('.basic .word-exp').toArray().map(v => $(v).text());
      }

      return {
        pingyin,
        detail,
        cnDetail
      }
    })
  })
})


// initDom('https://m.youdao.com/m/result?word=name&lang=en')


// ipcMain.handle('youdao', async (e, data) => {
//   let salt = new Date().getTime();
//   let sign = md5(`20241204002218658${data.word}${salt}LjV3TABzkLOUD87dBFMI`)
//   // return axios.get(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${data.word}&from=${data.from || 'en'}&to=${data.to || 'zh'}&appid=20241204002218658&salt=${salt}&sign=${sign}`).then(res => {
//   //   return res.data
//   // })
//   let from = "en";
//   let to = "zh";
//   if (checkChinese(data.word)) {
//     from = "zh";
//     to = "en";
//   }
//   return axios.post(`https://fanyi.baidu.com/ait/text/translate`, {
//     "query": data.word, "from": from, "to": to, "reference": "", "corpusIds": [], "needPhonetic": true, "domain": "common", "milliTimestamp": new Date().getTime()
//   }).then(res => {
//     return res.data
//   })
// })

function checkChinese(str) {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  return reg.test(str);
}