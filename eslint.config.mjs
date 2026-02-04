import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import perfectionist from 'eslint-plugin-perfectionist';
import switchCase from 'eslint-plugin-switch-case';
import unusedImports from 'eslint-plugin-unused-imports';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  ...compat.extends('eslint:recommended'),
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...compat.extends('plugin:switch-case/recommended'),
  ...compat.extends('plugin:import/recommended'),
  ...compat.extends('plugin:@lexical/recommended'),
  ...compat.extends('prettier'),
  {
    plugins: {
      '@stylistic': stylistic,
      perfectionist,
      'switch-case': switchCase,
      'unused-imports': unusedImports,
    },
    rules: {
      '@lexical/rules-of-lexical': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'arrow-body-style': ['error', 'always'],
      curly: 'error',
      'func-style': ['error', 'declaration', { allowTypeAnnotation: true }],
      'import/no-duplicates': 'error',
      'import/no-named-as-default': 'off',
      'import/order': 'off',
      'max-len': 'off',
      'no-undef': 'off',
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'react/react-in-jsx-scope': 'off',
      'switch-case/newline-between-switch-case': ['error', 'always', { fallthrough: 'never' }],
      'switch-case/no-case-curly': 'off',

      '@stylistic/jsx-curly-brace-presence': [
        'error',
        { children: 'never', propElementValues: 'always', props: 'never' },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          varsIgnorePattern: '^_',
        },
      ],

      'no-console': [
        'warn',
        {
          allow: ['info', 'warn', 'error'],
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
          newlinesBetween: 0,
          order: 'asc',
          tsconfig: { rootDir: '.' },
          type: 'alphabetical',
          groups: [
            'builtin',
            { newlinesBetween: 1 },
            'external',
            { newlinesBetween: 1 },
            'internal',
            { newlinesBetween: 1 },
            'parent',
            { newlinesBetween: 1 },
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
          rule: '^(is|as|has|show)[A-Z]([A-Za-z0-9]?)+',
        },
      ],
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];

export default eslintConfig;
