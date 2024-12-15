import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import electron from "vite-plugin-electron";
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },
  plugins: [
    vue(),
    electron({
      entry: 'electron/index.ts',
      vite:{
        build:{
          outDir:"www"
        }
      }
    }),
  ],
  build:{
    outDir:"www"
  },
  server: {
    host: true, // 指定服务器主机名
    port: 3009, // 指定服务器端口
    hmr: true,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve('src'),
      },
      {
        find: '@css',
        replacement: path.resolve('css'),
      },
      {
        find: '@packages',
        replacement: path.resolve('packages'),
      },
      {
        find: '@lib',
        replacement: path.resolve('lib'),
      },
    ]
  },
})
