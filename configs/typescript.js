/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getRecommendedJSDocConfig() {
	let jsdocPlugin;

	try {
		jsdocPlugin = (await import("eslint-plugin-jsdoc")).default;
		// eslint-disable-next-line unicorn/prefer-optional-catch-binding
	} catch (_err) {
		// Nothing
	}

	const jsdocConfig =
		(jsdocPlugin &&
			jsdocPlugin.configs["flat/recommended-typescript-flavor-error"]) ||
		{};

	return {
		...jsdocConfig,
		name: "typescript/jsdoc",
		settings: {
			jsdoc: {
				mode: "typescript",
				// supported tags https://github.com/microsoft/TypeScript-wiki/blob/master/JSDoc-support-in-JavaScript.md
				tagNamePreference: {
					...["memberof", "yields", "member"].reduce((acc, tag) => {
						acc[tag] = {
							message: `@${tag} currently not supported in TypeScript`,
						};
						return acc;
					}, {}),
					extends: "extends",
					return: "returns",
					constructor: "constructor",
					prop: "property",
					property: "property",
					arg: "param",
					argument: "param",
					param: "param",
					augments: "extends",
					description: false,
					desc: false,
					inheritdoc: false,
					class: "constructor",
					returns: "returns",
				},
				overrideReplacesDocs: false,
			},
		},
		rules: {
			...jsdocConfig.rules,

			// From recommended
			// "jsdoc/check-access": "error",

			// From recommended
			// "jsdoc/check-alignment": "error",

			// No need
			// "jsdoc/check-examples": "error",

			"jsdoc/check-indentation": "error",

			"jsdoc/check-line-alignment": ["error", "never"],

			// From recommended
			// "jsdoc/check-param-names": "error",

			// From recommended
			// "jsdoc/check-property-names": "error",

			// No need
			// typescript does it
			// "jsdoc/check-syntax": "error",

			// From recommended
			// "jsdoc/check-tag-names": "error",

			// No need
			// "jsdoc/check-template-names": "error",

			// From recommended
			// "jsdoc/check-types": "error",

			// From recommended
			// "jsdoc/check-values": "error",

			// No need
			// "jsdoc/convert-to-jsdoc-comments": "error",

			// From recommended
			// "jsdoc/empty-tags": "error",

			// "jsdoc/implements-on-classes": "error",

			// No need
			// "jsdoc/informative-docs": "error",

			// No need
			// "jsdoc/lines-before-block": "error",

			// No need
			// "jsdoc/match-description": "error",

			// No need
			// "jsdoc/match-name": "error",

			// From recommended
			// "jsdoc/multiline-blocks": "error",

			"jsdoc/no-bad-blocks": "error",

			"jsdoc/no-blank-block-descriptions": "error",

			"jsdoc/no-blank-blocks": "error",

			// From recommended
			// "jsdoc/no-defaults": "error",

			// No need
			// "jsdoc/no-missing-syntax": "error",

			// From recommended
			// "jsdoc/no-multi-asterisks": "error",

			"jsdoc/no-restricted-syntax": [
				"error",
				{
					contexts: [
						// Prefer TypeScript syntax for functions
						{
							comment: "JsdocBlock:has(JsdocTypeFunction[arrow=false])",
							message:
								"Please use TypeScript syntax - `(a: string, b: boolean) => number`",
						},
						// Prefer `{string=}` over `{string} [arg]`
						{
							comment:
								"JsdocBlock:has(JsdocTag[tag=/^(property|param)$/][name=/[\\[\\]]/])",
							message:
								"Please use `@property {string=} property`/`@param {string=} arg` instead `[arg]` for optional properties and parameters",
						},
						// No `*` type
						{
							comment: "JsdocBlock:has(JsdocTypeAny)",
							message: "Please use `any` or `EXPECTED_ANY` type.",
						},
						// No `?` type
						{
							comment: "JsdocBlock:has(JsdocTypeUnknown)",
							message: "Please use `unknown` or `any` (or `EXPECTED_ANY`) type",
						},
						// No `any` type
						{
							comment: "JsdocBlock:has(JsdocTypeName[value=/^any$/])",
							message: "Please use provide types instead `any`",
						},
						// No `Function` type
						{
							comment:
								"JsdocBlock:has(JsdocTypeName[value=/^(function|Function)$/])",
							message:
								"Please use provide types for function  - `(a: number, b: number) -> number` instead `Function`/`function` or use `EXPECTED_FUNCTION` type",
						},
						// No `Object`
						{
							comment:
								"JsdocBlock:has(JsdocTag[tag!=/^(typedef|template|param)$/]:has(JsdocTypeName[value=/^(Object|object)$/]))",
							message:
								"Please use provide types for object  - `{ property: number:, result: () => number}` instead `Object`/`object` or use `EXPECTED_OBJECT` type",
						},
						{
							comment:
								"JsdocBlock:has(JsdocTag[tag=typedef][parsedType.type!=JsdocTypeName]:has(JsdocTypeName[value=/^(Object|object)$/]))",
							message:
								"Please use provide types for object  - `{ property: number:, result: () => number}` instead `Object`/`object` or use `EXPECTED_OBJECT` type",
						},
					],
				},
			],

			// No need
			// "jsdoc/no-types": "error",

			// No need
			// "jsdoc/no-undefined-types": "error",

			"jsdoc/require-asterisk-prefix": "error",

			// No need
			// "jsdoc/require-description": "error",

			// No need
			// "jsdoc/require-description-complete-sentence": "error",

			// No need
			// "jsdoc/require-example": "error",

			// No need
			// "jsdoc/require-file-overview": "error",

			// No need
			"jsdoc/require-hyphen-before-param-description": ["error", "never"],

			// From recommended
			// "jsdoc/require-jsdoc": "error",

			// From recommended
			// "jsdoc/require-param": "error",

			// From recommended
			// "jsdoc/require-param-description": "error",

			// From recommended
			// "jsdoc/require-param-name": "error",

			// From recommended
			// "jsdoc/require-param-type": "error",

			// From recommended
			// "jsdoc/require-property": "error",

			// From recommended
			// "jsdoc/require-property-description": "error",

			// From recommended
			// "jsdoc/require-property-name": "error",

			// From recommended
			// "jsdoc/require-property-type": "error",

			// A lot of false positive with loops/`switch`/`if`/etc
			"jsdoc/require-returns-check": "off",

			// From recommended
			// "jsdoc/require-returns-description": "error",

			// From recommended
			// "jsdoc/require-returns-type": "error",

			"jsdoc/require-template": "error",

			// No need
			// "jsdoc/require-throws": "error",

			// From recommended
			// "jsdoc/require-yields": "error",

			// From recommended
			// "jsdoc/require-yields-check": "error",

			// No need
			// "jsdoc/sort-tags": "error",

			// From recommended
			// "jsdoc/tag-lines": "error",

			// No need
			// "jsdoc/text-escaping": "error",

			// Doesn't support function overloading/tuples/`readonly`/module keyword/etc
			// Also `typescript` reports this itself
			"jsdoc/valid-types": "off",
		},
	};
}

export default {
	"typescript/jsdoc": await getRecommendedJSDocConfig(),
};
