import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";

const recommendedBrowserConfig = {
	languageOptions: {
		globals: {
			...globals.browser,
		},
	},
	plugins: {
		unicorn: unicornPlugin,
		import: importPlugin,
	},
	rules: {
		"unicorn/prefer-dom-node-append": "error",

		"unicorn/prefer-dom-node-dataset": "error",

		"unicorn/prefer-dom-node-remove": "error",

		"unicorn/prefer-dom-node-text-content": "error",

		"unicorn/prefer-modern-dom-apis": "error",

		"unicorn/prefer-keyboard-event-key": "error",

		"unicorn/prefer-query-selector": "error",

		"import/extensions": ["error", "always", { ignorePackages: true }],
	},
};

export default {
	"browser/recommended": recommendedBrowserConfig,
};
