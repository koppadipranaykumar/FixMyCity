import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",

    allowedHosts: [
      "c0c679cd-f0e6-47aa-ba87-f6e48d432c3d-00-3rikrql6o8jgs.sisko.replit.dev"
    ],

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});