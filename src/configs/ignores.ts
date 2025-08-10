import type { TypedFlatConfigItem } from '../types'

import { GLOB_EXCLUDE } from '../globs'
import { interopDefault } from '../utils'

export async function ignores(
  userIgnores: string[] = []
): Promise<TypedFlatConfigItem[]> {
  const pluginIgnore = await interopDefault(
    import('eslint-config-flat-gitignore')
  )
  return [
    {
      ignores: [...GLOB_EXCLUDE, ...userIgnores],
      name: 'king3/ignores'
    },
    {
      ...pluginIgnore({ strict: false }),
      name: 'king3/gitignore'
    }
  ]
}
