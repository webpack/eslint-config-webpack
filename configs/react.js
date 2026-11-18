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

	const reactPlugin = (await import("@eslint-react/eslint-plugin")).default;
	const { recommended } = reactPlugin.configs;

	return {
		name: "react/recommended",
		plugins: {
			...recommended.plugins,
		},
		files: ["**/*.{jsx,tsx}"],
		settings: {
			...recommended.settings,
		},
		languageOptions: {
			...recommended.languageOptions,
		},
		rules: {
			...recommended.rules,
		},
	};
}

const reactRecommendedConfig = await getReactRecommendedConfig();

export default {
	"react/recommended": reactRecommendedConfig,
};
