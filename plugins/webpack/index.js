import { createRequire } from "node:module";
// eslint-disable-next-line import/no-unresolved
import * as parserJsonc from "jsonc-eslint-parser";
import { allExtensions } from "../../configs/utils/extensions.js";
import { rule as commentLength } from "./rules/comment-length.js";
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
	"comment-length": commentLength,
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

/** @type {Record<"comments" | "recommended" | "schemas" | "types", import("eslint").Linter.Config>} */
const configs = {
	comments: {
		name: "webpack/comments",
		files: [`**/*.{${allExtensions.map((item) => item.slice(1)).join(",")}}`],
		plugins: {
			get webpack() {
				// eslint-disable-next-line no-use-before-define
				return plugin;
			},
		},
		rules: {
			"webpack/comment-length": "error",
		},
	},
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
			get webpack() {
				// eslint-disable-next-line no-use-before-define
				return plugin;
			},
		},
		rules: {
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
