const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.ts', '.d.ts', '.tsx'] },
    },
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['*.tsx'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        extraFileExtensions: ['.tsx'],
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'no-undef': 'off',
        'react/react-in-jsx-scope': 'off', // turn off this one if React >= 16.8
      },
    },
  ],
})
