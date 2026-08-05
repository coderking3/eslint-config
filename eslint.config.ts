import { king3 } from './src/index'

const eslint_config = king3(
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

export default eslint_config
