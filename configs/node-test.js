import { codeFiles, codeIgnores } from "./utils/code-files.js";

/**
 * Rules for tests written with the built-in Node.js test runner (`node:test`).
 * The rules only apply to files that import `node:test` (assertion rules also
 * to files that import `node:assert`), so the config covers every code file
 * and needs no test file patterns.
 * @returns {Promise<import("eslint").Linter.Config>} config
 */
async function getNodeTestRecommendedConfig() {
	const nodeTestPlugin = (await import("eslint-node-test")).default;
	const recommendedConfig = /** @type {import("eslint").Linter.Config} */ (
		nodeTestPlugin.configs.recommended
	);

	return {
		...recommendedConfig,
		name: "node-test/recommended",
		files: codeFiles,
		ignores: codeIgnores,
		rules: {
			...recommendedConfig.rules,

			// Same choices as for Jest

			"node-test/consistent-test-it": "error",

			"node-test/no-commented-tests": "error",

			// Makes too much noise, testing conditions can often be different
			"node-test/no-conditional-assertion": "off",

			// Adding extra `await new Promise(...)` is very inconvenient when you have a lot of callback api
			"node-test/no-done-callback": "off",

			"node-test/no-unneeded-async-rejects-callback": "error",

			// Allow to use `MyClass` title in describe for class testing
			"node-test/prefer-lowercase-title": ["error", { ignore: ["describe"] }],
		},
	};
}

export default {
	"node-test/recommended": await getNodeTestRecommendedConfig(),
};
