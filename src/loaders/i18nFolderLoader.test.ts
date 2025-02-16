import { describe, it } from 'vitest';
import { i18nFolderLoader } from './i18nFolderLoader';

describe("i18nFolderLoader", () => {
  it("finds all files according to the pattern", () => {
    i18nFolderLoader({ pattern: "**/*.mdx", base: "examples/structures/folder/src/content/pages" });
  });
});
