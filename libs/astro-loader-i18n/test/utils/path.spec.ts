import { describe, expect, it } from "vitest";
import { createTranslationId, joinPath, parseLocale, resolvePath, trimSlashes } from "../../src/utils/path";

describe("joinPath", () => {
  it("should join paths", () => {
    expect(joinPath("en-US", "docs", "getting-started")).toBe("en-US/docs/getting-started");
  });
  it("should join paths with undefined", () => {
    expect(joinPath("en-US", undefined, "getting-started")).toBe("en-US/getting-started");
  });
});

describe("resolvePath", () => {
  it("should resolve path by joining and making it relative", () => {
    expect(resolvePath("en-US", "docs", "getting-started")).toBe("/en-US/docs/getting-started");
  });
  it("should resolve path by joining and making it relative with undefined", () => {
    expect(resolvePath("en-US", undefined, "getting-started")).toBe("/en-US/getting-started");
  });
});

describe("trimSlashes", () => {
  it("should trim slashes on both sides", () => {
    const trimmed = trimSlashes("/de/page/");
    expect(trimmed).toBe("de/page");
  });
  it("should return '/' when only slash is present", () => {
    const trimmed = trimSlashes("/");
    expect(trimmed).toBe("/");
  });
  it("should trim slashes on the left side", () => {
    const trimmed = trimSlashes("/de/page");
    expect(trimmed).toBe("de/page");
  });
  it("should trim slashes on the right side", () => {
    const trimmed = trimSlashes("de/page/");
    expect(trimmed).toBe("de/page");
  });
});

describe("parseLocale", () => {
  it("should extract locale from folder", () => {
    const locale = parseLocale("/de-CH/page", ["de-CH", "zh-CN"], "zh-CN");
    expect(locale).toBe("de-CH");
  });
  it("should extract locale from folder in between", () => {
    const locale = parseLocale("src/content/projects/de/project-a.mdx", ["de", "zh"], "zh");
    expect(locale).toBe("de");
  });
  it("should extract locale from file suffix", () => {
    const locale = parseLocale("/some/path/page.de-CH.md", ["de-CH", "zh-CN"], "zh-CN");
    expect(locale).toBe("de-CH");
  });
  it("should return default locale when no locale is found", () => {
    const locale = parseLocale("/page", ["de-CH", "zh-CN"], "zh-CN");
    expect(locale).toBe("zh-CN");
  });
});

describe("createTranslationId", () => {
  it("should create ID with no locale", () => {
    const id = createTranslationId("/page/", "zh-CN");
    expect(id).toBe("page");
  });
  it("should create ID for index without locale", () => {
    const id = createTranslationId("/", "zh-CN");
    expect(id).toBe("index");
  });
  it("should create ID for index with locale", () => {
    const id = createTranslationId("/zh-CN/", "zh-CN");
    expect(id).toBe("index");
  });
  it("should create ID with locale as prefix", () => {
    const id = createTranslationId("/zh-CN/page", "zh-CN");
    expect(id).toBe("page");
  });
  it("should create ID with locale as suffix", () => {
    const id = createTranslationId("/page/file.zh-CN.md", "zh-CN");
    expect(id).toBe("page/file.md");
  });
  it("should create ID with locale as suffix and trailing slash", () => {
    const id = createTranslationId("/page/file.zh-CN.md/", "zh-CN");
    expect(id).toBe("page/file.md");
  });
  it("should create ID with locale in between", () => {
    const id = createTranslationId("/page/zh-CN/file", "zh-CN");
    expect(id).toBe("page/file");
  });
  it("should create ID without alter other segments of the path as prefix", () => {
    const id = createTranslationId("project/de/deutsch/hackbraten.md", "de");
    expect(id).toBe("project/deutsch/hackbraten.md");
  });
  it("should create ID without alter other segments of the path as suffix", () => {
    const id = createTranslationId("/deutsch/hackbraten.de.md", "de");
    expect(id).toBe("deutsch/hackbraten.md");
  });
});
