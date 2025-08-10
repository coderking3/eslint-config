import type { TypedFlatConfigItem } from '../types'

import { pluginPerfectionist } from '../plugins'

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
      },
      rules: {
        'perfectionist/sort-exports': [
          'warn',
          { order: 'asc', type: 'natural' }
        ],
        'perfectionist/sort-imports': [
          'warn',
          {
            groups: [
              'type',
              ['parent-type', 'sibling-type', 'index-type', 'internal-type'],

              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
              'side-effect',
              'object',
              'unknown'
            ],
            internalPattern: ['^[~@#]/.*'],
            newlinesBetween: 'ignore',
            order: 'asc',
            type: 'natural'
          }
        ],
        'perfectionist/sort-named-exports': [
          'warn',
          { order: 'asc', type: 'natural' }
        ],
        'perfectionist/sort-named-imports': [
          'warn',
          { order: 'asc', type: 'natural' }
        ]
      }
    }
  ]
}
