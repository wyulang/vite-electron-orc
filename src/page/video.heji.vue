<template>
  <div class="w-all flex pl15 h-all fd-c pr5">
    <div class="flex h-33 pt10 ai-c">
      <span class="fs-13 fb">合集</span>
    </div>

    <div class="flex h-all">
      <scroll>
        
      </scroll>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import yy from '@lib/mixin';
import useStore from '../store';
const st = useStore();

function initData(){
  
}
</script>

<style lang='less'>
</style>