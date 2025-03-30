import { describe, expect, it } from "vitest";
import { createCollection } from "../../src";

describe("createCollection", () => {
  it("should create a collection based on the provided locales and route pattern", () => {
    const locales = ["en", "de"];
    const routePattern = "/[...locale]/blog/[slug]";
    expect(createCollection({ locales, routePattern })).toMatchSnapshot();
  });
});
