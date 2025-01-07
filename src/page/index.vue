<template>
  <div class="w-all pl15 h-all fd-c pr15">
    <div class="flex h-33 pt10 ai-c">
      <span class="fs-13 fb">词典互译</span>
    </div>

    <div class="flex ai-c mt20 jc-c">
      <div class="flex ai-c nodarg h-50 bb-d w-all">
        <input v-model="info.serchText" @keydown="keydown" class="h-all  flex-1 fs-16" placeholder="在此输入单词或文本" type="text">
        <div class="flex ai-c mr10" v-if="info.isLoad"><img class="w-20" src="../assets/load.gif" alt=""></div>
        <span v-if="info.serchText" @click="btnClear" class="iconfont hand nodarg icon-qingkong mr15 fs-24"></span>
        <div @click="blurSerch" class="pl11 pr11 pt6 pb6 ra-5 hand fs-15 fc-fff bc-primary"><span class="iconfont fb hand fs-16 mr10 icon-search"></span>搜索</div>
      </div>
    </div>

    <div class="flex-1 h-all">
      <scroll>
        <div class="w-all mt15 flex ai-c">
          <div v-for="item in info.detail.pingyin" @click="onHear(item)" class="ra-50 nodarg hand mr20 bc-f5 fs-18 h-50 pl20 pr20 flex ai-c">
            <span>{{item.title}}</span>
            <span class="pl5 pr5">/ <span class="pl3 pr3">{{item.value}}</span> /</span>
            <span v-if="item.src" class="iconfont fc-warning fs-18 icon-ting"></span>
          </div>
        </div>

        <div v-if="info.detail.detail?.length" class="mt20 pl5">
          <div class="mt10 lh-24" v-for="item in info.detail.detail">
            <span class="fs-14 fs-16 mr5">{{item}}</span>
          </div>
        </div>

        <!-- <div class="pp20 nodarg"><slider class="w-550 bc-e ra-15 h-15" v-model="st.volume"></slider></div> -->

        <div class="mt20">
          <div v-for="item in info.detail.cnDetail" class="w-all fs-16 mb15">
            <div @click="onHear(item)" class="ra-50 nodarg flex-line hand mr20 bc-f5 fs-18 h-50 pl20 pr20 flex ai-c">
              <span>{{item.pingyin.title}}</span>
              <span v-if="item.pingyin.src" class="iconfont fc-warning fs-18 icon-ting"></span>
            </div>
            <div class="mt10 pl5 w-all">
              <span>{{item.detail}}</span>
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import yy from '@lib/mixin';
import useStore from '../store';
const st = useStore();
const info = reactive({
  serchText: "",
  phrase: [],
  isLoad: false,
  detail: []
})
// const { ipcRenderer } = window.require('electron');

function btnClear() {
  info.serchText = "";
  info.phrase = [];
  info.detail = [];
}

function blurSerch(e) {
  window.storeApi.setUser().then(res=>{
    console.log(res);
  })
  return;
  if (!info.serchText.trim()) {
    yy.msg.error('请输入单词或文本');
    return;
  }
  info.isLoad = true;
  window['storeApi'].ipcRenderer('youdao', { word: info.serchText }).then(res => {
    console.log(res)
    info.isLoad = false;
    info.detail = res;
  })
}

function onHear(item) {
  if (item.src) {
    const audio = new Audio(item.src);
    audio.play()
  } else {
    // const audio = new Audio(`https://sensearch.baidu.com/gettts?lan=uk&spd=1&source=alading&text=${info.serchText}`);
    // audio.play()
    window['storeApi'].ipcRenderer('tts-speek', { message: `葫芦娃跌停`, ...st.ttsConfig }).then(res => {

    })
  }

}

function keydown() {
  document.onkeydown = e => {
    var ev: any = document.all ? window.event : e;
    if (ev.keyCode == 13) {
      blurSerch();
    }
  }
}

/**
 * 百度盗的，用来将string解析为JSON的方法
 * @params jsonStr {a: 1}{a: 2}{a: 3}
 */
function parseMultiJson(jsonStr) {
  const jsonArr = [];
  let startIndex = 0;
  let endIndex = 0;

  while (startIndex < jsonStr.length) {
    // 找到一个 JSON 对象的开始位置
    startIndex = jsonStr.indexOf('{', startIndex);
    if (startIndex === -1) {
      break;
    }

    // 找到一个 JSON 对象的结束位置
    let openBrackets = 1;
    endIndex = startIndex + 1;
    while (openBrackets > 0 && endIndex < jsonStr.length) {
      if (jsonStr[endIndex] === '{') {
        openBrackets++;
      } else if (jsonStr[endIndex] === '}') {
        openBrackets--;
      }
      endIndex++;
    }

    // 将该 JSON 对象解析为一个对象，并添加到数组中
    const json = jsonStr.substring(startIndex, endIndex);
    jsonArr.push(JSON.parse(json));

    // 更新下一个 JSON 对象的开始位置
    startIndex = endIndex;
  }
  return jsonArr;
}

function btnPlay() {
  window['storeApi'].ipcRenderer('youdao', { word: 'your' }).then(res => {
    console.log(res);
  })
}
</script>

<style lang='less'>
.inputs {
  border-bottom: 2px solid #ddd;
}
</style>