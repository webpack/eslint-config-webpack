import detectIndent from "detect-indent";
import { sortOrder } from "sort-package-json";

/**
 * @param {string} string string
 * @returns {"\r\n" | "\n"} detected newline
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

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {Record<string, any>} ObjectToSort */

/**
 * @param {ObjectToSort} object object to sort
 * @param {(a: number, b: number) => number} sortWith function to sort
 * @returns {ObjectToSort} object with sorted properties
 */
function sortObjectKeys(object, sortWith) {
	let keys;
	let sortFn;

	if (typeof sortWith === "function") {
		sortFn = sortWith;
	} else {
		keys = sortWith;
	}

	const objectKeys = Object.keys(object);

	return (keys || objectKeys.toSorted(sortFn)).reduce((total, key) => {
		if (Object.hasOwn(object, key)) {
			total[key] = object[key];
		}

		return total;
	}, Object.create(null));
}

/**
 * @param {string} filePath file path
 * @returns {boolean} result
 */
export const isPackageJson = (filePath) =>
	/(?:^|[/\\])package.json$/.test(filePath);

/* eslint-disable jsdoc/reject-any-type */
/**
 * @typedef {import("eslint").AST.Program} PackageJsonAst
 * @property {[any]} body body
 */
/* eslint-enable jsdoc/reject-any-type */

/**
 * @typedef {import("eslint").SourceCode} PackageJsonSourceCode
 * @property {PackageJsonAst} ast ast
 */

/**
 * @template {unknown[]} [Options=unknown[]]
 * @typedef {import("eslint").RuleContext} PackageJsonRuleContext
 * @property {Options} options options
 * @property {PackageJsonSourceCode} sourceCode source code
 */

/**
 * @template {unknown[]} Options
 * @typedef {object} PackageJsonRuleModule
 * @property {import("eslint").Rule.RuleMetaData} meta meta
 * @property {(context: PackageJsonRuleContext<Options>) => import("eslint").RuleListener} create function to create
 */

/**
 * @type {import("eslint").Rule} rule
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
					options.order === "sort-package-json" ? sortOrder : options.order;

				const json = JSON.parse(text);
				const orderedSource = sortObjectKeys(json, [
					...requiredOrder,
					...Object.keys(json),
				]);
				const orderedKeys = Object.keys(orderedSource);

				const { properties } = ast.body[0].expression;

				for (let i = 0; i < properties.length; i += 1) {
					const property = properties[i].key;
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
