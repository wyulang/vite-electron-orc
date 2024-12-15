<template>
  <div :class="class" @click="changeValue(item)" v-for="(item, index) in path" :key="index" :style="{'cursor':item.disabled?'not-allowed':''}" class="flex-line hand ai-c mr10">
    <div :class="icon">
      <svg :class="icon" :style="{'fill':color[setColor(item)]}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13328">
        <path v-if="!setColor(item)"
          d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m0-85.333334a341.333333 341.333333 0 1 0 0-682.666666 341.333333 341.333333 0 0 0 0 682.666666z m0-128a213.333333 213.333333 0 1 1 0-426.666666 213.333333 213.333333 0 0 1 0 426.666666z">
        </path>
        <path v-else d="M512 938.666667a426.666667 426.666667 0 1 1 426.666667-426.666667 426.666667 426.666667 0 0 1-426.666667 426.666667z m0-768a341.333333 341.333333 0 1 0 341.333333 341.333333 341.333333 341.333333 0 0 0-341.333333-341.333333z"></path>
      </svg>
    </div>
    <div v-if="item.label" :style="{'color':color[setColor(item)]}" class="ml5">
      <slot :item="{...item,index}">{{item.label}}</slot>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { setParm, isString, isArray, isObject } from "@lib/lang";
import { computed } from "vue";
const ps = defineProps({
  data: { type: Array, default: [] },
  color: { type: [Array, String], default: ['#3699ff', '#888'] },
  class: { type: [Array, String], default: "" },
  icon: { type: [Array, String], default: "w-20 h-20" },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  // modelValue: { type: [String, Number, Boolean, Object, Array], default: "" },
  // 取值 props="name,id" 对应的是 label,value
  props: { type: [String, Object, Array], default: "" },
  //禁用列表 禁用哪些值如:[1,2]
  exclude: { type: Array }
})

const mvalue = defineModel({ type: [String, Number, Boolean, Object, Array], default: "" });

const emit = defineEmits(["change"]);

const parm = computed(() => {
  return setParm(ps.props)
})

function changeValue(item) {
  if (!ps.disabled && !item.disabled) {
    if (ps.data.length) {
      mvalue.value=item.value;
      emit('change', item.value)
    } else {
      mvalue.value=true;
      emit('change', true)
    }
  }
}

const path = computed(() => {
  let list = [];
  if (ps.data.length) {
    list = ps.data.map(v => {
      let opt = {};
      if (typeof v == "string" ||typeof v=="number") {
        let disabled = ps.exclude && ps.exclude.map(v => String(v)).includes(String(v)) || false;
        opt = { label: v, value: v, disabled };
      } else {
        let disabled = ps.exclude && ps.exclude.map(v => String(v)).includes(String(v)) || false;
        opt = { ...v, label: v[parm.value.label], value: v[parm.value.value], disabled }
      }
      return opt
    })
  } else {
    list = [{ label: ps.label, value: mvalue.value }]
  }
  return list;
})

function setColor(item) {
  let v = String(mvalue.value);
  let inv = String(item.value);
  if (ps.data.length) {
    if (v == inv) {
      return 0
    } else {
      return 1;
    }
  } else {
    if (mvalue.value) {
      return 0;
    } else {
      return 1;
    }
  }
}

</script>

<style lang='less'>

</style>