<template>
  <section ref="selects" @click="onKey" @mouseover="changeMouse(1)" @mouseleave="changeMouse(0)" :class="mainclass" class="flex __carder rel">
    <!-- 前置图片ICON -->
    <span v-if="iconfix" :class="iconfix" class="iconfont"></span>

    <!-- 多选 -->
    <transition v-if="more">
      <div @click="onkeyItem" class="flex-1 flex fw">
        <div v-for="(item) in info.moreList" class="flex pp4 moreactive mr5 hand mb3 b-e ra-5 ai-c">
          <span :style="{maxWidth:options.mainWidth*0.6+'px'}" :title="item?.label" class="mr2 line-1">{{item[parm.label]}}</span>
          <span @click.stop="removeMoreItem(item)" class="ha-15 wi-15 ra-3 hidden close hi-15 h-15">
            <svg class="icon w-15 h-15" style="fill:#777" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" >
              <path
                d="M567.168 512l189.184 188.352a40.064 40.064 0 0 1 0.768 55.68 37.76 37.76 0 0 1-54.4 0.832L512 566.912l-190.72 189.952a37.76 37.76 0 0 1-54.4-0.768 40.064 40.064 0 0 1 0.768-55.68L456.832 512 267.648 323.648a40.064 40.064 0 0 1-0.768-55.68 37.76 37.76 0 0 1 54.4-0.832L512 457.088l190.72-189.952a37.76 37.76 0 0 1 54.4 0.768 40.064 40.064 0 0 1-0.768 55.68L567.168 512z">
              </path>
            </svg>
          </span>
        </div>
        <div class="flex-1 flex h-28  rel">
          <!-- 撑开宽度用，实际不可见 -->
          <span class="op-0 rel zi-100">{{info.label}}</span>
          <input :class="inputClass" @keyup.stop="moreKey" :value="info.label" @input="changeInput" style="color:inherit" class="abs al0 bc-t h-all zi-120 w-all" :readonly="!(serch || lazy)" :placeholder="!info.moreList.length&&placeholder||''" autocomplete="off" type="text">
        </div>
      </div>
    </transition>

    <!-- 单选 -->
    <transition v-else>
      <input :class="inputClass" :value="info.label" @input="changeInput" style="color:inherit" class="bc-t w-all flex-1 fs-init h-all flex ai-c" :readonly="!(serch || lazy)" :placeholder="placeholder" autocomplete="off" type="text">
    </transition>

    <!-- 后置ICON -->
    <div :class="inputClass" ref="scrolls" class="h-all max-height flex ai-c">
      <!-- 下标图片 -->
      <svg style="transition: all 0.15s;" v-if="!info.isClose" :class="{'arrow':info.visible}" class=" drop w-25 h-25 wi-25 hi-25" viewBox="0 0 1024 1024">
        <path d="M346.453333 396.373333L512 561.92l165.546667-165.546667a42.496 42.496 0 1 1 60.16 60.16l-195.84 195.84a42.496 42.496 0 0 1-60.16 0L285.866667 456.533333a42.496 42.496 0 0 1 0-60.16c16.64-16.213333 43.946667-16.64 60.586666 0z" fill="currentColor"></path>
      </svg>
      <!-- 清空图标 -->
      <svg style="fill:#ccc" v-if="info.isClose" @click.stop="changeClose" class="iconfix hand w-21 h-21 wi-21 hi-21" viewBox="0 0 1024 1024" width="16" height="16">
        <path
          d="M512 102.4a409.6 409.6 0 1 0 409.6 409.6 409.6 409.6 0 0 0-409.6-409.6z m181.248 518.144a51.2 51.2 0 0 1-72.704 72.704L512 584.192l-108.544 109.056a51.2 51.2 0 0 1-72.704-72.704L439.808 512 330.752 403.456a51.2 51.2 0 0 1 72.704-72.704L512 439.808l108.544-109.056a51.2 51.2 0 0 1 72.704 72.704L584.192 512z">
        </path>
      </svg>
    </div>

    <!-- 弹出层 -->
    <transition :name="info.trans">
      <article :style="contentStyle" v-show="info.visible" ref="selectBoy" class="abs zi-8888 nodarg hidden _selects_dropdown fc-333 ra-5">
        <scrollbar :auto="info.scrollTop" @scroll="onScroll" class="max-height">
          <!-- 真实高度 -->
          <div v-if="baseList.length&&!info.isload" class="w-all hi-36" :style="{height:contentHeight.height+'px'}">
            <div ref="contents" :style="{'padding-top': `${info.scrollSelect}px`}" class="flex wi-all rel zi-120 hidden ra-5 bc-fff fd-c">
              <div v-for="(item,index) in vlist" @click.stop="btnSave(item)" :class="currClass(item)" class="hand flex ai-c wi-all hi-34 rel h-34">
                <div :title="item?.label" :class="{'is_dis':item?.disabled,'_select_hover':!item?.disabled}" class="flex h-all w-all pl15 pr15 nowrap ai-c">
                  <slot :item="{...item,index}">
                    <span class="line-1">{{item?.label}}</span>
                  </slot>
                </div>
                <svg class="abst abs ar5 selectHide moreright" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="13" height="13">
                  <path d="M527.36 762.88L230.4 460.8 307.2 399.36l174.08 133.12c71.68-81.92 230.4-250.88 445.44-384l20.48 40.96c-199.68 184.32-363.52 445.44-419.84 573.44m0 0"></path>
                </svg>
              </div>
            </div>
          </div>

          <div v-else>
            <div v-if="info.isload" class="flex hand h-40 ra-5 hidden bc-fff w-all ai-c jc-c">
              <svg class="iconload w-22 h-22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M747 303.2m-32.3 0a32.3 32.3 0 1 0 64.6 0 32.3 32.3 0 1 0-64.6 0Z" fill="#AAAAAA" p-id="12929"></path>
                <path d="M834.4 493.9m-45.4 0a45.4 45.4 0 1 0 90.8 0 45.4 45.4 0 1 0-90.8 0Z" fill="#AAAAAA" p-id="12930"></path>
                <path d="M789.1 720.6m-57 0a57 57 0 1 0 114 0 57 57 0 1 0-114 0Z" fill="#AAAAAA" p-id="12931"></path>
                <path d="M577.5 854m-64.5 0a64.5 64.5 0 1 0 129 0 64.5 64.5 0 1 0-129 0Z" fill="#AAAAAA" p-id="12932"></path>
                <path d="M340.4 812.8m-77.1 0a77.1 77.1 0 1 0 154.2 0 77.1 77.1 0 1 0-154.2 0Z" fill="#AAAAAA" p-id="12933"></path>
                <path d="M184.5 595.6m-87.1 0a87.1 87.1 0 1 0 174.2 0 87.1 87.1 0 1 0-174.2 0Z" fill="#AAAAAA" p-id="12934"></path>
                <path d="M243.6 335.5m-96.8 0a96.8 96.8 0 1 0 193.6 0 96.8 96.8 0 1 0-193.6 0Z" fill="#AAAAAA" p-id="12935"></path>
                <path d="M511.3 206.4m-101.3 0a101.3 101.3 0 1 0 202.6 0 101.3 101.3 0 1 0-202.6 0Z" fill="#AAAAAA" p-id="12936"></path>
              </svg>
              <span class="fs-14 ml3">加载中...</span>
            </div>
            <div @click.stop="info.visible=false" v-else class="flex hand h-40 ra-5 hidden bc-fff w-all ai-c jc-c">无数据</div>
          </div>
        </scrollbar>
      </article>
    </transition>
  </section>
</template>

<script setup lang='ts'>
import { isString, isArray, isObject, setParm } from '@lib/lang';
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import scrollbar from './scroll.vue';

const ps = defineProps({
  class: { type: String, default: "w-all" },
  size: { type: String, default: "small" },
  width: { type: String, default: "auto" },
  // 懒加载 return [] 输入查询 远程搜索
  lazy: { type: Function },
  // 原数组内搜索，serch 为string 时，传 serch="name,id,number" 就会从这三个字段内搜索
  serch: { type: [Boolean, String, Number], default: false },
  // 显示清空选项
  clear: { type: Boolean, default: false },
  // 头部文本
  pretext: { type: String, default: "" },
  // 显示清空选项
  more: { type: [Boolean, Number, String], default: false },
  // 是否宽度auto
  auto: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  iconfix: { type: String, default: "" },
  // 取值 props="name,id" 对应的是 label,value
  props: { type: [String, Object, Array], default: "" },
  // 禁用
  disabled: { type: [Boolean, Number, String], default: false },
  // list [{label:'',value}] -- [1,2]=>[{labe:1,value:1},{label:2,value:2}]
  data: { type: [Array, Object], default: [] },
  // 当一个页面使多次使用时，可根据类型分别给值
  type: { type: [String, Number, Boolean], default: "" },
  // 记录当前索引 vfor 里面的i
  index: { type: Number, default: 0 },
  //禁用列表 禁用哪些值如:[1,2]
  exclude: { type: Array, default: [] }
})

const emit = defineEmits(["change"]);
// modelValue v-model="value"
const mvalue = defineModel({ type: [String, Number, Object], default: "" });
// end v-model:end="value"
const label = defineModel('label', { type: [String, Number, Object], default: "" });

const parm = setParm(ps.props);

// 选择框本身
const selects = ref(null);
// 选择框本身
const selectBoy = ref(null);
// 内容本身
const contents = ref(null);
// 内容本身
const scrolls = ref(null);

const baseList = ref()

const info = reactive({
  islazy: false,
  // 是否打下拉开选
  visible: false,
  // 是否获得焦点，后高亮显示框
  isBlur: false,
  // 是否显示关闭按钮
  isClose: false,
  // 返显示定位显示位置 用scroll组件初始值
  scrollTop: 0,
  // 当前滚动高度，用于计算需似列表
  scrollSelect: 0,
  // 是否需要指定滚动到指定的位置
  isScroll: true,
  // data内搜索，远程搜索，绑定文本
  label: "",
  // data内搜索，远程搜索 后的结果
  serchList: [],
  // 初始化弹框位置从底部向下弹出
  trans: 'selectbottom',
  // 行高
  lineHeight: 34,
  // 多选值
  moreList: [],
  // lazy 搜索等待时动画效果
  isload: false,
  index: 0,
  // 是否搜索中
  isSerch: false
})

const options: any = reactive({
  myHeight: 0,//输入框高度
  myWidth: 0,//选中值高度
  screenHeight: 0,
  screenWidth: 0,
  myTop: 0,
  mainWidth: 0, //select组件最终宽度,
  tipHeight: 0,
  tipWidth: 0
})

function onScroll(v) {
  info.scrollSelect = v.top;
  options.myWidth = contents.value?.getBoundingClientRect().width;
  // 当滚动后就不能在出现回到原来选中值的位置（值为0不跳）
  if (v?.top) {
    info.scrollTop = 0;
  }
}


function moreKey(e) {
  options.myHeight = selects.value?.getBoundingClientRect().height;
  info.visible = true;
}

function removeMoreItem(item) {
  info.moreList = info.moreList.filter(v => String(v[parm.value]) != String(item[parm.value]));
  mvalue.value = info.moreList.map(v => v[parm.value])
  label.value = info.moreList.map(v => v[parm.label]);
  emit('change', { value: info.moreList.map(v => v[parm.value]), item: info.moreList });
  if (!info.moreList.length) {
    info.serchList = [];
  }
  nextTick(() => {
    if (selects.value) {
      options.myHeight = selects.value?.getBoundingClientRect().height;
    }
  })
}

function changeInput(e) {
  let { value } = e.target as HTMLInputElement;
  if (value) {
    if (ps.lazy) {
      info.isload = true;
      info.serchList = [];
      ps.lazy(value).then(res => {
        info.isload = false;
        info.serchList = res;
        info.visible = true;
        info.islazy = true;
      })
    } else {
      info.serchList = ps.data.filter(v => {
        if (typeof v == "object") {
          if (ps.serch && typeof ps.serch == "string") {
            let serch = ps.serch.replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',');
            return serch.some(s => String(v[s]).includes(String(value)))
          } else {
            return String(v[parm.label]).includes(String(value))
          }
        } else {
          return String(v).includes(String(value))
        }
      })
    }
  } else {
    info.serchList = []
  }
}

function changeClose() {
  info.islazy = false;
  info.isClose = false;
  info.visible = false;
  info.moreList = [];
  mvalue.value = "";
  label.value = "";
  info.label = "";
  setTimeout(() => {
    emit('change', { value: ps.more ? [] : '', item: [], clear: true });
  });
}

onMounted(() => {
  nextTick(() => {
    // 可见屏高
    options.screenHeight = document.body.getBoundingClientRect().height;
    // 可见屏宽
    options.screenWidth = document.body.getBoundingClientRect().width;
    // 选择框的高度
    options.myHeight = selects.value?.getBoundingClientRect().height;
    // 选择框的宽度
    options.myWidth = selects.value?.getBoundingClientRect().width;
    options.mainWidth = selects.value?.getBoundingClientRect().width;
    options.myTop = selects.value?.getBoundingClientRect().top;
    options.myLeft = selects.value?.getBoundingClientRect().left;
    options.tipHeight = parseInt(getComputedStyle(scrolls.value)?.maxHeight);
  })
})

function changeMouse(type) {
  if (type) {
    if (ps.clear && String(ps.modelValue)) {
      info.isClose = true;
    }
  } else {
    info.isClose = false;
  }
}

// 主样式
const mainclass = computed(() => {
  let curr = ['ra-4', 'b-d', 'pl10', 'pr3'];
  if (['small', 'big'].includes(ps.size)) {
    curr.push(ps.size == 'small' ? 'hi-32' : 'hi-38')
  } else {
    curr.push(`fs-init ${ps.size}`)
  }

  if (info.visible || info.isBlur) {
    curr.push('select')
  }

  if (ps.disabled) {
    curr.push('allowed')
  }

  if (ps.more) {
    curr.push('pt3')
  }

  curr.push(ps.class);
  return curr.join(' ');
})

const inputClass = computed(() => {
  let curr = [];
  if (['small', 'big'].includes(ps.size)) {
    curr.push(ps.size == 'small' ? 'hi-32' : 'hi-38')
  }
  return curr.join(' ')
})

function onKey(e) {
  if (ps.disabled) return;
  info.visible = !info.visible;
  if (info.visible) {
    options.mainWidth = selects.value?.getBoundingClientRect().width
    options.myHeight = selects.value?.getBoundingClientRect().height
    options.myTop = selects.value?.getBoundingClientRect().top;
    options.myLeft = selects.value?.getBoundingClientRect().left;

    if (ps.serch || ps.lazy) {
      info.isSerch = true;
    }
    nextTick(() => {
      options.tipWidth = selectBoy.value?.getBoundingClientRect().width;
      info.lineHeight = contents.value.children[0].getBoundingClientRect().height || 34;
      let maxhe = ps.data.length * info.lineHeight + 1 || 0;
      maxhe = maxhe > options.tipHeight ? options.tipHeight : maxhe;
      nextTick(() => {
        if (options.myHeight + options.myTop + maxhe > options.screenHeight) {
          info.trans = 'selectbottom';
        } else {
          info.trans = 'selecttop';
        }
      })
    })
  }
  document.addEventListener("click", setSelectPop);
}

function setSelectPop(e) {
  if (!selects.value?.contains(e.target)) {
    info.visible = false;
    info.isBlur = false;
    document.removeEventListener('click', setSelectPop)
  } else {
    info.isBlur = true;
  }
}

const contentHeight = computed(() => {
  let cheight = baseList.value.length * info.lineHeight;
  return {
    height: cheight
  }
})

function currClass(item) {
  if (ps.more) {
    return {
      '_is_select fb more': info.moreList.some(v => String(v[parm.value]) == String(item?.value))
    }
  } else {
    return {
      '_is_select fb': String(mvalue.value) == String(item?.value)
    }
  }
}

const contentStyle = computed(() => {
  // 初始化下拉选择框
  let styles = {
    minWidth: options?.mainWidth + 'px',
    top: options?.myHeight + 2 + 'px',
    left: '0px'
  }

  if (ps.width) {
    styles.width = ps.width;
  }

  let contentHeight = ps.data?.length * info.lineHeight;
  if (contentHeight > options.tipHeight) {
    contentHeight = options.tipHeight;
  }
  // 如果弹框超出屏高
  if ((options?.myTop + options?.myHeight + contentHeight) > options?.screenHeight) {
    styles.top = 0 - contentHeight - 4 + 'px';
  }

  // 如果弹框超出屏宽

  if (options?.myWidth + options?.left > options?.screenWidth) {
    delete styles.left;
    styles.right = 0;
  } else {
    styles.left = 0;
  }

  return styles
})

watch(() => ps.data, (news, old) => {
  if (news != old) {
    info.serchList = [];
  }
})

watchEffect(() => {
  // value当有值时 
  if (info.isSerch) return;
  let index = 0;
  if (!String(mvalue.value)?.length) {
    info.label = "";
  }

  if (mvalue.value && baseList.value?.length) {
    if (ps.more) {
      let value = []
      if (typeof mvalue.value != "object") {
        value = String(mvalue.value).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || [];
      } else {
        value = mvalue.value
      }

      index = baseList.value?.findIndex(v => {
        if (typeof v != "object") {
          return String(v) == String(value[0])
        } else {
          return String(v[parm.value]) == String(value[0])
        }
      })

      info.moreList = baseList.value?.filter(v => value.some(s => String(s) == (typeof v == "object" ? String(v[parm.value]) : String(v)))).map(v => {
        if (typeof v != "object") {
          return { label: v, value: v }
        } else {
          return v
        }
      })
    } else {
      index = baseList.value?.findIndex(v => {
        if (typeof v != "object") {
          if (String(v) == String(mvalue.value)) {
            info.label = v
            return true;
          }
          return false;
        } else {
          if (String(v[parm.value]) == String(mvalue.value)) {

            info.label = v[parm.label];
            return true
          }
          return false
        }
      })
    }
  }
  // info.index = index > 3 ? (index - 3) : index;
  info.index = index;
})

const stopIndex = watchEffect(() => {
  if (info.index > 7) {
    info.scrollTop = info.index * info.lineHeight - (info.index > 3 && info.lineHeight * 3 || 0);
  }
})

watchEffect(() => {
  baseList.value = ps.data;
  if (ps.serch || ps.lazy) {
    if (info.serchList.length) {
      baseList.value = info.serchList;
    } else {
      baseList.value = ps.data
    }
  }
})

// 选中事件
function btnSave(item) {
  if (item.disabled || ps.disabled) return;
  info.isBlur = false;
  info.isSerch = false;
  if (ps.more) {
    let oldValue = mvalue.value;
    if (typeof oldValue != "object") {
      oldValue = String(oldValue).replace(/\s/g, '').replace(/[，|\-、\/]/g, ',').split(',') || []
    }
    if (oldValue.some(v => String(v) == String(item[parm.value]))) {
      oldValue = oldValue.filter(v => String(v) != String(item[parm.value]));
      info.moreList = info.moreList.filter(v => String(v.value) != String(item.value));
    } else {
      oldValue.push(item.value);
      info.moreList.push(item);
    }

    mvalue.value = oldValue;
    label.value = info.moreList.map(m => m[parm.label]);

    nextTick(() => {
      options.myHeight = selects.value?.getBoundingClientRect().height
    })

    setTimeout(() => {
      emit('change', { value: oldValue, item: info.moreList, index: ps.index, type: ps.type })
      info.scrollTop = 0;
    }, 10);

  } else {
    mvalue.value = item.value;
    label.value = item.label;
    info.label = item.label;
    setTimeout(() => {
      emit('change', { value: item.value, item: item, index: ps.index, type: ps.type })
    }, 70);
    document.removeEventListener('click', setSelectPop)
    info.visible = false;
  }
  stopIndex();
}

// 返回虚拟数组
const vlist = computed(() => {
  let start = Math.floor(info.scrollSelect / info.lineHeight);
  let list = []
  let contentHeight = baseList.value.length * info.lineHeight;

  if (contentHeight <= options.tipHeight) {
    list = baseList.value;
  } else {
    let itemCount = Math.ceil(options.tipHeight / info.lineHeight)
    list = baseList.value.slice(start, start + 1 + itemCount);
  }
  // console.log(list);

  return list.map(v => {
    let disabled = v.disabled || false;
    if (ps.exclude?.length) {
      disabled = ps.exclude.some(s => (typeof v == 'object' ? String(v[parm.value]) : String(v)) == String(s));
    }
    if (typeof v !== 'object') {
      return { label: v, value: v, disabled }
    } else {
      return { ...v, label: v[parm.label], value: v[parm.value], disabled }
    }
  })
})

</script>

<style lang='less'>
.max-height {
  max-height: 238px;
}
.h-238 {
  height: 238px;
}
.select-input {
  box-sizing: content-box;
}
input::input-placeholder {
  color: #ccc;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #ccc;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ccc;
}
::-moz-placeholder {
  /* Mozilla Firefox 19  */
  color: #ccc;
}
:-ms-input-placeholder {
  /* Internet Explorer 10  */
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
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.iconload {
  animation: spin 0.75s steps(8) infinite;
}
.__carder {
  ._dropdown {
    border-radius: 4px;
    box-shadow: 0 1px 10px rgba(109, 109, 109, 0.2);
  }
  &.select {
    border: #409eff 1px solid !important;
  }
  .arrow {
    transform: rotate(-180deg);
  }

  .moreactive {
    &:hover {
      .close {
        background-color: #f5f7fa;
      }
      svg {
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
  .selectHide {
    display: none;
  }
  .more {
    .moreright {
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