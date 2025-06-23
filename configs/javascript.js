import globals from "globals";
import javascriptConfig from "@eslint/js";
import unicornPlugin from "eslint-plugin-unicorn";
import importPlugin from "eslint-plugin-import";
import { allExtensions } from "./utils/extensions.js";

const possibleProblems = {
	"array-callback-return": [
		"error",
		{
			allowImplicit: true,
		},
	],

	// From recommended
	// "constructor-super": "error"

	// From recommended
	// "for-direction": "error"

	// From recommended
	// "getter-return": "error"

	// From recommended
	// "no-async-promise-executor": "error"

	// No need
	// "no-await-in-loop": "off",

	// From recommended
	// "no-class-assign": "error",

	// From recommended
	// "no-compare-neg-zero": "error",

	// From recommended
	// "no-cond-assign": "error",

	// From recommended
	// "no-const-assign": "error",

	// From recommended
	// "no-constant-binary-expression": "error",

	// From recommended
	// "no-constant-condition": "error",

	"no-constructor-return": "error",

	// From recommended
	// "no-control-regex": "error",

	// From recommended
	// "no-debugger": "error",

	// From recommended
	// "no-dupe-args": "error",

	// From recommended
	// "no-dupe-class-members": "error",

	// From recommended
	// "no-dupe-else-if": "error",

	// From recommended
	// "no-dupe-keys": "error",

	// From recommended
	// "no-duplicate-case": "error",

	"no-duplicate-imports": "error",

	// From recommended
	// "no-empty-character-class": "error",

	// From recommended
	// "no-empty-pattern": "error",

	// From recommended
	// "no-ex-assign": "error",

	// From recommended
	// "no-fallthrough": "error",

	// From recommended
	// "no-func-assign": "error",

	// From recommended
	// "no-import-assign": "error",

	"no-inner-declarations": "error",

	// From recommended
	// "no-invalid-regexp": "error",

	// From recommended
	// "no-irregular-whitespace": "error",

	// From recommended
	// "no-loss-of-precision": "error",

	// From recommended
	// "no-misleading-character-class": "error",

	// From recommended
	// "no-new-native-nonconstructor": "error",

	// From recommended
	// "no-obj-calls": "error",

	"no-promise-executor-return": "error",

	// From recommended
	// "no-prototype-builtins": "error",

	// From recommended
	// "no-self-assign": "error",

	"no-self-compare": "error",

	// From recommended
	// "no-setter-return": "error",

	// From recommended
	// "no-sparse-arrays": "error",

	"no-template-curly-in-string": "error",

	// From recommended
	// "no-this-before-super": "error",

	"no-unassigned-vars": "error",

	// From recommended
	// "no-undef": "error",

	// From recommended
	// "no-unexpected-multiline": "error",

	"no-unmodified-loop-condition": "error",

	// From recommended
	// "no-unreachable": "error",

	"no-unreachable-loop": "error",

	// From recommended
	// "no-unsafe-finally": "error",

	// From recommended
	// "no-unsafe-negation": "error",

	// From recommended
	// "no-unsafe-optional-chaining": "error",

	// From recommended
	// "no-unused-private-class-members": "error",

	// From recommended
	"no-unused-vars": [
		"error",
		{
			vars: "all",
			varsIgnorePattern: "^_",
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

	"no-use-before-define": [
		"error",
		{ functions: true, classes: true, variables: true },
	],

	// No need
	// "no-useless-assignment": "off",

	// From recommended
	// "no-useless-backreference": "error",

	// No need
	// "require-atomic-updates": "off",

	// From recommended
	// "use-isnan": "error",

	// From recommended
	// "valid-typeof": "error",
};

const suggestions = {
	"accessor-pairs": "error",

	"arrow-body-style": ["error", "as-needed"],

	"block-scoped-var": "error",

	camelcase: [
		"error",
		{
			allow: [
				"^__webpack",
				"^__non_webpack",
				"^__system",
				"^_stream",
				"string_decoder",
			],
		},
	],

	// No need
	// "capitalized-comments": "error"

	// No need
	// "class-methods-use-this": "error"

	// No need
	// "complexity": "error"

	// No need
	// "consistent-return": "error",

	// No need
	// "consistent-this": "error",

	// Configuration in `stylistic`
	// curly: "off",

	// No need
	// "default-case": "error",

	"default-case-last": "error",

	"default-param-last": "error",

	"dot-notation": "error",

	eqeqeq: "error",

	"func-name-matching": [
		"error",
		"always",
		{
			considerPropertyDescriptor: true,
			includeCommonJSModuleExports: false,
		},
	],

	"func-names": ["error", "as-needed"],

	"func-style": [
		"error",
		"declaration",
		{
			allowArrowFunctions: true,
			allowTypeAnnotation: true,
		},
	],

	"grouped-accessor-pairs": "error",

	"guard-for-in": "error",

	// No need
	// "id-denylist": ["error", []]

	"id-length": [
		"error",
		{
			min: 2,
			max: Number.POSITIVE_INFINITY,
			properties: "never",
			exceptions: [
				// jQuery
				"$",
				// Loops
				"i",
				"j",
				"k",
				"v",
				"m",
				"n",
				"t",
				// Left and right
				"l",
				"r",
				// Lodash
				"_",
				// Comparison
				"a",
				"b",
			],
		},
	],

	"id-match": [
		"error",
		"^[$a-zA-Z_][$a-zA-Z0-9_]*$",
		{
			properties: true,
		},
	],

	// No need
	// "init-declarations": "error",

	"logical-assignment-operators": "error",

	// No need
	// "max-classes-per-file": "off",

	// No need
	// "max-depth": "off",

	// No need
	// "max-lines": "off",

	// No need
	// "max-lines-per-function": "off",

	// No need
	// "max-nested-callbacks": "off",

	// No need
	// "max-params": "off",

	// No need
	// "max-statements": "off",

	"new-cap": "error",

	"no-alert": "error",

	"no-array-constructor": "error",

	// No need
	// "no-bitwise": "error",

	"no-caller": "error",

	// From recommended
	// "no-case-declarations": "error",

	"no-console": "error",

	// No need
	// "no-continue": "error",

	// From recommended
	// "no-delete-var": "error",

	"no-div-regex": "error",

	"no-else-return": "error",

	// From recommended
	// "no-empty": "error",

	"no-empty-function": [
		"error",
		{
			allow: [
				"functions",
				"arrowFunctions",
				"asyncFunctions",
				"methods",
				"asyncMethods",
				"generatorMethods",
			],
		},
	],
	// "no-empty-function": "error"

	// From recommended
	// "no-empty-static-block": "error"

	"no-eq-null": "error",

	"no-eval": "error",

	"no-extend-native": "error",

	"no-extra-bind": "error",

	// From recommended
	// "no-extra-boolean-cast": "error",

	"no-extra-label": "error",

	"no-global-assign": "error",

	"no-implicit-coercion": [
		"error",
		{
			boolean: true,
			number: true,
			string: true,
		},
	],

	// No need
	// Make sense only for `browser` configuration for old browsers
	// "no-implicit-globals": "off",

	"no-implied-eval": "error",

	// No need
	// "no-inline-comments": "error",

	// No need
	// "no-invalid-this": "error",

	"no-iterator": "error",

	"no-label-var": "error",

	// No need
	// "no-labels": "error",

	"no-lone-blocks": "error",

	"no-lonely-if": "error",

	"no-loop-func": "error",

	// No need
	// "no-magic-numbers": "off",

	// No need
	// "no-multi-assign": "off",

	"no-multi-str": "error",

	// No need
	// "no-negated-condition": "off",

	// No need
	// "no-nested-ternary": "off",

	"no-new": "error",

	"no-new-func": "error",

	"no-new-wrappers": "error",

	// From recommended
	// "no-nonoctal-decimal-escape": "error",

	"no-object-constructor": "error",

	// From recommended
	// "no-octal": "error",

	"no-octal-escape": "error",

	// No need
	// "no-param-reassign": "off",

	// No need
	// "no-plusplus": "off",

	"no-proto": "error",

	// From recommended
	// "no-redeclare": "error",

	// From recommended
	// "no-regex-spaces": "error",

	// No need
	// "no-restricted-exports": "error",

	// No need
	// "no-restricted-globals": "error",

	// No need
	// "no-restricted-imports": "off",

	// No need
	// "no-restricted-properties": "off",

	// No need
	// "no-restricted-syntax": ["error", "DebuggerStatement", "WithStatement"],

	"no-return-assign": "error",

	"no-script-url": "error",

	"no-sequences": "error",

	// No need
	// "no-shadow": "off",

	// From recommended
	// "no-shadow-restricted-names": "error",

	// No need
	// "no-ternary": "error",

	"no-throw-literal": "error",

	"no-undef-init": "error",

	// No need
	// "no-undefined": "off",

	// No need
	// "no-underscore-dangle": "off",

	"no-unneeded-ternary": ["error", { defaultAssignment: false }],

	"no-unused-expressions": [
		"error",
		{
			allowShortCircuit: false,
			allowTernary: false,
			allowTaggedTemplates: true,
		},
	],

	// From recommended
	// "no-unused-labels": "error",

	"no-useless-call": "error",

	// From recommended
	"no-useless-catch": "error",

	"no-useless-computed-key": "error",

	"no-useless-concat": "error",

	// No need
	// "no-useless-constructor": "error",

	"no-useless-escape": "error",

	"no-useless-rename": [
		"error",
		{
			ignoreDestructuring: false,
			ignoreImport: false,
			ignoreExport: false,
		},
	],

	"no-useless-return": "error",

	"no-var": "error",

	"no-void": "error",

	// Disallow ts-ignore directive. Use ts-expect-error instead
	"no-warning-comments": ["error", { terms: ["@ts-ignore"] }],

	"no-with": "error",

	"object-shorthand": "error",

	"one-var": ["error", "never"],

	"operator-assignment": "error",

	"prefer-arrow-callback": [
		"error",
		{
			allowNamedFunctions: false,
			allowUnboundThis: true,
		},
	],

	"prefer-const": [
		"error",
		{
			destructuring: "all",
			ignoreReadBeforeAssign: true,
		},
	],

	"prefer-destructuring": [
		"error",
		{
			VariableDeclarator: {
				array: true,
				object: true,
			},
			AssignmentExpression: {
				array: true,
				// Avoid `({ property } = object);` because:
				// it is ugly, it is often not convenient, this does not allow to set types using typescript jsdoc
				object: false,
			},
		},
		{
			enforceForRenamedProperties: false,
		},
	],

	"prefer-exponentiation-operator": "error",

	// No need
	// "prefer-named-capture-group": "off",

	"prefer-numeric-literals": "error",

	"prefer-object-has-own": "error",

	"prefer-object-spread": "error",

	"prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],

	"prefer-regex-literals": "error",

	"prefer-rest-params": "error",

	"prefer-spread": "error",

	"prefer-template": "error",

	radix: ["error", "always"],

	// `require-await` doesn't work when the function returns Promise<any>
	// "require-await": "off",

	// No need
	// "require-unicode-regexp": "error",

	// From recommended
	// "require-yield": "error",

	// No need
	// "sort-imports": "off",

	// No need
	// "sort-keys": "off",

	// No need
	// "sort-vars": "off",

	strict: ["error", "safe"],

	"symbol-description": "error",

	// No need
	// "vars-on-top": "off",

	yoda: "error",
};

const layoutAndFormatting = {
	"unicode-bom": ["error", "never"],
};

const unicornRules = {
	// No need
	// "unicorn/better-regex": "off",

	"unicorn/catch-error-name": [
		"error",
		{ name: "err", ignore: [/(^_|[0-9]+$)/i, /^error$/] },
	],

	"unicorn/consistent-assert": "error",

	"unicorn/consistent-date-clone": "error",

	"unicorn/consistent-destructuring": "off",

	"unicorn/consistent-empty-array-spread": "error",

	// No need
	// "unicorn/consistent-existence-index-check": "off",

	// No need
	// "unicorn/consistent-function-scoping": "off",

	// No need
	// "unicorn/custom-error-definition": "off",

	// No need
	// "unicorn/empty-brace-spaces": "off",

	"unicorn/error-message": "error",

	"unicorn/escape-case": "error",

	// No need
	// "unicorn/expiring-todo-comments": "off",

	// No need
	// "unicorn/explicit-length-check": "off",

	// TODO
	"unicorn/filename-case": [
		"off",
		{
			cases: {
				kebabCase: true,
				pascalCase: true,
			},
			ignore: [
				/^CHANGES.md$/,
				/^CHANGELOG.md$/,
				/^HISTORY.md$/,
				/^README.md$/,
				/^LICENSE.md$/,
				/^LICENCE.md$/,
				/^NOTICE.md$/,
				/^CODE_OF_CONDUCT.md$/,
				/^CONTRIBUTING.md$/,
				/^AUTHORS.md$/,
				/^SECURITY.md$/,
				/^ISSUE_TEMPLATE.md$/,
				/^PULL_REQUEST_TEMPLATE.md$/,
			],
		},
	],

	// No need
	// "unicorn/import-style": "off",

	"unicorn/new-for-builtins": "error",

	"unicorn/no-abusive-eslint-disable": "error",

	"unicorn/no-accessor-recursion": "error",

	// No need
	// "unicorn/no-anonymous-default-export": "off",

	// No need
	// "unicorn/no-array-callback-reference": "off",

	"unicorn/no-array-for-each": "error",

	"unicorn/no-array-method-this-argument": "error",

	// No need
	// "unicorn/no-array-reduce": "off",

	// No need
	// "unicorn/no-await-expression-member": "off",

	"unicorn/no-await-in-promise-methods": "error",

	"unicorn/no-console-spaces": "error",

	// No need
	// "unicorn/no-document-cookie": "off",

	// No need
	// "unicorn/no-empty-file": "off",

	// No need
	// "unicorn/no-for-loop": "off",

	"unicorn/no-hex-escape": "error",

	"unicorn/no-instanceof-builtins": "error",

	"unicorn/no-invalid-fetch-options": "error",

	"unicorn/no-invalid-remove-event-listener": "error",

	// No need
	// "unicorn/no-keyword-prefix": "off",

	"unicorn/no-lonely-if": "error",

	// No need
	// "unicorn/no-magic-array-flat-depth": "error",

	// No need
	// "unicorn/no-named-default": "error",

	// No need
	// "unicorn/no-negated-condition": "off",

	// No need
	// "unicorn/no-negation-in-equality-check": "off",

	// No need
	// "unicorn/no-nested-ternary": "off",

	"unicorn/no-new-array": "error",

	// No need
	// We are catching this in `node/no-deprecated-api` rule
	// "unicorn/no-new-buffer": "off",

	// No need
	// "unicorn/no-null": "off",

	// No need
	// "unicorn/no-object-as-default-parameter": "off",

	// No need
	// "unicorn/no-process-exit": "off",

	"unicorn/no-single-promise-in-promise-methods": "error",

	// No need
	// "unicorn/no-static-only-class": "off",

	"unicorn/no-thenable": "error",

	// No need
	// "unicorn/no-this-assignment": "off",

	// TODO - enable in future?
	// "unicorn/no-typeof-undefined": "off",

	"unicorn/no-unnecessary-array-flat-depth": "error",

	"unicorn/no-unnecessary-array-splice-count": "error",

	"unicorn/no-unnecessary-await": "error",

	"unicorn/no-unnecessary-polyfills": "error",

	"unicorn/no-unnecessary-slice-end": "error",

	// No need
	// "unicorn/no-unreadable-array-destructuring": "off",

	// No need
	// "unicorn/no-unreadable-iife": "off",

	// No need
	// "unicorn/no-unused-properties": "off",

	"unicorn/no-useless-fallback-in-spread": "error",

	"unicorn/no-useless-length-check": "error",

	"unicorn/no-useless-promise-resolve-reject": "error",

	"unicorn/no-useless-spread": "error",

	// No need
	// "unicorn/no-useless-switch-case": "off",

	// No need
	// "unicorn/no-useless-undefined": "off",

	"unicorn/no-zero-fractions": "error",

	// No need
	// `prettier` makes it
	// "unicorn/number-literal-case": "off",

	// No need
	// "unicorn/numeric-separators-style": "off",

	// No need
	// "unicorn/prefer-add-event-listener": "off",

	"unicorn/prefer-array-find": "error",

	"unicorn/prefer-array-flat": "error",

	"unicorn/prefer-array-flat-map": "error",

	"unicorn/prefer-array-index-of": "error",

	"unicorn/prefer-array-some": "error",

	// No need
	// "unicorn/prefer-at": "off",

	"unicorn/prefer-blob-reading-methods": "error",

	// No need
	// "unicorn/prefer-code-point": "error",

	"unicorn/prefer-date-now": "error",

	"unicorn/prefer-default-parameters": "error",

	"unicorn/prefer-dom-node-append": "error",

	"unicorn/prefer-dom-node-dataset": "error",

	"unicorn/prefer-dom-node-remove": "error",

	"unicorn/prefer-dom-node-text-content": "error",

	"unicorn/prefer-event-target": "error",

	"unicorn/prefer-export-from": "error",

	"unicorn/prefer-global-this": "error",

	// No need
	// "unicorn/prefer-import-meta-properties": "off",

	"unicorn/prefer-includes": "error",

	// No need
	// "unicorn/prefer-json-parse-buffer": "off",

	"unicorn/prefer-keyboard-event-key": "error",

	"unicorn/prefer-logical-operator-over-ternary": "error",

	// No need
	// "unicorn/prefer-math-min-max": "off",

	// No need
	// `| 0` is faster
	// "unicorn/prefer-math-trunc": "off",

	"unicorn/prefer-modern-dom-apis": "error",

	"unicorn/prefer-modern-math-apis": "error",

	// No need
	// "unicorn/prefer-module": "off",

	"unicorn/prefer-native-coercion-functions": "error",

	"unicorn/prefer-negative-index": "error",

	// No need
	// We have `n/prefer-node-protocol` rule
	// "unicorn/prefer-node-protocol": "off",

	"unicorn/prefer-number-properties": "error",

	"unicorn/prefer-object-from-entries": "error",

	"unicorn/prefer-optional-catch-binding": "error",

	"unicorn/prefer-prototype-methods": "error",

	"unicorn/prefer-query-selector": "error",

	// No need
	// "unicorn/prefer-reflect-apply": "off",

	"unicorn/prefer-regexp-test": "error",

	// No need
	// "unicorn/prefer-set-has": "off",

	// No need
	// "unicorn/prefer-set-size": "off",

	// No need
	// "unicorn/prefer-single-call": "off",

	"unicorn/prefer-spread": "error",

	// No need
	// "unicorn/prefer-string-raw": "error"

	"unicorn/prefer-string-replace-all": "error",

	"unicorn/prefer-string-slice": "error",

	"unicorn/prefer-string-starts-ends-with": "error",

	"unicorn/prefer-string-trim-start-end": "error",

	"unicorn/prefer-structured-clone": "error",

	// No need
	// "unicorn/prefer-switch": "error",

	"unicorn/prefer-ternary": ["error", "only-single-line"],

	"unicorn/prefer-top-level-await": "error",

	// No need
	// "unicorn/prefer-type-error": "error",

	// No need
	// "unicorn/prevent-abbreviations": "error",

	"unicorn/relative-url-style": "error",

	// No need
	// "unicorn/require-array-join-separator": "error",

	// No need
	// "unicorn/require-number-to-fixed-digits-argument": "error",

	// No need
	// "unicorn/require-post-message-target-origin": "error",

	// No need
	// "unicorn/string-content": "off",

	// No need
	// "unicorn/switch-case-braces": "off",

	// No need
	// "unicorn/template-indent": "off",

	"unicorn/text-encoding-identifier-case": "error",

	"unicorn/throw-new-error": "error",
};

const importRules = {
	...importPlugin.flatConfigs.recommended.rules,

	// From recommended
	// "import/export": "error",

	// No need
	// "import/no-deprecated": "off",

	"import/no-empty-named-blocks": "error",

	"import/no-extraneous-dependencies": "error",

	"import/no-mutable-exports": "error",

	"import/no-named-as-default": "error",

	"import/no-named-as-default-member": "error",

	// No need
	// "import/no-unused-modules": "error",

	"import/no-amd": "error",

	// No need
	// "import/no-commonjs": "off",

	// No need
	// "import/no-import-module-exports": "off",

	// No need
	// "import/no-nodejs-modules": "off",

	// No need
	// "import/unambiguous": "off",

	// From recommended
	// "import/default": "error",

	// No need
	// "import/enforce-node-protocol-usage": "off",

	// From recommended
	// "import/named": "error",

	// From recommended
	// "import/namespace": "error",

	"import/no-absolute-path": "error",

	// No need
	// "import/no-cycle": "off",

	// No need
	// "import/no-dynamic-require": "off",

	// No need
	// "import/no-internal-modules": "off",

	// No need
	// "import/no-relative-packages": "off",

	// No need
	// "import/no-relative-parent-imports": "off",

	// No need
	// "import/no-restricted-paths": "off",

	"import/no-self-import": "error",

	// From recommended
	"import/no-unresolved": [
		"error",
		{ ignore: ["^eslint/config$", "^typescript-eslint$"], commonjs: true },
	],

	// No need
	// "import/no-useless-path-segments": "off",

	// No need
	// "import/no-webpack-loader-syntax": "off",

	"import/consistent-type-specifier-style": ["error", "prefer-inline"],

	// No need
	// "import/dynamic-import-chunkname": "off",

	// No need
	// "import/exports-last": "off",

	// Not here
	// "import/extensions": ["error", "always", { ignorePackages: true }],

	"import/first": "error",

	// No need
	// "import/group-exports": "off",

	// No need
	// "import/max-dependencies": "off",

	// No need
	// We have `@stylistic/padding-line-between-statements`
	// "import/newline-after-import": "off",

	// No need
	// "import/no-anonymous-default-export": "off",

	// No need
	// "import/no-default-export": "off",

	// No need
	// We have `no-duplicate-imports` rule
	"import/no-duplicates": "off",

	// No need
	// "import/no-named-default": "off",

	// No need
	// "import/no-named-export": "off",

	// No need
	// "import/no-namespace": "off",

	// No need
	// "import/no-unassigned-import": "off",

	// No need
	// TODO consider this in the future
	// "import/order": [
	//   "warn",
	//   {
	//     groups: [
	//       "builtin",
	//       "external",
	//       "internal",
	//       "parent",
	//       "sibling",
	//       "index",
	//     ]
	//   },
	// ],

	// No need
	// "import/prefer-default-export": "off",
};

/**
 * @param {number} esVersion es version
 * @returns {Record<string, string | number>} config
 */
function getConfig(esVersion) {
	const config = {
		...javascriptConfig.configs.recommended,
		name: `javascript/es${esVersion}`,
		files: [`**/*.{${allExtensions.map((item) => item.slice(1)).join(",")}}`],
		ignores: ["**/*.d.ts"],
		settings: {
			"import/extensions": allExtensions,
			"import/ignore": [
				"eslint-plugin-.*",
				"\\.(coffee|scss|css|less|hbs|svg|md|jpg|jpeg|png|gif|webp|avif)$",
			],
			"import/resolver": {
				node: {
					extensions: [...allExtensions],
				},
			},
		},
		plugins: {
			unicorn: unicornPlugin,
			import: importPlugin,
		},
		languageOptions: {
			ecmaVersion: esVersion,
			globals: {
				...globals[`es${esVersion}`],
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		rules: {
			...javascriptConfig.configs.recommended.rules,
			...possibleProblems,
			...suggestions,
			...layoutAndFormatting,
			...unicornRules,
			...importRules,
		},
	};

	if (esVersion === 5) {
		config.rules["object-shorthand"] = "off";
		config.rules["no-var"] = "off";
		config.rules["prefer-arrow-callback"] = "off";
		config.rules["prefer-const"] = "off";
		config.rules["prefer-destructuring"] = "off";
		config.rules["prefer-exponentiation-operator"] = "off";
		config.rules["prefer-object-spread"] = "off";
		config.rules["prefer-rest-params"] = "off";
		config.rules["prefer-spread"] = "off";
		config.rules["prefer-template"] = "off";
		config.rules["no-template-curly-in-string"] = "off";
		config.rules["unicorn/prefer-spread"] = "off";
	}

	if (esVersion < 2018) {
		config.rules["prefer-object-spread"] = "off";
	}

	if (esVersion < 2019) {
		config.rules["unicorn/prefer-array-flat"] = "off";
		config.rules["unicorn/prefer-array-flat-map"] = "off";
		config.rules["unicorn/prefer-string-trim-start-end"] = "off";
		config.rules["unicorn/prefer-optional-catch-binding"] = "off";
	}

	if (esVersion < 2020) {
		config.rules["unicorn/prefer-global-this"] = "off";
		config.rules["unicorn/prefer-logical-operator-over-ternary"] = "off";
	}

	if (esVersion < 2021) {
		config.rules["logical-assignment-operators"] = "off";
		config.rules["unicorn/prefer-string-replace-all"] = "off";
		config.rules["unicorn/prefer-event-target"] = "off";
	}

	if (esVersion < 2022) {
		config.rules["prefer-object-has-own"] = "off";
		config.rules["unicorn/prefer-structured-clone"] = "off";
		config.rules["unicorn/prefer-top-level-await"] = "off";
	}

	return config;
}

const configs = {};
const esVersions = Array.from({ length: 11 }, (_x, i) => 15 + i);

for (const [i, esVersion] of esVersions.entries()) {
	const year = 2000 + esVersion;
	const config = getConfig(year);

	configs[`javascript/es${year}`] = config;

	if (i === esVersions.length - 1) {
		configs["javascript/recommended"] = config;
	}
}

configs["javascript/es5"] = getConfig(5);

export default configs;
