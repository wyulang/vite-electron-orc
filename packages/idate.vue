<template>
  <!-- 页面显示内容 -->
  <section @click="onShowDatePop" :class="class" class="flex  ai-c flex-1">
    <div :class="{'fc-bbb':!currStartDate}" class="h-all flex ai-c">{{currStartDate||(twin?startPlaceholder:placeholder)}}</div>
    <span class="ml10 mr10 fc-bbb">-</span>
    <div :class="{'fc-bbb':!endStartDate}" class="h-all flex ai-c">{{endStartDate||endPlaceholder}}</div>
    <span class="flex-1"></span>
    <span class="arrow-right w-10 h-10 mr4"></span>
  </section>

  <section v-if="visible" class="hv-all fixed at0 ab0 _date al0 ar0 flex fd-c">
    <div @click="onClose(1)" class="flex-1 ba-3"></div>

    <div ref="dateBody" class="rel hidden sha-card fc-999 fs-14">
      <!-- 年份选择 -->
      <section @click.stop="options.isYear=false" v-if="options.isYear" class="abs hand zi-140 at0 ab0 ar0 al0 pp10 flex fd-c ai-c jc-c ba-f9">
        <div @click.stop="setYear('prev')" class="w-all pb5 hand flex ai-c jc-c">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path fill="#999"
              d="M872.523053 824.446082l-718.53082 0c-39.763632 0-71.922053-31.909757-71.922053-71.675436 0-18.485003 7.095605-35.205826 18.486026-47.872311L455.885981 230.77294399c23.810289-31.400151 68.641333-37.993313 100.29731-14.18302399 5.570879 4.052293 10.384511 8.873088 14.18302399 14.190187L929.764755 709.958584c23.547299 31.407314 17.217127 76.479859-14.436804 100.041484-12.922311 9.881045-27.864628 14.43885-42.804898 14.43884999l0 0L872.523053 824.446082zM872.523053 824.446082">
            </path>
          </svg>
        </div>
        <div class="flex sha-6 ra-5 hidden fw">
          <div v-for="(years,index) in yearList" @click="btnYear(years)" :class="{'fc-primary fb fs-15':startConfig.selectYear==years}" class="wb-20 fs-15 flex ai-c jc-c hand h-45">{{years}}</div>
        </div>
        <div @click.stop="setYear('next')" class="w-all pt5 hand flex ai-c jc-c">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path fill="#999"
              d="M871.424 200.704c14.848 0 29.696 4.608 43.008 14.336 31.744 23.552 37.888 68.608 14.336 99.84l-359.424 479.232c-3.584 5.12-8.704 10.24-14.336 14.336-31.744 24.064-76.288 17.408-100.352-14.336L99.328 320.512c-11.264-12.8-18.432-29.184-18.432-48.128 0-39.936 32.256-71.68 71.68-71.68h718.848z">
            </path>
          </svg>
        </div>
      </section>

      <!-- 月 -->
      <section @click.stop="options.isMonth=false" v-if="options.isMonth" class="abs zi-140 at0 ab0 ar0 al0 pp20 flex ai-c jc-c ba-f9">
        <div class="flex sha-6 ra-5 hidden fw">
          <div @click.stop="startConfig.nextMonth=options.isTwin?index-1:index;options.isMonth=false;" v-for="(month,index) in monthList" :class="{'fc-primary fb fs-15':startConfig.selectMonth==index+1}" class="wb-33 fs-15 flex ai-c jc-c hand h-45">{{month}}</div>
        </div>
      </section>

      <!-- 时分秒 -->
      <!-- v-if="options.isHour||options.isMinute||options.isSecond" -->
      <section v-if="options.isHour||options.isMinute||options.isSecond" class="abs zi-140 at0 ab0 ar0 al0 pp20 pt15 flex fd-c ai-c jc-c ba-f9">
        <div class="h-38 flex w-all fs-16 ai-c">
          <span :class="{'isTime':options.isHour}" class="pl15 hand pr15 pt5 pb5 ra-4 mr4 b-d" @click="setOptions();options.isHour=true;">{{options.isTwin?endConfig.selectHour:startConfig.selectHour}}</span>:
          <span :class="{'isTime':options.isMinute}" class="pl15 hand pr15 pt5 pb5 ra-4 ml4 mr4 b-d" @click="setOptions();options.isMinute=true;">{{options.isTwin?endConfig.selectMinute:startConfig.selectMinute}}</span>:
          <span :class="{'isTime':options.isSecond}" class="pl15 hand pr15 pt5 pb5 ra-4 ml4 b-d" @click="setOptions();options.isSecond=true;">{{options.isTwin?endConfig.selectSecond:startConfig.selectSecond}}</span>
          <div class="flex-1"></div>
          <span @click.stop="setOptions()" class="fc-primary hand">关闭</span>
        </div>
        <!-- 时 -->
        <div v-if="options.isHour" class="w-all flex-1">
          <div class="flex sha-card pt10 ra-5 h-all hidden rel fw">
            <div @click.stop style="font-size:100px" class="abs at0 op-1 flex ai-c jc-c fc-999 al0 ar0 ab0 zi-100">时</div>
            <div @click.stop="onSetTime(hour,1)" v-for="(hour,index) in hourList" :class="{'bc-primary fc-fff fb fs-15':(isCurrTime=='start'&&startConfig.selectHour==index)||(isCurrTime=='end'&&endConfig.selectHour==index)}" class="wb-25 rel zi-100 fs-18 flex ai-c jc-c hand h-35">{{hour}}</div>
          </div>
        </div>
        <!-- 分 -->
        <div v-if="options.isMinute" class="w-all flex-1">
          <div style="height:99%" class="flex hidden rel sha-card ra-5 fw">
            <div @click.stop style="font-size:100px" class="abs at0 op-1 flex ai-c jc-c fc-333 al0 ar0 ab0 zi-100">分</div>
            <!-- 分 -->
            <div @click.stop="onSetTime(minu,2)" v-for="(minu,index) in minuList" :class="{'bc-primary fc-fff fb':(isCurrTime=='start'&&startConfig.selectMinute==index)||(isCurrTime=='end'&&endConfig.selectMinute==index)}" style="width:16.66666%;min-height:25px;"
              class="zi-120 rel fc-000 bb-e br-e fs-14 flex ai-c jc-c hand">
              {{minu}}</div>
          </div>
        </div>
        <!-- 秒 -->
        <div v-if="options.isSecond" class="w-all flex-1">
          <div style="height:99%" class="flex hidden rel sha-card ra-5 fw">
            <div @click.stop style="font-size:100px" class="abs at0 op-1 flex ai-c jc-c fc-333 al0 ar0 ab0 zi-100">秒</div>
            <!-- 秒 -->
            <div @click.stop="onSetTime(v,3)" v-for="(v,index) in minuList" :class="{'bc-primary fc-fff fb':(isCurrTime=='start'&&startConfig.selectSecond==index)||(isCurrTime=='end'&&endConfig.selectSecond==index)}" style="width:16.66666%;min-height:25px;" class="zi-120 rel fc-000 bb-e br-e fs-14 flex ai-c jc-c hand">
              {{v}}</div>
          </div>
        </div>
      </section>

      <div class="w-all bc-fff ra-5  fd-c">
        <!-- 年月切换 -->
        <div class="w-all flex ai-c pt10 jc-b">
          <div @click="changeYear('prev')" class="pl10 pr15 hand">
            <svg viewBox="0 0 1024 1024" width="13" height="13">
              <path
                d="M239.9 512l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L101.5 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L239.9 512z m404.7 0l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L506.1 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L644.6 512z"
                fill="#999"></path>
            </svg>
          </div>
          <div @click="changeMonth('prev')" class="pl10 pr10 hand">
            <svg viewBox="0 0 1024 1024" width="13" height="13">
              <path d="M264.7 555l387.1 387.2c23.7 23.8 62.3 23.8 86.1 0l21.4-21.5c23.8-23.8 23.8-62.3 0-86L436.7 512l322.6-322.6c23.8-23.8 23.8-62.3 0-86l-21.4-21.5c-23.8-23.8-62.3-23.8-86.1 0L264.7 469c-23.8 23.7-23.8 62.3 0 86z" fill="#999"></path>
            </svg>
          </div>
          <div class="flex-1 flex fs-17 ai-c jc-c">
            <span @click="setOptions();options.isYear=true" class="pr10 hand">{{startConfig.nextYear}} 年</span>
            <span @click="setOptions();options.isMonth=true;options.isTwin=false;" class="pl10 hand">{{startConfig.nextMonth+1}} 月</span>
          </div>
          <div @click="changeMonth('next')" class="pl10 pr10 hand">
            <svg viewBox="0 0 1024 1024" width="13" height="13">
              <path d="M759.3 469L372.2 81.8c-23.7-23.8-62.3-23.8-86.1 0l-21.4 21.5c-23.8 23.8-23.8 62.3 0 86L587.3 512 264.7 834.6c-23.8 23.8-23.8 62.3 0 86l21.4 21.5c23.8 23.8 62.3 23.8 86.1 0L759.3 555c23.8-23.7 23.8-62.3 0-86z" fill="#999"></path>
            </svg>
          </div>
          <div @click="changeYear('next')" class="pr10 pl15 hand">
            <svg viewBox="0 0 1024 1024" width="13" height="13">
              <path
                d="M784.1 512L485.2 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L784.1 512z m-404.7 0L80.5 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L379.4 512z"
                fill="#999"></path>
            </svg>
          </div>
        </div>

        <!-- 周 -->
        <div class="w-all mt10 flex">
          <div v-for="item in weekList" style="border-bottom:1px solid #f1f1f1" class="h-38 flex-1 fs-14 flex ai-c mb6 jc-c">{{item}}</div>
        </div>

        <!-- 日 -->
        <div class="flex w-all fw">
          <div v-for="item in startPath" @mouseover="onOver(item)" @mouseout="onOut(item)" @click="setDateValue(item)" style="width:14.2%" class=" fs-14 rel h-48 flex ai-c jc-c">
            <div :class="item.className">{{item.value}}</div>
            <div v-if="item.classFill" :class="item.classFill"></div>
          </div>
        </div>

        <!-- 时分秒 设置值 -->
      <div v-if="time" class="w-all flex ai-c h-45 pl10 jc-b fs-12" style="border-top:1px solid #f1f1f1">
        <div class="flex ai-c">
          <div>
            <!-- <span class="fs-14" v-if="twin">开始时间：</span> -->
            <span @click="options.isHour=true;isCurrTime='start';options.isTwin=false;" class="b-d hand ra-4 pl10 fs-16 pr10 pb5 pt5">{{startConfig.selectHour}} : {{startConfig.selectMinute}} : {{startConfig.selectSecond}}</span>
          </div>

          <div v-if="twin" class=" ml10">
            <!-- <span class="fs-14">结束时间：</span> -->
            <span @click="options.isHour=true;isCurrTime='end';options.isTwin=true;" class="b-d hand ra-4 pl10 fs-16 pr10 pb5 pt5">{{endConfig.selectHour}} : {{endConfig.selectMinute}} : {{endConfig.selectSecond}}</span>
          </div>
        </div>

        <div class="flex fs-16 pr5 ai-c">
          <div @click="onCurrTime" class="w-48 h-25  ra-5 flex ai-c hand jc-c fc-aa">此刻</div>
          <div @click="onTimeSave" class="w-48 h-25 btn ra-5 flex ai-c hand jc-c fc-aa fb btn-auto">确定</div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>


<script setup lang='ts'>
import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import formatDate, { refDate } from '@lib/dateFormat';
import { isArray, isNumber } from '@lib/lang';
const ps = defineProps({
  separator: { type: String, default: "-" },
  class: { type: String, default: "" },
  startPlaceholder: { type: String, default: "开始日期" },
  endPlaceholder: { type: String, default: "结束日期" },
  // 起始时间值
  modelValue: { type: [String, Number, Date], default: "" },
  // 结束时间值
  end: { type: String, default: "" },
  // 输入框大小
  size: { type: String, default: "small" },
  // 是否显示 时分秒
  time: { type: Boolean, default: false },
  // 除在这个区间内的时间都不能选
  // 当为number且显示两个时间时 已第一个时间前后范围内的时间区间 如30 在选择第一个时间的前30天，或后30天内选择
  // 当为string strat&&end start||end 如 2016-02-02&&2016-05-02  && 两个时间内可选，||两个时间外可选
  // 当为string strat> 或<start 前后都可以 如 2016-02-02>  >2016-02-02， 表示大于给定日期之后的日期可选，反之小于也是同理
  // 当为Array ['2016-02-02','2016-02-01'] 指定时间不可选
  // section="2023-02-07&&2023-02-18" section="[2023-02-07,2023-02-18]" section="30"
  section: { type: [Array, Number, String], default: "" },
  // 是否显示两个时间选择
  twin: { type: Boolean, default: false },
  // 是否有清空图标
  clear: { type: Boolean, default: true },
  placeholder: { type: String, default: "请选择日期" },
  // 日期格式化
  format: { type: String, default: "yyyy-MM-dd" },
  // 日期格式化
  labelformat: { type: String, default: "" },
  // 是否显示 时分秒
  disabled: { type: [Boolean, Number, String], default: false },
  // 当出现在某个position: absolute元素内，出现滚动条时，需要当前的div  dom
  dom: { type: String, default: "" }
})

const emit = defineEmits(["update:modelValue", "change", "update:end"]);

const weekList = ['日', '一', '二', '三', '四', '五', '六'];
const monthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const hourList = Array.from(new Array(24).keys()).map(v => v)
const minuList = Array.from(new Array(60).keys()).map(v => v)

const hovers = ref(false);
const visible = ref(false);
const isClear = ref(false);
// 是否首次传过来的开始时间
const isFirstStart = ref(true);
// 鼠标经过日期
const overDate = ref("");
const isCurrTime = ref("");

const dateMain = ref(null);
const layDate = ref(null);

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
  width: 0,
  isYear: false,
  isMonth: false,
  isHour: false,
  isMinute: false,
  isSecond: false,
  isTwin: false
})

const initStartDate = ps.modelValue ? new Date(ps.modelValue) : new Date()
const instdate = refDate(ps.modelValue || new Date())

// 初始化开始日期
const startConfig: any = ref({
  selectYear: initStartDate.getFullYear(),
  selectMonth: initStartDate.getMonth(),
  selectDay: (ps.modelValue ? initStartDate.getDate() : ""),
  selectHour: instdate[3],
  selectMinute: instdate[4],
  selectSecond: instdate[5],
  value: (ps.modelValue ? formatDate(ps.modelValue) : ""),
  nextYear: initStartDate.getFullYear(),
  nextMonth: initStartDate.getMonth(),
})
const initEndDate = ps.end && new Date(ps.end) || new Date(initStartDate.setMonth(initStartDate.getMonth() + 1));
// 初始化结束日期
const endConfig: any = ref({
  selectYear: initEndDate.getFullYear(),
  selectMonth: initEndDate.getMonth(),
  selectDay: (ps.end ? initEndDate.getDate() : ""),
  selectHour: new Date().getHours(),
  selectMinute: new Date().getMinutes(),
  selectSecond: new Date().getSeconds(),
  value: (ps.end ? formatDate(ps.end) : ""),
  nextYear: new Date(initStartDate.setMonth(initStartDate.getMonth() + 1)).getFullYear(),
  nextMonth: new Date(initStartDate.setMonth(initStartDate.getMonth() + 1)).getMonth(),
})

function onCurrTime() {
  let hh = formatDate("", "hh:mm:ss").split(':');
  if (ps.twin) {
    [startConfig.value.selectHour, startConfig.value.selectMinute, startConfig.value.selectSecond] = hh;
    [endConfig.value.selectHour, endConfig.value.selectMinute, endConfig.value.selectSecond] = hh;
  } else {
    [
      startConfig.value.selectYear,
      startConfig.value.selectMonth,
      startConfig.value.selectDay,
      startConfig.value.selectHour,
      startConfig.value.selectMinute,
      startConfig.value.selectSecond
    ] = refDate()
    changeDateValue();
  }
}

function onClear() {
  if (ps.disabled) return;
  if (ps.twin) {
    [
      startConfig.value.selectYear,
      startConfig.value.selectMonth,
      startConfig.value.selectDay,
      startConfig.value.selectHour,
      startConfig.value.selectMinute,
      startConfig.value.selectSecond,
      startConfig.value.value
    ] = ["", "", "", "0", "0", "0", ""];
    [
      endConfig.value.selectYear,
      endConfig.value.selectMonth,
      endConfig.value.selectDay,
      endConfig.value.selectHour,
      endConfig.value.selectMinute,
      endConfig.value.selectSecond,
      endConfig.value.value
    ] = ["", "", "", "0", "0", "0", ""];
  } else {
    [
      startConfig.value.selectYear,
      startConfig.value.selectMonth,
      startConfig.value.selectDay,
      startConfig.value.selectHour,
      startConfig.value.selectMinute,
      startConfig.value.selectSecond,
      startConfig.value.value
    ] = ["", "", "", "0", "0", "0", ""];
  }
  changeDateValue('close')
}

function onTimeSave() {
  if (ps.twin) {
    if (startConfig.value.value && endConfig.value.value) {
      changeDateValue()
    } else {
      visible.value = false;
    }
  } else {
    if (startConfig.value.value) {
      changeDateValue()
    } else {
      visible.value = false;
    }
  }
}

function onSetTime(v, type) {
  if (options.value.isTwin) {
    if (type == 1) {
      endConfig.value.selectHour = v;
    }
    if (type == 2) {
      endConfig.value.selectMinute = v;
    }
    if (type == 3) {
      endConfig.value.selectSecond = v;
    }
  } else {
    if (type == 1) {
      startConfig.value.selectHour = v;
    }
    if (type == 2) {
      startConfig.value.selectMinute = v;
    }
    if (type == 3) {
      startConfig.value.selectSecond = v;
    }
  }
}

// 上一年，下一年，年份
function changeYear(type) {
  if (type == "prev") {
    startConfig.value.nextYear = startConfig.value.nextYear - 1
  } else {
    startConfig.value.nextYear = startConfig.value.nextYear + 1
  }
}

// 上一页，下一页 月份
function changeMonth(type) {
  let date = new Date(`${startConfig.value.nextYear}-${startConfig.value.nextMonth + 1}-1`);
  if (type == 'prev') {
    startConfig.value.nextMonth = new Date(date.setMonth(date.getMonth() - 1)).getMonth()
  } else {
    startConfig.value.nextMonth = new Date(date.setMonth(date.getMonth() + 1)).getMonth()
  }
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
  // ----------------------------------------------------
})

function setDateValue(item) {
  if (ps.twin && startConfig.value.value && endConfig.value.value) {
    startConfig.value.value = "";
    endConfig.value.value = "";
  }

  if (item.select != 4) {
    if (ps.twin) {
      if (startConfig.value.value && item.date < startConfig.value.value && endConfig.value.value) {
        startConfig.value.value = endConfig.value.value;
        endConfig.value.value = formatDate(item.date, "yyyy-MM-dd")
      } else if (startConfig.value.value && item.date < startConfig.value.value && !endConfig.value.value) {
        endConfig.value.value = startConfig.value.value;
        startConfig.value.value = item.date;
      }
      else if (!startConfig.value.value) {
        startConfig.value.value = formatDate(item.date, "yyyy-MM-dd")
      } else if (!endConfig.value.value) {
        endConfig.value.value = formatDate(item.date, "yyyy-MM-dd")
      }

      if (!ps.time && startConfig.value.value && endConfig.value.value) {
        changeDateValue()
      }
    } else {
      startConfig.value.value = item.date;
      if (!ps.time) {
        changeDateValue()
      }
    }
  }
}

function changeDateValue(type) {
  if (type) {
    if (ps.twin) {
      emit('change', [])
      emit('update:modelValue', "")
      emit('update:end', "")
    } else {
      emit('update:modelValue', "")
      emit('update:end', "")
      emit('change', "")
    }
  } else {
    let startValue = "";
    let endValue = "";
    let format = ps.format;
    if (ps.time && ps.format == 'yyyy-MM-dd') {
      format = "yyyy-MM-dd hh:mm:ss"
    }
    visible.value = false;
    if (ps.twin) {
      if (startConfig.value.value && endConfig.value.value) {
        startValue = formatDate(`${startConfig.value.value} ${startConfig.value.selectHour}:${startConfig.value.selectMinute}:${startConfig.value.selectSecond}`, format);
        endValue = formatDate(`${endConfig.value.value} ${endConfig.value.selectHour}:${endConfig.value.selectMinute}:${endConfig.value.selectSecond}`, format);
        if (['number', 'timestamp'].includes(ps.format)) {
          startValue = new Date(startValue).getTime()
          endValue = new Date(endValue).getTime()
        }
        emit('update:modelValue', startValue)
        emit('update:end', endValue)
        emit('change', [startValue, endValue])
      } else {
        emit('change', "")
      }
    } else {
      if (startConfig.value.value) {
        startValue = formatDate(`${startConfig.value.value} ${startConfig.value.selectHour}:${startConfig.value.selectMinute}:${startConfig.value.selectSecond}`, format);
        if (['number', 'timestamp'].includes(ps.format)) {
          startValue = new Date(startValue).getTime()
        }
        emit('update:modelValue', startValue)
        emit('change', startValue)
      } else {
        emit('change', "")
      }
    }
  }
}

function setOptions() {
  options.value.isYear = false;
  options.value.isMonth = false;
  options.value.isHour = false;
  options.value.isMinute = false;
  options.value.isSecond = false;
}

// 监听开始值变化
watch(() => ps.modelValue, (news, old) => {
  if (news) {
    let date = new Date(news);
    startConfig.value.nextYear = date.getFullYear();
    startConfig.value.nextMonth = date.getMonth();
    startConfig.value.selectDay = date.getDate();
    startConfig.value.selectHour = date.getHours();
    startConfig.value.selectMinute = date.getMinutes();
    startConfig.value.selectSecond = date.getSeconds();
    startConfig.value.value = formatDate(news)
  }
})

// 监听结束值变化
watch(() => ps.end, (news, old) => {
  if (news) {
    let date = new Date(news);
    endConfig.value.selectYear = date.getFullYear();
    endConfig.value.selectMonth = date.getMonth();
    endConfig.value.selectDay = date.getDate();
    endConfig.value.selectHour = date.getHours();
    endConfig.value.selectMinute = date.getMinutes();
    endConfig.value.selectSecond = date.getSeconds();
    endConfig.value.value = formatDate(news)
  }
})

// 设置年份
function setYear(type) {
  if (type == 'prev') {
    startConfig.value.nextYear = startConfig.value.nextYear - 20;
  } else {
    startConfig.value.nextYear = startConfig.value.nextYear + 20;
  }
}

// 获得年份
const yearList = computed(() => {
  let star = startConfig.value.nextYear - 10;
  let end = startConfig.value.nextYear + 10;
  let years: any = [];
  for (let i = star; i < end; i++) {
    years.push(i)
  }
  return years;
})

function btnYear(v) {
  startConfig.value.nextYear = v;
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

function onFocus() {
  hovers.value = true;
}
function onBlur() {
  hovers.value = false;
}

function onOver(item) {
  if (startConfig.value.value && !endConfig.value.value) {
    overDate.value = item.date;
  }
}
function onOut(item) {
  overDate.value = "";
}

const currStartDate = computed(() => {
  if (ps.modelValue) {
    if (ps.labelformat) {
      return formatDate(ps.modelValue, ps.labelformat)
    } else {
      if (ps.time) {
        return formatDate(ps.modelValue, "yyyy-MM-dd hh:mm:ss")
      } else {
        return formatDate(ps.modelValue, "yyyy-MM-dd")
      }
    }
  }
  return ""
})

const endStartDate = computed(() => {
  if (ps.end) {
    if (ps.labelformat) {
      return formatDate(ps.end, ps.labelformat)
    } else {
      if (ps.time) {
        return formatDate(ps.end, "yyyy-MM-dd hh:mm:ss")
      } else {
        return formatDate(ps.end, "yyyy-MM-dd")
      }
    }
  }
  return ""
})

function onShowDatePop() {
  if (ps.disabled) return
  visible.value = true;
  setOptions();
}

function onClose() {
  visible.value = false;
}

const startPath = computed(() => {
  // 本月1号的时间对象
  let firstMonthDate = new Date(startConfig.value.nextYear, startConfig.value.nextMonth, 1);
  // 本月1号星期几
  let week = firstMonthDate.getDay();
  // 第一个时间
  let firstDate = firstMonthDate - week * 60 * 60 * 1000 * 24;
  return Array.from(new Array(42).keys()).map(v => {
    let date = formatDate(new Date(firstDate + v * 60 * 60 * 1000 * 24));
    // 1 未选中,2 区间选中,3 当前选中值, 4其它月份值与不可选值
    let select = 1;
    // 不在当前月分 不可选
    if (date.substr(0, 7) != `${startConfig.value.nextYear}-${(startConfig.value.nextMonth + 1) < 10 ? ('0' + (startConfig.value.nextMonth + 1)) : startConfig.value.nextMonth + 1}`) {
      select = 4;
    }

    if (ps.section) {
      if (isNumber(ps.section)) {
        if (startConfig.value.value && !endConfig.value.value) {
          if (Math.abs(parseInt((new Date(date) - new Date(startConfig.value.value)) / (1000 * 60 * 60 * 24))) < ps.section) {
            select = "4"
          }
        }
      } else if (isArray(ps.section)) {
        if (ps.section.some(s => date == formatDate(new Date(s)))) {
          select = "4"
        }
      } else if (ps.section.includes('&&')) {
        let currStart = formatDate(ps.section.split('&&')[0]);
        let currEnd = formatDate(ps.section.split('&&')[1]);
        if (date > currStart && date < currEnd) {
          select = "4"
        }
      } else if (ps.section.includes('||')) {
        let currStart = formatDate(ps.section.split('&&')[0]);
        let currEnd = formatDate(ps.section.split('&&')[1]);
        if (date > currStart && date < currEnd) {
          select = "4"
        }
      } else if (ps.section.includes('>')) {
        let currStart = formatDate(ps.section.split('>')[0]) || formatDate(ps.section.split('>')[1]);
        if (date < currStart) {
          select = "4"
        }
      } else if (ps.section.includes('<')) {
        let currStart = formatDate(ps.section.split('>')[0]) || formatDate(ps.section.split('>')[1]);
        if (date > currStart) {
          select = "4"
        }
      }
    }

    if (ps.twin && select != 4 && endConfig.value.value) {
      if (startConfig.value.value && endConfig.value.value && (date > startConfig.value.value && date < endConfig.value.value)) {
        select = 2;
      } else if (startConfig.value.value && overDate.value) {
        if (overDate.value > startConfig.value.value) {
          if (date > startConfig.value.value && date < overDate.value) {
            select = 2;
          }
        } else {
          if (date < startConfig.value.value && date > overDate.value) {
            select = 2;
          }
        }
      }
    }


    if (startConfig.value.value == date) {
      select = 3;
    }
    if (endConfig.value.value == date && ps.twin) {
      select = 5;
    }

    // 1 未选中,2 区间选中,3 当前选中值, 4其它月份值与不可选值
    let className = "fc-222";
    let classFill = "";
    if (select == 2) {
      className = "bc-f5 flex ai-c jc-c w-all h-35";
    }
    else if (select == 3) {
      className = "bc-primary fc-fff h-35 w-35 fb zi-120 ra-100 flex ai-c jc-c";
      if (ps.twin && endConfig.value.value) {
        classFill = "abs ar0 h-35 wb-50 zi-100 bc-f5 flex"
      }
    }
    else if (select == 5) {
      className = "bc-primary fc-fff h-35 w-35 zi-120 fb ra-100 flex ai-c jc-c";
      if (ps.twin) {
        classFill = "abs al0 h-35 wb-50 zi-100 bc-f5 flex"
      }
    }
    else if (select == 4) {
      className = "fc-ccc";
    }

    return {
      date,
      value: Number(date.split('-').pop()),
      select,
      className,
      classFill
    }
  })
})

function mainOver() {
  if (!ps.clear) {
    isClear.value = false;
    return
  }
  if (ps.twin) {
    if (endConfig.value.value && startConfig.value.value) {
      isClear.value = true;
    } else {
      isClear.value = false;
    }
  } else {
    if (startConfig.value.value) {
      isClear.value = true;
    } else {
      isClear.value = false;
    }
  }
}
function mainOut() {
  isClear.value = false;
}


</script>

<style lang='less'>
._date{
  .abs-r50{right: -50%}
  .iconfix {
    &:hover {
      fill: #409eff !important;
    }
  }
  .hovers{
    border: 1px solid #409eff;
  }
  .isTime{
    border: 1px solid #409eff;
    color: #409eff;
  }
  .date-left{
    position: relative;
    z-index: 110;
    &:after{
      position:absolute;
      content: ' ';
      top:0;
      z-index: 1;
      left:0;
      right: 0;
      bottom: 0;
      background-color: #761414;
    }
  }
  .dishover{
    border: 1px solid #ddd;
  }
  .hovertag{
    &:hover{
      color: #409eff !important;
    }
  }
  .hovertime{
    &:hover{
      border-color: #409eff;
      color: #409eff;
    }
  }
}
.arrow-right {
  border-width: 1.5px 1.5px 0 0;
  border-color: #ddd;
  border-style: solid;
  transform: rotate(45deg);
}
</style>