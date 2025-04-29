import { expect, describe, it } from "vitest";
import { extendI18nInfileSchema } from "../../src/astro-loader-i18n";
import { z } from "astro/zod";

describe("i18nInfileSchema", () => {
  it("should extend the schema", async () => {
    const schema = extendI18nInfileSchema(z.string(), ["en", "fr", "de"] as const);
    expect(JSON.stringify(schema.shape)).toMatchSnapshot();
  });
});
