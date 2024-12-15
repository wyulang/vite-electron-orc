<template>
  <section v-if="count>1||all" class="flex ai-c">
    <div v-if="all" class="flex nowrap ai-c mr8">共 {{total}} 条</div>
    <Select v-if="all" :class="selectClass" class="w-100 mr5" v-model="cSize" :data="fenPage"></Select>

    <!-- 页列表item -->
    <div @click="onPage(item.type,item.value)" v-for="item in path" :style="{color:item.select?active[0]:color[0],backgroundColor:item.select?active[1]:color[1]}" class="hand wi-30 pl4 pr4 h-30 flex ai-c jc-c fs-13 ra-4 ml5">{{item.value}}</div>

    <div v-if="all&&count>pager" class="flex ml10 nowrap ai-c">跳至<input v-model="cPage" @keydown="onKeyUp" @blur="blurPage" :class="selectClass" class="ipt ipt-small bc-t ra-4 ml5 mr5 wi-50 w-50 centers " @keyup="keyPage">页</div>
  </section>
</template>

<script setup lang='ts'>
import { computed, nextTick, ref, watch } from 'vue';
import Select from './Select.vue';

const ps = defineProps({
  // 一页个数
  size: { type: [Number, String], default: 10 },
  // 显示清空选项
  all: { type: Boolean, default: false },
  // 一页个数
  sizeList: { type: [String, Array], default: [10, 20, 30, 50, 100, 200, 300, 400, 500, 1000, 2000] },
  // 分页码多少个页码出现...更多
  pager: { type: [Number, String], default: 8 },
  // 总数据
  total: { type: [Number, String], default: 0 },
  // 当前页码
  page: { type: [Number, String], default: 1 },
  // 未选中时的字体与背景颜色
  color: { type: Array, default: ["#222", '#f5f5f5'] },
  // 选中时的字体与背景颜色
  active: { type: Array, default: ["#fff", '#409eff'] },
  selectClass: { type: String, default: "" },
})

const emit = defineEmits(["change"]);
const cSize = defineModel('size', { type: [String, Number, Object] });

const cPage = ref(Number(ps.page));
//一页显示多少条
const fenPage = computed(() => {
  let list = ps.sizeList;
  if (ps.size != 10) {
    list = [ps.size, ...ps.sizeList]
  }
  return list.map(m => {
    return { label: `${m}条/页`, value: m }
  })
})

watch(() => ps.page, (news, old) => {
  cPage.value = ps.page;
})

// 总页码
const count = computed(() => {
  if (Number(ps.total) > Number(cSize.value)) {
    if (Number(ps.total) % Number(cSize.value) > 0) {
      return parseInt(Number(ps.total) / Number(cSize.value)) + 1
    } else {
      return parseInt(Number(ps.total) / Number(cSize.value))
    }
  } else {
    return 1
  }
})

function blurPage(v) {
  if (cPage.value) {
    changePage(Number(cPage.value))
  } else {
    cPage.value = 1;
    changePage(1)
  }
}

function keyPage(v) {
  let { value } = v.target as HTMLInputElement;
  if (value <= count.value) {
    cPage.value = value.replace(/[^\d]/g, '');
  } else {
    cPage.value = count.value
  }
}

function changePage(item) {
  document.onkeydown = null;
  emit('change', item)
}

const path = computed(() => {
  let list: any = [];
  list.push({ value: "<", select: false, type: 'prev' })
  if (isPrev.value && !isNext.value) {
    list.push({ value: 1, select: 1 == cPage.value, type: 'page' })
    list.push({ value: '•••', select: false, type: 'moreprev' })
    for (let p = count.value - Number(ps.pager) + 2; p < count.value; p++) {
      list.push({ value: p, select: p == cPage.value, type: 'page' })
    }
    list.push({ value: count.value, select: count.value == cPage.value, type: 'page' })

  } else if (!isPrev.value && isNext.value) {
    list.push({ value: 1, select: 1 == cPage.value, type: 'page' })
    for (let p = 2; p < Number(ps.pager); p++) {
      list.push({ value: p, select: p == cPage.value, type: 'page' })
    }
    list.push({ value: '•••', select: false, type: 'morenext' })
    list.push({ value: count.value, select: count.value == cPage.value, type: 'page' })


  } else if (isNext.value && isPrev.value) {
    list.push({ value: 1, select: 1 == cPage.value, type: 'page' })
    list.push({ value: '•••', select: false, type: 'moreprev' })
    const offset = (Number(ps.pager) % 2) ? Math.floor(Number(ps.pager) / 2) : (Math.floor(Number(ps.pager) / 2) - 1);
    for (let p = Number(cPage.value) - offset; p <= Number(cPage.value) + offset; p++) {
      list.push({ value: p, select: p == cPage.value, type: 'page' })
    }
    list.push({ value: '•••', select: false, type: 'morenext' })
    list.push({ value: count.value, select: count.value == cPage.value, type: 'page' })


  } else {
    list.push({ value: 1, select: 1 == cPage.value, type: 'page' })
    for (let p = 2; p < count.value; p++) {
      list.push({ value: p, select: p == cPage.value, type: 'page' })
    }
    if (count.value > 1) {
      list.push({ value: count.value, select: count.value == cPage.value, type: 'page' })
    }
  }
  list.push({ value: ">", select: false, type: 'next' })
  return list
})

function onPage(type: any, page) {
  let newPage;
  const offSet = Number(ps.pager) - 2;
  switch (type) {
    case "page":
      newPage = Number(page);
      break;
    case "moreprev":
      newPage = Number(cPage.value) - offSet;
      break;
    case "morenext":
      newPage = Number(cPage.value) + offSet;;
      break;
    case "prev":
      newPage = Number(cPage.value) - 1;
      break;
    case "next":
      newPage = Number(cPage.value) + 1;
      break;
  }

  if (!isNaN(newPage)) {
    if (newPage < 1) {
      newPage = 1
    }
    if (newPage > count.value) {
      newPage = count.value
    }
  }

  cPage.value = newPage;
  changePage(newPage)
}

const half = computed(() => {
  return ((Number(ps.pager) % 2 ? Number(ps.pager) - 1 : Number(ps.pager)) / 2) - 1
})

// 是否显示-跳到前几页
const isPrev = computed(() => {
  if (count.value > Number(ps.pager)) {
    if (cPage.value > Number(ps.pager) - half.value) {
      return true
    }
  }
  return false;
})

// 是否显示-跳到下几页
const isNext = computed(() => {
  if (count.value > Number(ps.pager)) {
    if (cPage.value < count.value - half.value) {
      return true
    }
  }
  return false;
})

// function changeSize(v) {
//   changePage(cPage.value > count.value ? count.value : cPage.value)
// }

watch(() => ps.size, (news, old) => {
  document.onkeydown = null;
  changePage(cPage.value > count.value ? count.value : cPage.value)
})

function onKeyUp(v) {
  nextTick(() => {
    document.onkeydown = e => {
      var ev: any = document.all ? window.event : e;
      if (ev.keyCode == 13 && cPage.value) {
        if (cPage.value) {
          changePage(Number(cPage.value))
        }
      }
    };
  });
}

</script>

<style lang='less'>
</style>