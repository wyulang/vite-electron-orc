import directive from '@lib/vue.directive';
import digVue from "@packages/dig.vue";
import date from "@packages/date.vue";
import checkbox from "@packages/checkbox.vue";
import scroll from "@packages/scroll.vue";
import cascader from "@packages/cascader.vue";
import drawer from "@packages/drawer.vue";
import dropdown from "@packages/dropdown.vue";
import number from "@packages/number.vue";
import Input from "@packages/input.vue";
import Select from "@packages/Select.vue";
import page from "@packages/page.vue";
import progress from "@packages/progress.vue";
import radio from "@packages/radio.vue";
import Switch from "@packages/switch.vue";
import tooltip from "@packages/tooltip.vue";
import tree from "@packages/tree.vue";
import upfile from "@packages/upfile.vue";
import slider from "@packages/slider.vue";
export default function (app) {
  app.component('dig', digVue)
  app.component('date', date)
  app.component('checkbox', checkbox)
  app.component('cascader', cascader)
  app.component('drawer', drawer)
  app.component('dropdown', dropdown)
  app.component('Input', Input)
  app.component('Select', Select)
  app.component('number', number)
  app.component('page', page)
  app.component('Progress', progress)
  app.component('radio', radio)
  app.component('Switch', Switch)
  app.component('tooltip', tooltip)
  app.component('tree', tree)
  app.component('upfile', upfile)
  app.component('slider', slider)
  app.component('scroll', scroll)
  directive(app);
}