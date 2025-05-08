import { glob, Loader, LoaderContext } from "astro/loaders";
import { pruneLocales, getAllUniqueKeys } from "../utils/collection";
import { createTranslationId } from "../utils/path";

type GlobOptions = Parameters<typeof glob>[0];

export function i18nContentLoader(options: GlobOptions): Loader {
  const globLoader = glob(options);
  return {
    name: "i18n-content-loader",
    load: async (context: LoaderContext) => {
      if (!context.config.i18n) throw new Error("i18n configuration is missing in your astro config");

      const { locales, defaultLocale } = context.config.i18n;
      const localeCodes = locales.flatMap((locale) => (typeof locale === "string" ? locale : locale.codes));

      const parseData = context.parseData;
      const parseDataProxy: typeof parseData = (props) => {
        if (!props.filePath) return parseData(props);
        const locale = defaultLocale;
        const translationId = createTranslationId(props.filePath);
        return parseData({ ...props, data: { ...props.data, locale, translationId } });
      };
      context.parseData = parseDataProxy;

      await globLoader.load(context);

      const entries = context.store.entries();
      context.store.clear();

      entries.forEach(([, entry]) => {
        const entryLocales = Array.from(getAllUniqueKeys(entry.data)).filter((key) => localeCodes.includes(key));
        if (entryLocales.length === 0) {
          context.store.set(entry);
        } else {
          entryLocales.forEach((locale) => {
            const entryData = pruneLocales(entry.data, entryLocales, locale);
            context.store.set({ ...entry, id: `${entry.id}/${locale}`, data: { ...entryData, locale } });
          });
        }
      });
    },
  };
}
