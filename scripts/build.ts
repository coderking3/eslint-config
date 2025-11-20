/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import { existsSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

import { bold, cyan, green, red, yellow } from 'ansis'

// File rename configuration
const RENAME_MAP = [
  { from: 'index.d.mts', to: 'index.d.ts' },
  { from: 'index.mjs', to: 'index.js' }
] as const

const distDir = join(process.cwd(), 'dist')

/**
 * Rename a file in the dist directory
 */
function renameFile(from: string, to: string): boolean {
  const sourcePath = join(distDir, from)
  const targetPath = join(distDir, to)

  if (!existsSync(sourcePath)) {
    console.log(yellow(`ℹ️  ${from} not found, skipping...`))
    return false
  }

  renameSync(sourcePath, targetPath)
  console.log(green('🔁 Renamed ') + bold(from) + green(' → ') + bold(to))
  return true
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
 * Main build process
 */
function build() {
  try {
    console.log(bold(cyan('\n🚀 Starting build script...\n')))
    console.log(yellow('📦 Running tsdown build...'))

    execSync('tsdown', { stdio: 'inherit' })

    // Batch rename files
    console.log()
    RENAME_MAP.forEach(({ from, to }) => renameFile(from, to))

    console.log(bold(green('\n🎉 Build completed successfully!\n')))
  } catch (error) {
    console.error(
      `${bold(red('\n❌ Build failed: ')) + red(formatError(error))}\n`
    )
    process.exit(1)
  }
}

build()
