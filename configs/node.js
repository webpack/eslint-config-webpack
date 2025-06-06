import globals from "globals";
import nodePlugin from "eslint-plugin-n";

const commonRules = {
	// No need
	// "n/callback-return": "error",

	// Depends on `sourceType` and enabled below only for commonjs
	// "n/exports-style": "error",

	// Depends on `sourceType` and enabled below only for module
	// "n/file-extension-in-import": "error",

	// There is no need, as in some cases we want to load a module lazily.
	// "n/global-require": "error",

	// No need
	// "n/handle-callback-err": "error"

	// From recommended
	// "n/hashbang": "error",

	// No need
	// "n/no-callback-literal": "error",

	// From recommended
	// "n/no-deprecated-api": "error",

	// From recommended
	// "n/no-exports-assign": "error",

	// From recommended
	// "n/no-extraneous-import": "error",

	// From recommended
	// "n/no-extraneous-require": "error",

	// Deprecated
	// "n/no-hide-core-modules": "error",

	// From recommended
	// "n/no-missing-import": "error",

	// From recommended
	// "n/no-missing-require": "error",

	// No need
	// "n/no-mixed-requires": "error",

	// No need
	// "n/no-new-require": "error",

	// Depends on `sourceType` and enabled below only for commonjs
	// "n/no-path-concat": "error",

	// No need
	// "n/no-process-env": "error",

	// From recommended
	// "n/no-process-exit": "error",

	// No need
	// "n/no-restricted-import": ["error", []],

	// No need
	// "n/no-restricted-require": ["error", []]

	// No need
	// "n/no-sync": "error",

	// No need
	// "n/no-top-level-await": "error",

	// From recommended
	// "n/no-unpublished-bin": "error",

	// From recommended
	// "n/no-unpublished-import": "error",

	// From recommended
	// "n/no-unpublished-require": "error",

	// From recommended
	// "n/no-unsupported-features/es-builtins": "error",

	// From recommended
	// "n/no-unsupported-features/es-syntax": "error",

	// From recommended
	// "n/no-unsupported-features/node-builtins": "error",

	"n/prefer-global/buffer": ["error", "always"],

	"n/prefer-global/console": ["error", "always"],

	"n/prefer-global/process": ["error", "always"],

	"n/prefer-global/text-decoder": ["error", "always"],

	"n/prefer-global/text-encoder": ["error", "always"],

	"n/prefer-global/url": ["error", "always"],

	"n/prefer-global/url-search-params": ["error", "always"],

	"n/prefer-node-protocol": "error",

	// No need
	// "n/prefer-promises/dns": "error",

	// No need
	// "n/prefer-promises/fs": "error",

	// From recommended
	// "n/process-exit-as-throw": "error",
};

const commonjs = {
	...nodePlugin.configs["flat/recommended-script"],
	name: "node/commonjs",
	rules: {
		...commonRules,
		"n/exports-style": "error",
		"n/no-path-concat": "error",
	},
};

const module = {
	...nodePlugin.configs["flat/recommended-module"],
	name: "node/module",
	rules: {
		...commonRules,
		"n/file-extension-in-import": "error",
	},
};

const dirty = {
	name: "node/dirty",
	plugins: {
		n: nodePlugin,
	},
	languageOptions: {
		sourceType: "module",
		parserOptions: {
			ecmaFeatures: { globalReturn: true },
		},
		globals: {
			...globals.node,
			__dirname: "readonly",
			__filename: "readonly",
			exports: "writable",
			module: "readonly",
			require: "readonly",
		},
	},
	rules: {
		...commonjs.rules,
		...module.rules,
	},
};

export default {
	"node/dirty": dirty,
	"node/commonjs": commonjs,
	"node/module": module,
	"node/recommended": module,
	"node/mixed-dirty": [
		{
			files: ["**/*.{js,jsx}"],
			...dirty,
		},
		{
			files: ["**/*.cjs"],
			...commonjs,
		},
		{
			files: ["**/*.mjs"],
			...module,
		},
	],
	"node/mixed-module-and-commonjs": [
		{
			files: ["**/*.{js,jsx}"],
			...module,
		},
		{
			files: ["**/*.cjs"],
			...commonjs,
		},
		{
			files: ["**/*.mjs"],
			...module,
		},
	],
	"node/mixed-commonjs-and-module": [
		{
			files: ["**/*.{js,jsx}"],
			...commonjs,
		},
		{
			files: ["**/*.cjs"],
			...commonjs,
		},
		{
			files: ["**/*.mjs"],
			...module,
		},
	],
};
