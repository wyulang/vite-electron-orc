<template>
  <div :class="checkBoxClass(item)" @click="onItemSelect(item)" v-for="(item, index) in path" :key="index" class="flex hand flex-line ">
    <div :class="icon">
      <svg t="1624104631224" :class="icon" :style="{'fill':item.select?color[0]:color[1]}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path v-if="item.select"
          d="M887.466667 1024h-750.933334c-75.093333 0-136.533333-61.44-136.533333-136.533333V136.533333c0-75.093333 61.44-136.533333 136.533333-136.533333h750.933334c75.093333 0 136.533333 61.44 136.533333 136.533333v750.933334c0 75.093333-63.146667 136.533333-136.533333 136.533333z m-134.826667-735.573333L433.493333 628.053333l-153.6-165.546666-71.68 76.8 225.28 242.346666 390.826667-414.72-71.68-78.506666z">
        </path>
        <path v-else
          d="M171.434667 85.333333A86.186667 86.186667 0 0 0 85.333333 171.434667V852.48A86.186667 86.186667 0 0 0 171.434667 938.666667H852.48A86.186667 86.186667 0 0 0 938.666667 852.565333V171.52A86.186667 86.186667 0 0 0 852.565333 85.333333H171.52z m0-85.333333H852.48C947.029333 0 1024 76.8 1024 171.434667V852.48A171.52 171.52 0 0 1 852.565333 1024H171.52A171.52 171.52 0 0 1 0 852.565333V171.52C0 76.970667 76.8 0 171.434667 0z">
        </path>
      </svg>
    </div>

    <div class="ml6 flex-line itemline ai-c" v-if="item.label">
      <slot :item="{...item,index}">{{item.label}}</slot>
    </div>
  </div>
</template>

<script setup lang='ts'>
// <checkbox v - slot="{item}" props = "id,id" class="mt12 bc-f5 h-36 mr10 ra-4 wb-95 pl10" : data = "info.shortcutList" >
//   <span class="fc-000" > 片段{ { item.serialNumber } } </span>
//     < span class="pl15 fs-15" > {{ item.starTime }} - {{ item.endTime }}</span>
// < /checkbox>
import { isArray, setParm } from "@lib/lang";
import { computed } from "vue"

const ps = defineProps({
  data: { type: [Array, String, Boolean, Number], default: false },
  value: { type: [String, Boolean, Number], default: "" },
  // 选中颜色
  color: { type: [Array, String], default: ['#3699ff', '#888'] },
  // 选中框大小
  icon: { type: [String, Number], default: "h-20 w-20" },
  size: { type: [String, Number], default: "20" },
  disabled: { type: Boolean, default: false },
  // 样式
  class: { type: String, default: "" },
  modelValue: { type: [Array, String, Number, Boolean], default: false },
  // 取到的label值
  label: { type: [Array, String, Number, Boolean], default: "" },
  // label,value 显示值
  props: { type: [Array, Object, String], default: ['label', 'value'] },
  //禁用列表 禁用哪些值如:[1,2]
  exclude: { type: Array },
})

const emit = defineEmits(["update:modelValue", "change", "update:label",]);

function checkBoxClass(item) {
  return {
    ['h-' + ps.size]: ps.size,
    ['lh-' + ps.size]: ps.size,
    'fc-ccc allowed': item.disable,
    'ai-c':true,
    [ps.class]: ps.class,
  }
}

function onItemSelect(item) {
  if (typeof ps.value === "boolean") {
    if (item.disable || ps.disabled) {
      return
    } else {
      // emit('update:modelValue', !ps.value);
      emit('change', item.value)
    }
  } else {
    if (!(item.disable || ps.disabled)) {
      let curr = [];
      let value: any = ps.modelValue || [];
      let label: any = ps.label || [];

      if (typeof value == "string") {
        value = value.replace(/[，|\-、\/]/g, ',').split(',')
      }

      if (isArray(ps.data)) {
        if (value.some(s => String(s) === String(item.value))) {
          value = value.filter(v => String(v) !== String(item.value))
          label = label.filter(v => String(v) !== String(item.label))
        } else {
          value.push(item.value)
          label.push(item.label)
        }
      } else {
        if (typeof ps.data === "boolean") {
          value = !ps.modelValue
        } else {
          if (String(ps.modelValue)) {
            val = "";
          } else {
            val = item.value;
          }
        }
      }
      emit("update:modelValue", value)
      emit("update:label", label)
      emit("change", value)
    }
  }
}

const parm = computed(() => {
  return setParm(ps.props)
})

const path = computed(() => {
  if (typeof ps.value === "boolean") {
    return [{ value: ps.value, label: ps.label || "", select: ps.disabled ? false : ps.value, disable: ps.disabled }]
  } else {
    if (isArray(ps.data)) {
      let curr = ps.modelValue || [];
      if (typeof curr == "string") {
        curr = curr.replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',')
      }
      return ps.data.map(v => {
        if (typeof v == "string") {
          let disable = ps.exclude && ps.exclude.map(m => String(m)).includes(v) || false;
          return { value: v, label: v, select: curr.some(s => String(s) == String(v)), disable }
        } else {
          let disable = ps.exclude && ps.exclude.map(v => String(v)).includes(v[parm.value.value]) || false;
          return { ...v, value: v[parm.value.value], label: v[parm.value.label], select: curr.some(s => String(v[parm.value.value]) === String(s)), disable }
        }
      })
    } else {
      // 当data 为bool类型
      if (typeof ps.data === "boolean") {
        return [{ value: ps.modelValue || false, label: ps.label, select: ps.modelValue }]
      } else {
        // 当data为 String Number 或为空时
        if (ps.data !== null || ps.data != undefined) {
          return [{ value: ps.data, label: ps.label, select: String(ps.modelValue) === String(ps.data) }]
        } else {
          return []
        }
      }
    }
  }
})
</script>

<style lang='less'>
.allowed {
  svg {
    fill: #ccc !important;
  }
}
.is_dis {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>