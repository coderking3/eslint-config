import type { Awaitable, TypedFlatConfigItem } from './types'

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(
  ...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

export async function interopDefault<T>(
  m: Awaitable<T>
): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      for (const [from, to] of Object.entries(map)) {
        if (key.startsWith(`${from}/`))
          return [to + key.slice(from.length), value]
      }
      return [key, value]
    })
  )
}

export function isInEditorEnv(): boolean {
  if (process.env.CI) return false
  if (isInGitHooksOrLintStaged()) return false
  return !!(
    process.env.VSCODE_PID ||
    process.env.VSCODE_CWD ||
    process.env.JETBRAINS_IDE ||
    process.env.VIM ||
    process.env.NVIM
  )
}

export function isInGitHooksOrLintStaged(): boolean {
  return !!(
    process.env.GIT_PARAMS ||
    process.env.VSCODE_GIT_COMMAND ||
    process.env.npm_lifecycle_script?.startsWith('lint-staged')
  )
}
