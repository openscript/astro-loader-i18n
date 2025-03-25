const TRIM_SLASHES_PATTERN = /^\/|\/$/g;
const DOUBLE_POINTS_PATTERN = /\.{2}/g;
const DOUBLE_SLASH_PATTERN = /\/{2}/g;
const INDEX_COMMON_TRANSLATION_ID = "index";

export function joinPath(...paths: Array<string | number | undefined>) {
  return paths.filter(Boolean).join("/");
}

export function resolvePath(...paths: Array<string | number | undefined>) {
  return `/${joinPath(...paths)}`;
}

export const trimSlashes = (path: string) => {
  return path === "/" ? path : path.replace(TRIM_SLASHES_PATTERN, "");
};

export const parseLocale = (path: string, locales: string[], defaultLocale: string) => {
  const locale = locales.find((locale) => path.indexOf(locale) !== -1);

  if (locale) {
    return locale;
  }

  return defaultLocale;
};

export const createTranslationId = (path: string, pathLocale: string) => {
  path = path.replace(pathLocale, "");
  path = path.replace(DOUBLE_POINTS_PATTERN, ".");
  path = path.replace(DOUBLE_SLASH_PATTERN, "/");
  path = trimSlashes(path);

  if (path === "" || path === "/") return INDEX_COMMON_TRANSLATION_ID;

  return path;
};
