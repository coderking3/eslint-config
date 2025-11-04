import type { TypedFlatConfigItem } from '../types'

import { pluginPerfectionist } from '../plugins'

const sortSettings: Record<string, any> = {
  order: 'asc',
  type: 'natural'
}

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'king3/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist
      }
    },
    {
      name: 'king3/perfectionist/rules',
      rules: {
        'perfectionist/sort-exports': ['warn', sortSettings],
        'perfectionist/sort-imports': [
          'warn',
          {
            groups: [
              ['external-type', 'builtin-type', 'type'],
              ['parent-type', 'sibling-type', 'index-type'],
              ['internal-type'],

              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
              'side-effect',
              'side-effect-style',
              'style',
              'object',
              'unknown'
            ],
            internalPattern: ['^[~@#]/.*'],
            newlinesBetween: 'ignore',
            partitionByComment: ['^Part:.*$'],
            ...sortSettings
          }
        ],
        'perfectionist/sort-named-exports': ['warn', sortSettings],
        'perfectionist/sort-named-imports': ['warn', sortSettings]
      }
    }
  ]
}
