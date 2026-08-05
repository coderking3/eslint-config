import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { ConfigWithExtends } from 'eslint-flat-config-utils'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'

import type { ConfigNames, RuleOptions } from './typegen'

export type Awaitable<T> = T | Promise<T>

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> &
  RuleOptions

export type { ConfigNames, RuleOptions }

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<
  ConfigWithExtends,
  'plugins' | 'rules'
> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export interface OptionsMarkdown extends OptionsOverrides {
  /**
   * Enable GFM (GitHub Flavored Markdown) support.
   *
   * @default true
   */
  gfm?: boolean

  /**
   * Override rules for Markdown itself.
   */
  overridesMarkdown?: TypedFlatConfigItem['rules']
}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions
}

export type OptionsTypescript =
  | (OptionsTypeScriptWithTypes &
      OptionsOverrides &
      OptionsTypeScriptErasableOnly)
  | (OptionsTypeScriptParserOptions &
      OptionsOverrides &
      OptionsTypeScriptErasableOnly)

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsE18e extends OptionsOverrides {
  /**
   * Include modernization rules.
   *
   * @see https://github.com/e18e/eslint-plugin#modernization
   * @default true
   */
  modernization?: boolean

  /**
   * Include module replacements rules.
   *
   * @see https://github.com/e18e/eslint-plugin#module-replacements
   * @default false
   */
  moduleReplacements?: boolean

  /**
   * Include performance improvements rules.
   *
   * @see https://github.com/e18e/eslint-plugin#performance-improvements
   * @default true
   */
  performanceImprovements?: boolean
}

export interface OptionsUnicorn extends OptionsOverrides {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by King3.
   *
   * @default false
   */
  allRecommended?: boolean
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']
}

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib'
}

export interface OptionsTypeScriptErasableOnly {
  /**
   * Enable erasable syntax only rules.
   *
   * @see https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only
   * @default false
   */
  erasableOnly?: boolean
}

export interface OptionsRegExp {
  /**
   * Override rule levels.
   */
  level?: 'error' | 'warn'
}

export interface OptionsPnpm {
  /**
   * Requires catalogs usage.
   *
   * Detects automatically based on whether `catalogs` is used in pnpm-workspace.yaml.
   */
  catalogs?: boolean

  /**
   * Enable linting for package.json using the JSONC parser.
   *
   * @default true
   */
  json?: boolean

  /**
   * Enable linting for pnpm-workspace.yaml using the YAML parser.
   *
   * @default true
   */
  yaml?: boolean

  /**
   * Sort entries in pnpm-workspace.yaml.
   *
   * @default true
   */
  sort?: boolean
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean

  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}

export interface OptionsReact extends OptionsOverrides {}

export interface OptionsConfig
  extends OptionsComponentExts, OptionsProjectType {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions

  /**
   * Extend the global ignores.
   *
   * Passing an array to extend the ignores.
   * Passing a function to modify the default ignores.
   *
   * @default []
   */
  ignores?: string[] | ((originals: string[]) => string[])

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable Node.js rules.
   *
   * @default true
   */
  node?: boolean

  /**
   * Enable JSDoc rules.
   *
   * @default true
   */
  jsdoc?: boolean

  /**
   * Enable TypeScript support.
   *
   * Passing an object enables TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Options for @e18e/eslint-plugin.
   *
   * @see https://github.com/e18e/eslint-plugin
   * @default true
   */
  e18e?: boolean | OptionsE18e

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn

  /**
   * Options for eslint-plugin-perfectionist.
   *
   * @default true
   */
  perfectionist?: boolean | OptionsOverrides

  /**
   * Options for eslint-plugin-import-lite.
   *
   * @default true
   */
  imports?: boolean | OptionsOverrides

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides

  /**
   * Enable linting for code snippets in Markdown and the Markdown content itself.
   *
   * @default true
   */
  markdown?: boolean | OptionsMarkdown

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides)

  /**
   * Enable React rules.
   *
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-refresh`
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean | OptionsReact

  /**
   * Enable Next.js rules.
   *
   * Requires installing:
   * - `@next/eslint-plugin-next`
   *
   * @default false
   */
  nextjs?: boolean | OptionsOverrides

  /**
   * Enable UnoCSS rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default auto-detect based on the dependencies
   */
  unocss?: boolean | OptionsUnoCSS

  /**
   * Enable pnpm workspace and catalogs support.
   *
   * @default auto-detect based on pnpm-workspace.yaml
   */
  pnpm?: boolean | OptionsPnpm

  /**
   * Enable Prettier support.
   *
   * Requires installing:
   * - `prettier`
   *
   * @default true
   */
  prettier?: boolean

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
    vue?: TypedFlatConfigItem['rules']
    jsonc?: TypedFlatConfigItem['rules']
    markdown?: TypedFlatConfigItem['rules']
    yaml?: TypedFlatConfigItem['rules']
    react?: TypedFlatConfigItem['rules']
  }
}
