import { GetStaticPathsResult } from "astro";
import { describe, expect, it } from "vitest";
import { mergeGetStaticPathsResults } from "../../src/utils/merge";

const fixture: GetStaticPathsResult[] = [
  [
    { params: { locale: "en" }, props: { locale: "en" } },
    { params: { locale: "de" }, props: { locale: "de" } },
  ],
  [
    { params: {}, props: { commonTransaltionId: "some/page.mdx" } },
    { params: {}, props: { commonTransaltionId: "some/page.mdx" } },
  ],
];

describe("mergeGetStaticPathsResults", () => {
  it("should merge static paths", () => {
    const merged = mergeGetStaticPathsResults(...fixture);
    expect(merged).toMatchSnapshot();
  });
});
