import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "singlefile" ? [viteSingleFile()] : [])],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build:
    mode === "singlefile"
      ? { outDir: "dist-preview" }
      : {
          // Split rarely-changing vendor code and the large geo/country datasets out of the app chunk
          // so they cache across deploys.
          chunkSizeWarningLimit: 700,
          rollupOptions: {
            output: {
              manualChunks: (id) => {
                if (!id.includes("node_modules")) return;
                if (/world-atlas|world-countries|topojson|d3-/.test(id)) return "geo";
                if (/react-dom|react-router|scheduler|\/react\//.test(id)) return "react";
                if (/framer-motion|motion-dom|motion-utils/.test(id)) return "motion";
                if (/i18next|fuse\.js|zustand|@tanstack|lucide-react/.test(id)) return "vendor";
              },
            },
          },
        },
}));
