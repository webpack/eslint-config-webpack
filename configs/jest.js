/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getJestRecommendedConfig() {
	let jestPlugin;

	try {
		jestPlugin = (await import("eslint-plugin-jest")).default;
		// eslint-disable-next-line unicorn/prefer-optional-catch-binding
	} catch (_err) {
		// Nothing
	}

	const jsdocConfig =
		(jestPlugin && jestPlugin.configs["flat/recommended"]) || {};

	return {
		...jsdocConfig,
		name: "jest/recommended",
		files: [
			"**/{tests,test,__tests__}/**/*.?(c|m)[jt]s?(x)",
			"**/?(*.)+(spec|test).[jt]s?(x)",
			"**/test-*.[jt]s?(x)",
		],
		ignores: [
			"**/{tests,test,__tests__}/**/{helper,helpers,__helper__,__helpers__,fixture,fixtures,__fixture__,__fixtures__}/**/*",
			"**/helper?(s).{js,cjs,mjs}",
		],
		rules: {
			...jsdocConfig.rules,

			"jest/consistent-test-it": "error",

			"jest/expect-expect": "error",

			// No need
			// "jest/max-expects": "error",

			// No need
			// "jest/max-nested-describe": "error",

			// From recommended
			// "jest/no-alias-methods": "error",

			"jest/no-commented-out-tests": "error",

			// No need
			// Makes too much noise, testing conditions can often be different
			"jest/no-conditional-expect": "off",

			// No need
			// "jest/no-conditional-in-test": "off",

			"jest/no-confusing-set-timeout": "error",

			// From recommended
			// "jest/no-deprecated-functions": "error",

			"jest/no-disabled-tests": "error",

			// No need
			// Adding extra `await new Promise(...)` is very inconvenient when you have a lot of callback api
			"jest/no-done-callback": "off",

			"jest/no-duplicate-hooks": "error",

			// From recommended
			// "jest/no-export": "error",

			"jest/no-focused-tests": "error",

			// No need
			// "jest/no-hooks": "error",

			// From recommended
			// "jest/no-identical-title": "error",

			// From recommended
			// "jest/no-interpolation-in-snapshots": "error",

			// From recommended
			// "jest/no-jasmine-globals": "error",

			// No need
			// "jest/no-large-snapshots": "error",

			// From recommended
			// "jest/no-mocks-import": "error",

			// No need
			// "jest/no-restricted-jest-methods": ["error", {}],

			// No need
			// "jest/no-restricted-matchers": ["error", {}],

			// From recommended
			// "jest/no-standalone-expect": "error",

			// From recommended
			// "jest/no-test-prefixes": "error",

			// No need
			// "jest/no-test-return-statement": "error",

			// No need
			// "jest/no-untyped-mock-factory": "error",

			"jest/padding-around-after-all-blocks": "error",

			"jest/padding-around-after-each-blocks": "error",

			// Not all padding required
			// "jest/padding-around-all": "off",

			"jest/padding-around-before-all-blocks": "error",

			"jest/padding-around-before-each-blocks": "error",

			"jest/padding-around-describe-blocks": "error",

			"jest/padding-around-expect-groups": "off",

			"jest/padding-around-test-blocks": "error",

			// No need
			// "jest/prefer-called-with": "error",

			"jest/prefer-comparison-matcher": "error",

			// No need
			// "jest/prefer-each": "error",

			"jest/prefer-equality-matcher": "error",

			// No need
			// "jest/prefer-expect-assertions": "error",

			// No need
			// "jest/prefer-expect-resolves": "error",

			"jest/prefer-hooks-in-order": "error",

			"jest/prefer-hooks-on-top": "error",

			// No need
			// "jest/prefer-importing-jest-globals": "error",

			"jest/prefer-jest-mocked": "error",

			// Allow to use `MyClass` title in describe for class testing
			"jest/prefer-lowercase-title": ["error", { ignore: ["describe"] }],

			"jest/prefer-mock-promise-shorthand": "error",

			// No need
			// "jest/prefer-snapshot-hint": "error",

			"jest/prefer-spy-on": "error",

			// No need
			// "jest/prefer-strict-equal": "off",

			"jest/prefer-to-be": "error",

			"jest/prefer-to-contain": "error",

			"jest/prefer-to-have-length": "error",

			// No need
			// "jest/prefer-todo": "error"

			// No need
			// Does not allow using the function as test generation
			"jest/require-hook": "off",

			"jest/require-to-throw-message": "error",

			"jest/require-top-level-describe": "error",

			// From recommended
			// "jest/valid-describe-callback": "error",

			// From recommended
			// "jest/valid-expect": "error",

			// From recommended
			// "jest/valid-expect-in-promise": "error",

			// From recommended
			"jest/valid-title": [
				"error",
				{
					// Allow to use variables in tests
					ignoreTypeOfDescribeName: true,
					// Allow to use variables in tests
					ignoreTypeOfTestName: true,
				},
			],

			// Disable it for tests, because often you can use `a`, `b`, `c` and etc variables
			"id-length": "off",

			// In tests, we can have any names
			camelcase: "off",

			// Allow to output information in tests
			"no-console": "off",

			// Allow to have any regexps in tests, useful to clean up/etc
			"no-control-regex": "off",

			// Doesn't require jsdoc for tests, they are either redundant or we have a separate task for checking types of tests
			"jsdoc/require-jsdoc": "off",
		},
	};
}

export default {
	"jest/recommended": await getJestRecommendedConfig(),
};
