// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // 👈 important — allows external access
    allowedHosts: [
      'involuntarily-unsynthetic-erick.ngrok-free.dev' // 👈 add your ngrok domain here
    ],
    port: 5173
  }
})
