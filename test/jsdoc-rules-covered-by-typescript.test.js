import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Linter } from "eslint";
import configs from "../configs/typescript.js";

const linter = new Linter({ configType: "flat" });

// Each case is reported by `tsc --strict` with `checkJs`, so the rule is off.
const cases = {
	"jsdoc/implements-on-classes":
		"/**\n * @implements {Iterable<number>}\n * @returns {number} result\n */\nfunction fn() {\n\treturn 1;\n}\n",
	"jsdoc/require-param-name":
		"/**\n * @param {string}\n * @returns {string} result\n */\nfunction fn(value) {\n\treturn value;\n}\n",
	"jsdoc/require-property-name":
		"/**\n * @typedef {object} Options\n * @property {string}\n */\n",
	"jsdoc/require-property-type":
		"/**\n * @typedef {object} Options\n * @property mode the mode\n */\n",
};

describe("jsdoc rules covered by TypeScript", () => {
	for (const [rule, code] of Object.entries(cases)) {
		it(`turns off ${rule}`, () => {
			const messages = linter.verify(
				code,
				[configs["typescript/jsdoc"]],
				"file.js",
			);
			assert.deepEqual(
				messages.filter((message) => message.ruleId === rule),
				[],
			);
		});
	}
});
