import { describe, expect, it } from "vitest";
import { translationPropsAndParams } from "../../src/props-and-params/translation-props-and-params";
import { SegmentTranslations } from "../../src/utils/route";

describe("translationPropsAndParams", () => {
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
      {
        data: { locale: "zh-CN", translationId: "other.mdx", title: "神奇的标题" },
      },
    ];
    const result = translationPropsAndParams(collection, { routePattern, segmentTranslations, defaultLocale: "de-CH" });
    expect(result).toMatchSnapshot();
  });
});
