import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: "/rrresults/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        review: resolve(__dirname, 'observations-review.html')
      }
    }
  }
})