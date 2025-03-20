import type { LoaderContext } from "astro/loaders";
import { vi } from "vitest";
import { LoggerMock } from "./logger.mock";
import { StoreMock } from "./store.mock";

export function createLoaderContext(context?: Partial<LoaderContext>): LoaderContext {
  return {
    collection: "testCollection",
    generateDigest: vi.fn().mockReturnValue("digest"),
    logger: new LoggerMock(),
    parseData: vi.fn().mockResolvedValue({}),
    store: new StoreMock(),
    meta: new Map<string, string>(),
    config: {
      i18n: {
        defaultLocale: "zh-CN",
        locales: ["de-CH", "en-US", "zh-CN"],
        routing: "manual",
      },
    } satisfies Partial<LoaderContext["config"]> as unknown as LoaderContext["config"],
    ...context,
  } satisfies Partial<LoaderContext> as unknown as LoaderContext;
}
