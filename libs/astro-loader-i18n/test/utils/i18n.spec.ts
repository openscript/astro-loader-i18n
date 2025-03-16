import { describe, expect, it } from "vitest";
import { findClosestLocale } from "../../src/utils/i18n";

describe("findClosestLocale", () => {
  it("should match exact locale", () => {
    const locale = findClosestLocale("zh-CN", ["de-CH", "en-US", "zh-CN"]);
    expect(locale).toBe("zh-CN");
  });

  it("should match languages to locale", () => {
    const locale = findClosestLocale("zh", ["de-CH", "en-US", "zh-CN"]);
    expect(locale).toBe("zh-CN");
  });
});
