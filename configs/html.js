import htmlPlugin from "@html-eslint/eslint-plugin";
import unicornPlugin from "eslint-plugin-unicorn";

/**
 * @returns {Promise<import("eslint").Linter.Config[]>} config
 */
async function getHtmlRecommendedConfig() {
	return [
		{
			name: "html/recommended",
			files: ["**/*.html"],
			// HTML code blocks in Markdown are snippets, not documents
			ignores: ["**/*.md/**"],
			plugins: {
				html: htmlPlugin,
				unicorn: unicornPlugin,
			},
			language: "html/html",
			languageOptions: {
				// `html-webpack-plugin` templates use the lodash syntax by default, so
				// a value like `src="<%= logo %>"` is a template, not an invalid URL
				templateEngineSyntax: { "<%": "%>" },
			},
			// Same as for JavaScript, so a `<!-- eslint-disable -->` comment that
			// disables nothing fails the lint
			linterOptions: {
				reportUnusedDisableDirectives: "error",
				reportUnusedInlineConfigs: "error",
			},
			rules: {
				// Prettier formats HTML, so the rules about formatting are off:
				// `attrs-newline`, `class-spacing`, `element-newline`, `indent`,
				// `lowercase`, `no-extra-spacing-attrs`, `no-extra-spacing-tags`,
				// `no-extra-spacing-text`, `no-multiple-empty-lines`,
				// `no-trailing-spaces`, `quotes`, `sort-attrs`

				// From recommended

				"html/no-duplicate-attrs": "error",

				"html/no-duplicate-id": "error",

				"html/no-duplicate-in-head": "error",

				"html/no-multiple-h1": "error",

				"html/no-obsolete-attrs": "error",

				"html/no-obsolete-tags": "error",

				// Prettier writes void elements as `<br />`
				"html/require-closing-tags": ["error", { selfClosing: "always" }],

				"html/require-doctype": "error",

				"html/require-img-alt": "error",

				"html/require-lang": "error",

				"html/require-li-container": "error",

				"html/require-title": "error",

				"html/use-baseline": "error",

				// Not in recommended, but find real mistakes

				"html/no-abstract-roles": "error",

				"html/no-aria-hidden-body": "error",

				"html/no-aria-hidden-on-focusable": "error",

				"html/no-duplicate-class": "error",

				"html/no-heading-inside-button": "error",

				"html/no-ineffective-attrs": "error",

				"html/no-invalid-attr-value": "error",

				"html/no-invalid-entity": "error",

				"html/no-invalid-role": "error",

				"html/no-nested-interactive": "error",

				"html/no-non-scalable-viewport": "error",

				"html/no-positive-tabindex": "error",

				"html/no-redundant-role": "error",

				"html/no-script-style-type": "error",

				"html/require-details-summary": "error",

				"html/require-frame-title": "error",

				"html/require-meta-charset": "error",

				// `unicorn` rules that support HTML and that we use for

				"unicorn/no-abusive-eslint-disable": "error",

				"unicorn/no-conflicting-constraints": "error",

				"unicorn/no-empty-file": "error",

				"unicorn/no-ineffective-csp-directives": "error",

				"unicorn/no-invalid-file-input-accept": "error",

				"unicorn/no-invalid-integrity": "error",

				"unicorn/no-leading-empty-lines": "error",

				"unicorn/prefer-https": "error",

				// Same as for Markdown
				"unicorn/relative-url-style": ["error", "always"],

				"unicorn/text-encoding-identifier-case": "error",
			},
		},
	];
}

export default {
	"html/recommended": await getHtmlRecommendedConfig(),
};
