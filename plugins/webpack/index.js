import { createRequire } from "node:module";
import { allExtensions } from "../../configs/utils/extensions.js";
import { rule as requireLicenseComment } from "./rules/require-license-comment.js";

const require = createRequire(import.meta.url);

const { version } = require("../../package.json");

const rules = {
	"require-license-comment": requireLicenseComment,
};

const recommendedRules = {
	...Object.fromEntries(
		Object.entries(rules)
			.filter(([, rule]) => rule.meta.docs?.recommended)
			.map(([name]) => [`webpack/${name}`, "error"]),
	),
};

const configs = {
	recommended: {
		name: "webpack/recommended",
		files: [`**/*.{${allExtensions.map((item) => item.slice(1)).join(",")}}`],
		plugins: {
			get webpack() {
				// eslint-disable-next-line no-use-before-define
				return plugin;
			},
		},
		rules: recommendedRules,
	},
};

const plugin = {
	configs,
	meta: {
		version,
	},
	rules,
};

export { configs, rules };

export default plugin;
