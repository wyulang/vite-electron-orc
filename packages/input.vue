<template>
  <div :class="boxClass" @click="onKey" ref="inputs" class="_input flex jc-b ai-c rel" @mouseover="info.isHover=true" @mouseleave="info.isHover=false">
    <!-- 前缀 -->
    <span v-if="prefix" :class="prefix" class="iconfont ml3"></span>
    <!-- textarea -->
    <textarea v-if="type=='textarea'" :maxlength="maxlength" :disabled="disabled" :readonly="readonly" @focus="onFocus" :placeholder="placeholder" @input="onInput" @blur="onBlur" v-model="mvalue" :class="inputClass" style="color:inherit;border:0;"
      class="bc-t abs at0 al0 ab0 ar0 arae-resize ra-4 pt10 pb10 fs-inherit ipt zi-110"></textarea>
    <!-- 输入框 -->
    <input v-else :class="inputClass" :autocomplete="autocomplete" :maxlength="maxlength" :disabled="disabled" :readonly="readonly" @focus="onFocus" :placeholder="placeholder" @input="onInput" @blur="onBlur" v-model="mvalue" style="color:inherit;border:0;" class="w-all bc-t fs-inherit h-all flex-1" type="text">
    <!-- 关闭 -->
    <svg style="fill:#ccc" v-if="info.isHover&&mvalue&&clear" :class="{'abs abst zi-120 ar2':type=='textarea'}" @click.stop="onClear" class=" iconfix hand mr3 w-17 h-17  " viewBox="0 0 1024 1024">
      <path
        d="M512 102.4a409.6 409.6 0 1 0 409.6 409.6 409.6 409.6 0 0 0-409.6-409.6z m181.248 518.144a51.2 51.2 0 0 1-72.704 72.704L512 584.192l-108.544 109.056a51.2 51.2 0 0 1-72.704-72.704L439.808 512 330.752 403.456a51.2 51.2 0 0 1 72.704-72.704L512 439.808l108.544-109.056a51.2 51.2 0 0 1 72.704 72.704L584.192 512z">
      </path>
    </svg>
    <!-- 后缀 -->
    <span class="iconfont fc-ccc zi-110 fs-13" v-if="rightFix" :class="rightFix.icon">{{rightFix.text}}</span>
    <!-- 搜索健 -->
    <svg style="fill:#ccc" v-if="type=='serch'" @click="onSerch" class="w-16 iconfix hand h-16 zi-120 " viewBox="0 0 1024 1024">
      <path
        d="M726.624149 462.055494c0-157.152203-123.57241-284.307208-276.247648-284.307208S174.128853 304.903292 174.128853 462.055494c0 156.705018 123.57241 283.859 276.247648 283.859S726.624149 618.760512 726.624149 462.055494zM864.523869 943.810656 696.178743 770.987542l-1.343601-1.790786c-66.711378 55.965639-151.779845 89.545432-244.459664 89.545432-213.56605 0-386.389164-177.748287-386.389164-396.686694 0-219.386616 172.823114-397.133879 386.389164-397.133879 213.117842 0 386.389164 177.748287 386.389164 397.133879 0 82.829474-25.073048 159.838382-67.159586 223.416396l5.372358 4.476965 168.345126 172.823114c21.490453 22.385846 21.490453 58.651818 0 81.038688C921.385924 965.749318 886.46253 965.749318 864.523869 943.810656z">
      </path>
    </svg>

    <svg class="iconLoad abs ar30" v-if="info.isLoad" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path d="M747 303.2m-32.3 0a32.3 32.3 0 1 0 64.6 0 32.3 32.3 0 1 0-64.6 0Z" fill="#AAAAAA" p-id="12929"></path>
      <path d="M834.4 493.9m-45.4 0a45.4 45.4 0 1 0 90.8 0 45.4 45.4 0 1 0-90.8 0Z" fill="#AAAAAA" p-id="12930"></path>
      <path d="M789.1 720.6m-57 0a57 57 0 1 0 114 0 57 57 0 1 0-114 0Z" fill="#AAAAAA" p-id="12931"></path>
      <path d="M577.5 854m-64.5 0a64.5 64.5 0 1 0 129 0 64.5 64.5 0 1 0-129 0Z" fill="#AAAAAA" p-id="12932"></path>
      <path d="M340.4 812.8m-77.1 0a77.1 77.1 0 1 0 154.2 0 77.1 77.1 0 1 0-154.2 0Z" fill="#AAAAAA" p-id="12933"></path>
      <path d="M184.5 595.6m-87.1 0a87.1 87.1 0 1 0 174.2 0 87.1 87.1 0 1 0-174.2 0Z" fill="#AAAAAA" p-id="12934"></path>
      <path d="M243.6 335.5m-96.8 0a96.8 96.8 0 1 0 193.6 0 96.8 96.8 0 1 0-193.6 0Z" fill="#AAAAAA" p-id="12935"></path>
      <path d="M511.3 206.4m-101.3 0a101.3 101.3 0 1 0 202.6 0 101.3 101.3 0 1 0-202.6 0Z" fill="#AAAAAA" p-id="12936"></path>
    </svg>

    <transition :name="info.trans">
      <section :style="contentStyle" v-show="info.visible" class="abs zi-8888 _selects_dropdown fc-333 ra-5">
        <scrollbar :maxHeight="options.maxHeight">
          <div ref="contents" class="flex wi-all rel zi-120 ra-5 bc-fff fd-c">
            <div v-for="(item,index) in vlist" @click.stop="onSelect(item)" :class="currClass(item)" class="hand flex ai-c wi-all hi-34 rel h-34">
              <div :class="{'is_dis':item.disabled,'_select_hover':!item.disabled}" class="flex h-all w-all pl15 pr15 nowrap ai-c">
                <slot :item="{...item,index}">
                  <span class="line-1">{{item.label}}</span>
                </slot>
              </div>
              <svg class="abst abs ar5 hide moreright" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="13" height="13">
                <path d="M527.36 762.88L230.4 460.8 307.2 399.36l174.08 133.12c71.68-81.92 230.4-250.88 445.44-384l20.48 40.96c-199.68 184.32-363.52 445.44-419.84 573.44m0 0"></path>
              </svg>
            </div>
          </div>
        </scrollbar>
      </section>
    </transition>
  </div>
</template>

<script setup lang='ts'>
import { isString, isArray, isObject, setParm } from '@lib/lang';
import { computed, nextTick, onMounted, onUpdated, reactive, ref, watchEffect } from "vue";
import scrollbar from './scroll.vue';

// 选择框本身
const inputs = ref(null);
// 内容本身
const contents = ref(null);

const ps = defineProps({
  type: { type: String, default: "text" },
  size: { type: String, default: "small" },
  placeholder: { type: String, default: "" },
  //内容对齐方式 left, center, right
  align: { type: String, default: "left" },
  // 头部图标
  prefix: { type: String, default: "" },
  // 尾部图标
  suffix: { type: String, default: "" },
  // 尾部文本
  suftext: { type: String, default: "" },
  // input Class
  className: { type: String, default: "" },
  // 外部样式
  class: { type: String, default: "w-all" },
  autocomplete: { type: String, default: "off" },
  maxlength: { type: [String, Number], default: "" },
  readonly: { type: [Boolean], default: false },
  disabled: { type: [Boolean], default: false },
  // 是否显示 2/20 已输入个数
  isLen: { type: [Boolean], default: false },
  // 显示清空按钮
  clear: { type: Boolean, default: false },
  // list [{label:'',value}] -- [1,2]=>[{labe:1,value:1},{label:2,value:2}]
  data: { type: [Array, Object], default: [] },
  lazy: { type: Function },
})

const parm = setParm(ps.props);
const emit = defineEmits(["change", 'input', 'blur']);
const mvalue = defineModel({ type: [String, Number, Object], default: "" });

const info = reactive({
  isHover: false,
  visible: false,
  sufitextWidth: 0,
  isLoad: false,
  serchList: []
})

const boxClass = computed(() => {
  let curr = ['ra-4', 'b-d', 'pr6'];
  if (['small', 'big'].includes(ps.size)) {
    curr.push(ps.size == 'small' ? 'hi-32' : 'hi-38')
  } else {
    curr.push(`fs-init ${ps.size}`)
  }

  if (info.visible || info.isHover) {
    curr.push('select')
  }

  if (ps.disabled) {
    curr.push('allowed')
  }

  curr.push(ps.class);
  return curr.join(' ');
})

const inputClass = computed(() => {
  let curr = ["h-all ra-4 pr10"];
  if (ps.prefix) {
    curr.push('pl3')
  } else {
    curr.push('pl10')
  }
  if (ps.type == 'textarea' && ps.prefix) {
    curr.push('al20')
  }
  return curr.join(' ')
})

function onFocus(e) {
  info.isHover = true;
  if (ps.type == 'serch') {
    nextTick(() => {
      document.onkeydown = e => {
        var ev: any = document.all ? window.event : e;
        if (ev.keyCode == 13 && mvalue.value) {
          emit('change', mvalue.value)
        }
      };
    });
  }
}

function onSerch() {
  emit('change', mvalue.value)
}

function onInput(v) {
  let { value } = v.target as HTMLInputElement;
  if (ps.lazy) {
    info.isLoad = true;
    info.serchList = [];
    ps.lazy(value).then(res => {
      info.isLoad = false;
      info.serchList = res;
      info.visible = true;
      info.islazy = true;
    })
  }
  emit('input', mvalue.value)
}

function onBlur(v) {
  let { value } = v.target as HTMLInputElement
  emit('blur', value)
}

function onClear() {
  mvalue.value = ""
  emit('change', "")
}

const rightFix = computed(() => {
  if (ps.type == "serch") {
    return false;
  }
  if (ps.suffix) {
    return { icon: ps.suffix }
  } else {
    if (ps.suftext) {
      return { text: ps.suftext }
    }
    if (ps.isLen) {
      if (ps.type == 'textarea') {
        return { text: `${String(mvalue.value || "").length || 0}/${ps.maxlength || 0}`, icon: ' abs ab10 ar10' }
      }
      return { text: `${String(mvalue.value || "").length || 0}/${ps.maxlength || 0}`, icon: 'mr3' }
    }
  }
  return false
})

const options: any = reactive({
  myHeight: 0,//输入框高度
  myWidth: 0,//选中值高度
  screenHeight: 0,
  screenWidth: 0,
  myTop: 0,
  mainWidth: 0, //select组件最终宽度,
  maxHeight: 238
})

const vlist = ref([]);

watchEffect(() => {
  let list = (info.serchList.length && info.serchList) || (ps.data.length && ps.data);
  if (list.length) {
    vlist.value = list.map(v => {
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
    list = [];
  }
})

function currClass(item) {
  if (ps.more) {
    return {
      '_is_select fb more': info.moreList.some(v => String(v[parm.value]) == String(item.value))
    }
  } else {
    return {
      '_is_select fb': String(mvalue.value) == String(item.value)
    }
  }
}

function onSelect(item) {
  if (item.disabled || ps.disabled) return;
  info.isBlur = false;

  mvalue.value = item.value;
  emit('change', mvalue.value)
  document.removeEventListener('click', setSelectPop)
  info.visible = false;
}

function onKey(e) {
  if (ps.disabled) return;
  if (!ps.data.length && !ps.lazy) {
    return
  }

  info.visible = !info.visible;

  if (info.visible) {
    options.mainWidth = inputs.value?.getBoundingClientRect().width
    options.myHeight = inputs.value?.getBoundingClientRect().height
    options.myTop = inputs.value?.getBoundingClientRect().top;
    options.myLeft = inputs.value?.getBoundingClientRect().left;
    let maxhe = ps.data.length * info.lineHeight + 1 || 0;
    maxhe = maxhe > 238 ? 238 : maxhe;
    if (options.myHeight + options.myTop + maxhe > options.screenHeight) {
      info.trans = 'selectbottom';
    } else {
      info.trans = 'selecttop';
    }
  }
  document.addEventListener("click", setSelectPop);
}

onMounted(() => {
  nextTick(() => {
    // 可见屏高
    options.screenHeight = document.body.getBoundingClientRect().height;
    // 可见屏宽
    options.screenWidth = document.body.getBoundingClientRect().width;
    // 选择框的高度
    options.myHeight = inputs.value?.getBoundingClientRect().height;
    // 选择框的宽度
    options.myWidth = inputs.value?.getBoundingClientRect().width;
    options.mainWidth = inputs.value?.getBoundingClientRect().width;
    options.myTop = inputs.value?.getBoundingClientRect().top;
    options.myLeft = inputs.value?.getBoundingClientRect().left;
  })
})

function setSelectPop(e) {
  if (!inputs.value?.contains(e.target)) {
    info.visible = false;
    info.isBlur = false;
    document.removeEventListener('click', setSelectPop)
  } else {
    info.isBlur = true;
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
  if (contentHeight > options.maxHeight) {
    contentHeight = options.maxHeight;
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

</script>

<style lang='less'>
._input {
  .iconfix {
    &:hover {
      fill: #409eff !important;
    }
  }

  &.select {
    border: #409eff 1px solid !important;
  }
  input {
    &::placeholder {
      color: #c0c4cc;
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
  .iconLoad {
    animation: spin 0.75s steps(8) infinite;
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
  // ...
}
</style>