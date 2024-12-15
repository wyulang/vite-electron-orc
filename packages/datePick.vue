<template>
  <div ref="dateMain" :class="dateClass" class="flex ai-c _date rel w-all">
    <div id="dateInput" @click="onShowDatePop" :class="getInputClass" @mouseover="mainOver" @mouseout="mainOut" class="w-all flex pl10 pr10 ai-c h-all ra-4">
      <input :placeholder="placeholder" readonly @focus="onFocus" :class="inputfont" :value="currStartDate" @blur="onBlur" class="outline flex-1 bc-t ra-4 w-all fs-init h-all bl-0" type="text">
      <div class="w-17 hand h-17">
        <svg style="fill:#ccc" v-if="isClear" @click.stop="onClear" class="abs w-22 h-22 ar5 hand iconfix close abst" viewBox="0 0 1024 1024">
          <path
            d="M512 102.4a409.6 409.6 0 1 0 409.6 409.6 409.6 409.6 0 0 0-409.6-409.6z m181.248 518.144a51.2 51.2 0 0 1-72.704 72.704L512 584.192l-108.544 109.056a51.2 51.2 0 0 1-72.704-72.704L439.808 512 330.752 403.456a51.2 51.2 0 0 1 72.704-72.704L512 439.808l108.544-109.056a51.2 51.2 0 0 1 72.704 72.704L584.192 512z">
          </path>
        </svg>
        <svg class="h-all w-all" v-else viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M175.36 960C125.696 960 64 894.016 64 840.64V320h896v513.024c1.152 54.592-65.152 126.976-116.16 126.976H175.424zM768 0v128h-128l-0.256-128H384v128H256V0H169.92C75.904 0 0 90.496 0 202.24v619.52C0 933.568 75.904 1024 169.92 1024h684.096C948.096 1024 1024 933.632 1024 821.76V202.24C1024 91.904 948.032 0 854.016 0H768zM192 832h128v-128H192v128z m0-256h128V448H192v128z m256 0h128V448H448v128z m256 0h128V448h-128v128z m0 256h128v-128h-128v128z m-256 0h128v-128H448v128z"
            p-id="26005" fill="#dbdbdb"></path>
        </svg>
      </div>
    </div>
    <div v-if="visible" ref="layDate" :style="bodyDate" class="abs bc-fff zi-8888 flex-line fd-c sha-6">
      <div class="w-300 rel h-200">
        <!-- 分页 -->
        <div class="w-all abs at15 zi-100 flex ai-c jc-b">
          <!-- 左分页 -->
          <div class="flex ai-c">
            <div @click="changeYear('prev')" class="pl15 pr10 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path
                  d="M239.9 512l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L101.5 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L239.9 512z m404.7 0l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L506.1 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L644.6 512z"
                  fill="#999"></path>
              </svg>
            </div>
          </div>
          <!-- 右分页 -->
          <div class="flex ai-e">
            <div @click="changeYear('next')" class="pr15 pl10 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path
                  d="M784.1 512L485.2 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L784.1 512z m-404.7 0L80.5 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L379.4 512z"
                  fill="#999"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="flex fs-18 mt13 ai-c jc-c">
          <span @click="config.isYear=true" class="hovertag rel zi-120 hand">{{config.type=='month'?config.nextYear:config.year}}年</span> <span v-if="type=='month'" class="pl10 pr10"></span> <span v-if="type=='month'">{{config.nextMonth}}月</span>
        </div>

        <div v-if="!config.isYear">
          <div v-if="type=='month'" class="flex ai-c pt15 fw">
            <span @click.stop="onMonth(index)" :class="{'fc-primary fb fs-15':config.month==(index+1)}" class="wb-33 hand fs-14 flex ai-c jc-c h-33" v-for="(item,index) in monthList">{{item}}</span>
          </div>
          <div v-if="type=='year'" class="flex ai-c pt15 fw">
            <span @click.stop="btnYear(item)" :class="{'fc-primary fb fs-15':config.year==item}" class="wb-25 hand fs-14 flex ai-c jc-c h-33" v-for="(item,index) in yearList">{{item}}</span>
          </div>
        </div>

        <!-- 年份选择 -->
        <section v-else class="abs hand zi-140 at0 ab0 ar0 al0 pp10 flex fd-c ai-c rel jc-c ba-f9">
          <svg @click.stop="config.isYear=false" class="abs at10 w-19 h-19 at0 ar10" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="#409EFF"
              d="M786.7392 333.42464 608.17408 512 786.7392 690.57536c26.56256 26.56256 26.56256 69.61152 0 96.17408-13.27104 13.27104-30.6688 19.9168-48.06656 19.9168-17.408 0-34.80576-6.63552-48.0768-19.9168L512 608.16384l-178.5856 178.5856c-13.27104 13.27104-30.6688 19.9168-48.0768 19.9168-17.39776 0-34.78528-6.63552-48.06656-19.9168-26.56256-26.55232-26.56256-69.60128 0-96.17408L415.82592 512 237.2608 333.42464c-26.56256-26.56256-26.56256-69.61152 0-96.17408 26.55232-26.54208 69.5808-26.54208 96.14336 0L512 415.83616l178.5856-178.5856c26.56256-26.54208 69.59104-26.54208 96.14336 0C813.30176 263.81312 813.30176 306.86208 786.7392 333.42464z">
            </path>
          </svg>
          <div @click.stop="setYear('prev')" class="w-all pb5 hand flex ai-c jc-c">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path fill="#999"
                d="M872.523053 824.446082l-718.53082 0c-39.763632 0-71.922053-31.909757-71.922053-71.675436 0-18.485003 7.095605-35.205826 18.486026-47.872311L455.885981 230.77294399c23.810289-31.400151 68.641333-37.993313 100.29731-14.18302399 5.570879 4.052293 10.384511 8.873088 14.18302399 14.190187L929.764755 709.958584c23.547299 31.407314 17.217127 76.479859-14.436804 100.041484-12.922311 9.881045-27.864628 14.43885-42.804898 14.43884999l0 0L872.523053 824.446082zM872.523053 824.446082">
              </path>
            </svg>
          </div>
          <div class="flex sha-6 ra-5 h-130 fw">
            <div v-for="(years,index) in yearList" @click.stop="btnYear(years)" :class="{'fc-primary fb fs-15':config.year==years}" class="wb-20 fs-15 flex ai-c jc-c hand h-45">{{years}}</div>
          </div>
          <div @click.stop="setYear('next')" class="w-all pt5 hand flex ai-c jc-c">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path fill="#999"
                d="M871.424 200.704c14.848 0 29.696 4.608 43.008 14.336 31.744 23.552 37.888 68.608 14.336 99.84l-359.424 479.232c-3.584 5.12-8.704 10.24-14.336 14.336-31.744 24.064-76.288 17.408-100.352-14.336L99.328 320.512c-11.264-12.8-18.432-29.184-18.432-48.128 0-39.936 32.256-71.68 71.68-71.68h718.848z">
              </path>
            </svg>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import formatDate, { refDate } from '@lib/dateFormat';
import { isArray, isNumber } from '@lib/lang';
const ps = defineProps({
  type: { type: String, default: "month" },
  class: { type: String, default: "" },
  // 起始时间值
  modelValue: { type: [String, Number, Date], default: "" },
  // 结束时间值
  end: { type: [String, Number, Date], default: "" },
  // 输入框大小
  size: { type: String, default: "small" },
  // 除在这个区间内的时间都不能选
  // 当为number且显示两个时间时 已第一个时间前后范围内的时间区间 如30 在选择第一个时间的前30天，或后30天内选择
  // 当为string start&&end start||end 如 2016-02-02&&2016-05-02  && 两个时间内可选，||两个时间外可选
  // 当为string start> 或<start 前后都可以 如 2016-02-02>  >2016-02-02， 表示大于给定日期之后的日期可选，反之小于也是同理
  // 当为Array ['2016-02-02','2016-02-01'] 指定时间不可选
  // section="2023-02-07&&2023-02-18" section="[2023-02-07,2023-02-18]" section="30"
  section: { type: [Array, Number, String], default: "" },
  // 是否有清空图标
  clear: { type: Boolean, default: true },
  placeholder: { type: String, default: "请选择日期" },
  // 日期格式化
  format: { type: String, default: "yyyy-MM" },
  // 日期格式化
  labelformat: { type: String, default: "" },
  // 是否显示 时分秒
  disabled: { type: [Boolean, Number, String], default: false }
})

const emit = defineEmits(["update:modelValue", "change"]);
const monthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const dateMain = ref(null);
const layDate = ref(null);

const hovers = ref(false);
const visible = ref(false);
const isClear = ref(false);
// 是否首次传过来的开始时间
const isFirstStart = ref(true);

const config = ref({
  nextYear: new Date().getFullYear(),
  year: new Date().getFullYear(),
  nextMonth: Number(formatDate(new Date(), 'MM')),
  month: Number(formatDate(new Date(), 'MM')),
  isYear: false
})

watch(() => ps.modelValue, (news, old) => {
  if (news) {
    if (ps.type == 'month') {
      config.value.nextYear = new Date(ps.modelValue).getFullYear()
      config.value.year = new Date(ps.modelValue).getFullYear()
      config.value.nextMonth = Number(formatDate(ps.modelValue, 'MM'))
      config.value.month = Number(formatDate(ps.modelValue, 'MM'))
    } else {
      config.value.year = ps.modelValue
    }
  }
})

watchEffect(cb => {
  if (isFirstStart.value) {
    if (ps.modelValue) {
      if (ps.type == 'month') {
        config.value.nextYear = new Date(ps.modelValue).getFullYear()
        config.value.year = new Date(ps.modelValue).getFullYear()
        config.value.nextMonth = Number(formatDate(ps.modelValue, 'MM'))
        config.value.month = Number(formatDate(ps.modelValue, 'MM'))
        emit('update:modelValue', formatDate(ps.modelValue, ps.format));
      } else {
        emit('update:modelValue', formatDate(ps.modelValue, 'yyyy'));
        isFirstStart.value = false
      }
    }
  }
})


// 上一年，下一年，年份
function changeYear(type) {
  if (ps.type == 'month') {
    if (type == "prev") {
      config.value.year = config.value.year - 1
      config.value.nextYear = config.value.nextYear - 1
    } else {
      config.value.year = config.value.year + 1
      config.value.nextYear = config.value.nextYear + 1
    }
  } else {
    setYear(type)
  }
}

function onMonth(v) {
  config.value.month = v + 1;
  isFirstStart.value = false;
  emit('update:modelValue', formatDate(`${config.value.year}-${config.value.month}-01`, ps.format));
  emit('change', formatDate(`${config.value.year}-${config.value.month}-01`, ps.format))
  visible.value = false;
  document.removeEventListener('click', setSelectPop);
}

const options: any = ref({
  // 屏宽
  screenWidth: 0,
  // 屏高
  screenHeight: 0,
  // 输入框高度
  iheight: 0,
  // 选择弹框高度
  height: 0,
  // 选择弹框宽度
  width: 0
})

// 获得年份
const yearList = computed(() => {
  let star = config.value.nextYear - 7;
  let end = config.value.nextYear + 8;
  let years: any = [];
  for (let i = star; i < end; i++) {
    years.push(i)
  }
  return years;
})

function btnYear(v) {
  if (ps.type == 'month') {
    config.value.year = v;
    config.value.isYear = false;
    isFirstStart.value = false;
  }
  if (ps.type == 'year') {
    config.value.year = v;
    isFirstStart.value = false;
    emit('update:modelValue', config.value.year);
    visible.value = false;
    document.removeEventListener('click', setSelectPop);
    emit('change', config.value.year)
  }

  // emit('update:modelValue', formatDate(`${config.value.year}-${config.value.month}-01`, ps.format));
}

// 设置年份
function setYear(type) {
  if (type == 'prev') {
    config.value.nextYear = config.value.nextYear - 15;
  } else {
    config.value.nextYear = config.value.nextYear + 15;
  }
  isFirstStart.value = false;
}

const dateClass = computed(() => {
  let cls = {};
  if (ps.size) {
    if (ps.size == "small") {
      cls['h-32'] = true;
    }
    else if (ps.size == "big") {
      cls['h-38'] = true;
    } else {
      cls[ps.size] = true;
    }
  }
  return {
    ...cls,
    'allowed': ps.disabled,
    [ps.class]: ps.class
  }
})

const currStartDate = computed(() => {
  if (ps.modelValue) {
    if (ps.type == "month") {
      if (ps.labelformat) {
        return formatDate(ps.modelValue, ps.labelformat)
      } else {
        return formatDate(ps.modelValue, ps.format)
      }
    } else {
      return ps.modelValue
    }
  }
  return ""
})

function setSelectPop(e) {
  if (!dateMain?.value?.contains(e.target)) {
    visible.value = false;
    document.removeEventListener('click', setSelectPop)
  }
}

function onShowDatePop() {
  if (ps.disabled) return
  visible.value = !visible.value;
  document.addEventListener("click", setSelectPop);
  if (visible.value) {
    config.value.isYear = false;
    nextTick(() => {
      // 可见屏高
      options.value.screenHeight = document.body.getBoundingClientRect().height;
      // 可见屏宽
      options.value.screenWidth = document.body.getBoundingClientRect().width;
      options.value.width = document.getElementById('dateInput')?.offsetWidth || 0;
      options.value.height = layDate.value?.offsetHeight || 0;
      options.value.iheight = document.getElementById('dateInput')?.offsetHeight || 0;
    })
  }
}

const inputfont = computed(() => {
  let cls = {};
  if (ps.size) {
    if (ps.size == "small") {
      cls['h-32'] = true;
    }
    else if (ps.size == "big") {
      cls['h-38'] = true;
    } else {
      cls[ps.size] = true;
    }
  } else {
    cls['fs-init'] = true;
  }
  return {
    ...cls,
    'centers': ps.twin
  }
})

const getInputClass = computed(() => {
  return {
    'dishover': !hovers.value,
    'hovers': hovers.value,
  }
})

function mainOver() {

}
function mainOut() {
  isClear.value = false;
}

function onFocus() {
  hovers.value = true;
}
function onBlur() {
  hovers.value = false;
}

const bodyDate = computed(() => {
  let top = dateMain.value.getBoundingClientRect().top;
  let left = dateMain.value.getBoundingClientRect().left;
  let style = {};
  if (options.value.iheight + top + options.value.height > options.value.screenHeight) {
    style.top = 0 - options.value.height - 3 + 'px';
  } else {
    style.top = options.value.iheight + 3 + 'px';
  }
  if (options.value.width + left > options.value.screenWidth) {
    style.right = "0px";
  } else {
    style.left = "0px";
  }
  return style;
})
</script>

<style lang='less'>
.hovertag {
  &:hover {
    color: #409eff !important;
  }
}
</style>