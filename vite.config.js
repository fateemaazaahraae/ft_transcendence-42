import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, svelte, etc.

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'sabrina-lateenrigged-unapprehensively.ngrok-free.dev' // 👈 your ngrok domain
    ],
    host: true, // 👈 allows access from external devices
    port: 5173  // 👈 make sure this matches your dev port
  }
})
