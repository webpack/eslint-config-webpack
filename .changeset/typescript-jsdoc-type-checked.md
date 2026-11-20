---
"eslint-config-webpack": minor
---

Add the `typescript/jsdoc-type-checked` config, enabled in every recommended config when `typescript` is installed. It enables the type-aware `typescript-eslint` recommended rules, except `no-unsafe-*`, for JavaScript files typed with JSDoc: files that their nearest `tsconfig.json` includes and that it type-checks (`allowJs` or `checkJs`).
