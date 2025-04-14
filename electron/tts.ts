import { ipcMain } from "electron";
import { createHash } from 'node:crypto'
export const CHROMIUM_FULL_VERSION = '130.0.2849.68'
export const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
const WINDOWS_FILE_TIME_EPOCH = 11644473600n
import { randomBytes } from 'node:crypto'
const WebSocket = require("ws")

function generateSecMsGecToken() {
  const ticks = BigInt(Math.floor((Date.now() / 1000) + Number(WINDOWS_FILE_TIME_EPOCH))) * 10000000n
  const roundedTicks = ticks - (ticks % 3000000000n)

  const strToHash = `${roundedTicks}${TRUSTED_CLIENT_TOKEN}`

  const hash = createHash('sha256')
  hash.update(strToHash, 'ascii')

  return hash.digest('hex').toUpperCase()
}

function getVoiceList() {
  let list: any = [
    { label: '英(英式)', value: 'en-GB', list: [] },
    { label: '英(美式)', value: 'en-US', list: [] },
    { label: '中文', value: 'zh-CN', list: [] },
  ];
  const voices: any = [
    { lable: "晓晓", value: "zh-CN-XiaoxiaoNeural" },
    { lable: "晓依", value: "zh-CN-XiaoyiNeural" },
    { lable: "云嘉", value: "zh-CN-YunjianNeural" },
    { lable: "云溪", value: "zh-CN-YunxiNeural" },
    { lable: "云夏", value: "zh-CN-YunxiaNeural" },
    { lable: "云阳", value: "zh-CN-YunyangNeural" },
    { lable: "艾娃(多人)", value: "en-US-AvaMultilingualNeural" },
    { lable: "安德鲁(多人)", value: "en-US-AndrewMultilingualNeural" },
    { lable: "艾玛(多人)", value: "en-US-EmmaMultilingualNeural" },
    { lable: "布莱恩(多人)", value: "en-US-BrianMultilingualNeural" },
    { lable: "艾娃", value: "en-US-AvaNeural" },
    { lable: "安德鲁", value: "en-US-AndrewNeural" },
    { lable: "艾玛", value: "en-US-EmmaNeural" },
    { lable: "布莱恩", value: "en-US-BrianNeural" },
    { lable: "莉比", value: "en-GB-LibbyNeural" },
    { lable: "梅齐", value: "en-GB-MaisieNeural" },
    { lable: "瑞安", value: "en-GB-RyanNeural" },
    { lable: "索尼亚", value: "en-GB-SoniaNeural" },
    { lable: "托马斯", value: "en-GB-ThomasNeural" },
    { lable: "安娜", value: "en-US-AnaNeural" },
    { lable: "阿里亚", value: "en-US-AriaNeural" },
    { lable: "克里斯多夫", value: "en-US-ChristopherNeural" },
    { lable: "艾瑞克", value: "en-US-EricNeural" },
    { lable: "盖伊", value: "en-US-GuyNeural" },
    { lable: "詹妮", value: "en-US-JennyNeural" },
    { lable: "米歇尔", value: "en-US-MichelleNeural" },
    { lable: "罗杰", value: "en-US-RogerNeural" },
    { lable: "斯特凡", value: "en-US-SteffanNeural" }
  ]
  const categories: any = {
    News: '新闻',
    Novel: '小说',
    Cartoon: '卡通',
    Sports: '娱乐',
    Conversation: '自由交谈',
    Copilot: '客服',
    General: '普通',
  }

  const Persona: any = {
    "Warm": "温暖的",
    "Lively": "活泼的",
    "Passion": "激情的",
    "Sunshine": "阳光的",
    "Cute": "可爱的",
    "Professional": "专业的",
    "Reliable": "可信赖的",
    "Expressive": "富于表情的",
    "Caring": "充满关爱",
    "Pleasant": "愉快的",
    "Friendly": "亲切的",
    "Confident": "自信的",
    "Authentic": "传统的",
    "Honest": "坦诚直率",
    "Cheerful": "欢快开朗",
    "Clear": "清晰晴朗",
    "Conversational": "口语的",
    "Approachable": "亲切友善的",
    "Casual": "休闲的",
    "Sincere": "真诚的",
    "Positive": "乐观的",
    "Authority": "专家",
    "Rational": "理智的",
    "Considerate": "体贴谨慎",
    "Comfort": "舒服舒适",
  }
  return fetch('https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4').then(data => data.json()).then(data => {
    data.filter(v => ['en-GB', 'en-US', 'zh-CN'].includes(v.Locale)).forEach(item => {
      let curr = list.find(f => f.value == item.Locale);
      curr.list.push({
        name: (voices.find(v => v.value == item.ShortName)?.lable || '无名') + `(${item.Gender == 'Female' ? '女' : '男'})`,
        sex: item.Gender == 'Female' ? '女' : '男',
        value: item.ShortName,
        contentCategories: item.VoiceTag.ContentCategories.map(v => { return { value: v.trim(), label: categories[v.trim()] } }),
        voicePersonalities: item.VoiceTag.VoicePersonalities.map(v => { return { value: v.trim(), label: Persona[v.trim()] } }),
        lang: curr.label
      })
    })
    return list
  })
}


function setXmlText(data: any) {
  let requestId = randomBytes(16).toString('hex')
  return `
  X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\n
  X-Timestamp:${new Date()}\r\nPath:ssml\r\n\r\n
  <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='${data.lang}'>
    <voice name='${data.name}'>
        <prosody pitch='${data.pitch}' rate ='${data.rate}' volume='${data.volume}'>${data.message}</prosody>
    </voice>
  </speak>
  `;
}


function initTts(vdata) {
  let bufferList: any = [];
  return new Promise((resolve, reject) => {
    let ws = new WebSocket(`wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${generateSecMsGecToken()}&Sec-MS-GEC-Version=1-${CHROMIUM_FULL_VERSION}`, {
      host: 'speech.platform.bing.com',
      origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
      },
      agent: undefined
    })
    ws.on("open", () => {
      ws.send(`Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n
      {
        "context": {
          "synthesis": {
            "audio": {
              "metadataoptions": {
                "sentenceBoundaryEnabled": "false",
                "wordBoundaryEnabled": "true"
              },
              "outputFormat": "audio-24khz-48kbitrate-mono-mp3"
            }
          }
        }
      }
    `)
      setTimeout(() => {
        ws.send(setXmlText(vdata))
      }, 100);
    })

    ws.on("message", (data, isBrinary) => {
      if (isBrinary) {
        let separator = "Path:audio\r\n";
        let contentIndex = data.indexOf(separator) + separator.length;
        bufferList.push(data.slice(contentIndex))
      } else {
        if (data.toString().includes("Path:turn.end")) {
          ws.close()
        }
      }
    })

    ws.on('close', e => {
      resolve(bufferList)
    })

    ws.on("error", e => {
      reject('连接失败')
    })
  })
}

ipcMain.handle('tts-speek', async (e, data) => {
  let vdata = {
    name: data.name,
    lang: data.lang,
    outputFormat: data.outputFormat || 'audio-24khz-48kbitrate-mono-mp3',
    rate: setPitch(data.rate),
    pitch: setPitch(data.pitch),
    volume: setVolume(data.volume),
    message: data.message,
  }
  return initTts(vdata)
})

function setPitch(value) {
  if (value == 1) {
    return "medium";
  }
  if (value > 1) {
    return `+${Number(String(value).split('.')[1] || 0) || 100}%`
  }
  return `-${100 - Number(String(value).split('.')[1] || 0)}%`;
}

function setVolume(value) {
  if (value == 1) {
    return "x-loud";
  }
  if (value > 1) {
    return `+${Number(String(value).split('.')[1] || 0) || 100}%`
  }
  return `${100 - Number(String(value).split('.')[1] || 0)}%`;
}

ipcMain.handle('getVoice', async (e, data) => {
  return getVoiceList()
})
