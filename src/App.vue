<template>
  <div class="w-all ra-5 eye-bg hv-all h-all">
    <div class="w-all  flex hidden ra-5 sha-card h-all">
      <div style="-webkit-app-region: drag; " class="w-81 flex fd-c sha-card ai-c pt30 h-all">
        <span @click="$router.push('/')" :class="$route.name=='index'?'fc-pri':'fc-nume'" class="icon-fanyiyuyan iconfont sha-f10 nodarg hand fs-35 "></span>
        <span @click="$router.push('/ai')" :class="$route.name=='ai'?'fc-pri':'fc-nume'" class="icon-ai2 iconfont sha-f10 nodarg hand mt30 fs-31"></span>
        <span @click="$router.push('/video')" :class="$route.name=='video'?'fc-pri':'fc-nume'" class="icon-mv iconfont sha-f10 nodarg hand mt30 fs-32"></span>
        <span @click="$router.push('/tiku')" :class="$route.name=='tiku'?'fc-pri':'fc-nume'" class="icon-tupianshizi nodarg iconfont sha-f10 hand mt30 fs-38"></span>
        <span @click="$router.push('/english')" :class="$route.name=='english'?'fc-pri':'fc-nume'" class="icon-english nodarg iconfont sha-f10 hand mt30 fs-38"></span>
      </div>
      <div style="-webkit-app-region: drag; " class="flex-1 rel">
        <div class="flex abs ai-c ar10 at10">
          <span @click="st.isConfig=true" class="iconfont nodarg hand fs-20 ml15 icon-shezhi1"></span>
          <span @click="playConfig()" class="iconfont nodarg hand fs-20 ml15 icon-bofangshezhi-239"></span>
          <span @click="btnConsloe()" class="iconfont nodarg hand fs-20 ml15 icon-kongzhitai"></span>
          <span @click="btnReplay()" class="iconfont nodarg hand fs-16 ml15 icon-a-shuaxin1"></span>
          <span @click="btnBarSize('min')" class="iconfont nodarg hoverBar hand hand ml30 fs-20 icon-zuixiaohua"></span>
          <span @click="btnBarSize('max')" class="iconfont nodarg hoverBar hand hand fs-20 ml15 icon-3zuidahua-1"></span>
          <span @click="btnBarSize('close')" class="iconfont nodarg hoverBar hand hand fs-22 ml15 icon-guanbi"></span>
        </div>
        <router-view v-slot="{ Component }">
          <keep-alive v-if="$route.meta.keep">
            <component :is="Component"></component>
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keep"></component>
        </router-view>
      </div>
    </div>
  </div>

  <dig :isHeader="false" v-model="isPlay">
    <div class="pp30 sha-card">
      <div class="flex ai-c">
        <span class="wi-110 fs-16">语言类型</span>
        <Select v-model="st.ttsConfig.lang" class="w-250 h-40" @change="v=>{st.nameList=v.item.list;st.ttsConfig.name=''}" :data="st.voiceList"></Select>
      </div>
      <div class="flex mt15 ai-c">
        <span class="wi-110 fs-16">语音</span>
        <Select v-model="st.ttsConfig.name" class="w-250 h-40" props="name,value" :data="st.nameList"></Select>
      </div>
      <div class="flex mt15 ai-c">
        <span class="wi-110 fs-16">音量</span>
        <slider class="w-250 bc-e ra-15 nodarg h-15" :formatTip="formatTip" tip="hover" min="0.0" step="0.01" max="2" v-model="st.ttsConfig.volume"></slider>
      </div>
      <div class="flex mt15 ai-c">
        <span class="wi-110 fs-16">说话速率</span>
        <slider class="w-250 bc-e ra-15 nodarg h-15" :formatTip="formatTip" tip="hover" min="0.0" step="0.01" max="2" v-model="st.ttsConfig.rate"></slider>
      </div>
      <div class="flex mt15 ai-c">
        <span class="wi-110 fs-16">音频(赫兹)</span>
        <slider class="w-250 bc-e ra-15 nodarg h-15" :formatTip="formatTip" tip="hover" min="0.0" step="0.01" max="2" v-model="st.ttsConfig.pitch"></slider>
      </div>

      <div class="flex mt15 jc-e ai-c">
        <div @click="isPlay=false" class="btn hand btn-small btn-default ra-3">取消</div>
        <div @click="btnSave()" class="btn hand btn-small btn-primary ml10 ra-3">保存</div>
      </div>
    </div>
  </dig>

  <div @click="st.play.url=''" v-if="st.play.url" class="w-all nodarg flex pp20 ai-c jc-c h-all fixed at0 al0 ab0 ar0 ba-5">
    <video @click.stop controls :src="st.play.url" class="w-all ra-6"></video>
  </div>

  <dig :isHeader="false" v-model="st.isConfig">
    <div class="pp30 sha-card">
      <div class="flex ai-c">
        <span>初始化数据库</span>
        <div @click="btnSetDB" class="h-35 btn ml10 pl10 pr10 ra-5 btn-primary">初始化</div>
      </div>
    </div>
  </dig>

  <div @click="st.isPic=''" v-if="st.isPic" style="z-index: 99999;" class="w-all nodarg flex pp20 ai-c jc-c h-all fixed at0 al0 ab0 ar0 ba-5">
    <img :src="st.isPic" class="bc-fff" alt="">
  </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
const { ipcRenderer } = window.require('electron');
import yy from '@lib/mixin';
import useStore from './store';
import { useRoute } from 'vue-router';
import initTable from '@/store/dbbase';
const re = useRoute();
const st = useStore();
const isPlay = ref(false);
const nameList = ref([]);
const volume = ref(1);

const voiceList = [];
function btnBarSize(type) {
  ipcRenderer.invoke('win-bar', type);
}

function btnReplay() {
  window.location.reload();
}

function btnConsloe() {
  ipcRenderer.invoke('open-dev', "");
}

function playConfig() {
  isPlay.value = true;
}

function formatTip(e) {
  return e
}

function btnSave() {
  isPlay.value = false;
  yy.storage('ttsConfig', st.ttsConfig);
  yy.storage('nameList', st.nameList);
}

if (!yy.storage('voiceList')) {
  ipcRenderer.invoke('getVoice', {}).then(list => {
    yy.storage('voiceList', list);
    yy.storage('nameList', list[0].list);
    st.nameList = list[0].list;
    st.voiceList = list;
    yy.storage('ttsConfig', {
      name: st.nameList[0].value,
      lang: "en-GB",
      pitch: 1,
      rate: 1,
      volume: 1,
    })
    st.ttsConfig = {
      name: st.nameList[0].value,
      lang: "en-GB",
      pitch: 1,
      rate: 1,
      volume: 1,
    }
  })
}
</script>

<style lang='less'>
.eye-bg {
  background: radial-gradient(
      circle at 20% 30%,
      rgba(179, 224, 255, 0.8),
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(102, 194, 255, 0.6),
      transparent 40%
    ),
    linear-gradient(to bottom, #f0f9ff, #d4eeff);
  .glass-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
}

.white-text {
  text-shadow: 1px 1px 2px rgba(75, 75, 75, 0.3); /* 增加阴影提升辨识度 */
}

.caphover {
  &:hover {
    span {
      color: #409eff !important;
    }
  }
}
.nodarg {
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
}
.hoverBar {
  &:hover {
    color: #fff;
    background-color: #999;
    border-radius: 5px;
    
  }
}
.hover {
  &:hover {
    color: #409eff;
  }
}
.bc-1e3a8a {
  background-color: #bfdbfe;
}
.fc-pri {
  color: #FF7F50;
}
.fc-FF4500{
  color: #FF4500;
}
.fc-FFFFE0{
  color: #FFFFE0;
}
.fc-nume{
  color: #87CEEB;
}
</style>