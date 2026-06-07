const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: [
      '**/coverage/**',
      '**/design_handoff_nachopps/**',
      '**/dist/**',
      '**/docs-deprecated/**',
      '**/node_modules/**',
      '**/tmp/**',
      '**/src/generated/**',
    ],
  },
  {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      parser: tsParser,
      sourceType: 'module',
    },
    rules: {},
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
];
