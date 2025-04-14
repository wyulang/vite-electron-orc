import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('./page/index.vue'),
    name: 'index'
  },
  {
    path: '/ai',
    component: () => import('./page/ai.vue'),
    name: 'ai'
  },
  {
    path: '/video',
    component: () => import('./page/video.vue'),
    name: 'video',
    meta: {
      keep: true
    }
  },
  {
    path: '/video/heji',
    component: () => import('./page/video.heji.vue'),
    name: 'video.heji',
    meta: {
      keep: true
    }
  },
  {
    path: '/tiku',
    component: () => import('./page/tiku.vue'),
    name: 'tiku',
    meta: {
      keep: true
    }
  },
  {
    path: '/english',
    component: () => import('./page/english.vue'),
    name: 'english',
    meta: {
      keep: true
    }
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});