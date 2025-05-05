import { describe, expect, it } from "vitest";
import { convertToSingleLocale, getAllUniqueKeys } from "../../src/utils/collection";

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

describe("convertToSingleLocale", () => {
  it("should convert to single locale", () => {
    const result = convertToSingleLocale(
      {
        en: { a: 1, b: 2 },
        fr: { a: 3, b: 4 },
        de: { a: 5, b: 6 },
      },
      ["en", "fr", "de"],
      "en"
    );
    expect(result).toMatchSnapshot();
  });
  it("should convert to single locale with empty object", () => {
    const result = convertToSingleLocale({}, ["en", "fr", "de"], "en");
    expect(result).toMatchSnapshot();
  });
  it("should convert to single locale when locale is nested", () => {
    const result = convertToSingleLocale(
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
