// @ts-check
import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
  },
  outDir: "../../dist/apps/example",
  i18n: {
    locales: ['de-CH', 'zh-CN'],
    defaultLocale: 'de-CH',
  },
  integrations: [
    mdx(),
  ],
});
