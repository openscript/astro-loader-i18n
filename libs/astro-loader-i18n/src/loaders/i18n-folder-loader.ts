import { glob, Loader, LoaderContext } from "astro/loaders";
import { createCommonTranslationId, parseLocale } from "../utils/path";

type GlobOptions = Parameters<typeof glob>[0];

export function i18nFolderLoader(options: GlobOptions): Loader {
  const globLoader = glob(options);
  return {
    name: "i18n-folder-loader",
    load: async (context: LoaderContext): Promise<void> => {
      await globLoader.load(context);
      const entries = context.store.values();

      if (!context.config.i18n) throw new Error("i18n configuration is missing in your astro config");

      const { locales, defaultLocale } = context.config.i18n;
      const localeCodes = locales.flatMap((locale) => (typeof locale === "string" ? locale : locale.codes));

      context.store.clear();
      entries.forEach((entry) => {
        if (!entry.filePath) return;
        const locale = parseLocale(entry.filePath, localeCodes, defaultLocale);

        const newEntry = {
          ...entry,
          data: {
            ...entry.data,
            locale,
            commonTranslationId: createCommonTranslationId(entry.filePath, locale),
          },
        };
        context.store.set(newEntry);
      });
    },
  };
}
