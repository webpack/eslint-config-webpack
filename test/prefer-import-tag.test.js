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
		{
			// A disabled range stays as written, though another report fixes the file
			code: '/* eslint-disable rule-to-test/prefer-import-tag -- re-exported */\n/** @typedef {import("estree").Node} Node */\n/* eslint-enable rule-to-test/prefer-import-tag */\n// eslint-disable-next-line rule-to-test/prefer-import-tag\n/** @type {import("estree").Comment} */\nconst a = 1;\n/** @type {import("estree").Program} */\nconst b = 1;\n',
			output:
				'/** @import { Program } from "estree" */\n\n/* eslint-disable rule-to-test/prefer-import-tag -- re-exported */\n/** @typedef {import("estree").Node} Node */\n/* eslint-enable rule-to-test/prefer-import-tag */\n// eslint-disable-next-line rule-to-test/prefer-import-tag\n/** @type {import("estree").Comment} */\nconst a = 1;\n/** @type {Program} */\nconst b = 1;\n',
			options: [{ inline: true }],
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// A disabled typedef keeps its name, and a disabled tag takes no binding
			code: '/* eslint-disable rule-to-test/prefer-import-tag */\n/** @typedef {import("estree").Node} Node */\n/** @import { Comment } from "estree" */\n/* eslint-enable rule-to-test/prefer-import-tag */\n/** @type {import("estree").Node | import("estree").Program} */\nconst a = 1;\n',
			output:
				'/** @import { Node as EstreeNode, Program } from "estree" */\n\n/* eslint-disable rule-to-test/prefer-import-tag */\n/** @typedef {import("estree").Node} Node */\n/** @import { Comment } from "estree" */\n/* eslint-enable rule-to-test/prefer-import-tag */\n/** @type {EstreeNode | Program} */\nconst a = 1;\n',
			options: [{ inline: true }],
			errors: [{ messageId: "inlineImport" }, { messageId: "inlineImport" }],
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

const inline = [{ inline: true }];

ruleTester.run("prefer-import-tag with inline", rule, {
	valid: [
		// Off by default
		'/** @param {import("estree").Node} node */\nconst f = (node) => node;\n',
		{
			code: '/** @import { Node } from "estree" */\n\n/** @param {Node} node */\nconst f = (node) => node;\n',
			options: inline,
		},
		// Prose and `@tsType` text are not types
		{
			code: "/**\n * Emits a literal `import(\"./chunk.js\")`.\n * @tsType import('./Foo').Bar\n */\nconst f = 1;\n",
			options: inline,
		},
		{
			code: '/** @typedef {import("estree").Node} Node */\n',
			options: [{ inline: true, typedefs: false }],
		},
	],
	invalid: [
		{
			code: '/** @param {import("estree").Node} node */\nconst f = (node) => node;\n',
			output:
				'/** @import { Node } from "estree" */\n\n/** @param {Node} node */\nconst f = (node) => node;\n',
			options: inline,
			errors: [{ messageId: "inlineImport", data: { request: "estree" } }],
		},
		{
			// After the header, and once for every use
			code: '"use strict";\n\nconst a = require("a");\n\n/**\n * @param {import("estree").Node} node\n * @returns {import("estree").Node[]}\n */\nconst f = (node) => [node];\n',
			output:
				'"use strict";\n\nconst a = require("a");\n\n/** @import { Node } from "estree" */\n\n/**\n * @param {Node} node\n * @returns {Node[]}\n */\nconst f = (node) => [node];\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }, { messageId: "inlineImport" }],
		},
		{
			// Folded into the tag that imports from the module already
			code: '/** @import { Program } from "estree" */\n\n/** @type {import("estree").Node | Program} */\nconst a = 1;\n',
			output:
				'/** @import { Program, Node } from "estree" */\n\n/** @type {Node | Program} */\nconst a = 1;\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// An existing binding is reused, a namespace read through
			code: '/** @import { Node as EstreeNode } from "estree" */\n/** @import * as acorn from "acorn" */\n\n/** @type {import("estree").Node | import("acorn").Token} */\nconst a = 1;\n',
			output:
				'/** @import { Node as EstreeNode } from "estree" */\n/** @import * as acorn from "acorn" */\n\n/** @type {EstreeNode | acorn.Token} */\nconst a = 1;\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }, { messageId: "inlineImport" }],
		},
		{
			// The module itself, as a type and through `typeof`, reusing a `require`
			code: 'const Foo = require("./Foo");\n\n/** @type {import("./Foo") | typeof import("./Foo")} */\nconst a = Foo;\n',
			output:
				'const Foo = require("./Foo");\n\n/** @type {Foo | typeof Foo} */\nconst a = Foo;\n',
			filename,
			options: inline,
			errors: [{ messageId: "inlineImport" }, { messageId: "inlineImport" }],
		},
		{
			code: '/** @type {typeof import("./dir")} */\nconst a = 1;\n',
			output:
				'/** @import dir from "./dir" */\n\n/** @type {typeof dir} */\nconst a = 1;\n',
			filename,
			options: inline,
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// A module naming itself needs no import
			code: '/** @type {import("./main").Options} */\nconst a = 1;\n',
			output: "/** @type {Options} */\nconst a = 1;\n",
			filename,
			options: inline,
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// With `extension: "always"` the new tag names the file
			code: '/** @type {import("./Foo").Bar} */\nconst a = 1;\n',
			output:
				'/** @import { Bar } from "./Foo.js" */\n\n/** @type {Bar} */\nconst a = 1;\n',
			filename,
			options: [{ inline: true, extension: "always" }],
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// After a license comment, before everything else
			code: '/*\n\tMIT License\n*/\n\n/** @type {import("x").Y} */\nmodule.exports = 1;\n',
			output:
				'/*\n\tMIT License\n*/\n\n/** @import { Y } from "x" */\n\n/** @type {Y} */\nmodule.exports = 1;\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// A typedef specializing the import of its own name
			code: '/** @typedef {import("./ObjectMiddleware").Context<[boolean]>} Context */\n',
			output:
				'/** @import { Context as GenericContext } from "./ObjectMiddleware" */\n\n/** @typedef {GenericContext<[boolean]>} Context */\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// `Function` is JSDoc's own; a used global is not shadowed either
			code: '/**\n * @param {import("estree").Function} a\n * @param {import("estree").Node} b\n * @param {Node} c\n */\nconst f = (a, b, c) => a;\n',
			output:
				'/** @import { Function as EstreeFunction, Node as EstreeNode } from "estree" */\n\n/**\n * @param {EstreeFunction} a\n * @param {EstreeNode} b\n * @param {Node} c\n */\nconst f = (a, b, c) => a;\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }, { messageId: "inlineImport" }],
		},
		{
			// `regexp` is JSDoc's spelling of `RegExp`, so a module named so is not
			code: '/** @type {typeof import("./regexp") | null} */\nlet validator = null;\n',
			output:
				'/** @import regexpModule from "./regexp" */\n\n/** @type {typeof regexpModule | null} */\nlet validator = null;\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// A template's constraint and default
			code: '/**\n * @template {import("./Foo")} [T=import("./Foo")]\n * @param {T} value\n */\nconst f = (value) => value;\n',
			output:
				'/** @import Foo from "./Foo" */\n\n/**\n * @template {Foo} [T=Foo]\n * @param {T} value\n */\nconst f = (value) => value;\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }, { messageId: "inlineImport" }],
		},
		{
			// Plain alias typedefs, several in a block or generic over their own
			// template names, become imports
			code: '"use strict";\n\n/**\n * @typedef {import("a").A} A\n * @typedef {import("b").B} Bee\n */\n\n/**\n * @template T, U\n * @typedef {import("tapable").Hook<T, U>} Hook\n */\n\n/** @type {A | Bee | Hook<1, 2>} */\nconst a = 1;\n',
			output:
				'"use strict";\n\n/** @import { A } from "a" */\n/** @import { B as Bee } from "b" */\n/** @import { Hook } from "tapable" */\n\n/** @type {A | Bee | Hook<1, 2>} */\nconst a = 1;\n',
			options: inline,
			errors: [
				{ messageId: "preferImportTag", data: { alias: "A" } },
				{ messageId: "preferImportTag", data: { alias: "Bee" } },
				{ messageId: "preferImportTag", data: { alias: "Hook" } },
			],
		},
		{
			// `typedefs: false` keeps a module's typedefs, which are its exports
			code: '/** @typedef {import("estree").Node} Node */\n\n/** @param {import("estree").Program} p */\nconst f = (p) => p;\n',
			output:
				'/** @import { Program } from "estree" */\n\n/** @typedef {import("estree").Node} Node */\n\n/** @param {Program} p */\nconst f = (p) => p;\n',
			options: [{ inline: true, typedefs: false }],
			errors: [{ messageId: "inlineImport" }],
		},
		{
			// `aliases.js` imports `Root` and aliases `Baz` without exporting either
			code: '/** @import { Root } from "./aliases" */\n\n/** @type {Root | import("./aliases").Baz} */\nconst a = 1;\n',
			output:
				'/** @import { Bar } from "./Foo" */\n/** @import { Program as Root } from "estree" */\n\n/** @type {Root | Bar} */\nconst a = 1;\n',
			filename,
			options: inline,
			errors: [{ messageId: "importedAlias" }, { messageId: "inlineImport" }],
		},
		{
			// A kept typedef is pointed at where the name comes from
			code: '/** @typedef {import("./aliases").Root} Root */\n',
			output: '/** @typedef {import("estree").Program} Root */\n',
			filename,
			options: [{ inline: true, typedefs: false }],
			errors: [{ messageId: "aliasedImport", data: { origin: "estree" } }],
		},
		{
			// No name is safe for `Node`, so only `Program` is fixed
			code: '/**\n * @param {import("estree").Node} a\n * @param {import("estree").Program} b\n * @param {Node | EstreeNode} c\n */\nconst f = (a, b, c) => a;\n',
			output:
				'/** @import { Program } from "estree" */\n\n/**\n * @param {import("estree").Node} a\n * @param {Program} b\n * @param {Node | EstreeNode} c\n */\nconst f = (a, b, c) => a;\n',
			options: inline,
			errors: [{ messageId: "inlineImport" }, { messageId: "inlineImport" }],
		},
	],
});

// A directive that only covers what the fix leaves alone stays in use
new RuleTester({
	languageOptions: { ecmaVersion: 2024, sourceType: "commonjs" },
	linterOptions: { reportUnusedDisableDirectives: "error" },
}).run("prefer-import-tag", rule, {
	valid: [
		{
			code: '/* eslint-disable rule-to-test/prefer-import-tag -- re-exported */\n/** @typedef {import("estree").Node} Node */\n/* eslint-enable rule-to-test/prefer-import-tag */\n',
			options: [{ inline: true }],
		},
	],
	invalid: [],
});
