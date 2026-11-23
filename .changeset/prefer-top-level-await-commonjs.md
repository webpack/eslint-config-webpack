---
"eslint-config-webpack": patch
---

Enable `unicorn/prefer-top-level-await` only for ECMAScript modules (`node/module`, `browser/recommended` and `browser/recommended-outdated-module`), so it no longer reports CommonJS files such as `.js` files in a package without `"type": "module"`, which can't use top-level `await`.
