<template>
  <section v-if="isRel" @click="checkBefore" ref="dropArea" :class="class" class="_upfile">
    <!-- button 自定义内容 -->
    <div class="w-all h-all rel" v-if="isSlot">
      <input ref="upfile" @change="onUpFile(1)" title=" " :multiple="more" :accept="accept" class="abs op-0 fs-0 zi-110 w-all hand at0 ab0 ar0 ab0" type="file">
      <div class="w-all rel zi-100 h-all">
        <slot></slot>
      </div>
    </div>

    <!-- 图片上传 -->
    <div v-else :class="{'upfile-upload':!modelValue}" class="tis-value wi-50 flex ai-c jc-c fd-c ra-5 hi-50 w-all rel h-all">
      <input ref="upfile" @change="onUpFile(1)" title=" " :multiple="more" :accept="accept" class="abs op-0 fs-0 zi-140 w-all hand at0 ab0 ar0 ab0" type="file">

      <!-- 未上传 -->
      <div v-if="!modelValue" class="flex ai-c jc-c fd-c">
        <span v-if="!icon" class="fs-20">
          <svg viewBox="0 0 1024 1024" style="fill:#999" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2400" width="20" height="20">
            <path
              d="M906.212134 565.732986 565.732986 565.732986 565.732986 906.212134C565.732986 926.013685 541.666486 959.972 511.97312 959.972 482.297674 959.972 458.213254 926.013685 458.213254 906.212134L458.213254 565.732986 117.734106 565.732986C97.950475 565.732986 63.97424 541.666486 63.97424 511.97312 63.97424 482.279754 97.950475 458.213254 117.734106 458.213254L458.213254 458.213254 458.213254 117.734106C458.213254 97.950475 482.297674 63.97424 511.97312 63.97424 541.666486 63.97424 565.732986 97.950475 565.732986 117.734106L565.732986 458.213254 906.212134 458.213254C925.995765 458.213254 959.972 482.279754 959.972 511.97312 959.972 541.666486 925.995765 565.732986 906.212134 565.732986Z">
            </path>
          </svg>
        </span>
        <span :class="icon" v-else class="iconfont"></span>
        <span v-if="tip" class="fs-14 mt10 tip wrap centers fc-bbb pl20 pr20">{{tip}}</span>
      </div>

      <!-- 已上传 -->
      <div v-else :style="{'background-image':`url('${modelValue}')`}" class="w-all bc-f6  bs-c rel bp-all ra-5 h-all flex-1">
        <div class="w-all abs al0 boxs ra-5  h-all ba-7 ra-6 ai-c jc-c">
          <svg t="1687330676667" style="fill:#fff" class="w-22 h-22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2258" width="16" height="16">
            <path
              d="M726.109091 886.690909H195.490909c-18.618182 0-34.909091 16.290909-34.909091 34.909091s16.290909 34.909091 34.909091 34.909091h532.945455c18.618182 0 34.909091-16.290909 34.909091-34.909091s-16.290909-34.909091-37.236364-34.909091zM249.018182 830.836364l146.618182-6.981819c27.927273 2.327273 53.527273-9.309091 72.145454-27.927272l279.272727-279.272728-269.963636-269.963636-279.272727 279.272727c-18.618182 18.618182-27.927273 44.218182-27.927273 69.818182l-11.636364 137.309091v4.654546c0 25.6 11.636364 48.872727 27.927273 65.163636 16.290909 16.290909 37.236364 25.6 62.836364 27.927273zM856.436364 269.963636l-132.654546-132.654545c-37.236364-37.236364-100.072727-37.236364-137.309091 0l-60.509091 60.509091 269.963637 269.963636 60.509091-60.509091c37.236364-39.563636 37.236364-100.072727 0-137.309091z">
            </path>
          </svg>
          <span class="fs-16 ml2 fc-fff">修改</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref, useSlots } from "vue";
const ps = defineProps({
  // 上传索引，主要针对for list 里的index 传什么返回什么
  index: { type: [String, Number, Object], default: 0 },
  // 上传文件大小
  max: { type: [String, Number], default: 0 },
  // 框内提示语
  tip: { type: String, default: '' },
  // 多文件上传 是否可以一次选多文件
  more: { type: Boolean, default: true },
  // 框内ICON 图标
  icon: { type: String, default: '' },
  // 上传CSS
  class: { type: String, default: 'w-all' },
  // 上传文件类型
  accept: { type: String, default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg' },
  // 上传后返回的值
  modelValue: { type: [String, Number, Boolean], default: "" },
  // 上传事件
  upSuccess: { type: Function },
  change: { type: Function },
  // 上传前事件 必需返回 return falas|true
  beforeUpload: { type: Function },
  // 是否返回当前选中的所有内容（所有选中图片，文件等）   true一次返回所有图片，false 一次返一张图片循环返回所有
  return: { type: Boolean, default: false }
})

const emit = defineEmits(["change"]);

const isSlot = ref(!!useSlots()?.default);
const isRel = ref(true);
const upfile = ref(null);
const dropArea = ref(null);

function checkBefore(e) {
  if (ps.beforeUpload && ps.beforeUpload()) {
    e.preventDefault();
  }
}

onMounted(() => {
  nextTick(() => {
    // 阻止浏览器默认行为
    dropArea.value.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });

    dropArea.value.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    // 处理拖放文件
    dropArea.value.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      changeFile(files);
    });
  })
})

function changeFile(files) {
  let max = Number(ps.max)
  let isMax = false;

  if (max && files[0].size > max) {
    isMax = true
  }

  if (ps.return) {
    ps.upSuccess && ps.upSuccess(ps.more ? [...files].map(v => v) : files, { isMax, index: ps.index })
    emit('change', { file: ps.more ? [...files].map(v => v) : files, isMax, index: ps.index })
  } else {
    if (ps.more) {
      [...files].forEach(v => {
        ps.upSuccess && ps.upSuccess(v, { isMax, index: ps.index })
        emit('change', { file: v, isMax, index: ps.index })
      })
    } else {
      ps.upSuccess && ps.upSuccess(files[0], { isMax, index: ps.index })
      emit('change', { file: files[0], isMax, index: ps.index })
    }
  }



  isRel.value = false;
  nextTick(() => {
    isRel.value = true;
  })
}

function onUpFile(ts) {
  let curr: any = upfile.value;
  let files = curr.files;
  changeFile(files)
}

</script>

<style lang='less'>
._upfile {
  .upfile-upload {
    border: 1px dashed #ddd;
    &:hover {
      border-color: #409eff;
      svg {
        fill: #409eff !important;
      }
      .tip {
        color: #409eff !important;
      }
    }
  }
  .tis-value {
    .boxs {
      display: none;
    }
    &:hover {
      .boxs {
        display: flex;
      }
    }
  }
}
</style>