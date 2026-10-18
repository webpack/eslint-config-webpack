import fs from "node:fs";
import path from "node:path";
import { findVariable } from "@eslint-community/eslint-utils";

/** @typedef {import("estree").Node} Node */
/** @typedef {import("estree").Expression} Expression */
/** @typedef {import("estree").CallExpression} CallExpression */
/** @typedef {import("eslint").Scope.Scope} Scope */

const SCHEMA_UTILS = "schema-utils";

/**
 * @typedef {object} ValidationApi
 * @property {string} name how the call is named in the report
 * @property {number} checkIndex position of the check among the arguments
 */

/** @type {Record<"plugin" | "loader" | "schemaUtils", ValidationApi>} */
const APIS = {
	plugin: {
		name: "compiler.validate(schema, options, configuration, check)",
		checkIndex: 3,
	},
	loader: { name: "this.getOptions(schema, check)", checkIndex: 1 },
	schemaUtils: {
		name: "validate(schema, options, configuration, check)",
		checkIndex: 3,
	},
};

/**
 * @param {Node} node node
 * @returns {string | undefined} name of an identifier or of the last property of a member chain
 */
const lastName = (node) => {
	if (node.type === "Identifier") return node.name;

	if (
		node.type === "MemberExpression" &&
		!node.computed &&
		node.property.type === "Identifier"
	) {
		return node.property.name;
	}

	return undefined;
};

/**
 * @param {Node | null | undefined} node node
 * @returns {string | undefined} the module a `require("…")` call loads
 */
const requiredModule = (node) => {
	if (
		node?.type === "CallExpression" &&
		node.callee.type === "Identifier" &&
		node.callee.name === "require" &&
		node.arguments.length === 1 &&
		node.arguments[0].type === "Literal" &&
		typeof node.arguments[0].value === "string"
	) {
		return node.arguments[0].value;
	}

	return undefined;
};

/**
 * @param {Node | null | undefined} node node
 * @returns {string | undefined} the module an `await import("…")` loads
 */
const importedModule = (node) => {
	const expression = node?.type === "AwaitExpression" ? node.argument : node;

	if (
		expression?.type === "ImportExpression" &&
		expression.source.type === "Literal" &&
		typeof expression.source.value === "string"
	) {
		return expression.source.value;
	}

	return undefined;
};

/**
 * @param {Node | null | undefined} node node
 * @returns {string | undefined} the module a `require` or dynamic `import` loads
 */
const loadedModule = (node) => requiredModule(node) ?? importedModule(node);

/**
 * @typedef {object} Binding
 * @property {string} source module the binding comes from
 * @property {string | undefined} imported the export it is bound to, `undefined` for the whole module
 */

/**
 * Where a variable gets its value from when it is bound to a module or one of its exports.
 * @param {Scope} scope scope
 * @param {import("estree").Identifier} identifier identifier
 * @returns {Binding | undefined} binding
 */
const resolveBinding = (scope, identifier) => {
	const variable = findVariable(scope, identifier);

	if (!variable || variable.defs.length !== 1) return undefined;

	const [definition] = variable.defs;

	if (definition.type === "ImportBinding") {
		const source = /** @type {import("estree").ImportDeclaration} */ (
			definition.parent
		).source.value;

		if (typeof source !== "string") return undefined;

		const { node } = definition;

		if (node.type === "ImportSpecifier") {
			return {
				source,
				imported:
					node.imported.type === "Identifier"
						? node.imported.name
						: String(node.imported.value),
			};
		}

		// A default import of a CommonJS module is the whole module
		return { source, imported: undefined };
	}

	if (definition.type !== "Variable") return undefined;

	const { id, init } = definition.node;
	const source = loadedModule(init);

	if (source === undefined) {
		// `const { validate } = schemaUtils`
		if (id.type === "ObjectPattern" && init?.type === "Identifier") {
			const parent = resolveBinding(scope, init);

			if (parent && parent.imported === undefined) {
				const property = id.properties.find(
					(item) =>
						item.type === "Property" &&
						item.value.type === "Identifier" &&
						item.value.name === identifier.name,
				);

				if (
					property?.type === "Property" &&
					!property.computed &&
					property.key.type === "Identifier"
				) {
					return { source: parent.source, imported: property.key.name };
				}
			}
		}

		return undefined;
	}

	if (id.type === "Identifier") return { source, imported: undefined };

	if (id.type === "ObjectPattern") {
		const property = id.properties.find(
			(item) =>
				item.type === "Property" &&
				item.value.type === "Identifier" &&
				item.value.name === identifier.name,
		);

		if (
			property?.type === "Property" &&
			!property.computed &&
			property.key.type === "Identifier"
		) {
			return { source, imported: property.key.name };
		}
	}

	return undefined;
};

/**
 * @param {Scope} scope scope
 * @param {Node} node expression
 * @returns {boolean} true when the expression is the `schema-utils` module itself
 */
const isSchemaUtilsModule = (scope, node) => {
	if (loadedModule(node) === SCHEMA_UTILS) return true;

	if (node.type === "Identifier") {
		const binding = resolveBinding(scope, node);

		return (
			binding !== undefined &&
			binding.source === SCHEMA_UTILS &&
			binding.imported === undefined
		);
	}

	return false;
};

/**
 * Which validation API a call is, if any.
 * @param {Scope} scope scope
 * @param {CallExpression} node call
 * @returns {ValidationApi | undefined} api
 */
const getApi = (scope, node) => {
	const { callee } = node;

	if (callee.type === "Identifier") {
		const binding = resolveBinding(scope, callee);

		return binding?.source === SCHEMA_UTILS && binding.imported === "validate"
			? APIS.schemaUtils
			: undefined;
	}

	if (
		callee.type !== "MemberExpression" ||
		callee.computed ||
		callee.property.type !== "Identifier"
	) {
		return undefined;
	}

	const { object } = callee;

	switch (callee.property.name) {
		case "validate": {
			if (isSchemaUtilsModule(scope, object)) return APIS.schemaUtils;

			const name = lastName(object);

			// `compiler.validate`, `this.compiler.validate`, `childCompiler.validate`
			return name !== undefined && /compiler$/i.test(name)
				? APIS.plugin
				: undefined;
		}
		case "getOptions": {
			// `this.getOptions` in a loader, or the loader context passed around
			if (object.type === "ThisExpression") return APIS.loader;

			const name = lastName(object);

			return name !== undefined &&
				/^(?:loaderContext|loaderCtx|ctx)$/i.test(name)
				? APIS.loader
				: undefined;
		}
		default:
			return undefined;
	}
};

/**
 * The relative `.json` file a schema argument is loaded from.
 * @param {Scope} scope scope
 * @param {Node} node schema argument
 * @returns {{ request: string, required: boolean } | undefined} request of the schema file and whether it is loaded with `require`
 */
const getSchemaRequest = (scope, node) => {
	// `() => require("./options.json")`, a schema loaded on demand
	if (
		node.type === "ArrowFunctionExpression" &&
		node.body.type !== "BlockStatement"
	) {
		return getSchemaRequest(scope, node.body);
	}

	const required = requiredModule(node);

	if (required !== undefined) return { request: required, required: true };

	if (node.type === "Identifier") {
		const variable = findVariable(scope, node);

		if (!variable || variable.defs.length !== 1) return undefined;

		const [definition] = variable.defs;

		if (
			definition.type === "ImportBinding" &&
			definition.node.type === "ImportDefaultSpecifier"
		) {
			const source = /** @type {import("estree").ImportDeclaration} */ (
				definition.parent
			).source.value;

			return typeof source === "string"
				? { request: source, required: false }
				: undefined;
		}

		if (
			definition.type === "Variable" &&
			definition.node.id.type === "Identifier"
		) {
			const request = requiredModule(definition.node.init);

			return request === undefined ? undefined : { request, required: true };
		}
	}

	return undefined;
};

/** @type {import("eslint").Rule.RuleModule} */
export const rule = {
	create(context) {
		const { sourceCode } = context;

		return {
			CallExpression(node) {
				if (node.arguments.some((item) => item.type === "SpreadElement")) {
					return;
				}

				const scope = sourceCode.getScope(node);
				const api = getApi(scope, node);

				// No schema means no validation, `getOptions()` only parses the options
				if (!api || node.arguments.length === 0) return;
				if (node.arguments.length > api.checkIndex) return;

				const [schemaArgument] = node.arguments;
				const found = getSchemaRequest(
					scope,
					/** @type {Node} */ (schemaArgument),
				);
				// Only a schema file next to the code can be precompiled from here
				const schema =
					found !== undefined &&
					/^\.\.?\//.test(found.request) &&
					found.request.endsWith(".json")
						? found
						: undefined;
				const command =
					schema === undefined
						? "npx schema-utils precompile <schema.json>"
						: `npx schema-utils precompile ${path.posix.join(
								path.posix.dirname(
									path
										.relative(context.cwd, context.physicalFilename)
										.replaceAll("\\", "/"),
								),
								schema.request,
							)}`;

				/** @type {import("eslint").Rule.SuggestionReportDescriptor[]} */
				const suggest = [];
				const checkRequest =
					schema === undefined
						? undefined
						: `${schema.request.slice(0, -".json".length)}.check.js`;

				// An imported schema would need an import of the check added too
				if (
					schema?.required &&
					checkRequest !== undefined &&
					fs.existsSync(
						path.resolve(path.dirname(context.physicalFilename), checkRequest),
					)
				) {
					const missing = api.checkIndex - node.arguments.length;
					const lastArgument = node.arguments.at(-1);

					suggest.push({
						messageId: "useCheck",
						data: { check: checkRequest },
						fix: (fixer) =>
							fixer.insertTextAfter(
								lastArgument,
								`${", undefined".repeat(missing)}, require(${JSON.stringify(checkRequest)})`,
							),
					});
				}

				context.report({
					node,
					messageId: "missingCheck",
					data: { api: api.name, command },
					suggest,
				});
			},
		};
	},
	meta: {
		docs: {
			category: "Performance",
			description:
				"Require a precompiled check when validating options against a schema",
			recommended: true,
		},
		hasSuggestions: true,
		messages: {
			missingCheck:
				"Validating against a schema without a precompiled check loads `ajv` and compiles the schema on every start, about 150ms for the first one. Precompile it with `{{command}}` and pass the check: `{{api}}`.",
			useCheck: "Pass the precompiled check `{{check}}`.",
		},
		schema: [],
		type: "suggestion",
	},
};
