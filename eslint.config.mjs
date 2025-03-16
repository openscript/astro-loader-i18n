import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["**/vite.config.*.timestamp*", "**/vitest.config.*.timestamp*", "**/dist/**", "**/.astro/**"],
  },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginPrettierRecommended,
];
