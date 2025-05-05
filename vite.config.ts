
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add optimizeDeps to resolve the Three.js version conflict
  optimizeDeps: {
    include: ['three'],
  },
  // Make sure we're using the correct version of Three.js
  build: {
    commonjsOptions: {
      include: [/three/, /node_modules/],
    },
  },
}));
