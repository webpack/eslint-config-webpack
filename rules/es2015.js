module.exports = {
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },

  rules: {
    // require braces around arrow function bodies
    // http://eslint.org/docs/rules/arrow-body-style
    'arrow-body-style': [
      'error',
      'as-needed',
      {
        requireReturnForObjectLiteral: true,
      },
    ],

    // require parentheses around arrow function arguments
    // http://eslint.org/docs/rules/arrow-parens
    // This is handled by Prettier in Defaults 2.0
    'arrow-parens': 'off',

    // enforce consistent spacing before and after the arrow in arrow functions
    // http://eslint.org/docs/rules/arrow-spacing
    // This is handled by Prettier in Defaults 2.0
    'arrow-spacing': 'off',

    // require super() calls in constructors
    // http://eslint.org/docs/rules/constructor-super
    'constructor-super': 'error',

    // enforce consistent spacing around * operators in generator functions
    // http://eslint.org/docs/rules/generator-star-spacing
    // This is handled by Prettier in Defaults 2.0
    'generator-star-spacing': 'off',

    // disallow reassigning class members
    // http://eslint.org/docs/rules/no-class-assign
    'no-class-assign': 'error',

    // disallow arrow functions where they could be confused with comparisons
    // http://eslint.org/docs/rules/no-confusing-arrow
    // This is handled by Prettier in Defaults 2.0
    'no-confusing-arrow': 'off',

    // disallow reassigning const variables
    // http://eslint.org/docs/rules/no-const-assign
    'no-const-assign': 'error',

    // disallow duplicate class members
    // http://eslint.org/docs/rules/no-dupe-class-members
    'no-dupe-class-members': 'error',

    // disallow duplicate module imports
    // http://eslint.org/docs/rules/no-duplicate-imports
    'no-duplicate-imports': 'off',

    // disallow new operators with the Symbol object
    // http://eslint.org/docs/rules/no-new-symbol
    'no-new-symbol': 'error',

    // disallow specified modules when loaded by import
    // http://eslint.org/docs/rules/no-restricted-imports
    'no-restricted-imports': 'off',

    // disallow this/super before calling super() in constructors
    // http://eslint.org/docs/rules/no-this-before-super
    'no-this-before-super': 'error',

    // disallow unnecessary computed property keys in object literals
    // http://eslint.org/docs/rules/no-useless-computed-key
    'no-useless-computed-key': 'error',

    // disallow unnecessary constructors
    // http://eslint.org/docs/rules/no-useless-constructor
    'no-useless-constructor': 'error',

    // disallow renaming import, export, and destructured assignments to the same name
    // http://eslint.org/docs/rules/no-useless-rename
    'no-useless-rename': [
      'error',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],

    // require let or const instead of var
    // http://eslint.org/docs/rules/no-var
    'no-var': 'error',

    // require or disallow method and property shorthand syntax for object literals
    // http://eslint.org/docs/rules/object-shorthand
    'object-shorthand': [
      'error',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true,
      },
    ],

    // require arrow functions as callbacks
    // http://eslint.org/docs/rules/prefer-arrow-callback
    'prefer-arrow-callback': [
      'warn',
      {
        allowNamedFunctions: false,
        allowUnboundThis: true,
      },
    ],

    // require const declarations for variables that are never reassigned after declared
    // http://eslint.org/docs/rules/prefer-const
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: true,
      },
    ],

    // require destructuring from arrays and/or objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'warn',
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    // http://eslint.org/docs/rules/prefer-numeric-literals
    'prefer-numeric-literals': 'error',

    // require rest parameters instead of arguments
    // http://eslint.org/docs/rules/prefer-rest-params
    'prefer-rest-params': 'error',

    // require spread operators instead of .apply()
    // http://eslint.org/docs/rules/prefer-spread
    'prefer-spread': 'error',

    // require template literals instead of string concatenation
    // http://eslint.org/docs/rules/prefer-template
    'prefer-template': 'error',

    // require generator functions to contain yield
    // http://eslint.org/docs/rules/require-yield
    'require-yield': 'error',

    // enforce spacing between rest and spread operators and their expressions
    // http://eslint.org/docs/rules/rest-spread-spacing
    // This is handled by Prettier in Defaults 2.0
    'rest-spread-spacing': 'off',

    // enforce sorted import declarations within modules
    // http://eslint.org/docs/rules/sort-imports
    'sort-imports': [
      'off',
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],

    // require symbol descriptions
    // http://eslint.org/docs/rules/symbol-description
    'symbol-description': 'error',

    // require or disallow spacing around embedded expressions of template strings
    // http://eslint.org/docs/rules/template-curly-spacing
    // This is handled by Prettier in Defaults 2.0
    'template-curly-spacing': 'off',

    // require or disallow spacing around the * in yield* expressions
    // http://eslint.org/docs/rules/yield-star-spacing
    // This is handled by Prettier in Defaults 2.0
    'yield-star-spacing': 'off',
  },
};
