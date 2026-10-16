import { configs } from "../plugins/performance/index.js";

/** @type {import("eslint").Linter.Config} */
const recommendedPerformanceConfig = configs.recommended;

export default {
	"performance/recommended": recommendedPerformanceConfig,
};
