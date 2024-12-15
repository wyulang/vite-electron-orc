<template>
  <div :class="class" class="flex-line hand ai-c" @click="onChange">
    <span>{{title}}</span>
    <svg :class="size" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M755.370667 430.506667c0 8.192-2.986667 15.36-8.96 21.333333a29.354667 29.354667 0 0 1-21.333334 9.045333H298.922667a29.354667 29.354667 0 0 1-21.333334-8.96 29.184 29.184 0 0 1-9.045333-21.418666c0-8.192 2.986667-15.36 8.96-21.333334L490.666667 196.010667A29.184 29.184 0 0 1 512 187.136c8.192 0 15.36 2.986667 21.333333 8.96l213.077334 212.992c5.973333 5.973333 8.96 13.141333 8.96 21.333333z"
        :fill="lowfc"></path>
      <path
        d="M746.410667 591.616c5.973333 5.973333 8.96 13.226667 8.96 21.333333 0 8.277333-2.986667 15.445333-8.96 21.418667L533.333333 847.36a29.354667 29.354667 0 0 1-21.418666 9.045333 29.354667 29.354667 0 0 1-21.333334-9.045333L277.504 634.368a29.184 29.184 0 0 1-8.96-21.333333c0-8.192 2.986667-15.36 8.96-21.418667a29.184 29.184 0 0 1 21.333333-9.045333h426.069334c8.277333 0 15.36 2.986667 21.333333 9.045333z"
        :fill="upfc"></path>
    </svg>
  </div>
  <!--用法 <order @change="v=>{changeOrder(v,item.orderby)}" v-if="item.orderby" :title="item.label" :field="item.orderby" :orderby="query.orderby" v-model="query.ascOrDesc"></order> -->
</template>

<script setup lang='ts'>
import { computed } from "vue"

const ps = defineProps({
  title: { type: String, default: "名称" },
  // 列标题名称
  orderby: { type: [String,Number], default: "" },
  //字段名称 如name,title..
  field: { type: [String,Number], default: "" },
  // 是否显示，父级需要控制显示时用到
  show: { type: Boolean, default: false },
  // 样式
  class: { type: String, default: "" },
  // 当前排序图标颜色
  fc: { type: String, default: "#000" },
  // 当前未排序图片颜色（底色）
  bc: { type: String, default: "#ccc" },
  // 图标大小
  size: { type: String, default: "w-18 h-18" }
})
// modelValue v-model="value"
const mvalue = defineModel({ type: [String, Number], default: "" });
const emit = defineEmits(["change"]);
const visible = computed(() => {
  return ps.show && mvalue.value
})

const lowfc = computed(() => {
  if (mvalue.value && String(ps.field) == String(ps.orderby)) {
    if (mvalue.value.toLocaleLowerCase() == 'asc') {
      return ps.fc
    } else {
      return ps.bc
    }
  } else {
    return ps.bc;
  }
})
const upfc = computed(() => {
  if (mvalue.value && String(ps.field) == String(ps.orderby)) {
    if (mvalue.value.toLocaleLowerCase() == 'asc') {
      return ps.bc
    }
    return ps.fc
  } else {
    return ps.bc
  }
})

function onChange() {
  let value = mvalue.value.toLocaleLowerCase() == 'asc' ? 'desc' : 'asc';
  mvalue.value = value;
  emit('change', { title: ps.title, value, field: ps.field })
}
</script>

<style lang='less'>
</style>