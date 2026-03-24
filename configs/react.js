/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getReactRecommendedConfig() {
	const reactPlugin = (await import("eslint-plugin-react")).default;
	const { recommended, "jsx-runtime": jsxRuntime } = reactPlugin.configs.flat;

	const reactHooksPlugin = (await import("eslint-plugin-react-hooks")).default;
	const { recommended: recommendedHooks } = reactHooksPlugin.configs.flat;

	return {
		...recommended,
		...recommendedHooks,
		plugins: {
			...recommended.plugins,
			...recommendedHooks.plugins,
		},
		files: ["**/*.{jsx,tsx}"],
		settings: {
			react: {
				version: "detect",
				defaultVersion: "19",
			},
		},
		languageOptions: {
			...recommended.languageOptions,
			...jsxRuntime.languageOptions,
		},
		rules: {
			...recommended.rules,
			...jsxRuntime.rules,
			...recommendedHooks.rules,
		},
	};
}

const reactRecommendedConfig = await getReactRecommendedConfig();

export default {
	"react/recommended": reactRecommendedConfig,
};
