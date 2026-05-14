import { globalIgnores } from "eslint/config";
import semver from "semver";
import configs from "./configs/index.js";
import getEsVersionFromNode from "./configs/utils/get-es-version-from-node.js";
import getJsonFile from "./configs/utils/get-json-file.js";
import ignorePaths from "./ignore-paths.js";

const packageJson = getJsonFile("package.json");
const isModule =
	packageJson !== null &&
	typeof packageJson === "object" &&
	"type" in packageJson &&
	packageJson.type === "module";

/**
 * @returns {import("eslint").Linter.Config} javascript configuration
 */
function getJavascriptConfig() {
	if (!packageJson.engines || !packageJson.engines.node) {
		return configs["javascript/recommended"];
	}

	const nodeRange = packageJson.engines.node;
	const minVersion = semver.minVersion(nodeRange);

	// Node 6 has Array#includes (from 6.5) but never gained the `**` operator,
	// so it doesn't map cleanly to a single ES year — handle it inline.
	// https://node.green/
	if (minVersion && minVersion.major === 6) {
		const base = configs["javascript/es2016"];
		return {
			...base,
			rules: {
				...base.rules,
				"prefer-exponentiation-operator": "off",
			},
		};
	}

	const esVersion = getEsVersionFromNode(nodeRange);

	if (esVersion === undefined) {
		return configs["javascript/recommended"];
	}

	const config = configs[`javascript/es${esVersion}`];

	// The `globals.es2019` set from the `globals` package doesn't declare
	// `Promise` or `BigInt`, but both are available at runtime on Node 12+.
	// Re-add them as readonly globals so `no-undef` doesn't flag usage.
	if (esVersion === 2019) {
		/** @type {import("eslint").Linter.Config["languageOptions"]} */
		const original = config.languageOptions;
		/** @type {import("eslint").Linter.Config["languageOptions"]} */
		const languageOptions = {
			...original,
			globals: {
				// @ts-expect-error always exist
				...original.globals,
				Promise: false,
				BigInt: false,
			},
		};

		return { ...config, languageOptions };
	}

	return config;
}

const javascriptConfig = getJavascriptConfig();

const recommended = [
	globalIgnores(ignorePaths),
	isModule
		? configs["node/mixed-module-and-commonjs"]
		: configs["node/mixed-commonjs-and-module"],
	javascriptConfig,
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

// TODO remove me in the next major release
configs.recommended = recommended;

configs["node-recommended"] = recommended;

const nodeRecommendedModule = [
	globalIgnores(ignorePaths),
	configs["node/mixed-module-and-commonjs"],
	javascriptConfig,
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

// TODO remove me in the next major release
configs["recommended-module"] = nodeRecommendedModule;

configs["node-recommended-module"] = nodeRecommendedModule;

const nodeRecommendedCommonJS = [
	globalIgnores(ignorePaths),
	configs["node/mixed-commonjs-and-module"],
	javascriptConfig,
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

// TODO remove me in the next major release
configs["recommended-commonjs"] = nodeRecommendedCommonJS;

configs["node-recommended-commonjs"] = nodeRecommendedCommonJS;

const nodeRecommendedDirty = [
	globalIgnores(ignorePaths),
	configs["node/mixed-dirty"],
	javascriptConfig,
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];
// TODO remove me in the next major release
configs["recommended-dirty"] = nodeRecommendedDirty;

configs["node-recommended-dirty"] = nodeRecommendedDirty;

const browserRecommended = [
	globalIgnores(ignorePaths),
	configs["browser/recommended"],
	javascriptConfig,
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

configs["browser-recommended"] = browserRecommended;

const browserOutdatedRecommendedScript = [
	globalIgnores(ignorePaths),
	configs["browser/recommended-outdated-script"],
	configs["javascript/es5"],
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

configs["browser-outdated-recommended-script"] =
	browserOutdatedRecommendedScript;

const browserOutdatedRecommendedCommonjs = [
	globalIgnores(ignorePaths),
	configs["browser/recommended-outdated-commonjs"],
	configs["javascript/es5"],
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

configs["browser-outdated-recommended-commonjs"] =
	browserOutdatedRecommendedCommonjs;

const browserOutdatedRecommendedModule = [
	globalIgnores(ignorePaths),
	configs["browser/recommended-outdated-module"],
	{
		...configs["javascript/es5"],
		languageOptions: {
			ecmaVersion: "latest",
		},
	},
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

// TODO remove in the next major release
configs["browser-outdated-recommended"] = browserOutdatedRecommendedModule;

configs["browser-outdated-recommended-module"] =
	browserOutdatedRecommendedModule;

const universalRecommended = [
	globalIgnores(ignorePaths),
	configs["browser/recommended"],
	isModule
		? configs["node/mixed-module-and-commonjs"]
		: configs["node/mixed-commonjs-and-module"],
	javascriptConfig,
	configs["typescript/jsdoc"],
	configs["typescript/recommended"],
	configs["react/recommended"],
	configs["jest/recommended"],
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

configs["universal-recommended"] = universalRecommended;

export { default } from "./configs/index.js";
