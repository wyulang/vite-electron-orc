import { Directive } from 'vue';
const infoError: any = [];
const regx = {
  imgcode: [/^[0-9a-zA-Z]{4}$/, '请输入正确的验证码'],
  smscoe: [/^\d{4,6}$/, '请输入正确的短信码'],
  postcode: [/^\d{4}$/, '请输入正确的邮政编码'],
  username: [/^[\w|\d]{2,26}$/, '请输入正确的用户名'],//用户名
  password: [/^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{6,16}$/, '请输入6位以上正确密码'],
  password6: [/^\S{6,16}$/, '请输入6位以上正确密码'],
  phone: [/^1[3|4|5|7|8]\d{9}$/, '请输入正确手机号'],
  realname: [/^[\u4e00-\u9fa5 ]{2,10}$/, '请输入真实姓名'],
  bank: [/^\d{10,19}$/, '请输入正确银行卡号'],
  money: [/^([1-9]\d*|0)$/, '请输入正确金额'],
  email: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, '请输入正确邮箱'],
  idcode: [/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, '请输入正确的身份证']
}
const valid: Directive = {
  mounted(el, binding,vnode) {
    console.log(vnode)
  }
}

export default {
  valid
}