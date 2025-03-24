import { GetStaticPathsResult } from "astro";
import { checkI18nLoaderSchema } from "../schemas/i18n-loader-schema";

export function translationIdPaths(collection: unknown[]): GetStaticPathsResult {
  return collection.map((entry) => {
    checkI18nLoaderSchema(entry);

    return {
      params: {},
      props: {
        translationId: entry.translationId,
      },
    };
  });
}
