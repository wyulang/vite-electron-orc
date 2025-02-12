<template>
  <div class="w-all flex pl15  h-all fd-c pr5">
    <div @click="$router.go(-1)" class="flex nodarg h-33 pt10 ai-c">
      <span class="fs-13  hand fc-aa fb">返回</span>
    </div>
    <div style="min-height:15px" class="h-15"></div>
    <div class="flex h-all">
      <scroll @scroll="onScroll">
        <div class="flex w-all fw">
          <div v-for="item in info.list" @click="onVideoDetail(item)" :style="{backgroundImage:`url('${item.avatar||item.vertical_poster}')`}" class="wb-32 bs-c nodarg hand rel hidden sha-6 mt10 ra-5 mr10 bp-all h-250">
            <div class="pl10 pr10 fc-fff flex pt7 pb7 fs-16 ai-c ba-5 w-all">{{item.heji_title}}</div>
            <span class="abs al10 fs-16 pp5 ba-5 ra-5 ab10 fc-fff">{{item.duration}}</span>
            <span class="iconfont fs-33 icon-mv fc-fff abs absc"></span>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import yy from '@lib/mixin';
import useStore from '../store';
const st = useStore();
const info = reactive({
  hejiLoc: "",
  pn: 0,
  list: [],
  isNext: false,
  scroll: 0,
  isBotom: false
})
function initData() {
  if (info.isBotom) return;
  yy.spinner.show()
  window['storeApi'].ipcRenderer('baidu-video-heji', { ...st.heji, pn: info.pn, hejiLoc: info.hejiLoc }).then(res => {
    console.log(res);
    
    yy.spinner.close()
    if (!String(res)) {
      info.isNext = true;
      return;
    };
    info.isNext = false;
    if (!res.error && !info.hejiLoc) {
      info.hejiLoc = res.data.asResult.item[0].result.CompilationVideos.data.compilaInfo.loc;
    }
    if (res.data.asResult.item[0].result.CompilationVideos.data.videoInfo.length) {
      info.pn = info.pn + 10;
      info.list =info.list.concat(res.data.asResult.item[0].result.CompilationVideos.data.videoInfo);
    }else{
      data.isNext=true;
    }
  })
}

function onVideoDetail(item) {
  st.play.url =item.ori_playUrlForWeb|| item.video_src||item.video_bos_url;
}

function onScroll(data) {
  if (data.isBottom) {
    if (info.isNext || info.scroll > data.top) {
      return;
    }
    info.scroll = data.top;
    info.isNext = true;
    setTimeout(() => {
      initData(info.pn + 10);
    }, 10);
  }
}

initData();
</script>

<style lang='less'>
</style>