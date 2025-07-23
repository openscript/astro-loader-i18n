import { glob, Loader, LoaderContext } from "astro/loaders";
import { pruneLocales, getAllUniqueKeys, createContentPath, createTranslationId } from "astro-utils-i18n";

const UNDETERMINED_LOCALE = "und";

type GlobOptions = Parameters<typeof glob>[0];

/**
 * A loader function for handling internationalization (i18n) content in an Astro project.
 * This loader processes files matching the specified glob pattern, associates them with locales,
 * and augments their data with i18n-specific metadata such as locale, translation ID, and content path.
 *
 * @param options - Configuration options for the glob pattern to match files.
 * @returns A loader object with a custom `load` method for processing i18n content.
 *
 * @throws Will throw an error if the `i18n` configuration is missing in the Astro config.
 */
export function i18nContentLoader(options: GlobOptions): Loader {
  const globLoader = glob(options);
  return {
    name: "i18n-content-loader",
    load: async (context: LoaderContext) => {
      if (!context.config.i18n) throw new Error("i18n configuration is missing in your astro config");

      const { locales } = context.config.i18n;
      const localeCodes = locales.flatMap((locale) => (typeof locale === "string" ? locale : locale.codes));

      const parseData = context.parseData;
      const parseDataProxy: typeof parseData = (props) => {
        if (!props.filePath) return parseData(props);
        const locale = UNDETERMINED_LOCALE;
        const translationId = createTranslationId(props.filePath);
        const contentPath = createContentPath(props.filePath, options.base);
        const basePath = context.config.base;
        return parseData({ ...props, data: { ...props.data, locale, translationId, contentPath, basePath } });
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
