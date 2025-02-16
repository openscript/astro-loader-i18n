import { Loader, LoaderContext } from "astro/loaders";

export function i18nFolderLoader(): Loader {
  return {
    name: "i18n-folder-loader",
    load: async (context: LoaderContext): Promise<void> => {}
  }
}
