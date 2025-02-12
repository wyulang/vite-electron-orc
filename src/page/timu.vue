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
        <div ref="contents" style="-webkit-app-region: no-drag;" @input="changeContent" class="w-all fs-16 pp20 lh-22" contenteditable="true" v-html="info"></div>
      </scroll>
    </div>
  </div>

  <drawer width="1000" v-model="isAdd">
    <div class="w-all">
      <div v-for="item in list" class="fd-c">
        <div class="flex ">
          <Select v-model="item.subType" :data="['填空','单选','多选']"></Select>
        </div>
        <div class="flex w-all fd-c">
          <div class="flex ai-c w-all fc-000">{{item.title}}</div>
        </div>
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

const info = ref("")
const list = ref([])
const contents = ref("")
const details = ref("")

function changeContent(e) {
  details.value = e.srcElement.innerText.replace(/<br>/g, '').split('$');
}

function toCapture() {
  yy.spinner.show({ type: 5, message: '处理中...' })
  window.storeApi.ipcRenderer('capture-image', { orc: true }).then(res => {
    console.log(res)
    yy.spinner.close()
    // console.log(res);
    info.value = String(res.text.text).replace(/.。？/g, "：").replace(/[\n]+/g, '<br>')
    details.value = info.value;
    // info.value=String(res.text).replace(/\n/g,'<br>')
    // document.getElementById('capture').src = res.image;
  }).catch(res => {
    console.log(res)
  })
}
</script>

<style lang='less'>
</style>