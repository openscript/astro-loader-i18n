import { describe, expect, it } from "vitest";
import { createI18nCollection } from "../../src/collections/create-i18n-collection";

describe("createI18nCollection", () => {
  it("should create a collection based on the provided locales and route pattern", () => {
    const locales = ["en", "de"];
    const routePattern = "/[...locale]/blog/[slug]";
    expect(createI18nCollection({ locales, routePattern })).toMatchSnapshot();
  });
});
