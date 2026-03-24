import { configs } from "../plugins/package-json/index.js";

/** @type {import("eslint").Linter.Config} */
const recommendedBrowserConfig = configs.recommended;

export default {
	"package-json/recommended": recommendedBrowserConfig,
};
