/** @typedef {import("jsonc-eslint-parser").AST.JSONExpression} JSONExpression */
/** @typedef {import("jsonc-eslint-parser").AST.JSONNode} JSONNode */
/** @typedef {import("jsonc-eslint-parser").AST.JSONObjectExpression} JSONObjectExpression */
/** @typedef {import("jsonc-eslint-parser").AST.JSONProgram} JSONProgram */
/** @typedef {import("jsonc-eslint-parser").AST.JSONProperty} JSONProperty */

// Keep in sync with the keywords `webpack/tooling` knows how to compile into
// declarations and validators - an unknown one is silently dropped there.
const ALLOWED_KEYWORDS = new Set([
	"definitions",
	"$ref",
	"$id",
	"title",
	"cli",
	"items",
	"implements",
	"properties",
	"additionalProperties",
	"type",
	"oneOf",
	"anyOf",
	"absolutePath",
	"undefinedAsNull",
	"description",
	"enum",
	"minLength",
	"pattern",
	"minimum",
	"maximum",
	"required",
	"uniqueItems",
	"minItems",
	"minProperties",
	"instanceof",
	"tsType",
	"not",
	"link",
	"deprecated",
	"experimental",
	"added",
]);

const COMBINATOR_KEYWORDS = ["oneOf", "anyOf", "allOf"];

const DESCRIPTION_REGEXP = /^[A-Z`].*[^.]\.$/;

/**
 * @param {JSONProperty} property property node
 * @returns {string} name of the keyword the property declares
 */
function getKeywordName(property) {
	const { key } = property;

	return key.type === "JSONIdentifier" ? key.name : String(key.value);
}

/**
 * @param {JSONExpression | null} node schema node
 * @param {string} name keyword name
 * @returns {JSONProperty | undefined} property declaring the keyword
 */
function getKeyword(node, name) {
	if (!node || node.type !== "JSONObjectExpression") {
		return undefined;
	}

	return node.properties.find((property) => getKeywordName(property) === name);
}

/**
 * @param {JSONExpression | null | undefined} node schema node
 * @param {string} expected expected string value
 * @returns {boolean} whether the node is exactly that string literal
 */
function isStringLiteral(node, expected) {
	return Boolean(
		node && node.type === "JSONLiteral" && node.value === expected,
	);
}

/**
 * A schema that only points at another one carries its description there.
 * @param {JSONExpression | null} node schema node
 * @returns {boolean} whether the node is a plain reference
 */
function isReference(node) {
	if (getKeyword(node, "$ref")) {
		return true;
	}

	const oneOf = getKeyword(node, "oneOf");

	return Boolean(
		oneOf &&
		oneOf.value.type === "JSONArrayExpression" &&
		oneOf.value.elements.length === 1 &&
		getKeyword(oneOf.value.elements[0], "$ref"),
	);
}

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		/**
		 * @param {JSONExpression | null} node schema node
		 * @param {JSONNode} target node the diagnostic points at
		 * @returns {void}
		 */
		function validateDescription(node, target) {
			if (isReference(node)) {
				return;
			}

			const description = getKeyword(node, "description");
			const value = description && description.value;

			if (
				!value ||
				value.type !== "JSONLiteral" ||
				typeof value.value !== "string" ||
				value.value.length === 0
			) {
				context.report({ loc: target.loc, messageId: "missingDescription" });

				return;
			}

			if (!DESCRIPTION_REGEXP.test(value.value)) {
				context.report({ loc: value.loc, messageId: "invalidDescription" });
			}
		}

		/**
		 * @param {JSONExpression | null} node schema node
		 * @returns {void}
		 */
		function walk(node) {
			if (!node || node.type !== "JSONObjectExpression") {
				return;
			}

			const hasRef = Boolean(getKeyword(node, "$ref"));

			for (const property of node.properties) {
				const name = getKeywordName(property);

				if (!ALLOWED_KEYWORDS.has(name)) {
					context.report({
						data: { keyword: name },
						loc: property.key.loc,
						messageId: "unknownKeyword",
					});
				}

				if (hasRef && name !== "$ref") {
					context.report({
						data: { keyword: name },
						loc: property.key.loc,
						messageId: "refWithOtherKeywords",
					});
				}
			}

			const type = getKeyword(node, "type");

			if (
				type &&
				(type.value.type !== "JSONLiteral" ||
					typeof type.value.value !== "string")
			) {
				context.report({ loc: type.value.loc, messageId: "multipleTypes" });
			}

			const instanceOf = getKeyword(node, "instanceof");

			if (instanceOf && !getKeyword(node, "tsType")) {
				context.report({
					loc: instanceOf.key.loc,
					messageId: "instanceofRequiresTsType",
				});
			}

			const absolutePath = getKeyword(node, "absolutePath");

			if (absolutePath && !isStringLiteral(type && type.value, "string")) {
				context.report({
					loc: absolutePath.key.loc,
					messageId: "absolutePathRequiresStringType",
				});
			}

			const properties = getKeyword(node, "properties");
			const additionalProperties = getKeyword(node, "additionalProperties");

			for (const keyword of [properties, additionalProperties]) {
				if (keyword && !isStringLiteral(type && type.value, "object")) {
					context.report({
						data: { keyword: getKeywordName(keyword) },
						loc: keyword.key.loc,
						messageId: "objectKeywordRequiresObjectType",
					});
				}
			}

			for (const name of COMBINATOR_KEYWORDS) {
				const keyword = getKeyword(node, name);

				if (!keyword || keyword.value.type !== "JSONArrayExpression") {
					continue;
				}

				const { elements } = keyword.value;

				if (elements.length === 0) {
					context.report({
						data: { keyword: name },
						loc: keyword.key.loc,
						messageId: "emptyCombinator",
					});
				} else if ((elements.length === 1) !== (name === "oneOf")) {
					context.report({
						data: { keyword: name },
						loc: keyword.key.loc,
						messageId:
							name === "oneOf" ? "oneOfSingleItem" : "combinatorMultipleItems",
					});
				}

				for (const element of elements) {
					if (!element) {
						continue;
					}

					if (COMBINATOR_KEYWORDS.some((other) => getKeyword(element, other))) {
						context.report({
							loc: element.loc,
							messageId: "nestedCombinator",
						});
					}

					walk(element);
				}
			}

			const items = getKeyword(node, "items");

			if (items) {
				validateDescription(items.value, items.key);
				walk(items.value);
			}

			const definitions = getKeyword(node, "definitions");

			if (definitions && definitions.value.type === "JSONObjectExpression") {
				for (const definition of definitions.value.properties) {
					validateDescription(definition.value, definition.key);
					walk(definition.value);
				}
			}

			if (properties) {
				if (!additionalProperties) {
					context.report({
						loc: properties.key.loc,
						messageId: "missingAdditionalProperties",
					});
				}

				if (properties.value.type === "JSONObjectExpression") {
					for (const property of properties.value.properties) {
						validateDescription(property.value, property.key);
						walk(property.value);
					}
				}
			}

			if (
				additionalProperties &&
				additionalProperties.value.type === "JSONObjectExpression"
			) {
				validateDescription(
					additionalProperties.value,
					additionalProperties.key,
				);
				walk(additionalProperties.value);
			}
		}

		return {
			"Program:exit"() {
				const { ast } = context.sourceCode;
				const program =
					/** @type {JSONProgram} */
					(/** @type {unknown} */ (ast));
				const [statement] = program.body;

				if (!statement || statement.type !== "JSONExpressionStatement") {
					return;
				}

				walk(statement.expression);
			},
		};
	},
	meta: {
		docs: {
			category: "Possible Errors",
			description: "Enforce webpack's conventions for JSON schema files",
			recommended: false,
		},
		messages: {
			absolutePathRequiresStringType:
				'When using "absolutePath", "type" must be "string".',
			combinatorMultipleItems: '"{{keyword}}" must have more than one item.',
			emptyCombinator: '"{{keyword}}" must not be empty.',
			instanceofRequiresTsType:
				'When using "instanceof", "tsType" is required.',
			invalidDescription:
				"Description should start with an uppercase letter and end with a single dot.",
			missingAdditionalProperties:
				'Should have "additionalProperties" set to some value when describing "properties".',
			missingDescription: "Should have a description set.",
			multipleTypes: 'Should have a single "type".',
			nestedCombinator: 'Should not double nest "oneOf"/"anyOf"/"allOf".',
			objectKeywordRequiresObjectType:
				'When using "{{keyword}}", "type" must be "object".',
			oneOfSingleItem: '"oneOf" must have exactly one item.',
			refWithOtherKeywords:
				'When using "$ref" no other properties are possible, but found "{{keyword}}".',
			unknownKeyword: 'Unexpected keyword "{{keyword}}".',
		},
		schema: [],
		type: "problem",
	},
};
