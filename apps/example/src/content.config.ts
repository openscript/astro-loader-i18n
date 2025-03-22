import { defineCollection, z } from "astro:content";
import { i18nLoader } from "astro-loader-i18n";

// const filesCollection = defineCollection("files", {});
const folderCollection = defineCollection({
  loader: i18nLoader({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/folder", generateId: ({ entry }) => entry }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  //  files: filesCollection,
  folder: folderCollection,
};
