import { defineCollection, z } from "astro:content";
import { extendI18nInfileSchema, i18nLoader } from "astro-loader-i18n";
import { glob } from "astro/loaders";
import astroConfig from "../astro.config";

const filesCollection = defineCollection({
  loader: i18nLoader({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/files", generateId: ({ entry }) => entry }),
  schema: z.object({
    title: z.string(),
  }),
});
const folderCollection = defineCollection({
  loader: i18nLoader({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/folder", generateId: ({ entry }) => entry }),
  schema: z.object({
    title: z.string(),
  }),
});
const infileCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{yml,yaml}", base: "./src/content/infile", generateId: ({ entry }) => entry }),
  schema: extendI18nInfileSchema(z.array(z.object({ path: z.string(), title: z.string() })), astroConfig.i18n!.locales),
});

export const collections = {
  files: filesCollection,
  folder: folderCollection,
  infile: infileCollection,
};
