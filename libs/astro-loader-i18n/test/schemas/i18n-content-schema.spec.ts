import { expect, describe, it } from "vitest";
import { localized } from "../../src/astro-loader-i18n";
import { z } from "astro/zod";

describe("i18nContentSchema", () => {
  it("should extend the schema", async () => {
    const schema = localized(z.string(), ["en", "fr", "de"] as const);
    expect(JSON.stringify(schema)).toMatchSnapshot();
    expect(schema.options[0].shape).toMatchSnapshot();
  });
  it("should extend the schema and make partial if option is set", async () => {
    const schema = localized(z.string(), ["en", "fr", "de"] as const, true);
    expect(JSON.stringify(schema)).toMatchSnapshot();
    expect(schema.options[0].shape).toMatchSnapshot();
  });
});
