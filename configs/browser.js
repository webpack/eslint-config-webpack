import globals from "globals";
import importPlugin from "eslint-plugin-import";

const recommendedBrowserConfig = {
	languageOptions: {
		globals: {
			...globals.browser,
		},
	},
	plugins: {
		import: importPlugin,
	},
	rules: {
		"import/extensions": ["error", "always", { ignorePackages: true }],
	},
};

export default {
	"browser/recommended": recommendedBrowserConfig,
};
