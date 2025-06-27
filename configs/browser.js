import importPlugin from "eslint-plugin-import";
import globals from "globals";

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
