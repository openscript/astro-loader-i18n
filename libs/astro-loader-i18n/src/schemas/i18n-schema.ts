import { z } from "astro/zod";

export const i18nSchema = z.object({
  commonTranslationId: z.string(),
  locale: z.string(),
});
