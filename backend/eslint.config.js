import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {js},
    extends: ['js/recommended'],
    languageOptions: {globals: globals.node},
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', {avoidEscape: true}],
      indent: ['error', 2],
      'no-trailing-spaces': 'error',
      'no-multi-spaces': 'error',
      'comma-spacing': ['error', {'before': false, 'after': true}],
      'key-spacing': ['error', {'beforeColon': false, 'afterColon': true}],
    }
  },
  ...tseslint.configs.recommended,
]);