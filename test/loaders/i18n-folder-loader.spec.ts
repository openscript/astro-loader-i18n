import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import { i18nFolderLoader } from '../../src/loaders/i18n-folder-loader';
import { LoaderContext } from 'astro/loaders';
import { createLoaderContext } from '../_mocks/create-loader-context';
import packageJson from '../../package.json';

vi.mock("astro/loaders", () => {
  return {
    glob: () => ({
      load: vi.fn().mockImplementation(async (context: LoaderContext) => {
        context.store.set({ id: "products", data: { title: "Produkte" } })
      })
    })
  }
})

describe("i18nFolderLoader", () => {
  let context: LoaderContext;

  beforeEach(() => {
    context = createLoaderContext();
    context.meta.set("version", packageJson.version);
    context.meta.set("last-modified", new Date().toISOString().replace("T", " "));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("finds all files according to the pattern", async () => {
    const loader = i18nFolderLoader({ pattern: "**/*.mdx", base: "./examples/structures/folder/src/content/pages" });
    await loader.load(context);
    console.log(JSON.stringify(context.store.entries(), null, 2));
  });
});
