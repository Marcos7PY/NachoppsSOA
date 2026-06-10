const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

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
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    // T-18: `any` pasa a warn (deuda visible). Subir a 'error' cuando el conteo
    // tienda a 0. Los `any` irreductibles se anotan con `// any justificado: …`.
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
];
