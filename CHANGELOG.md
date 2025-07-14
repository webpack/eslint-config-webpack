# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.3.3](https://github.com/webpack/eslint-config-webpack/compare/v4.3.2...v4.3.3) (2025-07-14)


### Bug Fixes

* avoid jest special comments to lint ([#72](https://github.com/webpack/eslint-config-webpack/issues/72)) ([4fbe4b0](https://github.com/webpack/eslint-config-webpack/commit/4fbe4b0115c3603a568c1b899affa0d6a3076948))
* disable `@typescript-eslint/triple-slash-reference` for markdown ([#74](https://github.com/webpack/eslint-config-webpack/issues/74)) ([a11f2cb](https://github.com/webpack/eslint-config-webpack/commit/a11f2cb0019c9d3f5665b59d2df9c94ba7a8a8a7))
* disable `no-new` rule for markdown ([#73](https://github.com/webpack/eslint-config-webpack/issues/73)) ([4b2e171](https://github.com/webpack/eslint-config-webpack/commit/4b2e17151e543dac5cbc40329683088899952540))

### [4.3.2](https://github.com/webpack/eslint-config-webpack/compare/v4.3.1...v4.3.2) (2025-07-14)


### Bug Fixes

* loading react plugin ([44a2d90](https://github.com/webpack/eslint-config-webpack/commit/44a2d9096f0276ffff8561a2dc5549094d4dfec1))
* markdown files glob ([#71](https://github.com/webpack/eslint-config-webpack/issues/71)) ([fae0010](https://github.com/webpack/eslint-config-webpack/commit/fae0010e081100639d7d6df3f9b33e04df682d31))

### [4.3.1](https://github.com/webpack/eslint-config-webpack/compare/v4.3.0...v4.3.1) (2025-07-14)


### Bug Fixes

* disable `@typescript-eslint/no-unused-vars` for markdown files ([#69](https://github.com/webpack/eslint-config-webpack/issues/69)) ([fcbf2a3](https://github.com/webpack/eslint-config-webpack/commit/fcbf2a346ca6b39b591733bf078f0f617ef6bbd3))
* improve react support ([64c1204](https://github.com/webpack/eslint-config-webpack/commit/64c12048e4e5e9b543b83fff15f66a0014cbb320))
* improve typescript support ([#67](https://github.com/webpack/eslint-config-webpack/issues/67)) ([6750fc3](https://github.com/webpack/eslint-config-webpack/commit/6750fc3b2fe46933b8ca86956e38855b0159de37))

## [4.3.0](https://github.com/webpack/eslint-config-webpack/compare/v4.2.2...v4.3.0) (2025-07-01)


### Features

* added special webpack rule to check license comments ([#66](https://github.com/webpack/eslint-config-webpack/issues/66)) ([1a6a880](https://github.com/webpack/eslint-config-webpack/commit/1a6a8800e1cd5618440ce2043f6b3ab7d3eb6e24))

### [4.2.2](https://github.com/webpack/eslint-config-webpack/compare/v4.2.1...v4.2.2) (2025-07-01)


### Bug Fixes

* allow to use `process-exit` in docs ([#65](https://github.com/webpack/eslint-config-webpack/issues/65)) ([06570d4](https://github.com/webpack/eslint-config-webpack/commit/06570d4927d610e465798e7c12d29939e2522cf7))

### [4.2.1](https://github.com/webpack/eslint-config-webpack/compare/v4.2.0...v4.2.1) (2025-07-01)


### Bug Fixes

* allow to use `eval` in tests ([#62](https://github.com/webpack/eslint-config-webpack/issues/62)) ([9b98e49](https://github.com/webpack/eslint-config-webpack/commit/9b98e496afaec20d6a60bf7e4d056d1464ddf035))
* apply DOM rules only for the browser target ([#61](https://github.com/webpack/eslint-config-webpack/issues/61)) ([4607d8f](https://github.com/webpack/eslint-config-webpack/commit/4607d8f71032530485ae285d9058eb975dbbdd1a))
* disable `no-control-regex` for tests ([#60](https://github.com/webpack/eslint-config-webpack/issues/60)) ([71b3d96](https://github.com/webpack/eslint-config-webpack/commit/71b3d96662c737f0bf787697d3a8464945395830))
* relax test rules ([#64](https://github.com/webpack/eslint-config-webpack/issues/64)) ([98b7b67](https://github.com/webpack/eslint-config-webpack/commit/98b7b67628bc98f6a0e3027c18228c218cb984f0))
* use node.js recommended rules by default ([#63](https://github.com/webpack/eslint-config-webpack/issues/63)) ([4745549](https://github.com/webpack/eslint-config-webpack/commit/4745549aa7d706146b57d2357b69da5930d439ee))

## [4.2.0](https://github.com/webpack/eslint-config-webpack/compare/v4.1.4...v4.2.0) (2025-06-27)


### Features

* enable rule for order of imports and exports ([#59](https://github.com/webpack/eslint-config-webpack/issues/59)) ([387c167](https://github.com/webpack/eslint-config-webpack/commit/387c167b288384371039214cf74213870014b63e))
* plugin and rule to sort package.json properties ([ca57ab4](https://github.com/webpack/eslint-config-webpack/commit/ca57ab4feb40a9d99f96136365ef5d8d4599536f))


### Bug Fixes

* enable `reportUnusedInlineConfigs` ([#56](https://github.com/webpack/eslint-config-webpack/issues/56)) ([f53c2ba](https://github.com/webpack/eslint-config-webpack/commit/f53c2ba8cceca47d7e0ffee04eed9eccc47d22de))
* more path to ignore ([#57](https://github.com/webpack/eslint-config-webpack/issues/57)) ([8272ec4](https://github.com/webpack/eslint-config-webpack/commit/8272ec4d1bd98e65d4bbe38a6003ee1f6dbccbfd))

### [4.1.4](https://github.com/webpack/eslint-config-webpack/compare/v4.1.3...v4.1.4) (2025-06-25)


### Bug Fixes

* ignore ts extension for `require` in typescript code ([#55](https://github.com/webpack/eslint-config-webpack/issues/55)) ([1b2558f](https://github.com/webpack/eslint-config-webpack/commit/1b2558f7a8c9c07c0ddfe85809d1392dc83f38be))

### [4.1.3](https://github.com/webpack/eslint-config-webpack/compare/v4.1.2...v4.1.3) (2025-06-24)


### Bug Fixes

* better configuration for module/commonjs/dirty format ([#51](https://github.com/webpack/eslint-config-webpack/issues/51)) ([7de7ddf](https://github.com/webpack/eslint-config-webpack/commit/7de7ddf4cfcde0f64b99a39813b42fb1bfa5f5b1))
* disable `guard-for-in` for extra noise ([#52](https://github.com/webpack/eslint-config-webpack/issues/52)) ([0e894a5](https://github.com/webpack/eslint-config-webpack/commit/0e894a5302daeb9959ca7dadbd73bc1e69bcd511))
* improve jest `files` ([#50](https://github.com/webpack/eslint-config-webpack/issues/50)) ([90a979e](https://github.com/webpack/eslint-config-webpack/commit/90a979eb4ab3c5303908a11b06cfb38855c3a9f0))
* more newlines ([#49](https://github.com/webpack/eslint-config-webpack/issues/49)) ([7e17d6b](https://github.com/webpack/eslint-config-webpack/commit/7e17d6b83f79b7216afd435d1fd9acf39742f8ac))

### [4.1.2](https://github.com/webpack/eslint-config-webpack/compare/v4.1.1...v4.1.2) (2025-06-23)


### Bug Fixes

* do not apply typescript rules when emit disabled ([#48](https://github.com/webpack/eslint-config-webpack/issues/48)) ([5bed1ab](https://github.com/webpack/eslint-config-webpack/commit/5bed1ab9e3a8c7c350e4a929efe4ac3001f58253))

### [4.1.1](https://github.com/webpack/eslint-config-webpack/compare/v4.1.0...v4.1.1) (2025-06-20)


### Bug Fixes

* crash without `typescript-eslint` ([#47](https://github.com/webpack/eslint-config-webpack/issues/47)) ([9534172](https://github.com/webpack/eslint-config-webpack/commit/95341721e3c8a6588deb9787a97a97d5dcefed52))

## [4.1.0](https://github.com/webpack/eslint-config-webpack/compare/v4.0.10...v4.1.0) (2025-06-12)


### Features

* added `typescript/recommended` preset ([fea16fb](https://github.com/webpack/eslint-config-webpack/commit/fea16fbf6b1e789fd49fac270aed912988b71793))

### [4.0.10](https://github.com/webpack/eslint-config-webpack/compare/v4.0.9...v4.0.10) (2025-06-11)


### Bug Fixes

* use dirty parser configuration for markdown ([#46](https://github.com/webpack/eslint-config-webpack/issues/46)) ([404c7c8](https://github.com/webpack/eslint-config-webpack/commit/404c7c867f6e180e56521219bebecd5f63c584fb))

### [4.0.9](https://github.com/webpack/eslint-config-webpack/compare/v4.0.8...v4.0.9) (2025-06-11)


### Bug Fixes

* adding default prettier config for old projects ([86f7be6](https://github.com/webpack/eslint-config-webpack/commit/86f7be6aa2643d181c767246eda50fa654d46a4c))
* disable `no-console` for tests ([#45](https://github.com/webpack/eslint-config-webpack/issues/45)) ([ab1798f](https://github.com/webpack/eslint-config-webpack/commit/ab1798f77881a2dec90191c3d8488900d1d53320))

### [4.0.8](https://github.com/webpack/eslint-config-webpack/compare/v4.0.7...v4.0.8) (2025-06-11)


### Bug Fixes

* node 6 and node 7 support ([#44](https://github.com/webpack/eslint-config-webpack/issues/44)) ([c6f129f](https://github.com/webpack/eslint-config-webpack/commit/c6f129f069ba56bb1c31c2debcf9575f6a846abb))

### [4.0.7](https://github.com/webpack/eslint-config-webpack/compare/v4.0.6...v4.0.7) (2025-06-11)


### Bug Fixes

* `engines` in package.json ([#43](https://github.com/webpack/eslint-config-webpack/issues/43)) ([046a2b4](https://github.com/webpack/eslint-config-webpack/commit/046a2b40499c9f30c1df2f73aee1eb1c21b061d2))

### [4.0.6](https://github.com/webpack/eslint-config-webpack/compare/v4.0.5...v4.0.6) (2025-06-10)


### Bug Fixes

* lazy loading configs in different deps ([#42](https://github.com/webpack/eslint-config-webpack/issues/42)) ([8a855ab](https://github.com/webpack/eslint-config-webpack/commit/8a855abe8aa8210316a835c1b84675838424a452))

### [4.0.5](https://github.com/webpack/eslint-config-webpack/compare/v4.0.4...v4.0.5) (2025-06-10)


### Bug Fixes

* lazy load jest and typescript configuration ([#40](https://github.com/webpack/eslint-config-webpack/issues/40)) ([196e040](https://github.com/webpack/eslint-config-webpack/commit/196e040fff0661633070fab57c57dd2baa486d09))
* lazy load optional plugins ([#41](https://github.com/webpack/eslint-config-webpack/issues/41)) ([d634eaf](https://github.com/webpack/eslint-config-webpack/commit/d634eaf555be2b68a7b7079d8a928804b1589bdb))
* relax `jest/prefer-lowercase-title` ([#39](https://github.com/webpack/eslint-config-webpack/issues/39)) ([496c8e2](https://github.com/webpack/eslint-config-webpack/commit/496c8e2ff1b4337a65325568ce93596b99732572))

### [4.0.4](https://github.com/webpack/eslint-config-webpack/compare/v4.0.3...v4.0.4) (2025-06-10)


### Bug Fixes

* disable `require-await` rule ([a787ef9](https://github.com/webpack/eslint-config-webpack/commit/a787ef96d293382b90a0c0e107ebc037d64b2204))

### [4.0.3](https://github.com/webpack/eslint-config-webpack/compare/v4.0.2...v4.0.3) (2025-06-10)


### Bug Fixes

* add `test/outputs` to global ignore ([#36](https://github.com/webpack/eslint-config-webpack/issues/36)) ([2d3253b](https://github.com/webpack/eslint-config-webpack/commit/2d3253bf0a3156d360e5c84bb894abc74969dbc3))
* improve jest default configuration ([#37](https://github.com/webpack/eslint-config-webpack/issues/37)) ([e846ec3](https://github.com/webpack/eslint-config-webpack/commit/e846ec360179cc8551212714470ce3ad38d2a1b8))

### [4.0.2](https://github.com/webpack/eslint-config-webpack/compare/v4.0.1...v4.0.2) (2025-06-10)


### Bug Fixes

* adding `eslint-config-prettier` to peer deps ([#33](https://github.com/webpack/eslint-config-webpack/issues/33)) ([df28ab8](https://github.com/webpack/eslint-config-webpack/commit/df28ab8bd7c9a269ba35a8ff4fe1d9cd6d641998))
* disable `jest/no-done-callback` rule ([#35](https://github.com/webpack/eslint-config-webpack/issues/35)) ([cb2b634](https://github.com/webpack/eslint-config-webpack/commit/cb2b6342f66d9fc9c57bd99f07e53b3528941b07))
* unresolved import in `eslint-config` ([#34](https://github.com/webpack/eslint-config-webpack/issues/34)) ([a73ed8e](https://github.com/webpack/eslint-config-webpack/commit/a73ed8e6bba2dd76540f3af4e31aabdeb6e958dc))

### [4.0.1](https://github.com/webpack/eslint-config-webpack/compare/v4.0.0...v4.0.1) (2025-06-06)


### Bug Fixes

* publish ([36d0812](https://github.com/webpack/eslint-config-webpack/commit/36d0812ea29472e1ab9a8ea0e279199a1a7e94f8))

## [4.0.0](https://github.com/webpack/eslint-config-webpack/compare/v3.0.0...v4.0.0) (2025-06-06)


### ⚠ BREAKING CHANGES

* update all rules and switch to eslint@9 (#30)

### Features

* update all rules and switch to eslint@9 ([#30](https://github.com/webpack/eslint-config-webpack/issues/30)) ([fcddab9](https://github.com/webpack/eslint-config-webpack/commit/fcddab9409e5fa03d7062160d2c4b6842b332049))

## [2.0.0](https://github.com/webpack/eslint-config-webpack/compare/v3.0.0...v2.0.0) (2025-06-06)


### ⚠ BREAKING CHANGES

* update all rules and switch to eslint@9 (#30)

### Features

* update all rules and switch to eslint@9 ([#30](https://github.com/webpack/eslint-config-webpack/issues/30)) ([fcddab9](https://github.com/webpack/eslint-config-webpack/commit/fcddab9409e5fa03d7062160d2c4b6842b332049))
