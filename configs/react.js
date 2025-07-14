/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getReactRecommendedConfig() {
	let reactPlugin;

	try {
		reactPlugin = (await import("eslint-plugin-react")).default;
		// eslint-disable-next-line unicorn/prefer-optional-catch-binding
	} catch (_err) {
		// Nothing
	}

	const { recommended, "jsx-runtime": jsxRuntime } = (reactPlugin &&
		reactPlugin.configs &&
		reactPlugin.configs.flat) || { recommended: {}, "jsx-runtime": {} };

	return {
		...recommended,
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
		},
	};
}

const reactRecommendedConfig = await getReactRecommendedConfig();

export default {
	"react/recommended": reactRecommendedConfig,
};
