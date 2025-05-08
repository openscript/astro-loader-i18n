export function getAllUniqueKeys(obj: Record<string, unknown>, keys = new Set<string>()): Set<string> {
  Object.entries(obj).forEach(([key, value]) => {
    keys.add(key);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      getAllUniqueKeys(value as Record<string, unknown>, keys);
    }
  });
  return keys;
}

function recursivePruneLocales(obj: Record<string, unknown>, locales: string[], locale: string) {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const valueAsRecord = value as Record<string, unknown>;
      const hasLocales = Object.keys(valueAsRecord).some((k) => locales.includes(k));
      let prunedValue: unknown | undefined = undefined;

      if (hasLocales) {
        prunedValue = valueAsRecord[locale] ?? undefined;
      } else {
        prunedValue = value;
      }

      if (prunedValue && typeof prunedValue === "object") {
        prunedValue = recursivePruneLocales(prunedValue as Record<string, unknown>, locales, locale);
      }

      result[key] = prunedValue;
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function pruneLocales(obj: Record<string, unknown>, locales: string[], locale: string) {
  if (Object.keys(obj).find((key) => locales.includes(key))) throw new Error("Top-level locales are not allowed");
  if (Object.keys(obj).length === 0) return obj;

  return recursivePruneLocales(obj, locales, locale);
}
