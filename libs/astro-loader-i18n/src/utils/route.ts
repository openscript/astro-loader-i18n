import limax from "limax";
import { resolvePath } from "./path";

type SegmentTranslation = Record<string, string>;
export type SegmentTranslations = Record<string, SegmentTranslation>;
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
export function buildPath(routePattern: RoutePattern, segmentTranslation: SegmentTranslation, slugParamName?: string, title?: string): string {
  return resolvePath(
    ...routePattern.map((segment) => {
      if (segment.param) {
        if (segment.value === slugParamName && title) {
          return limax(title);
        }

        if (!segmentTranslation[segment.value]) {
          throw new Error(`No translation found for route segment ${segment.value}`);
        }

        return segmentTranslation[segment.value];
      }

      return `${segment.value}`;
    })
  );
}
