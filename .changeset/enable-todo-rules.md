---
"eslint-config-webpack": minor
---

Enable more `unicorn` rules and `jsdoc/normalize-see-links`:

- in every config: `consistent-conditional-object-spread`, `consistent-json-file-read`, `consistent-tuple-labels`, `no-accidental-bitwise-operator`, `no-duplicate-if-branches`, `no-duplicate-loops`, `no-incomplete-accessor-override`, `no-invalid-argument-count`, `no-invalid-file-input-accept`, `no-invalid-integrity`, `no-leading-empty-lines`, `no-mismatched-map-key`, `no-object-methods-with-collections`, `no-typeof-undefined`, `no-unreadable-iife`, `no-unused-iterator-helper`, `no-useless-concat`, `no-useless-recursion`, `no-useless-set-construction`, `prefer-set-size`, `switch-case-break-position`;
- for the ECMAScript versions that have the API: `prefer-at` (ES2022), `prefer-url-can-parse` (ES2023), `prefer-group-by` and `prefer-promise-with-resolvers` (ES2024), `prefer-iterator-helpers`, `prefer-iterator-to-array` and `prefer-iterator-to-array-at-end` (ES2025), `prefer-promise-try` (ES2026, because Node.js 22 has no `Promise.try()`), `prefer-error-is-error` and `prefer-iterator-concat` (ES2026);
- in `node/module`, when every Node.js version `engines.node` allows has `import.meta.dirname` (`^20.11.0 || >=21.2.0`): `prefer-import-meta-properties`.
