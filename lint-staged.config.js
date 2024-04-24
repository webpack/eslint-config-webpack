module.exports = {
  '*': ['prettier --cache --write --ignore-unknown'],
  '*.js': ['eslint --cache --fix'],
};
