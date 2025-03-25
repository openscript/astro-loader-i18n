import { describe, expect, it } from "vitest";
import { localePaths } from "../../src/paths/locale-paths";

describe("localePaths", () => {
  it("should generate paths for a valid collection", () => {
    const collection = [{ data: { locale: "en", translationId: "magic.mdx" } }, { data: { locale: "zh", translationId: "magic.mdx" } }];
    const result = localePaths(collection);
    expect(result).toEqual([
      { params: { locale: "en" }, props: { locale: "en" } },
      { params: { locale: "zh" }, props: { locale: "zh" } },
    ]);
  });

  it("should handle an empty collection", () => {
    const collection: unknown[] = [];
    const result = localePaths(collection);
    expect(result).toEqual([]);
  });

  it("should throw an error for an invalid collection", () => {
    const invalidCollection = [{ data: { invalidKey: "value" } }];
    expect(() => localePaths(invalidCollection)).toThrow();
  });
});
