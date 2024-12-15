<template>
  <section ref="times" @click="onKey" @mouseover="changeMouse(1)" @mouseleave="changeMouse(0)" :class="mainclass" class="flex __carder ai-c rel">
    <input :class="{...inputClass,'centers':twin}" :value="path.start" @input="changeInput" ariaValueText="start" style="color:inherit" class="bc-t w-all flex-1 fs-init h-all flex ai-c" :placeholder="holder.start" autocomplete="off" type="text">
    <span class="ml5 mr5" v-if="twin">{{separator}}</span>
    <input v-if="twin" :class="{...inputClass,'centers':twin}" :value="path.end" @input="changeInput" ariaValueText="end" style="color:inherit" class="bc-t w-all flex-1 fs-init h-all flex ai-c" :placeholder="holder.end" autocomplete="off" type="text">
    <!-- 后置ICON -->
    <div :class="inputClass" class="h-all flex-line ai-c">
      <!-- 下标图片 -->
      <svg v-if="!info.isClose" :class="{'arrow':info.visible}" class=" wi-18 mr3 hi-18" viewBox="0 0 1024 1024">
        <path
          d="M874.291209 149.9136C777.540276 53.256533 648.960009 0 512.119476 0 375.321609 0 246.724276 53.256533 150.016009 149.930667 53.273609 246.6304 9.0e-06 375.227733 9.0e-06 512c-0.0256 136.797867 53.205333 265.352533 149.9392 362.120533C246.630409 970.734933 375.244809 1024 512.025609 1024c136.840533 0 265.4976-53.2992 362.2656-149.981867C1073.928543 674.414933 1073.962676 349.602133 874.291209 149.9136L874.291209 149.9136 874.291209 149.9136zM827.093343 826.8288c-84.155733 84.1216-196.0448 130.491733-315.067733 130.491733-118.9376 0-230.801067-46.353067-314.9056-130.389333C113.024009 742.8352 66.713609 630.9888 66.739209 512c0-118.971733 46.327467-230.826667 130.449067-314.897067C281.309876 113.024 393.139209 66.730667 512.119476 66.730667c118.9888 0 230.8352 46.293333 314.973867 130.3808C1000.729609 370.7392 1000.729609 653.2608 827.093343 826.8288L827.093343 826.8288 827.093343 826.8288zM733.422943 637.474133 556.390409 535.125333 556.390409 256c0-23.552-19.114667-42.666667-42.683733-42.666667-23.552 0-42.666667 19.106133-42.666667 42.666667l0 298.6752c0 15.829333 19.677867 29.098667 32.477867 36.437333 3.541333 5.3248 13.269333 10.154667 19.208533 13.568l176.0512 106.6752c20.394667 11.767467 42.504533 4.770133 54.280533-15.616C764.834143 675.328 753.868809 649.258667 733.422943 637.474133L733.422943 637.474133 733.422943 637.474133zM733.422943 637.474133"
          p-id="26005" fill="#dbdbdb"></path>
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
      <article :style="contentStyle" ref="timeBox" v-show="info.visible" class="abs bc-fff zi-8888 _selects_dropdown fc-333 ra-5">
        <div class="flex fd-c">
          <div class="flex bb-e">
            <div class="w-180">
              <div v-if="twin" class="w-all mt10 bb-e fs-14 pb10 flex ai-c jc-c">
                <span class="pr5 fc-ccc">开始时间</span>
                <span>{{sTime.hour||'--'}}</span>
                <span v-if="format=='mm'||format=='ss'||format===true">:{{sTime.minute||'--'}}</span>
                <span v-if="format=='ss'||format===true">:{{sTime.second||'--'}}</span>
              </div>
              <div class="flex ai-c fs-12 fc-999 pt5 w-180">
                <span class="flex-1 centers">时</span>
                <span class="flex-1 centers">分</span>
                <span class="flex-1 centers">秒</span>
              </div>
              <div class="w-180 pl5 pr5 flex h-200">
                <scroll @scroll="e=>scrolls(e,'start',1)" :auto="sTime.hto" class="h-200">
                  <div @click.stop="onSelect(item,'1','start')" class="flex ai-c jc-c time hand h-33" :class="item.cls" v-for="item in startPath.hour">{{item.value}}</div>
                </scroll>
                <scroll v-if="format=='mm'||format=='ss'||format===true" @scroll="e=>scrolls(e,'start',2)" :auto="sTime.mto" class="h-200">
                  <div @click.stop="onSelect(item,'2','start')" class="flex ai-c jc-c time hand h-33" :class="item.cls" v-for="item in startPath.minute">{{item.value}}</div>
                </scroll>
                <scroll v-if="format=='ss'||format===true" @scroll="e=>scrolls(e,'start',3)" :auto="sTime.sto" class="h-200">
                  <div @click.stop="onSelect(item,'3','start')" class="flex ai-c jc-c time hand h-33" :class="item.cls" v-for="item in startPath.second">{{item.value}}</div>
                </scroll>
              </div>
            </div>
            <div v-if="twin" style="border-left:1px solid #ddd" class="w-180">
              <div class="w-all mt10 bb-e pb10 flex fs-14 ai-c jc-c">
                <span class="pr5 fc-ccc">结束时间</span>
                <span>{{eTime.hour||'--'}}</span>
                <span v-if="format=='mm'||format=='ss'||format===true">:{{eTime.minute||'--'}}</span>
                <span v-if="format=='ss'||format===true">:{{eTime.second||'--'}}</span>
              </div>
              <div class="flex ai-c fs-12 fc-999 pt5 w-180">
                <span class="flex-1 centers">时</span>
                <span class="flex-1 centers">分</span>
                <span class="flex-1 centers">秒</span>
              </div>
              <div class="w-180 pl5 pr5 flex h-200">
                <scroll @scroll="e=>scrolls(e,'end',1)" :auto="eTime.hto" class="h-200">
                  <div @click.stop="onSelect(item,'1','end')" class="flex ai-c jc-c hand time h-33" :class="item.cls" v-for="item in endPath.hour">{{item.value}}</div>
                </scroll>
                <scroll v-if="format=='mm'||format=='ss'||format===true" @scroll="e=>scrolls(e,'end',2)" :auto="eTime.mto" class="h-200">
                  <div @click.stop="onSelect(item,'2','end')" class="flex ai-c jc-c hand time h-33" :class="item.cls" v-for="item in endPath.minute">{{item.value}}</div>
                </scroll>
                <scroll v-if="format=='ss'||format===true" @scroll="e=>scrolls(e,'end',3)" :auto="eTime.sto" class="h-200">
                  <div @click.stop="onSelect(item,'3','end')" class="flex ai-c jc-c hand time h-33" :class="item.cls" v-for="item in endPath.second">{{item.value}}</div>
                </scroll>
              </div>
            </div>
          </div>
          <div class="w-all flex pr10 h-35 ai-c jc-e">
            <div @click.stop="info.visible=false" class="mr10 hand">取消</div>
            <div @click.stop="changeTime()" class="fs-16 fb hand fc-primary pp5">确定</div>
          </div>
        </div>
      </article>
    </transition>
  </section>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, reactive, ref, watchEffect } from 'vue';
import scroll from './scroll.vue';
const ps = defineProps({
  separator: { type: String, default: "-" },
  class: { type: String, default: "" },
  startPlaceholder: { type: String, default: "开始时间" },
  endPlaceholder: { type: String, default: "结束时间" },
  // 结束时间值
  end: { type: String, default: "00:00:00" },
  // 输入框大小
  size: { type: String, default: "small" },
  // hh:只选时， mm:[hh:mm] ss||true [hh:mm:ss] 四种类型，
  format: { type: [String, Boolean], default: true },
  // 是否显示两个时间选择
  twin: { type: Boolean, default: false },
  // 结果时间限制
  // '00:02:05' 为只限定结束时间
  section: { type: [Array, String], default: "" },
  disabled: { type: Boolean, default: false },
  // 是否有清空图标
  clear: { type: Boolean, default: true },
  placeholder: { type: String, default: "请选择时间" },
  // 清空一切样式，使用定义样式
  border: { type: Boolean, default: true },
})

// modelValue v-model="value"
const mvalue = defineModel({ type: [String, Number, Object], default: "" });
// end v-model:end="value"
const ends = defineModel('end', { type: [String, Number, Object], default: "" });
//change 事件
const emit = defineEmits(["change"]);

const hours = Array.from(new Array(24).keys()).map(v => { return v < 10 ? ('0' + v) : v.toString() })
const minutes = Array.from(new Array(60).keys()).map(v => { return v < 10 ? ('0' + v) : v.toString() })
const seconds = Array.from(new Array(60).keys()).map(v => { return v < 10 ? ('0' + v) : v.toString() })

const times = ref(null)
const timeBox = ref(null)

const path = computed(() => {
  return {
    start: mvalue.value,
    end: ends.value
  }
})

const holder = computed(() => {
  if (ps.twin) {
    return {
      start: ps.startPlaceholder || ps.placeholder,
      end: ps.endPlaceholder || ps.placeholder
    }
  } else {
    return {
      start: ps.placeholder
    }
  }
})

const sTime = reactive({
  hour: "",
  minute: "",
  second: "",
  value: "",
  hto: 0,
  mto: 0,
  sto: 0
})
const eTime = reactive({
  hour: "",
  minute: "",
  second: "",
  value: "",
  hto: 0,
  mto: 0,
  sto: 0
})

const info = reactive({
  // 是否打下拉开选
  visible: false,
  // 是否获得焦点，后高亮显示框
  isBlur: false,
  // 是否显示关闭按钮
  isClose: false,
  // 初始化弹框位置从底部向下弹出
  trans: 'selectbottom',
})

const options: any = reactive({
  myHeight: 0,//输入框高度
  myWidth: 0,//选中值高度,
  tipWidth: 0,
  tipHeight: 0,
  screenHeight: 0,
  screenWidth: 0,
  myTop: 0,
  mainWidth: 0 //select组件最终宽度
})

function changeInput(e) {
  let { value, ariaValueText } = e.target as HTMLInputElement;
  let curr = value.replace(/[^\d:]/g, '').split(':')
  if (ariaValueText == 'start') {
    if (curr.length == 3 && (Number(curr[0]) + Number(curr[1]) + Number(curr[2])) <= 141) {
      mvalue.value = curr.map(v => { return v.toString().length < 2 ? ('0' + v) : v.toString() }).join(':');
    }
  } else {
    if (curr.length == 3 && (Number(curr[0]) + Number(curr[1]) + Number(curr[2])) <= 141) {
      ends.value = curr.map(v => { return v.toString().length < 2 ? ('0' + v) : v.toString() }).join(':');
    }
  }
}

function changeClose() {
  mvalue.value = "";
  ends.value = "";
  emit("change", { value: "", end: "" })
}

watchEffect(() => {
  if (mvalue.value) {
    sTime.hour = mvalue.value.split(':')[0]
    sTime.minute = mvalue.value.split(':')[1]
    sTime.second = mvalue.value.split(':')[2]
  } else {
    sTime.hour = ""
    sTime.minute = ""
    sTime.second = ""
  }
  if (ends.value) {
    eTime.hour = ends.value.split(':')[0]
    eTime.minute = ends.value.split(':')[1]
    eTime.second = ends.value.split(':')[2]
  } else {
    eTime.hour = ""
    eTime.minute = ""
    eTime.second = ""
  }
})

function onSelect(item, timeType, type) {
  if (item.dis) return;
  if (type == 'start') {
    if (timeType == 1) {
      sTime.hour = item.value;
      eTime.hour = "";
      eTime.minute = "";
      eTime.second = "";
    }
    if (timeType == 2) {
      if (!sTime.hour) {
        sTime.hour = "00";
      }
      sTime.minute = item.value;
      eTime.minute = "";
      eTime.second = "";
    }
    if (timeType == 3) {
      if (!sTime.hour) {
        sTime.hour = "00";
      }
      if (!sTime.minute) {
        sTime.minute = "00";
      }
      sTime.second = item.value;
      eTime.second = "";
    }
  } else {
    if (item.dis) return;
    if (timeType == 1) {
      eTime.hour = item.value;
    }
    if (timeType == 2) {
      if (!eTime.hour) {
        eTime.hour = eTime.hour || "00";
      }
      eTime.minute = item.value;
    }
    if (timeType == 3) {
      if (!eTime.hour) {
        eTime.hour = sTime.hour || "00";
      }
      if (!eTime.minute) {
        eTime.minute = sTime.minute || "00";
      }
      eTime.second = item.value;
    }
  }
}

function scrolls(e, time, type) {
  if (time == 'start') {
    if (type == 1) {
      sTime.hto = 0;
    }
    if (type == 2) {
      sTime.mto = 0;
    }
    if (type == 3) {
      sTime.sto = 0;
    }
  } else {
    if (type == 1) {
      eTime.hto = 0;
    }
    if (type == 2) {
      eTime.mto = 0;
    }
    if (type == 3) {
      eTime.sto = 0;
    }
  }
}

const startPath = computed(() => {
  let sHour = "";
  let sMinute = "";
  let sSecond = "";
  let eHour = "";
  let eMinute = "";
  let eSecond = "";
  if (ps.section) {
    if (typeof ps.section == "object") {
      sHour = ps.section[0]?.split(':')[0] || "";
      sMinute = ps.section[0]?.split(':')[1] || "";
      sSecond = ps.section[0]?.split(':')[2] || "";

      eHour = ps.section[1]?.split(':')[0] || "";
      eMinute = ps.section[1]?.split(':')[1] || "";
      eSecond = ps.section[1]?.split(':')[2] || "";
    } else {
      eHour = ps.section?.split(':')[0] || "";
      eMinute = ps.section?.split(':')[1] || "";
      eSecond = ps.section?.split(':')[2] || "";
    }
  }

  return {
    hour: hours.map(v => {
      let cls = "fc-777";
      if (v === sTime.hour) {
        cls = "fc-primary fb"
      }
      if (sHour && v < sHour) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      if (eHour && v > eHour) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      return { value: v, dis: false, cls }
    }),
    minute: minutes.map(v => {
      let cls = "fc-777";
      if (v === sTime.minute) {
        cls = "fc-primary fb"
      }
      if (sHour && sMinute && `${sHour}${sMinute}` > `${sHour}${v}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      if (eHour && eMinute && `${eHour}${eMinute}` < `${eHour}${v}` && eHour == sTime.hour) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      return { value: v, dis: false, cls }
    }),
    second: seconds.map(v => {
      let cls = "fc-777";
      if (v === sTime.second) {
        cls = "fc-primary fb"
      }
      if (sHour && sMinute && sSecond && `${sHour}${sMinute}${sSecond}` > `${sHour}${sMinute}${v}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      if (eHour && eMinute && eSecond && `${eHour}${eMinute}${eSecond}` < `${eHour}${eMinute}${v}` && `${sTime.hour}${sTime.minute}` >= `${eHour}${eMinute}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      return { value: v, dis: false, cls }
    })
  }
})


const endPath = computed(() => {
  let sHour = "";
  let sMinute = "";
  let sSecond = "";
  let eHour = "";
  let eMinute = "";
  let eSecond = "";
  if (ps.section) {
    if (typeof ps.section == "object") {
      sHour = ps.section[0]?.split(':')[0] || "";
      sMinute = ps.section[0]?.split(':')[1] || "";
      sSecond = ps.section[0]?.split(':')[2] || "";

      eHour = ps.section[1]?.split(':')[0] || "";
      eMinute = ps.section[1]?.split(':')[1] || "";
      eSecond = ps.section[1]?.split(':')[2] || "";
    } else {
      eHour = ps.section?.split(':')[0] || "";
      eMinute = ps.section?.split(':')[1] || "";
      eSecond = ps.section?.split(':')[2] || "";
    }
  }

  return {
    hour: hours.map(v => {
      let cls = "fc-777";
      if (v === eTime.hour) {
        cls = "fc-primary fb"
      }
      if (sHour && v < sHour) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      if (eHour && v > eHour) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      if (sTime.hour && v < sTime.hour) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }
      return { value: v, dis: false, cls }
    }),
    minute: minutes.map(v => {
      let cls = "fc-777";
      if (v.toString() === eTime.minute) {
        cls = "fc-primary fb"
      }

      if (sHour && sMinute && `${sHour}${sMinute}` > `${sHour}${v}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }

      if (eHour && eMinute && `${eHour}${v}` > `${eHour}${eMinute}` && eHour == eTime.hour) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }

      if (sTime.hour && sTime.minute && eTime.hour && `${eTime.hour}${v}` < `${sTime.hour}${sTime.minute}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }

      return { value: v, dis: false, cls }
    }),
    second: seconds.map(v => {
      let cls = "fc-777";
      if (v === eTime.second) {
        cls = "fc-primary fb"
      }

      if (sHour && sMinute && sSecond && `${sHour}${sMinute}${sSecond}` > `${sHour}${sMinute}${v}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }

      if (eHour && eMinute && eSecond && `${eHour}${eMinute}${v}` > `${eHour}${eMinute}${eSecond}` && `${eHour}${eMinute}` == `${eTime.hour}${eTime.minute}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }

      if (sTime.hour && sTime.minute && sTime.second && `${eTime.hour}${eTime.minute}${v}` < `${sTime.hour}${sTime.minute}${sTime.second}`) {
        return { value: v, dis: true, cls: 'fc-ddd' }
      }

      return { value: v, dis: false, cls }
    })
  }
})

function changeTime(clear) {
  info.visible = false;
  if (clear) {
    return ""
  } else {
    let hour = eTime.hour || sTime.hour || '00';

    let minute = eTime.minute;
    if (!minute) {
      if (sTime.hour && eTime.hour && eTime.hour == sTime.hour) {
        minute = sTime.minute
      } else if (!eTime.minute && sTime.minute) {
        minute = sTime.minute
      }
      else {
        minute = "00"
      }
    }

    let second = eTime.second;
    if (!second) {
      if (hour + minute == sTime.hour + sTime.minute) {
        second = sTime.second
      } else if (!eTime.second && sTime.second) {
        second = sTime.second
      }
      else {
        second = "00"
      }
    }
    let start = `${sTime.hour || '00'}`;
    // let end = `${hour}:${minute}:${second}`;
    let end = `${hour < sTime.hour ? sTime.hour : hour}`;
    if (ps.format == 'mm') {
      start = start + `:${sTime.minute || '00'}`;
      end = end + `:${minute}`;
    }

    if (ps.format == 'ss' || ps.format === true) {
      start = start + `:${sTime.minute || '00'}:${sTime.second || '00'}`;
      end = end + `:${minute}:${second || '00'}`;
    }
    mvalue.value = start;
    ends.value = end;
    emit("change", { value: start, end })
  }
}

function onKey(e) {
  if (ps.disabled) return;
  info.visible = !info.visible;

  if (info.visible) {
    options.mainWidth = times.value?.getBoundingClientRect().width
    options.myHeight = times.value?.getBoundingClientRect().height
    options.myTop = times.value?.getBoundingClientRect().top;
    options.myLeft = times.value?.getBoundingClientRect().left;

    if (ps.serch || ps.lazy) {
      info.isSerch = true;
    }
    nextTick(() => {
      options.tipHeight = timeBox.value?.getBoundingClientRect().height;
      options.tipWidth = timeBox.value?.getBoundingClientRect().width;
      nextTick(() => {
        if (options.myHeight + options.myTop + options.tipHeight > options.screenHeight) {
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
  if (!times.value?.contains(e.target)) {
    info.visible = false;
    info.isBlur = false;
    document.removeEventListener('click', setSelectPop)
  } else {
    info.isBlur = true;
  }
}

onMounted(() => {
  nextTick(() => {
    // 可见屏高
    options.screenHeight = document.body.getBoundingClientRect().height;
    // 可见屏宽
    options.screenWidth = document.body.getBoundingClientRect().width;
    // 选择框的高度
    options.myHeight = times.value?.getBoundingClientRect().height;
    // 选择框的宽度
    options.myWidth = times.value?.getBoundingClientRect().width;
    options.mainWidth = times.value?.getBoundingClientRect().width;
    options.myTop = times.value?.getBoundingClientRect().top;
    options.myLeft = times.value?.getBoundingClientRect().left;
  })
})

const inputClass = computed(() => {
  let curr = [];
  if (['small', 'big'].includes(ps.size)) {
    curr.push(ps.size == 'small' ? 'hi-32' : 'hi-38')
  }
  return curr.join(' ')
})

const contentStyle = computed(() => {
  // 初始化下拉选择框
  let styles = {
    // minWidth: options?.mainWidth + 'px',
    top: options?.myHeight + 2 + 'px',
    left: '0px'
  }

  if (ps.width) {
    styles.width = ps.width;
  }

  let contentHeight = options?.tipHeight;

  // 如果弹框超出屏高
  // console.log(options?.myTop + options?.myHeight + contentHeight,options?.screenHeight);

  if ((options?.myTop + options?.myHeight + contentHeight) > options?.screenHeight) {
    styles.top = 0 - contentHeight - options.myHeight + 'px';
  }

  // 如果弹框超出屏宽


  if ((options?.tipWidth) + options?.myLeft > options?.screenWidth) {
    delete styles.left;
    styles.right = 0;
  } else {
    styles.left = 0;
  }

  return styles
})

function changeMouse(type) {
  if (type) {
    if (ps.clear && String(mvalue.value)) {
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
</script>

<style lang='less'>
</style>