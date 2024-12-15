<template>
  <div ref="vslot" :key="uuid" :style="{borderRadius:config.Radius}" :class="validClass" class="rel">
    <slot></slot>
    <div v-if="config.check&&ps.info.check" :style="{borderRadius:config.tipRadius}" class="abs at-0 ar0 tips fs-12 ai-c jc-c pl8 pr8 pt3 pb3">
      <span class="nowrap fs-11">{{config.message}}</span>
      <!-- <span style="bottom:-4px; transform:translateX(-10%) rotate(45deg)" class="w-8 ar10 tipsarr h-8 abs"></span> -->
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, reactive, ref, watchEffect, watch } from 'vue';

// 使用方法
// <valid : value = "value" class="ra-4 flex-line" : info = "fromVaild" >
//   <input v - model="value" class="ipt ipt-small " type = "text" >
// </valid>
// const fromVaild = ref({}) 或 const fromVaild = reactive({})
// function btnClick() {
//   if (!fromVaild.value.next) {
//     fromVaild.value.check = true;
//     return
//   }
// }

const ps = defineProps({
  class: { type: String, default: "w-all" },
  // 错误提示
  message: { type: String, default: "" },
  // 验正内容 必需内容为 {check: false,list: []} check为开启验正，list为错误列表
  info: { type: Object, default: null },
  // 绑定值
  value: { type: [Object, String, Array, Boolean, Number], default: "" },
  // 验正格式 正则/方法   如果方法 return false不通过
  rex: { type: [Object, Function], default: null },
  // 类型为regList 里的类型
  type: { type: String, default: "" },
  // type
})

const vslot = ref(null);

const emit = defineEmits(["change"]);

const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  let r = Math.random() * 16 | 0,
    v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16).toLocaleUpperCase();
});

const validClass = computed(() => {
  let curr = {
    [ps.class]: true
  }
  if (config.check && ps.info.check) {
    curr['border-red'] = true;
  }
  return curr
})

const config = reactive({
  check: false,
  message: "",
  Radius: 0,
  tipRadius:0
})

const regList = {
  // ps.value 可以是字符也可以数组，为空时验正
  empty: ['empty', '内容不为空'],
  code: [/^[0-9a-zA-Z]{4}$/, '请输入正确的验证码'],
  smscoe: [/^\d{4,6}$/, '请输入正确的短信码'],
  postcode: [/^\d{4}$/, '请输入正确的邮政编码'],
  username: [/^[\w|\d]{2,26}$/, '请输入正确的用户名'],//用户名
  password: [/^\S{6,16}$/, '请输入6位以上正确密码'],
  password1: [/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, '请输入6位(数字+字母)密码'],
  password2: [/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{6,}$/, '请输入6位(数字+字母+特殊符号)密码'],
  phone: [/^1[3|4|5|7|8]\d{9}$/, '请输入正确手机号'],
  realname: [/^[\u4e00-\u9fa5 ]{2,10}$/, '请输入真实姓名'],
  bank: [/^\d{10,19}$/, '请输入正确银行卡号'],
  url: [/^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/, '请输入正确的网址'],
  money: [/^([1-9]\d*|0)$/, '请输入正确金额'],
  email: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, '请输入正确邮箱'],
  ip: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, '请输入正确IP地址'],
  idcode: [/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, '请输入正确的身份证']
}

watchEffect(() => {
  if (vslot.value) {
    config.Radius = getComputedStyle(vslot.value.firstElementChild).borderRadius;
    config.tipRadius=`0 ${config.Radius} 0 10px`;
  }
  if (ps.info == null) {
    console.error('验正组件:info参数为空,请参考组件参数说明')
    return
  }
  if (typeof ps.info.check != "boolean") {
    ps.info.check = false;
  }
  if (!Array.isArray(ps.info.list)) {
    ps.info.list = [];
  }
  // 只接当前组件值的改变
  if (ps.info.id && ps.info.id != uuid) return;
  let value = ps.value;
  let type = ps.type;
  if (!ps.type && !ps.rex) {
    type = 'empty'
  }
  if (type && regList[type]) {
    if (type == 'empty') {
      if (Array.isArray(ps.value)) {
        if (!ps.value.length) {
          config.check = true;
          config.message = ps.message || regList[type][1]
        } else {
          config.check = false;
          config.message = ""
        }
      } else {
        if (!ps.value) {
          config.check = true;
          config.message = ps.message || regList[type][1]
        } else {
          config.check = false;
          config.message = ""
        }
      }
    }
    else if (!regList[type][0].test(value)) {
      config.check = true;
      config.message = ps.message || regList[type][1]
    } else {
      config.check = false;
      config.message = ""
    }
  } else if (ps.rex) {
    if (typeof ps.rex == "object") {
      let rex = new RegExp(ps.rex);
      if (!rex.test(value)) {
        config.check = true;
        config.message = ps.message;
      } else {
        config.check = false;
        config.message = ""
      }
    } else if (typeof ps.rex == "function") {
      if (!ps.rex()) {
        config.check = true;
        config.message = ps.message;
      } else {
        config.check = false;
        config.message = ""
      }
    }
  }
  if (!ps.info.list) {
    ps.info.list = [];
  }
  let curr = ps.info.list.find(v => v.id == uuid);

  if (config.check) {
    if (!curr) {
      ps.info.list.push({
        id: uuid,
        message: config.message
      })
      ps.info.next = true;
    }
  } else {
    ps.info.list = ps.info.list.filter(v => v.id != uuid);
    if (ps.info.list.length) {
      ps.info.next = true;
    } else {
      ps.info.next = false;
    }
  }
})

watch(() => ps.value, (news, old) => {
  ps.info.id = uuid;
})
</script>

<style lang='less'>
.border-red {
  border: 1px solid red;
}
.tips {
  background-color: #ffe2e2;
  color: #f56c6c;
}

.tipsarr {
  background-color: #ffe2e2;
}
</style>