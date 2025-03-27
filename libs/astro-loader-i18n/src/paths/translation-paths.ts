import { GetStaticPathsResult } from "astro";
import limax from "limax";
import { checkI18nLoaderCollection } from "../schemas/i18n-loader-schema";
import { buildPath, parseRoutePattern, SegmentTranslations } from "../utils/route";

type Config = {
  routePattern: string;
  segmentTranslations: SegmentTranslations;
  defaultLocale: string;
  localeParamName?: string;
  slugParamName?: string;
  titleDataKey?: string;
};

const defaultConfig = {
  localeParamName: "locale",
  slugParamName: "slug",
  titleDataKey: "title",
};

function getSegmentTranslations(segments: SegmentTranslations, locale: string) {
  if (!segments[locale]) throw new Error(`No slugs found for locale ${locale}`);
  return segments[locale];
}

export function translationPaths(collection: unknown[], config: Config): GetStaticPathsResult {
  checkI18nLoaderCollection(collection);
  const { routePattern, segmentTranslations, defaultLocale, localeParamName, slugParamName, titleDataKey } = { ...defaultConfig, ...config };
  const route = parseRoutePattern(routePattern);

  route.forEach((segment, index) => {
    if (
      segment.param &&
      segment.value !== localeParamName &&
      index !== route.length - 1 &&
      !Object.values(segmentTranslations).every((translation) => translation[segment.value])
    ) {
      throw new Error(`No slugs found for route segment ${segment.value}`);
    }
  });

  return collection.map((entry) => {
    const segments = getSegmentTranslations(segmentTranslations, entry.data.locale);
    const translationId = entry.data.translationId;

    const entryTranslations = collection.filter((entry) => entry.data.translationId === translationId);

    const translations = entryTranslations.reduce(
      (previous, current) => {
        const segmentValues = getSegmentTranslations(segmentTranslations, current.data.locale);
        segmentValues[localeParamName] = defaultLocale === current.data.locale ? "" : current.data.locale;
        const slugValue = titleDataKey ? (current.data as Record<string, string | undefined>)[titleDataKey] : undefined;
        if (slugValue) {
          segmentValues[slugParamName] = limax(slugValue);
        }
        return {
          ...previous,
          [current.data.locale]: buildPath(route, segmentValues),
        };
      },
      {} as Record<string, string>
    );

    return {
      params: {
        ...segments,
      },
      props: {
        translationId,
        translations,
      },
    };
  });
}
