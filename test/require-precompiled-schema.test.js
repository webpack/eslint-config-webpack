import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { RuleTester } from "eslint";
import { rule } from "../plugins/performance/rules/require-precompiled-schema.js";

RuleTester.describe = describe;
RuleTester.it = it;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Next to `options.json` and its `options.check.js`, and to `plain.json` that has no check
const filename = path.join(__dirname, "fixtures/precompiled-schema/index.js");

const commonjs = new RuleTester({
	languageOptions: { ecmaVersion: 2024, sourceType: "commonjs" },
});

const esm = new RuleTester({
	languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

commonjs.run("require-precompiled-schema (CommonJS)", rule, {
	valid: [
		// Plugins
		'compiler.validate(schema, options, { name: "Plugin" }, check);',
		'this.compiler.validate(schema, options, { name: "Plugin" }, check);',
		// Not a compiler
		"form.validate(schema, options);",
		"validate(schema, options);",
		// Loaders
		"this.getOptions(schema, check);",
		"loaderContext.getOptions(schema, check);",
		// Parsing the options without validating them
		"this.getOptions();",
		// Not a loader context
		"stats.getOptions(name);",
		"getOptions(this);",
		// `schema-utils`
		'const { validate } = require("schema-utils"); validate(schema, options, {}, check);',
		'const schemaUtils = require("schema-utils"); schemaUtils.validate(schema, options, {}, check);',
		// `validate` from another package
		'const { validate } = require("ajv-validator"); validate(schema, options);',
		// A local `validate` shadowing the import
		'const { validate } = require("schema-utils"); function f(validate) { validate(schema, options); }',
		// Arguments that cannot be counted
		"compiler.validate(...args);",
	],
	invalid: [
		{
			code: 'compiler.validate(schema, options, { name: "Plugin" });',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'this.compiler.validate(schema, options, { name: "Plugin" });',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: "childCompiler.validate(schema, options);",
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: "this.getOptions(schema);",
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: "loaderContext.getOptions(schema);",
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'const { validate } = require("schema-utils"); validate(schema, options, { name: "Loader" });',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'const { validate: validateOptions } = require("schema-utils"); validateOptions(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'const schemaUtils = require("schema-utils"); schemaUtils.validate(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'const schemaUtils = require("schema-utils"); const { validate } = schemaUtils; validate(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'require("schema-utils").validate(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		// The check exists next to the schema, so it can be passed
		{
			code: 'const schema = require("./options.json");\nmodule.exports = function loader() { return this.getOptions(schema); };',
			filename,
			errors: [
				{
					messageId: "missingCheck",
					data: {
						api: "this.getOptions(schema, check)",
						command: `npx schema-utils precompile ${path.posix.join(path.relative(process.cwd(), path.dirname(filename)).replaceAll("\\", "/"), "options.json")}`,
					},
					suggestions: [
						{
							messageId: "useCheck",
							data: { check: "./options.check.js" },
							output:
								'const schema = require("./options.json");\nmodule.exports = function loader() { return this.getOptions(schema, require("./options.check.js")); };',
						},
					],
				},
			],
		},
		{
			code: 'compiler.validate(() => require("./options.json"), options, { name: "Plugin" });',
			filename,
			errors: [
				{
					messageId: "missingCheck",
					suggestions: [
						{
							messageId: "useCheck",
							output:
								'compiler.validate(() => require("./options.json"), options, { name: "Plugin" }, require("./options.check.js"));',
						},
					],
				},
			],
		},
		// The arguments in between are filled so the check lands fourth
		{
			code: 'const { validate } = require("schema-utils");\nvalidate(require("./options.json"), options);',
			filename,
			errors: [
				{
					messageId: "missingCheck",
					suggestions: [
						{
							messageId: "useCheck",
							output:
								'const { validate } = require("schema-utils");\nvalidate(require("./options.json"), options, undefined, require("./options.check.js"));',
						},
					],
				},
			],
		},
		// No check generated yet, so nothing to suggest
		{
			code: 'this.getOptions(require("./plain.json"));',
			filename,
			errors: [{ messageId: "missingCheck", suggestions: [] }],
		},
	],
});

esm.run("require-precompiled-schema (ES modules)", rule, {
	valid: [
		'import { validate } from "schema-utils"; validate(schema, options, {}, check);',
		'import { validate } from "./validate.js"; validate(schema, options);',
	],
	invalid: [
		{
			code: 'import { validate } from "schema-utils"; validate(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'import * as schemaUtils from "schema-utils"; schemaUtils.validate(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'import schemaUtils from "schema-utils"; schemaUtils.validate(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		{
			code: 'const { validate } = await import("schema-utils"); validate(schema, options);',
			errors: [{ messageId: "missingCheck" }],
		},
		// An imported schema needs an import of its check, which a suggestion cannot add safely
		{
			code: 'import schema from "./options.json";\nexport default function loader() { return this.getOptions(schema); }',
			filename,
			errors: [{ messageId: "missingCheck", suggestions: [] }],
		},
	],
});
