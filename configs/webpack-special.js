import { configs } from "../plugins/webpack/index.js";

/** @type {import("eslint").Linter.Config} */
const recommendedWebpackSpecialConfig = configs.recommended;

/** @type {import("eslint").Linter.Config} */
const webpackSchemasConfig = configs.schemas;

/** @type {import("eslint").Linter.Config} */
const webpackTypesConfig = configs.types;

export default {
	"webpack/special": recommendedWebpackSpecialConfig,
	"webpack/schemas": webpackSchemasConfig,
	"webpack/types": webpackTypesConfig,
};
