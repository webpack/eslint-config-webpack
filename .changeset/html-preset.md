---
"eslint-config-webpack": minor
---

Add the `html/recommended` config for `.html` files, enabled in every recommended config. It uses `@html-eslint/eslint-plugin` as the language plugin, with its rules that find mistakes (formatting is left to Prettier) and the `unicorn` rules that support HTML, such as `no-invalid-integrity`, `no-ineffective-csp-directives` and `no-invalid-file-input-accept`.
