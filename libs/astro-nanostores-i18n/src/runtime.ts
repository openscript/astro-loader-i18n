import { Components, createI18n, formatter, type Translations } from "@nanostores/i18n";
import { atom } from "nanostores";

export const currentLocale = atom("");
let i18nInstance: ReturnType<typeof createI18n>;

export const initializeI18n = (defaultLocale: string, translations: Record<string, Components>) => {
  currentLocale.set(defaultLocale);
  if (!i18nInstance) {
    i18nInstance = createI18n(currentLocale, {
      baseLocale: defaultLocale,
      get: async () => ({}),
      cache: translations,
      isSSR: true,
    });
  }
};

export const useFormat = () => formatter(currentLocale).get();

export const useI18n = <Body extends Translations>(componentName: string, baseTranslations: Body) => {
  if (!i18nInstance) {
    throw new Error("i18n not initialized. Call initializeI18n first.");
  }
  return i18nInstance(componentName, baseTranslations).get();
};
