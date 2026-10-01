import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Linter } from "eslint";
import configs from "../configs/typescript.js";

const RULES = [
	"jsdoc/require-next-type",
	"jsdoc/require-param-type",
	"jsdoc/require-throws-type",
	"jsdoc/require-yields-type",
];
const linter = new Linter({ configType: "flat" });

describe("jsdoc tag type requirements", () => {
	for (const comment of [
		"/**\n * @throws when the input is invalid\n */",
		"/**\n * @yields each item\n * @next a value sent back\n */",
		"/**\n * @param value the value\n */",
	]) {
		it(`allows an untyped tag in ${JSON.stringify(comment)}`, () => {
			const messages = linter.verify(
				`${comment}\nfunction* fn(value) {\n\tyield value;\n}\n`,
				[configs["typescript/jsdoc"]],
				"file.js",
			);
			assert.deepEqual(
				messages.filter((message) => RULES.includes(message.ruleId)),
				[],
			);
		});
	}
});
