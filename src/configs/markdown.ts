import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsMarkdown,
  TypedFlatConfigItem
} from '../types'

import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'

import {
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  GLOB_MARKDOWN_IN_MARKDOWN
} from '../globs'
import { interopDefault } from '../utils'

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsMarkdown = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    files = [GLOB_MARKDOWN],
    gfm = true,
    overrides = {},
    overridesMarkdown = {}
  } = options

  const markdown = await interopDefault(import('@eslint/markdown'))

  return [
    {
      name: 'king3/markdown/setup',
      plugins: {
        markdown
      }
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      name: 'king3/markdown/processor',
      processor: mergeProcessors([
        markdown.processors!.markdown,
        processorPassThrough
      ])
    },
    {
      files,
      language: gfm ? 'markdown/gfm' : 'markdown/commonmark',
      name: 'king3/markdown/parser'
    },
    {
      files,
      name: 'king3/markdown/rules',
      rules: {
        ...markdown.configs.recommended.at(0)?.rules,
        'markdown/fenced-code-language': 'off',
        // https://github.com/eslint/markdown/issues/294
        'markdown/no-missing-label-refs': 'off',
        ...overridesMarkdown
      }
    },
    {
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`)
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true
          }
        }
      },
      name: 'king3/markdown/disables/code',
      rules: {
        'antfu/no-top-level-await': 'off',

        'e18e/prefer-static-regex': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/process': 'off',

        'typescript/consistent-type-imports': 'off',
        'typescript/explicit-function-return-type': 'off',
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
