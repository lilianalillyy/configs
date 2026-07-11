# @lilianaa/configs

Shared ESLint and Prettier configuration for my apps. Prettier is not run directly, it runs as an ESLint rule via `eslint-plugin-prettier`, so a single `eslint --fix` both lints and formats.

Includes out of the box:

- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- Prettier as an ESLint rule (`prettier/prettier`), with conflicting stylistic rules disabled
- Import sorting via `eslint-plugin-simple-import-sort`
- Optional Vue 3 support (`eslint-plugin-vue` + TypeScript in SFCs)

## Requirements

- Works with both **ESLint 9 and ESLint 10**. By default, ESLint 10 is installed.
- Node.js: ESLint 10 requires `^20.19.0 || ^22.13.0 || >=24`. If you're stuck on an older Node, pin ESLint 9 (see [Using ESLint 9](#using-eslint-9)).

## Installation

```sh
pnpm add -D @lilianaa/configs
```

ESLint, Prettier, and all plugins are pulled in as dependencies of this package. You don't need to install them separately

## Usage

Every project needs **both** config files described below: `eslint.config.mjs` and `prettier.config.cjs`. Although Prettier itself is not invoked, the config is needed because the `prettier/prettier` ESLint rule reads it, and formatting will not work correctly without it.

### ESLint

Create `eslint.config.mjs` in your project root:

```js
import { createConfig } from "@lilianaa/configs/eslint.config.mjs";

export default createConfig();
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "pnpm lint --fix"
  }
}
```

#### Options

`createConfig()` accepts an options object:

| Option    | Default                    | Description                                            |
| --------- | -------------------------- | ------------------------------------------------------ |
| `include` | `[]`                       | Extra presets to enable. Currently supported: `"vue"`. |
| `ignores` | `["node_modules", "dist"]` | Paths ESLint should ignore.                            |
| `globals` | `["jest", "node"]`         | Global environments to enable.                         |

Globals are specified by their key in the [`globals`](https://www.npmjs.com/package/globals) package (e.g. `"browser"`, `"node"`, `"jest"`).

> The boolean `vue` option is deprecated — use `include: ["vue"]` instead.

#### Vue

```js
import { createConfig } from "@lilianaa/configs/eslint.config.mjs";

export default createConfig({ include: ["vue"] });
```

This enables `eslint-plugin-vue` (flat/recommended), parses `<script lang="ts">` with the TypeScript parser, and adds `browser` globals.

#### Extending

`createConfig()` returns a config array — spread it and append your own entries:

```js
import { createConfig } from "@lilianaa/configs/eslint.config.mjs";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

export default [
  ...createConfig(),
  {
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: false, prefix: "#src" },
      ],
    },
  },
];
```

### Prettier

The Prettier config file is **required** — `eslint-plugin-prettier` resolves the formatting settings from it, so the `prettier/prettier` rule doesn't work without it. It is also what editors and other tooling read. Always create `prettier.config.cjs` alongside `eslint.config.mjs`:

```js
module.exports = require("@lilianaa/configs/prettier.config.cjs");
```

Defaults: `tabWidth: 2`, `semi: true`, `singleQuote: false`, `printWidth: 120`.

To override:

```js
const baseConfig = require("@lilianaa/configs/prettier.config.cjs");

module.exports = {
  ...baseConfig,
  tabWidth: 4,
};
```

## Using ESLint 9

The package resolves to ESLint 10 by default. To stay on ESLint 9 (e.g. on Node 18), override **both** `eslint` and `@eslint/js` — `@eslint/js@10` requires ESLint 10:

```yaml
# pnpm-workspace.yaml
overrides:
  eslint: ^9.28.0
  "@eslint/js": ^9.28.0
```

(With npm, use the equivalent `overrides` field in `package.json`.)

## License

See [LICENSE.md](LICENSE.md).
