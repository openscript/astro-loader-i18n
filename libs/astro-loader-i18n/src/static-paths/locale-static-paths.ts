import { checkI18nLoaderSchema } from "../schemas/i18n-loader-schema";
import { GetStaticPathsResult } from "astro";

export function localePaths(collection: unknown[]): GetStaticPathsResult {
  return collection.map((entry) => {
    checkI18nLoaderSchema(entry);

    return {
      params: {
        locale: entry.locale,
      },
      props: {
        locale: entry.locale,
      },
    };
  });
}
