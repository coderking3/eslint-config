/* eslint-disable no-console */
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

import { bold, cyan, dim, green, red } from 'ansis'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import { king3 } from '../src/factory'

// Output file path
const OUTPUT_FILE = join(process.cwd(), 'src', 'typegen.d.ts')

/**
 * Generate ESLint configurations with all features enabled
 */
async function generateConfigs() {
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

  console.log(dim('  ') + green(`✓ Generated ${configs.length} configurations`))
  return configs
}

/**
 * Generate TypeScript definitions from ESLint configs
 */
async function generateTypeDefinitions(
  configs: Awaited<ReturnType<typeof generateConfigs>>
) {
  // Extract config names
  const configNames = configs.map((i) => i.name).filter(Boolean) as string[]
  console.log(dim('  ') + green(`✓ Found ${configNames.length} named configs`))

  // Generate DTS
  let dts = await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false
  })

  // Append config names type
  dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')}
`

  return dts
}

/**
 * Write type definitions to file
 */
async function writeTypeDefinitions(dts: string) {
  await writeFile(OUTPUT_FILE, dts, 'utf-8')
  console.log(dim('  ') + green('✓ Written to ') + cyan('src/typegen.d.ts'))
}

/**
 * Format error message for display
 */
function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return JSON.stringify(error)
}

/**
 * Main typegen process
 */
async function typegen() {
  try {
    console.log(bold(cyan('🚀 Starting type generation...\n')))

    console.log(`${bold('Step 1: ')}Generating ESLint configurations`)
    const configs = await generateConfigs()

    console.log(`${bold('\nStep 2: ')}Generating type definitions`)
    const dts = await generateTypeDefinitions(configs)

    console.log(`${bold('\nStep 3: ')}Writing to file`)
    await writeTypeDefinitions(dts)

    console.log(bold(green('\n🎉 Type definitions generated successfully!\n')))
  } catch (error) {
    console.error(
      `${
        bold(red('\n❌ Type generation failed: ')) + red(formatError(error))
      }\n`
    )
    process.exit(1)
  }
}

typegen()
