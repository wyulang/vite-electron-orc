<template>
  <section style="user-select:none;" class="w-all">
    <tree :draggable="draggable" :getSelectNode="getSelectNode" :activeClass="activeClass" :class="class" :isParentValue="isParentValue" :sTreeid="sTreeid" :mvalue="mvalue" :treeMove="treeMove" :isOpen="isOpen" :treeDbclick="treeDbclick" :showOpen="showOpen" :iconLevel="iconLevel" v-slot="data" :single="single"
      :check="check" :data="trees" :only="only" @onCheckValue="onCheckValue" :expand="expand" :props="props" :level="0">
      <slot :node="data.node" :parent="data.parent" :index="data.index"></slot>
    </tree>
  </section>
</template>

<script setup lang='ts'>

// 用法
// <tree 
// activeClass="tree-select" 
// class="pt6 tree-video fs-14 pb6" 
//  v-slot="{node,parent,index}"
// :iconLevel="['icon-box-seam-fill2 mr6','icon-folder-open-fill mr6','icon-inbox2-fill mr6','icon-hdd-fill-2 mr6']">
// <span @click.stop="btnDel(node,parent,index)" class="fc-danger hand ml10">删除</span>
// </tree>


import { isNumber, setParm } from "@lib/lang";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import tree from './node.vue';
const ps = defineProps({
  // 行样式 
  class: { type: String, default: "" },
  // 行选中样式 active-tree 
  activeClass: { type: String, default: "" },
  // 树内搜索 自动完成 watch监听 有值且变更就搜索 如引用页面: <input placeholder="请输入关键字" v-model="filterText">
  filterText: { type: String, default: "" },
  // 当前几级，不用传，不用管
  level: { type: Number, default: 0 },
  // 自定义展开关闭图标, iconfix="open,close" 为iconfont 图标, iconfix="open fs-20 fc-success,close fs-20 fc-danger"
  iconfix: { type: String, default: '' },
  // 自定义前缀图标 如iconLevel="icon,icon2,icon3,icon4" 第一级为icon,第二级为icon2 ...  如超出取最后一个图标
  iconLevel: { type: Array, default: null },
  // 是否单选[可多个值]，单选就不会连带勾选下级，只选当前NODE
  only: { type: Boolean, default: false },
  // 是否可以拖动
  draggable: { type: Boolean, default: false },
  // 是否单选【只选一个值】 不能与only同时存在
  single: { type: Boolean, default: false },
  // change list中的值是否取父级节点值 如false 只取不含子级节点选项 表现为change 中的list {value，list}值 value值还是会返回父节点值
  isParentValue: { type: Boolean, default: true },
  // 是否展开所有 也可以为1 展开第一层
  expand: { type: [Boolean, Number, String], default: 0 },
  //树型数据
  data: { type: Array, default: [] },
  // 这个不用传
  parent: { type: [String, Number, Object], },
  // 最后一次展开/收起时 返回当前对像  根据返回的 open：false/true 来处理以下的业务 
  getSelectNode: { type: Function },
  // 拖动事件 拖事件自己写 只返回 event与当前item 后续处里自己定制
  treeMove: { type: Function },
  // 双击事件
  treeDbclick: { type: Function },
  // 最后一次点击checkbox 返回当前对像
  getCheckNode: { type: Function },
  // 是否显示选择框 
  check: { type: Boolean, default: true },
  // 显示三角图标
  showOpen: { type: Boolean, default: true },
  // 点击标题是否执行展开/关闭动作
  isOpen: { type: Boolean, default: true },
  // 配置选项 props="label,value,children"; 也可以props="{label:name,value:id,children:list}"
  props: { type: [Array, Object, String], default: ['label', 'value'] },
})

const emit = defineEmits(["change"]);

// modelValue v-model="value"
const mvalue = defineModel({ type: [String, Number, Object], default: "" });
// end v-model:end="value"
const label = defineModel('label', { type: [String, Number, Object], default: "" });
const parm = setParm(ps.props);

const trees = ref([]);
const sTreeid = ref([]);
const serchList = ref([]);
// 是否首次拿到 节点ID 是否点击后拿到的mvlaue值
const isClickValue = ref(false);

watch(() => mvalue.value, (news, old) => {
  sTreeid.value = [];
  let cvalue = mvalue.value || [];
  if (typeof mvalue.value == "string" || typeof mvalue.value == "number") {
    cvalue = String(mvalue.value).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || []
  }
  getTreeid(ps.data, 0, null, cvalue);
})

watch(() => ps.filterText, (news, old) => {
  serchList.value = [];
  if (String(news)) {
    serchText(ps.data)
  } else {
    serchList.value = [];
  }
  if (serchList.value.length) {
    trees.value = initTree(serchList.value, 0, null)
  } else {
    if (news) {
      trees.value = []
    } else {
      trees.value = initTree(ps.data, 0, null)
    }
  }
})

function serchText(list) {
  if (list && list.length) {
    list.forEach(item => {
      if (item[parm.label].includes(ps.filterText)) {
        serchList.value.push(item)
      }
      serchText(item[parm.child])
    })
  }
}

function onCheckValue(v) {
  let cvalue = v || [];
  if (typeof v == "string" || typeof v == "number") {
    cvalue = String(v).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || []
  }
  isClickValue.value = true;
  setTimeout(() => {
    mvalue.value = v;
    emit('change', { value: v, node: getNode(ps.data, [], cvalue) })
  }, 1);
}

watch(() => ps.data, (news, old) => {
  trees.value = [];
  if (isClickValue.value) {
    trees.value = initTree(ps.data, 0, null)
  }
})

watchEffect(() => {
  if (!isClickValue.value) {
    trees.value = [];
    trees.value = initTree(ps.data, 0, null)
  }
})

onMounted(() => {
  if (mvalue.value.toString()) {
    sTreeid.value = [];
    let cvalue = mvalue.value || [];
    if (typeof mvalue.value == "string" || typeof mvalue.value == "number") {
      cvalue = String(mvalue.value).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || []
    }
    getTreeid(ps.data, 0, null, cvalue);
  }
})

function getNode(list, rlist = [], value) {
  if (list && list.length) {
    list.forEach((item, i) => {
      if (value?.some(s => String(s) == String(item[parm.value]))) {
        rlist.push(item)
      }
      getNode(item[parm.child], rlist, value)
    })
  }
  return rlist
}

function getTreeid(list, level, id, value: any = []) {
  if (list && list.length) {
    list.forEach((item, i) => {
      let lid = (!id ? `t${i}` : `${id}-${i}`);
      if (value?.some(s => String(s) == String(item[parm.value]))) {
        sTreeid.value.push({ value: item[parm.value], id: lid, level });
      }
      getTreeid(item[parm.child], level + 1, lid, value)
    })
  }
}

function initTree(list, level, id) {
  if (list && list.length) {
    return list.map((item, i) => {
      let lid = (!id ? `t${i}` : `${id}-${i}`);
      let children = initTree(item[parm.child], level + 1, lid);
      return {
        ...item,
        value: item[parm.value],
        label: item[parm.label],
        children,
        $treeid: lid,
        $open: typeof item.$open == "boolean" ? item.$open : (level < Number(ps.expand))
      }
    })
  }
}

</script>

<style lang='less'>
.arrow {
  transform: rotate(0deg);
  transition: transform 0.1s ease-in-out;
  &.isOpen {
    transform: rotate(90deg);
  }
}
.tree-item {
  &:hover {
    background-color: #f7f7f7;
  }
}
</style>