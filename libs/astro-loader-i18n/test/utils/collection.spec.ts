import { describe, expect, it } from "vitest";
import { getAllUniqueKeys, pruneLocales } from "../../src/utils/collection";

describe("getAllUniqueKeys", () => {
  it("should return all unique keys of an object", () => {
    const result = getAllUniqueKeys({
      a: {
        b: {
          c: 1,
          d: 2,
        },
        e: 3,
      },
      b: 4,
      g: {
        a: 5,
        i: {
          c: 6,
          k: 7,
        },
      },
    });
    expect(result).toMatchSnapshot();
  });
});

describe("pruneLocales", () => {
  it("should prune locales with top level locale data as objects", () => {
    const result = () => {
      pruneLocales(
        {
          en: { a: 1, b: 2 },
          fr: { a: 3, b: 4 },
          de: { a: 5, b: 6 },
        },
        ["en", "fr", "de"],
        "en"
      );
    };
    expect(result).toThrowErrorMatchingSnapshot();
  });
  it("should prune locales with top level local data as strings", () => {
    const result = () => {
      pruneLocales(
        {
          en: "Hello",
          fr: "Bonjour",
          de: "Hallo",
        },
        ["en", "fr", "de"],
        "en"
      );
    };
    expect(result).toThrowErrorMatchingSnapshot();
  });
  it("should prune locales with no data", () => {
    const result = pruneLocales({}, ["en", "fr", "de"], "en");
    expect(result).toMatchSnapshot();
  });
  it("should prune locales with nested data", () => {
    const result = pruneLocales(
      {
        title: { en: "Title", fr: "Titre", de: "Titel" },
        nested: {
          en: { a: 7, b: 8 },
          fr: { a: 9, b: 10 },
          de: { a: 11, b: 12 },
        },
        string: "normal string",
        number: 123,
        boolean: true,
        array: [1, 2, 3],
        object: { a: 1, b: 2 },
      },
      ["en", "fr", "de"],
      "en"
    );
    expect(result).toMatchSnapshot();
  });
});
