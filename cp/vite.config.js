import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'


// https://vitejs.dev/config/
export default defineConfig({
  assetsDir: ['public'],
  outDir: './',
  base: '/gaiko-souba',
  plugins: [
    vue({
      template: {
        
      },
    }),
    VitePluginBrowserSync()
  ],
  resolve: {
    alias: [
      {
        // '@': resolve(__dirname, '/src'),
        find: '@',
        replacement: '/src',
      }
    ]
  },
  build: {
    outDir: '../../../',
    rollupOptions: {
      input: '/src/main.js',
      // manualChunks(id) {
      //   if (id.includes('node_modules')) {
      //       return id.toString().split('node_modules/')[1].split('/')[0].toString();
      //   }
      // },
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: `assets/[ext]/[name].[ext]`,
      },
    },
  },
  configureServer: app => {
    app.use(
      require("sass").middleware({
        src: __dirname,
        dest: __dirname,
        outputStyle: "compressed",
        prefix: "/",
      })
    );
  },
});
