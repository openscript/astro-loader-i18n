# astro-loader-i18n

[![codecov](https://codecov.io/github/openscript/astro-loader-i18n/graph/badge.svg?token=O2UYXUDEOT)](https://codecov.io/github/openscript/astro-loader-i18n)
[![NPM Downloads](https://img.shields.io/npm/dw/astro-loader-i18n)](https://npmjs.org/astro-loader-i18n)
[![npm bundle size](https://img.shields.io/bundlephobia/min/astro-loader-i18n)](https://npmjs.org/astro-loader-i18n)

`astro-loader-i18n` is a **content loader** for internationalized content in [Astro](https://astro.build). It builds on top of Astro’s [`glob()` loader](https://docs.astro.build/en/reference/content-loader-reference/#glob-loader) and helps manage translations by detecting locales, mapping content, and enriching `getStaticPaths`.


## Features

### ✅ Automatic locale detection

- Extracts locale information from file names or folder structures:
  <details>
    <summary>📂 Folder structure example</summary>

    ```plaintext
    . (project root)
    ├── README.md
    └── src
        └── content
            └── pages
                ├── de-CH
                │   ├── about.mdx
                │   └── projects.mdx
                └── zh-CN
                    ├── about.mdx
                    └── projects.mdx
    ```
  </details>
  <details>
    <summary>📄 File name suffix example</summary>

    ```plaintext
    . (project root)
    └── src
        └── content
            └── pages
                ├── about.de-CH.mdx
                ├── about.zh-CN.mdx
                ├── projects.de-CH.mdx
                └── projects.zh-CN.mdx
    ```
  </details>

### ✅ Translation mapping
- Generates a common translation identifier to easily match different language versions of content.

### ✅ Schema support
- Provides predefined schemas for `content.config.ts`
  - Loader schema: `i18nLoaderSchema`
  - In-file schema: `i18nInfileSchema`

### ✅ `getStaticPaths()` helpers included
- Includes helper utilities to streamline the creation of localized routes.

## Usage

1. Install the package `astro-loader-i18n`:
   <details open>
    <summary>npm</summary>

    ```bash
    npm install astro-loader-i18n
    ```
   </details>
   <details>
     <summary>yarn</summary>

     ```bash
     yarn add astro-loader-i18n
     ```
   </details>
   <details>
     <summary>pnpm</summary>

     ```bash
     pnpm add astro-loader-i18n
     ```
   </details>

1. Configure locales and default locale in your `astro.config.mjs`:

   ```typescript
   import { defineConfig } from "astro/config";

   export default defineConfig({
     i18n: {
       locales: ["de-CH", "zh-CN"],
       defaultLocale: "de-CH",
     },
   });
   ```

1. Define a collection in your `content.config.ts` using `astro-loader-i18n`:

   ```typescript
   import { i18nLoader, i18nLoaderSchema } from 'astro-loader-i18n';
   import { defineCollection, z } from 'astro:content';

   const pages = defineCollection({
     loader: i18nLoader({
       pattern: "**/*.mdx",
       base: "src/content/pages",
     }),
     schema: i18nLoaderSchema.object({
       title: z.string(),
     }),
   });

   export const collections = { pages };
   ```

1. Create content files in the defined structure:
   > ⚠️ WARNING
   > The content files need to be structured according to the in `astro.config.mjs` defined locales.

   ```
   . (project root)
   └── src
       └── content
           └── pages
               ├── de-CH
               │   ├── about.mdx
               │   └── projects.mdx
               └── zh-CN
                   ├── about.mdx
                   └── projects.mdx
   ```

1. Retrieve the locale and common translation identifier during rendering:

   ```typescript
   import { getCollection } from "astro:content";

   const pages = await getCollection("pages");
   ```

1. Use the `getStaticPaths()` helper to generate localized routes:

   ```typescript
   import { getStaticPaths } from "astro-loader-i18n";

   export async function getStaticPaths() {
     const pages = await getCollection("pages");
     return getStaticPaths(pages);
   }
   ```

### Infile content

Sometimes to have multilingual content in a single file is more convenient. For example menus or galleries. This allows sharing untranslated content across locales.

Use the standard `glob()` loader to load infile i18n content.

```
. (project root)
└── src
    └── content
        └── navigation
            ├── footer.yml
            └── main.yml
```

```yaml
# src/content/navigation/main.yml
de-CH:
  - path: /projekte
    title: Projekte
  - path: /ueber-mich
    title: Über mich
zh-CN:
  - path: /zh/projects
    title: 项目
  - path: /zh/about-me
    title: 关于我
```
