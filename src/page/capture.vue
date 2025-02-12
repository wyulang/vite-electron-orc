<template>
  <div @mousedown="drgDown" @dblclick="btntools" @contextmenu="btnClose" ref="capBody" :class="{'ba-f8':info.isSha}" class="w-all rel rel hv-all">
    <div class="boxsree abs ba-5" ref="sreen"></div>
    <img ref="capimage" class="al0 rel  at0" style="display: none;" src="" alt="">
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import yy from '@lib/mixin';
const sreen = ref(null)
const capimage = ref(null)
const capBody = ref(null)
const info = reactive({
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  by: 0,
  bx: 0,
  isSha: true
})


const currScreen = ref(null);
const screenList = ref([]);
window.storeApi.ipcRenderer('getSources').then(res => {
  screenList.value = res;
  currScreen.value = res[0];

  getBackgroundImage()
})

function drgDown(e) {
  info.bx = e.clientX;
  info.by = e.clientY;
  document.onmousemove = e => {
    let sx = e.clientX;
    let sy = e.clientY;
    if (info.bx) {
      sreen.value.style.left = info.bx + 'px';
      sreen.value.style.top = info.by + 'px';
      sreen.value.style.width = (sx - info.bx) + 'px';
      sreen.value.style.height = (sy - info.by) + 'px';
      info.width = (sx - info.bx);
      info.height = (sy - info.by);
    }
  }
  document.onmouseup = () => {

    // 鼠标弹起来的时候不再移动
    document.onmousemove = null
    // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
    document.onmouseup = null;
    sreen.value.style.display = "none";
    getBackgroundImage()
  }
}

function getBackgroundImage() {
  const style = document.createElement('style');
  style.textContent = ` html, body {cursor: none;overflow: hidden;}`;
  document.head.appendChild(style);
  const ratio = window.devicePixelRatio || 1;
  navigator.mediaDevices.getUserMedia({
    audio: false,
    cursor: 'never',
    video: {
      cursor: 'never',
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: currScreen.value.id,
        minWidth: window.screen.width,
        maxWidth: window.screen.width * ratio,
        minHeight: window.screen.height,
        maxHeight: window.screen.height * ratio,
      }
    }
  }).then(stream => {
    // 创建 video 标签并设置 srcObject 为获取到的流
    const video = document.createElement('video');
    video.className = "abs ab0 al0"
    video.srcObject = stream;
    info.isSha = false;
    video.playsInline = true; // 这个属性是为了让视频可以内联播放
    video.play()
    // 确保视频加载完毕
    video.onloadedmetadata = () => {
      info.isSha = false;
      // 创建 canvas 并绘制 video 的内容
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      // 将 canvas 转换成 base64 图片数据URL
      capimage.value.src = canvas.toDataURL('image/png');


      // 创建一个a标签并设置其属性
      var link = document.createElement('a');
      link.href = capimage.value.src;
      link.download = 'myImage.png'; // 指定下载的文件名

      // 将a标签添加到文档中（虽然它是隐藏的，但这一步是必要的）
      document.body.appendChild(link);
      link.click(); // 触发点击事件以下载图片
      document.body.removeChild(link);
      setTimeout(() => {
        video.remove()
        stream.getTracks()[0].stop()
        capimage.value.style.display = "";
        // document.head.removeChild(style)
        canvas.remove()
      }, 0);
    };
  })

}


function btnClose() {
  window.storeApi.ipcRenderer('close-capturer')
}
</script>

<style lang='less'>
.boxsree {
  border: 3px dashed rgb(0, 223, 19);
}
.bctrans {
  background-color: transparent !important;
}
body,
html {
  background-color: transparent !important;
}
</style>