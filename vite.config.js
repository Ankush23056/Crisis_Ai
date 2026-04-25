import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Minify with esbuild (Vite default) — fast and produces small output.
    minify: "esbuild",

    // Emit source maps so stack traces in Sentry / DevTools are readable.
    sourcemap: true,

    // Raise the chunk-size warning threshold to 600 kB (leaflet is large).
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor code into a separate chunk for better long-term caching.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Leaflet is large — keep it in its own chunk.
            if (id.includes("leaflet")) return "leaflet";
            // Google GenAI SDK in its own chunk.
            if (id.includes("@google/genai")) return "genai";
            // All other node_modules go into a shared vendor chunk.
            return "vendor";
          }
        },
      },
    },
  },
});

