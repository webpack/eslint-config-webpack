import javascriptConfig from "@eslint/js";
import importPlugin from "eslint-plugin-import-x";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";
import { allExtensions, javascriptExtensions } from "./utils/extensions.js";
import isTypescriptInstalled from "./utils/is-typescript-installed.js";

/** @type {import("eslint").Linter.Config["rules"]} */
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

	// From recommended
	// "no-unassigned-vars": "error",

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

	// TODO Do we need it?
	"no-useless-assignment": "off",

	// From recommended
	// "no-useless-backreference": "error",

	// No need
	// "require-atomic-updates": "off",

	// From recommended
	// "use-isnan": "error",

	// From recommended
	// "valid-typeof": "error",
};

/** @type {import("eslint").Linter.Config["rules"]} */
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

	// No need
	// In most cases, the developer understands what he is doing and where, so no additional checks are required
	// "guard-for-in": "error",

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

	// For `prop-types`
	"new-cap": ["error", { capIsNewExceptionPattern: "^.+Type$" }],

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

	// From recommended
	// "preserve-caught-error": "error",

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

	strict: ["error", "global"],

	"symbol-description": "error",

	// No need
	// "vars-on-top": "off",

	yoda: "error",
};

/** @type {import("eslint").Linter.Config["rules"]} */
const layoutAndFormatting = {
	"unicode-bom": ["error", "never"],
};

/** @type {import("eslint").Linter.Config["rules"]} */
const unicornRules = {
	// Not here, define only for `browsers`
	// "unicorn/better-dom-traversing": "error",

	"unicorn/class-reference-in-static-methods": "error",

	"unicorn/catch-error-name": [
		"error",
		{ name: "err", ignore: [/(^_|[0-9]+$)/i, /^error$/] },
	],

	// No need
	// "unicorn/comma-spacing": "off",

	// No need
	// "unicorn/comment-content": "off",

	// No need
	// "unicorn/consistent-arrow-return-style": "off",

	"unicorn/consistent-assert": "error",

	// TODO enable it in future
	// "unicorn/consistent-boolean-name": "error",

	// TODO enable it in future
	// "unicorn/consistent-class-member-order": "error",

	// TODO enable it in future
	// "unicorn/consistent-compound-words": "error",

	// TODO enable it in future
	// "unicorn/consistent-conditional-object-spread": "error",

	"unicorn/consistent-date-clone": "error",

	"unicorn/consistent-destructuring": "off",

	"unicorn/consistent-empty-array-spread": "error",

	// No need
	// "unicorn/consistent-existence-index-check": "off",

	// No need
	// "unicorn/consistent-export-decorator-position": "off",

	// No need
	// "unicorn/consistent-function-scoping": "off",

	// TODO enable it in future
	// "unicorn/consistent-function-style": "error",

	// TODO enable only for ECMA modules with top level await support,
	// "unicorn/consistent-json-file-read": "error",

	"unicorn/consistent-optional-chaining": "error",

	"unicorn/consistent-template-literal-escape": "error",

	// TODO check it will work with jsdocs and typescript?
	// "unicorn/consistent-tuple-labels": "error",

	// No need
	// "unicorn/custom-error-definition": "off",

	// TODO investiagte
	// "unicorn/default-export-style": "off",

	// Not here, define only for `browsers`
	// "unicorn/dom-node-dataset": "error",

	// No need
	// "unicorn/empty-brace-spaces": "off",

	"unicorn/error-message": "error",

	"unicorn/escape-case": "error",

	// No need
	// "unicorn/expiring-todo-comments": "off",

	// No need
	// "unicorn/explicit-length-check": "off",

	"unicorn/explicit-timer-delay": "error",

	// TODO enable in future?
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
	// "unicorn/id-match": "off",

	// TODO do we need it?
	// "unicorn/import-style": "off",

	// No need
	// "unicorn/indent": "off",

	// No need
	// "unicorn/isolated-functions": "off",

	"unicorn/iteration-fallback-style": ["error", "fallback"],

	// TODO enable in future
	// "unicorn/key-name-casing": "off",

	// No need
	// "unicorn/logical-assignment-operators": "off",

	// No need
	// "unicorn/max-nested-calls": "off",

	// TODO do we need it?
	// "unicorn/name-replacements": "off",

	"unicorn/new-for-builtins": "error",

	"unicorn/no-abusive-eslint-disable": "error",

	"unicorn/no-accessor-recursion": "error",

	// TODO do we need it?
	// "unicorn/no-accidental-bitwise-operator": "off",

	// TODO do we need it?
	// "unicorn/no-anonymous-default-export": "off",

	// No need
	// "unicorn/no-array-callback-reference": "off",

	"unicorn/no-array-concat-in-loop": "error",

	"unicorn/no-array-fill-with-reference-type": "error",

	"unicorn/no-array-from-fill": "error",

	// No need
	// "unicorn/no-array-front-mutation": "off"

	"unicorn/no-array-method-this-argument": "error",

	// No need
	// "unicorn/no-array-reduce": "off",

	// No need
	// "unicorn/no-array-reverse": "off",

	// TODO need to check performance
	"unicorn/no-array-sort": "error",

	"unicorn/no-array-sort-for-min-max": "error",

	// TODO need to check performance
	"unicorn/no-array-splice": "error",

	// No need
	// "unicorn/no-asterisk-prefix-in-documentation-comments": "off",

	"unicorn/no-async-iterator-callback": "error",

	"unicorn/no-async-promise-finally": "error",

	// No need
	// "unicorn/no-await-expression-member": "off",

	"unicorn/no-await-in-promise-methods": "error",

	// No need
	// "unicorn/no-barrel-files": "off",

	"unicorn/no-blob-to-file": "error",

	"unicorn/no-boolean-sort-comparator": "error",

	// No need
	"unicorn/no-break-in-nested-loop": "off",

	// Not here, define only for `browsers`
	// "unicorn/no-canvas-to-image": "off",

	"unicorn/no-chained-comparison": "error",

	"unicorn/no-collection-bracket-access": "error",

	// No need
	// "unicorn/no-computed-property-existence-check": "off",

	// TODO implement CSS preset
	// "unicorn/no-conflicting-constraints": "off",

	// No need
	// "unicorn/no-confusing-array-splice": "off",

	// No need
	// "unicorn/no-confusing-array-with": "off",

	"unicorn/no-console-spaces": "error",

	"unicorn/no-constant-zero-expression": "error",

	// TODO Do we need it?
	// "unicorn/no-declarations-before-early-exit": "error",

	// No need
	// "unicorn/no-document-cookie": "off",

	"unicorn/no-double-comparison": "error",

	// TODO do we need it?
	// "unicorn/no-duplicate-if-branches": "error",

	"unicorn/no-duplicate-logical-operands": "error",

	// TODO do we need it?
	// "unicorn/no-duplicate-loops": "error",

	"unicorn/no-duplicate-set-values": "error",

	// No need
	// "unicorn/no-empty-file": "off",

	// TODO implement markdown support by default
	// "unicorn/no-empty-link-text": "off",

	"unicorn/no-exports-in-scripts": "error",

	"unicorn/no-for-each": "error",

	// No need
	// "unicorn/no-for-loop": "off",

	// No need
	// "unicorn/no-global-object-property-assignment": "off",

	// No need
	// "unicorn/no-immediate-mutation": "off",

	"unicorn/no-impossible-length-comparison": "error",

	// TODO Do we need it?
	// "unicorn/no-incomplete-accessor-override": "error",

	// Not here, define only for `browsers`
	// "unicorn/no-incorrect-query-selector": "off",

	"unicorn/no-incorrect-template-string-interpolation": "error",

	// TODO implement HTML preset
	// "unicorn/no-ineffective-csp-directives": "off",

	"unicorn/no-instanceof-builtins": "error",

	// TODO do we need it?
	// "unicorn/no-invalid-argument-count": "off",

	// Not here, define only for `browsers`
	// "unicorn/no-invalid-boolean-attribute-value": "error",

	"unicorn/no-invalid-character-comparison": "error",

	// Not here, define only for `browsers`
	// "unicorn/no-invalid-dom-token": "off",

	"unicorn/no-invalid-fetch-options": "error",

	// TODO enable for JSX and HTML
	// "unicorn/no-invalid-file-input-accept": "off",

	// TODO enable for JSX and HTML
	// "unicorn/no-invalid-integrity": "off",

	"unicorn/no-invalid-intl-options": "error",

	"unicorn/no-invalid-property-descriptor": "error",

	"unicorn/no-invalid-remove-event-listener": "error",

	"unicorn/no-invalid-response-options": "error",

	// Not here, define only for `browsers`
	// "unicorn/no-invalid-style-set-property": "error",

	"unicorn/no-invalid-temporal-arithmetic": "error",

	"unicorn/no-invalid-url-protocol-comparison": "error",

	"unicorn/no-invalid-well-known-symbol-methods": "error",

	// TODO enable for markdown preset
	// "unicorn/no-javascript-url": "error",

	// No need
	// "unicorn/no-keyword-prefix": "off",

	// Not here, define only for `browsers`
	// "unicorn/no-late-current-target-access": "off",

	// TODO Do we need it?
	// "unicorn/no-leading-empty-lines": "error",

	"unicorn/no-lonely-if": "error",

	// TODO Do we need it?
	// "unicorn/no-loop-iterable-mutation": "off",

	// No need we have `no-loss-of-precision`, this rule only for JSON and etc
	// "unicorn/no-loss-of-precision": "error",

	// No need
	// "unicorn/no-magic-array-flat-depth": "error",

	// No need TODO enable?
	// "unicorn/no-manually-wrapped-comments": "off",

	// TODO Do we need it?
	// "unicorn/no-mismatched-map-key": "error",

	"unicorn/no-misrefactored-assignment": "error",

	// TODO enable for html, css and etc
	"unicorn/no-missing-local-resource": "error",

	"unicorn/no-multiple-promise-resolver-calls": "error",

	// No need
	// "unicorn/no-named-default": "error",

	"unicorn/no-negated-array-predicate": "error",

	// TODO enable checkLogicalExpressions?
	"unicorn/no-negated-comparison": "error",

	// TODO Do we need it?
	// "unicorn/no-negated-condition": "off",

	"unicorn/no-negation-in-equality-check": "error",

	// No need
	// "unicorn/no-nested-ternary": "off",

	"unicorn/no-new-array": "error",

	// No need
	// We are catching this in `node/no-deprecated-api` rule
	// "unicorn/no-new-buffer": "off",

	// TODO Enable in future
	// "unicorn/no-non-function-verb-prefix": "error",

	// No need - use typescript
	// "unicorn/no-nonstandard-builtin-properties": "off",

	// No need
	// "unicorn/no-null": "off",

	// No need
	// "unicorn/no-object-as-default-parameter": "off",

	// TODO Do we need it?
	// "unicorn/no-object-methods-with-collections": "off",

	"unicorn/no-optional-chaining-on-undeclared-variable": "error",

	"unicorn/no-prevent-default-in-passive-listener": "error",

	// No need
	// "unicorn/no-process-exit": "off",

	"unicorn/no-redundant-comparison": "error",

	// No need
	// "unicorn/no-repeated-call-wrappers": "off",

	"unicorn/no-return-array-push": "error",

	// TODO enable for CSS
	// "unicorn/no-shorthand-property-overrides": "error",

	"unicorn/no-single-promise-in-promise-methods": "error",

	// No need
	// "unicorn/no-static-only-class": "off",

	"unicorn/no-subtraction-comparison": "error",

	"unicorn/no-thenable": "error",

	// No need
	// "unicorn/no-this-assignment": "off",

	// No need
	// "unicorn/no-this-outside-of-class": "off",

	// TODO we need to think how refactor webpack to enable it, it is useful for initial start
	// "unicorn/no-top-level-assignment-in-function": "off",

	// TODO need testing
	// "unicorn/no-top-level-side-effects": "off",

	// TODO enable for CSS
	// "unicorn/no-transition-all": "off",

	// TODO enable in future? Need to check performance
	// "unicorn/no-typeof-undefined": "off",

	"unicorn/no-uncalled-method": "error",

	// TODO no need - use typescript
	// "unicorn/no-undeclared-class-members": "off",

	"unicorn/no-unnecessary-array-flat-depth": "error",

	"unicorn/no-unnecessary-array-flat-map": "error",

	"unicorn/no-unnecessary-array-splice-count": "error",

	"unicorn/no-unnecessary-await": "error",

	"unicorn/no-unnecessary-boolean-comparison": "error",

	// No need
	// "unicorn/no-unnecessary-default-arguments": "off",

	"unicorn/no-unnecessary-fetch-options": "error",

	// TODO disable for global
	// "unicorn/no-unnecessary-global-this": "off",

	"unicorn/no-unnecessary-nested-ternary": "error",

	// TODO test it
	// "unicorn/no-unnecessary-parameters": "off",

	"unicorn/no-unnecessary-polyfills": "error",

	"unicorn/no-unnecessary-slice-end": "error",

	"unicorn/no-unnecessary-splice": "error",

	"unicorn/no-unnecessary-string-trim": "error",

	// No need
	// "unicorn/no-unreadable-array-destructuring": "off",

	// No need
	// "unicorn/no-unreadable-for-of-expression": "off",

	// TODO Do we need it?
	// "unicorn/no-unreadable-iife": "off",

	// No need
	// "unicorn/no-unreadable-new-expression": "off",

	// TODO Do we need it?
	// "unicorn/no-unreadable-object-destructuring": "error",

	"unicorn/no-unsafe-buffer-conversion": "error",

	// Not here, define only for `browsers`
	"unicorn/no-unsafe-dom-html": "off",

	"unicorn/no-unsafe-json-serialization": "error",

	"unicorn/no-unsafe-promise-all-settled-values": "error",

	"unicorn/no-unsafe-property-key": "error",

	// No need
	// "unicorn/no-unsafe-sqlite-interpolation": "off",

	// No need
	// "unicorn/no-unsafe-string-replacement": "off",

	"unicorn/no-unused-builtin-method-return": "error",

	// TODO Do we need it?
	// "unicorn/no-unused-iterator-helper": "error",

	// No need
	// "unicorn/no-unused-properties": "off",

	"unicorn/no-url-in-search-params": "error",

	"unicorn/no-useless-boolean-cast": "error",

	"unicorn/no-useless-coercion": "error",

	"unicorn/no-useless-collection-argument": "error",

	"unicorn/no-useless-compound-assignment": "error",

	// TODO
	// "unicorn/no-useless-concat": "error",

	"unicorn/no-useless-continue": "error",

	"unicorn/no-useless-delete-check": "error",

	"unicorn/no-useless-else": "error",

	"unicorn/no-useless-error-capture-stack-trace": "error",

	"unicorn/no-useless-fallback-in-spread": "error",

	"unicorn/no-useless-iterator-to-array": "error",

	"unicorn/no-useless-length-check": "error",

	"unicorn/no-useless-logical-operand": "error",

	"unicorn/no-useless-override": "error",

	"unicorn/no-useless-promise-resolve-reject": "error",

	"unicorn/no-useless-re-export": "error",

	// TODO Do we need it?
	// "unicorn/no-useless-recursion": "error",

	// TODO do we need it?
	// "unicorn/no-useless-set-construction": "error",

	"unicorn/no-useless-spread": "error",

	// No need
	// "unicorn/no-useless-switch-case": "off",

	"unicorn/no-useless-template-literals": "error",

	// No need
	// "unicorn/no-useless-undefined": "off",

	"unicorn/no-using-resource-escape": "error",

	// No need
	// "unicorn/no-xor-as-exponentiation": "off",

	"unicorn/no-zero-fractions": "error",

	// No need
	// `prettier` makes it
	// "unicorn/number-literal-case": "off",

	// No need
	// "unicorn/numeric-separators-style": "off",

	// No need
	// "unicorn/operator-assignment": "off",

	"unicorn/prefer-abort-signal-any": "error",

	"unicorn/prefer-abort-signal-timeout": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-add-event-listener": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-add-event-listener-options": "error",

	"unicorn/prefer-aggregate-error": "error",

	"unicorn/prefer-array-find": "error",

	"unicorn/prefer-array-flat": "error",

	"unicorn/prefer-array-flat-map": "error",

	"unicorn/prefer-array-from-async": "error",

	"unicorn/prefer-array-from-map": "error",

	"unicorn/prefer-array-from-range": "error",

	"unicorn/prefer-array-index-of": "error",

	"unicorn/prefer-array-iterable-methods": "error",

	"unicorn/prefer-array-last-methods": "error",

	"unicorn/prefer-array-slice": "error",

	"unicorn/prefer-array-some": "error",

	// TODO do we need it?
	// "unicorn/prefer-at": "off",

	// TODO enable in future
	// "unicorn/prefer-await": "error",

	"unicorn/prefer-bigint-literals": "error",

	"unicorn/prefer-blob-reading-methods": "error",

	"unicorn/prefer-block-statement-over-iife": "error",

	"unicorn/prefer-boolean-return": "error",

	"unicorn/prefer-class-fields": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-classlist-toggle": "error",

	// No need
	// "unicorn/prefer-code-point": "error",

	"unicorn/prefer-combined-guards": "error",

	"unicorn/prefer-continue": "error",

	"unicorn/prefer-date-now": "error",

	"unicorn/prefer-default-parameters": "error",

	"unicorn/prefer-direct-iteration": "error",

	// TODO enable in future
	// "unicorn/prefer-dispose": "off",

	// Not here, define only for `browsers`
	// "unicorn/prefer-dom-node-append": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-dom-node-html-methods": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-dom-node-remove": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-dom-node-replace-children": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-dom-node-text-content": "error",

	"unicorn/prefer-early-return": "error",

	"unicorn/prefer-else-if": "error",

	// TODO enable it in future
	// "unicorn/prefer-error-is-error": "off",

	"unicorn/prefer-escaped-irregular-whitespace": "error",

	"unicorn/prefer-event-target": "error",

	"unicorn/prefer-export-from": "error",

	"unicorn/prefer-flat-math-min-max": "error",

	// TODO enable in future
	// "unicorn/prefer-get-or-insert-computed": "error",

	// No need
	// "unicorn/prefer-global-number-constants": "off",

	"unicorn/prefer-global-this": "error",

	// TODO enable in future
	// "unicorn/prefer-group-by": "error",

	"unicorn/prefer-has-check": "error",

	"unicorn/prefer-hoisting-branch-code": "error",

	"unicorn/prefer-https": "error",

	"unicorn/prefer-identifier-import-export-specifiers": "error",

	// TODO enable only for nodejs
	// "unicorn/prefer-import-meta-properties": "error",

	"unicorn/prefer-includes": "error",

	"unicorn/prefer-includes-over-repeated-comparisons": "error",

	"unicorn/prefer-iterable-in-constructor": "error",

	// TODO enable only for fresh Nodejs?
	// "unicorn/prefer-iterator-concat": "off",

	// TODO enable only for fresh Nodejs?
	// "unicorn/prefer-iterator-helpers": "off",

	// TODO enable only for fresh Nodejs?
	// "unicorn/prefer-iterator-to-array": "off",

	// TODO enable only for fresh Nodejs?
	// "unicorn/prefer-iterator-to-array-at-end": "off",

	// TODO enable only for fresh Nodejs?
	// "unicorn/prefer-iterator-zip": "off",

	// TODO enable me
	// "unicorn/prefer-json-import": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-keyboard-event-key": "error",

	"unicorn/prefer-literal-ascii": "error",

	"unicorn/prefer-logical-operator-over-ternary": "error",

	// TODO Do not need
	// "unicorn/prefer-map-from-entries": "off",

	// No need
	// "unicorn/prefer-math-abs": "off",

	// No need
	// "unicorn/prefer-math-constants": "off",

	"unicorn/prefer-math-min-max": "error",

	// No need
	// `| 0` is faster
	// "unicorn/prefer-math-trunc": "off",

	"unicorn/prefer-minimal-ternary": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-modern-dom-apis": "error",

	"unicorn/prefer-modern-math-apis": "error",

	// TODO enable it
	// "unicorn/prefer-module": "off",

	"unicorn/prefer-native-coercion-functions": "error",

	"unicorn/prefer-negative-index": "error",

	// No need
	// We have `n/prefer-node-protocol` rule
	// "unicorn/prefer-node-protocol": "off",

	// No need
	// "unicorn/prefer-number-coercion": "off",

	"unicorn/prefer-number-is-safe-integer": "error",

	"unicorn/prefer-number-properties": "error",

	"unicorn/prefer-object-define-properties": "error",

	"unicorn/prefer-object-destructuring-defaults": "error",

	"unicorn/prefer-object-from-entries": "error",

	"unicorn/prefer-object-iterable-methods": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-observer-apis": "off",

	"unicorn/prefer-optional-catch-binding": "error",

	// TODO enable in future
	// "unicorn/prefer-options-parameter": "error",

	// TODO enable in future
	// "unicorn/prefer-private-class-fields": "error",

	"unicorn/prefer-promise-static-methods": "error",

	// TODO Enable in future
	// "unicorn/prefer-promise-try": "error",

	// TODO Enable in future
	// "unicorn/prefer-promise-with-resolvers": "error",

	"unicorn/prefer-prototype-methods": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-query-selector": "error",

	// TODO Enable in future
	// "unicorn/prefer-queue-microtask": "error",

	// No need
	"unicorn/prefer-reflect-apply": "error",

	"unicorn/prefer-regexp-escape": "error",

	"unicorn/prefer-regexp-exec": "error",

	"unicorn/prefer-regexp-test": "error",

	"unicorn/prefer-response-static-json": "error",

	// No need
	// "unicorn/prefer-scoped-selector": "off",

	// TODO No need
	// "unicorn/prefer-set-has": "off",

	"unicorn/prefer-set-methods": "error",

	// TODO No need
	// "unicorn/prefer-set-size": "off",

	// No need
	// "unicorn/prefer-short-arrow-method": "off",

	"unicorn/prefer-short-escape-sequences": "error",

	// TODO enable in the next major release
	// "unicorn/prefer-simple-condition-first": "error",

	"unicorn/prefer-simple-sort-comparator": "error",

	"unicorn/prefer-simplified-conditions": "error",

	"unicorn/prefer-single-array-predicate": "error",

	// No need
	// "unicorn/prefer-single-call": "off",

	"unicorn/prefer-single-object-destructuring": "error",

	"unicorn/prefer-single-replace": "error",

	"unicorn/prefer-smaller-scope": "error",

	"unicorn/prefer-split-limit": "error",

	"unicorn/prefer-spread": "error",

	// TODO enable in future
	// "unicorn/prefer-string-match-all": "error",

	"unicorn/prefer-string-pad-start-end": "error",

	// No need
	// "unicorn/prefer-string-raw": "error"

	"unicorn/prefer-string-repeat": "error",

	"unicorn/prefer-string-replace-all": "error",

	"unicorn/prefer-string-slice": "error",

	"unicorn/prefer-string-starts-ends-with": "error",

	"unicorn/prefer-string-trim-start-end": "error",

	"unicorn/prefer-structured-clone": "error",

	// No need
	// "unicorn/prefer-switch": "error",

	// TODO Enable in future
	// "unicorn/prefer-temporal": "error",

	// TODO Enable in future
	// "unicorn/prefer-temporal-conversion": "error",

	"unicorn/prefer-ternary": ["error", "only-single-line"],

	"unicorn/prefer-then-catch": "error",

	// Not here, define only for `browsers`
	// "unicorn/prefer-toggle-attribute": "error",

	"unicorn/prefer-top-level-await": "error",

	// No need
	// "unicorn/prefer-type-error": "error",

	// TODO Maybe move to typescript?
	"unicorn/prefer-type-literal-last": "error",

	// TODO Enable in future
	// "unicorn/prefer-uint8array-base64": "error",

	// TODO Enable in future
	// "unicorn/prefer-uint8array-hex": "error",

	"unicorn/prefer-unary-minus": "error",

	"unicorn/prefer-unicode-code-point-escapes": "error",

	// TODO enable in future
	// "unicorn/prefer-url-can-parse": "error",

	"unicorn/prefer-url-href": "error",

	"unicorn/prefer-url-search-parameters": "error",

	"unicorn/prefer-while-loop-condition": "error",

	"unicorn/relative-url-style": ["error", "always"],

	// No need
	// "unicorn/require-array-join-separator": "error",

	// No need
	// "unicorn/require-array-sort-compare": "error",

	// Not here, define only for `browsers`
	// "unicorn/require-css-escape": "error",

	// No need
	// "unicorn/require-frontmatter-fields": "off",

	"unicorn/require-module-attributes": "error",

	"unicorn/require-module-specifiers": "error",

	// Not here, define only for `browsers`
	// "unicorn/require-passive-events": "error",

	// No need
	// "unicorn/require-post-message-target-origin": "error",

	"unicorn/require-proxy-trap-boolean-return": "error",

	// We have prettier
	// "unicorn/require-spread-parentheses": "off",

	"unicorn/require-text-decoder-streaming": "error",

	// TODO enable in future
	// "unicorn/single-line-block-comment-style": "error",

	// No need
	// "unicorn/string-content": "off",

	// No need
	// "unicorn/switch-case-braces": "off",

	// TODO maybe?
	// No need
	// "unicorn/switch-case-break-position": "off",

	// No need
	// "unicorn/template-indent": "off",

	"unicorn/text-encoding-identifier-case": "error",

	"unicorn/throw-new-error": "error",

	// No need
	// "unicorn/try-complexity": "off"
};

/** @type {import("eslint").Linter.Config["rules"]} */
const importRules = {
	...importPlugin.flatConfigs.recommended.rules,

	// From recommended
	// "import-x/export": "error",

	// No need
	// "import-x/no-deprecated": "off",

	// No need, we have `unicorn/require-module-specifiers`
	// "import-x/no-empty-named-blocks": "off",

	"import-x/no-extraneous-dependencies": "error",

	"import-x/no-mutable-exports": "error",

	"import-x/no-named-as-default": "error",

	// No need
	// "import-x/no-named-as-default-member": "off",

	// No need
	// "import-x/no-rename-default": "error",

	// No need
	// "import-x/no-unused-modules": "error",

	"import-x/no-amd": "error",

	// No need
	// "import-x/no-commonjs": "off",

	// No need
	// "import-x/no-import-module-exports": "off",

	// No need
	// "import-x/no-nodejs-modules": "off",

	// No need
	// "import-x/unambiguous": "off",

	// No need
	// "import-x/avoid-barrel-files": "off",

	// No need
	// "import-x/avoid-importing-barrel-files": "off",

	// No need
	// "import-x/avoid-namespace-import": "off",

	// No need
	// "import-x/avoid-re-export-all": "off",

	// From recommended
	// "import-x/default": "error",

	// From recommended
	// "import-x/named": "error",

	// From recommended
	// "import-x/namespace": "error",

	"import-x/no-absolute-path": "error",

	// No need
	// "import-x/no-cycle": "off",

	// No need
	// "import-x/no-dynamic-require": "off",

	// No need
	// "import-x/no-internal-modules": "off",

	// No need
	// "import-x/no-relative-packages": "off",

	// No need
	// "import-x/no-relative-parent-imports": "off",

	// No need
	// "import-x/no-restricted-paths": "off",

	"import-x/no-self-import": "error",

	// From recommended
	"import-x/no-unresolved": [
		"error",
		{ ignore: ["^eslint/config$", "^typescript-eslint$"], commonjs: true },
	],

	// No need
	// "import-x/no-useless-path-segments": "off",

	// No need
	// "import-x/no-webpack-loader-syntax": "off",

	"import-x/consistent-type-specifier-style": ["error", "prefer-inline"],

	// No need
	// "import-x/dynamic-import-chunkname": "off",

	// No need
	// "import-x/exports-last": "off",

	// Not here
	// "import-x/extensions": ["error", "always", { ignorePackages: true }],

	"import-x/first": "error",

	// No need
	// "import-x/group-exports": "off",

	// No need
	// "import-x/max-dependencies": "off",

	// No need
	// We have `@stylistic/padding-line-between-statements`
	// "import-x/newline-after-import": "off",

	// No need
	// "import-x/no-anonymous-default-export": "off",

	// No need
	// "import-x/no-default-export": "off",

	// No need
	// We have `no-duplicate-imports` rule
	"import-x/no-duplicates": "off",

	// No need
	// "import-x/no-named-default": "off",

	// No need
	// "import-x/no-named-export": "off",

	// No need
	// "import-x/no-namespace": "off",

	// No need
	// "import-x/no-unassigned-import": "off",

	"import-x/order": [
		"error",
		{
			named: {
				enabled: true,
				import: true,
				export: true,
				require: true,
				cjsExports: true,
				types: "mixed",
			},
			alphabetize: { order: "asc" },
		},
	],

	// No need
	// "import-x/prefer-default-export": "off",

	// No need
	// "import-x/prefer-namespace-import": "off",
};

const needTypescriptSupport = isTypescriptInstalled();
const extensions = needTypescriptSupport ? allExtensions : javascriptExtensions;

/** @type {import("eslint").Linter.Config} */
const baseConfig = {
	...javascriptConfig.configs.recommended,
	files: [`**/*.{${extensions.map((item) => item.slice(1)).join(",")}}`],
	ignores: ["**/*.d.ts"],
	settings: {
		"import-x/extensions": extensions,
		"import-x/ignore": [
			"eslint-plugin-.*",
			"\\.(coffee|scss|css|less|hbs|svg|md|jpg|jpeg|png|gif|webp|avif)$",
		],
		"import-x/resolver": {
			node: {
				extensions: [...extensions],
			},
		},
	},
	plugins: {
		unicorn: unicornPlugin,
		"import-x": importPlugin,
	},
	linterOptions: {
		reportUnusedDisableDirectives: "error",
		reportUnusedInlineConfigs: "error",
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

/** @typedef {2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026} Year */

/**
 * @param {Year | 5} esVersion es version
 * @returns {import("eslint").Linter.Config} config
 */
function getConfig(esVersion) {
	const config = {
		...baseConfig,
		name: `javascript/es${esVersion}`,
		languageOptions: {
			ecmaVersion: esVersion,
			globals: {
				...globals[`es${esVersion}`],
			},
		},
		rules: {
			...baseConfig.rules,
		},
	};

	if (esVersion === 5) {
		config.rules["arrow-body-style"] = "off";
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
		config.rules["unicorn/prefer-includes"] = "off";
		config.rules["unicorn/no-array-for-each"] = "off";
		config.rules["unicorn/no-for-each"] = "off";
	}

	if (esVersion < 2018) {
		config.rules["prefer-object-spread"] = "off";
	}

	if (esVersion < 2019) {
		config.rules["unicorn/prefer-object-from-entries"] = "off";
		config.rules["unicorn/prefer-array-flat"] = "off";
		config.rules["unicorn/prefer-array-flat-map"] = "off";
		config.rules["unicorn/prefer-string-trim-start-end"] = "off";
		config.rules["unicorn/prefer-optional-catch-binding"] = "off";
	}

	if (esVersion < 2020) {
		config.rules["unicorn/prefer-bigint-literals"] = "off";
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
		config.rules["unicorn/prefer-class-fields"] = "off";
	}

	if (esVersion < 2023) {
		config.rules["unicorn/no-array-sort"] = "off";
	}

	// `RegExp.escape()` is an ES2026 API (Node.js 24+), the parser setting alone
	// doesn't guarantee its availability at runtime, so the autofix would break older targets
	if (esVersion < 2026) {
		config.rules["unicorn/prefer-regexp-escape"] = "off";
	}

	return config;
}

/** @type {Record<"javascript/es5" | "javascript/recommended" | `javascript/es${Year}`, import("eslint").Linter.Config>} */
const configs = {};
const esVersions = Array.from({ length: 12 }, (_x, i) => 15 + i);

for (const [i, esVersion] of esVersions.entries()) {
	const year = /** @type {Year} */ (2000 + esVersion);
	const config = getConfig(year);

	configs[`javascript/es${year}`] = config;

	if (i === esVersions.length - 1) {
		configs["javascript/recommended"] = config;
	}
}

configs["javascript/es5"] = getConfig(5);

export default configs;
