import { z } from "astro/zod";

export const i18nLoaderSchema = z.object({
  commonTranslationId: z.string(),
  locale: z.string(),
});
