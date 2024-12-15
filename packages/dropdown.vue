<template>
  <div ref="main" @click="onDown" @mouseover="onOver" :class="class" class="rel _dropdown flex-line">
    <slot></slot>
    <div v-if="visible" :style="offices" :class="mClass" class="abs bodys sha-6 ra-4">
      <scrollbar :maxHeight="maxHeight">
        <div ref="tip" @click.stop class="flex w-all fd-c">
          <slot name="body">
            <div :class="{'_is_select fb':currValue.value==item.value}" @click="selectItem(item)" v-for="(item,index) in path" class="hand h-34">
              <div :class="setStyle(item)" class="flex nowrap h-all w-all pl15 pr15 ai-c">{{item.label}}</div>
            </div>
          </slot>
        </div>
      </scrollbar>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { setParm } from '@lib/lang';
import { computed, onBeforeMount, ref, watch } from 'vue';
import scrollbar from './scroll.vue';
const ps = defineProps({
  // 当出现在某个position: absolute元素内，出现滚动条时，需要当前的div  ps.dom ==>id
  dom: { type: String, default: "" },
  // 间距
  space: { type: [Number, String], default: 5 },
  direction: { type: String, default: 'bottom' },
  fcolor: { type: String, default: '#333' },
  bcolor: { type: String, default: '#fff' },
  maxHeight: { type: String, default: '220' },
  //是否鼠标经过显示
  hover: { type: Boolean, default: false },

  class: { type: String, default: "" },
  mClass: { type: String, default: "" },
  // 数组 label,value 如name,id 或 {label:'name',value:'id'}
  props: { type: [String, Object, Array], default: "" },
  // 选中值
  modelValue: { type: [String, Number, Boolean], default: false },
  // 数据list
  data: { type: Array, default: [] },
  // 禁止选项 [1,2,'name']
  disList: { type: Array }
})
const emit = defineEmits(["update:modelValue", "change"]);
const visible = ref(false);
const main = ref(null);
const tip = ref(null);
const position = ref({ width: 0, height: 0, mainHeight: 0 })

function onDown() {
  if (ps.hover) return;
  visible.value = !visible.value;
  if (visible.value) {
    document.addEventListener("click", setSelectPop);
  }
}

function onOver() {
  if (!ps.hover) return;
  visible.value = true;
  if (visible.value) {
    document.addEventListener("mousemove", setSelectPop);
  }
}

function setSelectPop(e) {
  if (!main.value?.contains(e.target)) {
    visible.value = false;
    document.removeEventListener('click', setSelectPop)
    document.removeEventListener('mousemove', setSelectPop)
  }
}

onBeforeMount(() => {
  document.removeEventListener('click', setSelectPop);
})

const parm = computed(() => {
  return setParm(ps.props)
})

const path = computed(() => {
  return ps.data.map(v => {
    let curr = {}
    if (typeof v !== 'object') {
      curr = { label: v, value: v }
    } else {
      curr = { ...v, label: v[parm.value.label], value: v[parm.value.value] }
    }
    return curr
  })
})

function selectItem(item) {
  visible.value = false;
  emit('update:modelValue', item[parm.value.value]);
  emit("change", item);
  document.removeEventListener('click', setSelectPop)
}

const currValue = computed(() => {
  let item = path.value.find(v => { return v[parm.value.value] == ps.modelValue });
  if (item) {
    return item
  } else {
    return { [parm.value.label]: "", [parm.value.value]: "" }
  }
})

function setStyle(item) {
  let curr = item[parm.value.value];
  if (ps.disList && curr != String(ps.modelValue)) {
    if (ps.disList.some(v => String(item[parm.value.value]) == String(v))) {
      return "is_dis"
    } else {
      return "_select_hover"
    }
  } else {
    return "_select_hover"
  }
}

const offices = computed(() => {
  // 内容宽度
  let tipWidth = tip.value?.offsetWidth || 0;
  // 内容高度
  let tipHeight = tip.value?.offsetHeight || 0;
  tipHeight = tipHeight > 220 ? 220 : tipHeight;
  // 显示坐标top
  let top = main.value?.getBoundingClientRect().top;
  // 显示坐标left
  let left = main.value?.getBoundingClientRect().left;

  let ption = {}

  let currHeight = tipHeight / 2 + position.value.height / 2;
  if (tipHeight < position.value.height) {
    currHeight = top;
  }

  switch (ps.direction) {
    case "bottom":
      if ((tipWidth / 2) + left + (position.value.width / 2) > position.value.boyWidth) {
        ption.left = position.value.boyWidth - left - tipWidth - 1 + 'px';
      } else {
        ption = {
          'left': '50%',
          'transform': 'translateX(-50%)'
        }
      }
      if (tipHeight + top + position.value.height > position.value.boyHeight) {
        ption.top = -tipHeight - parseInt(ps.space) + 'px';
      } else {
        ption.top = (position.value.height + parseInt(ps.space)) + 'px'
      }
      break;
    case "top":
      if ((tipWidth / 2) + left + (position.value.width / 2) > position.value.boyWidth) {
        ption.left = position.value.boyWidth - left - tipWidth - 1 + 'px';
      } else {
        ption = {
          'left': '50%',
          'transform': 'translateX(-50%)'
        }
      }
      if (tipHeight > top) {
        ption.top = (position.value.height + parseInt(ps.space)) + 'px'
      } else {
        ption.top = -(parseInt(ps.space) + tipHeight) + 'px'
      }
      break;
    case "left":
      if (currHeight > top) {
        ption.top = -top + 3 + 'px';
      } else if (currHeight + top > position.value.boyHeight) {
        ption.top = 2 - position.value.boyHeight + 'px'
      } else {
        ption = {
          'top': "50%",
          'transform': "translateY(-50%)"
        }
      }
      if (tipWidth > left) {
        ption.left = position.value.width + parseInt(ps.space) + 'px';
      } else {
        ption.right = position.value.width + parseInt(ps.space) + 'px';
      }
      break;
    case "right":
      if (currHeight > top) {
        ption.top = -top + 3 + 'px';
      } else if (currHeight + top > position.value.boyHeight) {
        ption.top = 2 - position.value.boyHeight + 'px'
      } else {
        ption = {
          'top': "50%",
          'transform': "translateY(-50%)"
        }
      }
      if (tipWidth + left + position.value.width > position.value.boyWidth) {
        ption.right = position.value.width + parseInt(ps.space) + 'px';
      } else {
        ption.left = position.value.width + parseInt(ps.space) + 'px';
      }
      break;
  }
  return {
    'background-color': ps.bcolor,
    'color': ps.fcolor,
    'z-index': 2222,
    ...ption
  }
})

watch(()=>visible.value,(news,old)=>{
  if(news){
    initDown();
  }
})

function initDown() {
  let mainHeight = main.value?.offsetHeight;
  let mainWidth = main.value?.offsetWidth;
  if (ps.dom) {
    position.value = {
      boyWidth: document.getElementById(ps.dom)?.scrollWidth,
      boyHeight: document.getElementById(ps.dom)?.scrollHeight,
      height: mainHeight,
      width: mainWidth
    }
  } else {
    let height = document.body.scrollHeight;
    if (height <= document.documentElement.clientHeight) {
      height = document.documentElement.clientHeight;
    }
    let width = document.body.scrollWidth
    if (width <= document.documentElement.clientWidth) {
      width = document.documentElement.clientWidth
    }
    position.value = {
      boyWidth: width,
      boyHeight: height,
      height: mainHeight,
      width: mainWidth
    }
  }
}
</script>

<style lang='less'>
.downHover {
  .bodys {
    display: none;
  }
  &:hover {
    .bodys {
      display: inline-flex !important;
    }
  }
}
._dropdown {
  .is-select {
    border-color: #57a3f3;
  }
  ._select_hover {
    &:hover {
      background-color: #f5f7fa;
      color: #409eff;
    }
  }
  .is_dis {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  ._is_select {
    color: #409eff;
  }
  ._selects_dropdown {
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  }
}
</style>