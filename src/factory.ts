import type { Linter } from 'eslint'
import type { RuleOptions } from './typegen'
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem
} from './types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'

import {
  command,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  perfectionist,
  pnpm,
  prettier,
  regexp,
  sortPackageJson,
  sortPnpmWorkspace,
  sortTsconfig,
  typescript,
  unicorn,
  unocss,
  yaml
} from './configs'
import { hasTypeScript, hasUnoCSS } from './env'
import { interopDefault } from './utils'

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings'
] satisfies (keyof TypedFlatConfigItem)[]

export const defaultPluginRenaming = {
  '@typescript-eslint': 'typescript',
  'import-lite': 'import',
  n: 'node',

  yml: 'yaml'
}

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function antfu(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    imports: enableImports = true,
    pnpm: enableCatalogs = false, // TODO: smart detect
    regexp: enableRegexp = true,
    typescript: enableTypeScript = hasTypeScript(),
    unicorn: enableUnicorn = true,
    unocss: enableUnoCSS = hasUnoCSS()
  } = options

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath =
    'tsconfigPath' in typescriptOptions
      ? typescriptOptions.tsconfigPath
      : undefined

  // Base configs
  configs.push(
    command(),
    comments(),
    imports(),
    ignores(options.ignores),
    javascript({
      overrides: getOverrides(options, 'javascript')
    }),
    jsdoc(),
    node(),

    // Optional plugins (installed but not enabled by default)
    perfectionist()
  )

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn))
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, 'typescript')
      })
    )
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  return [] as any
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? ({} as any)
    : options[key] || ({} as any)
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...('overrides' in sub ? sub.overrides : {})
  }
}
