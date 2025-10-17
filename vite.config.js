import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
  host: '0.0.0.0',
  port: 5173,
  allowedHosts: 'all',
  fs: { strict: false },
  strictPort: false,       // optional, allows auto port fallback
  hmr: {
    host: 'involuntarily-unsynthetic-erick.ngrok-free.dev', // ngrok URL
    protocol: 'wss',        // use websocket secure for HMR
  }
},

  build: {
    rollupOptions: {},
  },
  optimizeDeps: {},
  appType: "spa",
});
