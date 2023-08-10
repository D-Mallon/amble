import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import vitePluginFaviconsInject from "vite-plugin-favicons-inject";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directory for Vite build - DM trialling fix 7Aug
    // trialling removal of this - outDir: "/var/www/ucdSummerProject/backend/static",
    rollupOptions: {
      input: "/var/www/ucdSummerProject/src/main.jsx",
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    // incoming changes commented out below by David
    // https://vitejs.dev/config/
    // export default defineConfig({
    //   plugins: [
    //     react(),
    //   ],
    //   publicDir: './public',
    //   optimizeDeps: {
    //     exclude: []
  },
  base: "/static/", // assets path will be /static/
});
  // this below was commented out by David for server
  // publicDir: './public',
  // optimizeDeps: {
  //   exclude: []
  // },
  //this above was commented out by David. Below was already commented out
  // build: {
  //   // generate manifest.json in outDir
  //   manifest: true,
  //   rollupOptions: {
  //     // overwrite default .html entry
  //     input: '/path/to/main.js',
  //   },
  // },

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
