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

Two opt-in configs cover conventions only webpack's own repositories need. They
are not part of `recommended` — extend them explicitly:

```js
import { defineConfig } from "eslint/config";
import config from "eslint-config-webpack";
import configs from "eslint-config-webpack/configs.js";

export default defineConfig([
	{
		extends: [config, configs["webpack/special"], configs["webpack/schemas"]],
	},
]);
```

| Config            | Files                  | What it checks                                                                                               |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `webpack/special` | source files           | `webpack/require-license-comment` — every file opens with the MIT license header.                            |
| `webpack/schemas` | `**/schemas/**/*.json` | `webpack/valid-schema` — the JSON schema conventions webpack's declaration and validator generators rely on. |

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

[npm]: https://img.shields.io/npm/v/eslint-config-webpack.svg
[npm-url]: https://npmjs.com/package/eslint-config-webpack
[test]: https://github.com/webpack/eslint-config-webpack/actions/workflows/test.yml/badge.svg
[test-url]: https://github.com/webpack/eslint-config-webpack/actions/workflows/test.yml
