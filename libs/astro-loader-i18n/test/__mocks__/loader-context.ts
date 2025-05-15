import type { LoaderContext } from "astro/loaders";
import { vi } from "vitest";
import { Logger } from "./logger";
import { Store } from "./store";

export function createLoaderContext(context?: Partial<LoaderContext>): LoaderContext {
  return {
    collection: "testCollection",
    generateDigest: vi.fn().mockReturnValue("digest"),
    logger: new Logger(),
    parseData: async (props) => props.data,
    store: new Store(),
    meta: new Map<string, string>(),
    config: {
      base: "/",
      root: new URL("file://"),
      srcDir: new URL("file://src/"),
      legacy: {
        collections: false,
      },
      i18n: {
        defaultLocale: "zh-CN",
        locales: ["de-CH", "en-US", "zh-CN"],
        routing: "manual",
      },
    } satisfies Partial<LoaderContext["config"]> as unknown as LoaderContext["config"],
    ...context,
  } satisfies Partial<LoaderContext> as unknown as LoaderContext;
}
