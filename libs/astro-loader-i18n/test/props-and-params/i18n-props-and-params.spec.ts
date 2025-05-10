import { describe, expect, it } from "vitest";
import { i18nPropsAndParams } from "../../src/props-and-params/i18n-props-and-params";
import { SegmentTranslations } from "../../src/utils/route";

const COLLECTION_FIXTURE = [
  {
    data: { locale: "de-CH", translationId: "magic.mdx", contentPath: "test", title: "Verückte Umlaute!" },
  },
  {
    data: { locale: "zh-CN", translationId: "magic.mdx", contentPath: "test", title: "神奇的标题" },
  },
];

describe("i18nPropsAndParams", () => {
  it("should generate paths for a valid collection", () => {
    const routePattern = "[...locale]/[blog]/posts/[...slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    const result = i18nPropsAndParams(COLLECTION_FIXTURE, { routePattern, segmentTranslations, defaultLocale: "de-CH" });
    expect(result).toMatchSnapshot();
  });
  it("should should throw an error if the slug needs to be a spread param, but isn't", () => {
    const routePattern = "[...locale]/[blog]/posts/[slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    expect(() =>
      i18nPropsAndParams(COLLECTION_FIXTURE, { routePattern, segmentTranslations, defaultLocale: "de-CH" })
    ).toThrowErrorMatchingSnapshot();
  });
  it("should throw an error if not all params can be filled", () => {
    const routePattern = "[...locale]/[blog]/[unknown]/posts/[slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    expect(() =>
      i18nPropsAndParams(COLLECTION_FIXTURE, { routePattern, segmentTranslations, defaultLocale: "de-CH" })
    ).toThrowErrorMatchingSnapshot();
  });
});
