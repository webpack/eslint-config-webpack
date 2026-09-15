import { createRequire } from "node:module";
// eslint-disable-next-line import/no-unresolved
import * as parserJsonc from "jsonc-eslint-parser";
import { allExtensions } from "../../configs/utils/extensions.js";
import { rule as formatSchema } from "./rules/format-schema.js";
import { rule as inheritJsdoc } from "./rules/inherit-jsdoc.js";
import { rule as noDuplicateImportTag } from "./rules/no-duplicate-import-tag.js";
import { rule as noUnusedImportTag } from "./rules/no-unused-import-tag.js";
import { rule as preferImportTag } from "./rules/prefer-import-tag.js";
import { rule as requireLicenseComment } from "./rules/require-license-comment.js";
import { rule as validSchema } from "./rules/valid-schema.js";

const require = createRequire(import.meta.url);

const { version } = require("../../package.json");

const rules = {
	"format-schema": formatSchema,
	"inherit-jsdoc": inheritJsdoc,
	"no-duplicate-import-tag": noDuplicateImportTag,
	"no-unused-import-tag": noUnusedImportTag,
	"prefer-import-tag": preferImportTag,
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

/** @type {Record<"recommended" | "schemas" | "types", import("eslint").Linter.Config>} */
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
			"webpack/format-schema": "error",
			"webpack/valid-schema": "error",
		},
	},
	types: {
		name: "webpack/types",
		files: ["**/lib/**/*.{js,mjs,cjs}"],
		languageOptions: {
			// `typescript` is an optional peer dependency, so the parser that needs
			// it is only resolved when this config is actually used.
			get parser() {
				return require("typescript-eslint").parser;
			},
			parserOptions: {
				projectService: true,
			},
		},
		plugins: {
			get "@typescript-eslint"() {
				return require("typescript-eslint").plugin;
			},
			get webpack() {
				// eslint-disable-next-line no-use-before-define
				return plugin;
			},
		},
		rules: {
			// The TypeScript parser puts the TS `lib` globals in scope, so these
			// base rules read a local `Cache` or `crypto` as clashing with one.
			"no-global-assign": "off",
			"no-redeclare": "off",
			"@typescript-eslint/no-redeclare": ["error", { builtinGlobals: false }],
			"webpack/inherit-jsdoc": "error",
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
