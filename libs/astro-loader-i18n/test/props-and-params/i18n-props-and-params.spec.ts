import { describe, expect, it } from "vitest";
import { i18nProps, i18nPropsAndParams } from "../../src/props-and-params/i18n-props-and-params";
import { SegmentTranslations } from "../../src/utils/route";

const COLLECTION_FIXTURE = [
  {
    data: { locale: "de-CH", translationId: "magic.mdx", contentPath: "test", basePath: "/", slug: "slug-de-ch" },
  },
  {
    data: { locale: "zh-CN", translationId: "magic.mdx", contentPath: "test", basePath: "/", slug: "slug-zh-cn" },
  },
];

describe("i18nPropsAndParams", () => {
  it("should generate paths for a valid collection", () => {
    const routePattern = "[...locale]/[blog]/posts/[...slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    const result = i18nPropsAndParams(COLLECTION_FIXTURE, {
      routePattern,
      segmentTranslations,
      defaultLocale: "de-CH",
      generateSegments: (entry) => ({ slug: entry.data.slug }),
    });
    expect(result).toMatchSnapshot();
  });
  it("should generate full paths if prefixDefaultLocale is true", () => {
    const routePattern = "[...locale]/[blog]/posts/[...slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    const result = i18nPropsAndParams(COLLECTION_FIXTURE, {
      routePattern,
      segmentTranslations,
      defaultLocale: "de-CH",
      prefixDefaultLocale: true,
      generateSegments: (entry) => ({ slug: entry.data.slug }),
    });
    expect(result).toMatchSnapshot();
  });
  it("should throw an error if an unknown locale is used", () => {
    const routePattern = "[...locale]/[blog]/posts/[...slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "en-US": { blog: "blog" } };
    expect(() =>
      i18nPropsAndParams(COLLECTION_FIXTURE, {
        routePattern,
        segmentTranslations,
        defaultLocale: "de-CH",
        generateSegments: (entry) => ({ slug: entry.data.slug }),
      })
    ).toThrowErrorMatchingSnapshot();
  });
  it("should throw an error if not all params can be filled", () => {
    const routePattern = "[...locale]/[blog]/[unknown]/posts/[slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    expect(() =>
      i18nPropsAndParams(COLLECTION_FIXTURE, {
        routePattern,
        segmentTranslations,
        defaultLocale: "de-CH",
        generateSegments: (entry) => ({ slug: entry.data.slug }),
      })
    ).toThrowErrorMatchingSnapshot();
  });
});

describe("i18nProps", () => {
  it("should generate paths for a valid collection", () => {
    const routePattern = "[...locale]/[blog]/posts/[...slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    const result = i18nProps(COLLECTION_FIXTURE, {
      routePattern,
      segmentTranslations,
      defaultLocale: "de-CH",
      generateSegments: (entry) => ({ slug: entry.data.slug }),
    });
    expect(result).toMatchSnapshot();
  });
});
