---
"eslint-config-webpack": minor
---

Add the `performance/require-precompiled-schema` rule, enabled in every recommended config: options validated against a schema need a check precompiled with `schema-utils precompile`, in plugins (`compiler.validate`), loaders (`this.getOptions`) and direct `schema-utils` `validate` calls.
