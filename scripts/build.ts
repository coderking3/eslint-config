/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import { existsSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

import { bold, cyan, green, red, yellow } from 'ansis'

// Define paths
const distDirPath = join(process.cwd(), 'dist')
const getDtsPath = (fileName: string) => join(distDirPath, fileName)
const sourceDts = 'index.d.mts'
const targetDts = 'index.d.ts'

try {
  console.log(bold(cyan('\n🚀 Starting build...\n')))
  console.log(yellow('📦 Running tsdown build...'))

  execSync('tsdown', { stdio: 'inherit' }) // tsdown 会自己输出，不加多余空行

  // Rename index.d.mts → index.d.ts
  if (existsSync(getDtsPath(sourceDts))) {
    renameSync(getDtsPath(sourceDts), getDtsPath(targetDts))
    console.log(
      green('🔁 Renamed ') + bold(sourceDts) + green(' → ') + bold(targetDts)
    )
  } else {
    console.log(yellow(`ℹ️  dist/${sourceDts} not found, skip rename.`))
  }

  console.log(bold(green('\n🎉 Build process completed successfully!\n')))
} catch (error: unknown) {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error)

  console.error(`${bold(red('\n❌ Build failed: ')) + red(msg)}\n`)
  process.exit(1)
}
