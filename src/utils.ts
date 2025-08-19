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
