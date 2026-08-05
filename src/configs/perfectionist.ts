import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

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
export async function perfectionist(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

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
              'type-import',
              ['type-external', 'type-builtin'],
              ['type-parent', 'type-sibling', 'type-index'],
              ['type-internal'],

              'value-builtin',
              'value-external',
              'value-internal',
              ['value-parent', 'value-sibling', 'value-index'],
              'side-effect',
              'side-effect-style',
              'style',
              'ts-equals-import',
              'unknown'
            ],
            internalPattern: ['^[@~#]/.*'],
            newlinesBetween: 1,
            newlinesInside: 0,
            ...SORT_OPTIONS
          }
        ],
        'perfectionist/sort-named-exports': ['warn', SORT_OPTIONS],
        'perfectionist/sort-named-imports': ['warn', SORT_OPTIONS],

        ...overrides
      }
    }
  ]
}
