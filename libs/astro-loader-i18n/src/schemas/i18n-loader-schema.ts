import { z } from "astro/zod";

export const i18nLoaderSchema = z.object({
  translationId: z.string(),
  locale: z.string(),
});

export function checkI18nLoaderSchema(obj: unknown): asserts obj is z.infer<typeof i18nLoaderSchema> {
  const result = i18nLoaderSchema.safeParse(obj);

  if (!result.success) {
    throw new Error(`Invalid collection entry: ${result.error}`);
  }
}
