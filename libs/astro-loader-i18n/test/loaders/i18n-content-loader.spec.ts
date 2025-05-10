import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoaderContext } from "astro/loaders";
import { createLoaderContext } from "../__mocks__/loader-context";
import { contentCollectionFixture } from "../__fixtures__/collections";
import { i18nContentLoader } from "../../src/loaders/i18n-content-loader";

vi.mock("astro/loaders", () => {
  return {
    glob: () => {
      return {
        load: vi.fn().mockImplementation(async (context: LoaderContext) => {
          contentCollectionFixture.forEach(async (entry) => {
            context.store.set({ ...entry, data: await context.parseData(entry) });
          });
        }),
      };
    },
  };
});

describe("i18nContentLoader", () => {
  let context: LoaderContext;

  beforeEach(() => {
    context = createLoaderContext();
  });

  it("should put common translation id and locale in data", async () => {
    const loader = i18nContentLoader({ pattern: "**/*.yml", base: "./src/content/gallery" });
    await loader.load(context);

    const entries = context.store.entries();
    expect(entries).toMatchSnapshot();
  });
});
