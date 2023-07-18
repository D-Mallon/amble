import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: '/var/www/ucdSummerProject/src/main.jsx',
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  base: '/static/', // assets path will be /static/
})

// this version was working on 18 July but trying to fix newyork images routing issues and set base url for assets to static
// export default {
//  build: {
//    rollupOptions: {
//      input: '/var/www/ucdSummerProject/src/main.jsx', 
//      output: {
//       entryFileNames: '[name].js',
//        chunkFileNames: '[name].js',
//        assetFileNames: '[name].[ext]'
//      }
//    }
//  }
//}

