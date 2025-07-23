// @ts-check
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import { C } from "./src/site.config";
import nanostoresI18n from "astro-nanostores-i18n";
import zhCN from "./src/translations/zh-CN.json";

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
  },
  i18n: {
    defaultLocale: C.DEFAULT_LOCALE,
    locales: C.LOCALES,
  },
  integrations: [
    mdx(),
    nanostoresI18n({
      translations: {
        "zh-CN": zhCN,
      },
      addMiddleware: true,
    }),
  ],
});
