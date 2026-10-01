import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Linter } from "eslint";
import configs from "../configs.js";

const linter = new Linter({ configType: "flat" });
const unformatted = "const value = {a:1};\nexport default value;\n";

/**
 * @param {import("eslint").Linter.Config[]} config config to lint with
 * @returns {import("eslint").Linter.LintMessage[]} `prettier/prettier` messages
 */
const lintPrettier = (config) =>
	linter
		.verify(unformatted, config, "file.mjs")
		.filter((message) => message.ruleId === "prettier/prettier");

describe("stylistic/prettier", () => {
	it("is not part of the recommended config", () => {
		assert.deepEqual(lintPrettier([configs["stylistic/recommended"]]), []);
	});

	it("is enabled by no config in the default preset", () => {
		assert.equal(
			configs.recommended.some(
				(config) => config.rules && "prettier/prettier" in config.rules,
			),
			false,
		);
	});

	it("reports unformatted code when extended", () => {
		assert.equal(
			lintPrettier([
				configs["stylistic/recommended"],
				configs["stylistic/prettier"],
			]).length,
			1,
		);
	});
});
