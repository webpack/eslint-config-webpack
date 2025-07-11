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

const configs = {
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
};

export default configs;
