import { createApp } from 'vue';
import App from './App.vue'
import { router } from './router';
import { createPinia } from 'pinia';
import "@css/pc.less";
const app=createApp(App);
import module from "./module";
module(app);
app.use(router).use(createPinia()).mount('#app');
