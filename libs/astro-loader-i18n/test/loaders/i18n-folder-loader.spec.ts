import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { i18nFolderLoader } from "../../src/loaders/i18n-folder-loader";
import { LoaderContext } from "astro/loaders";
import { createLoaderContext } from "../_mocks/create-loader-context";
import { folderCollectionFixture } from "../_fixtures/collections";

vi.mock("astro/loaders", () => {
  return {
    glob: () => ({
      load: vi.fn().mockImplementation(async (context: LoaderContext) => {
        folderCollectionFixture.forEach((entry) => {
          context.store.set(entry);
        });
      }),
    }),
  };
});

describe("i18nFolderLoader", () => {
  let context: LoaderContext;

  beforeEach(() => {
    context = createLoaderContext();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("common translation id and locale in data", async () => {
    const loader = i18nFolderLoader({ pattern: "**/*.mdx" });
    await loader.load(context);

    const entries = context.store.entries();
    expect(entries).toMatchSnapshot();
  });
});
