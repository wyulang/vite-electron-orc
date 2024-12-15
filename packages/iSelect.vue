<template>
  <section ref="selects" @click="onShowDatePop" :class="class" class=" __carder rel">
    <!-- 页面显示内容 -->
    <div :class="{'fc-bbb':!currValue[parm.value]}" class="h-all flex ai-c">{{currValue[parm.label]||placeholder}}</div>
    <span :class="rightClass" class="arrow-right "></span>
    <!-- 弹出层 -->
    <section v-if="visible" class="hv-all fixed at0 ab0 zi-8888 _date al0 ar0 flex fd-c">
      <div v-if="visible" class="fixed ab0 h-200 bc-fff w-all zi-2000"></div>
      <div @click.stop="onClose(1)" class="flex-1 rel ba-3"></div>
      <div v-if="serch" class="h-50 bc-fff flex ai-c w-all rel bb-e">
        <input class="h-all flex flex-1 fs-15 pp10" :value="serchText" @input="changeInput" placeholder="搜索" type="text">
      </div>
      <div ref="dateBody" style="min-height:200px" class="rel hidden sha-card fc-999 zi-8888 fs-14 ">
        <scrollbar :auto="currValueTop" @scroll="onScroll" maxHeight="272">
          <!-- 真实高度 -->
          <div v-if="baseList?.length" class="w-all" :style="{height:contentHeight.height+'px'}">
            <div ref="contents" :style="{'padding-top': `${scrollTop}px`}" class="flex wi-all rel zi-120  bc-fff fd-c">
              <div v-for="(item,index) in vlist" @click.stop="onSelect(item)" :class="currClass(item)" class="hand flex ai-c wi-all hi-34 rel h-34">
                <div :title="item.label" :class="{'is_dis':item.disabled,'_select_hover':!item.disabled}" class="flex h-all w-all pl15 pr15 nowrap ai-c">
                  <slot :item="{...item,index}">
                    <span class="line-1">{{item.label}}</span>
                  </slot>
                </div>
                <svg class="abst abs ar5 hide moreright" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="13" height="13">
                  <path d="M527.36 762.88L230.4 460.8 307.2 399.36l174.08 133.12c71.68-81.92 230.4-250.88 445.44-384l20.48 40.96c-199.68 184.32-363.52 445.44-419.84 573.44m0 0"></path>
                </svg>
              </div>
            </div>
          </div>
          <div @click="visible=false" v-else class="flex hand h-40 ra-5 hidden bc-fff w-all ai-c jc-c">无数据</div>
        </scrollbar>
      </div>
    </section>

  </section>
</template>

<script setup lang='ts'>
import { isString, isArray, isObject, setParm } from '@lib/lang';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import scrollbar from './scroll.vue';

const ps = defineProps({
  class: { type: String, default: "w-all" },
  rightClass: { type: String, default: "w-10 h-10" },
  size: { type: String, default: "small" },
  width: { type: String, default: "auto" },
  // 懒加载 return [] 输入查询 远程搜索
  lazy: { type: Function },
  // 原数组内搜索，serch 为string 时，传 serch="name,id,number" 就会从这三个字段内搜索
  serch: { type: [Boolean, String, Number], default: false },
  // 显示清空选项
  clear: { type: Boolean, default: false },
  // 显示清空选项
  more: { type: [Boolean, Number, String], default: false },
  // 是否宽度auto
  auto: { type: Boolean, default: false },
  modelValue: { type: [String, Number, Boolean, Array], default: "" },
  // 取到的label值
  label: { type: [Array, String, Number, Boolean], default: "" },
  placeholder: { type: String, default: "" },
  iconfix: { type: String, default: "" },
  // 取值 props="name,id" 对应的是 label,value
  props: { type: [String, Object, Array], default: "" },
  // 禁用
  disabled: { type: [Boolean, Number, String], default: false },
  // list [{label:'',value}] -- [1,2]=>[{labe:1,value:1},{label:2,value:2}]
  data: { type: [Array, Object], default: [] },
  // 当一个页面使多次使用时，可根据类型分别给值
  type: { type: [String, Number, Boolean], default: "1" },
  // 记录当前索引 vfor 里面的i
  index: { type: Number, default: 0 },
  //禁用列表 禁用哪些值如:[1,2]
  exclude: { type: Array, default: [] }
})


const visible = ref(false)
const isClose = ref(false);
const selects = ref(null);
const contents = ref(null);
const isBlur = ref(false);
const serchText = ref("")
// 动画效果，向上收回，与向下收回的动作效果
const trans = ref("selecttop");
// 返显示定位显示位置
const currValueTop = ref(0);
const lineHeight = ref(34);
const scrollTop = ref(0);
const isFirst = ref(true);
const list: any = ref([]);
// 多选，已选中的列
const moreSelectItem = ref([]);

const isLazy = ref(false);

const emit = defineEmits(["update:modelValue", "change", "update:label"]);

function changeValue(item) {
  emit('change', { value: item.value, item: item.item, index: ps.index, type: ps.type })
}

watch(() => visible.value, (news, old) => {
  if (!news) {
    document.body.classList.remove('bodyover')
  }
})

function changeInput(e) {
  let { value } = e.target as HTMLInputElement;
  serchText.value=value;
  if (value) {
    isFirst.value = false;
  }
  let vlist = []
  if (value) {
    vlist = ps.data.filter(v => {
      if (typeof v == "object") {
        if (ps.serch && typeof ps.serch == "string") {
          let serch = ps.serch.replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',');
          return serch.some(s => String(v[s]).includes(String(value)))
        } else {
          return String(v[parm.value.label]).includes(String(value))
        }
      } else {
        return String(v).includes(String(value))
      }
    })
  } else {
    vlist = ps.data;
  }
  list.value = vlist.length ? vlist : ps.data;
  vlist = null;
}

watch(() => ps.modelValue, (news, old) => {
  if (!ps.more && !serchText.value && isFirst.value) {
    nextTick(() => {
      let item = baseList.value.find(v => {
        if (typeof v != "object") {
          return String(v) === String(ps.modelValue)
        } else {
          return String(v[parm.value.value]) === String(ps.modelValue)
        }
      })
      serchText.value = item && item[parm.value.label] || item;
    })
  }
})


function setLabel(value) {
  emit("update:label", value)
}

function moreKey(e) {
  options.value.myHeight = selects.value?.getBoundingClientRect().height;
  visible.value = true;
}

const inputfont = computed(() => {
  return {
    'fs-14': ['small', 'big'].includes(ps.size),
    'fs-init': !['small', 'big'].includes(ps.size)
  }
})

function currClass(item) {
  if (ps.more) {
    return {
      '_is_select fb more': currSelect.value.some(v => String(v[parm.value.value]) == String(item.value))
    }
  } else {
    return {
      '_is_select fb': String(currSelect.value[parm.value.value]) == String(item.value)
    }
  }
}


function removeCurr(item) {
  ps.moreSelectItem = ps.moreSelectItem.filter(v => String(v.value) != String(item.value));
  emit('update:modelValue', ps.moreSelectItem.map(v => v.value));
  setLabel(ps.moreSelectItem.map(v => v.label));
  changeValue({ value: ps.moreSelectItem.map(v => v.value), item: ps.moreSelectItem });
  nextTick(() => {
    if (selects.value) {
      options.value.myHeight = selects.value?.getBoundingClientRect().height;
    }
  })
}

const currSelect = computed(() => {
  let value = String(ps.modelValue) || "";
  if (ps.more) {
    return ps.moreSelectItem
  } else {
    let item = baseList.value.find(v => {
      if (typeof v != "object") {
        return String(v) === value
      } else {
        return String(v[parm.value.value]) === value
      }
    })
    if (item) {
      if (typeof item != "object") {
        return { label: item, value: item }
      } else {
        return { value: item[parm.value.value], label: item[parm.value.label], ...item }
      }
    } else {
      return { label: "", value: "" }
    }
  }
})



function changeLazy(e) {
  let { value } = e.target as HTMLInputElement;
  ps.lazy(value).then(res => {
    list.value = res;
    visible.value = true;
    isLazy.value = true;
  })
}

function changeClose() {
  isLazy.value = false;
  isClose.value = false;
  ps.moreSelectItem = [];
  emit('update:modelValue', "");
  setTimeout(() => {
    setLabel(ps.more ? [] : '');
    changeValue({ value: ps.more ? [] : '', item: [], clear: true });
  });
}

// 选中事件
function onSelect(item) {
  if (item.disabled || ps.disabled) return;
  isFirst.value = false;
  let value = ps.modelValue || "";
  isBlur.value = false;
  if (ps.more) {
    if (typeof value != "object") {
      value = String(value).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || []
    }
    if (value.some(v => String(v) == String(item[parm.value.value]))) {
      value = value.filter(v => String(v) != String(item[parm.value.value]));
      ps.moreSelectItem = ps.moreSelectItem.filter(v => String(v.value) != String(item.value));
    } else {
      value.push(item.value);
      ps.moreSelectItem.push(item);
    }

    // 选中的列
    let list = baseList.value.filter(v => value.some(s => String(s) == String(v.value)));

    emit('update:modelValue', value);
    setLabel(list.map(m => m[parm.value.label]))

    nextTick(() => {
      options.value.myHeight = selects.value?.getBoundingClientRect().height
    })

    setTimeout(() => {
      changeValue({ value, item: list });
      currValueTop.value = 0;
    }, 10);

  } else {
    visible.value = false;
    // if (ps.lazy || ps.serch) {
    //   serchText.value = item.label;
    // }
    emit('update:modelValue', item.value);
    setLabel(item.label)
    setTimeout(() => {
      changeValue({ item, value: item.value });
      options.value.valueHeight = 0;
    }, 70);
    document.removeEventListener('click', setSelectPop)
  }
}

// 返回虚拟数组
const vlist = computed(() => {
  let itemHeight = lineHeight.value
  let start = Math.floor(scrollTop.value / itemHeight);
  let list = []
  let contentHeight = baseList.value.length * lineHeight.value;
  if (contentHeight <= 272) {
    list = baseList.value;
  } else {
    let itemCount = Math.ceil(272 / itemHeight)
    list = baseList.value.slice(start, start + itemCount);
  }
  return list.map(v => {
    let disabled = v.disabled || false;
    if (ps.exclude?.length) {
      disabled = ps.exclude.some(s => (typeof v == 'object' ? String(v[parm.value.value]) : String(v)) == String(s));
    }
    if (typeof v !== 'object') {
      return { label: v, value: v, disabled }
    } else {
      return { ...v, label: v[parm.value.label], value: v[parm.value.value], disabled }
    }
  })
})



const baseList = computed(() => {

  // let list: any = [];
  let soure = ((ps.lazy || ps.serch) ? list.value : ps.data)

  if (!isArray(ps.data)) {
    soure = [];
  }

  if (isFirst.value && (ps.lazy || ps.serch) && ps.data.length) {
    soure = ps.data;
    list.value = ps.data;
  }
  console.log(soure)
  let value = ps.modelValue || "";
  if (value.toString().length && soure.length && isFirst.value) {
    isFirst.value = false;
    let index = soure.findIndex(v => {
      if (typeof v != "object") {
        return String(v) == String(value)
      } else {
        return String(v[parm.value.value]) == String(value)
      }
    });
    if (ps.more) {
      if (typeof value != "object") {
        value = String(value).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || [];
      }
      index = soure.findIndex(v => {
        if (typeof v != "object") {
          return String(v) == String(value[0])
        } else {
          return String(v[parm.value.value]) == String(value[0])
        }
      })
      ps.moreSelectItem = soure.filter(v => value.some(s => String(s) == (typeof v == "object" ? String(v[parm.value.value]) : String(v)))).map(v => {
        if (typeof v != "object") {
          return { label: v, value: v }
        } else {
          return v
        }
      })
    }
    index = index ? (index - 3) : 0;
    index = index > 0 ? index : 0;
    if (index > 7) {
      currValueTop.value = index * lineHeight.value;
      scrollTop.value = index * lineHeight.value;
    }
  }
  return soure
})

const contentHeight = computed(() => {
  let cheight = baseList.value.length * lineHeight.value;
  return {
    height: cheight
  }
})

function onScroll(v) {
  scrollTop.value = v.top;
  options.value.myWidth = contents.value?.getBoundingClientRect().width;
  // 当滚动后就不能在出现回到原来选中值的位置（值为0不跳）
  if (v?.top) {
    currValueTop.value = 0;
    isFirst.value = false;
  }
}

const currValue = computed(() => {
  let item = ps.data.find((v, i) => { return String(v[parm.value.value]) === String(ps.modelValue) });
  if (item) {
    return item
  } else {
    return { label: "", value: "" }
  }
})



const parm = computed(() => {
  return setParm(ps.props)
})

const options: any = ref({
  myHeight: 0,//输入框高度
  myWidth: 0,//选中值高度
  screenHeight: 0,
  screenWidth: 0,
  myTop: 0,
  mainWidth: 0 //select组件最终宽度
})

onMounted(() => {
  if (ps.modelValue && ps.serch && !serchText.value && isFirst.value) {
    let item = ps.data.find(v => {
      if (typeof v != "object") {
        return String(v) === String(ps.modelValue)
      } else {
        return String(v.value) === String(ps.modelValue)
      }
    })
    serchText.value = item?.label || item;
  }
})

// 当存在serch选项时，更多选择点空白处获取焦点
function onkeyItem() {
  document.getElementById('serchmore')?.focus()
  // visible.value=true;
}

function onClose() {
  visible.value = false;
}

function onShowDatePop(e) {
  if (ps.disabled) return;
  visible.value = true;
  if (visible.value) {
    let index = ps.data.findIndex(v => {
      if (typeof v != "object") {
        return String(v) == String(ps.modelValue)
      } else {
        return String(v[parm.value.value]) == String(ps.modelValue)
      }
    });
    index = index ? (index - 3) : 0;
    index = index > 0 ? index : 0;
    document.body.classList.add('bodyover')

    if (index > 7) {
      nextTick(() => {
        // debugger;
        lineHeight.value = contents.value?.firstElementChild.getBoundingClientRect().height;
        console.log(lineHeight.value);
        currValueTop.value = index * lineHeight.value;
        scrollTop.value = index * lineHeight.value;
      })

    }
  }
}

function setSelectPop(e) {
  if (!selects.value?.contains(e.target)) {
    visible.value = false;
    isBlur.value = false;
    document.removeEventListener('click', setSelectPop)
    document.body.classList.remove('bodyover')
  } else {
    isBlur.value = true;
  }
}

</script>

<style lang='less'>
.bodyover{
  height: 100vh;
  overflow: hidden;
}
input::input-placeholder{color:  #ccc;} 
::-webkit-input-placeholder { /* WebKit browsers */ 
color: #ccc; 
} 
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
color: #ccc; 
} 
::-moz-placeholder { /* Mozilla Firefox 19  */ 
color: #ccc; 
} 
:-ms-input-placeholder { /* Internet Explorer 10  */ 
color: #ccc; 
}
.loading {
  animation: myfirst2 1.5s infinite linear;
}
@keyframes myfirst2 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
.__carder{
  ._dropdown {
    border-radius: 4px;
    box-shadow: 0 1px 10px rgba(109, 109, 109, 0.2);
  }
  &.select{
    border: #409eff 1px solid !important;
  }
  .arrow {
    transform: rotate(-180deg) ;
  }

  .moreactive{
    &:hover{
      .close{
        background-color: #f5f7fa;
      }
      svg{
        fill: #409eff !important;
      }
    }
  }
 
  .iconfix {
    &:hover {
      fill: #409eff !important;
    }
  }
  ._select_hover {
    &:hover {
      background-color: #f5f7fa;
      color: #409eff;
    }
  }
  .is_dis {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  ._is_select {
    color: #409eff;
  }
  .more{
    .moreright{
      display: block !important;
      fill: #409eff;
    }
  }
  ._selects_dropdown {
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 10px rgba(109, 109, 109, 0.2);
  }

  .selecttop-enter-active,
  .selecttop-leave-active {
    transition: all 0.4s;
    opacity: 1;
    transform: scaleY(1);
  }
  .selecttop-enter,
  .selecttop-leave-to {
    opacity: 0;
    transform: scaleY(0.5);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center top;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  .selectbottom-enter-active,
  .selectbottom-leave-active {
    transition: all 0.4s;
    opacity: 1;
    transform: scaleY(1);
  }
  .selectbottom-enter,
  .selectbottom-leave-to {
    opacity: 0;
    transform: scaleY(0.5);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center bottom;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
}
</style>