import { GetStaticPathsResult } from "astro";

export function mergeStaticPaths(...staticPaths: GetStaticPathsResult[]): GetStaticPathsResult {
  if (staticPaths.some((paths) => paths.length !== staticPaths[0].length)) {
    throw new Error("All static paths must have the same length");
  }

  return staticPaths[0].map((entry, index) => {
    return staticPaths.reduce(
      (merged, current) => ({
        params: { ...merged.params, ...current[index].params },
        props: { ...merged.props, ...current[index].props },
      }),
      entry
    );
  });
}
