{
  "settings": {
    "import/extensions": [
      ".js",
      ".jsx",
      ".cjs",
      ".mjs",
      ".ts",
      ".tsx",
      ".cts",
      ".mts"
    ],
    "import/ignore": [
      "eslint-plugin-.*",
      "\\.(coffee|scss|css|less|hbs|svg|md|jpg|jpeg|png|gif|webp|avif)$"
    ],
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".cjs",
          ".mjs",
          ".ts",
          ".tsx",
          ".cts",
          ".mts"
        ]
      }
    },
    "jsdoc": {
      "mode": "typescript",
      "tagNamePreference": {
        "memberof": {
          "message": "@memberof currently not supported in TypeScript"
        },
        "yields": {
          "message": "@yields currently not supported in TypeScript"
        },
        "member": {
          "message": "@member currently not supported in TypeScript"
        },
        "extends": "extends",
        "return": "returns",
        "constructor": "constructor",
        "prop": "property",
        "property": "property",
        "arg": "param",
        "argument": "param",
        "param": "param",
        "augments": "extends",
        "description": false,
        "desc": false,
        "inheritdoc": false,
        "class": "constructor",
        "returns": "returns"
      },
      "overrideReplacesDocs": false
    }
  },
  "linterOptions": {
    "reportUnusedDisableDirectives": 2,
    "reportUnusedInlineConfigs": 2
  },
  "rules": {
    "n/no-deprecated-api": [
      2
    ],
    "n/no-exports-assign": [
      2
    ],
    "n/no-extraneous-import": [
      0
    ],
    "n/no-extraneous-require": [
      0
    ],
    "n/no-missing-import": [
      0
    ],
    "n/no-missing-require": [
      0
    ],
    "n/no-process-exit": [
      2
    ],
    "n/no-unpublished-bin": [
      2
    ],
    "n/no-unpublished-import": [
      2
    ],
    "n/no-unpublished-require": [
      2
    ],
    "n/no-unsupported-features/es-builtins": [
      2
    ],
    "n/no-unsupported-features/es-syntax": [
      2,
      {
        "ignores": [
          "modules",
          "error-cause"
        ]
      }
    ],
    "n/no-unsupported-features/node-builtins": [
      2
    ],
    "n/process-exit-as-throw": [
      2
    ],
    "n/hashbang": [
      2
    ],
    "n/file-extension-in-import": [
      0
    ],
    "n/prefer-global/buffer": [
      2,
      "always"
    ],
    "n/prefer-global/console": [
      2,
      "always"
    ],
    "n/prefer-global/crypto": [
      2,
      "always"
    ],
    "n/prefer-global/process": [
      2,
      "always"
    ],
    "n/prefer-global/text-decoder": [
      2,
      "always"
    ],
    "n/prefer-global/text-encoder": [
      2,
      "always"
    ],
    "n/prefer-global/timers": [
      2,
      "always"
    ],
    "n/prefer-global/url": [
      2,
      "always"
    ],
    "n/prefer-global/url-search-params": [
      2,
      "always"
    ],
    "n/prefer-node-protocol": [
      2
    ],
    "import/extensions": [
      2,
      "always",
      {
        "ignorePackages": true,
        "checkTypeImports": true
      }
    ],
    "constructor-super": [
      2
    ],
    "for-direction": [
      2
    ],
    "getter-return": [
      2,
      {
        "allowImplicit": false
      }
    ],
    "no-async-promise-executor": [
      2
    ],
    "no-case-declarations": [
      2
    ],
    "no-class-assign": [
      2
    ],
    "no-compare-neg-zero": [
      2
    ],
    "no-cond-assign": [
      2,
      "except-parens"
    ],
    "no-const-assign": [
      2
    ],
    "no-constant-binary-expression": [
      2
    ],
    "no-constant-condition": [
      2,
      {
        "checkLoops": "allExceptWhileTrue"
      }
    ],
    "no-control-regex": [
      2
    ],
    "no-debugger": [
      2
    ],
    "no-delete-var": [
      2
    ],
    "no-dupe-args": [
      2
    ],
    "no-dupe-class-members": [
      2
    ],
    "no-dupe-else-if": [
      2
    ],
    "no-dupe-keys": [
      2
    ],
    "no-duplicate-case": [
      2
    ],
    "no-empty": [
      2,
      {
        "allowEmptyCatch": false
      }
    ],
    "no-empty-character-class": [
      2
    ],
    "no-empty-pattern": [
      2,
      {
        "allowObjectPatternsAsParameters": false
      }
    ],
    "no-empty-static-block": [
      2
    ],
    "no-ex-assign": [
      2
    ],
    "no-extra-boolean-cast": [
      2,
      {}
    ],
    "no-fallthrough": [
      2,
      {
        "allowEmptyCase": false,
        "reportUnusedFallthroughComment": false
      }
    ],
    "no-func-assign": [
      2
    ],
    "no-global-assign": [
      2,
      {
        "exceptions": []
      }
    ],
    "no-import-assign": [
      2
    ],
    "no-invalid-regexp": [
      2,
      {}
    ],
    "no-irregular-whitespace": [
      2,
      {
        "skipComments": false,
        "skipJSXText": false,
        "skipRegExps": false,
        "skipStrings": true,
        "skipTemplates": false
      }
    ],
    "no-loss-of-precision": [
      2
    ],
    "no-misleading-character-class": [
      2,
      {
        "allowEscape": false
      }
    ],
    "no-new-native-nonconstructor": [
      2
    ],
    "no-nonoctal-decimal-escape": [
      2
    ],
    "no-obj-calls": [
      2
    ],
    "no-octal": [
      2
    ],
    "no-prototype-builtins": [
      2
    ],
    "no-redeclare": [
      2,
      {
        "builtinGlobals": true
      }
    ],
    "no-regex-spaces": [
      2
    ],
    "no-self-assign": [
      2,
      {
        "props": true
      }
    ],
    "no-setter-return": [
      2
    ],
    "no-shadow-restricted-names": [
      2,
      {
        "reportGlobalThis": false
      }
    ],
    "no-sparse-arrays": [
      2
    ],
    "no-this-before-super": [
      2
    ],
    "no-undef": [
      2,
      {
        "typeof": false
      }
    ],
    "no-unexpected-multiline": [
      2
    ],
    "no-unreachable": [
      2
    ],
    "no-unsafe-finally": [
      2
    ],
    "no-unsafe-negation": [
      2,
      {
        "enforceForOrderingRelations": false
      }
    ],
    "no-unsafe-optional-chaining": [
      2,
      {
        "disallowArithmeticOperators": false
      }
    ],
    "no-unused-labels": [
      2
    ],
    "no-unused-private-class-members": [
      2
    ],
    "no-unused-vars": [
      2,
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "ignoreRestSiblings": true,
        "ignoreClassWithStaticInitBlock": false,
        "reportUsedIgnorePattern": false
      }
    ],
    "no-useless-backreference": [
      2
    ],
    "no-useless-catch": [
      2
    ],
    "no-useless-escape": [
      2,
      {
        "allowRegexCharacters": []
      }
    ],
    "no-with": [
      2
    ],
    "require-yield": [
      2
    ],
    "use-isnan": [
      2,
      {
        "enforceForIndexOf": false,
        "enforceForSwitchCase": true
      }
    ],
    "valid-typeof": [
      2,
      {
        "requireStringLiterals": false
      }
    ],
    "array-callback-return": [
      2,
      {
        "allowImplicit": true,
        "checkForEach": false,
        "allowVoid": false
      }
    ],
    "no-constructor-return": [
      2
    ],
    "no-duplicate-imports": [
      2,
      {
        "includeExports": false,
        "allowSeparateTypeImports": false
      }
    ],
    "no-inner-declarations": [
      2,
      "functions",
      {
        "blockScopedFunctions": "allow"
      }
    ],
    "no-promise-executor-return": [
      2,
      {
        "allowVoid": false
      }
    ],
    "no-self-compare": [
      2
    ],
    "no-template-curly-in-string": [
      2
    ],
    "no-unassigned-vars": [
      2
    ],
    "no-unmodified-loop-condition": [
      2
    ],
    "no-unreachable-loop": [
      2,
      {
        "ignore": []
      }
    ],
    "no-use-before-define": [
      2,
      {
        "classes": true,
        "functions": true,
        "variables": true,
        "allowNamedExports": false,
        "enums": true,
        "typedefs": true,
        "ignoreTypeReferences": true
      }
    ],
    "accessor-pairs": [
      2,
      {
        "enforceForTSTypes": false,
        "enforceForClassMembers": true,
        "getWithoutSet": false,
        "setWithoutGet": true
      }
    ],
    "arrow-body-style": [
      2,
      "as-needed"
    ],
    "block-scoped-var": [
      2
    ],
    "camelcase": [
      2,
      {
        "allow": [
          "^__webpack",
          "^__non_webpack",
          "^__system",
          "^_stream",
          "string_decoder"
        ],
        "ignoreDestructuring": false,
        "ignoreGlobals": false,
        "ignoreImports": false,
        "properties": "always"
      }
    ],
    "default-case-last": [
      2
    ],
    "default-param-last": [
      2
    ],
    "dot-notation": [
      2,
      {
        "allowKeywords": true,
        "allowPattern": ""
      }
    ],
    "eqeqeq": [
      2
    ],
    "func-name-matching": [
      2,
      "always",
      {
        "considerPropertyDescriptor": true,
        "includeCommonJSModuleExports": false
      }
    ],
    "func-names": [
      2,
      "as-needed",
      {}
    ],
    "func-style": [
      2,
      "declaration",
      {
        "allowArrowFunctions": true,
        "allowTypeAnnotation": true,
        "overrides": {}
      }
    ],
    "grouped-accessor-pairs": [
      2,
      "anyOrder",
      {
        "enforceForTSTypes": false
      }
    ],
    "id-length": [
      2,
      {
        "exceptionPatterns": [],
        "exceptions": [
          "$",
          "i",
          "j",
          "k",
          "v",
          "m",
          "n",
          "t",
          "l",
          "r",
          "_",
          "a",
          "b"
        ],
        "min": 2,
        "properties": "never",
        "max": null
      }
    ],
    "id-match": [
      2,
      "^[$a-zA-Z_][$a-zA-Z0-9_]*$",
      {
        "classFields": false,
        "ignoreDestructuring": false,
        "onlyDeclarations": false,
        "properties": true
      }
    ],
    "logical-assignment-operators": [
      2
    ],
    "new-cap": [
      2,
      {
        "capIsNew": true,
        "capIsNewExceptions": [
          "Array",
          "Boolean",
          "Date",
          "Error",
          "Function",
          "Number",
          "Object",
          "RegExp",
          "String",
          "Symbol",
          "BigInt"
        ],
        "newIsCap": true,
        "newIsCapExceptions": [],
        "properties": true,
        "capIsNewExceptionPattern": "^.+Type$"
      }
    ],
    "no-alert": [
      2
    ],
    "no-array-constructor": [
      2
    ],
    "no-caller": [
      2
    ],
    "no-console": [
      2,
      {}
    ],
    "no-div-regex": [
      2
    ],
    "no-else-return": [
      2,
      {
        "allowElseIf": true
      }
    ],
    "no-empty-function": [
      2,
      {
        "allow": [
          "functions",
          "arrowFunctions",
          "asyncFunctions",
          "methods",
          "asyncMethods",
          "generatorMethods"
        ]
      }
    ],
    "no-eq-null": [
      2
    ],
    "no-eval": [
      2,
      {
        "allowIndirect": false
      }
    ],
    "no-extend-native": [
      2,
      {
        "exceptions": []
      }
    ],
    "no-extra-bind": [
      2
    ],
    "no-extra-label": [
      2
    ],
    "no-implicit-coercion": [
      2,
      {
        "allow": [],
        "boolean": true,
        "disallowTemplateShorthand": false,
        "number": true,
        "string": true
      }
    ],
    "no-implied-eval": [
      2
    ],
    "no-iterator": [
      2
    ],
    "no-label-var": [
      2
    ],
    "no-lone-blocks": [
      2
    ],
    "no-lonely-if": [
      2
    ],
    "no-loop-func": [
      2
    ],
    "no-multi-str": [
      2
    ],
    "no-new": [
      2
    ],
    "no-new-func": [
      2
    ],
    "no-new-wrappers": [
      2
    ],
    "no-object-constructor": [
      2
    ],
    "no-octal-escape": [
      2
    ],
    "no-proto": [
      2
    ],
    "no-return-assign": [
      2,
      "except-parens"
    ],
    "no-script-url": [
      2
    ],
    "no-sequences": [
      2,
      {
        "allowInParentheses": true
      }
    ],
    "no-throw-literal": [
      2
    ],
    "no-undef-init": [
      2
    ],
    "no-unneeded-ternary": [
      2,
      {
        "defaultAssignment": false
      }
    ],
    "no-unused-expressions": [
      2,
      {
        "allowShortCircuit": false,
        "allowTernary": false,
        "allowTaggedTemplates": true,
        "enforceForJSX": false,
        "ignoreDirectives": false
      }
    ],
    "no-useless-call": [
      2
    ],
    "no-useless-computed-key": [
      2,
      {
        "enforceForClassMembers": true
      }
    ],
    "no-useless-concat": [
      2
    ],
    "no-useless-rename": [
      2,
      {
        "ignoreDestructuring": false,
        "ignoreImport": false,
        "ignoreExport": false
      }
    ],
    "no-useless-return": [
      2
    ],
    "no-var": [
      2
    ],
    "no-void": [
      2,
      {
        "allowAsStatement": false
      }
    ],
    "no-warning-comments": [
      2,
      {
        "location": "start",
        "terms": [
          "@ts-ignore"
        ]
      }
    ],
    "object-shorthand": [
      2
    ],
    "one-var": [
      2,
      "never"
    ],
    "operator-assignment": [
      2,
      "always"
    ],
    "prefer-arrow-callback": [
      2,
      {
        "allowNamedFunctions": false,
        "allowUnboundThis": true
      }
    ],
    "prefer-const": [
      2,
      {
        "destructuring": "all",
        "ignoreReadBeforeAssign": true
      }
    ],
    "prefer-destructuring": [
      2,
      {
        "VariableDeclarator": {
          "array": true,
          "object": true
        },
        "AssignmentExpression": {
          "array": true,
          "object": false
        }
      },
      {
        "enforceForRenamedProperties": false
      }
    ],
    "prefer-exponentiation-operator": [
      2
    ],
    "prefer-numeric-literals": [
      2
    ],
    "prefer-object-has-own": [
      2
    ],
    "prefer-object-spread": [
      2
    ],
    "prefer-promise-reject-errors": [
      2,
      {
        "allowEmptyReject": true
      }
    ],
    "prefer-regex-literals": [
      2,
      {
        "disallowRedundantWrapping": false
      }
    ],
    "prefer-rest-params": [
      2
    ],
    "prefer-spread": [
      2
    ],
    "prefer-template": [
      2
    ],
    "preserve-caught-error": [
      2,
      {
        "requireCatchParameter": false
      }
    ],
    "radix": [
      2,
      "always"
    ],
    "strict": [
      2,
      "global"
    ],
    "symbol-description": [
      2
    ],
    "yoda": [
      2,
      "never",
      {
        "exceptRange": false,
        "onlyEquality": false
      }
    ],
    "unicode-bom": [
      2,
      "never"
    ],
    "unicorn/catch-error-name": [
      2,
      {
        "name": "err",
        "ignore": [
          {},
          {}
        ]
      }
    ],
    "unicorn/consistent-assert": [
      2
    ],
    "unicorn/consistent-date-clone": [
      2
    ],
    "unicorn/consistent-destructuring": [
      0
    ],
    "unicorn/consistent-empty-array-spread": [
      2
    ],
    "unicorn/consistent-template-literal-escape": [
      2
    ],
    "unicorn/error-message": [
      2
    ],
    "unicorn/escape-case": [
      2,
      "uppercase"
    ],
    "unicorn/filename-case": [
      0,
      {
        "cases": {
          "kebabCase": true,
          "pascalCase": true
        },
        "ignore": [
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {}
        ]
      }
    ],
    "unicorn/new-for-builtins": [
      2
    ],
    "unicorn/no-abusive-eslint-disable": [
      2
    ],
    "unicorn/no-accessor-recursion": [
      2
    ],
    "unicorn/no-array-for-each": [
      2
    ],
    "unicorn/no-array-method-this-argument": [
      2
    ],
    "unicorn/no-array-sort": [
      2,
      {
        "allowExpressionStatement": true
      }
    ],
    "unicorn/no-await-in-promise-methods": [
      2
    ],
    "unicorn/no-console-spaces": [
      2
    ],
    "unicorn/no-hex-escape": [
      2
    ],
    "unicorn/no-instanceof-builtins": [
      2,
      {
        "useErrorIsError": false,
        "strategy": "loose",
        "include": [],
        "exclude": []
      }
    ],
    "unicorn/no-invalid-fetch-options": [
      2
    ],
    "unicorn/no-invalid-remove-event-listener": [
      2
    ],
    "unicorn/no-lonely-if": [
      2
    ],
    "unicorn/no-new-array": [
      2
    ],
    "unicorn/no-single-promise-in-promise-methods": [
      2
    ],
    "unicorn/no-thenable": [
      2
    ],
    "unicorn/no-unnecessary-array-flat-depth": [
      2
    ],
    "unicorn/no-unnecessary-array-splice-count": [
      2
    ],
    "unicorn/no-unnecessary-await": [
      2
    ],
    "unicorn/no-unnecessary-polyfills": [
      2
    ],
    "unicorn/no-unnecessary-slice-end": [
      2
    ],
    "unicorn/no-useless-collection-argument": [
      2
    ],
    "unicorn/no-useless-error-capture-stack-trace": [
      2
    ],
    "unicorn/no-useless-fallback-in-spread": [
      2
    ],
    "unicorn/no-useless-iterator-to-array": [
      2
    ],
    "unicorn/no-useless-length-check": [
      2
    ],
    "unicorn/no-useless-promise-resolve-reject": [
      2
    ],
    "unicorn/no-useless-spread": [
      2
    ],
    "unicorn/no-zero-fractions": [
      2
    ],
    "unicorn/prefer-array-find": [
      2,
      {
        "checkFromLast": true
      }
    ],
    "unicorn/prefer-array-flat": [
      2,
      {
        "functions": []
      }
    ],
    "unicorn/prefer-array-flat-map": [
      2
    ],
    "unicorn/prefer-array-index-of": [
      2
    ],
    "unicorn/prefer-array-some": [
      2
    ],
    "unicorn/prefer-bigint-literals": [
      2
    ],
    "unicorn/prefer-blob-reading-methods": [
      2
    ],
    "unicorn/prefer-class-fields": [
      2
    ],
    "unicorn/prefer-date-now": [
      2
    ],
    "unicorn/prefer-default-parameters": [
      2
    ],
    "unicorn/prefer-event-target": [
      2
    ],
    "unicorn/prefer-export-from": [
      2,
      {
        "ignoreUsedVariables": false
      }
    ],
    "unicorn/prefer-global-this": [
      2
    ],
    "unicorn/prefer-includes": [
      2
    ],
    "unicorn/prefer-logical-operator-over-ternary": [
      2
    ],
    "unicorn/prefer-modern-math-apis": [
      2
    ],
    "unicorn/prefer-native-coercion-functions": [
      2
    ],
    "unicorn/prefer-negative-index": [
      2
    ],
    "unicorn/prefer-number-properties": [
      2,
      {
        "checkInfinity": false,
        "checkNaN": true
      }
    ],
    "unicorn/prefer-object-from-entries": [
      2,
      {
        "functions": []
      }
    ],
    "unicorn/prefer-optional-catch-binding": [
      2
    ],
    "unicorn/prefer-prototype-methods": [
      2
    ],
    "unicorn/prefer-regexp-test": [
      2
    ],
    "unicorn/prefer-response-static-json": [
      2
    ],
    "unicorn/prefer-spread": [
      2
    ],
    "unicorn/prefer-string-replace-all": [
      2
    ],
    "unicorn/prefer-string-slice": [
      2
    ],
    "unicorn/prefer-string-starts-ends-with": [
      2
    ],
    "unicorn/prefer-string-trim-start-end": [
      2
    ],
    "unicorn/prefer-structured-clone": [
      2,
      {
        "functions": []
      }
    ],
    "unicorn/prefer-ternary": [
      2,
      "only-single-line"
    ],
    "unicorn/prefer-top-level-await": [
      2
    ],
    "unicorn/relative-url-style": [
      2,
      "always"
    ],
    "unicorn/require-module-attributes": [
      2
    ],
    "unicorn/require-module-specifiers": [
      2
    ],
    "unicorn/text-encoding-identifier-case": [
      2,
      {
        "withDash": false
      }
    ],
    "unicorn/throw-new-error": [
      2
    ],
    "import/no-unresolved": [
      2,
      {
        "ignore": [
          "^eslint/config$",
          "^typescript-eslint$"
        ],
        "commonjs": true,
        "caseSensitive": true,
        "caseSensitiveStrict": false
      }
    ],
    "import/named": [
      2
    ],
    "import/namespace": [
      2
    ],
    "import/default": [
      2
    ],
    "import/export": [
      2
    ],
    "import/no-named-as-default": [
      2
    ],
    "import/no-named-as-default-member": [
      2
    ],
    "import/no-duplicates": [
      0
    ],
    "import/no-extraneous-dependencies": [
      2
    ],
    "import/no-mutable-exports": [
      2
    ],
    "import/no-amd": [
      2
    ],
    "import/no-absolute-path": [
      2
    ],
    "import/no-self-import": [
      2
    ],
    "import/consistent-type-specifier-style": [
      2,
      "prefer-inline"
    ],
    "import/first": [
      2
    ],
    "import/order": [
      2,
      {
        "named": {
          "enabled": true,
          "import": true,
          "export": true,
          "require": true,
          "cjsExports": true,
          "types": "mixed"
        },
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": false,
          "orderImportKind": "ignore"
        },
        "distinctGroup": true,
        "sortTypesGroup": false,
        "warnOnUnassignedImports": false
      }
    ],
    "jsdoc/check-access": [
      2
    ],
    "jsdoc/check-alignment": [
      2
    ],
    "jsdoc/check-examples": [
      0
    ],
    "jsdoc/check-indentation": [
      2
    ],
    "jsdoc/check-line-alignment": [
      2,
      "never"
    ],
    "jsdoc/check-param-names": [
      2
    ],
    "jsdoc/check-property-names": [
      2
    ],
    "jsdoc/check-syntax": [
      0
    ],
    "jsdoc/check-tag-names": [
      2,
      {
        "definedTags": [
          "jest-environment",
          "jest-environment-options"
        ]
      }
    ],
    "jsdoc/check-template-names": [
      0
    ],
    "jsdoc/check-types": [
      2
    ],
    "jsdoc/check-values": [
      2
    ],
    "jsdoc/convert-to-jsdoc-comments": [
      0
    ],
    "jsdoc/empty-tags": [
      2
    ],
    "jsdoc/escape-inline-tags": [
      2
    ],
    "jsdoc/implements-on-classes": [
      2
    ],
    "jsdoc/imports-as-dependencies": [
      0
    ],
    "jsdoc/informative-docs": [
      0
    ],
    "jsdoc/lines-before-block": [
      0
    ],
    "jsdoc/match-description": [
      0
    ],
    "jsdoc/match-name": [
      0
    ],
    "jsdoc/multiline-blocks": [
      2
    ],
    "jsdoc/no-bad-blocks": [
      2
    ],
    "jsdoc/no-blank-block-descriptions": [
      2
    ],
    "jsdoc/no-blank-blocks": [
      2
    ],
    "jsdoc/no-defaults": [
      2
    ],
    "jsdoc/no-missing-syntax": [
      0
    ],
    "jsdoc/no-multi-asterisks": [
      2
    ],
    "jsdoc/no-restricted-syntax": [
      2,
      {
        "contexts": [
          {
            "comment": "JsdocBlock:has(JsdocTypeFunction[arrow=false])",
            "message": "Please use TypeScript syntax - `(a: string, b: boolean) => number`"
          },
          {
            "comment": "JsdocBlock:has(JsdocTag[tag=/^(property|param)$/][name=/[\\[\\]]/])",
            "message": "Please use `@property {string=} property`/`@param {string=} arg` instead `[arg]` for optional properties and parameters"
          },
          {
            "comment": "JsdocBlock:has(JsdocTypeUnknown)",
            "message": "Please use `unknown` or `any` (or `EXPECTED_ANY`) type"
          },
          {
            "comment": "JsdocBlock:has(JsdocTag[tag!=/^(typedef|template|param)$/]:has(JsdocTypeName[value=/^(Object|object)$/]))",
            "message": "Please use provide types for object  - `{ property: number:, result: () => number}` instead `Object`/`object` or use `EXPECTED_OBJECT` type"
          },
          {
            "comment": "JsdocBlock:has(JsdocTag[tag=typedef][parsedType.type!=JsdocTypeName]:has(JsdocTypeName[value=/^(Object|object)$/]))",
            "message": "Please use provide types for object  - `{ property: number:, result: () => number}` instead `Object`/`object` or use `EXPECTED_OBJECT` type"
          }
        ]
      }
    ],
    "jsdoc/no-types": [
      0
    ],
    "jsdoc/no-undefined-types": [
      0
    ],
    "jsdoc/prefer-import-tag": [
      0
    ],
    "jsdoc/reject-any-type": [
      2
    ],
    "jsdoc/reject-function-type": [
      2
    ],
    "jsdoc/require-asterisk-prefix": [
      2
    ],
    "jsdoc/require-description": [
      0
    ],
    "jsdoc/require-description-complete-sentence": [
      0
    ],
    "jsdoc/require-example": [
      0
    ],
    "jsdoc/require-file-overview": [
      0
    ],
    "jsdoc/require-hyphen-before-param-description": [
      2,
      "never"
    ],
    "jsdoc/require-jsdoc": [
      2
    ],
    "jsdoc/require-next-description": [
      0
    ],
    "jsdoc/require-next-type": [
      2
    ],
    "jsdoc/require-param": [
      2
    ],
    "jsdoc/require-param-description": [
      2
    ],
    "jsdoc/require-param-name": [
      2
    ],
    "jsdoc/require-param-type": [
      2
    ],
    "jsdoc/require-property": [
      2
    ],
    "jsdoc/require-property-description": [
      2
    ],
    "jsdoc/require-property-name": [
      2
    ],
    "jsdoc/require-property-type": [
      2
    ],
    "jsdoc/require-rejects": [
      0
    ],
    "jsdoc/require-returns": [
      2
    ],
    "jsdoc/require-returns-check": [
      0
    ],
    "jsdoc/require-returns-description": [
      2
    ],
    "jsdoc/require-returns-type": [
      2
    ],
    "jsdoc/require-tags": [
      0
    ],
    "jsdoc/require-template": [
      2
    ],
    "jsdoc/require-template-description": [
      0
    ],
    "jsdoc/require-throws": [
      0
    ],
    "jsdoc/require-throws-description": [
      0
    ],
    "jsdoc/require-throws-type": [
      2
    ],
    "jsdoc/require-yields": [
      2
    ],
    "jsdoc/require-yields-check": [
      2
    ],
    "jsdoc/require-yields-description": [
      0
    ],
    "jsdoc/require-yields-type": [
      2
    ],
    "jsdoc/sort-tags": [
      0
    ],
    "jsdoc/tag-lines": [
      2
    ],
    "jsdoc/text-escaping": [
      0
    ],
    "jsdoc/ts-method-signature-style": [
      0
    ],
    "jsdoc/ts-no-empty-object-type": [
      2
    ],
    "jsdoc/ts-no-unnecessary-template-expression": [
      0
    ],
    "jsdoc/ts-prefer-function-type": [
      0
    ],
    "jsdoc/type-formatting": [
      2,
      {
        "objectTypeBracketSpacing": " ",
        "objectFieldSeparator": "comma-and-linebreak",
        "objectFieldSeparatorTrailingPunctuation": true,
        "trailingPunctuationMultilineOnly": true
      }
    ],
    "jsdoc/valid-types": [
      0
    ],
    "prettier/prettier": [
      2
    ],
    "curly": [
      2,
      "multi-line",
      "consistent"
    ],
    "@stylistic/lines-between-class-members": [
      2,
      "always",
      {
        "exceptAfterOverload": true,
        "exceptAfterSingleLine": false
      }
    ],
    "@stylistic/quotes": [
      2,
      "double",
      {
        "allowTemplateLiterals": "never",
        "avoidEscape": true,
        "ignoreStringLiterals": false
      }
    ],
    "@stylistic/spaced-comment": [
      2,
      "always",
      {
        "line": {
          "markers": [
            "=",
            "!"
          ],
          "exceptions": [
            "-",
            "+"
          ]
        },
        "block": {
          "markers": [
            "=",
            "!"
          ],
          "exceptions": [
            "-",
            "+"
          ],
          "balanced": true
        }
      }
    ],
    "@stylistic/padding-line-between-statements": [
      2,
      {
        "blankLine": "always",
        "prev": [
          "cjs-export"
        ],
        "next": "*"
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": [
          "cjs-export"
        ]
      },
      {
        "blankLine": "any",
        "prev": [
          "cjs-export"
        ],
        "next": [
          "cjs-export"
        ]
      },
      {
        "blankLine": "always",
        "prev": [
          "cjs-import"
        ],
        "next": "*"
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": [
          "cjs-import"
        ]
      },
      {
        "blankLine": "any",
        "prev": [
          "cjs-import"
        ],
        "next": [
          "cjs-import"
        ]
      },
      {
        "blankLine": "always",
        "prev": [
          "export"
        ],
        "next": "*"
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": [
          "export"
        ]
      },
      {
        "blankLine": "any",
        "prev": [
          "export"
        ],
        "next": [
          "export"
        ]
      },
      {
        "blankLine": "always",
        "prev": [
          "import"
        ],
        "next": "*"
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": [
          "import"
        ]
      },
      {
        "blankLine": "any",
        "prev": [
          "import"
        ],
        "next": [
          "import"
        ]
      },
      {
        "blankLine": "always",
        "prev": [
          "directive"
        ],
        "next": "*"
      }
    ],
    "@stylistic/lines-around-comment": [
      2,
      {
        "beforeBlockComment": false,
        "afterBlockComment": false,
        "beforeLineComment": false,
        "afterLineComment": false,
        "afterHashbangComment": true
      }
    ]
  },
  "plugins": [
    "@",
    "n:eslint-plugin-n@17.24.0",
    "import",
    "unicorn:eslint-plugin-unicorn@64.0.0",
    "jsdoc",
    "@stylistic:@stylistic/eslint-plugin@5.10.0",
    "prettier:eslint-plugin-prettier@5.5.5"
  ],
  "language": "@/js",
  "languageOptions": {
    "sourceType": "module",
    "ecmaVersion": 2023,
    "parser": "espree@10.4.0",
    "parserOptions": {
      "sourceType": "module"
    },
    "globals": {
      "__dirname": "off",
      "__filename": "off",
      "AbortController": false,
      "AbortSignal": false,
      "atob": false,
      "Blob": false,
      "BroadcastChannel": false,
      "btoa": false,
      "Buffer": false,
      "ByteLengthQueuingStrategy": false,
      "clearImmediate": false,
      "clearInterval": false,
      "clearTimeout": false,
      "CloseEvent": false,
      "CompressionStream": false,
      "console": false,
      "CountQueuingStrategy": false,
      "crypto": false,
      "Crypto": false,
      "CryptoKey": false,
      "CustomEvent": false,
      "DecompressionStream": false,
      "DOMException": false,
      "Event": false,
      "EventTarget": false,
      "exports": "off",
      "fetch": false,
      "File": false,
      "FormData": false,
      "global": false,
      "Headers": false,
      "MessageChannel": false,
      "MessageEvent": false,
      "MessagePort": false,
      "module": "off",
      "navigator": false,
      "Navigator": false,
      "performance": false,
      "Performance": false,
      "PerformanceEntry": false,
      "PerformanceMark": false,
      "PerformanceMeasure": false,
      "PerformanceObserver": false,
      "PerformanceObserverEntryList": false,
      "PerformanceResourceTiming": false,
      "process": false,
      "queueMicrotask": false,
      "ReadableByteStreamController": false,
      "ReadableStream": false,
      "ReadableStreamBYOBReader": false,
      "ReadableStreamBYOBRequest": false,
      "ReadableStreamDefaultController": false,
      "ReadableStreamDefaultReader": false,
      "Request": false,
      "require": "off",
      "Response": false,
      "setImmediate": false,
      "setInterval": false,
      "setTimeout": false,
      "structuredClone": false,
      "SubtleCrypto": false,
      "TextDecoder": false,
      "TextDecoderStream": false,
      "TextEncoder": false,
      "TextEncoderStream": false,
      "TransformStream": false,
      "TransformStreamDefaultController": false,
      "URL": false,
      "URLSearchParams": false,
      "WebAssembly": false,
      "WebSocket": false,
      "WritableStream": false,
      "WritableStreamDefaultController": false,
      "WritableStreamDefaultWriter": false,
      "AggregateError": false,
      "Array": false,
      "ArrayBuffer": false,
      "Atomics": false,
      "BigInt": false,
      "BigInt64Array": false,
      "BigUint64Array": false,
      "Boolean": false,
      "DataView": false,
      "Date": false,
      "decodeURI": false,
      "decodeURIComponent": false,
      "encodeURI": false,
      "encodeURIComponent": false,
      "Error": false,
      "escape": false,
      "eval": false,
      "EvalError": false,
      "FinalizationRegistry": false,
      "Float32Array": false,
      "Float64Array": false,
      "Function": false,
      "globalThis": false,
      "Infinity": false,
      "Int16Array": false,
      "Int32Array": false,
      "Int8Array": false,
      "Intl": false,
      "isFinite": false,
      "isNaN": false,
      "JSON": false,
      "Map": false,
      "Math": false,
      "NaN": false,
      "Number": false,
      "Object": false,
      "parseFloat": false,
      "parseInt": false,
      "Promise": false,
      "Proxy": false,
      "RangeError": false,
      "ReferenceError": false,
      "Reflect": false,
      "RegExp": false,
      "Set": false,
      "SharedArrayBuffer": false,
      "String": false,
      "Symbol": false,
      "SyntaxError": false,
      "TypeError": false,
      "Uint16Array": false,
      "Uint32Array": false,
      "Uint8Array": false,
      "Uint8ClampedArray": false,
      "undefined": false,
      "unescape": false,
      "URIError": false,
      "WeakMap": false,
      "WeakRef": false,
      "WeakSet": false
    }
  }
}
