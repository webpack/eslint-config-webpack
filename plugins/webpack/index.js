import { createRequire } from "node:module";
// eslint-disable-next-line import/no-unresolved
import * as parserJsonc from "jsonc-eslint-parser";
import { allExtensions } from "../../configs/utils/extensions.js";
import { rule as requireLicenseComment } from "./rules/require-license-comment.js";
import { rule as validSchema } from "./rules/valid-schema.js";

const require = createRequire(import.meta.url);

const { version } = require("../../package.json");

const rules = {
	"require-license-comment": requireLicenseComment,
	"valid-schema": validSchema,
};

/** @type {import("eslint").Linter.Config["rules"]} */
const recommendedRules = {
	...Object.fromEntries(
		Object.entries(rules)
			.filter(([, rule]) => rule.meta?.docs?.recommended)
			.map(([name]) => [`webpack/${name}`, "error"]),
	),
};

/** @type {Record<"recommended" | "schemas", import("eslint").Linter.Config>} */
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
	schemas: {
		name: "webpack/schemas",
		files: ["**/schemas/**/*.json"],
		languageOptions: {
			parser: parserJsonc,
		},
		plugins: {
			get webpack() {
				// eslint-disable-next-line no-use-before-define
				return plugin;
			},
		},
		rules: {
			"webpack/valid-schema": "error",
		},
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
