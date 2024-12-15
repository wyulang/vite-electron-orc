<template>
  <div class="w-all flex pl15 h-all fd-c pr5">
    <div class="flex h-33 pt10 ai-c">
      <span class="fs-13 fb">视频资料({{info.list.length}}个视频)</span>
    </div>

    <div class="flex ai-c mt20 jc-c pr10">
      <div class="flex ai-c nodarg h-50 bb-d w-all">
        <input v-model="info.serchText" @keydown="keydown" class="h-all  flex-1 fs-16" placeholder="在此输入视频资料名称" type="text">
        <div class="flex ai-c mr10" v-if="info.isLoad"><img class="w-20" src="../assets/load.gif" alt=""></div>
        <span v-if="info.serchText" @click="btnClear" class="iconfont hand nodarg icon-qingkong mr15 fs-24"></span>
        <div @click="onSerch" class="pl11 pr11 pt6 pb6 ra-5 hand fs-15 fc-fff bc-primary"><span class="iconfont fb hand fs-16 mr10 icon-search"></span>搜索</div>
        <div v-if="info.list.length" @click="onPage" class="pl11 pr11 pt6 pb6 ra-5 hand fs-15 fc-fff ml10 bc-primary">下一页</div>
      </div>
    </div>
    <div class="flex-1 bc-primay nodarg h-all">
      <scroll @scroll="onScroll">
        <div class="flex w-all fw">
          <div v-for="item in info.list" @click="onVideoDetail(item)" :style="{backgroundImage:`url('${item.image}')`}" class="wb-32 bs-c nodarg hand rel hidden sha-6 mt10 ra-5 mr10 bp-all h-250">
            <div class="pl10 pr10 fc-fff flex pt7 pb7 fs-16 ai-c ba-5 w-all">{{item.title}}</div>
            <span class="abs al10 fs-16 pp5 ba-5 ra-5 ab10 fc-fff">{{item.duration}}</span>
            <span class="iconfont fs-33 icon-mv fc-fff abs absc"></span>
            <span @click.stop="toheji(item)" v-if="item.type=='heji'" class="abs ar10 pp7 ab10 ba-5 ra-5 fc-fff">合集</span>
          </div>
        </div>
      </scroll>
    </div>
    <div class="h-15"></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
const { ipcRenderer } = window.require('electron');
import yy from '@lib/mixin';
import { useRouter } from 'vue-router';
const rt = useRouter();
import useStore from '../store';
const st = useStore();
const info = reactive({
  serchText: "三年级数学上册",
  page: 10,
  list: [],
  isNext: false,
  scroll: 0,
  isBotom: false
})

function onSerch() {
  if (!info.serchText.trim()) {
    yy.msg.error('请输入视频资料名称');
    return;
  }
  initData(10);
}

function getUrlParams(url) {
  // 使用正则表达式匹配网址参数
  const params = {};
  url.replace(/\?|#.*$/, '').replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), ($0, $1, $2, $3) => {
    params[$1] = $3;
  });
  return params;
}

function onVideoDetail(item) {
  st.play.url = item.src;
}

function toheji(item) {
  let compilation = JSON.parse(item.heji.compilation_ext);
  st.heji = {
    compilationId: compilation.compilation_id,
    hejiNid: compilation.hejiNid,
    frsrcid: item.heji.frsrcid,
    lid: item.heji.lid,
    nid: item.heji.nid,
    referlid: item.heji.referlid,
    sign: item.heji.sign,
    page: 0,
    count: item.heji.count
  }
  setTimeout(() => {
    rt.push('/video/heji')
  }, 10);
}

function onScroll(data) {
  if (data.isBottom) {
    if (info.isNext || info.scroll > data.top) {
      return;
    }
    info.scroll = data.top;
    info.isNext = true;
    setTimeout(() => {
      initData(info.page + 10);
    }, 10);
  }
}

function keydown() {
  document.onkeydown = e => {
    var ev: any = document.all ? window.event : e;
    if (ev.keyCode == 13) {
      initData(10);
    }
  }
}

function initData(page = 10) {

  if (info.isBotom) return;
  yy.spinner.show()
  ipcRenderer.invoke('baidu-video', { serchText: info.serchText, page: info.page }).then(res => {
    console.log(res);

    yy.spinner.close()
    if (!String(res)) {
      info.isNext = true;
      return;
    };
    info.isNext = false;
    if (res.data?.videoList?.length) {
      info.page = page;
    }
    let list = res.data.videoList.filter(v => !['xsp', 'ad', 'rs'].includes(v.dataType) && (v.videoSrc || v.mp4b_url) && !info.list.some(s => s.vid == v.vid));
    info.list = [].concat(info.list).concat(list.map(v => {
      return {
        image: v.imgSrc,
        src: v.videoSrc || v.mp4b_url,
        title: v.originTitle,
        duration: v.duration,
        vid: v.vid,
        type: v.dataType,
        heji: v.dataType == 'heji' && getUrlParams(decodeURIComponent(v.strongUrlParams.sfUrl)) || {},
        count: v.number || 0
      }
    }))
  })
}

function btnClear() {
  info.serchText = "";
  info.page = 1;
  info.list = [];
  info.isBotom = false;
  info.scroll = 0;
  info.isNext = false;
}

function onPage() {
  initData(info.page + 10);
}
</script>

<style lang='less'>
</style>