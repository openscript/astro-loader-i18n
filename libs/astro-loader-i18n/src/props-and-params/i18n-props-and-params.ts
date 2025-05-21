import { checkI18nLoaderCollection, I18nCollection, I18nLoaderEntry } from "../schemas/i18n-loader-schema";
import { buildPath, parseRoutePattern, SegmentTranslations } from "../utils/route";
import { CollectionEntry, CollectionKey } from "astro:content";

/**
 * Configuration options for internationalization (i18n) routing.
 *
 * @template C - The type of the entry used for segment generation.
 * @property defaultLocale - The default locale to use when none is specified.
 * @property routePattern - The route pattern string used for matching and generating localized routes.
 * @property segmentTranslations - An object containing translations for route segments.
 * @property generateSegments - (Optional) A function that generates a mapping of segment names to their translations for a given entry.
 * @property localeParamName - (Optional) The name of the parameter used to specify the locale in routes.
 * @property prefixDefaultLocale - (Optional) Whether to prefix the default locale in generated routes.
 */
type Config<C> = {
  defaultLocale: string;
  routePattern: string;
  segmentTranslations: SegmentTranslations;
  generateSegments?: (entry: C) => Record<string, string>;
  localeParamName?: string;
  prefixDefaultLocale?: boolean;
};

const defaultConfig = {
  localeParamName: "locale",
  prefixDefaultLocale: false,
  generateSegments: () => ({}),
} as const;

function getSegmentTranslations<C>(entry: I18nLoaderEntry, c: Omit<Required<Config<C>>, "routePattern">) {
  const { data } = entry;
  if (!c.segmentTranslations[data.locale]) throw new Error(`No slugs found for locale ${data.locale}`);

  const currentLocale = !c.prefixDefaultLocale && data.locale === c.defaultLocale ? undefined : data.locale;
  const segmentValues = {
    [c.localeParamName]: currentLocale,
    ...c.segmentTranslations[data.locale],
    ...c.generateSegments(entry as C),
  };

  return segmentValues;
}

/**
 * Processes a collection of entries and generates i18n-related properties and parameters.
 *
 * @template C - The type of the collection entries.
 * @param collection - The collection of entries or an i18n collection.
 * @param config - The configuration object for i18n processing.
 * @returns An array of objects containing `params` and `props` for each entry.
 * @throws {Error} If route segment translations or slug parameters are invalid.
 */
export function i18nPropsAndParams<C extends CollectionEntry<CollectionKey>>(collection: C[] | I18nCollection, config: Config<C>) {
  checkI18nLoaderCollection(collection);
  const { routePattern, ...c } = { ...defaultConfig, ...config };
  const route = parseRoutePattern(routePattern);

  return collection.map((entry) => {
    const { translationId } = entry.data;
    const entryTranslations = collection.filter((e) => e.data.translationId === translationId);
    const translations = entryTranslations.reduce(
      (previous, current) => {
        return {
          ...previous,
          [current.data.locale]: buildPath(route, getSegmentTranslations(current, c), current.data.basePath),
        };
      },
      {} as Record<string, string>
    );

    const params = getSegmentTranslations(entry, c);
    const translatedPath = buildPath(route, params, entry.data.basePath);

    return {
      params,
      props: {
        ...entry,
        translations,
        translatedPath,
      } as C[][number] & I18nCollection[number] & { translations: Record<string, string>; translatedPath: string },
    };
  });
}
