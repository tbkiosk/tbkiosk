module.exports = {
  extends: ['@morphis-labs/eslint-config', 'plugin:@next/next/recommended', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'off',
  },
}
