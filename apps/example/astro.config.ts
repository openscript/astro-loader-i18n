// @ts-check
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import { C } from "./src/site.config";

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
  },
  i18n: {
    defaultLocale: C.DEFAULT_LOCALE,
    locales: C.LOCALES,
  },
  integrations: [mdx()],
});
