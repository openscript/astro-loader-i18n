import { resolvePath } from "./path";

type Segments = Record<string, string | undefined>;
export type SegmentTranslations = Record<string, Segments>;
type RouteSegment = {
  spread: boolean;
  param: boolean;
  value: string;
};
type RoutePattern = RouteSegment[];

/**
 * Parses a route pattern into an array of route segments.
 *
 * @param routePattern is a string that templates the a route (e.g. /[...locale]/blog/[slug])
 */
export function parseRoutePattern(routePattern: string): RoutePattern {
  const segments = routePattern
    .split("/")
    .filter((segment) => segment !== "")
    .map((segment) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return {
          spread: segment.startsWith("[..."),
          param: true,
          value: segment.replace("[", "").replace("...", "").replace("]", ""),
        };
      }

      return {
        spread: false,
        param: false,
        value: segment,
      };
    });

  if (segments.length === 0) {
    return [{ spread: false, param: false, value: "/" }];
  }

  return segments;
}

/**
 *
 * @param routePattern is an array consisting of route segments
 */
export function buildPath(routePattern: RoutePattern, segmentValues: Segments): string {
  return resolvePath(
    ...routePattern.map((segment) => {
      if (segment.param) {
        if (!segmentValues[segment.value] && !segment.spread) {
          throw new Error(`No segment value found for route segment ${segment.value}`);
        }

        return segmentValues[segment.value];
      }
      return `${segment.value}`;
    })
  );
}
