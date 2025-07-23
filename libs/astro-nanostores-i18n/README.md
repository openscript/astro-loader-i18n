# astro-nanostores-i18n

[![NPM Downloads](https://img.shields.io/npm/dw/astro-nanostores-i18n)](https://npmjs.org/astro-nanostores-i18n)
[![npm bundle size](https://img.shields.io/bundlephobia/min/astro-nanostores-i18n)](https://npmjs.org/astro-nanostores-i18n)

`astro-nanostores-i18n` is an integration of [@nanostores/i18n](https://github.com/nanostores/i18n) into [Astro](https://astro.build/).

## Usage

1. Install the package `astro-nanostores-i18n`:
   <details open>
    <summary>npm</summary>

    ```bash
    npm install astro-nanostores-i18n
    ```
   </details>
   <details>
     <summary>yarn</summary>

     ```bash
     yarn add astro-nanostores-i18n
     ```
   </details>
   <details>
     <summary>pnpm</summary>

     ```bash
     pnpm add astro-nanostores-i18n
     ```
   </details>
1. Add the integration to your `astro.config.mjs`:

   ```javascript
   import { defineConfig } from 'astro/config';
   import nanostoresI18n from 'astro-nanostores-i18n';

   export default defineConfig({
     integrations: [nanostoresI18n()],
   });
   ```

### Extracting translations

## Resources

- https://lou.gg/blog/astro-integrations-explained
- https://hideoo.dev/notes/starlight-plugin-share-data-with-astro-runtime/
