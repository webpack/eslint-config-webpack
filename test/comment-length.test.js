import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import { rule } from "../plugins/webpack/rules/comment-length.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

const errors = [{ messageId: "tooLong" }];

ruleTester.run("comment-length", rule, {
	valid: [
		"const a = 1;\n// one\n// two\n// three\nconst b = 2;",
		"const a = 1;\n/*\n one\n*/\nconst b = 2;",
		"const a = 1;\n/**\n * one\n * two\n * three\n * four\n */\nfunction b() {}",
		"/*\n license\n one\n two\n three\n*/\n\nconst a = 1;",
		'// one\n// two\n// three\n// four\n\n"use strict";\n\nconst a = 1;',
		"const a = 1;\n// WHY: one\n// two\n// three\n// four\nconst b = 2;",
		"const a = `\n// one\n// two\n// three\n// four\n`;",
		"const a = 1; /* one */\nconst b = 2;",
		"const a = 1; // one\n// two\n// three\n// four",
		"const a = 1;\n// one\n// two\nconst b = 2;\n// three\n// four\nconst c = 3;",
		{
			code: "const a = 1;\n// one\n// two\n// three\n// four\nconst b = 2;",
			options: [{ max: 4 }],
		},
	],
	invalid: [
		{
			code: "const a = 1;\n// one\n// two\n// three\n// four\nconst b = 2;",
			errors,
		},
		{ code: "const a = 1;\n/*\n one\n two\n three\n*/\nconst b = 2;", errors },
		{
			code: "const a = 1;\n// WHY not: one\n// two\n// three\n// four",
			errors,
		},
		{
			code: "const a = 1;\n// one\n// two\n// three\nconst b = 2;",
			options: [{ max: 2 }],
			errors,
		},
		{
			code: "const a = 1;\n// one\n// two\n// three\n// four\nconst b = 2;\n/*\n five\n six\n seven\n*/\nconst c = 3;",
			errors: [{ messageId: "tooLong" }, { messageId: "tooLong" }],
		},
	],
});
