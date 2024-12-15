<template>
  <section ref="scrolls" :class="scollClassStyle.class" @mouseleave="onOut" @mousemove="onMove" class="__scroll w-all h-all rel">
    <!-- 内容 -->
    <main ref="main" @scroll="onScroll" :class="mainClass" :style="[scollClassStyle.style]" class="scrollbar-contaniner w-all h-all">
      <slot></slot>
    </main>

    <!-- 滚动条属性 -->
    <transition name="scrollbar-fade">
      <section style="background:#cfcfcf33;" @click.stop v-show="info.visible" ref="instance" @mousedown.stop="clickTrackHandler" class="abs w-9 ar3 ab2 zi-150 ra-4 at2">
        <div ref="thumb" :style="thumbStyle" @mousedown.stop="clickThumbHandler" class="rel w-all zi-160 hand ra-4"></div>
      </section>
    </transition>
  </section>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, onUpdated, reactive, ref, watch, watchEffect } from "vue";
const scrolls = ref(null);
const ps = defineProps({
  width: { type: [String, Number], default: 0 },
  maxHeight: { type: [String, Number], default: "" },
  height: { type: [String, Number], default: "" },
  class: { type: String, default: "" },
  mainClass: { type: String, default: "" },
  mainStyle: { type: [String, Object], default: "" },
  name: { type: [String, Number], default: "" },
  // 内容有变是否自动滚动到最底部
  bottom: { type: Boolean, default: false },
  //指定滚动到指定位置 auto="333"
  auto: { type: [String, Number], default: "" }
})

const emit = defineEmits(["scroll"]);

const instance = ref(null);
const thumb = ref(null);
const main = ref(null);

const info = ref({
  isAbs: false,
  myHeight: 0,
  visible: false,
  hover: false,
  scrollHeight: 0,
  scrollValue: 0,
  Y: 0,
  onselectstartStore: null,
  isMove: false,
  height: 0, //css与style 里面写的高度
  maxHeight: 0 //css或style 里面写的max-height
})

const scollClassStyle = computed(() => {
  let cls = {
    style: {},
    class: {
      [ps.class]: true,
    }
  }

  if (ps.height) {
    cls.style.height = parseFloat(ps.height) + 'px';
  }

  if (ps.maxHeight || info.value.maxHeight) {
    cls.style.maxHeight = (parseFloat(ps.maxHeight) || info.value.maxHeight) + 'px';
  }

  if (info.value.isAbs) {
    cls.class['abs at0 ab0 al0 ar0'] = true;
  }
  return cls;
})

function onScroll(e) {
  info.value.scrollValue = (e.srcElement.scrollTop * 100) / info.value.myHeight;
  
  emit('scroll', {
    scrollTop: info.value.scrollValue,
    top: e.srcElement.scrollTop,
    // 是否到最底部
    isBottom: (e.target.offsetHeight + e.srcElement.scrollTop) >= e.srcElement.scrollHeight,
    // 是否到最顶部
    isTop: e.srcElement.scrollTop <= 0
  })
}

function clickTrackHandler(e) {
  e.stopPropagation()
  let offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY)
  const thumbHalf = thumb.value.offsetHeight / 2;
  const thumbPositionPercentage = ((offset - thumbHalf) * 100 / instance.value.offsetHeight);
  main.value.scrollTop = (thumbPositionPercentage * info.value.scrollHeight / 100);
  main.value.scrollTop = 200
}

const thumbStyle = computed(() => {
  let translate = `translateY(${info.value.scrollValue}%)`;
  return {
    'height': thumbHeight.value,
    'transform': translate,
    '-webkit-transform': translate,
    '-moz-transform': translate,
    'background-color': 'rgba(144,147,153,0.5)'
  }
})

function initScroll() {
  // 当有auto值时，且没有滚动过
  if (ps.auto && ps.auto > 0) {
    info.value.scrollValue = ((ps.auto > info.value.myHeight ? info.value.myHeight : ps.auto) * 100) / info.value.myHeight - 10;
    main.value.scrollTop = ps.auto;
  }
}

function clickThumbHandler(e) {
  e.stopPropagation()
  if (e.ctrlKey || [1, 2].includes(e.button)) {
    return
  }
  (document as any).getSelection().removeAllRanges()
  info.value.Y = (e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top));
  info.value.onselectstartStore = document.onselectstart
  document.onselectstart = () => false

  document.onmousemove = e => {
    info.value.isMove = true;
    if (!info.value.Y) return;
    const offset = ((instance.value.getBoundingClientRect().top - e.clientY) * -1)
    const thumbClickPosition = (thumb.value.offsetHeight - info.value.Y)
    const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / instance.value.offsetHeight)
    main.value.scrollTop = (thumbPositionPercentage * info.value.scrollHeight / 100)
  }

  document.onmouseup = e => {
    info.value.isMove = false;
    info.value.Y = 0
    document.onmousemove = null
    // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
    document.onmouseup = null
    document.onselectstart = info.value.onselectstartStore;
  }
}

function onMove(e) {
  info.value.hover = true;
  info.value.scrollHeight = main.value.scrollHeight;
  if (thumbHeight.value) {
    info.value.visible = true
  } else {
    info.value.visible = false;
  }
}

function onOut(e) {
  if (!info.value.isMove) {
    info.value.hover = false;
    info.value.visible = false;
  }
}

// 滚动条高度
const thumbHeight = computed(() => {
  let sh = (info.value.myHeight * 100) / info.value.scrollHeight;
  return sh < 100 ? sh + '%' : '';
})

watchEffect(() => {
  if (scrolls.value) {
    let parentStyle = getComputedStyle(scrolls.value.parentElement);
    if (parentStyle.flexBasis == '0%' && parentStyle.flexShrink == 1 && parentStyle.flexGrow == 1) {
      info.value.isAbs = true;
      scrolls.value.parentElement.style.position = "relative";
      parentStyle = null;
    }
    initScroll();
  }
})

onMounted(() => {
  nextTick(() => {
    getHeight()
  })
})

onUpdated(() => {
  nextTick(() => {
    getHeight()
  }).then(res => {
    if (ps.bottom) {
      main.value.scrollTop = main.value.scrollHeight + 1000;
    }
  })
})

function getHeight() {
  if (scrolls.value) {
    info.value.myHeight = scrolls.value.offsetHeight;
    info.value.scrollHeight = main.value.scrollHeight;
    let box = getComputedStyle(scrolls.value);
    if (box && box.maxHeight) {
      info.value.maxHeight = parseFloat(box.maxHeight);
    }
  }
}

window.addEventListener('resize', function () {
  getHeight()
}, false);
</script>

<style lang='less'>
.scollrel {
  position: relative;
}
.__scroll {
  .scrollbar-contaniner {
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .scrollbar__thumb {
    transition: background-color 0.3s;
  }

  .scrollbar__thumb:hover {
    background-color: rgba(144, 147, 153, 0.5);
  }

  .scrollbar-fade-enter-active {
    transition: opacity 0.34s ease-out;
  }

  .scrollbar-fade-leave-active {
    transition: opacity 0.12s ease-out;
  }

  .scrollbar-fade-enter-from,
  .scrollbar-fade-leave-active {
    opacity: 0;
  }
}
</style>