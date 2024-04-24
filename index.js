const globals = require('globals');

module.exports = {
  // require('./rules/imports'),
  ...require('./rules/possible-errors'),
  ...require('./rules/best-practices'),
  ...require('./rules/variables'),
  ...require('./rules/node'),
  ...require('./rules/stylistic-issues'),
  ...require('./rules/es2015'),
  ...{
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        ...globals.es6,
        ...globals.jest,
      },
    },
    rules: {
      strict: 'error',
    },
  },
};
