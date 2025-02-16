import { glob, Loader, LoaderContext } from "astro/loaders";
import { GlobOptions } from "../types";

export function i18nFolderLoader(options: GlobOptions ): Loader {
  return {
    name: "i18n-folder-loader",
    load: async (context: LoaderContext): Promise<void> => {
      await glob(options).load(context);

    }
  }
}
