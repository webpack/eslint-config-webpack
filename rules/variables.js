module.exports = {
  rules: {
    // require or disallow initialization in variable declarations
    // http://eslint.org/docs/rules/init-declarations
    'init-declarations': 'off',

    // disallow catch clause parameters from shadowing variables in the outer scope
    // http://eslint.org/docs/rules/no-catch-shadow
    'no-catch-shadow': 'off',

    // disallow deleting variables
    // http://eslint.org/docs/rules/no-delete-var
    'no-delete-var': 'error',

    // disallow labels that share a name with a variable
    // http://eslint.org/docs/rules/no-label-var
    'no-label-var': 'error',

    // disallow specified global variables
    // http://eslint.org/docs/rules/no-restricted-globals
    'no-restricted-globals': 'off',

    // disallow identifiers from shadowing restricted names
    // http://eslint.org/docs/rules/no-shadow-restricted-names
    'no-shadow-restricted-names': 'error',

    // disallow variable declarations from shadowing variables declared in the outer scope
    // http://eslint.org/docs/rules/no-shadow
    'no-shadow': 'warn',

    // disallow initializing variables to undefined
    // http://eslint.org/docs/rules/no-undef-init
    'no-undef-init': 'error',

    // disallow the use of undeclared variables unless mentioned in /*global */ comments
    // http://eslint.org/docs/rules/no-undef
    'no-undef': 'error',

    // disallow the use of undefined as an identifier
    // http://eslint.org/docs/rules/no-undefined
    'no-undefined': 'warn',

    // disallow unused variables
    // http://eslint.org/docs/rules/no-unused-vars
    'no-unused-vars': [
      'error',
      { vars: 'local', args: 'after-used', ignoreRestSiblings: true },
    ],

    // disallow the use of variables before they are defined
    // http://eslint.org/docs/rules/no-use-before-define
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
  },
};
