import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://3.6.44.45:5004",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://3.6.44.45:5004",
        changeOrigin: true,
        secure: false,
      },
      "/temp": {
        target: "http://3.6.44.45:5004",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})