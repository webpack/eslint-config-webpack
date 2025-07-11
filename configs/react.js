import reactPlugin from "eslint-plugin-react";

const { recommended, "jsx-runtime": jsxRuntime } = reactPlugin.configs.flat;

const recommendedReactConfig = {
	...reactPlugin.configs.flat.recommended,
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

export default {
	"react/recommended": recommendedReactConfig,
};
