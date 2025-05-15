import { z } from "astro/zod";

/**
 * Creates a schema for localized content, supporting multiple locales.
 *
 * @template T - The Zod schema type for the content.
 * @template Locales - A tuple of locale strings.
 * @param schema - The base schema for the content.
 * @param locales - An array of locale strings to define the localization keys.
 * @param partial - Whether the schema should allow partial localization (optional).
 * @returns A Zod schema that validates either the localized object or the base schema.
 */
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
