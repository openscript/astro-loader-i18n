import limax from "limax";
import { checkI18nLoaderCollection, i18nLoaderSchema } from "../schemas/i18n-loader-schema";
import { buildPath, parseRoutePattern, SegmentTranslations } from "../utils/route";
import { z } from "astro/zod";
import { CollectionEntry, CollectionKey } from "astro:content";
import { I18nCollection } from "../collections/create-i18n-collection";
import { joinPath } from "../utils/path";

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
    segmentValues[c.slugParamName] = joinPath(data.contentPath, limax(slugValue));
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
    if (segment.value === c.slugParamName && !segment.spread && collection.some((entry) => entry.data.contentPath !== "")) {
      const example = collection.find((entry) => entry.data.contentPath !== "");
      throw new Error(
        `The slug param "${segment.value}" requires to be spread, because some entries (e.g ${example?.data.translationId}:${example?.data.contentPath}) have a contentPath, that leads to a slug with a path. Add "..." to the slug param in your route pattern ${routePattern} via changing the corresponding file or folder name.`
      );
    }
  });

  return collection.map((entry) => {
    const { translationId } = entry.data;
    const entryTranslations = collection.filter((e) => e.data.translationId === translationId);
    const translations = entryTranslations.reduce(
      (previous, current) => {
        return {
          ...previous,
          [current.data.locale]: buildPath(route, getSegmentTranslations(current.data, c), current.data.basePath),
        };
      },
      {} as Record<string, string>
    );

    const params = getSegmentTranslations(entry.data, c);
    const translatedPath = buildPath(route, params, entry.data.basePath);

    return {
      params,
      props: {
        ...entry,
        translations,
        translatedPath,
      } as C[number] & I18nCollection[number] & { translations: Record<string, string>; translatedPath: string },
    };
  });
}
