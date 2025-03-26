import { describe, expect, it } from "vitest";
import { translationPaths } from "../../src/paths/translation-paths";
import { SegmentTranslations } from "libs/astro-loader-i18n/src/utils/route";

describe("translationPaths", () => {
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
    const result = translationPaths(collection, { routePattern, segmentTranslations, defaultLocale: "de-CH" });
    expect(result).toMatchSnapshot();
  });
});
