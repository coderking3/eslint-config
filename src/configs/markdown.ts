import type {
  OptionsComponentExts,
  OptionsOverrides,
  TypedFlatConfigItem
} from '../types'

import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE } from '../globs'
import { interopDefault } from '../utils'

export async function markdown(
  options: OptionsComponentExts & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { componentExts = [], overrides = {} } = options

  const pluginMarkdown = await interopDefault(import('@eslint/markdown'))

  return [
    ...pluginMarkdown.configs.processor.map((config) => ({
      ...config,
      name: `king3/${config.name || 'anonymous'}`
    })),

    {
      files: [GLOB_MARKDOWN],
      name: 'king3/markdown/disables/markdown',
      rules: {
        'command/command': 'off',
        'no-irregular-whitespace': 'off',
        'perfectionist/sort-exports': 'off',
        'perfectionist/sort-imports': 'off',
        'regexp/no-legacy-features': 'off',
        'regexp/no-missing-g-flag': 'off',
        'regexp/no-useless-dollar-replacements': 'off',
        'regexp/no-useless-flag': 'off'
      }
    },

    {
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`)
      ],
      name: 'king3/markdown/disables/code',
      rules: {
        'e18e/prefer-static-regex': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-imports': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/buffer': 'off',
        'node/prefer-global/process': 'off',

        'typescript/consistent-type-imports': 'off',
        'typescript/no-extraneous-class': 'off',
        'typescript/no-namespace': 'off',
        'typescript/no-redeclare': 'off',
        'typescript/no-require-imports': 'off',
        'typescript/no-unused-expressions': 'off',
        'typescript/no-unused-vars': 'off',
        'typescript/no-use-before-define': 'off',

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        ...overrides
      }
    }
  ]
}
