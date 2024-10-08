import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import vuePrettierEslintConfig from '@vue/eslint-config-prettier/skip-formatting'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  vuePrettierEslintConfig,
  {
    files: [
      '**/*.vue',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
    ],
  },
  {
    ignores: ['.gitignore', '**/.vite-ssg-temp/', '**/dist/', '**/node_modules/'],
  },
]
