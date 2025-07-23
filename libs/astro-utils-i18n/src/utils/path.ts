const TRIM_SLASHES_PATTERN = /^\/|\/$/g;
const TRIM_RELATIVE_PATTERN = /^\.{0,2}\/|\/$/g;
const DOUBLE_POINTS_PATTERN = /\.{2}/g;
const DOUBLE_SLASH_PATTERN = /\/{2}/g;
const DIRNAME_PATTERN = /\/[^/]+$/g;
const INDEX_COMMON_TRANSLATION_ID = "index";
const createLocalePattern = (pathLocale: string) => new RegExp(`(?<=[./])${pathLocale}(?=[./])`, "i");

export function joinPath(...paths: Array<string | number | undefined>) {
  return paths.filter(Boolean).join("/");
}

/**
 * Resolves and joins multiple path segments into a single normalized path.
 *
 * This function trims leading and trailing slashes from string path segments
 * and ensures the resulting path starts with a single forward slash (`/`).
 * Non-string segments (e.g., numbers or `undefined`) are included as-is.
 *
 * @param paths - An array of path segments which can be strings, numbers, or `undefined`.
 * @returns A normalized path string starting with a forward slash.
 */
export function resolvePath(...paths: Array<string | number | undefined>) {
  const trimmedPaths = paths.map((path) => (typeof path === "string" ? path.replace(TRIM_SLASHES_PATTERN, "") : path));
  return `/${joinPath(...trimmedPaths)}`;
}

export const trimSlashes = (path: string) => {
  return path === "/" ? path : path.replace(TRIM_SLASHES_PATTERN, "");
};

export const trimRelativePath = (path: string) => {
  return path === "/" ? path : path.replace(TRIM_RELATIVE_PATTERN, "");
};

export const parseLocale = (path: string, locales: string[], defaultLocale: string) => {
  const localePattern = createLocalePattern(`(${locales.join("|")})`);
  const locale = path.match(localePattern)?.[0];

  return locale ? locale : defaultLocale;
};

export const createTranslationId = (path: string, locale?: string) => {
  if (locale) path = path.replace(createLocalePattern(locale), "");
  path = path.replace(DOUBLE_POINTS_PATTERN, ".");
  path = path.replace(DOUBLE_SLASH_PATTERN, "/");
  path = trimSlashes(path);

  return path === "" || path === "/" ? INDEX_COMMON_TRANSLATION_ID : path;
};

export const createContentPath = (path: string, base?: string | URL, locale?: string) => {
  let basePath = base ? (base instanceof URL ? base.pathname : base) : undefined;
  if (basePath) {
    basePath = trimRelativePath(basePath);
    const basePathIndex = path.indexOf(basePath);
    path = basePathIndex !== -1 ? path.slice(basePathIndex + basePath.length) : path;
  }
  path = createTranslationId(path, locale);
  if (path.includes(INDEX_COMMON_TRANSLATION_ID)) {
    path = path.replace(DIRNAME_PATTERN, "");
  }
  path = path.includes("/") ? path.replace(DIRNAME_PATTERN, "") : "";

  return path;
};
