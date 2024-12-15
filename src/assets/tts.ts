export const CHROMIUM_FULL_VERSION = '130.0.2849.68'

// 生成guid
function guid() {
  function gen(count) {
    var out = "";
    for (var i = 0; i < count; i++) {
      out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return out;
  }
  return gen(8)
}
// 数字转带符号字符串
function numToString(num) {
  return num >= 0 ? `+${num}` : `${num}`
}

const speechConfig = (audioOutputFormat = 'webm-24khz-16bit-mono-opus') => {
  return `
  X-Timestamp:${new Date()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n
  {
    "context":
    {
      "synthesis":
      {
        "audio":
        {
          "metadataoptions":
          {
            "sentenceBoundaryEnabled": "false", "wordBoundaryEnabled": "true"
          },
          "outputFormat": "${audioOutputFormat}"
        }
      }
    }
  }
  `
}

const ssmlText = ({ requestId = guid(), lan = 'zh-CN', voiceName, pitch = '+0', rate = '+0', volume = '+0', text }) => {
  let url = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date()}\r\nPath:ssml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='${lan}'><voice name='${voiceName}'><prosody pitch='${pitch}Hz' rate ='${rate}%' volume='${volume}%'>${text}</prosody></voice></speak>`;
  return url
}

export default () => {

}