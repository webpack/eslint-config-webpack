import fs from "node:fs";
import path from "node:path";

/** @typedef {import("jsonc-eslint-parser").AST.JSONProgram} JSONProgram */
// A schema node holds arbitrary JSON, so its values have no narrower type.
// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {{ [key: string]: any }} Schema */

// Key order inside every schema object; anything absent sorts alphabetically
// after these.
const PROPERTIES = [
	"$ref",
	"definitions",
	"$id",
	"id",
	"title",
	"description",
	"type",
	"cli",
	"items",
	"minItems",
	"uniqueItems",
	"implements",
	"additionalProperties",
	"properties",
	"required",
	"minProperties",
	"oneOf",
	"anyOf",
	"allOf",
	"enum",
	"absolutePath",
	"undefinedAsNull",
	"minLength",
	"minimum",
	"instanceof",
	"tsType",
	"deprecated",
	"experimental",
	"added",
];

const TYPE_ORDER = [
	"array",
	"enum",
	"RegExp",
	"number",
	"boolean",
	"string",
	"object",
	"Function",
	undefined,
];

const NESTED_WITH_NAME = ["definitions", "properties"];

const NESTED_DIRECT = ["items", "additionalProperties", "not"];

const NESTED_ARRAY = ["oneOf", "anyOf", "allOf"];

const IMPLEMENTS_PREFIX = "#/definitions/";

/**
 * @typedef {object} Visitor
 * @property {((json: Schema, context: VisitContext) => Schema)=} schema schema visitor
 * @property {((json: Schema[], context: VisitContext) => Schema[])=} array array visitor
 * @property {((json: Schema, context: VisitContext) => Schema)=} object object visitor
 */

/**
 * @typedef {object} VisitContext
 * @property {Schema} schema the whole schema being processed
 * @property {Schema} definitions its definitions
 * @property {string} importPrefix prefix added to relative `tsType` imports
 */

/**
 * @param {Visitor} visitor visitor
 * @param {Schema} json schema node
 * @param {VisitContext} context visit context
 * @returns {Schema} the processed node
 */
function processSchema(visitor, json, context) {
	json = { ...json };
	if (visitor.schema) json = visitor.schema(json, context);

	for (const name of NESTED_WITH_NAME) {
		if (name in json && json[name] && typeof json[name] === "object") {
			if (visitor.object) json[name] = visitor.object(json[name], context);
			for (const key of Object.keys(json[name])) {
				json[name][key] = processSchema(visitor, json[name][key], context);
			}
		}
	}
	for (const name of NESTED_DIRECT) {
		if (name in json && json[name] && typeof json[name] === "object") {
			json[name] = processSchema(visitor, json[name], context);
		}
	}
	for (const name of NESTED_ARRAY) {
		if (name in json && Array.isArray(json[name])) {
			json[name] = [...json[name]];
			for (let i = 0; i < json[name].length; i++) {
				json[name][i] = processSchema(visitor, json[name][i], context);
			}
			if (visitor.array) json[name] = visitor.array(json[name], context);
		}
	}

	return json;
}

/**
 * @param {Schema} object object to sort
 * @returns {Schema} object with alphabetically sorted keys
 */
function sortObjectAlphabetically(object) {
	/** @type {Schema} */
	const result = {};
	for (const key of Object.keys(object).toSorted()) {
		result[key] = object[key];
	}
	return result;
}

/**
 * @param {Schema[]} array array to sort
 * @returns {Schema[]} the array ordered by the type each branch describes
 */
function sortArrayByType(array) {
	return array.toSorted((a, b) => {
		const aType = a.type || a.instanceof || (a.enum && "enum");
		const bType = b.type || b.instanceof || (b.enum && "enum");
		const aPosition = TYPE_ORDER.indexOf(aType);
		const bPosition = TYPE_ORDER.indexOf(bType);
		if (aPosition === bPosition) {
			return array.indexOf(a) - array.indexOf(b);
		}
		return aPosition - bPosition;
	});
}

/**
 * @param {Schema} object object to sort
 * @param {string[]} order keys to place first, in this order
 * @returns {Schema} object with its keys reordered
 */
function sortObjectWithList(object, order) {
	const rest = Object.keys(object)
		.filter((key) => !order.includes(key))
		.toSorted();
	/** @type {Schema} */
	const result = {};
	for (const key of order) {
		if (key in object) {
			result[key] = object[key];
		}
	}
	for (const key of rest) {
		result[key] = object[key];
	}
	return result;
}

/**
 * The base schemas are the ones sitting directly in the `schemas` directory;
 * the plugin schemas below it carry synced copies of their definitions.
 * @param {string} filename absolute path of the schema being linted
 * @returns {{ directory: string, depth: number } | undefined} the schema root
 */
function findSchemaRoot(filename) {
	const segments = filename.split(/[\\/]/);
	const index = segments.lastIndexOf("schemas");
	if (index === -1) {
		return undefined;
	}
	return {
		directory: segments.slice(0, index + 1).join(path.sep),
		depth: segments.length - index - 2,
	};
}

/**
 * @param {string} directory the `schemas` directory
 * @returns {Map<string, Schema>} definitions declared by the base schemas
 */
function readBaseDefinitions(directory) {
	/** @type {Map<string, Schema>} */
	const definitions = new Map();
	/** @type {string[]} */
	let entries;

	try {
		entries = fs.readdirSync(directory);
	} catch {
		return definitions;
	}

	for (const entry of entries) {
		if (!entry.endsWith(".json")) {
			continue;
		}
		try {
			const json = JSON.parse(
				fs.readFileSync(path.join(directory, entry), "utf8"),
			);
			for (const [name, schema] of Object.entries(json.definitions || {})) {
				definitions.set(name, /** @type {Schema} */ (schema));
			}
		} catch {
			continue;
		}
	}

	return definitions;
}

/**
 * @param {Schema} definition base definition
 * @param {string} importPrefix prefix to add to its relative imports
 * @returns {Schema} the definition as this schema's depth spells it
 */
function rebaseDefinition(definition, importPrefix) {
	return processSchema(
		{
			schema: (json) => {
				const { tsType } = json;
				if (!tsType) {
					return json;
				}
				return {
					...json,
					tsType: tsType.replaceAll("../", `${importPrefix}../`),
				};
			},
		},
		definition,
		/** @type {VisitContext} */ ({}),
	);
}

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		const root = findSchemaRoot(context.filename);

		if (!root) {
			return {};
		}

		return {
			"Program:exit"() {
				const { ast, text } = context.sourceCode;

				/** @type {Schema} */
				let json;
				/** @type {Schema} */
				let original;

				try {
					json = JSON.parse(text);
					original = JSON.parse(text);
				} catch {
					return;
				}

				const baseDefinitions = readBaseDefinitions(root.directory);
				const importPrefix = "../".repeat(root.depth);
				/** @type {(json: Schema, context: VisitContext) => Schema} */
				const format = (node, visitContext) => {
					node = sortObjectWithList(node, PROPERTIES);

					if (node.definitions) {
						node.definitions = { ...node.definitions };
						for (const key of Object.keys(node.definitions)) {
							const baseDefinition = baseDefinitions.get(key);
							if (baseDefinition) {
								node.definitions[key] = rebaseDefinition(
									baseDefinition,
									importPrefix,
								);
							}
						}
					}

					if (node.implements) {
						for (const implemented of [node.implements].flat()) {
							const name = implemented.startsWith(IMPLEMENTS_PREFIX)
								? implemented.slice(IMPLEMENTS_PREFIX.length)
								: undefined;
							const referenced = name
								? visitContext.definitions[name]
								: undefined;
							if (!referenced || typeof referenced.properties !== "object") {
								context.report({
									data: { implemented },
									loc: ast.loc,
									messageId: "unresolvedImplements",
								});
								continue;
							}
							node.properties = {
								...node.properties,
								...referenced.properties,
							};
						}
					}

					return node;
				};

				const formatted = processSchema(
					{
						array: sortArrayByType,
						object: sortObjectAlphabetically,
						schema: format,
					},
					json,
					{
						definitions: json.definitions,
						importPrefix,
						schema: json,
					},
				);
				// Compared by value, not by text: `prettier/prettier` owns the
				// whitespace and collapses what this fix writes expanded.
				if (JSON.stringify(formatted) === JSON.stringify(original)) {
					return;
				}

				const expected = `${JSON.stringify(formatted, null, 2)}\n`;

				context.report({
					fix(fixer) {
						return fixer.replaceText(ast, expected);
					},
					loc: ast.loc,
					messageId: "unformatted",
				});
			},
		};
	},
	meta: {
		docs: {
			category: "Stylistic Issues",
			description:
				"Keep schema keys ordered and shared definitions in sync with the base schema",
			recommended: false,
		},
		fixable: "code",
		messages: {
			unformatted:
				"Schema is not formatted. Run the ESLint auto-fixer to correct.",
			unresolvedImplements:
				'"implements": "{{implemented}}" does not name a definition with properties.',
		},
		schema: [],
		type: "layout",
	},
};
