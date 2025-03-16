import { glob, Loader, LoaderContext } from "astro/loaders";
import { createCommonTranslationId } from "../utils/path";

type GlobOptions = Parameters<typeof glob>[0];

export function i18nFolderLoader(options: GlobOptions): Loader {
  const globLoader = glob(options);
  return {
    name: "i18n-folder-loader",
    load: async (context: LoaderContext): Promise<void> => {
      await globLoader.load(context);
      const entries = context.store.values();

      context.store.clear();
      entries.forEach((entry) => {
        if (!entry.filePath) return;
        const newEntry = {
          ...entry,
          data: {
            ...entry.data,
            commonTranslationId: createCommonTranslationId(entry.filePath)
          }
        };
        context.store.set(newEntry);
      });

      console.log(context.store.values());
    },
  }
}
