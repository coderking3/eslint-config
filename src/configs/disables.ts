import type { TypedFlatConfigItem } from '../types'

import { GLOB_SRC, GLOB_SRC_EXT } from '../globs'

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: 'king3/disables/scripts',
      rules: {
        'no-console': 'off',
        'typescript/explicit-function-return-type': 'off'
      }
    },
    {
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: 'king3/disables/cli',
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'king3/disables/bin',
      rules: {}
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'king3/disables/dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off'
      }
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'king3/disables/cjs',
      rules: {
        'typescript/no-require-imports': 'off'
      }
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: 'king3/disables/config-files',
      rules: {
        'no-console': 'off',
        'typescript/explicit-function-return-type': 'off'
      }
    }
  ]
}
