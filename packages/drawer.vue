<template>
  <div ref="drawers" class="drawer">
    <div :class="maskClass" :style="maskStyle" class="nodarg" @click="closeByMask"></div>
    <div :class="mainClass" :style="mainStyle" class="main flex fd-c">
      <div class="drawer-head fs-16 ai-c">
        <span class="fb ">{{ title }}</span>
        <slot name="btn"></slot>
      </div>
      <div v-if="isRef" :class="{'h-all auto':auto}" class="drawer-body rel flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, ref, watch } from "vue"

const ps = defineProps({
  title: { type: String, default: "标题" },
  // 遮罩 开启，关闭
  mask: { type: Boolean, default: true },
  // 内容高度撑到div容器最高后 是否 显示滚动条
  auto: { type: Boolean, default: true },
  // 关闭事件
  maskClosable: { type: Boolean, default: true },
  width: { type: String, default: "400px" },
  // 某个元素内部显示
  inner: { type: Boolean, default: false },
  zindex: { type: [String, Number] },
  onClose: { type: Function },
  modelValue: { default: false }
})

const emit = defineEmits(["update:modelValue", "change"]);

const drawers = ref(null)
const isRef = ref(false)

const maskClass = computed(() => {
  return {
    'mask-show': (ps.mask && ps.modelValue),
    'mask-hide': !(ps.mask && ps.modelValue),
    'inner': ps.inner
  }
})

const mainClass = computed(() => {
  return {
    'main-show': ps.modelValue,
    'main-hide': !ps.modelValue,
    'inner': ps.inner
  }
})

watch(() => ps.modelValue, (news, old) => {
  if (news) {
    document.body.className = document.body.className + ' hideScrol';
    nextTick(()=>{
      isRef.value=true;
    })
  } else {
    document.body.className = document.body.className.replace(' hideScrol', "");
    isRef.value=false;
  }
})

const mainStyle = computed(() => {
  let width = ps.width;
  if (ps.width.includes('%')) {
    width = ps.width;
  } else if (!isNaN(ps.width)) {
    width = ps.width + 'px';
  }
  let zindex = 8889;
  if (ps.zindex) {
    zindex = ps.zindex + 1;
  }
  return {
    width: width,
    right: ps.modelValue ? '0' : `-${width}`,
    borderLeft: ps.mask ? 'none' : '1px solid #eee',
    'z-index': zindex
  }
})

const maskStyle = computed(() => {
  let zindex = 8888;
  if (ps.zindex) {
    zindex = ps.zindex;
  }
  return {
    'z-index': zindex
  }
})

onMounted(() => {
  if (ps.inner) {
    let box = drawers.value.parentNode
    box.style.position = 'relative'
  }
})

function closeByMask() {
  if (ps.onClose) {
    ps.onClose()
  }
  emit("change","")
  ps.maskClosable && emit('update:modelValue', false)
}


function closeByButton() {
  emit('update:modelValue', false)
}
</script>

<style lang='less'>
.hideScrol {
  height: 100vh;
  overflow: hidden;
}
.drawer {
  /* 遮罩 */
  .mask-show {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 1;
    transition: opacity 0.2s;
    z-index: 8888;
  }
  .mask-hide {
    opacity: 0;
    transition: opacity 0.2s;
  }
  /* 滑块 */
  .main {
    position: fixed;
    z-index: 8889;
    top: 0;
    height: 100%;
    background: #fff;
    transition: all 0.2s;
    box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
      0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px;
  }
  .main-show {
    opacity: 1;
  }
  .main-hide {
    opacity: 0.8;
  }
  /* 某个元素内部显示 */
  .inner {
    position: absolute;
  }
  /* 其他样式 */
  .drawer-head {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
    .close-btn {
      display: inline-block;
      cursor: pointer;
      height: 100%;
      padding-left: 20px;
    }
  }
  .drawer-body {
  }
}
</style>