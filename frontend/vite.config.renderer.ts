import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    ssr: true,
    outDir: "renderer",
    lib: {
      entry: path.resolve(__dirname, "render-posts.ts"),
      formats: ["es"],
      fileName: () => "render-posts.js",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-dom/server",
        "fs",
        "path",
        "dotenv",
        "react-markdown",
      ],
    },
    cssMinify: true,
    copyPublicDir: false
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
