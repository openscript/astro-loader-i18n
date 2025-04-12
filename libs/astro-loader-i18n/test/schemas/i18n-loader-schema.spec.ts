import { expect, describe, it } from "vitest";
import { extendI18nLoaderSchema } from "../../src";
import { z } from "astro/zod";
import { checkI18nLoaderCollection } from "../../src/schemas/i18n-loader-schema";

describe("i18nLoaderSchema", () => {
  it("should extend the schema", () => {
    const schema = extendI18nLoaderSchema(z.object({ title: z.string() }));
    expect(JSON.stringify(schema.shape)).toMatchSnapshot();
  });
  it("should throw an error when checkI18nLoaderCollection fails", () => {
    const invalidData = [
      { data: { translationId: "1", locale: "en" } },
      { data: { translationId: "2", locale: "fr" } },
      { data: { translationId: "3" } },
    ];

    expect(() => checkI18nLoaderCollection(invalidData)).toThrowErrorMatchingSnapshot();
  });
});
