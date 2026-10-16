/* eslint-disable no-template-curly-in-string */
import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import { rule } from "../plugins/performance/rules/no-case-insensitive-unicode-range.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("no-case-insensitive-unicode-range", rule, {
	valid: [
		"/[a-z]+/i;",
		"/[a-zA-Z_\\u0080-\\uFFFF]+/;",
		"/[^a-z0-9_!§$()=\\-^°]+/gi;",
		"/é/i;",
		"/^[_\\p{L}][_0-9\\p{L}]*$/u;",
		'new RegExp("[a-z\\\\u0080-\\\\uFFFF]");',
		'new RegExp("[a-z]", "i");',
		'new RegExp(pattern, "i");',
		'new RegExp("[\\\\u0080-\\\\uFFFF]", flags);',
		'new RegExp("[", "i");',
		'const RegExp = function () {}; new RegExp("[\\\\u0080-\\\\uFFFF]");',
		'foo.RegExp("[\\\\u0080-\\\\uFFFF]", "i");',
		'let range = "[\\\\u0080-\\\\uFFFF]"; range = "a"; new RegExp(range, "i");',
	],
	invalid: [
		{
			code: "/^-?[a-z_\\u0080-\\uFFFF][\\w\\u0080-\\uFFFF-]*$/i;",
			errors: [{ messageId: "range", data: { range: "\\u0080-\\uFFFF" } }],
		},
		{
			code: "/[а-я]+/i;",
			errors: [{ messageId: "range", data: { range: "а-я" } }],
		},
		{
			code: "/^[_\\p{L}][_0-9\\p{L}]*$/iu;",
			errors: [{ messageId: "property", data: { range: "\\p{L}" } }],
		},
		{
			code: "/[\\P{Lu}]/iv;",
			errors: [{ messageId: "property", data: { range: "\\P{Lu}" } }],
		},
		{
			code: 'new RegExp("[\\\\u00A0-\\\\uFFFF]+", "gi");',
			errors: [{ messageId: "range" }],
		},
		{
			code: 'RegExp("[\\\\u00A0-\\\\uFFFF]+", "i");',
			errors: [{ messageId: "range" }],
		},
		{
			code: [
				"const IDENT = String.raw`(?:[-\\w\\u00A0-\\uFFFF]|\\\\[\\s\\S])+`;",
				'const SELECTOR = new RegExp(`^(?:${IDENT}\\\\s*)+$`, "i");',
			].join("\n"),
			errors: [{ messageId: "range", data: { range: "\\u00A0-\\uFFFF" } }],
		},
		{
			code: [
				'const NAMES = [...new Set(["a", "b"])].join("|");',
				"const IDENT = String.raw`[\\u00A0-\\uFFFF]+`;",
				'new RegExp(`:(?:${NAMES})` + IDENT, "i");',
			].join("\n"),
			errors: [{ messageId: "range", data: { range: "\\u00A0-\\uFFFF" } }],
		},
	],
});
