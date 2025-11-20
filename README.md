# @king-3/eslint-config

> king3's ESLint config preset.

[![npm version](https://img.shields.io/npm/v/@king-3/eslint-config.svg)](https://www.npmjs.com/package/@king-3/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@king-3/eslint-config.svg)](https://www.npmjs.com/package/@king-3/eslint-config)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@king-3/eslint-config.svg)](https://bundlephobia.com/package/@king-3/eslint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_zh.md)

## Features

- 🚀 Flat config, compose easily
- ✨ Auto-detect TypeScript, Vue, React support
- 🎨 Works seamlessly with Prettier
- 📦 Optional configs for UnoCSS, React, and more
- 🔧 Reasonable defaults, easy to customize

## Installation

### Quick Setup

```bash
pnpm add -D eslint @king-3/eslint-config
```

Create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import king3 from '@king-3/eslint-config'

export default king3()
```

### Add Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## Customization

### Basic Configuration

You can configure each integration individually:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3(
  {
    // TypeScript and Vue are auto-detected, you can also explicitly enable them:
    typescript: true,
    vue: true,

    // Disable jsonc and yaml support
    jsonc: false,
    yaml: false,

    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [
      '**/fixtures',
      '**/dist'
      // ...globs
    ]
  },
  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {
      // Your custom rules
    }
  }
)
```

### Optional Configs

We provide some optional configs for specific use cases. Dependencies are not included by default and need to be installed manually.

#### React

To enable React support:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3({
  react: true
})
```

Install required dependencies:

```bash
pnpm add -D @eslint-react/eslint-plugin eslint-plugin-react-hooks
```

#### UnoCSS

To enable UnoCSS support:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3({
  unocss: true
})
```

Install required dependencies:

```bash
pnpm add -D @unocss/eslint-plugin
```

## IDE Support

### VS Code

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

Add the following to your `.vscode/settings.json`:

```json
{
  // Enable auto-fix on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  }
}
```

### Working with Prettier

Install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

For the best experience with Prettier, use the following settings:

```json
{
  /* Editor - General */
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  /* Editor - Code Actions */
  "editor.codeActionsOnSave": {
    "source.fixAll": "never",
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  /* Prettier */
  "prettier.enable": true,
  // Optional: specify your custom Prettier config file path
  "prettier.configPath": "./prettier.config.js"
}
```

**Recommended Prettier Config**

You can use [@king-3/prettier-config](https://github.com/coderking3/prettier-config) for a consistent code style that works well with this ESLint config:

```bash
pnpm add -D @king-3/prettier-config
```

Create `.prettierrc.js` (or `./prettier.config.js`) in your project root:

```js
import { king3 } from '@king-3/prettier-config'

export default king3({
  // Optional: customize your config
  printWidth: 120
})
```

## Comparison with @antfu/eslint-config

Most rules are the same, but with some key differences:

- ✨ Uses Prettier instead of ESLint Stylistic
- 🎯 First-class support for Vue, React, Nuxt, Next, etc.
- 📏 Stricter and more opinionated defaults
- 🔧 Simpler configuration API

## License

[MIT](./LICENSE) License © 2025-PRESENT [king3](https://github.com/coderking3)
