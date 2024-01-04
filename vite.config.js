import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { proxy } from './api-proxy.config.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
	server: {
      proxy,
    },	
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/main.js'),
        name: 'USGolfers',
        // the proper extensions will be added
        fileName: 'assets',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
          },
        },
      },
    },
  });
