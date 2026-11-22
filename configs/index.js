import browserConfig from "./browser.js";
import htmlConfig from "./html.js";
import javascriptConfig from "./javascript.js";
import jsonConfig from "./json.js";
import markdownConfig from "./markdown.js";
import nodeConfig from "./node.js";
import performanceConfig from "./performance.js";
import reactConfig from "./react.js";
import stylisticConfig from "./stylistic.js";
import testConfig from "./test.js";
import typescriptConfig from "./typescript.js";
import webpackSpecial from "./webpack-special.js";

// TODO merge this file with config.js into one to avoid problems with types

/** @typedef {typeof browserConfig & typeof htmlConfig & typeof javascriptConfig & typeof jsonConfig & typeof markdownConfig & typeof nodeConfig & typeof testConfig & typeof stylisticConfig & typeof typescriptConfig & typeof reactConfig & typeof performanceConfig & typeof webpackSpecial} BasicConfigs */
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
 * "universal-recommended": NestedConfig,
 }} AddvancedConfigs */

/** @type {BasicConfigs & AddvancedConfigs} */
const configs =
	/** @type {BasicConfigs & AddvancedConfigs} */
	({
		...browserConfig,
		...htmlConfig,
		...javascriptConfig,
		...jsonConfig,
		...markdownConfig,
		...nodeConfig,
		...testConfig,
		...stylisticConfig,
		...typescriptConfig,
		...reactConfig,
		...performanceConfig,
		...webpackSpecial,
	});

export default configs;
