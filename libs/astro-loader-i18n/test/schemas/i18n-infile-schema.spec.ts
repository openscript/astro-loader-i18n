import { expect, describe, it } from "vitest";
import { extendI18nInfileSchema } from "../../src";
import { z } from "astro/zod";

describe("i18nInfileSchema", () => {
  it("should put common translation id and locale in data", async () => {
    const schema = extendI18nInfileSchema(z.string(), ["en", "fr", "de"] as const);
    expect(JSON.stringify(schema.shape)).toMatchSnapshot();
  });
});
