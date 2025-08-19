import type { Rules, TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export async function prettier(): Promise<TypedFlatConfigItem[]> {
  const [pluginPrettier, pluginPrettierRecommended] = await Promise.all([
    interopDefault(import('eslint-plugin-prettier')),
    interopDefault(import('eslint-plugin-prettier/recommended'))
  ] as const)

  const recommendedRules = { ...pluginPrettierRecommended.rules } as Rules
  delete recommendedRules['vue/html-self-closing']

  return [
    {
      name: 'king3/prettier',
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        ...recommendedRules,
        'prettier/prettier': 'warn'
      }
    }
  ]
}
