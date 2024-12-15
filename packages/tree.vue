<template>
  <section v-for="(item,index) in trees" :key="index" style="user-select:none;" class="w-all">
    <div :style="{'padding-left':`${level*25}px`}" :draggable="draggable" @dblclick="dbTree($event,item)" @dragstart="dragstart($event,item)" @mousedown="treeMove($event,item)" :class="setLineClass(item)" @click="e=>{onOpenItem(index,item,e)}" class="w-all tree-item flex ai-c">
      <!-- checkbox -->
      <svg v-if="check" @click.stop="onCheckNode(index)" viewBox="0 0 1024 1024" class="w-25 ra-3 hidden hand  h-25">
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
      <span v-if="iconfix" :class="item.open?iconfix[0]:iconfix[1]" class="iconfont"></span>
      <div v-if="showOpen" @click.stop="onExpand(index)" :class="{'w-20 h-20':item.children.length,'h-20 w-7':!item.children.length}">
        <svg style="fill:#ddd" v-if="item.children.length" :class="{'isOpen':item.open}" class="w-20 hand arrow h-20" viewBox="0 0 1024 1024">
          <path
            d="M446.293333 768a95.146667 95.146667 0 0 1-38.826666-8.533333 75.093333 75.093333 0 0 1-44.8-67.84V332.373333A75.093333 75.093333 0 0 1 407.466667 264.533333a89.6 89.6 0 0 1 94.293333 11.093334l217.6 179.626666a72.533333 72.533333 0 0 1 0 113.493334l-217.6 179.626666a87.893333 87.893333 0 0 1-55.466667 19.626667z">
          </path>
        </svg>
      </div>
      <!-- iconLevel -->
      <span v-if="iconLevel" :class="iconLevel[level]||iconLevel[iconLevel.length-1]" class="iconfont "></span>
      <!-- 标题 -->
      <slot :node="slotNode(item,index)">
        <span class="fs-14">{{item.label}}</span>
      </slot>
    </div>

    <!-- child 下级 -->
    <tree v-if="item.open&&item.children.length" :draggable="draggable" :isParentValue="isParentValue" :select="select" :treeMove="treeMove" :isOpen="isOpen" :treeDbclick="treeDbclick" :showOpen="showOpen" :iconLevel="iconLevel" :getSelectNode="getSelectNode" :getCheckNode="getCheckNode" @onCheckValue="onCheckValue"
      @clickValue="clickValue" v-slot="data" :single="single" :check="check" :data="item.children" :only="only" :expand="expand" :lineClass="lineClass" v-model="value" :props="props" :parent="item.value" :level="level+1">
      <slot :node="data.node"></slot>
    </tree>
  </section>
  <!-- <tree :data="city" props="l,v,c"  line-class="bb-e" v-slot="{node}" :check=false> -->
</template>

<script setup lang='ts'>
import { isNumber, setParm } from "@lib/lang";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import tree from './tree.vue';

const ps = defineProps({
  // 行样式
  lineClass: { type: String, default: "" },
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
  // 是否显示选择框 当不显示时 可设置点击对像背景色 在引用页加上css 如：      当select参数同时存在时，不生效
  // .tree-item {
  //   border-radius: 8px;
  //   cursor: pointer;
  //   &:hover {
  //     background-color: #0f172a ;
  //   }
  // }
  // .tree-select {
  //   background-color: #155deb !important;
  // }
  check: { type: Boolean, default: true },
  // 当modelValuew值存在时，为选中的值设置选中状态，即颜色值变化 select=true, 或 select="#fff" 设置选中设值
  select: { type: [Boolean, String], default: false },
  // 显示三角图标
  showOpen: { type: Boolean, default: true },
  // 点击标题是否执行展开/关闭动作
  isOpen: { type: Boolean, default: true },
  // 配置选项 props="label,value,children"; 也可以props="{label:name,value:id,children:list}"
  props: { type: [Array, Object, String], default: ['label', 'value'] },
  modelValue: { type: [String, Number, Boolean, Array], default: "" }
})

const childValue = ref([])
const value: any = ref(typeof ps.modelValue == "object" ? ps.modelValue : [ps.modelValue || '']);
const list: any = ref([]);

const currValue = ref('')

function slotNode(item, index) {
  return {
    item: list.value.find(v => v[parm.value.value] == item[parm.value.value]),
    curr: item,
    children: item.children,
    level: ps.level,
    parent: list.value,
    index
  }
}

function dragstart(e, data) {
  e.dataTransfer.setData("text", JSON.stringify(data))
}

function onExpand(index) {
  let currlist = list.value;
  let curr = currlist[index]
  curr.open = !curr.open;
}

// 拖动事件
function treeMove(e, item) {
  console.log('treemove');
  
  setTimeout(() => {
    ps.treeMove && ps.treeMove(e, item)
  }, 10);
}
// 双击事件
function dbTree(e, item) {
  ps.treeDbclick && ps.treeDbclick(e, item)
}

function setLineClass(item) {
  if (ps.check) {
    return ps.lineClass
  }
  let cvalue = ps.modelValue || [];
  if (typeof ps.modelValue == "string" || typeof ps.modelValue == "number") {
    cvalue = String(ps.modelValue).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || []
  }

  if (ps.select) {
    if (typeof ps.select == "boolean") {
      return {
        [ps.lineClass]: true,
        'fc-primary': cvalue.includes(item.value.toString())
      }
    } else {
      return {
        [ps.lineClass]: true,
        [ps.select]: cvalue.includes(item.value.toString())
      }
    }
  }
  return {
    [ps.lineClass]: true,
    'tree-select': cvalue.includes(item.value.toString())
  }
}

const emit = defineEmits(["update:modelValue", "change", "update:label", "onCheckValue", "clickValue"]);

const parm = computed(() => {
  return setParm(ps.props)
})


// 取到所有选中值
function getTreeValue(list, cvalue: any = [], clist: any = [], level: any) {
  if (isNaN(level)) {
    level = 0
  } else {
    level++
  }
  list.forEach(item => {
    if (item._check == 2) {
      cvalue.push(item[parm.value.value])
      if (ps.isParentValue) {
        clist.push({ ...item, level: level })
      } else {
        if (!item[parm.value.child]?.length) {
          clist.push({ ...item, level: level })
        }
      }

    }
    if (item[parm.value.child]?.length) {
      return getTreeValue(item[parm.value.child], cvalue, clist, level)
    }
  })
  return { value: cvalue, list: clist };
}

// 展开/收起
function onOpenItem(index, item, e) {
  let currlist = list.value;
  if (ps.filterText && serchList.value.length) {
    currlist = serchList.value;
  }

  let curr = currlist[index]
  if (ps.isOpen) {
    curr.open = !curr.open;
  }

  if (!ps.check) {
    clickValue(item[parm.value.value]);
  }

  if (ps.getSelectNode) {
    ps.getSelectNode(curr, e)
  }
}

// 中转设置相关
function setCheckValue(data, item, auto) {
  // 向上级传递相关值 select 当前树已选中的个数 parent 是上级value
  // console.log('11111111111',data,ps.modelValue);
  
  emit('onCheckValue', {
    value: data[parm.value.value],
    level: ps.level,
    parent: ps.parent,
    select: list.value.filter(v => v._check == 2).length,
    half: list.value.filter(v => v._check == 1).length,
    item: item || data,
    auto
  })
}

function clickValue(data) {
  currValue.value = data
  if (Number(ps.level)) {
    emit('clickValue', data);
  } else {
    if (!ps.select) {
      emit('update:modelValue', data)
      emit('change', data)
    }
  }
}

// 接收下级传过来的值进行数据处理，第一级不会触发此事件
function onCheckValue(data) {
  //data=> {value: '013003005', level: 2, parent: '013003', select: 5}

  let check = 0;
  if (Number(data.half)) {
    check = 1;
  } else {
    if (Number(data.select)) {
      // 找到下级传来值的当前级的对像
      if (list.value.find(f => f[parm.value.value] == data.parent)[parm.value.child].length == data.select) {
        check = 2
      } else {
        check = 1
      }
    }
  }

  // 设置当前节点选中状态
  let item = list.value.find(v => v[parm.value.value] == data.parent);
  // 如果存only为true 不设置选中状态 为false时才设置
  if (item && !ps.only) {
    item._check = check;
  }

  // 当单选时 父级所有选中取消
  if (ps.single) {
    list.value.forEach(item => {
      item._check = 0;
    })
  }


  // 如果不是顶级 处理完当前级事物 则向上传递相关值
  if (Number(ps.level)) {
    setCheckValue(list.value.find(v => v[parm.value.value] == data.parent), data.item)
  } else {
    // auto 为value值改变initCheck 里触发的
    if (!data.auto) {
      // 当为0时为顶级 无需向上传值
      ps.getCheckNode && ps.getCheckNode(data.item)
      let curr = getTreeValue(JSON.parse(JSON.stringify(list.value)))
      emit('update:modelValue', curr.value)
      emit('change', curr)
      curr = "";
    }
  }
}

//封装当前列表相关值
const trees = computed(() => {
  let currlist = list.value;
  if (ps.filterText && serchList.value.length) {
    currlist = serchList.value;
  }
  // console.log(currlist);

  return currlist.map((v, i) => {
    return {
      index: i,
      label: v[parm.value.label],
      value: v[parm.value.value],
      children: v[parm.value.child] || [],
      level: ps.level,
      check: v._check || 0,
      ...v
    }
  })
})

// checkbox 选中事件
function onCheckNode(index) {
  let item = list.value[index];
  // 当前点击选中与取消选中
  item._check = item._check == 2 ? 0 : 2;
  let currCheck = item._check;
  let currValue = item[parm.value.value];

  if (!ps.only) {
    setChildCheckNode(item[parm.value.child], item._check)
  }

  // 当single时 清空当前list 下级选中状态
  if (ps.single) {
    list.value?.forEach(v => {
      v._check = 0;
      if (v[parm.value.child]?.length) {
        setChildCheckNode(v[parm.value.child], 0)
      }
    })
    item._check = currCheck;
  }

  // 第一级，不需要向上传值 直接取值
  if (!ps.level) {
    // value.value=[];

    // emit('update:modelValue', getTreeValue(list.value).value)
    // ps.getCheckNode && ps.getCheckNode(item)
    // emit('change', getTreeValue(list.value))

  } else {
    setCheckValue(item)
  }
}

//当前点击选中事件或取消事件时，相应下级也要选中，取消事件
function setChildCheckNode(vlist, check) {
  vlist?.forEach(v => {
    v._check = check == 2 ? 2 : 0;
    if (ps.single) {
      v._check = 0;
    }
    if (v[parm.value.child]?.length) {
      setChildCheckNode(v[parm.value.child], check)
    }
  })
}

// 初始化当前list 展开收起/选中
function initTree() {
  list.value = ps.data.map(item => {
    item._check = 0;
    if (item[parm.value.child]?.some(v => value.value?.some(s => String(s) === String(v[parm.value.value])))) {
      item._check = 1;
    }
    if (item[parm.value.child]?.length && item[parm.value.child]?.length == item[parm.value.child]?.filter(v => value.value?.some(s => String(s) === String(v[parm.value.value])))?.length) {
      item._check = 2;
    }
    if (typeof value.value == "string" || typeof value.value == "number") {
      if (String(item[parm.value.value].value) === String(value.value)) {
        item._check = 2;
      }
    } else {
      if (value.value?.some(s => String(s) === String(item[parm.value.value]))) {
        item._check = 2;
      }
    }
    // open 设置
    // if (typeof item.open == "boolean" && !item.open) {
    item.open = false;
    if (typeof ps.expand == "string" || typeof ps.expand == "number") {
      item.open = ps.level < Number(ps.expand)
    } else {
      item.open = !!ps.expand;
    }
    // }
    return item
  })
}

// 初始化选中框
function initCheck() {
  let clist = list.value.length ? [].concat(list.value) : [].concat(ps.data);
  if (ps.check) {
    clist.forEach(item => {
      let oldCheck = item._check || 0;
      item._check = 0;
      // 如果下级有选中的，就给他半选中状态
      if (item[parm.value.child]?.some(v => value.value?.some(s => String(s) === String(v[parm.value.value])))) {
        item._check = 1;
      }
      //如果下级全部选中，就选中状态
      if (item[parm.value.child]?.length && item[parm.value.child]?.length == item[parm.value.child]?.filter(v => value.value?.some(s => String(s) === String(v[parm.value.value])))?.length) {
        item._check = 2;
      }
      if (typeof value.value == "string" || typeof value.value == "number") {
        if (String(item[parm.value.value].value) === String(value.value)) {
          item._check = 2;
        }
      } else {
        if (value.value?.some(s => String(s) === String(item[parm.value.value]))) {
          item._check = 2;
        }
      }

      //通知上级
      setCheckValue(item, null, true)
    })
  }
}

//同步 当前组件 v-if="item.open&&item.children.length" v-if true 执行
onMounted(() => {
  console.log('--onMounted--',ps.data);
  
  initTree(true);
})

const serchList = ref([]);

function serchText(list) {
  if (list && list.length) {
    list.forEach(item => {
      if (item[parm.value.label].includes(ps.filterText)) {
        serchList.value.push(item)
      }
      serchText(item[parm.value.child])
    })
  }
}

//异步 当前组件 v-if="item.open&&item.children.length" v-if true 执行
watch(() => ps.filterText, (news, old) => {
  serchList.value = [];
  if (!ps.level) {
    if (news) {
      serchText(list.value)
    } else {
      serchList.value = [];
    }
  }
})

watch(() => ps.data, (news, old) => {
  console.log('--------------');
  
  value.value=[];
  if (!ps.level) {
    initTree('watch');
  }
})


watch(() => ps.modelValue, (news, old) => {
  console.log('=============')
  value.value=[];
  value.value = news;
  if (String(old) != String(news)) {
    initCheck();
  }
})

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
.tree-select {
}
</style>