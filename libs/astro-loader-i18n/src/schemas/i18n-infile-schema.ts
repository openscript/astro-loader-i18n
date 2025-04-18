import { z } from "astro/zod";

export const extendI18nInfileSchema = <T extends z.ZodTypeAny, Locales extends readonly string[]>(schema: T, locales: Locales) =>
  z.object(
    locales.reduce(
      (acc, key) => {
        acc[key as Locales[number]] = schema;
        return acc;
      },
      {} as Record<Locales[number], T>
    )
  );
