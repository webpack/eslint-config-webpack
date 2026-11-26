import path from "node:path";
import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import { rule } from "../plugins/webpack/rules/prefer-import-tag.js";

RuleTester.describe = describe;
RuleTester.it = it;

const __dirname = import.meta.dirname;

// Next to `Foo.js`, `Source.ts`, `dir/index.js` and `declarations/Options.d.ts`
const filename = path.join(__dirname, "fixtures/prefer-import-tag/main.js");

const always = [{ extension: "always" }];

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 2024, sourceType: "commonjs" },
});

/**
 * @param {string} request module request as written
 * @returns {string} a file importing one type from it
 */
const importFrom = (request) => `/** @import { T } from "${request}" */\n`;

/**
 * @param {string} request module request as written
 * @param {string} fixed request with its extension
 * @returns {import("eslint").RuleTester.InvalidTestCase} the test case
 */
const missingExtension = (request, fixed) => ({
	code: importFrom(request),
	output: importFrom(fixed),
	filename,
	options: always,
	errors: [{ messageId: "missingExtension", data: { request, fixed } }],
});

ruleTester.run("prefer-import-tag", rule, {
	valid: [
		importFrom("./Foo"),
		// Off by default
		{ code: importFrom("./Foo"), filename },
		{ code: importFrom("./Foo.js"), filename, options: always },
		{ code: importFrom("./Source.js"), filename, options: always },
		{ code: importFrom("./dir/index.js"), filename, options: always },
		{
			code: importFrom("./declarations/Options.d.ts"),
			filename,
			options: always,
		},
		// Packages and paths that resolve to nothing are TypeScript's to report
		{ code: importFrom("webpack-sources"), filename, options: always },
		{ code: importFrom("./Missing"), filename, options: always },
		// Without a real file name there is no directory to resolve against
		{ code: importFrom("./Foo"), options: always },
		'/** @typedef {import("estree").Node & { a: 1 }} Node */\n',
	],
	invalid: [
		{
			code: '/** @typedef {import("estree").Node} Node */\n',
			output: '/** @import { Node } from "estree" */\n',
			errors: [{ messageId: "preferImportTag" }],
		},
		{
			code: '/** @typedef {import("./Foo")} Foo */\n',
			output: '/** @import Foo from "./Foo" */\n',
			filename,
			errors: [{ messageId: "preferImportTag" }],
		},
		{
			code: '/** @typedef {import("./Foo").Bar} Baz */\n',
			output: '/** @import { Bar as Baz } from "./Foo.js" */\n',
			filename,
			options: always,
			errors: [{ messageId: "preferImportTag" }],
		},
		missingExtension("./Foo", "./Foo.js"),
		missingExtension("./Source", "./Source.js"),
		missingExtension("./dir", "./dir/index.js"),
		missingExtension("./dir/", "./dir/index.js"),
		missingExtension("./declarations/Options", "./declarations/Options.d.ts"),
		missingExtension("../prefer-import-tag/Foo", "../prefer-import-tag/Foo.js"),
		{
			code: "/**\n * @import { A } from './Foo'\n * @import { B } from \"./dir\"\n */\n",
			output:
				"/**\n * @import { A } from './Foo.js'\n * @import { B } from \"./dir/index.js\"\n */\n",
			filename,
			options: always,
			errors: [
				{ messageId: "missingExtension", line: 2, column: 24, endColumn: 29 },
				{ messageId: "missingExtension", line: 3, column: 24, endColumn: 29 },
			],
		},
	],
});
