import { isPackageExists } from 'local-pkg'

const TsPackages = ['typescript', '@typescript/native-preview']
export const hasTypeScript = () => TsPackages.some((i) => isPackageExists(i))

const VuePackages = ['vue', 'nuxt', 'vitepress', '@slidev/cli']
export const hasVue = () => VuePackages.some((i) => isPackageExists(i))

const ReactPackages = ['react', 'react-dom']
export const hasReact = () => ReactPackages.some((i) => isPackageExists(i))

const UnoCSSPackages = [
  'unocss',
  '@unocss/webpack',
  '@unocss/nuxt',
  '@unocss/eslint-plugin'
]
export const hasUnoCSS = () => UnoCSSPackages.some((i) => isPackageExists(i))
