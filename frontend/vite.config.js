import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "frontend", // <-- add this
      "localhost",
      "0.0.0.0",
    ],
    host: true, // already listens on all interfaces
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