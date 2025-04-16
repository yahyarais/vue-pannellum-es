import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ command }) => {
  const config = {
    plugins: [vue()],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/vue-pannellum-es.vue'),
        name: 'VuePannellum',
        fileName: (format) => `vue-pannellum-es.${format}.js`,
      },
      rollupOptions: {
        external: ['vue', 'pannellum'],
        output: {
          globals: {
            vue: 'Vue',
            pannellum: 'pannellum'
          }
        }
      },
    }
  }

  if (command === 'serve') {
    config.root = 'demo'
  }

  return config
})