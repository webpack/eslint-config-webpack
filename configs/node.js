import importPlugin from "eslint-plugin-import";
import globals from "globals";

const commonRules = {
	// No need
	// "n/callback-return": "error",

	// Depends on `sourceType` and enabled below only for commonjs
	// "n/exports-style": "error",

	// We have the `import/extensions` rule
	"n/file-extension-in-import": "off",

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

	// We have `import/no-unresolved` rule
	"n/no-missing-import": "off",

	// We have `import/no-unresolved` rule
	"n/no-missing-require": "off",

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

let nodePlugin;

const ignores = ["**/*.d.ts"];

/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getCommonJSConfig() {
	if (!nodePlugin) {
		try {
			nodePlugin = (await import("eslint-plugin-n")).default;
			// eslint-disable-next-line unicorn/prefer-optional-catch-binding
		} catch (_err) {
			// Nothing
		}
	}

	const nodeConfig =
		(nodePlugin && nodePlugin.configs["flat/recommended-script"]) || {};

	return {
		...nodeConfig,
		name: "node/commonjs",
		ignores,
		plugins: {
			...nodeConfig.plugins,
			import: importPlugin,
		},
		rules: {
			...nodeConfig.rules,
			...commonRules,
			"n/exports-style": "error",
			"n/no-path-concat": "error",
			"import/extensions": [
				"error",
				"always",
				{
					ignorePackages: true,
					checkTypeImports: true,
					pattern: {
						js: "never",
						ts: "never",
					},
					// Allow to have `ts` extension in `require` for compatibility with Node.js built-in typescript support
					pathGroupOverrides: [
						{
							pattern: "*.ts",
							patternOptions: {
								matchBase: true,
							},
							action: "ignore",
						},
					],
				},
			],
		},
	};
}

/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getModuleConfig() {
	let nodePlugin;

	if (!nodePlugin) {
		try {
			nodePlugin = (await import("eslint-plugin-n")).default;
			// eslint-disable-next-line unicorn/prefer-optional-catch-binding
		} catch (_err) {
			// Nothing
		}
	}

	const nodeConfig =
		(nodePlugin && nodePlugin.configs["flat/recommended-module"]) || {};

	return {
		...nodeConfig,
		name: "node/module",
		ignores,
		plugins: {
			...nodeConfig.plugins,
			import: importPlugin,
		},
		rules: {
			...nodeConfig.rules,
			...commonRules,
			"import/extensions": [
				"error",
				"always",
				{ ignorePackages: true, checkTypeImports: true },
			],
		},
	};
}

const commonjsConfig = await getCommonJSConfig();
const moduleConfig = await getModuleConfig();

/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getDirtyConfig() {
	let nodePlugin;

	if (!nodePlugin) {
		try {
			nodePlugin = (await import("eslint-plugin-n")).default;
			// eslint-disable-next-line unicorn/prefer-optional-catch-binding
		} catch (_err) {
			// Nothing
		}
	}

	return {
		name: "node/dirty",
		plugins: {
			n: nodePlugin,
			import: importPlugin,
		},
		ignores: [...new Set([...commonjsConfig.ignores, ...moduleConfig.ignores])],
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
			...commonjsConfig.rules,
			...moduleConfig.rules,

			// Disable for dirty modules
			"import/extensions": ["off"],
		},
	};
}

const dirtyConfig = await getDirtyConfig();

export default {
	"node/dirty": dirtyConfig,
	"node/commonjs": commonjsConfig,
	"node/module": moduleConfig,
	"node/recommended": moduleConfig,
	"node/mixed-dirty": [
		{
			files: ["**/*.{js,jsx,ts,tsx}"],
			...dirtyConfig,
		},
		{
			files: ["**/*.{cjs,cts}"],
			...commonjsConfig,
		},
		{
			files: ["**/*.{mjs,mts}"],
			...moduleConfig,
		},
	],
	"node/mixed-module-and-commonjs": [
		{
			files: ["**/*.{js,jsx,ts,tsx}"],
			...moduleConfig,
		},
		{
			files: ["**/*.{cjs,cts}"],
			...commonjsConfig,
		},
		{
			files: ["**/*.{mjs,mts}"],
			...moduleConfig,
		},
	],
	"node/mixed-commonjs-and-module": [
		{
			files: ["**/*.{js,jsx,ts,tsx}"],
			...commonjsConfig,
		},
		{
			files: ["**/*.{cjs,cts}"],
			...commonjsConfig,
		},
		{
			files: ["**/*.{mjs,mts}"],
			...moduleConfig,
		},
	],
};
