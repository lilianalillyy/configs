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

const CONFIGS = {
  vue: {
    parser: "@typescript-eslint/parser",
    ignores: [],
    globals: ["browser"],
    rules: VUE_RULES,
  },
};

export function createConfig({
  /** @deprecated Use `include: ["vue"]` instead. */
  vue: legacyUseVue = false,
  include = /** @type {string[]} */ ([]),
  ignores = ["node_modules", "dist"],
  globals: globalsKeys = ["jest", "node"],
} = {}) {
  const includesVue = include.includes("vue");

  if (legacyUseVue) {
    const refactorSuggestion = includesVue
      ? "Remove it from your config options."
      : 'Please use `include: ["vue"]` instead.';

    console.warn(`[@lilianaa/configs] The "vue" option is deprecated. ${refactorSuggestion}`);

    if (!includesVue) {
      include.push("vue");
    }
  }

  // Deduplicate includes.
  include = [...new Set(include)];

  const mergedIncludedConfig = include
    // Filter for known configs only.
    .filter((key) => {
      if (!(key in CONFIGS)) {
        console.warn(`[@lilianaa/configs] Unknown config "${key}" included.`);
        return false;
      }

      return true;
    })
    // Get the config objects.
    .map((key) => {
      // @ts-expect-error TS can't infer that key is in CONFIGS
      return CONFIGS[key];
    })
    // Merge them together.
    .reduce(
      (acc, curr) => {
        acc.parser = curr.parser || acc.parser;
        acc.ignores.push(...curr.ignores);
        acc.globals.push(...curr.globals);
        Object.assign(acc.rules, curr.rules);

        return acc;
      },
      {
        parser: null,
        ignores: [],
        globals: [],
        rules: {},
      },
    );

  // Merge config globals and include globals.
  globalsKeys = [...globalsKeys, ...mergedIncludedConfig.globals];
  // Deduplicate globals.
  globalsKeys = [...new Set(globalsKeys)];

  return tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.eslintRecommended,
    ...tseslint.configs.recommended,
    // FIXME: This should be part of VUE_RULES, but it needs to be applied earlier.
    ...(includesVue ? vue.configs["flat/recommended"] : []),
    eslintPluginPrettierRecommended,
    {
      plugins: {
        "simple-import-sort": simpleImportSort,
      },
      rules: {
        ...BASE_RULES,
        ...mergedIncludedConfig.rules,
      },
      languageOptions: {
        parserOptions: {
          ...(mergedIncludedConfig.parser ? { parser: mergedIncludedConfig.parser } : {}),
        },
        globals: globalsKeys.reduce((acc, curr) => {
          if (!(curr in globals)) {
            console.warn(`[@lilianaa/configs] Unknown global "${curr}" specified.`);
            return acc;
          }

          // @ts-expect-error TS can't infer that curr is in globals
          return Object.assign(acc, globals[curr]);
        }, {}),
      },
      ignores: [...new Set(ignores)],
    },
  );
}

const defaultConfig = createConfig();

export default defaultConfig;
