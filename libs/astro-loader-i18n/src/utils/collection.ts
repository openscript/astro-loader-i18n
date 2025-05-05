export function getAllUniqueKeys(obj: Record<string, unknown>, keys = new Set<string>()): Set<string> {
  Object.entries(obj).forEach(([key, value]) => {
    keys.add(key);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      getAllUniqueKeys(value as Record<string, unknown>, keys);
    }
  });
  return keys;
}

export function convertToSingleLocale(obj: Record<string, unknown>, locales: string[], locale: string): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (result, [key, value]) => {
      if (key === locale) {
        Object.assign(result, value);
      } else if (!locales.includes(key)) {
        result[key] =
          typeof value === "object" && !Array.isArray(value) ? convertToSingleLocale(value as Record<string, unknown>, locales, locale) : value;
      }
      return result;
    },
    {} as Record<string, unknown>
  );
}
