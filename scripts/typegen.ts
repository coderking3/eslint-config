import { writeFile } from 'node:fs/promises'
import { green } from 'ansis'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import { combine } from '../src/utils'
import {
  comments,
  command,
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
  typescript,
  unicorn,
  unocss,
  yaml
} from '../src/configs'

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries())
      }
    }
  },
  comments(),
  command(),
  ignores(),
  imports(),
  javascript(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  pnpm(),
  prettier(),
  regexp(),
  sortPackageJson(),
  typescript(),
  unicorn(),
  unocss(),
  yaml()
)

const configNames = configs.map((i) => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')}
`

await writeFile('src/typegen.d.ts', dts)

console.log(green('Type definitions generated!'))
