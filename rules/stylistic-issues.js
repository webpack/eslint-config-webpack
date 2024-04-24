module.exports = {
  rules: {
    // enforce consistent spacing inside array brackets
    // http://eslint.org/docs/rules/array-bracket-spacing
    // This is handled by Prettier in Defaults 2.0
    'array-bracket-spacing': 'off',

    // enforce consistent spacing inside single-line blocks
    // http://eslint.org/docs/rules/block-spacing
    // This is handled by Prettier in Defaults 2.0
    'block-spacing': 'off',

    // enforce consistent brace style for blocks
    // http://eslint.org/docs/rules/brace-style
    // This is handled by Prettier in Defaults 2.0
    'brace-style': 'off',

    // enforce camelcase naming convention
    // http://eslint.org/docs/rules/camelcase
    camelcase: ['error', { properties: 'never' }],

    // enforce or disallow capitalization of the first letter of a comment
    // http://eslint.org/docs/rules/capitalized-comments
    'capitalized-comments': [
      'off',
      'never',
      {
        line: {
          ignorePattern: '.*',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
        block: {
          ignorePattern: '.*',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      },
    ],

    // require trailing commas in multiline object literals
    // http://eslint.org/docs/rules/comma-dangle
    // This is handled by Prettier in Defaults 2.0
    'comma-dangle': 'off',

    // enforce consistent spacing before and after commas
    // http://eslint.org/docs/rules/comma-spacing
    // This is handled by Prettier in Defaults 2.0
    'comma-spacing': 'off',

    // enforce consistent comma style
    // http://eslint.org/docs/rules/comma-style
    // This is handled by Prettier in Defaults 2.0
    'comma-style': 'off',

    // enforce consistent spacing inside computed property brackets
    // http://eslint.org/docs/rules/computed-property-spacing
    // This is handled by Prettier in Defaults 2.0
    'computed-property-spacing': 'off',

    // enforce consistent naming when capturing the current execution context
    // http://eslint.org/docs/rules/consistent-this
    'consistent-this': 'off',

    // require or disallow newline at the end of files
    // http://eslint.org/docs/rules/eol-last
    // This is handled by Prettier in Defaults 2.0
    'eol-last': 'off',

    // require or disallow spacing between function identifiers and their invocations
    // http://eslint.org/docs/rules/func-call-spacing
    // This is handled by Prettier in Defaults 2.0
    'func-call-spacing': 'off',

    // require function names to match the name of the variable or property to which they are assigned
    // http://eslint.org/docs/rules/func-name-matching
    'func-name-matching': [
      'off',
      'always',
      {
        includeCommonJSModuleExports: false,
      },
    ],

    // require or disallow named function expressions
    // http://eslint.org/docs/rules/func-names
    'func-names': 'warn',

    // enforce the consistent use of either function declarations or expressions
    // http://eslint.org/docs/rules/func-style
    'func-style': 'off',

    // disallow specified identifiers
    // http://eslint.org/docs/rules/id-blacklist
    'id-blacklist': 'off',

    // enforce minimum and maximum identifier lengths
    // http://eslint.org/docs/rules/id-length
    'id-length': 'off',

    // require identifiers to match a specified regular expression
    // http://eslint.org/docs/rules/id-match
    'id-match': 'off',

    // enforce consistent indentation
    // http://eslint.org/docs/rules/indent
    // This is handled by Prettier in Defaults 2.0
    indent: 'off',

    // enforce the consistent use of either double or single quotes in JSX attributes
    // http://eslint.org/docs/rules/jsx-quotes
    'jsx-quotes': 'off',

    // enforce consistent spacing between keys and values in object literal properties
    // http://eslint.org/docs/rules/key-spacing
    // This is handled by Prettier in Defaults 2.0
    'key-spacing': 'off',

    // enforce consistent spacing before and after keywords
    // http://eslint.org/docs/rules/keyword-spacing
    // This is handled by Prettier in Defaults 2.0
    'keyword-spacing': 'off',

    // enforce position of line comments
    // http://eslint.org/docs/rules/line-comment-position
    'line-comment-position': [
      'error',
      {
        position: 'above',
        ignorePattern: '',
        applyDefaultPatterns: true,
      },
    ],

    // enforce consistent linebreak style
    // http://eslint.org/docs/rules/linebreak-style
    'linebreak-style': ['error', 'unix'],

    // require empty lines around comments
    // http://eslint.org/docs/rules/lines-around-comment
    'lines-around-comment': 'off',

    // require or disallow newlines around directives
    // http://eslint.org/docs/rules/lines-around-directive
    'lines-around-directive': [
      'error',
      {
        before: 'always',
        after: 'always',
      },
    ],

    // enforce a maximum depth that blocks can be nested
    // http://eslint.org/docs/rules/max-depth
    'max-depth': ['off', 4],

    // enforce a maximum line length
    // http://eslint.org/docs/rules/max-len
    // This is handled by Prettier in Defaults 2.0
    'max-len': 'off',

    // enforce a maximum number of lines per file
    // http://eslint.org/docs/rules/max-lines
    'max-lines': [
      'off',
      {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    // enforce a maximum depth that callbacks can be nested
    // http://eslint.org/docs/rules/max-nested-callbacks
    'max-nested-callbacks': 'off',

    // enforce a maximum number of parameters in function definitions
    // http://eslint.org/docs/rules/max-params
    'max-params': ['off', 3],

    // enforce a maximum number of statements allowed per line
    // http://eslint.org/docs/rules/max-statements-per-line
    'max-statements-per-line': ['off', { max: 1 }],

    // enforce a maximum number of statements allowed in function blocks
    // http://eslint.org/docs/rules/max-statements
    'max-statements': ['off', 10],

    // enforce newlines between operands of ternary expressions
    // http://eslint.org/docs/rules/multiline-ternary
    // This is handled by Prettier in Defaults 2.0
    'multiline-ternary': 'off',

    // require constructor names to begin with a capital letter
    // http://eslint.org/docs/rules/new-cap
    'new-cap': [
      'error',
      {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: [
          'Immutable.Map',
          'Immutable.Set',
          'Immutable.List',
        ],
      },
    ],

    // require parentheses when invoking a constructor with no arguments
    // http://eslint.org/docs/rules/new-parens
    // This is handled by Prettier in Defaults 2.0
    'new-parens': 'off',

    // require or disallow an empty line after variable declarations
    // http://eslint.org/docs/rules/newline-after-var
    'newline-after-var': 'off',

    // require an empty line before return statements
    // http://eslint.org/docs/rules/newline-before-return
    'newline-before-return': 'off',

    // require a newline after each call in a method chain
    // http://eslint.org/docs/rules/newline-per-chained-call
    // This is handled by Prettier in Defaults 2.0
    'newline-per-chained-call': 'off',

    // disallow Array constructors
    // http://eslint.org/docs/rules/no-array-constructor
    'no-array-constructor': 'error',

    // disallow bitwise operators
    // http://eslint.org/docs/rules/no-bitwise
    'no-bitwise': 'error',

    // disallow continue statements
    // http://eslint.org/docs/rules/no-continue
    'no-continue': 'error',

    // disallow inline comments after code
    // http://eslint.org/docs/rules/no-inline-comments
    'no-inline-comments': 'off',

    // disallow if statements as the only statement in else blocks
    // http://eslint.org/docs/rules/no-lonely-if
    'no-lonely-if': 'error',

    // disallow mixed binary operators
    // http://eslint.org/docs/rules/no-mixed-operators
    // This is handled by Prettier in Defaults 2.0
    'no-mixed-operators': 'off',

    // disallow mixed spaces and tabs for indentation
    // http://eslint.org/docs/rules/no-mixed-spaces-and-tabs
    // This is handled by Prettier in Defaults 2.0
    'no-mixed-spaces-and-tabs': 'off',

    // disallow use of chained assignment expressions
    // http://eslint.org/docs/rules/no-multi-assign
    'no-multi-assign': ['error'],

    // disallow multiple empty lines
    // http://eslint.org/docs/rules/no-multiple-empty-lines
    // This is handled by Prettier in Defaults 2.0
    'no-multiple-empty-lines': 'off',

    // disallow negated conditions
    // http://eslint.org/docs/rules/no-negated-condition
    'no-negated-condition': 'off',

    // disallow nested ternary expressions
    // http://eslint.org/docs/rules/no-nested-ternary
    'no-nested-ternary': 'off',

    // disallow Object constructors
    // http://eslint.org/docs/rules/no-new-object
    'no-new-object': 'error',

    // disallow the unary operators ++ and --
    // http://eslint.org/docs/rules/no-plusplus
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // disallow specified syntax
    // http://eslint.org/docs/rules/no-restricted-syntax
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],

    // disallow tab characters entirely
    // http://eslint.org/docs/rules/no-tabs
    // This is handled by Prettier in Defaults 2.0
    'no-tabs': 'off',

    // disallow ternary operators
    // http://eslint.org/docs/rules/no-ternary
    'no-ternary': 'off',

    // disallow trailing whitespace at the end of lines
    // http://eslint.org/docs/rules/no-trailing-spaces
    // This is handled by Prettier in Defaults 2.0
    'no-trailing-spaces': 'off',

    // disallow dangling underscores in identifiers
    // http://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': [
      'error',
      { allow: ['__dirname'], allowAfterThis: true },
    ],

    // disallow ternary operators when simpler alternatives exist
    // http://eslint.org/docs/rules/no-unneeded-ternary
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],

    // disallow whitespace before properties
    // http://eslint.org/docs/rules/no-whitespace-before-property
    // This is handled by Prettier in Defaults 2.0
    'no-whitespace-before-property': 'off',

    // enforce consistent line breaks inside braces
    // http://eslint.org/docs/rules/object-curly-newline
    // This is handled by Prettier in Defaults 2.0
    'object-curly-newline': 'off',

    // require padding inside curly braces
    // http://eslint.org/docs/rules/object-curly-spacing
    // This is handled by Prettier in Defaults 2.0
    'object-curly-spacing': 'off',

    // enforce placing object properties on separate lines
    // http://eslint.org/docs/rules/object-property-newline
    // This is handled by Prettier in Defaults 2.0
    'object-property-newline': 'off',

    // require or disallow newlines around variable declarations
    // http://eslint.org/docs/rules/one-var-declaration-per-line
    // This is handled by Prettier in Defaults 2.0
    'one-var-declaration-per-line': 'off',

    // enforce variables to be declared either together or separately in functions
    // http://eslint.org/docs/rules/one-var
    'one-var': ['error', 'never'],

    // require or disallow assignment operator shorthand where possible
    // http://eslint.org/docs/rules/operator-assignment
    'operator-assignment': ['error', 'always'],

    // enforce consistent linebreak style for operators
    // http://eslint.org/docs/rules/operator-linebreak
    // This is handled by Prettier in Defaults 2.0
    'operator-linebreak': 'off',

    // require or disallow padding within blocks
    // http://eslint.org/docs/rules/padded-blocks
    // This is handled by Prettier in Defaults 2.0
    'padded-blocks': 'off',

    // require quotes around object literal property names
    // http://eslint.org/docs/rules/quote-props.html
    // This is handled by Prettier in Defaults 2.0
    'quote-props': 'off',

    // enforce the consistent use of either backticks, double, or single quotes
    // http://eslint.org/docs/rules/quotes
    // This is handled by Prettier in Defaults 2.0
    quotes: 'off',

    // require JSDoc comments
    // http://eslint.org/docs/rules/require-jsdoc
    'require-jsdoc': 'off',

    // enforce consistent spacing before and after semicolons
    // http://eslint.org/docs/rules/semi-spacing
    // This is handled by Prettier in Defaults 2.0
    'semi-spacing': 'off',

    // require or disallow semicolons instead of ASI
    // http://eslint.org/docs/rules/semi
    // This is handled by Prettier in Defaults 2.0
    semi: 'off',

    // require object keys to be sorted
    // http://eslint.org/docs/rules/sort-keys
    'sort-keys': ['off', 'asc', { caseSensitive: false, natural: true }],

    // require variables within the same declaration block to be sorted
    // http://eslint.org/docs/rules/sort-vars
    'sort-vars': 'off',

    // enforce consistent spacing before blocks
    // http://eslint.org/docs/rules/space-before-blocks
    // This is handled by Prettier in Defaults 2.0
    'space-before-blocks': 'off',

    // enforce consistent spacing before function definition opening parenthesis
    // http://eslint.org/docs/rules/space-before-function-paren
    // This is handled by Prettier in Defaults 2.0
    'space-before-function-paren': 'off',

    // enforce consistent spacing inside parentheses
    // http://eslint.org/docs/rules/space-in-parens
    // This is handled by Prettier in Defaults 2.0
    'space-in-parens': 'off',

    // require spacing around infix operators
    // http://eslint.org/docs/rules/space-infix-ops
    // This is handled by Prettier in Defaults 2.0
    'space-infix-ops': 'off',

    // enforce consistent spacing before or after unary operators
    // http://eslint.org/docs/rules/space-unary-ops
    // This is handled by Prettier in Defaults 2.0
    'space-unary-ops': 'off',

    // enforce consistent spacing after the // or /* in a comment
    // http://eslint.org/docs/rules/spaced-comment
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          exceptions: ['-', '+'],
          markers: ['=', '!'],
        },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!'],
          balanced: false,
        },
      },
    ],

    // require or disallow Unicode byte order mark (BOM)
    // http://eslint.org/docs/rules/unicode-bom
    // This is handled by Prettier in Defaults 2.0
    'unicode-bom': 'off',

    // require parenthesis around regex literals
    // http://eslint.org/docs/rules/wrap-regex
    // This is handled by Prettier in Defaults 2.0
    'wrap-regex': 'off',
  },
};
