<template>
  <div class="w-all flex pl15 h-all fd-c pr5">
    <div class="flex h-33 pt10 ai-c">
      <span @click="toCapture" class="fc-aa nodarg fs-24 fb iconfont icon-quyujieping hand pp5"></span>
      <span @click="isAdd=true" class="iconfont icon-tianjia2 nodarg hand fs-29 ml10 fc-success"></span>
      <span v-copy="'$'" class="ml10 nodarg pp10 fs-16 hand fc-999">大题</span>
      <span v-copy="'$1'" class="ml10 nodarg pp10 fs-16 hand fc-999">小题</span>
      <span v-copy="'$2'" class="ml10 nodarg pp10 fs-16 hand fc-999">小标</span>
      <span v-copy="'$k'" class="ml10 nodarg pp10 fs-16 hand fc-999">括号</span>
      <span v-copy="'$x'" class="ml10 nodarg pp10 fs-16 hand fc-999">下划线</span>
    </div>
    <div class="h-15"></div>
    <div class="flex-1 h-all w-all">
      <scroll>
        <div ref="contents" style="-webkit-app-region: no-drag;" @input="changeContent" class="w-all fs-16 pp20 lh-22" contenteditable="true" v-html="reamark"></div>
      </scroll>
    </div>
  </div>

  <drawer width="1000" v-model="isAdd">
    <template v-slot:btn>
      <div class="flex flex-1 ai-c">
        <span @click="btnAddTimu" class="iconfont ml20 icon-tianjia4 fs-30 nodarg hand fc-danger"></span>
        <span class="flex-1"></span>
        <div @click="mvalue=false" class="btn hand btn-small ml20 btn-default ra-4">取消</div>
        <div @click="btnSave()" v-dubclick class="btn hand btn-small btn-primary fc-fff pl20 pr20 ml10 ra-4">保存</div>
      </div>
    </template>
    <div class="w-all pp20">
      <div v-for="item,i in list" class="fd-c flex mb20">
        <div class="flex ai-c">
          <span class="iconfont icon-guanbi nodarg hand fb fc-danger fs-23 mr10"></span>
          <span class="fs-20 fb">{{i+1}}、</span>
          <Select v-model="item.subType" class="w-100 h-40" :data="['填空','单选','多选']"></Select>
          <input placeholder="输入标题" type="text" class="pl10 b-d ra-4 h-40 flex-1 ml10 pr10 pt5 pb5">
          <span class="iconfont icon-xinjianziji nodarg hand ml10 fs-30 fc-aa"></span>
        </div>
        <div class="flex fw"></div>
      </div>
    </div>
  </drawer>
</template> 

<script setup lang='ts'>
import { ref, watch } from 'vue';
import yy from '@lib/mixin';
import useStore from '../store';
const isAdd = ref(false);
const st = useStore();
import { useRoute, useRouter } from 'vue-router';
const rt = useRouter();

const reamark = ref("")
const list = ref([])
const contents = ref("")
const details = ref("")

function changeContent(e) {
  details.value = e.srcElement.innerText.replace(/<br>/g, '').split('$');
}

function btnAddTimu() {
  list.value.push({
    subType: "",
    title: ""
  })
}

function toCapture() {
  yy.spinner.show({ type: 5, message: '处理中...' })
  window.storeApi.ipcRenderer('capture-image', { orc: true }).then(res => {
    console.log(res)
    yy.spinner.close()
    if (res.text.code == 100) {
      reamark.value = res.text.data.map(v => v.text).join('<br>')
    }
    // document.getElementById('capture').src = res.image;
  }).catch(res => {
    console.log(res)
    yy.spinner.close()
  })
}
</script>

<style lang='less'>
</style>