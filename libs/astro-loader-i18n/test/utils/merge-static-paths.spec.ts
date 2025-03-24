import { GetStaticPathsResult } from "astro";
import { describe, expect, it } from "vitest";
import { mergeStaticPaths } from "../../src/utils/merge-static-paths";

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

describe("mergeStaticPaths", () => {
  it("should merge static paths", () => {
    const merged = mergeStaticPaths(...fixture);
    expect(merged).toMatchSnapshot();
  });
});
