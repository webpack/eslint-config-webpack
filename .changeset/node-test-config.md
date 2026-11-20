---
"eslint-config-webpack": minor
---

Add the `node-test/recommended` config with the recommended rules of `eslint-node-test` for tests written with the built-in Node.js test runner, enabled in every recommended config. It makes the same choices as `jest/recommended` (`node-test/consistent-test-it`, `node-test/no-commented-tests`, `node-test/prefer-lowercase-title` except for `describe`, `node-test/no-unneeded-async-rejects-callback`; `node-test/no-conditional-assertion` and `node-test/no-done-callback` off). The rules only apply to files that import `node:test` (assertion rules also to files that import `node:assert`).
