import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";

const recommendedBrowserOutdatedScriptConfig = {
	name: "browser/recommended-outdated-script",
	languageOptions: {
		sourceType: "script",
		globals: {
			...globals.browser,
		},
	},
};

const recommendedBrowserOutdatedCommonjsConfig = {
	name: "browser/recommended-outdated-commonjs",
	languageOptions: {
		sourceType: "commonjs",
		globals: {
			...globals.browser,
		},
	},
};

const recommendedBrowserOutdatedModuleConfig = {
	name: "browser/recommended-outdated-module",
	languageOptions: {
		sourceType: "module",
		globals: {
			...globals.browser,
		},
	},
};

const recommendedBrowserConfig = {
	name: "browser/recommended",
	languageOptions: {
		sourceType: "module",
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

		"import/extensions": [
			"error",
			"always",
			{ ignorePackages: true, checkTypeImports: true },
		],
	},
};

export default {
	"browser/recommended": recommendedBrowserConfig,
	// TODO remove me in the next major release
	"browser/recommended-outdated": recommendedBrowserOutdatedModuleConfig,
	// Useful when you need to generate outdated es5 code using babel/swc/etc
	"browser/recommended-outdated-script": recommendedBrowserOutdatedScriptConfig,
	"browser/recommended-outdated-commonjs":
		recommendedBrowserOutdatedCommonjsConfig,
	"browser/recommended-outdated-module": recommendedBrowserOutdatedModuleConfig,
};
