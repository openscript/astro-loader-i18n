import { glob, Loader, LoaderContext } from "astro/loaders";
import { GlobOptions } from "../types";

export function i18nFolderLoader(options: GlobOptions ): Loader {
  const globLoader = glob(options);

  return {
    name: "i18n-folder-loader",
    load: async (context: LoaderContext): Promise<void> => {
      await globLoader.load(context);
    },
  }
}
