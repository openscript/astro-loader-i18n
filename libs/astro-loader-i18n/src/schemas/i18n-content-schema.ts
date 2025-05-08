import { z } from "astro/zod";

export const localized = <T extends z.ZodTypeAny, Locales extends readonly string[]>(schema: T, locales: Locales, partial?: boolean) => {
  const createObjectSchema = () =>
    z.object(
      locales.reduce(
        (acc, key) => {
          acc[key as Locales[number]] = schema;
          return acc;
        },
        {} as Record<Locales[number], T>
      )
    );

  const objectSchema = partial ? createObjectSchema().partial() : createObjectSchema();

  return objectSchema.or(schema);
};
