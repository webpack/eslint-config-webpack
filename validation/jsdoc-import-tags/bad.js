/** @import { Linter } from "eslint" */
// eslint-disable-next-line webpack/no-duplicate-import-tag
/** @import { Rule } from "eslint" */
// eslint-disable-next-line webpack/no-unused-import-tag
/** @import { Program } from "estree" */
// eslint-disable-next-line webpack/prefer-import-tag
/** @typedef {import("typescript").Node} Node */

/**
 * @param {Linter.Config} config config
 * @param {Rule.RuleModule} rule rule
 * @param {Node} node node
 * @returns {string} names
 */
export function describe(config, rule, node) {
	return `${config.name} ${String(rule.meta?.type)} ${node.kind}`;
}
