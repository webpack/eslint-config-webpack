import {
	javascriptExtensions,
	typescriptExtensions,
} from "./utils/extensions.js";

/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getTypescriptJSDocRecommendedConfig() {
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
		files: [
			`**/*.{${javascriptExtensions.map((item) => item.slice(1)).join(",")}}`,
		],
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

			// Avoid conflict with jest special comment
			"jsdoc/check-tag-names": [
				"error",
				{
					definedTags: ["jest-environment", "jest-environment-options"],
				},
			],

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

			// From recommended
			// "jsdoc/escape-inline-tags": "error",

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
						// No `?` type
						{
							comment: "JsdocBlock:has(JsdocTypeUnknown)",
							message: "Please use `unknown` or `any` (or `EXPECTED_ANY`) type",
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

			// TODO enable me in future
			// "jsdoc/prefer-import-tag": "error",

			"jsdoc/reject-any-type": "error",

			"jsdoc/reject-function-type": "error",

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

			// No need
			// "jsdoc/require-next-description":"error",

			// No need
			// "jsdoc/require-next-type": "error",

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

			// No need
			// "jsdoc/require-tags": "error",

			"jsdoc/require-template": "error",

			// No need
			// "jsdoc/require-template-description": "error",

			// No need
			// "jsdoc/require-throws": "error",

			// No need
			// "jsdoc/require-throws-description": "error",

			// No need
			// "jsdoc/require-throws-type": "error",

			// From recommended
			// "jsdoc/require-yields": "error",

			// No need
			// "jsdoc/require-yields-description": "error",

			// No need
			// "jsdoc/require-yields-type": "error",

			// From recommended
			// "jsdoc/require-yields-check": "error",

			// No need
			// "jsdoc/sort-tags": "error",

			// From recommended
			// "jsdoc/tag-lines": "error",

			// No need
			// "jsdoc/text-escaping": "error",

			"jsdoc/type-formatting": [
				"error",
				{
					objectTypeBracketSpacing: " ",
					objectFieldSeparator: "comma-and-linebreak",
					objectFieldSeparatorTrailingPunctuation: true,
					trailingPunctuationMultilineOnly: true,
				},
			],

			// Doesn't support function overloading/tuples/`readonly`/module keyword/etc
			// Also `typescript` reports this itself
			"jsdoc/valid-types": "off",
		},
	};
}

/**
 * @returns {Promise<Record<string, string>>} config
 */
async function getTypescriptRecommendedConfig() {
	let typescriptPlugin;

	try {
		typescriptPlugin = (await import("typescript-eslint")).default;
		// eslint-disable-next-line unicorn/prefer-optional-catch-binding
	} catch (_err) {
		// Nothing
	}

	const { configs } = typescriptPlugin || {
		configs: {
			base: { languageOptions: {} },
			eslintRecommended: {},
			recommended: [{ name: "typescript-eslint/recommended", rules: {} }],
			stylistic: [{ name: "typescript-eslint/stylistic", rules: {} }],
		},
	};
	const baseConfig = configs.base;
	const eslintRecommendedConfig = configs.eslintRecommended;
	const recommendedConfig = configs.recommended.find(
		(item) => item.name === "typescript-eslint/recommended",
	);
	const stylisticConfig = configs.stylistic.find(
		(item) => item.name === "typescript-eslint/stylistic",
	);

	const allExtensions = [...typescriptExtensions, ...javascriptExtensions];

	return {
		...baseConfig,
		name: "typescript/recommended",
		files: [
			`**/*.{${typescriptExtensions.map((item) => item.slice(1)).join(",")}}`,
		],
		ignores: ["**/*.d.ts"],
		languageOptions: {
			parser: baseConfig.languageOptions.parser,
		},
		plugins: {
			...baseConfig.plugins,
		},
		settings: {
			"import/extensions": allExtensions,
			"import/external-module-folders": ["node_modules", "node_modules/@types"],
			"import/parsers": {
				"@typescript-eslint/parser": typescriptExtensions,
			},
			"import/resolver": {
				node: {
					extensions: allExtensions,
				},
			},
		},
		rules: {
			...eslintRecommendedConfig.rules,
			...recommendedConfig.rules,
			...stylisticConfig.rules,

			// From recommended
			// "@typescript-eslint/adjacent-overload-signatures": "error",

			// From recommended
			// "@typescript-eslint/array-type": "error",

			// No need
			// "@typescript-eslint/await-thenable": "error",

			// From recommended
			// "@typescript-eslint/ban-ts-comment": "error",

			// From recommended
			// "@typescript-eslint/ban-tslint-comment": "error",

			// From recommended
			// "@typescript-eslint/class-literal-property-style": "error",

			// No need
			// "@typescript-eslint/class-methods-use-this": "error",

			// From recommended
			// "@typescript-eslint/consistent-generic-constructors": "error",

			// From recommended
			// "@typescript-eslint/consistent-indexed-object-style": "error",

			// No need
			// "@typescript-eslint/consistent-return": "error",

			// From recommended
			// "@typescript-eslint/consistent-type-assertions": "error",

			// From recommended
			// "@typescript-eslint/consistent-type-definitions": "error",

			// No need
			// "@typescript-eslint/consistent-type-exports": "error",

			// No need
			// "@typescript-eslint/consistent-type-imports": "error",

			// The same as `default-param-last`
			"default-param-last": "off",
			"@typescript-eslint/default-param-last": "error",

			// No need
			// we have `dot-notation`
			// "@typescript-eslint/dot-notation": "error",

			// No need
			// "@typescript-eslint/explicit-function-return-type": "error",

			"@typescript-eslint/explicit-member-accessibility": [
				"error",
				{ accessibility: "no-public" },
			],

			// No need
			// "@typescript-eslint/explicit-module-boundary-types": "error",

			// No need
			// "@typescript-eslint/init-declarations": "error",

			// No need
			// "@typescript-eslint/max-params": "error",

			// No need
			// "@typescript-eslint/member-ordering": "error",

			// No need
			// "@typescript-eslint/method-signature-style": "error",

			// No need
			// "@typescript-eslint/naming-convention": "error",

			// From recommended
			// "@typescript-eslint/no-array-constructor": "error",

			// No need
			// "@typescript-eslint/no-array-delete": "error",

			// No need
			// "@typescript-eslint/no-base-to-string": "error",

			// From recommended
			// "@typescript-eslint/no-confusing-non-null-assertion": "error",

			// No need
			// "@typescript-eslint/no-confusing-void-expression": "error",

			// No need
			// Good rule, but some packages can change their API often, and it will create noise in CI
			// "@typescript-eslint/no-deprecated": "error",

			// No need
			// "@typescript-eslint/no-dupe-class-members": "error",

			// From recommended
			// "@typescript-eslint/no-duplicate-enum-values": "error",

			// No need
			// "@typescript-eslint/no-dynamic-delete": "error",

			// From recommended
			// "@typescript-eslint/no-empty-function": "error",

			// From recommended
			// "@typescript-eslint/no-empty-object-type": "error",

			// From recommended
			// "@typescript-eslint/no-explicit-any": "error",

			// From recommended
			// "@typescript-eslint/no-extra-non-null-assertion": "error",

			// No need
			// "@typescript-eslint/no-extraneous-class": "error",

			// No need
			// "@typescript-eslint/no-floating-promises": "error",

			// No need
			// "@typescript-eslint/no-for-in-array": "error",

			// No need
			// "@typescript-eslint/no-implied-eval": "error",

			// No need
			// "@typescript-eslint/no-import-type-side-effects": "error",

			// From recommended
			// "@typescript-eslint/no-inferrable-types": "error",

			// No need
			// "@typescript-eslint/no-invalid-this": "error",

			// No need
			// "@typescript-eslint/no-invalid-void-type": "error",

			// The same as `no-loop-func`
			"no-loop-func": "off",
			"@typescript-eslint/no-loop-func": "error",

			// No need
			// "@typescript-eslint/no-magic-numbers": "error",

			// No need
			// "@typescript-eslint/no-meaningless-void-operator": "error",

			// From recommended
			// "@typescript-eslint/no-misused-new": "error",

			// No need
			// "@typescript-eslint/no-misused-promises": "error",

			// No need
			// "@typescript-eslint/no-misused-spread": "error",

			// No need
			// "@typescript-eslint/no-mixed-enums": "error",

			// No need
			// "@typescript-eslint/no-namespace": "error",

			// No need
			// "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",

			// From recommended
			// "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

			// No need
			// "@typescript-eslint/no-non-null-assertion": "error",

			// No need
			// "@typescript-eslint/no-redeclare": "error",

			// No need
			// "@typescript-eslint/no-redundant-type-constituents": "error",

			// Module system provided in `node/module`/`node/commonjs`/etc configurations
			"@typescript-eslint/no-require-imports": "off",

			// No need
			// "@typescript-eslint/no-restricted-imports": "error",

			// No need
			// "@typescript-eslint/no-restricted-types": "error",

			// No need
			// "@typescript-eslint/no-shadow": "error",

			// From recommended
			// "@typescript-eslint/no-this-alias": "error",

			// No need
			// "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",

			// "@typescript-eslint/no-unnecessary-condition": "error",

			"@typescript-eslint/no-unnecessary-parameter-property-assignment":
				"error",

			// No need
			// "@typescript-eslint/no-unnecessary-qualifier": "error",

			// No need
			// "@typescript-eslint/no-unnecessary-template-expression": "error",

			// No need
			// "@typescript-eslint/no-unnecessary-type-arguments": "error",

			// No need
			// "@typescript-eslint/no-unnecessary-type-assertion": "error",

			// From recommended
			// "@typescript-eslint/no-unnecessary-type-constraint": "error",

			// No need
			// "@typescript-eslint/no-unnecessary-type-conversion": "error",

			// No need
			// "@typescript-eslint/no-unnecessary-type-parameters": "error",

			// No need
			// "@typescript-eslint/no-unsafe-argument": "error",

			// No need
			// "@typescript-eslint/no-unsafe-assignment": "error",

			// No need
			// "@typescript-eslint/no-unsafe-call": "error",

			// From recommended
			// "@typescript-eslint/no-unsafe-declaration-merging": "error",

			// No need
			// "@typescript-eslint/no-unsafe-enum-comparison": "error",

			// From recommended
			// "@typescript-eslint/no-unsafe-function-type": "error",

			// No need
			// "@typescript-eslint/no-unsafe-member-access": "error",

			// No need
			// "@typescript-eslint/no-unsafe-return": "error",

			// No need
			// "@typescript-eslint/no-unsafe-type-assertion": "error",

			// No need
			// "@typescript-eslint/no-unsafe-unary-minus": "error",

			// From recommended
			// "@typescript-eslint/no-unused-expressions": "error",

			"no-unused-private-class-members": "off",
			"@typescript-eslint/no-unused-private-class-members": "error",

			// Provide better options
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "after-used",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
					ignoreClassWithStaticInitBlock: false,
					reportUsedIgnorePattern: false,
				},
			],

			// From recommended
			// "@typescript-eslint/no-unused-vars": "error",

			// The same as `no-use-before-define`
			"no-use-before-define": "off",
			"@typescript-eslint/no-use-before-define": [
				"error",
				{
					functions: true,
					classes: true,
					variables: true,
					enums: true,
					typedefs: true,
				},
			],

			// No need
			// "@typescript-eslint/no-useless-constructor": "error",

			// No need
			// "@typescript-eslint/no-useless-default-assignment": "error",

			"@typescript-eslint/no-useless-empty-export": "error",

			// From recommended
			"@typescript-eslint/no-wrapper-object-types": "error",

			// No need
			// "@typescript-eslint/non-nullable-type-assertion-style": "error",

			// No need
			// "@typescript-eslint/only-throw-error": "error",

			// No need
			// "@typescript-eslint/parameter-properties": "error",

			// From recommended
			// "@typescript-eslint/prefer-as-const": "error",

			// No need
			// "@typescript-eslint/prefer-destructuring": "error",

			// No need
			// "@typescript-eslint/prefer-enum-initializers": "error",

			// No need
			// "@typescript-eslint/prefer-find": "error",

			// From recommended
			// "@typescript-eslint/prefer-for-of": "error",

			// From recommended
			// "@typescript-eslint/prefer-function-type": "error",

			// No need
			// "@typescript-eslint/prefer-includes": "error",

			// No need
			// "@typescript-eslint/prefer-literal-enum-member": "error",

			// From recommended
			// "@typescript-eslint/prefer-namespace-keyword": "error",

			// No need
			// "@typescript-eslint/prefer-nullish-coalescing": "error",

			// No need
			// "@typescript-eslint/prefer-optional-chain": "error",

			// No need
			// "@typescript-eslint/prefer-promise-reject-errors": "error",

			// No need
			// "@typescript-eslint/prefer-readonly": "error",

			// No need
			// "@typescript-eslint/prefer-readonly-parameter-types": "error",

			// No need
			// "@typescript-eslint/prefer-reduce-type-parameter": "error",

			// No need
			// "@typescript-eslint/prefer-regexp-exec": "error",

			// No need
			// "@typescript-eslint/prefer-return-this-type": "error",

			// No need
			// "@typescript-eslint/prefer-string-starts-ends-with": "error",

			// No need
			// "@typescript-eslint/promise-function-async": "error",

			// No need
			// "@typescript-eslint/related-getter-setter-pairs": "error",

			// No need
			// "@typescript-eslint/require-array-sort-compare": "error",

			// No need
			// "@typescript-eslint/require-await": "error",

			// No need
			// "@typescript-eslint/restrict-plus-operands": "error",

			// No need
			// "@typescript-eslint/restrict-template-expressions": "error",

			// No need
			// "@typescript-eslint/return-await": "error",

			// No need
			// "@typescript-eslint/strict-boolean-expressions": "error",

			// No need
			// "@typescript-eslint/switch-exhaustiveness-check": "error",

			// From recommended
			// "@typescript-eslint/triple-slash-reference": "error",

			// No need
			// "@typescript-eslint/unbound-method": "error",

			// No need
			// "@typescript-eslint/unified-signatures": "error",

			// No need
			// "use-unknown-in-catch-callback-variable": "error",

			// TypeScript compilation already ensures that named imports exist in the referenced module
			"import/named": "off",

			// TypeScript handles this for us
			"import/no-unresolved": "off",
		},
	};
}

export default {
	"typescript/recommended": await getTypescriptRecommendedConfig(),
	"typescript/jsdoc": await getTypescriptJSDocRecommendedConfig(),
};
