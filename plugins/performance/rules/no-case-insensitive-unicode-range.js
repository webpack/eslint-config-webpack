import { findVariable, getStaticValue } from "@eslint-community/eslint-utils";
import { RegExpParser, visitRegExpAST } from "@eslint-community/regexpp";

/** @typedef {import("estree").Node} Node */
/** @typedef {import("eslint").Scope.Scope} Scope */
/** @typedef {import("estree").CallExpression | import("estree").NewExpression} RegExpCall */

const parser = new RegExpParser();

/** @typedef {{ messageId: "range" | "property", raw: string }} FoldedPart */

/**
 * The first part of a case-insensitive pattern V8 has to case-fold at compile
 * time: a class range reaching past ASCII, or a Unicode property escape.
 * @param {string} pattern regex source
 * @param {string} flags regex flags
 * @returns {FoldedPart | undefined} the offending part, if any
 */
const findFoldedRange = (pattern, flags) => {
	/** @type {import("@eslint-community/regexpp").AST.Pattern} */
	let ast;

	try {
		ast = parser.parsePattern(pattern, 0, pattern.length, {
			unicode: flags.includes("u"),
			unicodeSets: flags.includes("v"),
		});
	} catch {
		return undefined;
	}

	/** @type {FoldedPart | undefined} */
	let found;

	visitRegExpAST(ast, {
		onCharacterClassRangeEnter(node) {
			if (found === undefined && node.max.value > 0x7f) {
				found = { messageId: "range", raw: node.raw };
			}
		},
		onCharacterSetEnter(node) {
			if (found === undefined && node.kind === "property") {
				found = { messageId: "property", raw: node.raw };
			}
		},
	});

	return found;
};

// A part whose value cannot be known stands in as a group that matches nothing
// in particular, so the constant parts around it still parse as one pattern.
const UNKNOWN = "(?:)";
const MAX_DEPTH = 8;

/**
 * The source a pattern argument builds, with every part that cannot be resolved
 * statically replaced by an empty group.
 * @param {Node} node pattern expression
 * @param {Scope} scope scope the expression is evaluated in
 * @param {number} depth how many constants were followed to get here
 * @returns {string} the approximate pattern
 */
const approximate = (node, scope, depth) => {
	const known = getStaticValue(node, scope);

	if (known !== null) {
		return typeof known.value === "string" ? known.value : UNKNOWN;
	}

	if (depth >= MAX_DEPTH) return UNKNOWN;

	if (node.type === "TemplateLiteral") {
		return node.quasis
			.map(
				(quasi, i) =>
					(quasi.value.cooked ?? "") +
					(i < node.expressions.length
						? approximate(
								/** @type {Node} */ (node.expressions[i]),
								scope,
								depth + 1,
							)
						: ""),
			)
			.join("");
	}

	if (
		node.type === "TaggedTemplateExpression" &&
		node.tag.type === "MemberExpression" &&
		node.tag.object.type === "Identifier" &&
		node.tag.object.name === "String" &&
		node.tag.property.type === "Identifier" &&
		node.tag.property.name === "raw"
	) {
		const { quasis, expressions } = node.quasi;

		return quasis
			.map(
				(quasi, i) =>
					quasi.value.raw +
					(i < expressions.length
						? approximate(
								/** @type {Node} */ (expressions[i]),
								scope,
								depth + 1,
							)
						: ""),
			)
			.join("");
	}

	if (node.type === "BinaryExpression" && node.operator === "+") {
		return (
			approximate(/** @type {Node} */ (node.left), scope, depth + 1) +
			approximate(node.right, scope, depth + 1)
		);
	}

	if (node.type === "Identifier") {
		const variable = findVariable(scope, node);
		const definition =
			variable?.defs.length === 1 ? variable.defs[0] : undefined;

		if (
			definition?.type === "Variable" &&
			definition.parent.kind === "const" &&
			definition.node.init
		) {
			return approximate(definition.node.init, scope, depth + 1);
		}
	}

	return UNKNOWN;
};

/** @type {import("eslint").Rule.RuleModule} */
export const rule = {
	create(context) {
		const { sourceCode } = context;

		/**
		 * @param {Node} node node to report
		 * @param {string} pattern regex source
		 * @param {string} flags regex flags
		 * @returns {void}
		 */
		const check = (node, pattern, flags) => {
			if (!flags.includes("i")) return;

			const part = findFoldedRange(pattern, flags);

			if (part === undefined) return;

			context.report({
				node,
				messageId: part.messageId,
				data: { range: part.raw },
			});
		};

		/**
		 * @param {RegExpCall} node `RegExp(…)` or `new RegExp(…)`
		 * @returns {void}
		 */
		const checkCall = (node) => {
			if (
				node.callee.type !== "Identifier" ||
				node.callee.name !== "RegExp" ||
				node.arguments.length < 2
			) {
				return;
			}

			const scope = sourceCode.getScope(node);
			const [patternNode, flagsNode] = node.arguments;
			const flags = getStaticValue(/** @type {Node} */ (flagsNode), scope);

			if (flags === null || typeof flags.value !== "string") return;

			check(
				node,
				approximate(/** @type {Node} */ (patternNode), scope, 0),
				flags.value,
			);
		};

		return {
			Literal(node) {
				if ("regex" in node && node.regex) {
					check(node, node.regex.pattern, node.regex.flags);
				}
			},
			CallExpression: checkCall,
			NewExpression: checkCall,
		};
	},
	meta: {
		docs: {
			category: "Performance",
			description:
				"Disallow the `i` flag on a regex whose character ranges reach past ASCII",
			recommended: true,
		},
		messages: {
			range:
				"`{{range}}` makes V8 case-fold the whole range when it compiles this case-insensitive regex. Spell the ASCII letters in both cases (`a-zA-Z`) and drop the `i` flag.",
			property:
				"`{{range}}` makes V8 case-fold the whole property when it compiles this case-insensitive regex. Drop the `i` flag, naming the cases to match in the property itself (`\\p{L}` rather than `\\p{Lu}`).",
		},
		schema: [],
		type: "suggestion",
	},
};
