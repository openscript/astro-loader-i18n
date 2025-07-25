/// <reference types="vitest" />
import { defineConfig } from "vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import dts from "vite-plugin-dts";
import { codecovVitePlugin } from "@codecov/vite-plugin";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/libs/astro-loader-i18n",
  plugins: [
    nxViteTsPaths(),
    dts({ entryRoot: "src", tsconfigPath: "tsconfig.lib.json" }),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "astro-loader-i18n",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: "src/astro-loader-i18n.ts",
      name: "astro-loader-i18n",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["astro/loaders", "astro/zod"],
      output: {
        globals: {
          "astro/loaders": "astroLoaders",
          "astro/zod": "astroZod",
        },
      },
    },
  },

  test: {
    globals: true,
    environment: "node",
    coverage: {
      reportsDirectory: "./coverage",
    },
    reporters: ["verbose"],
    include: ["test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
