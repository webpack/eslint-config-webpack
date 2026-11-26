---
"eslint-config-webpack": minor
---

Add `inline` and `typedefs` options to `webpack/prefer-import-tag`; `inline: true` reports every `import()` in a JSDoc type and autofixes the file to `@import` tags, and `typedefs: false` leaves `@typedef` tags alone.
