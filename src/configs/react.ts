import type {
  OptionsFiles,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem
} from '../types'

import { isPackageExists } from 'local-pkg'

import { GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

// react refresh
const ReactRefreshAllowConstantExportPackages = ['vite']
const NextJsPackages = ['next']

export async function react(
  options: OptionsTypeScriptParserOptions &
    OptionsTypeScriptWithTypes &
    OptionsOverrides &
    OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [`${GLOB_MARKDOWN}/**`],
    overrides = {},
    tsconfigPath
  } = options

  await ensurePackages([
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-refresh'
  ])

  const isTypeAware = !!tsconfigPath

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'react/no-leaked-conditional-rendering': 'error'
  }

  const [pluginReact, pluginReactRefresh] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-refresh'))
  ] as const)

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(
    (i) => isPackageExists(i)
  )
  const isUsingNext = NextJsPackages.some((i) => isPackageExists(i))

  const plugins = pluginReact.configs.all.plugins!

  return [
    {
      name: 'king3/react/setup',
      plugins: {
        react: plugins['@eslint-react'],
        'react-dom': plugins['@eslint-react/dom'],
        'react-naming-convention': plugins['@eslint-react/naming-convention'],
        'react-refresh': pluginReactRefresh,
        'react-rsc': plugins['@eslint-react/rsc'],
        'react-web-api': plugins['@eslint-react/web-api']
      }
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        },
        sourceType: 'module'
      },
      name: 'king3/react/rules',
      rules: {
        ...pluginReact.configs.recommended.rules,

        'react-refresh/only-export-components': [
          'error',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    'generateStaticParams',
                    'metadata',
                    'generateMetadata',
                    'viewport',
                    'generateViewport',
                    'generateImageMetadata',
                    'generateSitemaps'
                  ]
                : [])
            ]
          }
        ],

        'react/prefer-namespace-import': 'error',

        ...overrides
      }
    },
    {
      files: filesTypeAware,
      name: 'king3/react/typescript',
      rules: {
        'react-dom/no-string-style-prop': 'off',
        'react-dom/no-unknown-property': 'off'
      }
    },
    ...(isTypeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: 'king3/react/type-aware-rules',
            rules: {
              ...typeAwareRules
            }
          }
        ]
      : [])
  ]
}
