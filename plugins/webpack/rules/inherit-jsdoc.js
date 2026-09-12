/** @typedef {import("eslint").Rule.RuleFixer} RuleFixer */
/** @typedef {import("eslint").Rule.Fix} Fix */
/** @typedef {import("estree").MethodDefinition} MethodDefinition */

// The TypeScript AST is reached through the parser services, which type them as
// `unknown` outside a TypeScript-aware parser.
// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} TSNode */

/**
 * Reads the first JSDoc block attached to a TypeScript node.
 * @param {TSNode} node the TypeScript node
 * @returns {TSNode | undefined} the JSDoc node when the node carries one
 */
function getJSDoc(node) {
	const { jsDoc } = node;

	return jsDoc && jsDoc.length > 0 ? jsDoc[0] : undefined;
}

/**
 * Drops the lines carrying one of the stripped tags and re-indents the block.
 * @param {string} text the JSDoc text of the base class method
 * @param {string} indent the indentation of the overriding method
 * @param {string[]} stripTags tag names to drop, without the leading `@`
 * @returns {string} the JSDoc text as it must appear on the overriding method
 */
function rewriteJSDoc(text, indent, stripTags) {
	const stripped = new Set(
		stripTags.map((tag) => new RegExp(`^\\s*\\*\\s*@${tag}\\b`)),
	);
	const lines = text.replaceAll(/\r\n?/g, "\n").split("\n");

	return lines
		.filter(
			(line, index) =>
				index === 0 || ![...stripped].some((regexp) => regexp.test(line)),
		)
		.map((line, index) =>
			index === 0 ? line : `${indent} ${line.trimStart()}`,
		)
		.join("\n");
}

/**
 * Finds the method of the same name on a base class of the given class.
 * @param {TSNode} typeChecker the TypeScript type checker
 * @param {TSNode} classNode the TypeScript class declaration or expression
 * @param {string} memberName the name of the overriding method
 * @param {number} memberKind the syntax kind a base declaration must share
 * @returns {TSNode | undefined} the base class method declaration when found
 */
function findInBaseClass(typeChecker, classNode, memberName, memberKind) {
	const classSymbol = classNode.name
		? typeChecker.getSymbolAtLocation(classNode.name)
		: classNode.symbol;

	if (!classSymbol) {
		return undefined;
	}

	const baseTypes =
		typeChecker.getDeclaredTypeOfSymbol(classSymbol).getBaseTypes() || [];

	for (const baseType of baseTypes) {
		// `getProperty` walks the whole base chain, so an override three classes
		// down from the documented method still resolves.
		const property = baseType.getProperty(memberName);
		const declaration =
			property && property.declarations && property.declarations[0];

		// A method declared in a `.d.ts` is `Object.toString` or `Set.add`, whose
		// JSDoc documents the standard library rather than this class hierarchy.
		if (
			declaration &&
			declaration.kind === memberKind &&
			!declaration.getSourceFile().isDeclarationFile &&
			getJSDoc(declaration)
		) {
			return declaration;
		}
	}

	return undefined;
}

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		const { sourceCode } = context;
		const services = sourceCode.parserServices;

		if (!services || !services.program || !services.esTreeNodeToTSNodeMap) {
			return {};
		}

		const { stripTags = ["abstract"] } = context.options[0] || {};
		const typeChecker = services.program.getTypeChecker();

		return {
			MethodDefinition(node) {
				// Getters and setters are left alone: their JSDoc documents the
				// value, which an override is free to describe differently.
				if (node.static || node.computed || node.kind !== "method") {
					return;
				}

				const member = services.esTreeNodeToTSNodeMap.get(node);

				if (!member || !member.parent) {
					return;
				}

				const memberName = member.name.getText();
				const baseMember = findInBaseClass(
					typeChecker,
					member.parent,
					memberName,
					member.kind,
				);

				if (!baseMember) {
					return;
				}

				const start = member.getStart();
				const [indent] = /** @type {RegExpMatchArray} */ (
					sourceCode.lines[sourceCode.getLocFromIndex(start).line - 1].match(
						/^\s*/,
					)
				);
				const expected = rewriteJSDoc(
					getJSDoc(baseMember).getText(),
					indent,
					stripTags,
				);
				const currentJSDoc = getJSDoc(member);

				if (!currentJSDoc) {
					context.report({
						/** @type {(fixer: RuleFixer) => Fix} */
						fix: (fixer) =>
							fixer.insertTextBeforeRange(
								[start, start],
								`${expected}\n${indent}`,
							),
						messageId: "missing",
						node: /** @type {MethodDefinition} */ (node).key,
					});

					return;
				}

				const current = currentJSDoc.getText().replaceAll(/\r\n?/g, "\n");

				if (current === expected) {
					return;
				}

				context.report({
					/** @type {(fixer: RuleFixer) => Fix} */
					fix: (fixer) =>
						fixer.replaceTextRange(
							[currentJSDoc.getStart(), currentJSDoc.getEnd()],
							expected,
						),
					messageId: "outdated",
					node: /** @type {MethodDefinition} */ (node).key,
				});
			},
		};
	},
	meta: {
		docs: {
			category: "Best Practices",
			description:
				"Require a method to carry the JSDoc of the method it overrides",
			recommended: false,
		},
		fixable: "code",
		messages: {
			missing:
				"Expected the JSDoc of the base class method, this method overrides it.",
			outdated:
				"Expected this JSDoc to match the base class method it overrides.",
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					stripTags: {
						items: { type: "string" },
						type: "array",
					},
				},
				type: "object",
			},
		],
		type: "suggestion",
	},
};
