// @ts-check
import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
  },
  integrations: [
    mdx(),
  ],
});
