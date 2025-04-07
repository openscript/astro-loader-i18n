import { describe, expect, it } from "vitest";
import { i18nPropsAndParams } from "../../src/props-and-params/i18n-props-and-params";
import { SegmentTranslations } from "../../src/utils/route";

describe("i18nPropsAndParams", () => {
  it("should generate paths for a valid collection", () => {
    const routePattern = "/[...locale]/[blog]/posts/[slug]";
    const segmentTranslations: SegmentTranslations = { "de-CH": { blog: "logbuch" }, "zh-CN": { blog: "blog" } };
    const collection = [
      {
        data: { locale: "de-CH", translationId: "magic.mdx", title: "Verückte Umlaute!" },
      },
      {
        data: { locale: "zh-CN", translationId: "magic.mdx", title: "神奇的标题" },
      },
    ];
    const result = i18nPropsAndParams(collection, { routePattern, segmentTranslations, defaultLocale: "de-CH" });
    expect(result).toMatchSnapshot();
  });
});
