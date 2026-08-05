import type {
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem
} from '../types'

import { GLOB_YAML } from '../globs'
import { interopDefault } from '../utils'

export async function yaml(
  options: OptionsOverrides & OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_YAML], overrides = {} } = options

  const [pluginYaml, parserYaml] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser'))
  ] as const)

  return [
    {
      name: 'king3/yaml/setup',
      plugins: {
        yaml: pluginYaml
      }
    },
    {
      files,
      languageOptions: {
        parser: parserYaml
      },
      name: 'king3/yaml/rules',
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...overrides
      }
    }
  ]
}
