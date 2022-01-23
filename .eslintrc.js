export default {
  extends: 'eslint:recommended',
  env: {
    es2021: true,
    node: true,
    amd: true
  },
  sourceType: 'module',
  rules: {
    'arrow-parens': ['warn', 'as-needed'],
    'comma-dangle': ['warn', 'never'],
    quotes: ['warn', 'single']
  }
};
