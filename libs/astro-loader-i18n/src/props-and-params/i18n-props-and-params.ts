import limax from "limax";
import { checkI18nLoaderCollection, i18nLoaderSchema } from "../schemas/i18n-loader-schema";
import { buildPath, parseRoutePattern, SegmentTranslations } from "../utils/route";
import { z } from "astro/zod";
import { CollectionEntry, CollectionKey } from "astro:content";
import { I18nCollection } from "../collections/create-i18n-collection";

type Config = {
  defaultLocale: string;
  routePattern: string;
  segmentTranslations: SegmentTranslations;
  localeParamName?: string;
  slugParamName?: string;
  titleDataKey?: string;
};

const defaultConfig = {
  localeParamName: "locale",
  slugParamName: "slug",
  titleDataKey: "title",
} as const;

function getSegmentTranslations(
  data: z.infer<typeof i18nLoaderSchema> & Record<string, string | unknown>,
  c: Omit<Required<Config>, "routePattern">
) {
  if (!c.segmentTranslations[data.locale]) throw new Error(`No slugs found for locale ${data.locale}`);

  const currentLocale = data.locale === c.defaultLocale ? undefined : data.locale;
  const segmentValues = { [c.localeParamName]: currentLocale, ...c.segmentTranslations[data.locale] };

  const slugValue = c.titleDataKey ? data[c.titleDataKey] : undefined;
  if (slugValue && typeof slugValue === "string") {
    segmentValues[c.slugParamName] = limax(slugValue);
  }
  return segmentValues;
}

export function i18nPropsAndParams<C extends CollectionEntry<CollectionKey>[]>(collection: C | I18nCollection, config: Config) {
  checkI18nLoaderCollection(collection);
  const { routePattern, ...c } = { ...defaultConfig, ...config };
  const route = parseRoutePattern(routePattern);

  route.forEach((segment, index) => {
    if (
      segment.param &&
      segment.value !== c.localeParamName &&
      index !== route.length - 1 &&
      !Object.values(c.segmentTranslations).every((translation) => translation[segment.value])
    ) {
      throw new Error(`No slugs found for route segment ${segment.value}`);
    }
  });

  return collection.map((entry) => {
    const { translationId } = entry.data;
    const entryTranslations = collection.filter((e) => e.data.translationId === translationId);
    const translations = entryTranslations.reduce(
      (previous, current) => {
        return {
          ...previous,
          [current.data.locale]: buildPath(route, getSegmentTranslations(current.data, c)),
        };
      },
      {} as Record<string, string>
    );

    return {
      params: getSegmentTranslations(entry.data, c),
      props: {
        ...entry,
        translations,
      } as C[number] & I18nCollection[number] & { translations: Record<string, string> },
    };
  });
}
