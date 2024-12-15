<template>
  <div @click="btnSelect" :class="class" class="flex ai-c h-all flex-1">
    <div class="h-all flex-1 flex ai-c pr10 " v-if="selectValue.length||pathLabel.length">{{selectValue.length?selectValue?.join('/'):path.valueLabel?.join('/')}}</div>
    <div class="h-all flex flex-1 ai-c fc-ccc pr10" v-else>{{placeholder}}</div>
    <span class="arrow-right w-9 h-9 mr4"></span>
  </div>
  <section v-if="visible" class="hv-all zi-2000 fixed at0 ab0 al0 ar0 flex fd-c">
    <div @click="btnSave(1)" class="flex-1 ba-3"></div>
    <div class="sha-card rel bc-fff">
      <div class="flex ai-c fs-16 bt-e jc-b">
        <span @click="btnSave(1)" class="pp15">取消</span>
        <span @click="btnSave(2)" class="pp15">确定</span>
      </div>
      <div ref="picker" :class="pickClass" class="rel hidden fc-bbb">
        <div :style="lineStar" v-show="data.length" class="abs w-all h-1 al0 bc-e hidden"></div>
        <div class="h-all flex hidden" ref="parent">
          <ul class="flex-1" v-for="(list,i) in path" :key="i" @touchstart.stop="e=>{onstart(e,i)}" @touchmove.stop="e=>{onmove(e,i)}" @touchend.stop="e=>{onend(e,i)}" :style="{textAlign:'center'}">
            <li class="h-45 lh-45 fs-14 flex ai-c jc-c flex-1 line-1" v-for="(item,number) in list" :data-index="number" :key="number">{{item.label}}</li>
          </ul>
        </div>
        <div :style="lineEnd" v-show="data.length" class="hidden abs w-all h-1 bc-e al0"></div>
        <div v-if="!data.length" class="abs al0 ar0 ab0 fs-18 at0 flex ai-c jc-c fc-ddd">
          暂无数据
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang='ts'>
import { setParm,isArray } from "@lib/lang";
import { computed, nextTick, onMounted, onUpdated, ref, watch } from "vue";

const ps = defineProps({
  // 外部样式
  data: { type: [Array, Object], default: [] },
  placeholder: { type: String, default: "请选择" },
  pickClass: { type: String, default: 'h-200' },
  class: { type: String, default: 'jc-e w-all' },
  // 是否为树型
  tree: { type: Boolean, default: false },
  modelValue: { type: [String, Array, Number], default: [] },
  // 取值 props="name,id" 对应的是 label,value
  props: { type: [String, Object, Array], default: "" },
  // 当一个页面使多次使用时，可根据类型分别给值
  type: { default: "" }
})

const emit = defineEmits(["update:modelValue", "change"]);

const timer = ref("");
const isFirst = ref(true);
const visible = ref(false);
const parent = ref(null);
const picker = ref(null);
const lineheight = ref(0);
const pickerHeight = ref(0);
const selectIndex = ref([0, 0, 0]);
const selectValue:any = ref([]);
const pickData:any = ref([]);

const lineStar = computed(() => {
  let start = (pickerHeight.value / 2) - (lineheight.value / 2) + 'px';
  return {
    top: start
  }
})

watch(() => ps.data, (news, old) => {
  if (!ps.data.length) {
    pickData.value = [];
    selectValue.value = [];
  }
})


function btnSelect() {
  visible.value = true;
  pickData.value = [];
  if (ps.data.length) {
    if (ps.tree) {
      pickData.value = getFullPath(ps.data, 0, []);
    } else {
      pickData.value = ps.data;
      if (ps.modelValue) {
        let index = ps.data.findIndex(v => String(v[parm.value.value]) == String(ps.modelValue));
        selectIndex.value[0] = index > 0 ? index : 0;
        selectValue.value[0] = ps.data[index][parm.value.label]
      }
    }
  }

  setTimeout(() => {
    if (pickData.value?.length) {
      lineheight.value = parseFloat(getComputedStyle(parent.value.querySelector('li')).height || 0);
      pickerHeight.value = parseFloat(getComputedStyle(picker.value).height || 0);
      nextTick(() => {
        pickerInit();
      })
    }
  }, 50);
}

function changeValue(v) {
  emit("change", v)
}

function btnSave(type) {
  if (type == 1) {
    visible.value = false;
  } else {
    let value = [];
    let curr = {
      value: [],
      item: []
    }
    path.value.forEach((list, i) => {
      if (list.length) {
        // value[i] = list[selectIndex.value[i]][parm.value.value]
        curr.value[i] = list[selectIndex.value[i]].value;
        curr.item.push(list[selectIndex.value[i]])
        selectValue.value[i] = list[selectIndex.value[i]].label
      }
    })
    if (ps.tree) {
      emit('update:modelValue', curr.value);
      changeValue(curr)
    } else {
      if (curr.value.length) {
        emit('update:modelValue', curr?.value[0]);
        changeValue({ value: curr?.value[0], item: curr?.item[0] })
      }
    }
    visible.value = false;
  }
}

// 返显数据所用完整路径值
function getFullPath(list: any = [], len = 0, rlist) {
  if (ps.modelValue.length) {
    rlist[len] = list;
    let index = list.findIndex(v => String(v[parm.value.value]) == String(ps.modelValue[len]));
    selectIndex.value[len] = index > 0 ? index : 0;
    let next = list[index] && list[index][parm.value.child] || [];
    if (index >= 0) {
      selectValue.value[len] = list[index][parm.value.label]
    }
    if (next.length) {
      return getFullPath(next, len + 1, rlist)
    } else {
      return rlist
    }

  } else {
    let curr = [];
    if (list[0] && isArray(list[0][parm.value.child])) {
      curr = list[0][parm.value.child]
    }
    selectIndex.value[len] = 0;
    rlist[len] = list;
    if (curr.length) {
      return getFullPath(curr, len + 1, rlist)
    } else {
      return rlist
    }
  }
}

const pathLabel = computed(() => {
  let label = [];
  if (isFirst.value && String(ps.modelValue) && ps.data.length) {
    if (ps.data.length) {
      if (ps.tree) {
        pickData.value = getFullPath(ps.data, 0, []);
      } else {
        pickData.value = [ps.data];
        let index = ps.data.findIndex(v => String(v[parm.value.value]) == String(ps.tree ? ps.modelValue[i] : ps.modelValue));
        label[0] = ps.data[index][parm.value.label];
      }
    }
    isFirst.value = false;

    pickData.value?.forEach((list, i) => {
      let index = list.findIndex(v => String(v[parm.value.value]) == String(ps.tree ? ps.modelValue[i] : ps.modelValue));
      selectIndex.value[i] = index;
      if (index > 0) {
        label[i] = list[index][parm.value.label];
      }
    })
  }
  return label
})


const path = computed(() => {
  let list = [];
  if (ps.tree) {
    pickData.value?.forEach((item, i) => {
      if (item && item.length) {
        list[i] = item.map((v, index) => {
          let curr = {}
          if (typeof v !== 'object') {
            curr = { label: v, value: v }
          } else {
            curr = { ...v, label: v[parm.value.label], value: v[parm.value.value] }
          }
          return curr
        })
      }
    })
  } else {
    list = [pickData.value.map(v => {
      let curr = {}
      if (typeof v !== 'object') {
        curr = { label: v, value: v }
      } else {
        curr = { ...v, label: v[parm.value.label], value: v[parm.value.value] }
      }
      return curr
    })]
  }
  return list
})



const lineEnd = computed(() => {
  let start = (pickerHeight.value / 2) + (lineheight.value / 2) + 'px';
  return {
    top: start
  }
})

function pickerInit() {
  nextTick(() => {
    [...parent.value.children].forEach((element, index) => {
      endMove(element, selectIndex.value[index], lineheight.value, 0, index, 200, true);
    });
  });
}


// <!-- // 控制最后的滚动 -->
function endMove(target, index = 0, step, moveDistance = 0, order = 0, speed = 200, first = false) {
  target.setAttribute("mov-distance", -index * step);
  transformStyle(target, -index * step, true, speed);
  // 上边界判断
  if (moveDistance > 0 * step) {
    index = 0;
    transformStyle(target, index * step);
    target.setAttribute("mov-distance", index * step);
  }
  // 下边界判断
  if (moveDistance < -(path.value[order].length - 1) * step) {
    index = path.value[order].length - 1;
    transformStyle(target, -index * step);
    target.setAttribute("mov-distance", -index * step);
  }
  addClass(order, index);

  if (!first) {
    selectIndex.value[order] = index;
    if (ps.tree) {
      let curr = path.value[order][index];
      pickData.value = pickData.value.slice(0, order + 1)
      selectIndex.value = selectIndex.value.slice(0, order + 1)
      if (curr[parm.value.child]) {
        setPickData(curr, order + 1);
        setTimeout(() => {
          pickerInit()
        }, 10);
      }
    }
  }
}

function setPickData(item, index) {
  selectIndex.value[index] = 0;
  let curr = [];
  if (item && isArray(item[parm.value.child])) {
    curr = item[parm.value.child];
  }
  pickData.value[index] = curr;
  if (curr.length && curr[0][parm.value.child]) {
    setPickData(curr[0], index + 1)
  }

}

function movePurpose(order, index, e) {
  endMove(e, parseInt(index), lineheight.value, 0, order);
}

// 通过索引找到对应数据
function computeValue(value) {
  return value.map((item, index) => {
    return path.value[index][item];
  });
}

// 给选中的picker加active类名
function addClass(order, index, num = 2) {
  nextTick(() => {
    if (parent.value.children[order].children[index]) {
      parent.value.children[order].children[index].className = "h-45 lh-45 flex ai-c jc-c vsim-picker-item-active";
    }
  });
}

// 设置picker的值
function setPickerValue(index, defaultValue) {
  endMove(parent.value.children[index], defaultValue, lineheight.value, 0, index);
}

// 动画
/**
 * target:目标元素
 * moveDistance:滚动距离
 * transition:是否开启动画
 * timer:动画时间
 */
function transformStyle(target, moveDistance, transition, timer = 200) {
  let start = (pickerHeight.value / 2) - (lineheight.value / 2);
  target.style["-webkit-transform"] = "translate3d(0," + (moveDistance + start) + "px,0)";
  target.style["transform"] = "translate3d(0," + (moveDistance + start) + "px,0)";
  if (transition) {
    target.style.transitionDuration = timer + "ms";
  }
}

// 触摸开始
function onstart(e, index) {
  e.preventDefault();
  // 当触摸li时,确定target对象
  let target = e.target;
  if (e.target.tagName === "LI") {
    target = e.target.parentElement;
  } else {
    return;
  }
  // 清空选中的active样式
  // [...parent.value.children[index].children].forEach(item => {
  //   item.className = "h-45 lh-45 flex ai-c jc-c";
  // });

  for (let i = index; i < parent.value.querySelectorAll('ul').length; i++) {
    [...parent.value.children[i].children].forEach(item => {
      item.className = "h-45 lh-45 flex ai-c jc-c";
    })
  }

  const touch = e.touches[0];
  const touchY = touch.screenY;
  // 记录开始触摸时距屏幕顶端距离
  target.setAttribute("address-start", touchY);
  target.setAttribute("ismove", false); // 是否触发
  // 记录开始触摸时间
  const timestamp = new Date().getTime();
  target.setAttribute("start-time", timestamp);
  // 判断是否是第一次触摸
  if (!target.getAttribute("mov-distance")) {
    // 存储当前位置
    target.setAttribute("pos-start", touchY);
  } else {
    target.setAttribute("pos-start", touchY - parseFloat(target.getAttribute("mov-distance")));
  }
  target.style.transitionDuration = "0ms";
}

// 手指移动中
function onmove(e, index) {
  e.preventDefault();
  let target = e.target;
  if (e.target.tagName === "LI") {
    target = e.target.parentElement;
  } else {
    return;
  }
  const touch = e.touches[0];
  const touchY = touch.screenY;
  // 获取移动距离
  const moveDistance = touchY - target.getAttribute("pos-start");
  target.setAttribute("pos-end", touchY);
  target.setAttribute("address-end", touchY);
  target.setAttribute("ismove", true); // 是否触发
  // 移动
  transformStyle(target, moveDistance);
}

// 手指离开
function onend(e, order) {
  e.preventDefault();
  const step = lineheight.value;
  let target = e.target;
  if (e.target.tagName === "LI") {
    target = e.target.parentElement;
  } else {
    return;
  }
  const touchY = target.getAttribute("pos-end");
  const moveDistance = touchY - target.getAttribute("pos-start");
  // console.log(touchY,'===',target.getAttribute("pos-start"))
  // 判断应该移动多少个li
  let index = Math.abs(Math.round(moveDistance / step));
  // 记录移动的距离
  const absDistance = parseFloat(target.getAttribute("address-start")) - parseFloat(target.getAttribute("address-end") || target.getAttribute("address-start"));
  const timestamp = new Date().getTime();
  // 记录间隔时间
  const timespace = timestamp - parseFloat(target.getAttribute("start-time"));
  if ((Math.abs(absDistance) <= 15 || target.getAttribute("ismove") == "false") && timespace <= 120) {
    movePurpose(order, e.target.getAttribute("data-index"), target);
    return;
  }
  // 计算速度 = 距离/时间
  const rate = absDistance / timespace;
  // console.log(rate,'rate')
  timer.value = rate * 6;
  if (Math.abs(timer.value) <= 2) {
    timer.value = 0;
  }
  // 惯性滚动距离及速度
  index = Math.round(index + timer.value);
  let speed = 200;
  if (Math.abs(Math.floor(timer.value)) >= 2) {
    speed = 600;
  }
  if (Math.abs(Math.floor(timer.value)) >= 4) {
    speed = 600;
  }
  if (Math.abs(Math.floor(timer.value)) > 6) {
    speed = 800;
  }
  if (index < 0) {
    index = 0;
  }
  // 边界情况
  if (index > path.value[order].length - 1) {
    index = path.value[order].length - 1;
  }
  endMove(target, index, step, moveDistance, order, speed);
}



const parm = computed(() => {
  return setParm(ps.props)
})


</script>

<style lang="less">
.arrow-right {
  border-width: 1.5px 1.5px 0 0;
  border-color: #ddd;
  border-style: solid;
  transform: rotate(45deg);
}
.vsim-picker-item-next {
  transform: scaleY(0.9) translateZ(0);
  color: #bbb;
}
.vsim-picker-item-far {
  transform: scaleY(0.8) translateZ(0);
  color: #bbb;
}
.vsim-picker-item-active {
  transform: scaleY(1) translateZ(0);
  color: #000;
}
</style>