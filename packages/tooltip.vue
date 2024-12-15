<template>
  <span :class="class" class="rel" ref="trigger">
    <slot></slot>
    <transition name="fade">
      <div style="width:max-content" class="pt10">
        <div @click.stop ref="bodys" v-show="isShow" :class="tipColor" :style="tipStyle.boyStyle" style="width:max-content" class="abs zi-3000 tipsha pt7 pb7 pl10 pr10 ra-4">
          <div :style="tipStyle.arrow" class="w-8 abs h-8"></div>
          <slot name="content">
            {{content}}
          </slot>
        </div>
      </div>
    </transition>
  </span>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, onUpdated, ref, useSlots, watchEffect } from "vue"
// 白色
// <tooltip click tipColor="sha-t bc-fff" bcolor="#fff"></tooltip>
const ps = defineProps({
  class: { type: String, default: "" },
  fcolor: { type: String, default: '#fff' },
  bcolor: { type: String, default: '#303133' },
  tipColor: { type: String, default: '' },
  placement: { type: String, default: 'bottom' },
  content: { type: String, default: '提示！' },
  maxWidth: { type: String, default: '500px' },
  // 间距
  space: { type: [Number, String], default: 0 },
  click: { type: Boolean, default: false }
})
const visible = ref(false);
const trigger = ref(null);
const slot = useSlots().default();
const bodys = ref(null);
const position = ref({ width: 0, heigth: 0 });
const options: any = ref({})
const emit = defineEmits(["change"]);
// modelValue v-model="value"
const mvalue = defineModel({ type: [String, Number, Object, Boolean], default: "" });

const isShow = computed(() => {
  if (typeof mvalue.value == "boolean") {
    return mvalue.value;
  } else {
    return visible.value;
  }
})

const tipStyle = computed(() => {
  let maxWidth = isNaN(ps.maxWidth) ? (ps.maxWidth + 'px') : ps.maxWidth;
  let positions = findParentWithCSS()?.getBoundingClientRect() || "";
  let arrow = ""
  let pt = {}
  switch (placearrow.value) {
    case "bottom":
      pt = { 'top': position.value.heigth + parseInt(ps.space) + 'px', 'left': "50%", 'transform': "translateX(-50%)" }
      arrow = `left: 50%;top:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
      if (positions) {
        if ((options.value.myLeft - positions.left) <= (options.value.myWidth / 2)) {
          pt = { 'top': position.value.heigth + parseInt(ps.space) + 'px', 'left': "0%" }
          arrow = `left: 15%;top:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
        }
        if ((options.value.myLeft + options.value.myWidth) > (positions.left + positions.width)) {
          pt = { 'top': position.value.heigth + parseInt(ps.space) + 'px', 'right': "0%" }
          arrow = `right: 15%;top:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
        }
      } else {
        if (options.value.myLeft < (options.value.myWidth / 2)) {
          pt = { 'top': position.value.heigth + parseInt(ps.space) + 'px', 'left': "0%" }
          arrow = `left: 15%;top:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
        }
        if (options.value.myLeft + (options.value.myWidth / 2) > options.value.screenWidth) {
          pt = { 'top': position.value.heigth + parseInt(ps.space) + 'px', 'right': "0%" }
          arrow = `right: 15%;top:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
        }
      }
      break;
    case "top":
      pt = { 'bottom': position.value.heigth + parseInt(ps.space) + 'px', 'left': "50%", 'transform': "translateX(-50%)" }
      arrow = `left: 50%;bottom:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
      if (positions) {
        if ((options.value.myLeft - positions.left) <= (options.value.myWidth / 2)) {
          pt = { 'bottom': position.value.heigth + parseInt(ps.space) + 'px', 'left': "0%" };
          arrow = `left: 15%;bottom:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`
        }
        if ((options.value.myLeft + options.value.myWidth) > (positions.left + positions.width)) {
          pt = { 'bottom': position.value.heigth + parseInt(ps.space) + 'px', 'right': "0%" }
          arrow = `right: 15%;bottom:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`
        }
      }else{
         if (options.value.myLeft < (options.value.myWidth / 2)) {
          pt = { 'bottom': position.value.heigth + parseInt(ps.space) + 'px', 'left': "0%" }
          arrow = `left: 15%;top:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
        }
        if (options.value.myLeft + (options.value.myWidth / 2) > options.value.screenWidth) {
          pt = { 'bottom': position.value.heigth + parseInt(ps.space) + 'px', 'right': "0%" }
          arrow = `right: 15%;top:-4px; transform:translateX(-50%) rotate(45deg);background-color:${ps.bcolor}`;
        }
      }
      break;
    case "left":
      pt = { 'right': position.value.width + parseInt(ps.space) + 'px', 'top': "50%", 'transform': "translateY(-50%)" }
      arrow = `top: 50%;right:-4px; transform:translateY(-50%) rotate(45deg);background-color:${ps.bcolor}`;
      break;
    case "right":
      pt = { 'left': position.value.width + parseInt(ps.space) + 'px', 'top': "50%", 'transform': "translateY(-50%)" }
      arrow = `top: 50%;left:-4px; transform:translateY(-50%) rotate(45deg);background-color:${ps.bcolor}`;
      break;
  }

  let opt = {
    arrow,
  }

  opt.boyStyle = {
    'background-color': ps.bcolor,
    'color': ps.fcolor,
    'max-width': maxWidth,
    'z-index': 7777,
    ...pt
  }

  if (ps.tipColor) {
    opt.boyStyle = {
      'max-width': maxWidth,
      'z-index': 7777,
      ...pt
    }
  }
  return opt
})

function findParentWithCSS() {
  let element: any = trigger.value;
  while (element) {
    const style = window.getComputedStyle(element);
    const propValue = style?.getPropertyValue('overflow') || style?.getPropertyValue('overflow-x') || style?.getPropertyValue('overflow-y');
    if (propValue.includes('hidden') || propValue.includes('scroll')) {
      return element;

      // return element.getBoundingClientRect();
    }
    element = element.parentElement;
  }
  return null;
};

const placearrow = computed(() => {
  let arrow = ps.placement;
  if (visible.value) {
    let positions = findParentWithCSS()?.getBoundingClientRect() || "";
    if (positions) {
      if (positions.left + (options.value.myWidth / 2) > options.value.myLeft) {
        arrow = "right";
      }
      if (options.value.myLeft + (options.value.myWidth / 2) > (positions.width)) {
        arrow = "left"
      }
      if (options.value.myTop + options.value.myHeight > positions.height) {
        arrow = "top"
      }
      if ((positions.top + options.value.myHeight ) > options.value.myTop) {
        arrow = "bottom"
      }
    } else {
      if (options.value.myLeft - (options.value.myWidth / 2) < 0) {
        arrow = "right"
      }
      if (options.value.myLeft + (options.value.myWidth / 2) > options.value.screenWidth) {
        arrow = "left"
      }
      if (options.value.myTop + options.value.myHeight > options.value.screenHeight) {
        arrow = "top"
      }
      if (options.value.myTop - options.value.myHeight < 0) {
        arrow = "bottom"
      }
    }
  }
  return arrow
})

function init() {
  if(!trigger.value) return;
  position.value.width = trigger.value?.offsetWidth;
  position.value.heigth = trigger.value?.offsetHeight;
  if (trigger.value && !ps.click) {
    if (typeof mvalue.value != "boolean") {
      if (ps.content) {
        trigger.value?.addEventListener('mouseover', e => {
          visible.value = true;
        })
        trigger.value.addEventListener('mouseleave', e => {
          visible.value = false;
        })
      }
    } else {
      document.addEventListener("click", setSelectPop);
    }

  } else {
    trigger.value.addEventListener('click', btnShow)
  }
}

watchEffect(() => {
  if (isShow.value) {
    nextTick(() => {
      options.value.myHeight = bodys.value.getBoundingClientRect().height;
      options.value.myWidth = bodys.value.getBoundingClientRect().width;
      options.value.myTop = trigger.value?.getBoundingClientRect().top;
      options.value.myLeft = trigger.value?.getBoundingClientRect().left;
    })
  } else {
    options.value = {};
  }
})

function setSelectPop(e) {
  if (!trigger.value?.contains(e.target)) {
    visible.value = false;
    emit('update:modelValue', false)
    document.removeEventListener('click', setSelectPop)
  }
}

function beforeUnmount() {
  document.removeEventListener('click', setSelectPop);
}

function onClick(e) {
  if (typeof e.srcElement.getAttribute('close') == "string") {
    visible.value = false;
  }
}

function btnShow() {
  visible.value = !visible.value;
  if (visible.value) {
    document.addEventListener("click", setSelectPop);
  }
}

onMounted(() => {
  init();
  // 可见屏高
  options.value.screenHeight = document.body.getBoundingClientRect().height;
  // 可见屏宽
  options.value.screenWidth = document.body.getBoundingClientRect().width;
})

const shadow = computed(() => {
  return ps.bcolor.includes('fff') ? '#ddd' : ps.bcolor
})

onUpdated(() => {
  nextTick(()=>{
    if(trigger.value){
      init();
    }
  })
})
</script>

<style lang='less'>
.tipsha {
  box-shadow: 0px 0px 6px v-bind("shadow");
}
</style>