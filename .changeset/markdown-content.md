---
"eslint-config-webpack": minor
---

Lint Markdown content, not only its code blocks. `markdown/recommended` now parses `**/*.md` with the GitHub-flavored Markdown language and enables the `@eslint/markdown` recommended rules, in the same ESLint run that lints the fenced code blocks. It also enables the `unicorn` rules that support Markdown and that we use for JavaScript (`no-abusive-eslint-disable`, `prefer-https`, `relative-url-style` with `"always"`), the Markdown-only `unicorn/no-empty-link-text` and `unicorn/no-javascript-url`, and reports unused `<!-- eslint-disable -->` comments as errors, as for JavaScript.

The `browser/*`, `stylistic/*` and standalone `node/commonjs`, `node/module` and `node/dirty` configs now apply only to the JavaScript and TypeScript files the JavaScript config lints, so their rules and language options no longer reach Markdown files.
