import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import CopyPlugin from "vite-copy-plugin";
import { join } from 'path'
import path from 'path';
import electron from "vite-plugin-electron/simple";
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            outDir: "wwww"
          }
        }
      },
      preload: {
        input: {
          preload: 'electron/store/index.ts'
        },
        vite: {
          build: {
            outDir: "wwww/assets"
          }
        }
      }
    }),
    // CopyPlugin([
    //   // 目录复制
    //   {from: 'generated/client', to: 'wwww/generated/client'},
    //   {from: 'prisma/xiaoxuebao.db', to: 'wwww/generated/client/xiaoxuebao.db'},
    // ])
  ],
  build: {
    outDir: "wwww",
    rollupOptions: {
      external: ['electron'],
    },
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
