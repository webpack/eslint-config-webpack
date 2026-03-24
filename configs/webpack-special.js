import { configs } from "../plugins/webpack/index.js";

/** @type {import("eslint").Linter.Config} */
const recommendedWebpackSpecialConfig = configs.recommended;

export default {
	"webpack/special": recommendedWebpackSpecialConfig,
};
