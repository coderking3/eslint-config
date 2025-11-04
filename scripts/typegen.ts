import { writeFile } from 'node:fs/promises'
import { green } from 'ansis'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import { king3 } from '../src/factory'

const configs = await king3({
  gitignore: true,
  jsonc: true,
  markdown: true,
  nextjs: true,
  pnpm: true,
  prettier: true,
  react: true,
  regexp: true,
  typescript: {
    tsconfigPath: 'tsconfig.json'
  },
  unicorn: true,
  unocss: true,
  vue: true,
  yaml: true
}).prepend({
  plugins: {
    '': {
      rules: Object.fromEntries(builtinRules.entries())
    }
  }
})

const configNames = configs.map((i) => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')}
`

await writeFile('src/typegen.d.ts', dts)

// eslint-disable-next-line no-console
console.log('✅', green('Type definitions generated!'))
