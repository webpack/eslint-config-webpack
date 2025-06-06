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
		extends: [config]
	}
]);
```

[npm]: https://img.shields.io/npm/v/eslint-config-webpack.svg
[npm-url]: https://npmjs.com/package/eslint-config-webpack
[test]: https://github.com/webpack/eslint-config-webpack/actions/workflows/test.yml/badge.svg
[test-url]: https://github.com/webpack/eslint-config-webpack/actions/workflows/test.yml
