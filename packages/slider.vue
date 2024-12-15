<template>
  <!-- {{stopsList}} -->
  <section ref="slider" @mouseover="changeOver('over')" @mouseout="changeOver('out')" :key="uid" :class="styleClass.bc" class="rel _slider">
    <!-- 第二个拖圆点 -->
    <div ref="minDom" :class="tipType" :id="'moveLeft'+uid" class="abs w1 h1 zi-120 hand">
      <div :style="styleClass.radius" @touchstart.stop="minChangeStart" @mousedown.stop="minChangeStart" class="abs absc">
        <div @click.stop @mousedown.stop @touchstart.stop v-show="tipShow" class="abs at-32 ra-4 bc-0 absl fc-fff fs-12 ai-c jc-c pp5">
          <span>{{formatTip(config.minValue)}}</span>
          <span style="bottom:-2px; transform:translateX(-50%) rotate(45deg)" class="w-6 absl h-6 bc-0 abs"></span>
        </div>
      </div>
    </div>
    <!-- 色条 -->
    <article ref="selectSlider" id="selectSlider" :style="styleClass.ht" :class="styleClass.hc" class="h-all fc-fff zi-110 abs"></article>
    <!-- 离散值 间断点 -->
    <div :style="rangeStyle" class="abs zi-100 flex ai-c jc-b">
      <div :class="config.vertical?'absl':'abst'" class="h-all abs ab0 ra-100 bc-fff" v-for="item in stopsList" :style="{...styleClass.stops,...getStopStyle(item)}"></div>
    </div>
    <!-- 离散值 间断点 -->
    <div :style="rangeStyle" class="abs zi-100 flex ai-c jc-b">
      <div :class="config.vertical?'absl':'abst'" class="h-all abs ab0 ra-100 bc-fff" v-for="item in markList" :style="{...styleClass.stops,...getStopStyle(item.value)}">
        <span v-if="config.vertical" :style="{'bottom':config.padSize+'px',...item.style}" :class="item.class" class="abs absl nowrap">{{item.label}}</span>
        <span v-else :style="{'top':config.padSize+'px',...item.style}" :class="item.class" class="abs absl nowrap">{{item.label}}</span>
      </div>
    </div>
    <!-- 第二个拖圆点 -->
    <div ref="maxDom" v-show="ps.twin" :class="tipType" :id="'moveRight'+uid" class="abs w1 h1 zi-120 hand">
      <div :style="styleClass.radius" class="abs absc" @touchstart.stop="maxChangeStart" @mousedown.stop="maxChangeStart">
        <div @click.stop @mousedown.stop @touchstart.stop v-show="tipShow" class="abs at-32 ra-4 bc-0 absl tips fc-fff fs-12 ai-c jc-c pp5">
          <span>{{formatTip(config.maxValue)}}</span>
          <span style="bottom:-2px; transform:translateX(-50%) rotate(45deg)" class="w-6 absl h-6 bc-0 abs"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang='ts'>
// https://blog.csdn.net/qq564280420/article/details/123704028
import { computed, nextTick, onMounted, reactive, ref, watchEffect } from "vue";

const ps = defineProps({
  // 默认高30 宽100
  class: { type: String, default: "h-30 w-100" },
  // 是否显示tooltip always（一直显示）/never（不显示）/hover（鼠标经过显示）
  tip: { type: String, default: "hover" },
  // 格式化tip 如 30分
  formatTip: { type: Function, default: v => v },
  // 最大值
  min: { type: [Number, String], default: 0 },
  // 最小值
  max: { type: [Number, String], default: 100 },
  // 步长
  step: { type: [Number, String], default: "" },
  // 禁用
  disabled: { type: Boolean, default: false },
  // 是否显示间断点
  stops: { type: Boolean, default: false },
  // 区间值 双滑块 开始与结果
  twin: { type: Boolean, default: false },
  // 滑动(拖动时区断点之前 滑动)
  range: { type: Boolean, default: false },
  // 选中颜色
  color: { type: String, default: '#3699ff' },
  // 圆圈大小 拖动 取高度的多少分之一 1/3
  size: { type: [String, Number], default: 3 },
  // [{value:5,label:'5分'},{value:18,label:'18分',style,class}]
  marks: { type: [Array, String], default: [] }
})
const emit = defineEmits(["change"]);
// modelValue v-model="value"
const mvalue = defineModel({ type: [String, Number, Array], default: "" });

const slider = ref(null);
const selectSlider = ref(null);
const minDom = ref(null);
const maxDom = ref(null);
const config: any = reactive({
  height: 0,
  minLeft: 0,
  maxLeft: 0,
  isOver: false,
  isMove: false,
  vertical: false,
  // 当前长度
  counts: 1,
  // 滑块总长度
  domCounts: 0,
  minValue: 0,
  maxValue: 0,
  step: 0,
  stepWidth: 0,
  firstValue: 0,
  lastValue: 0,
  oldValue: "",
  // 圆点实计长宽度，需要加的高宽度 动动
  padSize: 0,
  isFirst: true
})

function changeOver(type) {
  if (type == 'over') {
    config.isOver = true;
  } else {
    if (ps.tip == 'hover') {
      if (config.isMove) {
        config.isOver = true;
      } else {
        config.isOver = false;
      }
    } else {
      config.isOver = false;
    }
  }
}

const tipShow = computed(() => {
  if (ps.tip == 'always') {
    return true
  } else if (ps.tip === 'never') {
    return false
  } else {
    if (config.isOver) {
      return true
    } else {
      return false;
    }
  }
})

function guid() {
  function gen(count) {
    var out = "";
    for (var i = 0; i < count; i++) {
      out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return out;
  }
  return gen(8)
}

const uid = guid();

function minChangeStart(e) {
  e.preventDefault();
  // 算出鼠标相对元素的位置
  // let disX = slider.value.offsetLeft;
  let disX = slider.value.getBoundingClientRect().left;
  let disY = slider.value.getBoundingClientRect().top;
  let maxWidth = slider.value.offsetWidth;
  let maxHeight = slider.value.offsetHeight;
  config.isMove = true;
  document.ontouchmove = e => {
    onDragMove(e, disX, disY, maxWidth, maxHeight, 'min')
  }
  document.onmousemove = e => {
    onDragMove(e, disX, disY, maxWidth, maxHeight, 'min')
  }
}

function maxChangeStart(e) {
  e.preventDefault();
  // 算出鼠标相对元素的位置
  // let disX = slider.value.offsetLeft;
  let disX = slider.value.getBoundingClientRect().left;
  let disY = slider.value.getBoundingClientRect().top;
  // let disY = slider.value.offsetTop;
  let maxWidth = slider.value.offsetWidth;
  let maxHeight = slider.value.offsetHeight;
  config.isMove = true;
  document.ontouchmove = e => {
    if (!config.isMove) return;
    onDragMove(e, disX, disY, maxWidth, maxHeight, 'max')
  }
  document.onmousemove = e => {
    if (!config.isMove) return;
    onDragMove(e, disX, disY, maxWidth, maxHeight, 'max')
  }
}

const precision = computed(() => {
  let precisions = [ps.min, ps.max, ps.step].map(item => {
    let decimal = ('' + item).split('.')[1];
    return decimal ? decimal.length : 0;
  });
  return Math.max.apply(null, precisions);
})

const decimalPow = computed(() => {
  let curr = 0;
  [ps.min, ps.max, ps.step].forEach(v => {
    if (String(v).includes('.')) {
      if (curr < String(v).split('.')[1].length) {
        curr = String(v).split('.')[1].length;
      }
    }
  })
  if (curr && curr == 1) {
    curr = 2;
  } else if (curr && curr > 1) {
    curr = curr + 1;
  }
  return Math.pow(10, curr);
})

function onDragMove(e, disX, disY, maxWidth, maxHeight, type) {
  let moveLeft = minDom.value
  let moveRight = maxDom.value
  let curr = 0
  if (config.vertical) {
    curr = getPointer(e) - disY;
    if (curr <= 0) {
      curr = 0
    } else if (curr >= maxHeight) {
      curr = maxHeight;
    }
  } else {
    curr = getPointer(e) - disX;
    if (curr <= 0) {
      curr = 0
    } else if (curr >= maxWidth) {
      curr = maxWidth;
    }
  }

  // Math.round() 四舍五入
  let ste = Math.round(curr / config.stepWidth * decimalPow.value);
  if (ps.step && ps.range) {
    curr = ste * config.stepWidth / decimalPow.value;
  }

  if (curr > config.domCounts) {
    curr = config.domCounts;
  }

  let diff = ((config.counts / (config.domCounts)) * curr).toFixed(precision.value);
  if (config.vertical) {
    diff = ((config.counts / (config.domCounts)) * Math.abs(config.domCounts - curr)).toFixed(precision.value);
  }
  if (type == 'min') {
    config.minValue = (Number(diff) + Number(ps.min)).toFixed(precision.value);
  } else {
    config.maxValue = (Number(diff) + Number(ps.min)).toFixed(precision.value);
  }

  if (ps.twin) {
    mvalue.value = [config.minValue, config.maxValue];
  } else {
    mvalue.value = config.minValue;
  }

  emit('change', ps.twin ? [config.minValue, config.maxValue] : config.minValue);
  document.onmouseup = () => {
    drouseup();
  }
  document.ontouchend = () => {
    drouseup();
  }
}

const tipType = computed(() => {
  return {
    [ps.tip + '_tip']: true,
    'absl': config.vertical,
    'abst': !config.vertical,
  }
})

function handleDecimal(diff, step) {
  if (step < 1) {
    let sl = step.toString(),
      multiple = 1,
      m;
    try {
      m = sl.split(".")[1].length;
    } catch (e) {
      m = 0;
    }
    multiple = Math.pow(10, m);
    return ((pos * multiple) % (step * multiple)) / multiple;
  } else {
    return pos % step;
  }
}

const rangeStyle = computed(() => {
  if (config.vertical) {
    return {
      width: '100%',
      height: config.domCounts + 'px',
    }
  } else {
    return {
      width: config.domCounts + 'px',
      height: '100%'
    }
  }
})

const markList = computed(() => {
  return ps.marks.map(v => ({ ...v, value: Number(v.value) })).sort((a, b) => a.value - b.value)
    .filter(point => point.value <= ps.max && point.value >= ps.min)
    .map(point => ({
      position: (point.value - ps.min) * 100 / (ps.max - ps.min),
      ...point
    }))
})


const stopsList = computed(() => {
  if (!ps.stops || !ps.step || ps.min > ps.max) return;
  const stopCount = (ps.max - ps.min) / ps.step;
  const stepWidth = 100 * ps.step / (ps.max - ps.min);
  const result = [];
  for (let i = 1; i < stopCount; i++) {
    result.push(i * stepWidth);
  }
  return result;
})

function getStopStyle(position) {
  return config.vertical ? { 'bottom': position + '%' } : { 'left': position + '%' };
}

function drouseup() {
  config.isMove = false;
  // 鼠标弹起来的时候不再移动
  document.onmousemove = null
  // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
  if (ps.tip == 'hover') {
    config.isOver = false;
  }
  document.onmouseup = null
  document.ontouchend = null;
  document.ontouchmove = null;
}

function getPointer(event) {
  return config.vertical ? event.type.indexOf("touch") !== -1 ? event.touches[0].clientY : event.clientY : event.type.indexOf("touch") !== -1 ? event.touches[0].clientX : event.clientX;
}

const styleClass = computed(() => {
  let sliders: any = slider.value && getComputedStyle(slider.value) || {}
  let selectSliders: any = selectSlider.value && getComputedStyle(selectSlider.value) || {}

  let ht = {};
  let hc = {};

  let radius = {
    width: config.padSize + 'px',
    height: config.padSize + 'px',
    borderRadius: config.padSize + 'px',
    backgroundColor: '#fff'
  }
  if (selectSliders.backgroundColor) {
    radius.border = `2px solid ${selectSliders.backgroundColor}`
  }
  if (config.vertical) {
    if (selectSlider.value) {
      selectSlider.value.style.width = config.height + 'px';
      selectSlider.value.style.height = '0px';
    }
    if (!ps.twin) {
      ht.borderBottomLeftRadius = sliders.borderTopLeftRadius;
      ht.borderBottomRightRadius = sliders.borderTopLeftRadius;
    }
  } else {
    if (!ps.twin) {
      ht.borderTopLeftRadius = sliders.borderTopLeftRadius;
      ht.borderBottomLeftRadius = sliders.borderBottomLeftRadius;
    }
  }
  if (ps.color.includes('#')) {
    ht.backgroundColor = ps.color;
    radius.border = `2px solid ${ps.color}`
  } else {
    hc[ps.color] = true;
  }
  return {
    stops: {
      height: config.height / 1.5 + 'px',
      width: config.height / 1.5 + 'px'
    },
    bc: {
      [ps.class]: true
    },
    ht,//选中style
    hc, //选中class
    radius
  }
})

watchEffect(() => {
  if (String(mvalue.value) && config.domCounts) {
    let value = mvalue.value;
    if (typeof value == "string" && ps.twin) {
      value = value.replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',');
    }
    if (ps.twin) {
      value = value.sort((a, b) => a - b);
    } else {
      value = [value, 0];
    }
    nextTick(() => {
      let moveLeft = minDom.value
      let moveRight = maxDom.value
      const lengthPerStep = (((Number(ps.max) - Number(ps.min))) / Number(ps.step || 1));
      let stepWidth = config.domCounts / lengthPerStep * getDoub();
      let minValue = stepWidth * value[0] 
      let maxValue = stepWidth * value[1] 
      if (config.vertical) {
        moveLeft.style.top = "";
        moveLeft.style.bottom = minValue + 'px';
        selectSlider.value.style.height = minValue + 'px';
        selectSlider.value.style.bottom = 0;
        config.minValue = value[0] || 0;
        config.minLeft = minValue;
        if (ps.twin && value[1]) {
          config.maxLeft = maxValue;
          config.maxValue = value[1] || 0;
          moveRight.style.bottom = maxValue + 'px';
          selectSlider.value.style.height = Math.abs(maxValue - minValue) + 'px';
          selectSlider.value.style.bottom = minValue + 'px';
        }
      } else {
        // 求每个值值的对应px
        moveLeft.style.left = minValue + 'px';
        selectSlider.value.style.width = minValue + 'px';
        config.minValue = value[0] || 0;
        config.minLeft = minValue;
        if (value[1] && ps.twin) {
          config.maxLeft = maxValue;
          config.maxValue = value[1] || 0;
          moveRight.style.left = maxValue + 'px';
          selectSlider.value.style.width = Math.abs(maxValue - minValue) + 'px';
          selectSlider.value.style.left = minValue + 'px';
        }
      }
    })
  }
})

function getDoub() {
  let value = 0;
  [ps.min, ps.step, ps.max].forEach(item => {
    let length = (String(item).split('.')[1]?.length || 0);
    value = value < length ? length : value;
  })
  return Math.pow(10, value) || 1;
}

function initStops() {
  let vFirst = "";
  let vLast = "";
  if (ps.range) {
    [vFirst, vLast] = Array.isArray(mvalue.value) ? mvalue.value : String(mvalue.value).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',')
    if (String(mvalue.value)) {
      config.firstValue = Math.max(ps.min, vFirst);
      config.lastValue = Math.min(ps.max, vLast);
    } else {
      config.firstValue = ps.min;
      config.lastValue = ps.max;
    }
    config.oldValue = [config.firstValue, config.lastValue];
  } else {
    if (typeof mvalue.value && !isNaN(mvalue.value)) {
      config.firstValue = Math.min(ps.max, Math.max(ps.min, mvalue.value));
    } else {
      config.firstValue = ps.min;
    }
    config.oldValue = config.firstValue;
  }
}

onMounted(() => {
  nextTick(() => {
    initStops();
    // 算出总长度
    if (ps.min < 0 && ps.max > 0) {
      config.counts = Math.abs(ps.min) + ps.max;
    } else if (ps.min < 0 && ps.max < 0) {
      config.counts = Math.abs(ps.max) - Math.abs(ps.min);
    } else if (ps.min >= 0) {
      config.counts = ps.max - ps.min;
    }
    let doms = slider.value && slider.value.getBoundingClientRect();
    const lengthPerStep = 100 / ((ps.max - ps.min) / ps.step);
    if (doms) {
      if (doms.width > doms.height) {
        config.vertical = false;
        config.height = doms.height;
        config.domCounts = doms.width;

        config.stepWidth = lengthPerStep / 100 * doms.width;
      } else {
        config.vertical = true;
        config.height = doms.width;
        config.domCounts = doms.height;
        config.stepWidth = lengthPerStep / 100 * doms.height;
        let moveLeft = minDom.value;
        let moveRight = maxDom.value;
        moveLeft.style.bottom = 0;
        moveRight.style.bottom = 0;
        moveLeft.style.top = "";
        moveRight.style.top = "";
      }
      let size = parseFloat(ps.size);
      if (String(ps.size).includes('px')) {
        config.padSize = size
      } else {
        config.padSize = parseInt((config.height + config.height / size));
      }
    }
  })
})
</script>

<style lang='less'>
._slider {
  .rands {
    transition: 0.2s;
    &:hover {
      transform: scale(1.2);
    }
  }
  .hover_tip {
    .tips {
      display: none;
    }
    &:hover {
      .tips {
        display: inline-flex;
      }
    }
  }
  .never_tip {
    .tips {
      display: none;
    }
  }
  .always_tip {
    .tips {
      display: inline-flex;
    }
  }
}
</style>