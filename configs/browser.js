import importPlugin from "eslint-plugin-import-x";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";

/** @type {import("eslint").Linter.Config} */
const recommendedBrowserOutdatedScriptConfig = {
	name: "browser/recommended-outdated-script",
	languageOptions: {
		sourceType: "script",
		globals: {
			...globals.browser,
		},
	},
};

/** @type {import("eslint").Linter.Config} */
const recommendedBrowserOutdatedCommonjsConfig = {
	name: "browser/recommended-outdated-commonjs",
	languageOptions: {
		sourceType: "commonjs",
		globals: {
			...globals.browser,
		},
	},
};

/** @type {import("eslint").Linter.Config} */
const recommendedBrowserOutdatedModuleConfig = {
	name: "browser/recommended-outdated-module",
	languageOptions: {
		sourceType: "module",
		globals: {
			...globals.browser,
		},
	},
};

/** @type {import("eslint").Linter.Config} */
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
		"import-x": importPlugin,
	},
	rules: {
		// TODO do we need it?
		// "unicorn/better-dom-traversing": "error",

		"unicorn/dom-node-dataset": "error",

		"unicorn/no-canvas-to-image": "error",

		"unicorn/no-incorrect-query-selector": "error",

		"unicorn/no-invalid-boolean-attribute-value": "error",

		"unicorn/no-invalid-dom-token": "error",

		"unicorn/no-invalid-style-set-property": "error",

		"unicorn/no-late-current-target-access": "error",

		"unicorn/no-late-event-control": "error",

		"unicorn/no-selector-as-dom-name": "error",

		// Do not need
		// "unicorn/no-unsafe-dom-html": "error",

		"unicorn/prefer-add-event-listener": "error",

		"unicorn/prefer-add-event-listener-options": "error",

		"unicorn/prefer-dom-node-html-methods": [
			"error",
			{
				// Reading `innerHTML` can be safely replaced only when the receiver is a DOM node
				checkGetHTML: false,
				checkSetHTML: true,
			},
		],

		"unicorn/prefer-dom-node-replace-children": "error",

		"unicorn/prefer-location-assign": "error",

		"unicorn/prefer-observer-apis": "error",

		"unicorn/prefer-path2d": "error",

		"unicorn/prefer-toggle-attribute": "error",

		"unicorn/require-css-escape": "error",

		"unicorn/require-passive-events": "error",

		"unicorn/prefer-classlist-toggle": "error",

		"unicorn/prefer-dom-node-append": "error",

		"unicorn/prefer-dom-node-remove": "error",

		"unicorn/prefer-dom-node-text-content": "error",

		"unicorn/prefer-modern-dom-apis": "error",

		"unicorn/prefer-keyboard-event-key": "error",

		"unicorn/prefer-query-selector": "error",

		"import-x/extensions": [
			"error",
			"always",
			{ ignorePackages: true, checkTypeImports: true },
		],
	},
};

export default {
	"browser/recommended": recommendedBrowserConfig,
	// Useful when you need to generate outdated es5 code using babel/swc/etc
	"browser/recommended-outdated-script": recommendedBrowserOutdatedScriptConfig,
	"browser/recommended-outdated-commonjs":
		recommendedBrowserOutdatedCommonjsConfig,
	"browser/recommended-outdated-module": recommendedBrowserOutdatedModuleConfig,
};
