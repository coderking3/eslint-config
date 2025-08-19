import type { TypedFlatConfigItem } from '../types'

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
export async function sortPackageJson(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: ['**/package.json'],
      name: 'king3/sort/package.json',
      rules: {
        'jsonc/sort-array-values': [
          'error',
          {
            order: { type: 'asc' },
            pathPattern: '^files$'
          }
        ],
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'name',
              'version',
              'private',
              'packageManager',
              'description',
              'type',
              'keywords',
              'license',
              'homepage',
              'bugs',
              'repository',
              'author',
              'contributors',
              'funding',
              'files',
              'main',
              'module',
              'types',
              'exports',
              'typesVersions',
              'sideEffects',
              'unpkg',
              'jsdelivr',
              'browser',
              'bin',
              'man',
              'directories',
              'publishConfig',
              'scripts',
              'peerDependencies',
              'peerDependenciesMeta',
              'optionalDependencies',
              'dependencies',
              'devDependencies',
              'engines',
              'config',
              'pnpm',
              'overrides',
              'resolutions',
              'husky',
              'simple-git-hooks',
              'lint-staged',
              'eslintConfig',
              'prettier'
            ],
            pathPattern: '^$'
          },
          {
            order: { type: 'asc' },
            pathPattern:
              '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$'
          },
          {
            order: ['types', 'require', 'import', 'default'],
            pathPattern: '^exports.*$'
          },
          {
            order: { type: 'asc' },
            pathPattern: String.raw`^(?:resolutions|overrides|pnpm\.overrides)$`
          }
        ]
      }
    }
  ]
}

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
export function sortTsconfig(): TypedFlatConfigItem[] {
  return [
    {
      files: ['**/tsconfig.json', '**/tsconfig.*.json'],
      name: 'king3/sort/tsconfig',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'extends',
              'compilerOptions',
              'references',
              'files',
              'include',
              'exclude'
            ],
            pathPattern: '^$'
          },
          {
            order: [
              /* Projects */
              'incremental',
              'composite',
              'tsBuildInfoFile',
              'disableSourceOfProjectReferenceRedirect',
              'disableSolutionSearching',
              'disableReferencedProjectLoad',
              /* Language and Environment */
              'target',
              'jsx',
              'jsxFactory',
              'jsxFragmentFactory',
              'jsxImportSource',
              'lib',
              'moduleDetection',
              'noLib',
              'reactNamespace',
              'useDefineForClassFields',
              'emitDecoratorMetadata',
              'experimentalDecorators',
              /* Modules */
              'baseUrl',
              'rootDir',
              'rootDirs',
              'customConditions',
              'module',
              'moduleResolution',
              'moduleSuffixes',
              'noResolve',
              'paths',
              'resolveJsonModule',
              'resolvePackageJsonExports',
              'resolvePackageJsonImports',
              'typeRoots',
              'types',
              'allowArbitraryExtensions',
              'allowImportingTsExtensions',
              'allowUmdGlobalAccess',
              /* JavaScript Support */
              'allowJs',
              'checkJs',
              'maxNodeModuleJsDepth',
              /* Type Checking */
              'strict',
              'strictBindCallApply',
              'strictFunctionTypes',
              'strictNullChecks',
              'strictPropertyInitialization',
              'allowUnreachableCode',
              'allowUnusedLabels',
              'alwaysStrict',
              'exactOptionalPropertyTypes',
              'noFallthroughCasesInSwitch',
              'noImplicitAny',
              'noImplicitOverride',
              'noImplicitReturns',
              'noImplicitThis',
              'noPropertyAccessFromIndexSignature',
              'noUncheckedIndexedAccess',
              'noUnusedLocals',
              'noUnusedParameters',
              'useUnknownInCatchVariables',
              /* Emit */
              'declaration',
              'declarationDir',
              'declarationMap',
              'downlevelIteration',
              'emitBOM',
              'emitDeclarationOnly',
              'importHelpers',
              'importsNotUsedAsValues',
              'inlineSourceMap',
              'inlineSources',
              'isolatedDeclarations',
              'mapRoot',
              'newLine',
              'noEmit',
              'noEmitHelpers',
              'noEmitOnError',
              'outDir',
              'outFile',
              'preserveConstEnums',
              'preserveValueImports',
              'removeComments',
              'sourceMap',
              'sourceRoot',
              'stripInternal',
              /* Interop Constraints */
              'allowSyntheticDefaultImports',
              'esModuleInterop',
              'forceConsistentCasingInFileNames',
              'isolatedModules',
              'preserveSymlinks',
              'verbatimModuleSyntax',
              /* Completeness */
              'skipDefaultLibCheck',
              'skipLibCheck'
            ],
            pathPattern: '^compilerOptions$'
          }
        ]
      }
    }
  ]
}

/**
 * Sort package.json
 *
 * Requires `yaml` config
 */
export async function sortPnpmWorkspace(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: ['**/pnpm-workspace.yaml'],
      name: 'king3/sort/pnpm-workspace',
      rules: {
        'yaml/sort-keys': [
          'error',
          {
            order: [
              'packages',
              'overrides',
              'patchedDependencies',
              'hoistPattern',
              'defines',
              'catalog',
              'catalogs',

              'allowedDeprecatedVersions',
              'allowNonAppliedPatches',
              'configDependencies',
              'ignoredBuiltDependencies',
              'ignoredOptionalDependencies',
              'neverBuiltDependencies',
              'onlyBuiltDependencies',
              'onlyBuiltDependenciesFile',
              'packageExtensions',
              'peerDependencyRules',
              'supportedArchitectures'
            ],
            pathPattern: '^$'
          },
          {
            allowLineSeparatedGroups: true,
            order: { type: 'asc' },
            pathPattern: '^catalog$'
          },
          {
            order: { type: 'asc' },
            pathPattern: `^catalogs$`
          },
          {
            allowLineSeparatedGroups: true,
            order: { type: 'asc' },
            pathPattern: String.raw`^catalogs\..+$`
          }
        ]
      }
    }
  ]
}
