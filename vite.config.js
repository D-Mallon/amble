import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginFaviconsInject('./vite.svg'),
  ],
  publicDir: './public',
  optimizeDeps: {
    exclude: []
  },
  // build: {
  //   // generate manifest.json in outDir
  //   manifest: true,
  //   rollupOptions: {
  //     // overwrite default .html entry
  //     input: '/path/to/main.js',
  //   },
  // },
})
