import { i18nLoaderSchema } from "../schemas/i18n-loader-schema";
import { z } from "astro/zod";

type Options = {
  locales: string[];
  routePattern: string;
};

export type I18nCollection = { data: z.infer<typeof i18nLoaderSchema> }[];

export function createI18nCollection(options: Options): I18nCollection {
  const { locales, routePattern } = options;

  return locales.map((locale) => ({ data: { locale: locale, translationId: routePattern, contentPath: "" } }));
}
