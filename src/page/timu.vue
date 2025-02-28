<template>
  <div class="w-all flex pl15 h-all fd-c pr5">
    <div class="flex h-33 pt10 ai-c">
      <span @click="toCapture" class="fc-aa nodarg fs-24 fb iconfont icon-quyujieping hand pp5"></span>
      <span @click="isAdd=true" class="iconfont icon-tianjia2 nodarg hand fs-29 ml10 fc-success"></span>
    </div>
    <div class="h-15"></div>
    <div class="flex-1 h-all w-all">
      <scroll>
        <div class="rel drag-select">
          <img :src="captureInfo.image" style="visibility: hidden;" class="rel zi-100" alt="">
          <div @dblclick="isAdd=true" class="abs at0 al0 h-all  zi-130 w-all ar0">
            <div v-copy="item.text" class="abs b-e pp3 fs-14 drag-select" :style="item.style" v-for="item in captureInfo.text">{{item.text}}</div>
          </div>
        </div>
      </scroll>
    </div>
  </div>

  <drawer width="1000" v-model="isAdd">
    <template v-slot:btn>
      <div class="flex flex-1 ai-c">
        <span @click="btnAddTimu" class="iconfont ml20 icon-tianjia4 fs-30 nodarg hand fc-danger"></span>
        <Select v-model="info.nianji" class="w-90 ml10 nodarg" props="t,v" :data="nianji"></Select>
        <Select v-model="info.kemu" class="w-90 ml10 nodarg" props="t,v" :data="[{t:'语文',v:0},{t:'数学',v:1},{t:'英语',v:2},{t:'科学',v:3}]"></Select>
        <tooltip click class="ml10">
          <span class="hand pp5">符号</span>
          <template v-slot:content>
            <div class="w-500 pp20 flex fw">
              <span class="w-40 h-40 flex ai-c jc-c fs-20 mb10 hand mr10 b-e" v-copy="item" v-for="item in fuhao">{{item}}</span>
            </div>
          </template>
        </tooltip>
        <span class="flex-1"></span>
        <div @click="mvalue=false" class="btn hand btn-small ml20 btn-default ra-4">取消</div>
        <div @click="btnSave()" v-dubclick class="btn hand btn-small btn-primary fc-fff pl20 pr20 ml10 ra-4">保存</div>
      </div>
    </template>
    <div class="w-all pp20">
      <div v-for="item,i in list" class="fd-c flex mb20">
        <div class="flex ai-c">
          <span @click="list.splice(i,1)" class="iconfont icon-guanbi nodarg hand fb fc-danger fs-23 mr10"></span>
          <span class="fs-20 fb">{{i+1}}、</span>
          <Select v-model="item.subType" class="w-100 h-40" :data="['填空','单选','多选','对错']"></Select>
          <tooltip space="7" class="flex-line" content="值为1时为竖排，大于1时为横排">
            <input v-model="item.isheng" class="ipt pl10 pr10 ml10 h-40 w-50 ipt-auto ra-4" type="text">
          </tooltip>
          <tooltip class="flex-line" content="整图题">
            <span @click="capImage(item,1)" class="ml10 pt10 pb10 iconfont hand icon-mti-jietu fs-25 fc-success"></span>
          </tooltip>
          <tooltip class="flex-line" content="列表说明图片">
            <span @click="capImage(item,2)" class="ml10 pt10 pb10 iconfont hand icon-mti-jietu fs-25 fc-success"></span>
          </tooltip>
          <upfile @change="v=>{changeImage(v,item)}" class="mt10 h-35">
            <span class="ml10 iconfont icon-shangchuan fs-25 icon-shangchuan"></span>
          </upfile>
        </div>
        <div class="flex pl64 pt10 fd-c">
          <textarea v-model="item.title" class="w-all h-60 ipt ipt-auto pp10" placeholder="输入标题"></textarea>
        </div>
        <div class="flex pl64 pt10 fd-c">
          <input placeholder="其它说明" v-model="item.remark" type="text" class="pl10 b-d ra-4 hi-40 flex-1 pr10 pt5 pb5">
        </div>
        <div class="flex pl64 pt10 fd-c">
          <textarea v-model="item.timu" @dblclick="dblTimu(item)" class="w-all h-60 ipt ipt-auto pp10" placeholder="请输入题目选项列，请用逗号隔开"></textarea>
          <div class="w-all flex fw">
            <div v-for="v,j in item.list" :style="{width:100/Number(item.isheng)+'%'}" class="flex fs-14 mt5 ai-c">
              <span>{{j+1}} > {{v.title}}</span>
              <span v-if="['单选','多选'].includes(item.subType)" @click="v.ok=!v.ok" :class="v.ok?'fc-primary icon-checkbox_on':'fc-999 icon-checkbox_nor'" class="iconfont fs-18 hand ml10"></span>
            </div>
          </div>
        </div>
        <div class="w-all pl54 flex rel fw mt10">
          <div v-for="p in item.pic" class="w-120 h-120 b-d ml10 ra-5 flex-line rel">
            <span @click="item.pic.splice(i,1)" class="abs ar10 at10 iconfont hand icon-qingkong-2-xiao zi-120 fc-danger fs-25"></span>
            <img :src="p" @click="st.isPic=p" class="w-all rel zi-100 h-all  ra-5" alt="">
          </div>
        </div>
      </div>
    </div>
  </drawer>
</template>

<script setup lang='ts'>
import { reactive, ref, watch } from 'vue';
import yy from '@lib/mixin';
import useStore from '../store';
const isAdd = ref(false);
const st = useStore();
import { useRoute, useRouter } from 'vue-router';
const rt = useRouter();
const fuhao = ['+', '-', '×', '÷', '=', '≠', '≈', '<', '>', '≤', '≥']
const nianji = [
  { t: '一年级上', v: 1 },
  { t: '一年级下', v: 1 },
  { t: '二年级上', v: 1 },
  { t: '二年级下', v: 1 },
  { t: '三年级上', v: 2 },
  { t: '三年级下', v: 2 },
  { t: '四年级上', v: 3 },
  { t: '四年级下', v: 3 },
  { t: '五年级上', v: 4 },
  { t: '五年级下', v: 4 },
  { t: '六年级上', v: 5 },
  { t: '六年级下', v: 5 },
  { t: '初一上', v: 6 },
  { t: '初一下', v: 6 },
  { t: '初二上', v: 7 },
  { t: '初二下', v: 7 },
  { t: '初三上', v: 8 },
  { t: '初三下', v: 8 }
]

const info = reactive({
  nianji: "",
  kemu: ""
})

const reamark = ref("")
const list = ref([])
const contents = ref("")
const details = ref("")

function changeContent(e) {
  details.value = e.srcElement.innerText.replace(/<br>/g, '').split('$');
}

function dblTimu(item) {
  if (item.timu) {
    item.list = item.timu.split(',').map(v => {
      return { title: v, ok: false }
    })
  }
}

function capImage(item, type) {
  window.storeApi.ipcRenderer('capture-image', { sharp: true }).then(res => {
    // console.log(res);
    // changeTrans(item, res.image)
    // item.pic.push(res.image)
    changeTrans(item, res.image, type)
  })
}

function changeImage(data, item) {
  const reader = new FileReader();
  reader.readAsDataURL(data.file);
  reader.onload = e => {
    // item.pic.push(e.target?.result)
    changeTrans(item, e.target?.result)
  }
}

//图片背景透明化处理
function changeTrans(item, base64, type, rgba = [255, 255, 255, 255]) {
  const img = new Image();
  img.src = base64;
  img.onload = () => {
    // 容差大小
    const tolerance = 40;

    var imgData = null;
    const [r0, g0, b0, a0] = rgba;
    var r, g, b, a;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const w = img.width;
    const h = img.height;

    canvas.width = w;
    canvas.height = h;
    context.drawImage(img, 0, 0);
    imgData = context.getImageData(0, 0, w, h);

    for (let i = 0; i < imgData.data.length; i += 4) {
      r = imgData.data[i];
      g = imgData.data[i + 1];
      b = imgData.data[i + 2];
      a = imgData.data[i + 3];
      const t = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2 + (a - a0) ** 2);
      if (t <= tolerance) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 0;
      }
    }
    context.putImageData(imgData, 0, 0);
    const newBase64 = canvas.toDataURL('image/png');
    // if (rgba[0] == 255) {
    //   changeTrans(item, newBase64, [0, 0, 0, 255])
    // } else {
    // item.pic.push(newBase64)
    // }
    if (type == 1) {
      item.titlePic = newBase64;
    } else {
      item.pic.push(newBase64)
    }
  }
}

function btnSave() {
  if (!info.kemu || !info.nianji) {
    yy.msg.error('请选择班级或科目');
    return;
  }
  if (list.value.some(v => v.timu.length && !v.list?.length)) {
    yy.msg.error('请完成题目转换');
    return;
  }
  let sql = `insert into exercise (name,nianji,kemu,type,titlePic,pic,remark,ctime) values ${list.value.map(item => { return `('${item.title}','${info.nianji}','${info.kemu}','${item.subType}','${item.titlePic}','${item.pic && JSON.stringify(item.pic)}','${item.remark}','${new Date().getTime()}')` }).toString()} returning id`
  ddb.all({ sql }).then(res => {
    if (res.code == 200) {
      sql = `insert into exerciseList (tid,title,ctime,ok) values `
      let cql = `${list.value.map((v, i) => {
        if (v.list && v.list.length) {
          return v.list.map(child => {
            return `('${res.data[i].id}','${child.title}','${new Date().getTime()}','${child.ok}')`
          }).toString()
        } else {
          return ''
        }
      }).filter(v => v).toString()}
      `
      if (cql) {
        ddb.run({ sql: sql + cql })
      }
    }
  })
}

function btnAddTimu() {
  list.value.push({
    subType: "",
    title: "",
    timu: "",
    pic: [],
    isheng: 1
  })
}

const captureInfo = ref({})
function toCapture() {
  yy.spinner.show({ type: 5, message: '处理中...' })
  window.storeApi.ipcRenderer('capture-image', { orc: true }).then(res => {
    console.log(res)
    yy.spinner.close()
    if (res.text.code == 100) {
      reamark.value = res.text.data.map(v => v.text).join('<br>')
      captureInfo.value = {
        image: res.image,
        text: res.text.data.map(v => {
          return {
            style: `left:${v.box[0][0]}px;top:${v.box[0][1]}px`,
            text: v.text
          }
        })
      }
      console.log(captureInfo.value, '------------------');

    }
    // document.getElementById('capture').src = res.image;
  }).catch(res => {
    console.log(res)
    yy.spinner.close()
  })
}
</script>

<style lang='less'>
.drag-select {
  -webkit-app-region: no-drag;
}
</style>