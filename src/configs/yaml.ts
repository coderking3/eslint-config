import type {
  OptionsFiles,
  OptionsOverrides,
  Rules,
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
        ...(pluginYaml.configs.standard.rules as Rules),
        ...(pluginYaml.configs.prettier.rules as Rules),
        'yaml/no-empty-mapping-value': 'off',

        ...overrides
      }
    }
  ]
}
