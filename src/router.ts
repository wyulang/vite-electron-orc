import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('./page/index.vue'),
    name: 'index'
  },
  {
    path: '/video',
    component: () => import('./page/video.vue'),
    name: 'video'
  },
  {
    path: '/video/heji',
    component: () => import('./page/video.heji.vue'),
    name: 'video.heji'
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});