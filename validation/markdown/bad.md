# Bad examples

Each example breaks the rule named in the comment above it, so the lint fails if the rule stops reporting.

<!-- eslint-disable-next-line markdown/heading-increment -->
### Skipped heading level

<!-- eslint-disable-next-line markdown/no-missing-atx-heading-space -->
#Missing space after hash

<!-- eslint-disable-next-line markdown/require-alt-text -->
![](./good.md)

<!-- eslint-disable-next-line markdown/no-empty-links -->
[Empty link]()

<!-- eslint-disable-next-line unicorn/no-empty-link-text -->
[](./good.md)

<!-- eslint-disable-next-line unicorn/prefer-https -->
[Insecure link](http://example.com)

<!-- eslint-disable-next-line unicorn/no-javascript-url -->
[Script link](javascript:void(0))

<!-- eslint-disable-next-line unicorn/relative-url-style -->
[Relative link without `./`](good.md)

<!-- eslint-disable-next-line markdown/no-missing-label-refs -->
[Missing reference][missing]

<!-- eslint-disable-next-line markdown/fenced-code-language -->
```
code block without a language
```

A directive right before a code block applies to the code block:

```js
const value = 1;

console.log(value);
```

A multiline directive right before a code block applies to the code block too:

```js
const other = 1;

console.log(other);
```

A directive the Markdown uses stays even when the code block after it doesn't need it:

<!-- eslint-disable unicorn/prefer-https -->

```js
const unrelated = 1;

console.log(unrelated);
```

[Insecure link the directive above allows](http://example.com)

<!-- eslint-enable unicorn/prefer-https -->

A code block's own directive covers the code; the Markdown checks don't report it again:

```js
const url = "https://example.com";

console.log(url);
```

<!-- eslint-disable unicorn/no-abusive-eslint-disable -->
<!-- eslint-disable -->

[Insecure link after a blanket directive](http://example.com)
