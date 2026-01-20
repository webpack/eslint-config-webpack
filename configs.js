import { globalIgnores } from "eslint/config";
import semver from "semver";
import configs from "./configs/index.js";
import { typescriptExtensions } from "./configs/utils/extensions.js";
import getJsonFile from "./configs/utils/get-json-file.js";
import isTypescriptInstalled from "./configs/utils/is-typescript-installed.js";
import ignorePaths from "./ignore-paths.js";

const packageJson = getJsonFile("package.json");
const isModule =
	packageJson !== null &&
	typeof packageJson === "object" &&
	"type" in packageJson &&
	packageJson.type === "module";

/**
 * @returns {Record<string, string>} javascript configuration
 */
function getJavascriptConfig() {
	if (packageJson.engines && packageJson.engines.node) {
		const minVersion = semver.minVersion(packageJson.engines.node).major;

		// https://node.green/
		// https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping
		switch (minVersion) {
			case 6: {
				const config = { ...configs["javascript/es2016"] };

				config.rules["prefer-exponentiation-operator"] = "off";

				return config;
			}
			case 7:
				return configs["javascript/es2016"];
			case 8:
			case 9:
				return configs["javascript/es2017"];
			case 10:
			case 11:
				return configs["javascript/es2018"];
			case 12:
			case 13: {
				const languageOptions = {
					...configs["javascript/es2019"].languageOptions,
				};

				languageOptions.globals.Promise = false;
				languageOptions.globals.BigInt = false;

				return { ...configs["javascript/es2019"], languageOptions };
			}
			case 14:
				return configs["javascript/es2020"];

			case 15:
				return configs["javascript/es2021"];
			case 16:
			case 17:
			case 18:
			case 19:
				return configs["javascript/es2022"];
			case 20:
			case 21:
				return configs["javascript/es2023"];
			case 22:
			case 23:
				return configs["javascript/es2024"];
			case 24:
			case 25:
				return configs["javascript/es2025"];
			default:
				return configs["javascript/recommended"];
		}
	}

	return configs["javascript/recommended"];
}

/**
 * @returns {Promise<Record<string, string>>} config
 */
function getTypescriptJSdocConfig() {
	return isTypescriptInstalled() ? configs["typescript/jsdoc"] : [];
}

/**
 * @returns {Promise<Record<string, string>>} config
 */
function getTypescriptConfig() {
	if (!isTypescriptInstalled()) {
		return {};
	}

	const tsconfigJson = getJsonFile("tsconfig.json");

	const isNoEmitEnabled =
		(tsconfigJson &&
			tsconfigJson.compilerOptions &&
			tsconfigJson.compilerOptions.noEmit) ||
		false;

	if (isNoEmitEnabled) {
		return {};
	}

	const isStrict =
		(tsconfigJson &&
			tsconfigJson.compilerOptions &&
			tsconfigJson.compilerOptions.strict) ||
		true;

	return [
		configs["typescript/recommended"],
		isStrict
			? {
					files: [
						`**/*.{${typescriptExtensions.map((item) => item.slice(1)).join(",")}}`,
					],
					ignores: ["**/*.d.ts"],
					rules: { strict: "off" },
				}
			: {},
	];
}

/**
 * @returns {Promise<Record<string, string>>} config
 */
function getReactConfig() {
	if (packageJson === null) {
		return [];
	}

	const dependencies = packageJson.dependencies || [];
	const devDependencies = packageJson.devDependencies || [];

	return typeof dependencies.react !== "undefined" ||
		typeof dependencies.preact !== "undefined" ||
		typeof devDependencies.react !== "undefined" ||
		typeof devDependencies.preact !== "undefined"
		? configs["react/recommended"]
		: [];
}

/**
 * @returns {Promise<Record<string, string>>} config
 */
function getJestConfig() {
	if (packageJson === null) {
		return [];
	}

	const dependencies = packageJson.dependencies || [];
	const devDependencies = packageJson.devDependencies || [];

	return typeof dependencies.jest !== "undefined" ||
		typeof devDependencies.jest !== "undefined"
		? configs["jest/recommended"]
		: [];
}

const javascriptConfig = getJavascriptConfig();
const typescriptJSDocConfig = getTypescriptJSdocConfig();
const typescriptConfig = getTypescriptConfig();
const reactConfig = getReactConfig();
const jestConfig = getJestConfig();

const recommended = [
	globalIgnores(ignorePaths),
	isModule
		? configs["node/mixed-module-and-commonjs"]
		: configs["node/mixed-commonjs-and-module"],
	javascriptConfig,
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
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
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
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
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
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
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
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
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

configs["browser-recommended"] = browserRecommended;

const browserOutdatedRecommendedScript = [
	globalIgnores(ignorePaths),
	configs["browser/recommended-outdated-script"],
	configs["javascript/es5"],
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
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
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
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
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
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
	typescriptJSDocConfig,
	typescriptConfig,
	reactConfig,
	jestConfig,
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
	configs["package-json/recommended"],
];

configs["universal-recommended"] = universalRecommended;

export { default } from "./configs/index.js";
