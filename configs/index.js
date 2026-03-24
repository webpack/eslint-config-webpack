import browserConfig from "./browser.js";
import javascriptConfig from "./javascript.js";
import jestConfig from "./jest.js";
import markdownConfig from "./markdown.js";
import nodeConfig from "./node.js";
import packageJSON from "./package-json.js";
import reactConfig from "./react.js";
import stylisticConfig from "./stylistic.js";
import typescriptConfig from "./typescript.js";
import webpackSpecial from "./webpack-special.js";

// TODO merge this file with config.js into one to avoid problems with types

/** @typedef {typeof browserConfig & typeof javascriptConfig & typeof jestConfig & typeof markdownConfig & typeof nodeConfig & typeof stylisticConfig & typeof typescriptConfig & typeof reactConfig & typeof packageJSON & typeof webpackSpecial} BasicConfigs */
/** @typedef {import("eslint").Linter.Config} Config */
/** @typedef {(Config | Config[])[]} NestedConfig */
/**
 * @typedef {{
 * recommended: NestedConfig,
 * "node-recommended": NestedConfig,
 * "recommended-module": NestedConfig,
 * "node-recommended-module": NestedConfig,
 * "recommended-commonjs": NestedConfig,
 * "node-recommended-commonjs": NestedConfig,
 * "recommended-dirty": NestedConfig,
 * "node-recommended-dirty": NestedConfig,
 * "browser-recommended": NestedConfig,
 * "browser-outdated-recommended-script": NestedConfig,
 * "browser-outdated-recommended-commonjs": NestedConfig,
 * "browser-outdated-recommended-module": NestedConfig,
 * "browser-outdated-recommended": NestedConfig,
 * "universal-recommended": NestedConfig,
 }} AddvancedConfigs */

/** @type {BasicConfigs & AddvancedConfigs} */
const configs =
	/** @type {BasicConfigs & AddvancedConfigs} */
	({
		...browserConfig,
		...javascriptConfig,
		...jestConfig,
		...markdownConfig,
		...nodeConfig,
		...stylisticConfig,
		...typescriptConfig,
		...reactConfig,
		...packageJSON,
		...webpackSpecial,
	});

export default configs;
