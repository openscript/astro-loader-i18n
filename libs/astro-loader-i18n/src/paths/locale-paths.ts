import { checkI18nLoaderCollection } from "../schemas/i18n-loader-schema";
import { GetStaticPathsResult } from "astro";

export function localePaths(collection: unknown[]): GetStaticPathsResult {
  checkI18nLoaderCollection(collection);

  return collection.map((entry) => {
    const locale = entry.data.locale;

    return {
      params: { locale },
      props: { locale },
    };
  });
}
