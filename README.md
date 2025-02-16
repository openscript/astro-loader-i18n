# astro-loader-i18n

This package is a simple content loader for i18n files and folder structures, partially built on top of the [`glob()` loader](https://docs.astro.build/en/reference/content-loader-reference/#glob-loader).

```bash
npm install astro-loader-i18n
```

```bash
yarn add astro-loader-i18n
```

```bash
pnpm add astro-loader-i18n
```

## Overview

For example, given the following i18n structure:

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

Define a collection in your `content.config.ts` using the `astro-loader-i18n` file:

```typescript
import { i18nFolderLoader, z } from 'astro-loader-i18n';
import { defineCollection } from 'astro:content';

const pages = defineCollection({
  loader: i18nFolderLoader({
    pattern: "**/*.mdx",
    base: "src/content/pages",
    schema: z.object({
      title: z.string(),
    }),
  }),
  schema: /* USUALLY YOU DON'T WANT TO OVERRIDE THE LOADERS SCHEMA */
});

export const collections = { pages };
```

> [!CAUTION]
> The `schema` should be defined in the loader, not in the collection definition. This is because the loader is responsible for parsing the content and the collection is responsible for filtering and sorting the content.

Retrieve the collection and filter by locale:

```ts
import { getCollection } from "astro:content";

const pages = await getCollection("pages", (entry) => { entry.locale === "de-CH"});
```

## Usage

This loader supports differently structured localized content:

### Folder via `i18nFolderLoader`

The content is structured into locales by folders:

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

- The locale is determined by the folder name.
- Localized subfolders can be used to structure the content further.
- Page translations need to be separately mapped.
- Useful for:
  - Individual pages with multiple translations
  - Flat content structures

### Files via `i18nFilesLoader`

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

- The locale is determined by the file name suffix.
- Subfolders can be used to structure the content further.
- Subfolder names need to be separately translated.
- Useful for:
  - Blogs
  - News
  - Articles
  - Notes
  - ...

### Infile via standard `glob()` loader

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

- The locale is determined by the key in the YAML file.
- The content is structured in a single file.
- This allows sharing untranslated content across locales.
- Useful for:
  - Menus
  - Galleries
  - ...

## Improvements

- [ ] Export `GlobOptions` type from Astro
