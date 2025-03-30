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
    locales: C.LOCALES,
    defaultLocale: C.DEFAULT_LOCALE,
  },
  integrations: [mdx()],
});
