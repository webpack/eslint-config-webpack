import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Linter } from "eslint";
import configs from "../configs/typescript.js";

const RULE = "jsdoc/no-restricted-syntax";
const jsdocConfig = configs["typescript/jsdoc"];
const linter = new Linter({ configType: "flat" });

/**
 * @param {string} comment JSDoc block placed above a function
 * @returns {import("eslint").Linter.LintMessage[]} messages of the rule under test
 */
const lint = (comment) =>
	linter.verify(
		`${comment}\nfunction fn() {}\n`,
		[
			{
				...jsdocConfig,
				rules: { [RULE]: jsdocConfig.rules[RULE] },
			},
		],
		"file.js",
	);

describe(RULE, () => {
	for (const comment of [
		"/** @param {(a: string) => number} callback callback */",
		"/** @param {string=} arg optional argument */",
		"/** @returns {unknown} result */",
		"/** @param {object} options options */",
		"/** @typedef {object} Options */",
		"/** @typedef {{ a: number }} Options */",
	]) {
		it(`allows ${comment}`, () => {
			assert.deepEqual(lint(comment), []);
		});
	}

	for (const comment of [
		"/** @param {function(string): number} callback callback */",
		"/** @param {string} [arg] optional argument */",
		"/** @param {?} value value */",
		"/** @returns {Object} result */",
		"/** @typedef {{ a: Object }} Options */",
	]) {
		it(`reports ${comment}`, () => {
			const messages = lint(comment);
			assert.equal(messages.length, 1);
			assert.equal(messages[0].ruleId, RULE);
		});
	}
});
