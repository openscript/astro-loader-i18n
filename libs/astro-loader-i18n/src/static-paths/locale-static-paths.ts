import { CollectionEntry, ContentCollectionKey } from "astro:content";
import { i18nLoaderSchema } from "../schemas/i18n-loader-schema";
import { GetStaticPathsResult } from "astro";

export function localePaths<C extends ContentCollectionKey>(collection: CollectionEntry<C>[]): GetStaticPathsResult {
  const safeCollection = collection.map((entry) => {
    const result = i18nLoaderSchema.safeParse(entry);

    if (!result.success) {
      throw new Error(`Invalid collection entry: ${result.error}`);
    }

    return result.data;
  });

  return safeCollection.map((entry) => ({
    params: {
      locale: entry.locale,
    },
    props: {
      locale: entry.locale,
    },
  }));
}
