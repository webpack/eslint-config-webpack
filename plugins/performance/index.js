import { createRequire } from "node:module";
import {
	allExtensions,
	javascriptExtensions,
} from "../../configs/utils/extensions.js";
import isTypescriptInstalled from "../../configs/utils/is-typescript-installed.js";
import { rule as noCaseInsensitiveUnicodeRange } from "./rules/no-case-insensitive-unicode-range.js";

const require = createRequire(import.meta.url);

const { version } = require("../../package.json");

const rules = {
	"no-case-insensitive-unicode-range": noCaseInsensitiveUnicodeRange,
};

/** @type {import("eslint").Linter.Config["rules"]} */
const recommendedRules = {
	...Object.fromEntries(
		Object.entries(rules)
			.filter(([, rule]) => rule.meta?.docs?.recommended)
			.map(([name]) => [`performance/${name}`, "error"]),
	),
};

// Only the files the javascript config lints, so a project without TypeScript
// doesn't parse `.ts` files with the default parser.
const extensions = isTypescriptInstalled()
	? allExtensions
	: javascriptExtensions;

/** @type {Record<"recommended", import("eslint").Linter.Config>} */
const configs = {
	recommended: {
		name: "performance/recommended",
		files: [`**/*.{${extensions.map((item) => item.slice(1)).join(",")}}`],
		ignores: ["**/*.d.ts"],
		plugins: {
			get performance() {
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
