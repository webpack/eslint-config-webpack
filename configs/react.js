import getJsonFile from "./utils/get-json-file.js";

/** @type {import("type-fest").PackageJson | null} */
const packageJson = getJsonFile("package.json");

/**
 * @returns {Promise<import("eslint").Linter.Config>} config
 */
async function getReactRecommendedConfig() {
	if (packageJson === null) {
		return {
			name: "react/please-install-react-to-enable-it",
		};
	}

	const dependencies = packageJson.dependencies || {};
	const devDependencies = packageJson.devDependencies || {};

	if (
		typeof dependencies.react === "undefined" &&
		typeof dependencies.preact === "undefined" &&
		typeof devDependencies.react === "undefined" &&
		typeof devDependencies.preact === "undefined"
	) {
		return {
			name: "react/please-install-react-to-enable-it",
		};
	}

	const reactPlugin = (await import("eslint-plugin-react")).default;
	const { recommended, "jsx-runtime": jsxRuntime } = reactPlugin.configs.flat;

	const reactHooksPlugin = (await import("eslint-plugin-react-hooks")).default;
	const { recommended: recommendedHooks } = reactHooksPlugin.configs.flat;

	return {
		...recommended,
		...recommendedHooks,
		name: "react/recommended",
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
