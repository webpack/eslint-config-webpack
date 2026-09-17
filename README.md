[![npm][npm]][npm-url]
[![test][test]][test-url]
[![discussions](https://img.shields.io/github/discussions/webpack/webpack)](https://github.com/webpack/webpack/discussions)

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="200" height="200"
    src="https://cdn.worldvectorlogo.com/logos/eslint.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>ESLint Config Webpack</h1>
  <p>Provides Webpacks's eslint config as an extensible shared config.<p>
</div>

# eslint-config-webpack

## Install

```bash
npm i -D eslint-config-webpack
```

## Usage

Webpack's eslint config contains all of our ESLint rules.

_In your eslint.config.js add ..._

```js
import { defineConfig } from "eslint/config";
import config from "eslint-config-webpack";

export default defineConfig([
	{
		extends: [config],
	},
]);
```

### Webpack-specific configs

Three opt-in configs cover conventions only webpack's own repositories need.
They are not part of `recommended` — extend them explicitly:

```js
import { defineConfig } from "eslint/config";
import config from "eslint-config-webpack";
import configs from "eslint-config-webpack/configs.js";

export default defineConfig([
	{
		extends: [
			config,
			configs["webpack/special"],
			configs["webpack/schemas"],
			configs["webpack/types"],
		],
	},
]);
```

| Config             | Files                      | What it checks                                                                                                                                                                                                     |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `webpack/special`  | source files               | `webpack/require-license-comment` — every file opens with the MIT license header.                                                                                                                                  |
| `webpack/schemas`  | `**/schemas/**/*.json`     | `webpack/valid-schema` — the JSON schema conventions webpack's declaration and validator generators rely on. `webpack/format-schema` — key order, and definitions kept in sync with the base schema (autofixable). |
| `webpack/types`    | `**/lib/**/*.{js,mjs,cjs}` | `webpack/inherit-jsdoc` — an overriding method carries the JSDoc of the method it overrides (autofixable).                                                                                                         |
| `webpack/comments` | source files               | `webpack/comment-length` — a plain comment spans at most three lines.                                                                                                                                              |

`webpack/valid-schema` accepts options for which keywords a schema may use.
`keywords` replaces the default set — webpack's own — outright, `allow` adds to
it and `disallow` removes from it:

```js
export default defineConfig([
	{
		extends: [configs["webpack/schemas"]],
		rules: {
			"webpack/valid-schema": [
				"error",
				{ allow: ["x-generator"], disallow: ["cli"] },
			],
		},
	},
]);
```

Every other check is unconditional. The rule reports a schema that uses a
keyword outside that set, puts anything next to a `$ref`, gives `type` more than one
value, uses `instanceof` without `tsType`, `absolutePath` off a string or
`properties` off a non-object, describes `properties` without
`additionalProperties`, nests or mis-sizes `oneOf`/`anyOf`/`allOf`, or leaves a
property without a description starting in uppercase and ending in a single dot.

`webpack/comment-length` caps how many lines one plain comment spans, so an
explanation that outgrows the code it sits above is split, cut or moved into the
JSDoc of what it describes. A run of `//` lines counts as one comment, and `max`
changes the limit:

```js
export default defineConfig([
	{
		files: ["lib/**/*.js", "test/**/*.js"],
		extends: [configs["webpack/comments"]],
		rules: {
			"webpack/comment-length": ["error", { max: 3 }],
		},
	},
]);
```

Three kinds of comment are exempt, because none of them is commentary on the
line below. A JSDoc block is a type contract and is multi-line by construction.
Every comment above the file's first statement documents the file, like the
license header — a `"use strict"` directive does not end that preamble. And a
`//` run opening with `WHY:` states why the code is shaped the way it is, which
is the one explanation that cannot be made shorter without losing it.

`webpack/inherit-jsdoc` needs type information, so `webpack/types` sets up
`@typescript-eslint/parser` with `projectService` — the project therefore needs
a `tsconfig.json` covering the linted files, and `typescript` installed. The
rule copies the base class method's JSDoc onto every override that is missing
it or has drifted from it, dropping `@abstract`. `stripTags` chooses which tags
are dropped:

```js
export default defineConfig([
	{
		extends: [configs["webpack/types"]],
		rules: {
			"webpack/inherit-jsdoc": [
				"error",
				{ stripTags: ["abstract", "virtual"] },
			],
		},
	},
]);
```

Getters, setters, static methods and methods overriding a declaration file (so
`Object.toString` or `Set.add`) are left alone. Inheritance is resolved through
the whole chain, so restoring a JSDoc that several classes deep an override
inherits takes more than one `--fix` run — repeat it until the tree stops
changing.

[npm]: https://img.shields.io/npm/v/eslint-config-webpack.svg
[npm-url]: https://npmjs.com/package/eslint-config-webpack
[test]: https://github.com/webpack/eslint-config-webpack/actions/workflows/test.yml/badge.svg
[test-url]: https://github.com/webpack/eslint-config-webpack/actions/workflows/test.yml
