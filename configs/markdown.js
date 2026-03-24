import isTypescriptInstalled from "./utils/is-typescript-installed.js";

/**
 * @returns {Promise<import("eslint").Linter.Config[]>} config
 */
async function getMarkdownRecommendedConfig() {
	const markdownPlugin = (await import("@eslint/markdown")).default;

	return [
		{
			name: "markdown/code-blocks",
			files: ["**/*.md"],
			processor: "markdown/markdown",
			plugins: {
				markdown: markdownPlugin,
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

				"import/no-unresolved": "off",

				"import/no-extraneous-dependencies": "off",

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
