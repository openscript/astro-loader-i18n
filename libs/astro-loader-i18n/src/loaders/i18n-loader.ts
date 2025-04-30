import { glob, Loader, LoaderContext } from "astro/loaders";
import { createTranslationId, parseLocale } from "../utils/path";

type GlobOptions = Parameters<typeof glob>[0];

export function i18nLoader(options: GlobOptions): Loader {
  const globLoader = glob(options);
  return {
    name: "i18n-loader",
    load: async (context: LoaderContext) => {
      if (!context.config.i18n) throw new Error("i18n configuration is missing in your astro config");

      const { locales, defaultLocale } = context.config.i18n;
      const localeCodes = locales.flatMap((locale) => (typeof locale === "string" ? locale : locale.codes));

      const parseDataProxy: typeof context.parseData = (props) => {
        if (!props.filePath) return context.parseData(props);
        const locale = parseLocale(props.filePath, localeCodes, defaultLocale);
        const translationId = createTranslationId(props.filePath, locale);
        return context.parseData({ ...props, data: { ...props.data, locale, translationId } });
      };

      const globContext = Object.assign({}, context, { parseData: parseDataProxy });
      await globLoader.load(globContext);
    },
  };
}
