import type { TypedFlatConfigItem } from '../types'

import configCommand from 'eslint-plugin-command/config'

export async function command(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ...configCommand(),
      name: 'king3/command/rules'
    }
  ]
}
