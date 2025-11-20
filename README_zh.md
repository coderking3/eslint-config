# @king-3/eslint-config

> king3 的 ESLint 配置预设。

[![npm version](https://img.shields.io/npm/v/@king-3/eslint-config.svg)](https://www.npmjs.com/package/@king-3/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@king-3/eslint-config.svg)](https://www.npmjs.com/package/@king-3/eslint-config)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@king-3/eslint-config.svg)](https://bundlephobia.com/package/@king-3/eslint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_zh.md)

## 特性

- 🚀 Flat 配置，轻松组合
- ✨ 自动检测 TypeScript、Vue、React 支持
- 🎨 与 Prettier 完美协作
- 📦 可选配置支持 UnoCSS、React 等
- 🔧 合理的默认配置，易于自定义

## 安装

### 快速开始

```bash
pnpm add -D eslint @king-3/eslint-config
```

在项目根目录创建 `eslint.config.mjs`:

```js
// eslint.config.mjs
import king3 from '@king-3/eslint-config'

export default king3()
```

### 添加脚本

在 `package.json` 中添加以下脚本:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## 自定义配置

### 基础配置

你可以单独配置每个集成:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3(
  {
    // TypeScript 和 Vue 会自动检测，你也可以显式启用:
    typescript: true,
    vue: true,

    // 禁用 jsonc 和 yaml 支持
    jsonc: false,
    yaml: false,

    // Flat 配置不再支持 `.eslintignore`，请使用 `ignores` 代替
    ignores: [
      '**/fixtures',
      '**/dist'
      // ...globs
    ]
  },
  // 从第二个参数开始是 ESLint Flat 配置
  // 你可以有多个配置对象
  {
    files: ['**/*.ts'],
    rules: {
      // 你的自定义规则
    }
  }
)
```

### 可选配置

我们为特定用例提供了一些可选配置。默认不包含依赖项,需要手动安装。

#### React

启用 React 支持:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3({
  react: true
})
```

安装所需依赖:

```bash
pnpm add -D @eslint-react/eslint-plugin eslint-plugin-react-hooks
```

#### UnoCSS

启用 UnoCSS 支持:

```js
// eslint.config.js
import king3 from '@king-3/eslint-config'

export default king3({
  unocss: true
})
```

安装所需依赖:

```bash
pnpm add -D @unocss/eslint-plugin
```

## IDE 支持

### VS Code

安装 [ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)。

在 `.vscode/settings.json` 中添加以下配置:

```json
{
  // 启用保存时自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  }
}
```

### 配合 Prettier 使用

安装 [Prettier 扩展](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)。

为了获得最佳体验,请使用以下配置:

```json
{
  /* 编辑器 - 通用 */
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  /* 编辑器 - 代码操作 */
  "editor.codeActionsOnSave": {
    "source.fixAll": "never",
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  /* Prettier */
  "prettier.enable": true,
  // 可选：指定你自定义的 Prettier 配置文件路径
  "prettier.configPath": "./prettier.config.js"
}
```

**推荐的 Prettier 配置**

你可以使用 [@king-3/prettier-config](https://github.com/coderking3/prettier-config) 来获得与此 ESLint 配置配合良好的一致代码风格:

```bash
pnpm add -D @king-3/prettier-config
```

在项目根目录创建 `.prettierrc.js`（或 `prettier.config.js`）:

```js
import { king3 } from '@king-3/prettier-config'

export default king3({
  // 可选：自定义你的配置
  printWidth: 120
})
```

## 与 @antfu/eslint-config 的对比

大部分规则相同,但也有一些关键差异:

- ✨ 使用 Prettier 而非 ESLint Stylistic
- 🎯 对 Vue、React、Nuxt、Next 等框架的一流支持
- 📏 更严格、更主观的默认配置
- 🔧 更简洁的配置 API

## 许可证

[MIT](./LICENSE) License © 2025-至今 [king3](https://github.com/coderking3)
