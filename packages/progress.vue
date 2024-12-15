<template>
  <div class="wypress" :class="['wypress--' + type,status ? 'is-' + status : '',{'wypress--without-text': !showText,'wypress--text-inside': textInside,}]" role="progressbar" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100">
    <div class="wypress-bar" v-if="type === 'line'">
      <div class="wypress-bar__outer" :style="lineStyle">
        <div class="wypress-bar__inner" :style="barStyle">
          <div class="wypress-bar__innerText" v-if="showText && textInside">{{content}}</div>
        </div>
      </div>
    </div>
    <div class="wypress-circle" :style="{height: width + 'px', width: width + 'px'}" v-else>
      <svg viewBox="0 0 100 100">
        <path class="wypress-circle__track" :d="trackPath" :stroke="bc" :stroke-width="relativeStrokeWidth" fill="none" :style="trailPathStyle"></path>
        <path class="wypress-circle__path" :d="trackPath" :stroke="stroke" fill="none" :stroke-linecap="strokeLinecap" :stroke-width="value ? relativeStrokeWidth : 0" :style="circlePathStyle"></path>
      </svg>
    </div>
    <div class="wypress__text" v-if="showText && !textInside" :style="{fontSize: progressTextSize + 'px'}">
      <template v-if="!status">{{content}}</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from "vue"

const ps = defineProps({
  type: { type: String, default: 'line' },
  // 'success', 'exception', 'warning'
  status: { type: String, default: 'success' },
  // round/square 圆型/长方型
  strokeLinecap: { type: String, default: 'square' },
  // 是否显示进度条文字内容
  showText: { type: Boolean, default: false },
  // 百分比（必填）
  value: { type: [Number, String], default: 0 },
  // 进度条的高度/厚度,单位 px
  height: { type: [Number, String], default: 6 },
  // 环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）
  width: { type: [Number, String], default: 126 },
  // circle/dashboard 类型路径两端的形状
  textInside: { type: Boolean, default: false },
  format: { type: Function },
  // 进度条颜色
  color: { type: [String, Array, Function], default: '' },
  // 背景条颜色
  bc: { type: String, default: '#ebeef5' },
})

const lineStyle = computed(() => {
  return {
    height: ps.height + 'px',
    backgroundColor: ps.bc,
    'border-radius': ps.strokeLinecap == 'round' ? '10px' : '0'
  }
})

const barStyle = computed(() => {
  const style = {};
  style.width = ps.value + '%';
  style.backgroundColor = getCurrentColor(ps.value);
  style.borderRadius = ps.strokeLinecap == 'round' ? '10px' : '0';
  return style;
})

const relativeStrokeWidth = computed(() => {
  return (ps.height / ps.width * 100).toFixed(1);
})

const radius = computed(() => {
  if (ps.type === 'circle' || ps.type === 'dashboard') {
    return parseInt(50 - parseFloat(relativeStrokeWidth.value) / 2, 10);
  } else {
    return 0;
  }
})

const trackPath = computed(() => {
  const radius = radius.value;
  const isDashboard = ps.type === 'dashboard';
  return `
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${radius}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
          `;
})

const perimeter = computed(() => {
  return 2 * Math.PI * radius.value;
})

const rate = computed(() => {
  return ps.type === 'dashboard' ? 0.75 : 1;
})

const strokeDashoffset = computed(() => {
  const offset = -1 * perimeter.value * (1 - rate.value) / 2;
  return `${offset}px`;
})

const trailPathStyle = computed(() => {
  return {
    strokeDasharray: `${(perimeter.value * rate.value)}px, ${perimeter.value}px`,
    strokeDashoffset: strokeDashoffset.value
  };
})

const circlePathStyle = computed(() => {
  return {
    strokeDasharray: `${perimeter.value * rate.value * (ps.value / 100)}px, ${perimeter.value}px`,
    strokeDashoffset: strokeDashoffset.value,
    transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
  };
})

const stroke = computed(() => {
  let ret;
  if (ps.color) {
    ret = getCurrentColor(ps.value);
  } else {
    switch (ps.status) {
      case 'success':
        ret = '#13ce66';
        break;
      case 'exception':
        ret = '#ff4949';
        break;
      case 'warning':
        ret = '#e6a23c';
        break;
      default:
        ret = '#20a0ff';
    }
  }
  return ret;
})

const iconClass = computed(() => {
  if (ps.status === 'warning') {
    return 'el-icon-warning';
  }
  if (ps.type === 'line') {
    return ps.status === 'success' ? 'el-icon-circle-check' : 'el-icon-circle-close';
  } else {
    return ps.status === 'success' ? 'el-icon-check' : 'el-icon-close';
  }
})

const progressTextSize = computed(() => {
  return ps.type === 'line' ? 12 + ps.height * 0.4 : ps.width * 0.111111 + 2;
})

const content = computed(() => {
  if (typeof ps.format === 'function') {
    return ps.format(ps.value) || '';
  } else {
    return `${ps.value}%`;
  }
})

function getCurrentColor(value) {
  if (typeof ps.color === 'function') {
    return ps.color(value);
  } else if (typeof ps.color === 'string') {
    return ps.color;
  } else {
    return getLevelColor(value);
  }
}

function getLevelColor(value) {
  const colorArray = getColorArray().sort((a, b) => a.value - b.value);

  for (let i = 0; i < colorArray.length; i++) {
    if (colorArray[i].value > value) {
      return colorArray[i].color;
    }
  }
  return colorArray[colorArray.length - 1].color;
}

function getColorArray() {
  const color = ps.color;
  const span = 100 / color.length;
  return color.map((seriesColor, index) => {
    if (typeof seriesColor === 'string') {
      return {
        color: seriesColor,
        progress: (index + 1) * span
      };
    }
    return seriesColor;
  });
}
</script>

<style lang='less'>
.wypress {
  position: relative;
  line-height: 1;
}

.wypress__text {
  font-size: 14px;
  color: #606266;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  line-height: 1;
}

.wypress__text i {
  vertical-align: middle;
  display: block;
}

.wypress--circle,
.wypress--dashboard {
  display: inline-block;
}

.wypress--circle .wypress__text,
.wypress--dashboard .wypress__text {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 0;
  transform: translateY(-50%);
}

.wypress--circle .wypress__text i,
.wypress--dashboard .wypress__text i {
  vertical-align: middle;
  display: inline-block;
}

.wypress--without-text .wypress__text {
  display: none;
}

.wypress--without-text .wypress-bar {
  padding-right: 0;
  margin-right: 0;
  display: block;
}

.wypress--text-inside .wypress-bar {
  padding-right: 0;
  margin-right: 0;
}

.wypress.is-success .wypress-bar__inner {
  background-color: #67c23a;
}

.wypress.is-success .wypress__text {
  color: #67c23a;
}

.wypress.is-warning .wypress-bar__inner {
  background-color: #e6a23c;
}

.wypress.is-warning .wypress__text {
  color: #e6a23c;
}

.wypress.is-exception .wypress-bar__inner {
  background-color: #f56c6c;
}

.wypress.is-exception .wypress__text {
  color: #f56c6c;
}

.wypress-bar {
  padding-right: 50px;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  margin-right: -55px;
  box-sizing: border-box;
}

.wypress-bar__outer {
  height: 6px;
  border-radius: 100px;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
}

.wypress-bar__inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #409eff;
  text-align: right;
  border-radius: 100px;
  line-height: 1;
  white-space: nowrap;
  transition: width 0.6s ease;
}

.wypress-bar__inner:after {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}

.wypress-bar__innerText {
  display: inline-block;
  vertical-align: middle;
  color: #fff;
  font-size: 12px;
  margin: 0 5px;
}

@keyframes progress {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: 32px 0;
  }
}
</style>