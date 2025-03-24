import { describe, expect, it } from "vitest";
import { createTranslationId, parseLocale, trimSlashes } from "../../src/utils/path";

describe("trimSlashes", () => {
  it("both sides", () => {
    const trimmed = trimSlashes("/de/page/");
    expect(trimmed).toBe("de/page");
  });

  it("only slash", () => {
    const trimmed = trimSlashes("/");
    expect(trimmed).toBe("/");
  });

  it("left side", () => {
    const trimmed = trimSlashes("/de/page");
    expect(trimmed).toBe("de/page");
  });

  it("right side", () => {
    const trimmed = trimSlashes("de/page/");
    expect(trimmed).toBe("de/page");
  });
});

describe("parseLocale", () => {
  it("locale from folder", () => {
    const locale = parseLocale("/de-CH/page", ["de-CH", "zh-CN"], "zh-CN");
    expect(locale).toBe("de-CH");
  });

  it("locale from file suffix", () => {
    const locale = parseLocale("/some/path/page.de-CH.md", ["de-CH", "zh-CN"], "zh-CN");
    expect(locale).toBe("de-CH");
  });

  it("default locale", () => {
    const locale = parseLocale("/page", ["de-CH", "zh-CN"], "zh-CN");
    expect(locale).toBe("zh-CN");
  });
});

describe("createTranslationId", () => {
  it("no locale", () => {
    const id = createTranslationId("/page/", "zh-CN");
    expect(id).toBe("page");
  });
  it("index without locale", () => {
    const id = createTranslationId("/", "zh-CN");
    expect(id).toBe("index");
  });
  it("index with locale", () => {
    const id = createTranslationId("/zh-CN/", "zh-CN");
    expect(id).toBe("index");
  });
  it("locale as prefix", () => {
    const id = createTranslationId("/zh-CN/page", "zh-CN");
    expect(id).toBe("page");
  });
  it("locale as suffix", () => {
    const id = createTranslationId("/page/file.zh-CN.md", "zh-CN");
    expect(id).toBe("page/file.md");
  });
  it("locale as suffix and trailing slash", () => {
    const id = createTranslationId("/page/file.zh-CN.md/", "zh-CN");
    expect(id).toBe("page/file.md");
  });
  it("locale in between", () => {
    const id = createTranslationId("/page/zh-CN/file", "zh-CN");
    expect(id).toBe("page/file");
  });
});
