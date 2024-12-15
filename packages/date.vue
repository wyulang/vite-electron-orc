<template>
  <div ref="dateMain" :class="bodyClass" class="b-d ra-4 noselect _date rel w-all">
    <div id="dateInput" @mouseover="mainOver" @mouseout="mainOut" @click="initDatePop" class="flex ai-c ra-4 hidden pp3 h-all w-all">
      <input :class="{'inputover':sDay.isOver}" ariaValueText="start" :value="currStartDate" :placeholder="twin?startPlaceholder:placeholder" @mousemove="movesDay('star')" @input="inputStartValue" @mouseout="outDay('star')" class="pl8 ra-4 pr8 fs-init fc-inherit bc-t flex-1 w-all h-all" type="text">
      <span v-if="twin">{{separator}}</span>
      <input v-if="twin" :class="{'inputover':eDay.isOver}" ariaValueText="end" :value="endStartDate" :placeholder="endPlaceholder" @mousemove="movesDay('end')" @mouseout="outDay('end')" @input="inputStartValue" class="pl8 ra-4 pr8 fs-init fc-inherit flex-1 bc-t w-all h-all" type="text">
      <div v-if="isIcon" class="w-17 hand ml3 mr6 h-17">
        <svg style="fill:#ccc" v-if="info.isClear" @click.stop="changeDateValue(true)" class="abs w-22 h-22 ar5 hand iconfix close abst" viewBox="0 0 1024 1024">
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

    <div v-if="info.visible" ref="layDate" :style="bodyDate" class="abs bc-fff zi-8888 flex-line sha-6">
      <!-- 开始时间 -->
      <div class="w-274 fc-333">
        <!-- 分页 -->
        <div class="w-all mt4 flex ai-c jc-b">
          <!-- 左分页 -->
          <div class="flex ai-c">
            <div @click="changeYear('prev','start')" class="pl15 pr10 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path
                  d="M239.9 512l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L101.5 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L239.9 512z m404.7 0l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L506.1 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L644.6 512z"
                  fill="#999"></path>
              </svg>
            </div>
            <div @click="changeMonth('prev','start')" class="pl5 pr5 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path d="M264.7 555l387.1 387.2c23.7 23.8 62.3 23.8 86.1 0l21.4-21.5c23.8-23.8 23.8-62.3 0-86L436.7 512l322.6-322.6c23.8-23.8 23.8-62.3 0-86l-21.4-21.5c-23.8-23.8-62.3-23.8-86.1 0L264.7 469c-23.8 23.7-23.8 62.3 0 86z" fill="#999"></path>
              </svg>
            </div>
          </div>

          <div @click="onYear(true)" class="flex yearHover ra-4 pl10 pr10 hand h-28 lh-28 centers ai-c">
            {{sDay.nextYear}}年 {{sDay.nextMonth+1}}月
          </div>
          <!-- 右分页 -->
          <div class="flex ai-e">
            <div @click="changeMonth('next','start')" class="pl5 pr5 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path d="M759.3 469L372.2 81.8c-23.7-23.8-62.3-23.8-86.1 0l-21.4 21.5c-23.8 23.8-23.8 62.3 0 86L587.3 512 264.7 834.6c-23.8 23.8-23.8 62.3 0 86l21.4 21.5c23.8 23.8 62.3 23.8 86.1 0L759.3 555c23.8-23.7 23.8-62.3 0-86z" fill="#999"></path>
              </svg>
            </div>
            <div @click="changeYear('next','start')" class="pr15 pl10 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path
                  d="M784.1 512L485.2 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L784.1 512z m-404.7 0L80.5 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L379.4 512z"
                  fill="#999"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- 周 -->
        <div class="w-all pl10 pr10 flex">
          <div v-for="item in weeks" class="w-36 bb-e fw-6 h-36 fs-12 fc-888 flex ai-c mb6 jc-c">{{item}}</div>
        </div>

        <!-- 日 -->
        <div class="flex pl10 pr10 w-all fw">
          <div v-for="item in startPath" :class="item.className" @mouseover="onOver(item)" @mouseout="onOut(item)" @click="onSetDay(item)" class="w-36 fs-14 mb2 h-36 flex ai-c jc-c">
            {{item.value}}
          </div>
        </div>

        <!-- 时间 -->
        <div v-if="time" class="flex bt-e ai-c">
          <div @click="onTime(true)" class="flex-1 flex ai-c hand pp10">
            <svg t="1708672032682" class="w-19 h-19" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M512.975376 960.853454c-247.926057 0-448.889579-200.963522-448.889579-448.889579C64.085797 264.110068 265.049319 63.146546 512.975376 63.146546c247.853807 0 448.817329 200.963522 448.817328 448.817329 0 247.926057-200.963522 448.889579-448.817328 448.889579z m0-841.568617c-216.966909 0-392.751288 175.784379-392.751288 392.679038 0 216.894659 175.784379 392.751288 392.751288 392.751288 216.894659 0 392.679038-175.892754 392.679037-392.751288 0-216.894659-175.784379-392.679038-392.679037-392.679038z m280.51083 420.784309v-56.138292h56.138291v56.138292h-56.138291z m-78.644182 201.758272l-39.665279-39.665279 39.665279-39.665279 39.665279 39.665279-39.665279 39.665279z m-31.392648-446.577577l38.798278-38.978903 38.798278 38.978903-38.798278 38.870529-38.798278-38.870529z m-198.579271 497.297114h56.138291v56.029917h-56.138291v-56.029917z m28.105271-251.863684H260.533691c-15.569886 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.535384-28.105271 28.105271-28.10527h224.372539V203.456149c0-15.569886 12.535384-28.105271 28.105271-28.105271 15.461511 0 28.033021 12.535384 28.03302 28.105271v309.230227a28.058308 28.058308 0 0 1-28.069145 27.996895zM256.704438 296.586467l39.665279-39.665279L336.034996 296.586467 296.369717 336.251746 256.704438 296.586467z m73.911804 407.092923l-38.798278 38.870529-38.870529-38.870529L291.817964 664.700487l38.798278 38.978903z"
                fill="#231815"></path>
            </svg>
            <span class="fs-16 mt1 ml10 fb">{{sDay.hour}}:{{sDay.minute}}:{{sDay.second}}</span>
          </div>
          <div v-if="!twin" class="flex-1 flex jc-e pr10">
            <div @click="onSetCurrTime" class=" h-28 flex-line ml10 w-50 ai-c jc-c hand fs-13 fb">此刻</div>
            <div @click="onSaveTime" class=" h-28 flex-line ml10 w-50 ai-c jc-c hand fc-primary bc-f6 fs-13 fb">确定</div>
          </div>
        </div>
      </div>

      <!-- 结束时间 -->
      <div v-if="twin" class="bl-d w-274 fc-333">
        <!-- 分页 -->
        <div class="w-all mt4 flex ai-c jc-b">
          <!-- 左分页 -->
          <div class="flex ai-c">
            <div @click="changeYear('prev','end')" class="pl15 pr10 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path
                  d="M239.9 512l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L101.5 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L239.9 512z m404.7 0l298.9-301.7c22-22.2 22-58.2 0-80.4l-19.9-20.1c-22-22.2-57.7-22.2-79.7 0L506.1 450.7l-1 1-19.9 20.2c-22 22.1-22 58.2 0 80.4l19.9 20.1 0.4 0.4 338.3 341.5c22 22.2 57.7 22.2 79.7 0l19.9-20.1c22-22.2 22-58.3 0-80.5L644.6 512z"
                  fill="#999"></path>
              </svg>
            </div>
            <div @click="changeMonth('prev','end')" class="pl5 pr5 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path d="M264.7 555l387.1 387.2c23.7 23.8 62.3 23.8 86.1 0l21.4-21.5c23.8-23.8 23.8-62.3 0-86L436.7 512l322.6-322.6c23.8-23.8 23.8-62.3 0-86l-21.4-21.5c-23.8-23.8-62.3-23.8-86.1 0L264.7 469c-23.8 23.7-23.8 62.3 0 86z" fill="#999"></path>
              </svg>
            </div>
          </div>

          <div @click="onYear(false)" class="flex yearHover ra-4 pl10 pr10 hand h-28 lh-28 centers ai-c">
            {{eDay.nextYear}}年 {{eDay.nextMonth+1}}月
          </div>
          <!-- 右分页 -->
          <div class="flex ai-e">
            <div @click="changeMonth('next','end')" class="pl5 pr5 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path d="M759.3 469L372.2 81.8c-23.7-23.8-62.3-23.8-86.1 0l-21.4 21.5c-23.8 23.8-23.8 62.3 0 86L587.3 512 264.7 834.6c-23.8 23.8-23.8 62.3 0 86l21.4 21.5c23.8 23.8 62.3 23.8 86.1 0L759.3 555c23.8-23.7 23.8-62.3 0-86z" fill="#999"></path>
              </svg>
            </div>
            <div @click="changeYear('next','end')" class="pr15 pl10 hand">
              <svg viewBox="0 0 1024 1024" class="w-12 h-12">
                <path
                  d="M784.1 512L485.2 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L784.1 512z m-404.7 0L80.5 813.7c-22 22.2-22 58.2 0 80.4l19.9 20.1c22 22.2 57.7 22.2 79.7 0l337.7-340.9 1-1 19.9-20.2c22-22.1 22-58.2 0-80.4l-19.9-20.1-0.4-0.4-338.3-341.5c-22-22.2-57.7-22.2-79.7 0l-19.9 20.1c-22 22.2-22 58.3 0 80.5L379.4 512z"
                  fill="#999"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- 周 -->
        <div class="w-all pl10 pr10 flex">
          <div v-for="item in weeks" class="w-36 bb-e fw-6 h-36 fs-12 fc-888 flex ai-c mb6 jc-c">{{item}}</div>
        </div>

        <!-- 日 -->
        <div class="flex pl10 pr10 w-all fw">
          <div v-for="item in endPath" :class="item.className" @mouseover="onOver(item)" @mouseout="onOut(item)" @click="onSetDay(item)" class="w-36 fs-14 h-36 mb2 flex ai-c jc-c">
            {{item.value}}
          </div>
        </div>

        <!-- 时间 -->
        <div v-if="time" class="flex bt-e ai-c">
          <div @click="onTime(false)" class="flex-1 flex ai-c hand pp10">
            <svg t="1708672032682" class="w-19 h-19" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M512.975376 960.853454c-247.926057 0-448.889579-200.963522-448.889579-448.889579C64.085797 264.110068 265.049319 63.146546 512.975376 63.146546c247.853807 0 448.817329 200.963522 448.817328 448.817329 0 247.926057-200.963522 448.889579-448.817328 448.889579z m0-841.568617c-216.966909 0-392.751288 175.784379-392.751288 392.679038 0 216.894659 175.784379 392.751288 392.751288 392.751288 216.894659 0 392.679038-175.892754 392.679037-392.751288 0-216.894659-175.784379-392.679038-392.679037-392.679038z m280.51083 420.784309v-56.138292h56.138291v56.138292h-56.138291z m-78.644182 201.758272l-39.665279-39.665279 39.665279-39.665279 39.665279 39.665279-39.665279 39.665279z m-31.392648-446.577577l38.798278-38.978903 38.798278 38.978903-38.798278 38.870529-38.798278-38.870529z m-198.579271 497.297114h56.138291v56.029917h-56.138291v-56.029917z m28.105271-251.863684H260.533691c-15.569886 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.535384-28.105271 28.105271-28.10527h224.372539V203.456149c0-15.569886 12.535384-28.105271 28.105271-28.105271 15.461511 0 28.033021 12.535384 28.03302 28.105271v309.230227a28.058308 28.058308 0 0 1-28.069145 27.996895zM256.704438 296.586467l39.665279-39.665279L336.034996 296.586467 296.369717 336.251746 256.704438 296.586467z m73.911804 407.092923l-38.798278 38.870529-38.870529-38.870529L291.817964 664.700487l38.798278 38.978903z"
                fill="#231815"></path>
            </svg>
            <span class="fs-16 mt1 ml10 fb">{{eDay.hour}}:{{eDay.minute}}:{{eDay.second}}</span>
          </div>
          <div class="flex-1 flex jc-e pr10">
            <div @click="onSetCurrTime" class=" h-28 flex-line ml10 w-50 ai-c jc-c hand fs-13 fb">此刻</div>
            <div @click="onSaveTime" class=" h-28 flex-line ml10 w-50 ai-c jc-c hand fc-primary bc-f6 fs-13 fb">确定</div>
          </div>
        </div>
      </div>

      <!-- 年月选择 -->
      <div v-if="info.isYear" :class="{'al0':info.currYearType,'ar0':!info.currYearType}" class="abs w-272 at0 flex ab0 fd-c ra-4 bc-fff">
        <div class="pt10 pb10 bb-e">
          <div @click.stop="info.isYear=false" class=" h-28 flex-line ml10 pl10 pr20 hand ai-c fc-primary bc-f6 fs-13 fb">〈 返回选择日期</div>
        </div>

        <div class="flex flex-1 hidden">
          <div id="yearScoll" class="w-90 h-all auto noscoll">
            <div @click="onSetYear(item)" class="h-32 flex ai-c fc-333 br-e jc-c hand" :class="{'bc-f6 fc-primary ':(item==(info.currYearType?sDay.nextYear:eDay.nextYear))}" v-for="item in years">{{item}}</div>
          </div>
          <div id="monthScoll" class="w-90 h-all auto noscoll">
            <div @click="onSetMonth(item,i)" :class="{'bc-f6 fc-primary ':(i==(info.currYearType?sDay.nextMonth:eDay.nextMonth))}" class="h-32 flex fc-333 ai-c fs-14 br-e jc-c hand" v-for="item,i in months">{{item}}</div>
          </div>
        </div>
      </div>

      <!-- 时分秒选择 -->
      <div v-if="info.isTime" :class="{'al0':info.currYearType,'ar0':!info.currYearType}" class="abs w-272 at0 flex ab0 fd-c ra-4 bc-fff">
        <div class="pt10 pb10 bb-e">
          <div @click.stop="info.isTime=false" class=" h-28 flex-line ml10 pl10 pr20 hand ai-c fc-primary bc-f6 fs-13 fb">〈 返回选择日期</div>
        </div>
        <div class="flex flex-1  hidden">
          <div id="hourScoll" class="flex-1 h-all auto noscoll">
            <div @click="onSetTime(item,'hourScoll')" class="h-32 fc-333 flex ai-c br-e jc-c hand" :class="{'bc-f6 fc-primary ':(item==(info.currYearType?sDay.hour:eDay.hour))}" v-for="item in hours">{{item}}</div>
          </div>
          <div id="minuteScoll" class="flex-1 h-all auto noscoll">
            <div @click="onSetTime(item,'minuteScoll')" class="h-32 fc-333 flex ai-c br-e jc-c hand" :class="{'bc-f6 fc-primary ':(item==(info.currYearType?sDay.minute:eDay.minute))}" v-for="item in minutes">{{item}}</div>
          </div>
          <div id="secrodScoll" class="flex-1 h-all auto noscoll">
            <div @click="onSetTime(item,'secrodScoll')" class="h-32 fc-333 flex ai-c br-e jc-c hand" :class="{'bc-f6 fc-primary ':(item==(info.currYearType?sDay.second:eDay.second))}" v-for="item in minutes">{{item}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, computed, nextTick, watch, toRaw, watchEffect } from 'vue';
import formatDate, { refDate } from '@lib/dateFormat';
const ps = defineProps({
  separator: { type: String, default: "-" },
  class: { type: String, default: "" },
  startPlaceholder: { type: String, default: "开始日期" },
  endPlaceholder: { type: String, default: "结束日期" },
  // 输入框大小
  size: { type: String, default: "small" },
  // 是否显示 时分秒
  time: { type: Boolean, default: false },
  // 除在这个区间内的时间都不能选
  // 当为number且显示两个时间时 已第一个时间前后范围内的时间区间 如30 在选择第一个时间的前30天，或后30天内选择
  // 当为string start&&end start||end 如 2016-02-02&&2016-05-02  && 两个时间内可选，||两个时间外可选
  // 当为string start> 或<start 前后都可以 如 2016-02-02>  >2016-02-02， 表示大于给定日期之后的日期可选，反之小于也是同理
  // 当为Array ['2016-02-02','2016-02-01'] 指定时间不可选
  // section="2023-02-07&&2023-02-18" section="[2023-02-07,2023-02-18]" section="30"
  section: { type: [Array, Number, String], default: "" },
  // 是否显示两个时间选择
  twin: { type: Boolean, default: false },
  // 是否有清空图标
  clear: { type: Boolean, default: true },
  // 是否显示图标
  isIcon: { type: Boolean, default: true },
  placeholder: { type: String, default: "请选择日期" },
  // 日期格式化
  format: { type: String, default: "yyyy-MM-dd" },
  // 日期格式化
  labelformat: { type: String, default: "" },
  // 是否显示 时分秒
  disabled: { type: [Boolean, Number, String], default: false },
  // 当出现在某个position: absolute元素内，出现滚动条时，需要当前的div  dom
  dom: { type: String, default: "" },
  hoverColor: { type: String, default: "#f6f6f6" }
})

// modelValue v-model="value"
const mvalue = defineModel({ type: [String, Number, Object], default: "" });
// end v-model:end="value"
const end = defineModel('end', { type: [String, Number, Object], default: "" });
//change 事件
const emit = defineEmits(["change"]);

const weeks = ['日', '一', '二', '三', '四', '五', '六']
const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
// 时
const hours = Array.from(new Array(24).keys()).map(v => v < 10 ? ('0' + v) : v.toString())
// 分/秒
const minutes = Array.from(new Array(60).keys()).map(v => v < 10 ? ('0' + v) : v.toString())
const years = Array.from(new Array(200).keys()).map(v => 1919 + v);

const layDate = ref(null)
const dateMain = ref(null)

// 开始时间
let sDay = reactive({
  year: "", month: "", day: "", hour: "", minute: "", second: "",
  nextYear: new Date().getFullYear(),
  nextMonth: new Date().getMonth(),
  isDay: false, isTime: false, isOver: false,
  value: ""
})
// 结束时间
let eDay = reactive({
  year: "", month: "", day: "", hour: "", minute: "", second: "",
  nextYear: new Date(new Date().setMonth(new Date().getMonth() + 1)).getFullYear(),
  nextMonth: new Date(new Date().setMonth(new Date().getMonth() + 1)).getMonth(),
  isDay: false, isTime: false, isOver: false,
  value: ""
})

const info = reactive({
  // 鼠标经过日期
  overDay: "",
  isClear: false,
  visible: false,
  isFirstStart: true,
  clickInput: "start",
  // 年月选择，当前是开始，还是结束 true 开始
  currYearType: true,
  isYear: false,
  isTime: false,
})

const options = reactive({
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
})

const currStartDate = computed(() => {
  if (mvalue.value) {
    if (ps.labelformat) {
      return formatDate(mvalue.value, ps.labelformat)
    } else {
      if (ps.time) {
        return formatDate(mvalue.value, "yyyy-MM-dd hh:mm:ss")
      } else {
        return formatDate(mvalue.value, "yyyy-MM-dd")
      }
    }
  }
  return ""
})

const endStartDate = computed(() => {
  if (end.value) {
    if (ps.labelformat) {
      return formatDate(end.value, ps.labelformat)
    } else {
      if (ps.time) {
        return formatDate(end.value, "yyyy-MM-dd hh:mm:ss")
      } else {
        return formatDate(end.value, "yyyy-MM-dd")
      }
    }
  }
  return ""
})

function onSetCurrTime() {
  let curr = refDate(new Date());
  if (!sDay.value) {
    sDay.value = formatDate(new Date())
  }
  if (!eDay.value) {
    eDay.value = formatDate(new Date())
  }
  sDay.hour = curr[3]
  sDay.minute = curr[4]
  sDay.second = curr[5]
  eDay.hour = curr[3]
  eDay.minute = curr[4]
  eDay.second = curr[5]
  changeDateValue();
}

function onSaveTime() {
  if (!sDay.value) {
    sDay.value = formatDate(new Date())
  }
  if (!eDay.value) {
    eDay.value = formatDate(new Date())
  }
  changeDateValue()
}

function onTime(currTime) {
  info.currYearType = currTime;
  info.isTime = true;

  let hindex = hours.findIndex(v => v == (currTime ? sDay.hour.toString() : eDay.hour.toString()));
  let mindex = minutes.findIndex(v => v == (currTime ? sDay.minute.toString() : eDay.minute.toString()));
  let sindex = minutes.findIndex(v => v == (currTime ? sDay.second.toString() : eDay.second.toString()));

  nextTick(() => {
    document.getElementById('hourScoll').scrollTop = (hindex - 4) * 32 + 16;
    document.getElementById('minuteScoll').scrollTop = (mindex - 4) * 32 + 16;
    document.getElementById('secrodScoll').scrollTop = (sindex - 4) * 32 + 16;
  })
  // hourScoll minuteScoll secrodScoll
}

function onSetTime(value, dom) {
  let index = minutes.findIndex(v => v == value);
  if (info.currYearType) {
    if (dom == "hourScoll") {
      sDay.hour = value;
      index = hours.findIndex(v => v == value);
    }
    if (dom == "minuteScoll") {
      sDay.minute = value;
    }
    if (dom == "secrodScoll") {
      sDay.second = value;
    }
  } else {
    if (dom == "hourScoll") {
      eDay.hour = value;
      index = hours.findIndex(v => v == value);
    }
    if (dom == "minuteScoll") {
      eDay.minute = value;
    }
    if (dom == "secrodScoll") {
      eDay.second = value;
    }
  }
  document.getElementById(dom).scrollTop = (index - 4) * 32 + 16;
}

// 打开选择年月面板
function onYear(currYear) {
  info.currYearType = currYear;
  info.isYear = true;
  let index = years.findIndex(v => v == (currYear ? sDay.nextYear : eDay.nextYear));
  let mindex = months.findIndex((v, i) => i == (currYear ? sDay.nextMonth : eDay.nextMonth));

  nextTick(() => {
    let yearDom = document.getElementById('yearScoll');
    let monthDom = document.getElementById('monthScoll');
    yearDom.scrollTop = (index - 4) * 32 + 16;
    monthDom.scrollTop = (mindex - 4) * 32 + 16;
  })
}
// 年值设置
function onSetYear(value) {
  let index = years.findIndex(v => v == value);
  if (info.currYearType) {
    sDay.nextYear = value;
  } else {
    eDay.nextYear = value;
  }
  nextTick(() => {
    let yearDom = document.getElementById('yearScoll');
    yearDom.scrollTop = (index - 4) * 32 + 16;
  })
}
// 年值设置
function onSetMonth(value, i) {
  let index = months.findIndex(v => v == value);
  if (info.currYearType) {
    sDay.nextMonth = i;
  } else {
    eDay.nextMonth = i;
  }
  nextTick(() => {
    document.getElementById('monthScoll').scrollTop = (index - 4) * 32 + 16;
  })
}

function changeYear(type, isStar) {
  if (isStar == 'start') {
    if (type == "prev") {
      sDay.nextYear = sDay.nextYear - 1
    } else {
      sDay.nextYear = sDay.nextYear + 1
    }
  } else {
    if (type == "prev") {
      eDay.nextYear = eDay.nextYear - 1
    } else {
      eDay.nextYear = eDay.nextYear + 1
    }
  }
}

function changeMonth(type, isStar) {
  if (isStar == 'start') {
    if (type == "prev") {
      if (sDay.nextMonth) {
        sDay.nextMonth = sDay.nextMonth - 1
      } else {
        sDay.nextMonth = 11
        sDay.nextYear = sDay.nextYear - 1;
      }
    } else {
      if (sDay.nextMonth == 11) {
        sDay.nextMonth = 0;
        sDay.nextYear = sDay.nextYear + 1;
      } else {
        sDay.nextMonth = sDay.nextMonth + 1
      }
    }
  } else {
    if (type == "prev") {
      if (eDay.nextMonth) {
        eDay.nextMonth = eDay.nextMonth - 1
      } else {
        eDay.nextMonth = 11
        eDay.nextYear = eDay.nextYear - 1;
      }
    } else {
      if (eDay.nextMonth == 11) {
        eDay.nextMonth = 0;
        eDay.nextYear = eDay.nextYear + 1;
      } else {
        eDay.nextMonth = eDay.nextMonth + 1
      }
    }
  }
}

function onSetDay(item) {
  if (!item.select) return;

  if (ps.twin && sDay.value && eDay.value) {
    sDay.value = "";
    eDay.value = "";
  }

  if (item.select) {
    if (ps.twin) {
      if (sDay.value && item.date < sDay.value && eDay.value) {
        sDay.value = eDay.value;
        eDay.value = formatDate(item.date, "yyyy-MM-dd")
      } else if (sDay.value && item.date < sDay.value && !eDay.value) {
        eDay.value = sDay.value;
        sDay.value = item.date;
      }
      else if (!sDay.value) {
        sDay.value = formatDate(item.date, "yyyy-MM-dd")
        sDay.isOver = false;
        eDay.isOver = true;
      } else if (!eDay.value) {
        sDay.isOver = false;
        eDay.isOver = false;
        eDay.value = formatDate(item.date, "yyyy-MM-dd")
      }

      if (!ps.time && sDay.value && eDay.value) {
        changeDateValue()
      }
    } else {
      sDay.value = item.date;
      if (!ps.time) {
        changeDateValue()
      }
    }
  }
}

function changeDateValue(isClear) {
  if (isClear) {
    sDay.nextYear = "";
    sDay.nextMonth = "";
    sDay.isDay = false;
    sDay.isTime = false;
    sDay.isOver = false;
    sDay.value = "";
    sDay.hour = "00";
    sDay.minute = "00";
    sDay.second = "00";

    eDay.nextYear = "";
    eDay.nextMonth = "";
    eDay.isDay = false;
    eDay.isTime = false;
    eDay.isOver = false;
    eDay.value = "";
    eDay.hour = "00";
    eDay.minute = "00";
    eDay.second = "00";

    mvalue.value = "";
    info.overDay = "";
    end.value = "";
    emit('change', ps.twin ? ['', ''] : '')
  } else {
    let format = ps.format;
    if (ps.time && ps.format == 'yyyy-MM-dd') {
      format = "yyyy-MM-dd hh:mm:ss"
    }
    if (ps.twin) {
      if (sDay.value && eDay.value) {
        let sValue = formatDate(`${sDay.value} ${sDay.hour}:${sDay.minute}:${sDay.second}`, format)
        let eValue = formatDate(`${eDay.value} ${eDay.hour}:${eDay.minute}:${eDay.second}`, format)
        if (['number', 'timestamp'].includes(ps.format)) {
          mvalue.value = new Date(sValue).getTime()
          end.value = new Date(eValue).getTime()
        } else {
          mvalue.value = sValue
          end.value = eValue
        }
        emit('change', [sValue, eValue])
      }
    } else {
      let sValue = formatDate(`${sDay.value} ${sDay.hour}:${sDay.minute}:${sDay.second}`, format)
      if (['number', 'timestamp'].includes(ps.format)) {
        sValue = new Date(sValue).getTime()
      }
      mvalue.value = sValue
      emit('change', sValue)
    }
  }
  setTimeout(() => {
    sDay.isOver = false;
    eDay.isOver = false;
    info.visible = false;
    document.removeEventListener('click', setSelectPop);
  }, ps.twin ? 100 : 0);
}

function initDatePop(e) {
  info.isYear = false;
  info.isTime = false;
  info.clickInput = e.target.ariaValueText || 'start';
  if (ps.twin) {
    if (info.clickInput == 'start') {
      sDay.isOver = true;
      eDay.isOver = false
    } else if (info.clickInput == 'end') {
      if (mvalue.value && end.value) {
        eDay.isOver = false;
        sDay.isOver = true;
        info.clickInput = "start";
      } else {
        eDay.isOver = true;
        sDay.isOver = false;
      }
    }
  }

  if (ps.disabled) return
  if (!ps.twin) {
    info.visible = !info.visible;
  } else {
    info.visible = true;
  }
  document.addEventListener("click", setSelectPop);

  if (info.visible) {
    nextTick(() => {
      // 可见屏高
      options.screenHeight = document.body.getBoundingClientRect().height;
      // 可见屏宽
      options.screenWidth = document.body.getBoundingClientRect().width;
      options.width = layDate.value?.offsetWidth || 0;
      options.height = layDate.value?.offsetHeight || 0;
      options.iheight = document.getElementById('dateInput')?.offsetHeight || 0;
    })
  }
}

function setSelectPop(e) {
  if (!dateMain?.value?.contains(e.target)) {
    info.visible = false;
    sDay.isOver = false;
    eDay.isOver = false;
    document.removeEventListener('click', setSelectPop)
  }
}

const bodyDate = computed(() => {
  let top = dateMain.value.getBoundingClientRect().top;
  let left = dateMain.value.getBoundingClientRect().left;
  let width = Math.max(dateMain.value.getBoundingClientRect().width, options.width);

  let style = {};
  if (options.iheight + top + options.height > options.screenHeight) {
    style.top = 0 - options.height - 3 + 'px';
  } else {
    style.top = options.iheight + 3 + 'px';
  }
  if (width + left > options.screenWidth) {
    style.right = "0px";
  } else {
    style.left = "0px";
  }

  return style;
  // ----------------------------------------------------
})

function mainOver() {
  if (!ps.clear) {
    info.isClear = false;
    return
  }
  if (ps.twin) {
    if (end.value && mvalue.value) {
      info.isClear = true;
    } else {
      info.isClear = false;
    }
  } else {
    if (mvalue.value) {
      info.isClear = true;
    } else {
      info.isClear = false;
    }
  }
}
function mainOut() {
  info.isClear = false;
}

const bodyClass = computed(() => {
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

function inputStartValue(e) {
  let { value } = e.target as HTMLInputElement;
  let format = ps.format;
  let svalue = mvalue.value;
  let evalue = end.value;
  if (e.target.ariaValueText == 'start') {
    svalue = value;
  } else {
    evalue = value;
  }
  if (!isNaN(new Date(value).getTime()) && ps.twin) {
    if (new Date(svalue).getTime() > new Date(evalue).getTime()) {
      let star = svalue;
      let ends = evalue;
      svalue = ends;
      evalue = star;
    }
  }
  if (ps.time && ps.format == 'yyyy-MM-dd') {
    format = "yyyy-MM-dd hh:mm:ss"
  }
  if (!isNaN(new Date(value).getTime())) {
    if (['number', 'timestamp'].includes(ps.format)) {
      mvalue.value = new Date(svalue).getTime()
      end.value = new Date(evalue).getTime()
      return
    }
    mvalue.value = formatDate(svalue, format)
    end.value = formatDate(evalue, format)
    emit('change', ps.twin ? [mvalue.value, end.value] : mvalue.value)
  }
}

function movesDay(type) {
  if (!ps.twin) return
  if (type == 'star') {
    sDay.isOver = true;
  } else {
    eDay.isOver = true;
  }
}

function outDay(type) {
  if (!ps.twin) return
  if (type == 'star') {
    if (info.visible && info.clickInput == 'start') {
      sDay.isOver = true;
    } else {
      sDay.isOver = false;
    }
  } else {
    if (info.visible && info.clickInput == 'end') {
      eDay.isOver = true;
    } else {
      eDay.isOver = false;
    }
  }
}

function onOver(item) {
  if (item.select) {
    info.overDay = item.date;
  }
}
function onOut(item) {
  info.overDay = "";
}

function initStartDate(v) {
  if (v) {
    let date = refDate(v);
    sDay.year = date[0];
    sDay.nextYear = new Date(v).getFullYear();
    sDay.month = date[1];
    sDay.nextMonth = new Date(v).getMonth();
    sDay.day = date[2];
    sDay.hour = date[3] || "00";
    sDay.minute = date[4] || "00";
    sDay.second = date[5] || "00";
    sDay.value = formatDate(v)
    if (typeof v == "object") {
      let format = ps.format;
      if (ps.time && ps.format == 'yyyy-MM-dd') {
        format = "yyyy-MM-dd hh:mm:ss"
      }
      mvalue.value = formatDate(v, format)
    }
  } else {
    sDay.year = "";
    sDay.nextYear = new Date().getFullYear();
    sDay.month = "";
    sDay.nextMonth = new Date().getMonth();
    sDay.day = "";
    sDay.hour = "00";
    sDay.minute = "00";
    sDay.second = "00";
    sDay.value = ""
  }
}

function initEndDate(s, v) {
  if (v) {
    if (formatDate(s, 'yyyy-MM') == formatDate(v, 'yyyy-MM')) {
      eDay.nextYear = new Date(new Date().setMonth(new Date(s).getMonth() + 1)).getFullYear();
      eDay.nextMonth = new Date(new Date().setMonth(new Date(s).getMonth() + 1)).getMonth();
    } else {
      eDay.nextYear = new Date(v).getFullYear();
      eDay.nextMonth = new Date(v).getMonth();
    }
    let date = refDate(v);
    eDay.year = date[0];
    eDay.month = date[1];
    eDay.day = date[2];
    eDay.hour = date[3] || "00";
    eDay.minute = date[4] || "00";
    eDay.second = date[5] || "00";
    eDay.value = formatDate(v)
    if (typeof v == "object") {
      let format = ps.format;
      if (ps.time && ps.format == 'yyyy-MM-dd') {
        format = "yyyy-MM-dd hh:mm:ss"
      }
      end.value = formatDate(v, format)
    }
  } else {
    eDay.year = "";
    eDay.nextYear = new Date(new Date().setMonth(new Date().getMonth() + 1)).getFullYear();
    eDay.month = "";
    eDay.nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).getMonth();
    eDay.day = "";
    eDay.hour = "00";
    eDay.minute = "00";
    eDay.second = "00";
    eDay.value = "";
  }
}

watchEffect(() => {
  initStartDate(mvalue.value)
  initEndDate(mvalue.value, end.value)
})

const startPath = computed(() => {

  // 本月1号的时间对象
  let firstMonthDate = new Date(sDay.nextYear, sDay.nextMonth, 1);
  // 本月1号星期几
  let week = firstMonthDate.getDay();
  // 第一个时间
  let firstDate = firstMonthDate - week * 60 * 60 * 1000 * 24;
  // let strDate = mvalue.value && formatDate(mvalue.value) || ""
  // let endDate = end.value && formatDate(end.value) || ""
  return Array.from(new Array(42).keys()).map(v => {
    let cdate = new Date(firstDate + v * 60 * 60 * 1000 * 24);
    let date = formatDate(cdate);
    // 1 未选中,2 经过-开始未选中,3经过-开始已选中, 4开始选中值,5结束选中值，6开始结都选中这个值,7单日历选中,0不可选
    let select = 1;
    let className = "fc-222 hand";
    // 不在当前月分 不可选
    if ((cdate.getFullYear() != sDay.nextYear) || (cdate.getFullYear() == sDay.nextYear && cdate.getMonth() != sDay.nextMonth)) {
      select = 0;
      className = "fc-ccc";
    }

    if (ps.section) {
      if (isNumber(ps.section)) {
        if (sDay.value && !eDay.value) {
          if (Math.abs(parseInt((cdate - new Date(sDay.value)) / (1000 * 60 * 60 * 24))) < ps.section) {
            select = 0;
            className = "fc-ccc";
          }
        }
      } else if (isArray(ps.section)) {
        if (ps.section.some(s => date == formatDate(new Date(s)))) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('&&')) {
        let currStart = formatDate(ps.section.split('&&')[0]);
        let currEnd = formatDate(ps.section.split('&&')[1]);
        if (date > currStart && date < currEnd) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('||')) {
        let currStart = formatDate(ps.section.split('&&')[0]);
        let currEnd = formatDate(ps.section.split('&&')[1]);
        if (date > currStart && date < currEnd) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('>')) {
        let currStart = formatDate(ps.section.split('>')[0]) || formatDate(ps.section.split('>')[1]);
        if (date < currStart) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('<')) {
        let currStart = formatDate(ps.section.split('>')[0]) || formatDate(ps.section.split('>')[1]);
        if (date > currStart) {
          select = 0;
          className = "fc-ccc";
        }
      }
    }

    // 当天样式
    if (select && cdate.getDate() == new Date().getDate() && cdate.getMonth() == new Date().getMonth() && cdate.getFullYear() == new Date().getFullYear()) {
      className = "fc-primary fb hand";
    }

    if (select) {
      // 2 经过-开始未选中
      if (!sDay.value && info.overDay && info.overDay == date) {
        select = 2;
        className = "bc-f5 hand ra-4";
      }

      if (sDay.value && eDay.value && info.overDay == date) {
        select = 2;
        className = "bc-f5 hand ra-4";
      }

      // 3经过-开始已选中
      if (ps.twin) {
        if (sDay.value && !eDay.value && info.overDay && ((date > sDay.value && date <= info.overDay) || (date < sDay.value && date >= info.overDay))) {
          select = 3;
          className = "fc-over hand";
        }


        // 4开始选中值
        if (sDay.value == date) {
          select = 4;
          className = "bc-primary fc-fff fb sLeft hand";
        }

        // 5结束选中值
        if (eDay.value == date && ps.twin) {
          select = 5;
          className = "bc-primary fc-fff fb sRight hand";
        }

        // 开始已结束选中同一值
        if (sDay.value == date && eDay.value == date) {
          select = 6;
          className = "bc-primary fc-fff fb ra-18 hand";
        }

        // 两选中时间，区间颜色
        if (sDay.value && eDay.value && date > sDay.value && date < eDay.value) {
          className = "fc-over hand";
        }
      } else {
        // 4开始选中值
        if (sDay.value == date) {
          select = 7;
          className = "bc-primary fc-fff fb ra-4 hand";
        }
      }
    }

    return {
      date,
      value: Number(date.split('-').pop()),
      select,
      className
    }
  })
})

const endPath = computed(() => {
  // 本月1号的时间对象
  let firstMonthDate = new Date(eDay.nextYear, eDay.nextMonth, 1);
  // 本月1号星期几
  let week = firstMonthDate.getDay();
  // 第一个时间
  let firstDate = firstMonthDate - week * 60 * 60 * 1000 * 24;
  return Array.from(new Array(42).keys()).map(v => {
    let cdate = new Date(firstDate + v * 60 * 60 * 1000 * 24);
    let date = formatDate(cdate);
    //0不可选, 1 未选中,2 经过-开始未选中,3经过-开始已选中, 4开始选中值,5结束选中值，6开始结都选中这个值,7单日历选中
    let select = 1;
    let className = "fc-222 hand";
    // 不在当前月分 不可选
    if ((cdate.getFullYear() != eDay.nextYear) || (cdate.getFullYear() == eDay.nextYear && cdate.getMonth() != eDay.nextMonth)) {
      select = 0;
      className = "fc-ccc";
    }

    if (ps.section) {
      if (isNumber(ps.section)) {
        if (sDay.value && !eDay.value) {
          if (Math.abs(parseInt((cdate - new Date(sDay.value)) / (1000 * 60 * 60 * 24))) < ps.section) {
            select = 0;
            className = "fc-ccc";
          }
        }
      } else if (isArray(ps.section)) {
        if (ps.section.some(s => date == formatDate(new Date(s)))) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('&&')) {
        let currStart = formatDate(ps.section.split('&&')[0]);
        let currEnd = formatDate(ps.section.split('&&')[1]);
        if (date > currStart && date < currEnd) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('||')) {
        let currStart = formatDate(ps.section.split('&&')[0]);
        let currEnd = formatDate(ps.section.split('&&')[1]);
        if (date > currStart && date < currEnd) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('>')) {
        let currStart = formatDate(ps.section.split('>')[0]) || formatDate(ps.section.split('>')[1]);
        if (date < currStart) {
          select = 0;
          className = "fc-ccc";
        }
      } else if (ps.section.includes('<')) {
        let currStart = formatDate(ps.section.split('>')[0]) || formatDate(ps.section.split('>')[1]);
        if (date > currStart) {
          select = 0;
          className = "fc-ccc";
        }
      }
    }

    // 当天样式
    if (select && cdate.getDate() == new Date().getDate() && cdate.getMonth() == new Date().getMonth() && cdate.getFullYear() == new Date().getFullYear()) {
      className = "fc-primary fb hand";
    }

    if (select) {
      // 2 经过-开始未选中
      if (!sDay.value && info.overDay && info.overDay == date) {
        select = 2;
        className = "bc-f5 hand ra-4";
      }

      if (sDay.value && eDay.value && info.overDay == date) {
        select = 2;
        className = "bc-f5 hand ra-4";
      }

      // 3经过-开始已选中
      if (ps.twin) {
        if (sDay.value && !eDay.value && info.overDay && ((date > sDay.value && date <= info.overDay) || (date < sDay.value && date >= info.overDay))) {
          select = 3;
          className = "fc-over hand";
        }

        // 4开始选中值
        if (sDay.value == date) {
          select = 4;
          className = "bc-primary fc-fff fb sLeft hand";
        }

        // 5结束选中值
        if (eDay.value == date && ps.twin) {
          select = 5;
          className = "bc-primary fc-fff fb sRight hand";
        }

        if (sDay.value == date && eDay.value == date) {
          select = 6;
          className = "bc-primary fc-fff fb ra-4 hand";
        }

        if (sDay.value && eDay.value && date > sDay.value && date < eDay.value) {
          className = "fc-over hand";
        }
      } else {
        // 4开始选中值
        if (sDay.value == date) {
          select = 7;
          className = "bc-primary fc-fff fb ra-4 hand";
        }
      }
    }

    return {
      date,
      value: Number(date.split('-').pop()),
      select,
      className
    }
  })
})
</script>

<style lang='less'>
._date {
  .w-272{
    width: 272px;
  }
  .w-274{
    width: 274px;
  }
  .noscoll {
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    div {
      &:hover {
        background-color: #f6f6f6;
      }
    }
  }
  .inputover {
    background-color: v-bind("hoverColor");
  }
  .fc-over {
    background-color: #eaf5ff;
  }
  .h-280 {
    height: 280px;
  }
  .w-280 {
    width: 280px;
  }
  .yearHover {
    &:hover {
      background-color: #f5f5f5;
    }
  }
  .sLeft {
    border-radius: 18px 0 0 18px;
  }

  .sRight {
    border-radius: 0 18px 18px 0;
  }
}
</style>