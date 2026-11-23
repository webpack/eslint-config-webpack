import markdownPlugin from "@eslint/markdown";
import unicornPlugin from "eslint-plugin-unicorn";
import isTypescriptInstalled from "./utils/is-typescript-installed.js";

/** @typedef {import("eslint").Linter.Processor} Processor */
/** @typedef {import("eslint").Linter.LintMessage & { probe?: { block: number, line: number } }} Message */

/**
 * @returns {Promise<import("eslint").Linter.Config[]>} config
 */
async function getMarkdownRecommendedConfig() {
	const {
		configs: { recommended },
	} =
		/** @type {{ configs: { recommended: import("eslint").Linter.Config[] } }} */ (
			/** @type {unknown} */ (markdownPlugin)
		);

	return [
		{
			name: "markdown/recommended",
			files: ["**/*.md"],
			// GitHub renders our Markdown, so tables, task lists and the like are valid
			language: "markdown/gfm",
			plugins: {
				markdown: markdownPlugin,
				unicorn: unicornPlugin,
			},
			// Same as for JavaScript, so a `<!-- eslint-disable -->` comment that
			// disables nothing fails the lint
			linterOptions: {
				reportUnusedDisableDirectives: "error",
				reportUnusedInlineConfigs: "error",
			},
			rules: {
				...recommended.find((config) => config.name === "markdown/recommended")
					?.rules,

				// From recommended
				// "markdown/fenced-code-language": "error",

				// No need
				"markdown/fenced-code-meta": "off",

				// From recommended
				// "markdown/heading-increment": "error",

				// No need
				"markdown/no-bare-urls": "off",

				// From recommended
				// "markdown/no-duplicate-definitions": "error",

				"markdown/no-duplicate-headings": [
					"error",
					{ checkSiblingsOnly: true },
				],

				// From recommended
				// "markdown/no-empty-definitions": "error",

				// From recommended
				// "markdown/no-empty-images": "error",

				// From recommended
				// "markdown/no-empty-links": "error",

				// No need
				"markdown/no-html": "off",

				// From recommended
				// "markdown/no-invalid-label-refs": "error",

				// From recommended
				// "markdown/no-missing-atx-heading-space": "error",

				// From recommended
				"markdown/no-missing-label-refs": [
					"error",
					{ allowLabels: ["!REQUIRED"] },
				],

				// From recommended
				// "markdown/no-missing-link-fragments": "error",

				// From recommended
				// "markdown/no-multiple-h1": "error",

				// From recommended
				// "markdown/no-reference-like-urls": "error",

				// From recommended
				// "markdown/no-reversed-media-syntax": "error",

				// From recommended
				// "markdown/no-space-in-emphasis": "error",

				// From recommended
				// "markdown/no-unused-definitions": "error",

				// From recommended
				// TODO enable in future
				"markdown/require-alt-text": "off",

				"markdown/table-column-count": ["error", { checkMissingCells: true }],

				// `unicorn` rules that support Markdown and that we use for

				"unicorn/no-abusive-eslint-disable": "error",

				"unicorn/no-empty-file": "error",

				"unicorn/no-empty-link-text": "error",

				"unicorn/no-leading-empty-lines": "error",

				"unicorn/no-javascript-url": "error",

				"unicorn/relative-url-style": ["error", "always"],

				"unicorn/prefer-https": "error",
			},
		},
		{
			name: "markdown/code-blocks/js",
			files: isTypescriptInstalled()
				? ["**/*.md/*.js", "**/*.md/*.ts"]
				: ["**/*.md/*.js"],
			languageOptions: {
				sourceType: "module",
				ecmaVersion: "latest",
				parserOptions: {
					ecmaFeatures: {
						globalReturn: true,
						impliedStrict: true,
					},
				},
			},
			rules: {
				"id-length": "off",

				strict: "off",

				// For different examples
				camelcase: "off",

				"unicode-bom": "off",

				"eol-last": "off",

				"no-undef": "off",

				"no-unused-private-class-members": "off",

				"no-unused-vars": "off",

				"no-unused-expressions": "off",

				"no-unused-labels": "off",

				"no-console": "off",

				"no-new": "off",

				"unicorn/no-unused-properties": "off",

				// Allow to use any packages in documentation
				"n/no-unpublished-require": "off",

				// Allow to use any packages in documentation
				"n/no-unpublished-import": "off",

				// Allow to use any ES builtins in documentation
				"n/no-unsupported-features/es-builtins": "off",

				// Allow to use any ES syntax in documentation
				"n/no-unsupported-features/es-syntax": "off",

				// Allow to use any Node.js API in documentation
				"n/no-unsupported-features/node-builtins": "off",

				// Allow to use any packages in documentation
				"n/no-missing-import": "off",

				// Allow to use any packages in documentation
				"n/no-missing-require": "off",

				// Useful for documentation
				"n/no-process-exit": "off",

				"import-x/no-unresolved": "off",

				"import-x/no-extraneous-dependencies": "off",

				"jsdoc/require-jsdoc": "off",

				"@typescript-eslint/no-unused-vars": "off",

				"@typescript-eslint/no-explicit-any": "off",

				"@typescript-eslint/triple-slash-reference": "off",
			},
		},
	];
}

export default {
	"markdown/recommended": await getMarkdownRecommendedConfig(),
};
