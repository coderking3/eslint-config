import type { OptionsUnoCSS, TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export async function unocss(
  options: OptionsUnoCSS = {}
): Promise<TypedFlatConfigItem[]> {
  const { attributify = true, strict = false } = options

  // @unocss/eslint-plugin 需要手动安装
  const [pluginUnoCSS] = await Promise.all([
    interopDefault(import('@unocss/eslint-plugin'))
  ] as const)

  return [
    {
      name: 'king3/unocss',
      plugins: {
        unocss: pluginUnoCSS
      },
      rules: {
        'unocss/order': 'warn',
        ...(attributify
          ? {
              'unocss/order-attributify': 'warn'
            }
          : {}),
        ...(strict
          ? {
              'unocss/blocklist': 'error'
            }
          : {})
      }
    }
  ]
}
