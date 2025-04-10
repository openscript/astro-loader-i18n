import { beforeEach, describe, expect, it, vi } from "vitest";
import { i18nLoader } from "../../src/loaders/i18n-loader";
import { LoaderContext } from "astro/loaders";
import { createLoaderContext } from "../__mocks__/loader-context";
import { folderCollectionFixture } from "../__fixtures__/collections";

vi.mock("astro/loaders", () => {
  return {
    glob: () => {
      return {
        load: vi.fn().mockImplementation(async (context: LoaderContext) => {
          const entries = await Promise.all(
            folderCollectionFixture.map(async (entry) => {
              return { ...entry, data: await context.parseData(entry) };
            })
          );
          entries.forEach((entry) => {
            context.store.set(entry);
          });
        }),
      };
    },
  };
});

describe("i18nLoader", () => {
  let context: LoaderContext;

  beforeEach(() => {
    context = createLoaderContext();
  });

  it("should put common translation id and locale in data", async () => {
    const loader = i18nLoader({ pattern: "**/*.mdx" });
    await loader.load(context);

    const entries = context.store.entries();
    expect(entries).toMatchSnapshot();
  });
});
