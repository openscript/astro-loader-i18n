import { i18nLoaderSchema } from "../schemas/i18n-loader-schema";
import { z } from "astro/zod";

type Options = {
  locales: string[];
  routePattern: string;
  basePath?: string;
};

export type I18nCollection = { data: z.infer<typeof i18nLoaderSchema> }[];

/**
 * Creates an internationalization (i18n) collection based on the provided options.
 *
 * @param options - Configuration options for the i18n collection.
 * @returns An array of objects representing the i18n collection for each locale.
 */
export function createI18nCollection(options: Options): I18nCollection {
  const { locales, routePattern, basePath } = options;

  return locales.map((locale) => ({ data: { locale: locale, translationId: routePattern, contentPath: "", basePath: basePath || "" } }));
}
