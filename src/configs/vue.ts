import type {
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  TypedFlatConfigItem
} from '../types'

import { GLOB_VUE } from '../globs'
import { interopDefault } from '../utils'

export async function vue(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_VUE], overrides = {} } = options

  const [pluginVue, parserVue] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser'))
  ] as const)

  return [
    {
      // This allows Vue plugin to work with auto imports
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly'
        }
      },
      name: 'king3/vue/setup',
      plugins: {
        vue: pluginVue
      }
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript
            ? ((await interopDefault(
                import('@typescript-eslint/parser')
              )) as any)
            : null,
          sourceType: 'module'
        }
      },
      name: 'king3/vue/rules',
      processor: pluginVue.processors['.vue'],
      rules: {
        ...(pluginVue.configs.base.rules as any),

        ...(pluginVue.configs['flat/recommended']
          .map((c) => c.rules)
          .reduce((acc, c) => ({ ...acc, ...c }), {}) as any),

        'node/prefer-global/process': 'off',

        'vue/block-order': [
          'error',
          { order: ['script', 'template', 'style'] }
        ],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        // this is deprecated
        'vue/component-tags-order': 'off',
        'vue/define-macros-order': [
          'error',
          {
            order: [
              'defineOptions',
              'defineProps',
              'defineEmits',
              'defineSlots'
            ]
          }
        ],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-self-closing': [
          'error',
          {
            html: {
              component: 'always',
              normal: 'always',
              void: 'any'
            },
            math: 'always',
            svg: 'always'
          }
        ],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-constant-condition': 'warn',
        'vue/no-empty-pattern': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement'
        ],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',

        ...overrides
      }
    }
  ]
}
