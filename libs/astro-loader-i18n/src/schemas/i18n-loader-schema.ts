import { z } from "astro/zod";

export const i18nLoaderSchema = z.object({
  translationId: z.string(),
  locale: z.string(),
});
