import detectIndent from "detect-indent";
import { sortOrder } from "sort-package-json";

/** @typedef {import("jsonc-eslint-parser").AST.JSONProgram} JSONProgram */
/** @typedef {import("jsonc-eslint-parser").AST.JSONExpression} JSONExpression */
/** @typedef {import("jsonc-eslint-parser").AST.JSONObjectExpression} JSONObjectExpression */

/**
 * @param {string} string string
 * @returns {"\r\n" | "\n" | undefined} detected newline
 */
function detectNewline(string) {
	if (typeof string !== "string") {
		throw new TypeError("Expected a string");
	}

	const newlines = string.match(/(?:\r?\n)/g) || [];

	if (newlines.length === 0) {
		return;
	}

	const crlf = newlines.filter((newline) => newline === "\r\n").length;
	const lf = newlines.length - crlf;

	return crlf > lf ? "\r\n" : "\n";
}

/**
 * @param {string} string string
 * @returns {string} result
 */
function detectNewlineGraceful(string) {
	return detectNewline(string) || "\n";
}

/** @typedef {import("type-fest").PackageJson} PackageJson */

/**
 * @param {PackageJson} object object to sort
 * @param {string[] | ((a: string, b: string) => number)} sortWith function to sort
 * @returns {PackageJson} object with sorted properties
 */
function sortObjectKeys(object, sortWith) {
	let keys;
	let sortFn;

	if (typeof sortWith === "function") {
		sortFn = sortWith;
	} else {
		keys = sortWith;
	}
	const objectKeys =
		/** @type {(keyof PackageJson)[]} */
		(Object.keys(object));

	return (keys || objectKeys.toSorted(sortFn)).reduce((total, key) => {
		if (Object.hasOwn(object, key)) {
			total[key] = object[key];
		}

		return total;
	}, /** @type {PackageJson} */ (Object.create(null)));
}

/**
 * @param {string} filePath file path
 * @returns {boolean} result
 */
export const isPackageJson = (filePath) =>
	/(?:^|[/\\])package.json$/.test(filePath);

/**
 * @template {unknown[]} [Options=unknown[]]
 * @typedef {import("eslint").Rule.RuleContext} PackageJsonRuleContext
 * @property {Options} options options
 * @property {PackageJsonSourceCode} sourceCode source code
 */

/**
 * @template {unknown[]} Options
 * @typedef {object} PackageJsonRuleModule
 * @property {import("eslint").Rule.RuleMetaData} meta meta
 * @property {(context: PackageJsonRuleContext<Options>) => import("eslint").Rule.RuleListener} create function to create
 */

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		if (!isPackageJson(context.filename)) {
			return {};
		}

		return {
			"Program:exit"() {
				const { ast, text } = context.sourceCode;

				const options = {
					order: "sort-package-json",
					...context.options[0],
				};

				const requiredOrder =
					options.order === "sort-package-json"
						? sortOrder
						: /** @type {string[]} */ (options.order);

				/** @type {import("type-fest").PackageJson} */
				const json = JSON.parse(text);
				const orderedSource = sortObjectKeys(json, [
					...requiredOrder,
					...Object.keys(json),
				]);
				const orderedKeys = Object.keys(orderedSource);

				const { properties } =
					/** @type {JSONObjectExpression} */
					(
						/** @type {JSONProgram} */ (/** @type {unknown} */ (ast)).body[0]
							.expression
					);

				for (let i = 0; i < properties.length; i += 1) {
					const property = properties[i].key;
					// @ts-expect-error need improve types
					const { value } = property;

					if (value === orderedKeys[i]) {
						continue;
					}

					context.report({
						data: {
							property: value,
						},
						fix(fixer) {
							const { indent, type } = detectIndent(text);
							const endCharacters = text.endsWith("\n") ? "\n" : "";
							const newline = detectNewlineGraceful(text);
							let result =
								JSON.stringify(
									orderedSource,
									null,
									type === "tab" ? "\t" : indent,
								) + endCharacters;
							if (newline === "\r\n") {
								result = result.replaceAll("\n", newline);
							}

							return fixer.replaceText(context.sourceCode.ast, result);
						},
						loc: properties[i].loc,
						messageId: "incorrectOrder",
					});
				}
			},
		};
	},
	meta: {
		docs: {
			category: "Best Practices",
			description: "Package properties must be declared in standard order",
			recommended: true,
		},
		fixable: "code",
		messages: {
			incorrectOrder:
				'Package top-level property "{{property}}" is not ordered in the npm standard way. Run the ESLint auto-fixer to correct.',
		},
		schema: [
			{
				properties: {
					order: {
						anyOf: [
							{
								enum: ["sort-package-json"],
								type: ["string"],
							},
						],
					},
				},
				type: "object",
			},
		],
		type: "layout",
	},
};
