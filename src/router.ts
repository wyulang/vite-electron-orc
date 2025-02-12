import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('./page/index.vue'),
    name: 'index',
    meta:{
      keep:false
    }
  },
  {
    path: '/timu',
    component: () => import('./page/timu.vue'),
    name: 'timu',
    meta:{
      keep:true
    }
  },
  {
    path: '/capture',
    component: () => import('./page/capture.vue'),
    name: 'capture',
    meta:{
      keep:true
    }
  },
  {
    path: '/video',
    component: () => import('./page/video.vue'),
    name: 'video',
    meta:{
      keep:true
    }
  },
  {
    path: '/video/heji',
    component: () => import('./page/video.heji.vue'),
    name: 'video.heji',
    meta:{
      keep:true
    }
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});