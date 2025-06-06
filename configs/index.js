import browserConfig from "./browser.js";
import javascriptConfig from "./javascript.js";
import jestConfig from "./jest.js";
import markdownConfig from "./markdown.js";
import nodeConfig from "./node.js";
import prettierConfig from "./prettier.js";
import typescriptConfig from "./typescript.js";

const configs = {
	...browserConfig,
	...javascriptConfig,
	...jestConfig,
	...markdownConfig,
	...nodeConfig,
	...prettierConfig,
	...typescriptConfig,
};

export default configs;
