import { AnyZodObject, z } from "astro/zod";

export const i18nLoaderSchema = z.object({
  translationId: z.string(),
  locale: z.string(),
});

export const extendI18nLoaderSchema = (schema: AnyZodObject) => i18nLoaderSchema.merge(schema);

const i18nLoaderCollectionSchema = z.array(
  z.object({
    data: i18nLoaderSchema,
  })
);

export function checkI18nLoaderCollection(obj: unknown): asserts obj is z.infer<typeof i18nLoaderCollectionSchema> {
  const result = i18nLoaderCollectionSchema.safeParse(obj);

  if (!result.success) {
    throw new Error(`Invalid collection entry: ${result.error}`);
  }
}
