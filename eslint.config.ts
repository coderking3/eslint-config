import { king3 } from './src/index'

const eslintConfig = king3(
  {
    vue: true,
    react: true,
    nextjs: false,
    typescript: true,
    markdown: {
      overrides: {
        'no-dupe-keys': 'off'
      }
    },
    pnpm: true,
    prettier: true
  },
  {
    ignores: ['fixtures', '_fixtures', '**/constants-generated.ts']
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          type: 'natural'
        }
      ]
    }
  }
)

export default eslintConfig
