import type { ComponentsJSON } from "@nanostores/i18n";
import type { AstroIntegration } from "astro";
import { addVirtualImports, createResolver } from "astro-integration-kit";
import { name } from "../package.json";

type Options = {
  translations?: Record<string, ComponentsJSON>;
};

/**
 * Astro integration for nanostores-i18n.
 *
 * This integration sets up the i18n configuration and provides the necessary
 * stores for managing translations and locale settings.
 *
 * @returns {AstroIntegration} The Astro integration object.
 */
const createPlugin = (options: Options): AstroIntegration => {
  const { resolve } = createResolver(import.meta.url);
  return {
    name,
    hooks: {
      "astro:config:setup": (params) => {
        const { config, logger } = params;

        if (!config.i18n) {
          logger.error(
            `The ${name} integration requires the i18n configuration in your Astro config. Please add it to your astro.config.ts file.`
          );
          return;
        }

        addVirtualImports(params, {
          name,
          imports: {
            [`${name}:runtime`]: `import { initializeI18n, useI18n, currentLocale } from "${resolve("./runtime.js")}";

initializeI18n("${config.i18n.defaultLocale}", ${JSON.stringify(options.translations || {})});

export { useI18n, currentLocale };
`,
          },
        });
      },
      "astro:config:done": (params) => {
        const { injectTypes } = params;
        injectTypes({
          filename: `${name}.d.ts`,
          content: `declare module "${name}:runtime" {
  import type { ComponentsJSON, Translations } from '@nanostores/i18n';
  export declare const currentLocale: import('nanostores').PreinitializedWritableAtom<string> & object;
  export declare const initializeI18n: (defaultLocale: string, translations: Record<string, ComponentsJSON>) => void;
  export declare const useI18n: <Body extends Translations>(componentName: string, baseTranslations: Body) => Promise<import('@nanostores/i18n').Messages<Body>>;
}
`,
        });
      },
    },
  };
};

export default createPlugin;
