import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [vue(),

  ],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'), // добавляем алиас для src
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',  // теперь экспортируем всё из src/index.ts
      name: 'MonoJS',
      fileName: 'mono',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      plugins: [
      visualizer({
        filename: './dist/bundle-visualizer.html', // Путь для сохранения визуализации
        open: false,                               // Автоматически открывать отчет после сборки
      })],
      external: ['vue', 'quasar'],
      output: {
        globals: {
          vue: 'Vue',
          quasar: 'Quasar'
        }
      }
    }
  }
});
