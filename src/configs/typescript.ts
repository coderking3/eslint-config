import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem
} from '../types'

import process from 'node:process'
import { GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs'
import { interopDefault, renameRules } from '../utils'

export async function typescript(
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptWithTypes &
    OptionsTypeScriptParserOptions = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {}
  } = options

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map((ext) => `**/*.${ext}`)
  ]

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX]
  const ignoresTypeAware = options.ignoresTypeAware ?? [`${GLOB_MARKDOWN}/**`]
  const tsconfigPath = options?.tsconfigPath ? options.tsconfigPath : undefined
  const isTypeAware = !!tsconfigPath

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'typescript/await-thenable': 'error',
    'typescript/consistent-type-imports': [
      'error',
      { disallowTypeAnnotations: false, prefer: 'type-imports' }
    ],
    'typescript/dot-notation': ['error', { allowKeywords: true }],
    'typescript/no-duplicate-imports': 'error',
    'typescript/no-floating-promises': 'error',
    'typescript/no-for-in-array': 'error',
    'typescript/no-implied-eval': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-unsafe-argument': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/promise-function-async': 'error',
    'typescript/restrict-plus-operands': 'error',
    'typescript/restrict-template-expressions': 'error',
    'typescript/return-await': ['error', 'in-try-catch'],
    'typescript/strict-boolean-expressions': [
      'error',
      { allowNullableBoolean: true, allowNullableObject: true }
    ],
    'typescript/switch-exhaustiveness-check': 'error',
    'typescript/unbound-method': 'error'
  }

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser'))
  ] as const)

  function makeParser(
    typeAware: boolean,
    files: string[],
    ignores?: string[]
  ): TypedFlatConfigItem {
    return {
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: 'module',
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ['./*.js'],
                  defaultProject: tsconfigPath
                },
                tsconfigRootDir: process.cwd()
              }
            : {}),
          ...(parserOptions as any)
        }
      },
      name: `king3/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`
    }
  }

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: 'king3/typescript/setup',
      plugins: {
        typescript: pluginTs as any
      }
    },
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...(isTypeAware
      ? [
          makeParser(false, files),
          makeParser(true, filesTypeAware, ignoresTypeAware)
        ]
      : [makeParser(false, files)]),
    {
      files,
      name: 'king3/typescript/rules',
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides![0].rules!,
          { '@typescript-eslint': 'typescript' }
        ),
        ...renameRules(pluginTs.configs.strict.rules!, {
          '@typescript-eslint': 'typescript'
        }),
        'no-dupe-class-members': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'typescript/ban-ts-comment': [
          'error',
          { 'ts-expect-error': 'allow-with-description' }
        ],
        'typescript/consistent-type-definitions': ['error', 'interface'],
        'typescript/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: false,
            fixStyle: 'separate-type-imports',
            prefer: 'type-imports'
          }
        ],

        'typescript/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        'typescript/no-dupe-class-members': 'error',
        'typescript/no-dynamic-delete': 'off',
        'typescript/no-empty-object-type': [
          'error',
          { allowInterfaces: 'always' }
        ],
        'typescript/no-explicit-any': 'off',
        'typescript/no-extraneous-class': 'off',
        'typescript/no-import-type-side-effects': 'error',
        'typescript/no-invalid-void-type': 'off',
        'typescript/no-non-null-assertion': 'off',
        'typescript/no-redeclare': ['error', { builtinGlobals: false }],
        'typescript/no-require-imports': 'error',
        'typescript/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true
          }
        ],
        'typescript/no-unused-vars': 'off',
        'typescript/no-use-before-define': [
          'error',
          { classes: false, functions: false, variables: true }
        ],
        'typescript/no-useless-constructor': 'off',
        'typescript/no-wrapper-object-types': 'error',
        'typescript/triple-slash-reference': 'off',
        'typescript/unified-signatures': 'off',

        ...overrides
      }
    },
    ...(isTypeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: 'king3/typescript/rules-type-aware',
            rules: {
              ...typeAwareRules,
              ...overridesTypeAware
            }
          }
        ]
      : [])
  ]
}
