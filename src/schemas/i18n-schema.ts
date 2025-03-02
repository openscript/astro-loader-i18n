import { z } from "astro:content";

export const i18nSchema = z.object({
  commonTranslationId: z.string(),
  locale: z.string(),
  translations: z.record(z.string()),
});
