// @ts-check

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
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
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    ignores: ["node_modules/"],
  },
);
