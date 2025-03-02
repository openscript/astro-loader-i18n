export function findClosestLocale(locale: string, locales: string[]) {
  if (locale.length === 5) {
    return locales.find((l) => l === locale);
  }
  return locales.find((l) => l.indexOf(locale) !== -1);
}
