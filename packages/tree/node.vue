<template>
  <div v-for="item,i in data" class="w-all">
    <div :draggable="draggable" :style="{'padding-left':`${level*25}px`}" @dblclick="dbTree($event,item)" @dragstart="dragstart($event,item)" @mousedown="treeMove($event,item)" :class="itemClass(item)" @click="onHandItem(item,i)" class="w-all flex ai-c">
      <!-- checkbox -->
      <svg v-if="check" @click.stop="onCheckNode(item)" viewBox="0 0 1024 1024" class="w-25 wi-25 hi-25 ra-3 hidden hand  h-25">
        <path v-if="item._check===1" style="fill:#409eff"
          d="M170.666667 128h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m128 341.333333v85.333334h426.666666v-85.333334H298.666667z">
        </path>
        <path v-else-if="item._check===2" style="fill:#409eff"
          d="M170.666667 128h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m298.794666 554.666667l301.653334-301.696-60.330667-60.330667-241.322667 241.365333-120.704-120.704-60.330666 60.330667L469.461333 682.666667z">
        </path>
        <path v-else style="fill:#bbb"
          d="M802.133333 911.68h-576a117.461333 117.461333 0 0 1-117.333333-117.333333v-576c0-64.704 52.629333-117.333333 117.333333-117.333334h576c64.704 0 117.333333 52.629333 117.333334 117.333334v576c0 64.704-52.629333 117.333333-117.333334 117.333333z m-576-746.666667a53.397333 53.397333 0 0 0-53.333333 53.333334v576c0 29.397333 23.936 53.333333 53.333333 53.333333h576c29.397333 0 53.333333-23.936 53.333334-53.333333v-576c0-29.397333-23.936-53.333333-53.333334-53.333334h-576z">
        </path>
      </svg>
      <!-- 三角型 -->
      <span v-if="iconfix" :class="item.$open?iconfix[0]:iconfix[1]" class="iconfont"></span>
      <div v-if="showOpen" @click.stop="onExpand(item)" :class="{'w-20 h-20':item.children?.length,'h-20 w-7':!item.children?.length}">
        <svg style="fill:#ddd" v-if="item.children?.length" :class="{'isOpen':item.$open}" class="w-20 hand arrow h-20" viewBox="0 0 1024 1024">
          <path
            d="M446.293333 768a95.146667 95.146667 0 0 1-38.826666-8.533333 75.093333 75.093333 0 0 1-44.8-67.84V332.373333A75.093333 75.093333 0 0 1 407.466667 264.533333a89.6 89.6 0 0 1 94.293333 11.093334l217.6 179.626666a72.533333 72.533333 0 0 1 0 113.493334l-217.6 179.626666a87.893333 87.893333 0 0 1-55.466667 19.626667z">
          </path>
        </svg>
      </div>
      <!-- iconLevel -->
      <span v-if="iconLevel" :class="iconLevel[level]||iconLevel[iconLevel.length-1]" class="iconfont "></span>
      <slot :node="item" :parent="data" :index="i">
        {{item.label}}
      </slot>
    </div>
    <!-- child 下级 -->
    <tree :draggable="draggable" v-if="item.$open&&item.children" :mvalue="mvalue" :activeClass="activeClass" :sTreeid="sTreeid" :getSelectNode="getSelectNode" :isParentValue="isParentValue" :treeMove="treeMove" :isOpen="isOpen" :treeDbclick="treeDbclick" :showOpen="showOpen" :iconLevel="iconLevel" v-slot="data"
      :single="single" :check="check" :data="item.children" :only="only" :expand="expand" :class="class" @onCheckValue="onCheckValue" :props="props" :level="level+1">
      <slot :node="data.node" :parent="data.parent" :index="data.index"></slot>
    </tree>
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import tree from './node.vue';
const ps = defineProps({
  // 行样式 
  class: { type: String, default: "" },
  // 行选中样式 active-tree 
  activeClass: { type: String, default: "" },
  // 行样式 
  selectValue: { type: [String, Number, Object], default: "" },
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
  mvalue: { type: [Array, Number, String], default: [] },
  sTreeid: { type: Array, default: [] },
  isOpen: { type: Boolean, default: true },
  // 配置选项 props="label,value,children"; 也可以props="{label:name,value:id,children:list}"
  props: { type: [Array, Object, String], default: ['label', 'value'] },
})

const emit = defineEmits(["onCheckValue"]);

function onHandItem(item, i) {
  if (ps.isOpen) {
    item.$open = !item.$open;
  }

  if (ps.getSelectNode) {
    ps.getSelectNode(item)
  }
}

function onCheckValue(value) {
  emit('onCheckValue', value)
}

function onCheckNode(item) {
  if (ps.only) {
    let curr = [];
    if (item._check == 2) {
      ps.sTreeid.forEach(v => {
        if (item.$treeid != v.id) {
          curr.push(v)
        }
      })
      onCheckValue(curr.map(m => m.value))
    } else {
      onCheckValue([].concat(ps.sTreeid.map(m => m.value)).concat([item.value]))
    }
  }
  else if (ps.single) {
    if (item._check == 2) {
      onCheckValue("")
    } else {
      onCheckValue(item.value)
    }
    return;
  } else {
    let currTree = [{ value: item.value, id: item.$treeid }];
    currTree = getTreeid(item.children, currTree)
    if (item._check == 2) {
      let curr = [];
      ps.sTreeid.forEach(v => {
        if (!currTree.some(m => m.id == v.id)) {
          curr.push(v)
        }
      })
      // ps.mvalue = curr.map(m => m.value
      onCheckValue(curr.map(m => m.value))
    } else {
      // ps.mvalue = ps.sTreeid.concat(currTree).map(m => m.value)
      onCheckValue(ps.sTreeid.concat(currTree).map(m => m.value))
    }
  }
}

function getTreeid(list, treelist = []) {
  if (list && list.length) {
    list.forEach(item => {
      treelist.push({ value: item.value, id: item.$treeid })
      if (item.children) {
        return getTreeid(item.children, treelist)
      }
    })
  }
  return treelist
}

function onExpand(item) {
  item.$open = !item.$open;
  if (ps.getSelectNode) {
    ps.getSelectNode(item)
  }
}

// 拖动事件
function dragstart(e, data) {
  e.dataTransfer.setData("text", JSON.stringify(data))
}

watchEffect(() => {
  ps.data.forEach(item => {
    if (ps.only || ps.single) {
      if (ps.sTreeid.some(m => m.id == item.$treeid)) {
        item._check = 2;
      } else {
        item._check = 0;
      }
    } else {
      // 查下级选中数量
      let nextLen = ps.sTreeid.filter(v => {
        return ((item.$treeid.split('-').length + 1) == v.id?.split('-').length) && v.id?.includes(item.$treeid + '-');
      })
      if (ps.sTreeid.some(m => m.id == item.$treeid) && (!(item.children && item.children.length) || !item.children)) {
        // 没级下级，选中项中有当前值
        item._check = 2;
      } else if (nextLen.length == item.children?.length) {
        // 如果下级选中数量与子级数理机同则，父级选中;
        item._check = 2;
      } else if (nextLen.length && nextLen.length < item.children?.length) {
        item._check = 1;
      } else if (ps.sTreeid.filter(v => { return v.id?.includes(item.$treeid + '-') }).length) {
        // 查子级是否有选中的
        item._check = 1;
      } else {
        item._check = 0;
      }
    }
  })
})

// 移动事件
function treeMove(e, item) {
  if (!ps.treeMove) return;
  setTimeout(() => {
    ps.treeMove(e, item)
  }, 10);
}

// 双击事件
function dbTree(e, item) {
  ps.treeDbclick && ps.treeDbclick(e, item)
}

function itemClass(item) {
  let cvalue = ps.mvalue || [];
  if (typeof ps.mvalue == "string" || typeof ps.mvalue == "number") {
    cvalue = String(ps.mvalue).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || []
  }

  return {
    [ps.class]: true,
    [ps.activeClass]: cvalue.some(m => String(m) == String(item.value))
  }
}
</script>

<style lang='less'>
</style>