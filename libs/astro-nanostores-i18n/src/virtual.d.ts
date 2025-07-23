declare module "astro-nanostores-i18n:runtime" {
  import type { Components, Translations } from "@nanostores/i18n";
  export declare const currentLocale: import("nanostores").PreinitializedWritableAtom<string> & object;
  export declare const initializeI18n: (defaultLocale: string, translations: Record<string, Components>) => void;
  export declare const useFormat: () => import("@nanostores/i18n").Formatter;
  export declare const useI18n: <Body extends Translations>(componentName: string, baseTranslations: Body) => Body;
}
