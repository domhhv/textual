import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import switchCase from 'eslint-plugin-switch-case';
import unusedImports from 'eslint-plugin-unused-imports';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:switch-case/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ),
  {
    plugins: {
      '@stylistic': stylistic,
      perfectionist,
      'switch-case': switchCase,
      'unused-imports': unusedImports,
    },

    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'arrow-body-style': ['error', 'always'],
      curly: 'error',
      'func-style': ['error', 'declaration', { allowTypeAnnotation: true }],
      'import/no-duplicates': 'error',
      'import/order': 'off',
      'no-undef': 'off',
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'react/react-in-jsx-scope': 'off',
      'switch-case/no-case-curly': 'off',

      '@stylistic/jsx-curly-brace-presence': [
        'error',
        { children: 'never', propElementValues: 'always', props: 'never' },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', next: 'block-like', prev: '*' },
        { blankLine: 'always', next: 'block', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'block-like' },
        { blankLine: 'always', next: '*', prev: 'block' },
      ],

      'perfectionist/sort-exports': [
        'error',
        {
          ignoreCase: true,
          order: 'asc',
          type: 'alphabetical',
        },
      ],

      'perfectionist/sort-imports': [
        'error',
        {
          ignoreCase: true,
          newlinesBetween: 'never',
          order: 'asc',
          tsconfigRootDir: '.',
          type: 'alphabetical',
          groups: [
            'builtin',
            { newlinesBetween: 'always' },
            'external',
            { newlinesBetween: 'always' },
            'internal',
            { newlinesBetween: 'always' },
            'parent',
            { newlinesBetween: 'always' },
            ['index', 'sibling'],
          ],
        },
      ],

      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'line-length',
        },
      ],

      'perfectionist/sort-named-imports': [
        'error',
        {
          type: 'line-length',
        },
      ],

      'perfectionist/sort-object-types': [
        'error',
        {
          groups: ['unknown', 'method', 'multiline-member'],
        },
      ],

      'perfectionist/sort-objects': [
        'error',
        {
          groups: ['unknown', 'method', 'multiline-member'],
        },
      ],

      'react/boolean-prop-naming': [
        'error',
        {
          propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
          rule: '^(is|as|has)[A-Z]([A-Za-z0-9]?)+',
        },
      ],

      'switch-case/newline-between-switch-case': [
        'error',
        'always',
        { fallthrough: 'never' },
      ],
    },
  },
];

export default eslintConfig;
