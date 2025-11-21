import type { TypedFlatConfigItem } from '../types'

import { pluginPerfectionist } from '../plugins'

const SORT_OPTIONS: Record<string, any> = {
  order: 'asc',
  partitionByComment: ['^Part:.*$'],
  type: 'natural'
} as const

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'king3/perfectionist',
      plugins: {
        perfectionist: pluginPerfectionist
      },
      rules: {
        'perfectionist/sort-exports': ['warn', SORT_OPTIONS],
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
            internalPattern: ['^[@~#]/.*'],
            newlinesBetween: 'always',
            ...SORT_OPTIONS
          }
        ],
        'perfectionist/sort-named-exports': ['warn', SORT_OPTIONS],
        'perfectionist/sort-named-imports': ['warn', SORT_OPTIONS]
      }
    }
  ]
}
