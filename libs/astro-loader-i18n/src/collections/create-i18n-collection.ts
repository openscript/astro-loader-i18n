import { i18nLoaderSchema } from "../schemas/i18n-loader-schema";
import { z } from "astro/zod";

type Options = {
  locales: string[];
  routePattern: string;
};

export function createI18nCollection(options: Options): { data: z.infer<typeof i18nLoaderSchema> }[] {
  const { locales, routePattern } = options;
  return locales.map((locale) => ({ data: { locale: locale, translationId: routePattern } }));
}
