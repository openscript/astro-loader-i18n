import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "astro-loader-i18n",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["astro/loaders", "astro:content"],
      output: {
        globals: {
          "astro/loaders": "astroLoaders",
          "astro:content": "astroContent",
        },
      }
    }
  }
});
