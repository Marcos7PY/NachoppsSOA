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
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.base.json',
          './apps/*/tsconfig.json',
          './libs/*/tsconfig.json',
          './apps/*-e2e/tsconfig.json',
          './libs/*/*/tsconfig.json'
        ],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...tsPlugin.configs?.['recommended-type-checked']?.rules,
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    // Test doubles (mocks/stubs/spies) routinely need `any` to satisfy jest.fn() signatures
    // and partial service shapes. Relaxing only in spec files keeps production code strict.
    files: ['**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
