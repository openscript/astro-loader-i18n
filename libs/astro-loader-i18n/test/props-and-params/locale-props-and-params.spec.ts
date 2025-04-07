import { describe, expect, it } from "vitest";
import { localePropsAndParams } from "../../src/props-and-params/locale-props-and-params";

const defaultLocale = "en";

describe("localePropsAndParams", () => {
  it("should generate props and params", () => {
    const collection = [{ data: { locale: "en", translationId: "some-page.mdx" } }, { data: { locale: "zh", translationId: "some-page.mdx" } }];
    const result = localePropsAndParams(collection, defaultLocale);
    expect(result).toEqual([
      { params: { locale: "" }, props: { locale: "en", translationId: "some-page.mdx" } },
      { params: { locale: "zh" }, props: { locale: "zh", translationId: "some-page.mdx" } },
    ]);
  });

  it("should translate path segments", () => {
    const collection = [{ data: { locale: "en", translationId: "some-page.mdx" } }, { data: { locale: "zh", translationId: "some-page.mdx" } }];
    const segmentTranslations = {
      en: {
        blog: "blog",
      },
      zh: {
        blog: "博客",
      },
    };
    const result = localePropsAndParams(collection, defaultLocale, segmentTranslations);
    expect(result).toEqual([
      { params: { locale: "", blog: "blog" }, props: { locale: "en", translationId: "some-page.mdx" } },
      { params: { locale: "zh", blog: "博客" }, props: { locale: "zh", translationId: "some-page.mdx" } },
    ]);
  });

  it("should handle an empty collection", () => {
    const collection: unknown[] = [];
    const result = localePropsAndParams(collection, defaultLocale);
    expect(result).toEqual([]);
  });

  it("should throw an error for an invalid collection", () => {
    const invalidCollection = [{ data: { invalidKey: "value" } }];
    expect(() => localePropsAndParams(invalidCollection, defaultLocale)).toThrow();
  });
});
