import { createRequire } from "node:module";
import * as parserJsonc from "jsonc-eslint-parser";
import { rule as orderProperties } from "./rules/order-properties.js";

const require = createRequire(import.meta.url);

const { version } = require("../../package.json");

const rules = {
	"order-properties": orderProperties,
};

const recommendedRules = {
	...Object.fromEntries(
		Object.entries(rules)
			.filter(([, rule]) => rule.meta.docs?.recommended)
			.map(([name]) => [`package-json/${name}`, "error"]),
	),
};

const configs = {
	recommended: {
		name: "package-json/recommended",
		files: ["**/package.json"],
		languageOptions: {
			parser: parserJsonc,
		},
		plugins: {
			get "package-json"() {
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

export { rules, configs };

export default plugin;
