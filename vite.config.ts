import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    allowedHosts: [
      "cine-sage-recommends.onrender.com", // 👈 add your Render domain
    ],
    port: 8080, // keep same as preview
  },
  preview: {
    allowedHosts: [
      "cine-sage-recommends.onrender.com", // 👈 also add here
    ],
    port: 8080,
  },
});