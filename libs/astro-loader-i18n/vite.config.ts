import { defineConfig } from "vite";
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/astro-loader-i18n',
  plugins: [nxViteTsPaths(), dts({ entryRoot: "src", tsconfigPath: path.join(__dirname, "tsconfig.lib.json") })],
  build: {
    outDir: '../../dist/libs/astro-loader-i18n',
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
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
      }
    }
  },

  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reportsDirectory: '../../coverage/libs/astro-loader-i18n',
    },
    reporters: ['verbose'],
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
