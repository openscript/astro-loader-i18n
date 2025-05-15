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
          folderCollectionFixture.forEach(async (entry) => {
            context.store.set({ ...entry, data: await context.parseData(entry) });
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
    const loader = i18nLoader({ pattern: "**/*.mdx", base: "./src/content/pages" });
    await loader.load(context);

    const entries = context.store.entries();
    expect(entries).toMatchSnapshot();
  });

  it("should throw error if i18n config is missing", async () => {
    const loader = i18nLoader({ pattern: "**/*.mdx", base: "./src/content/pages" });
    context.config.i18n = undefined;

    await expect(loader.load(context)).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should use locale.codes if locale is an object", async () => {
    const loader = i18nLoader({ pattern: "**/*.mdx", base: "./src/content/pages" });
    context.config.i18n = {
      defaultLocale: "zh-CN",
      routing: "manual",
      locales: [
        { codes: ["de-CH"], path: "/de" },
        { codes: ["en-US"], path: "/en" },
        { codes: ["zh-CN"], path: "/zh" },
      ],
    };
    await loader.load(context);

    const entries = context.store.entries();
    expect(entries).toMatchSnapshot();
  });
});
