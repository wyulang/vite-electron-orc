<template>
  <section :class="className" v-if="type==1" class="flex-line ai-c loadOne jc-c fd-c">
    <div :style="loadStyle" class="ring"></div>
    <span v-html="message" class="fs-14 message nowrap"></span>
  </section>

  <section :class="className" v-if="type==2" class="flex-line ai-c rel loadtwo jc-c fd-c">
    <div :style="loadStyle" class="loader flex ai-c jc-c ra-100"></div>
    <span v-html="message" class="fs-14 message nowrap abs absc"></span>
  </section>

  <section :class="className" v-if="type==3" class="loadthree">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </section>

  <section :class="className" v-if="type==4" class="flex-line rel">
    <div :style="loadStyle" class="loadfore rel ra-100">
      <div class="w-7 h-7 at-7 absl abs ra-100 bc-primary"></div>
    </div>
    <span class="fs-14 message nowrap abs absc">{{message}}</span>
  </section>

  <section :class="className" v-if="type==5" class="ra-5 ba-3 mb50 flex-line pt10 pb10 pl15 pr15 fd-c jc-c ai-c">
    <svg style="fill:#fff" class="w-50 loadfire h-50" viewBox="0 0 1024 1024">
      <path
        d="M772.86 221.677a54.351 54.351 0 1 0 108.702 0 54.351 54.351 0 1 0-108.702 0zM873.818 515.4a67.087 67.087 0 1 0 134.174 0 67.087 67.087 0 1 0-134.174 0zM750.78 810.595a78.975 78.975 0 1 0 157.95 0 78.975 78.975 0 1 0-157.95 0zM443.345 928.641a91.487 91.487 0 1 0 182.973 0 91.487 91.487 0 1 0-182.973 0zM141.878 805.955a101.902 101.902 0 1 0 203.805 0 101.902 101.902 0 1 0-203.805 0zM428.769 107.87a107.854 107.854 0 1 0 215.709 0 107.854 107.854 0 1 0-215.709 0zM135.926 224.22a107.854 107.854 0 1 0 215.709 0 107.854 107.854 0 1 0-215.71 0zM26.664 512.008a102.766 102.766 0 1 0 205.532 0 102.766 102.766 0 1 0-205.532 0z">
      </path>
    </svg>
    <span class="fs-14 message fc-fff mt7 nowrap">{{message}}</span>
  </section>

  <section v-if="type==6" class="loadfix">
    <div></div>
    <div></div>
  </section>

  <div v-if="type==7" class="loader">
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
  </div>
</template>

<script setup lang='ts'>
import { computed, getCurrentInstance, nextTick, onMounted, onUpdated, ref } from "vue";
const { proxy } = getCurrentInstance();
const ps = defineProps({
  target: { type: String, default: '' },
  // 加载内容
  message: { type: String, default: '加载中...' },
  // 显示类型
  type: { type: [String, Number], default: 7 },
  // 图标显示颜色
  color: { type: Array, default: [] },
  // 透明度
  background: { type: String, default: "" },
  // 样式
  className: { type: String, default: "" }
})

const loadWidth = ref(0);

const loadStyle = computed(() => {
  return {
    'width': `${loadWidth.value + 30}px`,
    'height': `${loadWidth.value + 30}px`,
  }
})

// const dom: Ref<HTMLElement | null> = ref(null)

function initSpinner() {

  nextTick(() => {
    let message =proxy?.$el.parentElement.querySelector('.message');
    if (message) {
      loadWidth.value = message.clientWidth;
    }
  })
}

onMounted(() => {
  initSpinner()
})

onUpdated(() => {
  initSpinner();
})

</script>

<style lang='less'>
.__loading-content {
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .loadfix {
    margin: 0 auto;
    padding-bottom: 15px;
    width: 60px;
    height: 60px;
    position: relative;
    text-align: center;
    -webkit-animation: rotate 2s infinite linear;
    animation: rotate 2s infinite linear;
    div {
      content: "";
      width: 60%;
      height: 60%;
      display: inline-block;
      position: absolute;
      top: 0;
      background-color: #ff0400;
      border-radius: 100%;
      -webkit-animation: bounce 2s infinite ease-in-out;
      animation: bounce 2s infinite ease-in-out;
    }
    div:nth-child(2) {
      top: auto;
      bottom: 0px;
      background-color: #00d1ff;
      -webkit-animation-delay: -1s;
      animation-delay: -1s;
    }

    @-webkit-keyframes rotate {
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes rotate {
      100% {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
      }
    }

    @keyframes bounce {
      0%,
      100% {
        transform: scale(0);
        -webkit-transform: scale(0);
      }
      50% {
        transform: scale(1);
        -webkit-transform: scale(1);
      }
    }
  }
  .loadfire {
    animation: fore 2.5s infinite linear;
    @keyframes fore {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .loadfore {
    border: 7px solid rgb(236, 236, 236);
    animation: fore 1.5s infinite linear;
    @keyframes fore {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .dot {
      width: 5px;
      height: 5px;
    }
  }
  .loadthree {
    width: 50px;
    height: 50px;
    transform: translate(-50%, -50%);
    span {
      position: absolute;
      border: 0px;
      margin: 0px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      animation: anim 2s ease infinite;
      &:first-child {
        background-color: #3498db;
        animation-delay: -1.5s;
      }

      &:nth-child(2) {
        background-color: #2ecc71;
        animation-delay: -1s;
      }

      &:nth-child(3) {
        background-color: #9b59b6;
        animation-delay: -0.5s;
      }

      &:last-child {
        background-color: #e74c3c;
      }

      @keyframes anim {
        0%,
        100% {
          transform: translate(0);
        }
        25% {
          transform: translate(170%);
        }
        50% {
          transform: translate(170%, 170%);
        }
        75% {
          transform: translate(0, 170%);
        }
      }
    }
  }
  .loadtwo {
    .loader {
      background: transparent;
      border: 5px solid #d2e5ff;
      border-top: 5px solid #005dde;
      animation: loaders 2s linear infinite;
    }
    @keyframes loaders {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .loadOne {
    .ring {
      position: absolute;
      // width: 100px;
      // height: 100px;
      border-radius: 50%;
      animation: ring 2s linear infinite;
    }
    @keyframes ring {
      0% {
        transform: rotate(0deg);
        box-shadow: 1px 5px 2px #e65c00;
      }
      50% {
        transform: rotate(180deg);
        box-shadow: 1px 5px 2px #18b201;
      }
      100% {
        transform: rotate(360deg);
        box-shadow: 1px 5px 2px #0456c8;
      }
    }
    .ring:before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    }
    span {
      color: #737373;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 200px;
      animation: text 3s ease-in-out infinite;
    }
    @keyframes text {
      50% {
        color: black;
      }
    }
  }

.loader {
  width: 132px;
  height: 132px;
  // background-color: #00000033;
  padding: 10px;
}

.box1,
.box2,
.box3 {
  box-sizing: border-box;
  position: absolute;
  display: block;
  border-radius: 3px;
  opacity: 0.7;
}

.box1 {
  border: 6px solid #e65c00;
  width: 56px;
  height: 24px;
  margin-top: 32px;
  margin-left: 0px;
  animation: abox1 -0.1s 3s forwards ease-in-out infinite;
}

/* Visit https://democoding.in/ for more free css animation */

.box2 {
  border: 6px solid #18b201;
  width: 24px;
  height: 24px;
  margin-top: 0px;
  margin-left: 0px;
  animation: abox2 -0.1s 3s forwards ease-in-out infinite;
}

.box3 {
  border: 6px solid #0456c8;
  width: 24px;
  height: 24px;
  margin-top: 0px;
  margin-left: 32px;
  animation: abox3 -0.1s 3s forwards ease-in-out infinite;
}

@keyframes abox1 {
  0% {
    width: 56px;
    height: 24px;
    margin-top: 32px;
    margin-left: 0px;
  }

  12.5% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 0px;
  }

  25% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 0px;
  }

  37.5% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 0px;
  }

  50% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 0px;
  }

  62.5% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 0px;
  }

  75% {
    width: 24px;
    height: 56px;
    margin-top: 0px;
    margin-left: 0px;
  }

  87.5% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 0px;
  }

  100% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 0px;
  }
}

@keyframes abox2 {
  0% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 0px;
  }

  12.5% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 0px;
  }

  25% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 0px;
  }

  37.5% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 0px;
  }

  50% {
    width: 56px;
    height: 24px;
    margin-top: 0px;
    margin-left: 0px;
  }

  62.5% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 32px;
  }

  75% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 32px;
  }

  87.5% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 32px;
  }

  100% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 32px;
  }
}

@keyframes abox3 {
  0% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 32px;
  }

  12.5% {
    width: 24px;
    height: 24px;
    margin-top: 0px;
    margin-left: 32px;
  }

  25% {
    width: 24px;
    height: 56px;
    margin-top: 0px;
    margin-left: 32px;
  }

  37.5% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 32px;
  }

  50% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 32px;
  }

  62.5% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 32px;
  }

  75% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 32px;
  }

  87.5% {
    width: 24px;
    height: 24px;
    margin-top: 32px;
    margin-left: 32px;
  }

  100% {
    width: 56px;
    height: 24px;
    margin-top: 32px;
    margin-left: 0px;
  }
}
}
</style>