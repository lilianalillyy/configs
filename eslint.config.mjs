// @ts-check

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * @type {import('typescript-eslint').ConfigWithExtends["rules"]}
 */
const BASE_RULES = {
  "no-unused-vars": ["off"],
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/no-explicit-any": "warn",
  "no-empty": ["warn", { allowEmptyCatch: true }],
  "simple-import-sort/imports": "error",
  "@typescript-eslint/no-empty-function": "off",
  "import/no-anonymous-default-export": "off",
  "@typescript-eslint/ban-ts-comment": "warn",
  "no-useless-escape": "off",
};

/**
 * @type {import('typescript-eslint').ConfigWithExtends["rules"]}
 */
const VUE_RULES = {
  "vue/multi-word-component-names": "off",
  "vue/first-attribute-linebreak": "off",
  "vue/max-attributes-per-line": "off",
  "vue/no-reserved-component-names": [
    "error",
    {
      htmlElementCaseSensitive: true,
    },
  ],
  "vue/html-self-closing": [
    "error",
    {
      html: {
        void: "always",
      },
    },
  ],
};

export function createConfig({
  vue: useVue = false,
  ignores = ["node_modules", "dist"],
  globals: globalsKeys = ["jest", "node"],
} = {}) {
  if (useVue) {
    globalsKeys.push("browser");
  }

  globalsKeys = [...new Set(globalsKeys)];

  return tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.eslintRecommended,
    ...tseslint.configs.recommended,
    ...(useVue ? vue.configs["flat/recommended"] : []),
    eslintPluginPrettierRecommended,
    {
      plugins: {
        "simple-import-sort": simpleImportSort,
      },
      rules: {
        ...BASE_RULES,
        ...(useVue ? VUE_RULES : {}),
      },
      languageOptions: {
        parserOptions: {
          ...(useVue ? { parser: "@typescript-eslint/parser" } : {}),
        },
        globals: globalsKeys.reduce((acc, curr) => {
          return Object.assign(acc, globals[curr]);
        }, {}),
      },
      ignores: [...new Set(ignores)],
    },
  );
}

const defaultConfig = createConfig();

export default defaultConfig;
