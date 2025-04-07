import { checkI18nLoaderCollection } from "../schemas/i18n-loader-schema";
import { GetStaticPathsResult } from "astro";
import { getSegmentTranslations, SegmentTranslations } from "../utils/route";

export function localePropsAndParams(
  collection: unknown[],
  defaultLocale: string,
  segmentTranslations?: SegmentTranslations
): GetStaticPathsResult {
  checkI18nLoaderCollection(collection);

  return collection.map((entry) => {
    const segments = segmentTranslations ? getSegmentTranslations(segmentTranslations, entry.data.locale) : {};
    const { locale, translationId } = entry.data;

    let paramsLocale = locale;
    if (locale === defaultLocale) {
      paramsLocale = "";
    }

    return {
      params: { locale: paramsLocale, ...segments },
      props: { locale, translationId },
    };
  });
}
