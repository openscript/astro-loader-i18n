import { z } from "astro:content";

export const i18nSchema = z.object({
  locale: z.string(),
});
