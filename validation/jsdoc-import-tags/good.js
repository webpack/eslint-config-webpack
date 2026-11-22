/** @import { Linter, Rule as ESLintRule } from "eslint" */
/** @import ts from "typescript" */

/**
 * @param {Linter.Config} config config
 * @param {ESLintRule.RuleModule} rule rule
 * @param {ts.Node} node node
 * @returns {string} names
 */
export function describe(config, rule, node) {
	return `${config.name} ${String(rule.meta?.type)} ${node.kind}`;
}
