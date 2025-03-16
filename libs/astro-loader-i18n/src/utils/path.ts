const FILENAME_SUFFIX_PATTERN = /^([^.]+)\.?(.*)?(?=\.\w+)/;
const ALL_SLASHES_PATTERN = /\//g;
const INDEX_LOCALE_PAGES_ID = "index";

export const trimSlashes = (path: string) => {
  return path === "/" ? path : path.replace(/^\/|\/$/g, "");
};

export const parseFilenameSuffix = (name: string, defaultLocale: string) => {
  const nameMatch = name.match(FILENAME_SUFFIX_PATTERN);
  const filename = nameMatch && nameMatch[1] ? nameMatch[1] : name;
  const estimatedLocale = nameMatch && nameMatch[2] ? nameMatch[2] : defaultLocale;

  return { filename, estimatedLocale };
};

export const createCommonTranslationId = (path: string, prefix?: string) => {
  let commonTranslationId = trimSlashes(path).replace(ALL_SLASHES_PATTERN, ".");

  if (prefix) {
    commonTranslationId = commonTranslationId.replace(new RegExp(`^${prefix}\\.`), "");
  }

  if (commonTranslationId === "." || commonTranslationId === prefix) {
    return INDEX_LOCALE_PAGES_ID;
  }

  return commonTranslationId;
};
