import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { pluginAntfu, pluginImportLite } from '../plugins'

export async function imports(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

  return [
    {
      name: 'king3/imports/rules',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImportLite
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'import/consistent-type-specifier-style': ['error', 'top-level'],
        'import/first': 'error',
        'import/no-default-export': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',

        ...overrides
      }
    }
  ]
}
