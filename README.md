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
- Generates a translation identifier to easily match different language versions of content.

### ✅ Schema support
- Provides predefined schemas for `content.config.ts`
  - Loader schema: `i18nLoaderSchema`
  - In-file schema: `i18nInfileSchema`
- Adds a `translationId` and `locale` to each content item.

### ✅ `getStaticPaths()` helpers included
- Includes a helper utility called `i18nPropsAndParams`
  - Helps to fill and translate URL params like `[...locale]/[files]/[slug]`, whereas `[...locale]` is the locale, `[files]` is a translated segment and `[slug]` is the slug of the title.
  - Adds a `translations` object to each entry, which contains paths to the corresponding content of all existing translations.

### ✅ Type safety
- Keeps `Astro.props` type-safe.

## Usage

1. Install the package `astro-loader-i18n` (and `limax` for slug generation):
   <details open>
    <summary>npm</summary>

    ```bash
    npm install astro-loader-i18n limax
    ```
   </details>
   <details>
     <summary>yarn</summary>

     ```bash
     yarn add astro-loader-i18n limax
     ```
   </details>
   <details>
     <summary>pnpm</summary>

     ```bash
     pnpm add astro-loader-i18n limax
     ```
   </details>

1. Configure locales, a default locale and segments for example in a file called `site.config.ts`:

   ```typescript
   export const C = {
     LOCALES: ["de-CH", "zh-CN"],
     DEFAULT_LOCALE: "de-CH" as const,
     SEGMENT_TRANSLATIONS: {
       "de-CH": {
         files: "dateien",
       },
       "zh-CN": {
         files: "files",
       },
     },
   };
   ```

1. Configure i18n in `astro.config.ts`:

   ```typescript
   import { defineConfig } from "astro/config";
   import { C } from "./src/site.config";

   export default defineConfig({
     i18n: {
       locales: C.LOCALES,
       defaultLocale: C.DEFAULT_LOCALE,
     },
   });
   ```

1. Define collections using `astro-loader-i18n` in `content.config.ts`. Don't forget to use `extendI18nLoaderSchema` or `extendI18nInfileSchema` to extend the schema with the i18n specific properties:

   ```typescript
   import { defineCollection, z } from "astro:content";
   import { extendI18nInfileSchema, extendI18nLoaderSchema, i18nLoader } from "astro-loader-i18n";
   import { glob } from "astro/loaders";
   import { C } from "./site.config";

   const filesCollection = defineCollection({
     loader: i18nLoader({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/files" }),
     schema: extendI18nLoaderSchema(
       z.object({
         title: z.string(),
       })
     ),
   });
   const folderCollection = defineCollection({
     loader: i18nLoader({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/folder" }),
     schema: z.object({
       title: z.string(),
     }),
   });
   const infileCollection = defineCollection({
     loader: glob({ pattern: "**/[^_]*.{yml,yaml}", base: "./src/content/infile" }),
     schema: extendI18nInfileSchema(
       z.array(
         z.object({
           path: z.string(),
           title: z.string()
         })
       ), C.LOCALES),
   });

   export const collections = {
     files: filesCollection,
     folder: folderCollection,
     infile: infileCollection,
   };

   ```

1. Create content files in the defined structure:
   > ⚠️ WARNING
   > The content files need to be structured according to the in `astro.config.ts` defined locales.

   ```
   . (project root)
   └── src
       └── content
           └── pages
               ├── about.de-CH.mdx
               ├── about.zh-CN.mdx
               ├── projects.de-CH.mdx
               └── projects.zh-CN.mdx
   ```

1. Retrieve the `locale` and `translationId` identifier during rendering:

   ```typescript
   import { getCollection } from "astro:content";

   const pages = await getCollection("files");
   console.log(pages["data"].locale); // e.g. de-CH
   console.log(pages["data"].translationId); // e.g. src/content/files/about.mdx
   ```

1. Use `i18nPropsAndParams` to provide params and get available translations paths via the page props:

   ```typescript
   import { i18nPropsAndParams } from "astro-loader-i18n";

   export const getStaticPaths = async () => {
     // ⚠️ Unfortunately there is no way to access the routePattern, that's why we need to define it here again.
     // see https://github.com/withastro/astro/pull/13520
     const routePattern = "[...locale]/[files]/[slug]";
     const filesCollection = await getCollection("files");

     return i18nPropsAndParams(filesCollection, {
       defaultLocale: C.DEFAULT_LOCALE,
       routePattern,
       segmentTranslations: C.SEGMENT_TRANSLATIONS,
     });
   };
   ```
1. Finally check `Astro.props.translations` to link the other pages.

### Infile content

Sometimes to have multilingual content in a single file is more convenient. For example data for menus or galleries. This allows sharing untranslated content across locales.

Use the standard `glob()` loader to load infile i18n content.

1. Create a collection:
   <details>
     <summary>📄 Infile collection example</summary>

      ```plaintext
     . (project root)
     └── src
         └── content
             └── navigation
                 ├── footer.yml
                 └── main.yml
     ```

   </details>
   <details>
     <summary>📄 Content of <code>main.yml</code></summary>

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

   </details>

1. Use `extendI18nInfileSchema` to define the schema:

   ```typescript
   const infileCollection = defineCollection({
     loader: glob({ pattern: "**/[^_]*.{yml,yaml}", base: "./src/content/infile" }),
     schema: extendI18nInfileSchema(
       z.array(
         z.object({
           path: z.string(),
           title: z.string(),
         })
       ),
       C.LOCALES
     ),
   });
   ```

### Virtual i18n collections

Sometimes you want to translate that is not based on i18n content. For example an index page or a 404 page.

`createI18nCollection` allows you to create a virtual collection that is not based on any content:

```typescript
export const getStaticPaths = async () => {
  const routePattern = "[...locale]/[files]";
  const collection = createI18nCollection({ locales: C.LOCALES, routePattern });

  return i18nPropsAndParams(collection, {
    defaultLocale: C.DEFAULT_LOCALE,
    routePattern,
    segmentTranslations: C.SEGMENT_TRANSLATIONS,
  });
};
```
