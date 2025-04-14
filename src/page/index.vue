<template>
  <div class="w-all h-all">
    <webview :style="{visibility:vopacity}" id="myWebview" src="https://www.youdao.com/result?word=name&lang=en" class="nodarg w-all h-all"></webview>
  </div>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue';
import yy from '@lib/mixin';
const info: any = ref({})
const list: any = ref([])
const isModel = ref(false)
const query: any = ref({})
const vopacity = ref('hidden');
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      const webview = document.getElementById('myWebview');
      webview.executeJavaScript(`
      setTimeout(() => {
        document.querySelector('.footer_container').remove()
        document.querySelector('.result-top_nav').remove()
        document.querySelector('.top-banner-wrap').remove()
        document.querySelector('.dict_indexes-con').remove()
        document.querySelector('.feedback').remove()
        document.querySelector('.promo-ad').remove()
        document.querySelector('.input_con-fixed').style.boxShadow="0 2px 12px 0 rgba(0,0,0,.1)";
        document.querySelector('.input_con-fixed').style.paddingTop="30px";
      }, 700);
      `)
      setTimeout(() => {
        vopacity.value = ""
      }, 1000);
    }, 200);
  })
})
</script>

<style lang='less'>
</style>