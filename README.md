# @king-3/eslint-config

king3's ESLint config preset.

[![npm version](https://img.shields.io/npm/v/@king-3/eslint-config.svg)](https://npmjs.com/package/@king-3/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@king-3/eslint-config)](https://www.npmcharts.com/compare/@king-3/eslint-config?interval=30)

## Usage

### Manual Install

If you prefer to set up manually:

```bash
pnpm i -D eslint @king-3/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import king3 from '@king-3/eslint-config'

export default king3()
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## Customization

You can configure each integration individually, for example:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3(
  // Configures for king3's config
  {
    // TypeScript and Vue are autodetected, you can also explicitly enable them:
    typescript: true,
    vue: true,

    // Disable jsonc and yaml support
    jsonc: false,
    yaml: false,

    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [
      '**/example'
      // ...globs
    ]
  },
  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {}
  },
  {
    rules: {}
  }
)
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### React

To enable React support, you need to explicitly turn it on:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3({
  react: true
})
```

You need to install the required dependencies manually

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks
```

#### UnoCSS

To enable React support, you need to explicitly turn it on:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3({
  unocss: true
})
```

You need to install the required dependencies manually

```bash
npm i -D @unocss/eslint-plugin
```

## Comparison with @antfu/eslint-config

Most rules are the same, but there are also some differences:

- Use Prettier instead of ESLint Stylistic.
- Supports frameworks such as Vue, React, Nuxt, Next, etc.
- Perhaps stricter and simpler.
