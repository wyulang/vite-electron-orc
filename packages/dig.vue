<template>
  <transition class="DIALOGFAG" name="dialog">
    <section v-if="modelValue" :id="currIndex" :style="{'z-index':currIndex}" class="fixed at0 al0 ab0 ar0">
      <section ref="digModel" v-if="isModel" @click="closeWin(true)" :style="{'z-index':currIndex}" :class="bcOpacity" class="zi-100 nodarg dialog__overlay flex w-all h-all"></section>
      <section ref="digmain" :class="{[opacity]:opacity,'bc-fff':!opacity}" class="zi-120  dialog__content sha-card flex-line fd-c abs wi-250 ra-3 m-auto">
        <svg v-if="!isHeader" class="abs at-32 ar-32 hand nodarg" @click.stop="closeWin" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="34" height="34">
          <path
            d="M589.531429 512l129.243428-129.170286a54.857143 54.857143 0 1 0-77.531428-77.531428L511.926857 434.322286 382.829714 305.225143a54.857143 54.857143 0 1 0-77.531428 77.531428l129.097143 129.243429-129.170286 129.170286a54.857143 54.857143 0 1 0 77.531428 77.531428l129.243429-129.097143 129.170286 129.170286a54.857143 54.857143 0 1 0 77.531428-77.531428L589.677714 511.926857zM512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z"
            fill="#fff"></path>
        </svg>
        <!-- 头部 -->
        <div ref="hearder" v-if="isHeader" :class="{'bc-f2':!opacity}" style="cursor: move;border-top-left-radius: 3px;border-top-right-radius: 3px;" class="noselect ai-c pl10 jc-b flex w-all h-45">
          <span :class="{'fc-fff':opacity}" class="fs-15" v-html="title"></span>
          <span @click.stop="closeWin" :class="{'fc-fff':opacity,'fc-888':!opacity}" class="hand fc-888 hand nodarg fs-18 pp10">✖</span>
        </div>
        <!-- 内容 -->
        <div class="flex-1 w-all">
          <slot></slot>
        </div>
        <!-- 底部 -->
        <slot name="footer"></slot>
      </section>
    </section>
  </transition>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref, watch } from "vue";

const ps = defineProps({
  // 内容区以外是否可以点击关闭
  fullClose: { default: true, type: Boolean },
  // 是否显示标题头
  isHeader: { default: true, type: Boolean },
  //显示遮罩层？
  isModel: { default: true, type: Boolean },
  // 宽度
  width: { default: "", type: [String, Number] },
  // 宽度
  maxHeight: { default: "", type: [String, Number] },
  minWidth: { default: "", type: [String, Number] },
  // 透明度 传样式 如：ba-6
  opacity: { default: "", type: String },
  // 透明度 传样式 如：ba-6
  bcOpacity: { default: "ba-4", type: String },
  // 高度
  zindex: { default: 9000, type: [String, Number] },
  // 标题可以是html 如<span class='red'>标题</span>
  title: { default: '标题', type: String },
  modelValue: { default: '' }
})

const emit = defineEmits(["update:modelValue", "change"]);

const isMove = ref(false);
const currIndex = ref(ps.zindex);
const mWidth = ref(0);
const mHeight = ref(0);

const digmain = ref(null)
const hearder = ref(null)
const digModel = ref(null)

function initDig() {
  mWidth.value = digmain?.value?.offsetWidth || 0;
  mHeight.value = digmain?.value?.offsetHeight || 0;
  if (!ps.isHeader) return;
  setDigIndex();
  if (ps.modelValue && hearder) {
    hearder?.value.addEventListener('mousedown', e => {
      if (e.button === 0) { // 鼠标左键按下
        let x = e.pageX - digmain.value.offsetLeft;  // 鼠标与窗口边框距离
        let y = e.pageY - digmain.value.offsetTop;
        let maxW = window.innerWidth; // 最大拖动位置（不能拖离页面可视区）
        let maxH = window.innerHeight;

        document.onmousemove = (e) => { // 鼠标移动
          isMove.value = true;
          let loginX = e.pageX;
          let loginY = e.pageY;
          if (loginX < 0) loginX = 0;
          if (loginX > maxW) loginX = maxW;
          if (loginY < 0) loginY = 0;
          if (loginY > maxH) loginY = maxH;
          digmain.value.style.left = loginX - x + 'px';
          digmain.value.style.top = loginY - y + 'px';
        }
        document.onmouseup = (el) => {  // 鼠标抬起，清除鼠标移动事件
          document.onmousemove = null;
        }
      }
    })
  }
}

function initgetBodyStyle() {
  let mwidth = mWidth.value;
  if (ps.width) {
    if (ps.width.includes('%')) {
      mwidth = document.documentElement.clientWidth * (Number(ps.width.replace(/[^\d]/g, "")) / 100)
    } else {
      mwidth = ps.width.replace(/[^\d]/g, '');
    }
  }
  if (mwidth < 250) {
    mwidth = 250;
  }
  let left = document.documentElement.clientWidth / 2 - Number(mwidth) / 2;
  let top = document.documentElement.clientHeight / 2 - Number(mHeight.value) / 2;
  if (ps.width) {
    digmain.value.style.top = top * 0.65 + 'px';
    digmain.value.style.left = left + 'px';
    digmain.value.style.width = mwidth + 'px';
  } else {
    digmain.value.style.top = top * 0.65 + 'px';
    digmain.value.style.left = left + 'px';
  }

  if (ps.minWidth) {
    if (ps.minWidth.includes('%')) {
      digmain.value.style.minWidth = ps.minWidth;
    }
    digmain.value.style.minWidth = Number(ps.minWidth.replace(/[^\d]/g, "")) + 'px';
  }
}

function setDigIndex() {
  let dig: any = document.getElementsByClassName('DIALOGFAG');
  let maxZindex: any = ps.zindex;
  if (ps.modelValue) {
    if (dig.length) {
      for (let i = 0; i < dig.length; i++) {
        dig[i].children[0].style.display = "none";
        if (maxZindex < parseInt(dig[i].style.zIndex)) {
          maxZindex = parseInt(dig[i].style.zIndex);
        }
      }
    }
    if (!currIndex.value) {
      currIndex.value = parseInt(maxZindex) + 1;
    }
    digModel.value.style.display = "";
  } else {
    if (dig.length > 1) {
      let ids: any = [];
      for (let i = 0; i < dig.length; i++) {
        dig[i].children[0].style.display = "none";
        ids.push({ id: parseInt(dig[i].id), index: i });
      }
      let item = ids.sort((a, b) => { return a.id - b.id })[ids.length - 2];
      dig[item.index].children[0].style.display = "";
    }
  }
}

function closeWin(flg) {
  if (flg && !ps.fullClose) return;
  emit('update:modelValue', false)
  emit('change', false)
}

watch(() => ps.modelValue, (news, old) => {
  if (news) {
    document.body.className = document.body.className + ' hideScrol';
    nextTick(() => {
      initDig()
    }).then(() => {
      initgetBodyStyle()
    })
  } else {
    document.body.className = document.body.className.replace(' hideScrol', "");
    nextTick(() => {
      setDigIndex()
    })
  }
})

onMounted(() => {
  if (ps.modelValue) {
    document.body.className = document.body.className + ' hideScrol';
    nextTick(() => {
      initDig()
    }).then(() => {
      initgetBodyStyle()
    })
  }
})

</script>

<style lang='less'>
.hideScrol {
  height: 100vh;
  overflow: hidden;
}

.dialog-enter-active {
}
.dialog-leave-active {
  transition: all 0.2s;
}
.dialog-enter-active .dialog__content {
}
.dialog-leave-active .dialog__content {
  top: 0;
  left: 0;
  transition: all 0.2s;
}
.dialog-enter .dialog__content,
.dialog-leave-to .dialog__content {
  transform: scale3d(0.1, 0.1, 0.1);
}
.dialog-enter,
.dialog-leave-to {
  opacity: 0;
}
</style>