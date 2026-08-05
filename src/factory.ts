import type { Linter } from 'eslint'

import type { RuleOptions } from './typegen'
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem
} from './types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { findUpSync } from 'find-up-simple'

import {
  command,
  comments,
  disables,
  e18e,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  nextjs,
  node,
  perfectionist,
  pnpm,
  prettier,
  react,
  regexp,
  sortPackageJson,
  sortTsconfig,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml
} from './configs'
import { hasReact, hasTypeScript, hasUnoCSS, hasVue } from './env'
import { GLOB_MARKDOWN } from './globs'
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
  '@eslint-react': 'react',

  '@next/next': 'next',
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
export function king3(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files' | 'ignores'> = {},
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
    e18e: enableE18e = true,
    gitignore: enableGitignore = true,
    ignores: userIgnores = [],
    imports: enableImports = true,
    jsdoc: enableJsdoc = true,
    nextjs: enableNextjs = false,
    node: enableNode = true,
    perfectionist: enablePerfectionist = true,
    pnpm: enableCatalogs = !!findUpSync('pnpm-workspace.yaml'),
    prettier: enablePrettier = true,
    react: enableReact = hasReact(),
    regexp: enableRegexp = true,
    type: appType = 'app',
    typescript: enableTypeScript = hasTypeScript(),
    unicorn: enableUnicorn = true,
    unocss: enableUnoCSS = hasUnoCSS(),
    vue: enableVue = hasVue()
  } = options

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
          r({
            name: 'king3/gitignore',
            ...enableGitignore
          })
        ])
      )
    } else {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
          r({
            name: 'king3/gitignore',
            strict: false
          })
        ])
      )
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath =
    'tsconfigPath' in typescriptOptions
      ? typescriptOptions.tsconfigPath
      : undefined

  // Base configs
  configs.push(
    ignores(userIgnores, !enableTypeScript),
    javascript({
      overrides: getOverrides(options, 'javascript')
    }),
    comments(),
    command()
  )

  if (enablePerfectionist) {
    configs.push(
      perfectionist({
        overrides: getOverrides(options, 'perfectionist')
      })
    )
  }
  if (enableNode) {
    configs.push(node())
  }
  if (enableJsdoc) {
    configs.push(jsdoc())
  }

  if (enableImports) {
    configs.push(
      imports({
        ...resolveSubOptions(options, 'imports')
      })
    )
  }

  if (enableE18e) {
    configs.push(e18e(enableE18e === true ? {} : enableE18e))
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn))
  }

  if (enableVue) {
    componentExts.push('vue')
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, 'typescript'),
        type: appType
      })
    )
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, 'vue'),
        overrides: getOverrides(options, 'vue'),
        typescript: !!enableTypeScript
      })
    )
  }

  if (enableReact) {
    configs.push(
      react({
        ...typescriptOptions,
        ...resolveSubOptions(options, 'react'),
        overrides: getOverrides(options, 'react'),
        tsconfigPath
      })
    )
  }

  if (enableNextjs) {
    configs.push(
      nextjs({
        overrides: getOverrides(options, 'nextjs')
      })
    )
  }

  if (enableUnoCSS) {
    configs.push(
      unocss({
        ...resolveSubOptions(options, 'unocss'),
        overrides: getOverrides(options, 'unocss')
      })
    )
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc')
      }),
      sortPackageJson(),
      sortTsconfig()
    )
  }

  if (enableCatalogs) {
    const optionsPnpm = resolveSubOptions(options, 'pnpm')
    configs.push(
      pnpm({
        json: options.jsonc !== false,
        yaml: options.yaml !== false,
        ...optionsPnpm
      })
    )
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml')
      })
    )
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, 'markdown')
      })
    )
  }

  if (enablePrettier) {
    configs.push(prettier())
  }

  configs.push(disables())

  if ('files' in options) {
    throw new Error(
      '[@king3/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.'
    )
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key] as any
    return acc
  }, {} as TypedFlatConfigItem)
  if (Object.keys(fusedConfig).length) configs.push([fusedConfig])

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer.append(...configs, ...(userConfigs as any))

  if (options.markdown ?? true) {
    composer = composer.setDefaultIgnores((prev) => [...prev, GLOB_MARKDOWN])
  }

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming)
  }

  return composer
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
