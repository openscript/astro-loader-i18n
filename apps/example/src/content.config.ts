import { defineCollection, z } from "astro:content";
import { extendI18nInfileSchema, extendI18nLoaderSchema, i18nLoader } from "astro-loader-i18n";
import { glob } from "astro/loaders";
import astroConfig from "../astro.config";

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
  schema: extendI18nInfileSchema(z.array(z.object({ path: z.string(), title: z.string() })), astroConfig.i18n!.locales),
});

export const collections = {
  files: filesCollection,
  folder: folderCollection,
  infile: infileCollection,
};
