/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getMarkdownRecommendedConfig() {
	let markdownPlugin;

	try {
		markdownPlugin = (await import("@eslint/markdown")).default;
		// eslint-disable-next-line unicorn/prefer-optional-catch-binding
	} catch (_err) {
		// Nothing
	}

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
			files: ["**/*.md/*.js", "**/*.md/*.ts"],
			languageOptions: {
				sourceType: "module",
				parserOptions: {
					ecmaFeatures: {
						globalReturn: true,
						impliedStrict: true,
					},
				},
			},
			rules: {
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

				"n/no-unpublished-require": "off",

				"n/no-unpublished-import": "off",

				"n/no-missing-import": "off",

				"n/no-missing-require": "off",

				"n/no-process-exit": "off",

				"import/no-unresolved": "off",

				"import/no-extraneous-dependencies": "off",

				"jsdoc/require-jsdoc": "off",

				"@typescript-eslint/no-unused-vars": "off",

				"@typescript-eslint/triple-slash-reference": "off",
			},
		},
	];
}

export default {
	"markdown/recommended": await getMarkdownRecommendedConfig(),
};
