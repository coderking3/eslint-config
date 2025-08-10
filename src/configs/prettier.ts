import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export async function prettier(): Promise<TypedFlatConfigItem[]> {
  const [pluginPrettier, pluginPrettierRecommended] = await Promise.all([
    interopDefault(import('eslint-plugin-prettier')),
    interopDefault(import('eslint-plugin-prettier/recommended'))
  ] as const)

  const rules = { ...pluginPrettierRecommended.rules }
  delete rules['vue/html-self-closing']

  return [
    {
      name: 'king3/prettier',
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        ...rules,
        'prettier/prettier': 'warn'
      }
    }
  ]
}
