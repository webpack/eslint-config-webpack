import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { ESLint } from "eslint";
import configs from "../configs.js";

// Linted from memory, so the file doesn't need to exist (`test/fixtures` is ignored)
const filePath = path.resolve(import.meta.dirname, "README.md");

const markdown = [
	"# Title",
	"",
	"### Skipped level",
	"",
	"#Missing space",
	"",
	"| a | b |",
	"| - | - |",
	"| 1 | 2 |",
	"",
	"- [x] task",
	"",
	"```js",
	"var value = 1;",
	"",
	"run(value);",
	"```",
	"",
].join("\n");

/**
 * @param {boolean} fix whether to fix problems
 * @param {string=} text Markdown to lint
 * @returns {Promise<import("eslint").ESLint.LintResult>} result for the document
 */
async function lint(fix, text = markdown) {
	const eslint = new ESLint({
		cwd: path.resolve(import.meta.dirname, ".."),
		overrideConfigFile: true,
		overrideConfig: configs.recommended.flat(),
		fix,
	});
	const [result] = await eslint.lintText(text, { filePath });

	return result;
}

describe("markdown/recommended", () => {
	it("lints Markdown content and code blocks in one run", async () => {
		const { messages } = await lint(false);

		assert.deepEqual(
			messages.map(({ ruleId, line }) => [ruleId, line]),
			[
				["markdown/heading-increment", 3],
				["markdown/no-missing-atx-heading-space", 5],
				["no-var", 14],
			],
		);
	});

	it("fixes Markdown content and code blocks in one run", async () => {
		const { output } = await lint(true);

		assert.ok(output);
		assert.match(output, /^# Missing space$/m);
		assert.match(output, /^const value = 1;$/m);
	});

	/**
	 * @param {string} code code of the `js` block
	 * @returns {string} Markdown with an `eslint-disable` comment before the block
	 */
	const withDirective = (code) =>
		[
			"# Title",
			"",
			"<!-- eslint-disable no-var -->",
			"",
			"```js",
			code,
			"",
			"run(value);",
			"```",
			"",
		].join("\n");

	it("keeps a directive the next code block uses", async () => {
		const text = withDirective("var value = 1;");

		assert.deepEqual((await lint(false, text)).messages, []);
		assert.equal((await lint(true, text)).output, undefined);
	});

	it("reports a directive the next code block doesn't use once", async () => {
		const { messages } = await lint(false, withDirective("const value = 1;"));

		assert.deepEqual(
			messages.map(({ ruleId, line, message }) => [
				ruleId,
				line,
				message.startsWith("Unused eslint-disable directive"),
			]),
			[[null, 3, true]],
		);
	});
});
