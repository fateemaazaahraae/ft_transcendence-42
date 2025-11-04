import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['carole-condescensive-lillie.ngrok-free.dev'],
    host: true,
    port: 5173,
    fs: {
      strict: false,
    },
  },
  build: {
    rollupOptions: {},
  },
  optimizeDeps: {},
  appType: "spa",
});