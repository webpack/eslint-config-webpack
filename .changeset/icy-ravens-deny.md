---
"eslint-config-webpack": major
---

Update ESLint to v10.

Breaking changes:

- requires `eslint` `>= 10.15.0` and Node.js `^22.13.0 || >= 24.0.0`
- import rules now use `eslint-plugin-import-x`, rename `import/*` rule overrides and `eslint-disable` directives to `import-x/*` (e.g. `import/extensions` -> `import-x/extensions`)
