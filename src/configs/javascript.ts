import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import eslintJs from '@eslint/js'
import globals from 'globals'

import { pluginUnusedImports } from '../plugins'

export async function javascript(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

  return [
    {
      languageOptions: {
        ecmaVersion: 2022,
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly'
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: 2022,
          sourceType: 'module'
        },
        sourceType: 'module'
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      },
      name: 'king3/javascript/setup'
    },
    {
      name: 'king3/javascript/rules',
      plugins: {
        'unused-imports': pluginUnusedImports
      },
      rules: {
        ...eslintJs.configs.recommended.rules,
        'accessor-pairs': [
          'error',
          { enforceForClassMembers: true, setWithoutGet: true }
        ],

        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'constructor-super': 'error',
        'dot-notation': 'warn',
        eqeqeq: ['error', 'smart'],
        'no-alert': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error', 'info', 'clear'] }],
        'no-debugger': 'warn',
        'no-duplicate-imports': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-fallthrough': [
          'warn',
          { commentPattern: String.raw`break[\s\w]*omitted` }
        ],
        'no-inner-declarations': 'error',
        'no-lonely-if': 'error',
        'no-multi-str': 'error',
        'no-restricted-syntax': [
          'error',
          'TSEnumDeclaration[const=true]',
          'TSExportAssignment'
        ],
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true
          }
        ],
        'no-unused-vars': 'off',
        'no-void': 'error',
        'object-shorthand': [
          'error',
          'always',
          { avoidQuotes: true, ignoreConstructors: false }
        ],
        'prefer-arrow-callback': [
          'error',
          { allowNamedFunctions: false, allowUnboundThis: true }
        ],
        'prefer-const': [
          'warn',
          { destructuring: 'all', ignoreReadBeforeAssign: true }
        ],
        'prefer-exponentiation-operator': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'unicode-bom': ['error', 'never'],
        'unused-imports/no-unused-imports': 'warn',
        'unused-imports/no-unused-vars': [
          'error',
          { args: 'after-used', ignoreRestSiblings: true }
        ],
        'use-isnan': [
          'error',
          { enforceForIndexOf: true, enforceForSwitchCase: true }
        ],
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'vars-on-top': 'error',

        ...overrides
      }
    }
  ]
}
