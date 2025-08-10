import type { Linter } from 'eslint'
import type {
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem
} from '../types'

import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs'

import { interopDefault } from '../utils'

export async function jsonc(
  options: OptionsFiles & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC], overrides = {} } =
    options

  const [pluginJsonc, parserJsonc] = await Promise.all([
    interopDefault(import('eslint-plugin-jsonc')),
    interopDefault(import('jsonc-eslint-parser'))
  ] as const)

  return [
    {
      name: 'king3/jsonc/setup',
      plugins: {
        jsonc: pluginJsonc as any
      }
    },
    {
      files,
      languageOptions: {
        parser: parserJsonc
      },
      name: 'king3/jsonc/rules',
      rules: {
        ...(pluginJsonc.configs['recommended-with-jsonc']
          .rules as Linter.RulesRecord),
        'jsonc/quote-props': 'off',
        'jsonc/quotes': 'off',

        ...overrides
      }
    }
  ]
}
