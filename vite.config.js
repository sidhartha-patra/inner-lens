import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Relative base so the build works at any path (e.g. GitHub Pages project site).
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      // This package's package.json `main` omits the .js extension and its `module`
      // field points at a non-published src/ dir — point Vite straight at the dist build.
      "circular-natal-horoscope-js": fileURLToPath(
        new URL("./node_modules/circular-natal-horoscope-js/dist/index.js", import.meta.url)
      ),
    },
  },
  optimizeDeps: {
    include: ["@astrodraw/astrochart"],
  },
  build: {
    outDir: "dist",
    target: "es2020",
    chunkSizeWarningLimit: 1500,
  },
  server: { port: 5173 },
});
