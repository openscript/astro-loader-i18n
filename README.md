# astro-loader-i18n

This package contains a **content loader** for i18n files and folder structures for [Astro](https://astro.build/). It is built on top of the [`glob()` loader](https://docs.astro.build/en/reference/content-loader-reference/#glob-loader).

The content loader features:

- Detects locales from the file names or folder structure
  <details>
    <summary>Folder structure example</summary>

    ```
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
    <summary>File name suffix example</summary>

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
  </details>
- Creates a common translation identifier so that translations can be easily mapped
- Provides schema partials for `content.config.ts`
  - Loader schema as `i18nLoaderSchema`
  - Infile schema as `i18nInfileSchema`

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
   > [!WARNING]
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
