module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true,
    mocha: true,
  },
  globals: {
    require: true,
    module: true,
    process: true,
    Promise: true,
  },
  rules: {
  }
};
