<template>
  <div @click="onChange" :style="currStyle" :class="currClass" class="flex-line ra-16 _switch hand pl6 pt4 pb4 pr6">
    <div :style="countentWidth" class="ra-16 rel ai-c nowrap flex-line">
      <span ref="swlabel" class="flex-line ">{{show&&path.label||''}}</span>
      <svg :class="svgSize" class="abs abst" fill="#fff" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 512C0 229.230208 229.805588 0 512 0 794.769792 0 1024 229.805588 1024 512 1024 794.769792 794.194412 1024 512 1024 229.230208 1024 0 794.194412 0 512Z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang='ts'>
//使用方法    <Switch class="fs-18" open="开启" close="关闭" show v-model="value"></Switch>
import { computed, onMounted, ref, watch, watchEffect } from "vue"
import { isString, isArray, isObject } from '@lib/lang';
const ps = defineProps({
  modelValue: { type: [String, Number, Boolean], default: "" },
  // label,value,color  open="开启,true,#fffff"
  open: { type: [Array, String, Object], default: { value: true, label: "是" } },
  // label,value,color  open="开启,true,#fffff"
  close: { type: [Array, String, Object], default: { value: false, label: "否" } },
  show: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  // 传过来的数据，change事件原样返回
  data: { type: [String, Number, Object, Array] },
  class: { type: String, default: "h-30" }
})

const swlabel = ref(null);
const emit = defineEmits(["update:modelValue", "change"]);
const contentWidth = ref(0);

const countentWidth = computed(() => {
  if (path.value.select) {
    return {
      // width: width + 'px',
      ['padding-right']: svgSize.value.value + svgSize.value.value + 'px',
      ['justify-content']: 'flex-start',
    }
  } else {
    return {
      // width: width + 'px',
      ['padding-left']: svgSize.value.value + svgSize.value.value + 'px',
      ['justify-content']: 'flex-end',
    }
  }
})


function onChange() {
  if (!ps.disabled) {
    if (path.value.select) {
      emit('update:modelValue', path.value.close.value)
      emit('change', path.value.close.value)
    } else {
      emit('update:modelValue', path.value.open.value)
      emit('change', path.value.open.value)
    }
  }
}

const path = computed(() => {
  let open: any;
  let close: any;
  if (ps.open) {
    if (isString(ps.open)) {
      let obj = ps.open.split(',');
      open = { value: (obj[1] === "true" ? true : obj[1] || true), label: obj[0] || "是", color: obj[2] || '#409eff' }
    } else if (isArray(ps.open)) {
      open = { value: (ps.open[1] === "true" ? true : ps.open[1] || true), label: ps.open[0] || "是", color: ps.open[2] || '#409eff' }
    } else if (isObject(ps.open)) {
      open = { value: ps.open.value==="true"?true:ps.open.value || true, label: ps.open.label || "是", color: ps.open.color || '#409eff' }
    }
  }
  if (ps.close) {
    if (isString(ps.close)) {
      let obj = ps.close.split(',');
      close = { value: (obj[1] === "false" ? false : obj[1] || false), label: obj[0] || "否", color: obj[2] || '#d5d5d5' }
    } else if (isArray(ps.close)) {
      close = { value: (ps.close[1] === "false" ? false : ps.close[1] || false), label: ps.close[0] || "否", color: ps.close[2] || '#d5d5d5' }
    } else if (isObject(ps.close)) {
      close = { value: ps.close.value || false, label: ps.close.label || "否", color: ps.close.color || '#d5d5d5' }
    }
  }

  let label;
  let select = false;
  if (String(ps.modelValue) == String(open.value)) {
    label = open.label;
    select = true;
  } else {
    label = close.label;
  }
  return { open, close, label, select }
})

const currStyle = computed(() => {
  if (String(ps.modelValue) == String(path.value.open.value)) {
    return `background-color:${path.value.open.color};`
  } else {
    return `background-color:${path.value.close.color};`
  }
})

const currClass = computed(() => {
  let fs = parseInt(swlabel.value && getComputedStyle(swlabel.value).getPropertyValue('font-size') || "12");
  if (String(ps.modelValue) == String(path.value.open.value)) {
    return {
      'switch-true': true,
      'allowed': ps.disabled,
      'fc-fff': true,
      ['hi-' + (fs + 10)]: true,
      [ps.class]: ps.class
    }
  } else {
    return {
      'fc-999': true,
      'switch-false': true,
      'allowed': ps.disabled,
      ['hi-' + (fs + 10)]: true,
      [ps.class]: ps.class
    }
  }
})

const svgSize = computed(() => {
  let fs = parseInt(swlabel.value && getComputedStyle(swlabel.value).getPropertyValue('font-size') || "12");
  return {
    ['h-' + (fs + 3)]: true,
    ['w-' + (fs + 3)]: true,
    value: fs
  }
})

</script>

<style lang='less'>
._switch {
  transition: all 0.21s ease;
  svg {
    transition: all 0.21s ease;
  }
}
.switch-true {
  svg {
    right: 0;
  }
}
.switch-false {
  svg {
    left: 0;
  }
}
</style>