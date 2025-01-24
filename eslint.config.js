import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  js.configs.recommended, {
    plugins: {
      '@stylistic': stylistic,
    },
    ignores: [
      '/dist',
    ],
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'eqeqeq': [
        'error',
        'always',
      ],
      'no-console': [
        'off',
      ],
      'no-inner-declarations': [
        'error',
        'functions', {
          blockScopedFunctions: 'disallow',
        },
      ],
      'no-invalid-this': [
        'error',
      ],
      'strict': [
        'error',
      ],
      '@stylistic/array-bracket-spacing': [
        'error',
      ],
      '@stylistic/arrow-spacing': [
        'error',
      ],
      '@stylistic/brace-style': [
        'error',
      ],
      '@stylistic/comma-dangle': [
        'error',
        'always-multiline',
      ],
      '@stylistic/comma-spacing': [
        'error', {
          'before': false,
          'after': true,
        },
      ],
      '@stylistic/computed-property-spacing': [
        'error',
      ],
      '@stylistic/dot-location': [
        'error',
        'property',
      ],
      '@stylistic/function-call-argument-newline': [
        'error',
        'never',
      ],
      '@stylistic/function-call-spacing': [
        'error',
        'never',
      ],
      '@stylistic/function-paren-newline': [
        'error',
      ],
      '@stylistic/indent': [
        'error',
        2, {
          'SwitchCase': 1,
        },
      ],
      '@stylistic/key-spacing': [
        'error',
      ],
      '@stylistic/keyword-spacing': [
        'error',
      ],
      '@stylistic/line-comment-position': [
        'error', {
          'position': 'above',
        },
      ],
      '@stylistic/lines-around-comment': [
        'error', {
          'beforeBlockComment': true,
        },
      ],
      '@stylistic/linebreak-style': [
        'error',
        'unix',
      ],
      '@stylistic/no-extra-parens': [
        'error',
      ],
      '@stylistic/no-floating-decimal': [
        'error',
      ],
      '@stylistic/no-mixed-operators': [
        'error',
      ],
      '@stylistic/no-multi-spaces': [
        'error',
      ],
      '@stylistic/no-multiple-empty-lines': [
        'error', {
          'max': 1,
        },
      ],
      '@stylistic/no-trailing-spaces': [
        'error',
      ],
      '@stylistic/no-whitespace-before-property': [
        'error',
      ],
      '@stylistic/object-curly-newline': [
        'error', {
          'ObjectExpression': {
            'multiline': true,
            'minProperties': 1,
          },
        },
      ],
      '@stylistic/object-curly-spacing': [
        'error',
        'always',
      ],
      '@stylistic/object-property-newline': [
        'error',
      ],
      '@stylistic/operator-linebreak': [
        'error',
        'none',
      ],
      '@stylistic/quotes': [
        'error',
        'single',
      ],
      '@stylistic/rest-spread-spacing': [
        'error',
      ],
      '@stylistic/semi': [
        'error',
        'always',
      ],
      '@stylistic/semi-spacing': [
        'error',
      ],
      '@stylistic/space-before-blocks': [
        'error',
      ],
      '@stylistic/space-before-function-paren': [
        'error', {
          'anonymous': 'always',
          'asyncArrow': 'always',
          'named': 'never',
        },
      ],
      '@stylistic/space-in-parens': [
        'error',
      ],
      '@stylistic/space-infix-ops': [
        'error',
      ],
      '@stylistic/space-unary-ops': [
        'error',
      ],
      '@stylistic/spaced-comment': [
        'error',
        'always', {
          'block': {
            'balanced': true,
          },
        },
      ],
      '@stylistic/switch-colon-spacing': [
        'error',
      ],
      '@stylistic/template-curly-spacing': [
        'error',
      ],
    },
  },
];
