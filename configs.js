import fs from "node:fs";
import path from "node:path";
import { globalIgnores } from "eslint/config";
import semver from "semver";
import configs from "./configs/index.js";
import ignorePaths from "./ignore-paths.js";

const SKIP_TIME = 5000;

class Cache {
	/**
	 * Initialize this cache instance.
	 */
	constructor() {
		this.map = new Map();
	}

	/**
	 * Get the cached value of the given key.
	 * @param {string} key The key to get.
	 * @returns {import('type-fest').JsonObject} The cached value or null.
	 */
	get(key) {
		const entry = this.map.get(key);
		const now = Date.now();

		if (entry) {
			if (entry.expire > now) {
				entry.expire = now + SKIP_TIME;
				return entry.value;
			}
			this.map.delete(key);
		}
		return null;
	}

	/**
	 * Set the value of the given key.
	 * @param {string} key The key to set.
	 * @param {import('type-fest').JsonObject} value The value to set.
	 * @returns {void}
	 */
	set(key, value) {
		const entry = this.map.get(key);
		const expire = Date.now() + SKIP_TIME;

		if (entry) {
			entry.value = value;
			entry.expire = expire;
		} else {
			this.map.set(key, { value, expire });
		}
	}
}

const cache = new Cache();

/**
 * Reads the `package.json` data in a given path.
 *
 * Don't cache the data.
 * @param {string} dir The path to a directory to read.
 * @param {string} filename The filename.
 * @returns {import('type-fest').JsonObject|null} The read `package.json` data, or null.
 */
function readJsonFile(dir, filename) {
	const filePath = path.join(dir, filename);
	try {
		const text = fs.readFileSync(filePath, "utf8");
		const data = JSON.parse(text);

		if (
			data !== null &&
			typeof data === "object" &&
			Array.isArray(data) === false
		) {
			data.filePath = filePath;
			return data;
		}
		// eslint-disable-next-line unicorn/prefer-optional-catch-binding
	} catch (_err) {
		// do nothing.
	}

	return null;
}

/**
 * Gets a `package.json` data.
 * The data is cached if found, then it's used after.
 * @param {string} filename The filename.
 * @param {string=} startPath A file path to lookup.
 * @returns {import('type-fest').JsonObject | null} A found `package.json` data or `null`.
 * This object have additional property `filePath`.
 */
function getJsonFile(filename, startPath = "a.js") {
	const startDir = path.dirname(path.resolve(startPath));
	let dir = startDir;
	let prevDir = "";
	let data = null;

	do {
		data = cache.get(dir + filename);
		if (data) {
			if (dir !== startDir) {
				cache.set(startDir + filename, data);
			}
			return data;
		}

		data = readJsonFile(dir, filename);
		if (data) {
			cache.set(dir + filename, data);
			cache.set(startDir + filename, data);
			return data;
		}

		// Go to next.
		prevDir = dir;
		dir = path.resolve(dir, "..");
	} while (dir !== prevDir);

	cache.set(startDir + filename, null);
	return null;
}

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
	if (packageJson === null) {
		return [];
	}

	const dependencies = packageJson.dependencies || [];
	const devDependencies = packageJson.devDependencies || [];

	return typeof dependencies.typescript !== "undefined" ||
		typeof devDependencies.typescript !== "undefined"
		? configs["typescript/jsdoc"]
		: [];
}

/**
 * @returns {Promise<Record<string, string>>} config
 */
function getTypescriptConfig() {
	if (packageJson === null) {
		return [];
	}

	const dependencies = packageJson.dependencies || [];
	const devDependencies = packageJson.devDependencies || [];

	if (
		typeof dependencies.typescript === "undefined" &&
		typeof devDependencies.typescript === "undefined"
	) {
		return [];
	}

	const tsconfigJson = getJsonFile("tsconfig.json");
	const isStrict =
		(tsconfigJson &&
			tsconfigJson.compilerOptions &&
			tsconfigJson.compilerOptions.strict) ||
		true;

	return [
		configs["typescript/recommended"],
		isStrict ? { rules: { strict: "off" } } : {},
	];
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
const jestConfig = getJestConfig();

configs.recommended = [
	globalIgnores(ignorePaths),
	isModule
		? configs["node/mixed-module-and-commonjs"]
		: configs["node/mixed-commonjs-and-module"],
	javascriptConfig,
	typescriptJSDocConfig,
	typescriptConfig,
	jestConfig,
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
];

configs["recommended-module"] = [
	globalIgnores(ignorePaths),
	configs["node/mixed-module-and-commonjs"],
	javascriptConfig,
	typescriptJSDocConfig,
	typescriptConfig,
	jestConfig,
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
];

configs["recommended-commonjs"] = [
	globalIgnores(ignorePaths),
	configs["node/mixed-commonjs-and-module"],
	javascriptConfig,
	typescriptJSDocConfig,
	typescriptConfig,
	jestConfig,
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
];

configs["recommended-dirty"] = [
	globalIgnores(ignorePaths),
	configs["node/mixed-dirty"],
	javascriptConfig,
	typescriptJSDocConfig,
	typescriptConfig,
	jestConfig,
	configs["markdown/recommended"],
	configs["stylistic/recommended"],
];

export { default } from "./configs/index.js";
