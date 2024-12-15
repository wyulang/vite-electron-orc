<template>
  <section :class="class" class="flex ra-5 pp16 fd-c">
    <div class="flex fs-16 fb bb-e pb15 ai-c jc-b">
      <div class="flex ai-c">
        <span>{{info.month+1}}月</span>
        <span class="ml5">{{info.year}}年</span>
      </div>
      <div class="flex ai-c">
        <div @click="changeMonth('prev')" class="pl5 pr5 hand">
          <svg viewBox="0 0 1024 1024" class="w-12 h-12">
            <path d="M264.7 555l387.1 387.2c23.7 23.8 62.3 23.8 86.1 0l21.4-21.5c23.8-23.8 23.8-62.3 0-86L436.7 512l322.6-322.6c23.8-23.8 23.8-62.3 0-86l-21.4-21.5c-23.8-23.8-62.3-23.8-86.1 0L264.7 469c-23.8 23.7-23.8 62.3 0 86z" fill="#999"></path>
          </svg>
        </div>
        <div @click="changeMonth('next')" class="pl5 ml10 pr5 hand">
          <svg viewBox="0 0 1024 1024" class="w-12 h-12">
            <path d="M759.3 469L372.2 81.8c-23.7-23.8-62.3-23.8-86.1 0l-21.4 21.5c-23.8 23.8-23.8 62.3 0 86L587.3 512 264.7 834.6c-23.8 23.8-23.8 62.3 0 86l21.4 21.5c23.8 23.8 62.3 23.8 86.1 0L759.3 555c23.8-23.7 23.8-62.3 0-86z" fill="#999"></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="flex mt5 w-all ai-c">
      <div v-for="item in ['日', '一', '二', '三', '四', '五', '六']" style="min-width:14%" class="flex-1 pp10  ai-c jc-c">{{item}}</div>
    </div>

    <div class="flex w-all fw">
      <div @click="onSelectDate(item)" v-for="item in path" style="min-width:14%" class="flex-1 pp10 rel hand flex ai-c jc-c ">
        <div class="w-all h-all zi-120 flex ai-c jc-c rel" :class="{'fc-fff':item.isNowDay&&item.select!=4,[overfc]:item.select==4}">
          <slot :item="item">{{item.value}}</slot>
        </div>
        <!-- <slot><span  class="rel zi-120">{{item.value}}</span></slot> -->
        <span v-if="item.isNowDay&&item.select!=4" class="abs absc w-35 h-35 bc-primary inline-block ra-50 fc-fff"></span>
      </div>
    </div>
  </section>
</template>

<script setup lang='ts'>
import formatDate from '@lib/dateFormat';
import { isArray, isNumber } from '@lib/lang';
import { computed, reactive, ref, watch, watchEffect } from 'vue';
const ps = defineProps({
  // 日期格式化
  format: { type: String, default: "yyyy-MM-dd" },
  // 除在这个区间内的时间都不能选
  // 当为number且显示两个时间时 已第一个时间前后范围内的时间区间 如30 在选择第一个时间的前30天，或后30天内选择
  // 当为string start&&end start||end 如 2016-02-02&&2016-05-02  && 两个时间内可选，||两个时间外可选
  // 当为string start> 或<start 前后都可以 如 2016-02-02>  >2016-02-02， 表示大于给定日期之后的日期可选，反之小于也是同理
  // 当为Array ['2016-02-02','2016-02-01'] 指定时间不可选
  // section="2023-02-07&&2023-02-18" section="[2023-02-07,2023-02-18]" section="30"
  section: { type: [Array, Number, String], default: "" },
  class: { type: String, default: "" },
  // 不在当前月份日期字体样式
  overfc: { type: String, default: "fc-ddd" },
  style: { type: String, default: "" }
})
const mv = defineModel({ type: [String, Number, Object], default: "" });
const emit = defineEmits(["change"]);

const weekList = ['日', '一', '二', '三', '四', '五', '六'];
const monthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const info = reactive({ year: "", month: "", date: "", value: mv.value })

watchEffect(() => {
  initDate()
})

function onSelectDate(item) {
  if (item.select == 4) return;
  mv.value = formatDate(item.date, ps.format);
  info.value = formatDate(item.date, ps.format);
  let curr = formatDate(`${info.year}-${info.month + 1}-${info.date}`)
  emit('change', { month: curr.split('-')[1], date: info.value.split('-')[2], year: curr.split('-')[0], value: info.value, type: 'click' })
}

function initDate() {
  let date = mv.value && new Date(mv.value) || new Date();
  info.year = date.getFullYear();
  info.month = date.getMonth();
  info.date = date.getDate();
  date = null;
}

watch(() => mv.value, (news, old) => {
  if (news) {
    info.year = new Date(news).getFullYear();
    info.month = new Date(news).getMonth();
  }
})

const path = computed(() => {
  // monthData
  let [year, month] = [new Date().getFullYear(), new Date().getMonth()];
  if (mv.value) {
    year = info.year;
    month = info.month;
  }

  // 本月1号的时间对象
  let firstMonthDate = new Date(year, month, 1);
  // 本月1号星期几
  let week = firstMonthDate.getDay();
  // 第一个时间
  let firstDate = firstMonthDate - week * 60 * 60 * 1000 * 24;

  return Array.from(new Array(42).keys()).map(v => {
    let date = formatDate(new Date(firstDate + v * 60 * 60 * 1000 * 24));
    // 1 未选中,2 区间选中,3 当前选中值, 4其它月份值与不可选值
    let select = 1;
    // 不在当前月分 不可选

    if (date.substr(0, 7) != formatDate(`${info.year}-${info.month + 1}-01`).substr(0, 7)) {
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

    return {
      date,
      value: Number(date.split('-').pop()),
      isNowDay: formatDate(date) == formatDate(mv.value) ? true : false,
      select
    }
  })
})

// 上一页，下一页 月份
function changeMonth(type) {
  let date = new Date(`${info.year}-${info.month + 1}-1`);
  if (type == 'prev') {
    if (info.month) {
      info.month = new Date(date.setMonth(date.getMonth() - 1)).getMonth()
    } else {
      info.month = 11;
      info.year = info.year - 1;
    }
  } else {
    if (info.month == 11) {
      info.month = 0;
      info.year = info.year + 1;
    } else {
      info.month = new Date(date.setMonth(date.getMonth() + 1)).getMonth()
    }
  }
  let curr = formatDate(`${info.year}-${info.month + 1}-${info.date}`)
  mv.value = curr;
  let select = path.value.find(v => v.date == curr)?.select;

  emit('change', { month: curr.split('-')[1], year: curr.split('-')[0], value: curr, type: 'next', select })
}

</script>

<style lang='less'>
</style>