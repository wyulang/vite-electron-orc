<template>
  <section ref="cascader" :class="mainclass" class="flex ai-c __carder rel">
    <div ref="selects" @click="onexamp" @mouseover="isHover=true" @mouseleave="isHover=false" class="w-all bc-t h-all flex ai-c ra-4">
      <input :placeholder="placeholder" v-model="label" :class="inputClass" class="w-all fs-init bc-t h-all ra-4" type="text">
      <svg style="transition: all 0.15s;" v-if="!isClose" :class="{'arrow':visible}" class=" drop w-25 h-25" viewBox="0 0 1024 1024">
        <path d="M346.453333 396.373333L512 561.92l165.546667-165.546667a42.496 42.496 0 1 1 60.16 60.16l-195.84 195.84a42.496 42.496 0 0 1-60.16 0L285.866667 456.533333a42.496 42.496 0 0 1 0-60.16c16.64-16.213333 43.946667-16.64 60.586666 0z" fill="#aaa"></path>
      </svg>
      <svg style="fill:#ccc" v-if="isClose" @click.stop="changeClose" class="iconfix hand w-21 h-21" viewBox="0 0 1024 1024" width="16" height="16">
        <path
          d="M512 102.4a409.6 409.6 0 1 0 409.6 409.6 409.6 409.6 0 0 0-409.6-409.6z m181.248 518.144a51.2 51.2 0 0 1-72.704 72.704L512 584.192l-108.544 109.056a51.2 51.2 0 0 1-72.704-72.704L439.808 512 330.752 403.456a51.2 51.2 0 0 1 72.704-72.704L512 439.808l108.544-109.056a51.2 51.2 0 0 1 72.704 72.704L584.192 512z">
        </path>
      </svg>
    </div>

    <div :style="digstyle" class="zi-8888 bc-fff _dropdown ra5 pt2 pb2 flex-line abs al0 at5" @click.stop v-show="visible">
      <scrollbar :class="{'bl-e':i}" :auto="scollHeight[i]||0" v-for="(list,i) in tree" height="180">
        <section ref="diglist" class="wi-120 h-all">
          <div @click="setItemValue(item,false,index,i)" @dblclick="setItemValue(item,true,index,i)" v-for="(item,index) in list" :key="index" :class="{'select-item':String(item.value)==(path[i]&&path[i].value),'is-check':check}" class="flex pt8 pb8 pl10 pr10 cascader-item hand ai-c jc-b">
            <span class="cascader-titles pr5 nowrap">{{item.label}}</span>
            <div class="flex w-16">
              <span v-if="item.children?.length&&!item.isLoader" class="cascader-arrow mt9"></span>
              <div style="margin-left:-5px" v-if="item.children?.length" @click="setItemValue(item,true,index,i)" class="ra-3 hide rel zi-8888 wi-18 b-8 checks w-18 h-18"></div>
            </div>
            <svg v-if="loader.value==item.value&&loader.level==i&&loader.load" style="fill:#999" class="w-16 loading h-16" viewBox="0 0 1024 1024">
              <path
                d="M964.388184 477.340047a72.848985 72.848985 0 0 1 22.16189 53.612757c0 20.991625-7.387297 38.691881-22.16189 53.612757a72.044428 72.044428 0 0 1-53.466474 22.16189c-20.845342 0-38.618739-7.460438-53.612757-22.16189a72.848985 72.848985 0 0 1-22.16189-53.612757c0-20.991625 7.387297-38.691881 22.16189-53.612757a72.848985 72.848985 0 0 1 53.612757-22.161889c20.7722 0 38.765022 7.460438 53.466474 22.161889m-99.911359 348.885199a73.141551 73.141551 0 0 1-22.527598 53.393332 72.995268 72.995268 0 0 1-53.393332 22.527598c-20.991625 0-38.618739-7.460438-53.612757-22.16189a72.848985 72.848985 0 0 1-22.16189-53.612757c0-20.991625 7.460438-38.618739 22.16189-53.612757a72.848985 72.848985 0 0 1 53.612757-22.16189c20.991625 0 38.691881 7.460438 53.612757 22.16189a72.410136 72.410136 0 0 1 22.308173 53.466474m56.904127-590.179175c0 36.717059-13.019196 68.094784-39.13073 93.913751a128.070856 128.070856 0 0 1-93.621185 38.691881c-36.643917 0-68.021642-12.946055-93.913752-38.691881a127.924573 127.924573 0 0 1-38.618739-93.913751c0-36.351351 12.946055-67.582793 38.618739-93.621186a127.924573 127.924573 0 0 1 93.986893-39.13073c36.351351 0 67.582793 13.092338 93.548044 39.203872 26.111534 25.818968 39.13073 57.05041 39.13073 93.548044m-374.192175 658.566525a72.848985 72.848985 0 0 1 22.088748 53.612757c0 20.991625-7.387297 38.691881-22.088748 53.612757a72.848985 72.848985 0 0 1-53.685899 22.16189c-20.991625 0-38.618739-7.460438-53.612757-22.16189a72.410136 72.410136 0 0 1-22.16189-53.612757c0-20.991625 7.460438-38.618739 22.16189-53.612757a72.848985 72.848985 0 0 1 53.612757-22.16189c20.991625 0 38.765022 7.460438 53.685899 22.16189M574.251151 33.151408c22.088748 22.16189 33.206264 48.931698 33.206264 80.675131 0 31.743433-11.117516 58.366958-33.206264 80.601989a109.566043 109.566043 0 0 1-80.60199 33.133123c-31.743433 0-58.366958-11.117516-80.601989-33.133123a109.346619 109.346619 0 0 1-33.206264-80.601989c0-31.743433 11.190657-58.366958 33.206264-80.675131A109.785468 109.785468 0 0 1 493.57602 0.018285c31.59715 0 58.366958 11.117516 80.601989 33.133123M252.208901 772.612489a72.848985 72.848985 0 0 1 22.088749 53.612757c0 20.991625-7.387297 38.691881-22.088749 53.685898a72.848985 72.848985 0 0 1-53.685898 22.088749 73.141551 73.141551 0 0 1-53.393332-22.527598 72.995268 72.995268 0 0 1-22.454457-53.393332c0-20.991625 7.387297-38.618739 22.088749-53.612757a72.848985 72.848985 0 0 1 53.685898-22.088748c20.991625 0 38.911305 7.387297 53.75904 22.235031M265.37438 168.975268c18.577954 18.577954 27.866931 40.959269 27.866931 66.92452 0 26.038392-9.288977 48.273424-27.866931 66.99766-18.577954 18.651096-40.959269 28.013214-66.99766 28.013214-25.965251 0-48.273424-9.215835-66.924519-27.940072a91.134373 91.134373 0 0 1-27.866931-66.924519c0-25.965251 9.215835-48.273424 27.866931-66.92452 18.724237-18.724237 40.959269-27.940072 66.924519-27.940072 26.038392 0 48.273424 9.215835 66.99766 27.793789M129.98937 477.340047a72.848985 72.848985 0 0 1 22.161889 53.612757c0 20.991625-7.460438 38.691881-22.161889 53.612757a72.190711 72.190711 0 0 1-53.612757 22.16189c-20.991625 0-38.691881-7.460438-53.612757-22.16189A72.190711 72.190711 0 0 1 0.601966 531.025946c0-20.991625 7.460438-38.691881 22.16189-53.612757a72.848985 72.848985 0 0 1 53.612757-22.16189c20.991625 0 38.765022 7.460438 53.612757 22.16189">
              </path>
            </svg>
          </div>
        </section>
      </scrollbar>
    </div>
  </section>
</template>

<script setup lang='ts'>
import { setParm } from "@lib/lang";
import { computed, nextTick, onMounted, onUpdated, ref, watch, watchEffect } from "vue";
import scrollbar from './scroll.vue';

const ps = defineProps({
  // 外部样式
  class: { type: String, default: "w-all" },
  // 尺寸 small/big 
  size: { type: String, default: "small" },
  // 尺寸 small/big 
  placeholder: { type: String, default: "" },
  // 是否禁用 
  disabled: { type: Boolean, default: false },
  // 是否清空 
  clear: { type: Boolean, default: false },
  // 当前已选中值最终值['01','0102','010203']
  modelValue: { type: [Array, String, Number, Boolean], default: "" },
  // 输入框中是否显示选中值的完整路径 
  only: { type: Boolean, default: false },
  // 是否显示单选框 
  check: { type: Boolean, default: false },
  // 数据来原Array
  data: { type: Array, default: [] },
  //点击动态加载下级
  lazy: { type: Function },
  // 数组 label,value 如name,id 或 {label:'name',value:'id'}
  props: { type: [String, Object, Array], default: "" },
  // 当一个页面使多次使用时，可根据类型分别给值 
  type: { type: [String, Number, Boolean], default: "1" }
})

const emit = defineEmits(["update:modelValue", "change"]);

//初始树
const treeData: any = ref([]);
//当前正在选择的树
const currData: any = ref([]);
const selects: any = ref(null);
const cascader: any = ref(null);
const diglist: any = ref(null);

// 选择列
const treeSelect: any = ref([]);
// 当前正在选择的列
const currSelect: any = ref([]);

const scollHeight: any = ref([]);

const visible = ref(false);
const isHover = ref(false);;
const isFirst = ref(true);;
const isHand = ref(false);;
const disabled = ref(false);


const loader = ref({
  level: 0,
  value: '',
  load: false
})

const parm = computed(() => {
  return setParm(ps.props)
})

const path = computed(() => {
  if (currSelect.value.length) {
    return currSelect.value.map(v => {
      return { value: String(v.value), label: String(v.label) }
    })
  }
  return treeSelect.value.map(v => {
    return { value: String(v.value), label: String(v.label) }
  })
})

const label = computed(() => {
  if (ps.only) {
    return treeSelect.value[treeSelect.value.length - 1] && treeSelect.value[treeSelect.value.length - 1].label
  } else {
    return treeSelect.value.map(v => v.label).join(' / ')
  }
})

function setItemValue(item, next, index, i) {
  // if (loader.value.load) return;
  isHand.value = true;
  scollHeight.value = [];

  let setValue = (type: any) => {
    //不存在下级
    if (currData.value.length) {
      treeData.value = JSON.parse(JSON.stringify(currData.value));
    }
    if (type) {
      treeData.value[i][index].isLoader = 1;
    }

    currData.value = [];

    if (currSelect.value.length) {
      treeSelect.value = JSON.parse(JSON.stringify(currSelect.value));
      treeSelect.value.push(item);
    } else {
      treeSelect.value.splice(i, 100);
      treeSelect.value.push(item);
    }


    treeSelect.value.splice(i, 100);
    treeSelect.value.push(item);


    currSelect.value = [];

    if (ps.only) {
      let dal = treeSelect.value[treeSelect.value.length - 1];
      if (dal) {
        delete dal.children;
      }
      emit('update:modelValue', dal && dal.value);
      emit('change', { value: dal && dal.value, item: dal, type: ps.type })
      visible.value = false;
    } else {
      emit('update:modelValue', treeSelect.value.map(v => v.value));
      emit('change', { value: treeSelect.value.map(v => v.value), item: treeSelect.value.map(v => { delete v.children; return v }), type: ps.type });
      visible.value = false;
    }
  }
  if (next) {
    setValue();
    return;
  }

  if (item.children?.length) {
    if (!currData.value.length) {
      currData.value = JSON.parse(JSON.stringify(treeData.value));
    }
    if (!currSelect.value.length) {
      currSelect.value = JSON.parse(JSON.stringify(treeSelect.value));
    }
    currData.value.splice(i + 1, 100);
    currData.value.push(item.children);

    currSelect.value.splice(i, 100);
    currSelect.value.push(item);
  } else {
    if (ps.lazy && !item.isLoader) {
      loader.value = {
        level: i,
        value: item.value,
        load: true
      }
      ps.lazy({ level: i, value: item.value, parent: item.value, node: treeData.value }).then(res => {
        loader.value.load = false;
        if (res && res.length) {
          if (!currData.value.length) {
            currData.value = JSON.parse(JSON.stringify(treeData.value));
          }
          if (!currSelect.value.length) {
            currSelect.value = JSON.parse(JSON.stringify(treeSelect.value));
          }
          currData.value.splice(i + 1, 100);
          currData.value.push(res);
          currData.value[i][index][parm.value.child] = res;
          if (treeData.value[i]) {
            treeData.value[i][index][parm.value.child] = res;
          }
          currSelect.value.splice(i, 100);
          currSelect.value.push(item);
        } else {
          setValue(1);
          setValue = null;
        }
      })
    } else {
      setValue();
      setValue = null;
    }
  }
}

const tree = computed(() => {
  if (currData.value.length) {
    return currData.value.map(item => {
      return item.map(v => {
        return {
          value: v[parm.value.value], label: v[parm.value.label], children: v[parm.value.child] || [], ...v
        }
      })
    })
  }
  return treeData.value.map(item => {
    return item.map(v => {
      return {
        value: v[parm.value.value], label: v[parm.value.label], children: v[parm.value.child] || [], ...v
      }
    })
  })
})

watchEffect(() => {
  if (String(ps.modelValue) && ps.data.length) {
    treeData.value = [];
    treeSelect.value = [];
    if (ps.lazy) {
      if (!ps.only) {
        this.getLazyTree();
      }
    } else {
      nextTick(() => {
        if (ps.only) {
          getOnlyTree(ps.data)
        } else {
          getFullTree(ps.data)
        }
        if (!treeData.value.length && ps.data.length) {
          treeData.value = [ps.data];
          treeSelect.value = []
        }
      })
    }
  } else {
    if (!treeData.value.length && ps.data.length) {
      treeData.value = [ps.data];
      treeSelect.value = []
    }
  }
})

function changeClose() {
  treeData.value.splice(1, 100);
  treeSelect.value = [];
  if (ps.only) {
    emit('update:modelValue', "");
    emit('change', "");
  } else {
    emit('update:modelValue', []);
    emit('change', { value: [], item: [], type: ps.type });
  }
}

function getOnlyTree(data) {
  for (let i in data) {
    let item = data[i]
    if (String(item[parm.value.value]) == String(ps.modelValue)) {
      treeSelect.value.unshift({ value: item[parm.value.value], label: item[parm.value.label], ...item });
      treeData.value.unshift(data);
      scollHeight.value.unshift((i - 1) * options.value?.itemHeight);
      return true
    }
    if (item[parm.value.child] && item[parm.value.child].length) {
      let ok = getOnlyTree(item[parm.value.child])
      if (ok) {
        treeSelect.value.unshift({ value: item[parm.value.value], label: item[parm.value.label], ...item })
        treeData.value.unshift(data);
        scollHeight.value.unshift((i - 1) * options.value.itemHeight);
        return true
      }
    }
  }
  return false
}

function getFullTree(list, len = 0) {
  treeData.value.push(list);
  list.forEach((item, index) => {
    if (String(item[parm.value.value]) == String(ps.modelValue[len])) {
      scollHeight.value.push((index - 2) * options.value.itemHeight)
      treeSelect.value.push({ value: item[parm.value.value], label: item[parm.value.label], ...item })
      if (item[parm.value.child] && item[parm.value.child].length) {
        getFullTree(item[parm.value.child], len + 1)
      }
    }
  })
}

function getLazyTree() {
  let model = ps.modelValue;
  if (typeof model == "string") {
    model = ps.modelValue.replace(/[，|\-、\/]/g, ',').split(',');
  }

  model.forEach((v, i) => {
    let parent = i ? ps.modelValue[i - 1] : "";
    // 带三个参数过去 [级别，当前节点级值，父级节点值]，第一级时父级为空值
    ps.lazy({ level: i, value: v, parent, node: treeData.value }).then(res => {
      treeData.value.push(res);
      let item = res.find(f => String(f[parm.value.value]) == String(v))
      scollHeight.value.push((res.findIndex(f => String(f[parm.value.value]) == String(v)) - 2) * options.value.itemHeight);
      treeSelect.value.push({ value: item[parm.value.value], label: item[parm.value.label], ...item })
    })
  })
}

const isClose = computed(() => {
  if (isHover.value && ps.clear) {
    if (typeof ps.modelValue == "string" || typeof ps.modelValue == 'number' || typeof ps.modelValue == 'boolean') {
      return !!ps.modelValue
    } else {
      return ps.modelValue.length
    }
  }
  return false
})

const digstyle = computed(() => {
  let curr = { minWidth: '120px' }
  let height = 180;
  if (options.value.myHeight + options.value.myTop + height > options.value.screenHeight) {
    curr.top = 0 - height - 6 + 'px';
  } else {
    curr.top = options.value.myHeight + 4 + 'px';
  }

  if (options.value.boyWidth + options.value.myLeft > options.value.screenWidth) {
    curr.right = '0px';
  } else {
    curr.left = '0px';
  }
  return curr;
})

// function initSelect() {
//   nextTick(() => {
//     options.value.boyWidth = this.$refs.main && this.$refs.main.offsetWidth;
//   })
// }

const options: any = ref({
  myHeight: 0,//输入框高度
  valueHeight: 0,//选中值高度
  myWidth: 0,
  screenHeight: 0,
  screenWidth: 0,
  itemHeight: 32
})

onMounted(() => {
  // 可见屏高
  options.value.screenHeight = document.body.getBoundingClientRect().height;
  // 可见屏宽
  options.value.screenWidth = document.body.getBoundingClientRect().width;
  // 选择框的高度
  options.value.myHeight = selects.value?.getBoundingClientRect().height;
  // 选择框的宽度
  options.value.myWidth = selects.value?.getBoundingClientRect().width;
  options.value.mainWidth = selects.value?.getBoundingClientRect().width;
  options.value.myTop = selects.value?.getBoundingClientRect().top;
  options.value.myLeft = selects.value?.getBoundingClientRect().left;
  options.value.itemHeight = diglist.value && diglist.value[0].children[0].getBoundingClientRect().height || 22;
  // this.initSelect();
})

onUpdated(() => {
  // this.initSelect()
})

function onexamp(e) {
  if (ps.disabled) return;
  if (visible.value) {
    visible.value = false;
  } else {
    visible.value = !visible.value;
  }
  if (visible.value) {
    options.value.mainWidth = selects.value?.getBoundingClientRect().width
    options.value.myHeight = selects.value?.getBoundingClientRect().height
    options.value.myTop = selects.value?.getBoundingClientRect().top;
    options.value.myLeft = selects.value?.getBoundingClientRect().left;

  }
  document.addEventListener("click", setSelectPop);
}

function setSelectPop(e) {
  if (!cascader.value?.contains(e.target)) {
    visible.value = false;
    currData.value = [];
    currSelect.value = [];
    document.removeEventListener('click', setSelectPop)
  }
}

// const mainclass = computed(() => {
//   let curr = {
//     'h-32 ra-4 b-d pl10 pr3': ps.size == 'small',
//     'h-38 ra-4 b-d pl10 pr3': ps.size == 'big',
//     'select': visible.value,
//     'allowed': ps.disabled,
//     [ps.class]: true,
//   }
//   return curr;
// })


// 主样式
const mainclass = computed(() => {
  let curr = ['ra-4', 'b-d', 'pl10', 'pr3'];
  if (['small', 'big'].includes(ps.size)) {
    curr.push(ps.size == 'small' ? 'hi-32' : 'hi-38')
  } else {
    curr.push(`fs-init ${ps.size}`)
  }

  if (visible.value) {
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

const inputClass = computed(() => {
  let curr = [];
  if (['small', 'big'].includes(ps.size)) {
    curr.push(ps.size == 'small' ? 'hi-32' : 'hi-38')
  }
  return curr.join(' ')
})
</script>

<style lang='less'>
.loading {
  animation: myfirst2 1.5s infinite linear;
}
@keyframes myfirst2 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
.__carder {
  ._dropdown {
    border-radius: 4px;
    box-shadow: 0 1px 10px rgba(109, 109, 109, 0.2);
  }
  &.select {
    border: #409eff 1px solid !important;
  }
  .arrow {
    transform: rotate(-180deg);
  }

  .iconfix {
    &:hover {
      fill: #409eff !important;
    }
  }
  .cascader-item {
    &:hover {
      background-color: #f5f7fa;
    }
    .cascader-arrow {
      width: 8px;
      height: 8px;
      border-top: 1.4px solid #999;
      border-right: 1.4px solid #999;
      -webkit-transform: translate3d(0, -50%, 0) rotate(45deg);
      transform: translate3d(0, -50%, 0) rotate(45deg);
    }
  }
  .is-check {
    &:hover {
      .cascader-arrow {
        display: none;
      }
      .checks {
        display: inline-block;
        &:hover {
          border: #409eff 1.5px solid !important;
        }
      }
    }
  }
  .select-item {
    .cascader-arrow {
      border-top-color: #409eff !important;
      border-right-color: #409eff !important;
    }
    .cascader-titles {
      color: #409eff !important;
    }
  }
}
</style>