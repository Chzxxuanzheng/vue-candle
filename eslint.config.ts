import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // 禁止 debugger 和 console
      'no-debugger': 'warn',
      'no-console': 'warn',
      // 优先使用箭头函数
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
      // 单引号
      quotes: ['warn', 'single'],
      // 三元表达式
      'multiline-ternary': ['warn', 'never'],
      // 分号
      semi: ['warn', 'never'],
      // 尾随逗号
      'comma-dangle': ['warn', 'always-multiline'],
      // 允许 while (true)
      'no-constant-condition': [
        'error',
        {
          checkLoops: false,
        },
      ],

      // 未使用的变量
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // 允许无返回异步
      '@typescript-eslint/no-misused-promises': 'off',

      // html 标签闭合
      'vue/html-closing-bracket-spacing': [
        'warn',
        {
          selfClosingTag: 'always',
        },
      ],

      // 每行最大属性数
      'vue/max-attributes-per-line': [
        'warn',
        {
          singleline: {
            max: 3,
          },

          multiline: {
            max: 3,
          },
        },
      ],

      // 属性换行设置
      'vue/first-attribute-linebreak': [
        'warn',
        {
          singleline: 'ignore',
          multiline: 'ignore',
        },
      ],

      // html 标签换行
      'vue/html-closing-bracket-newline': [
        'warn',
        {
          multiline: 'never',
        },
      ],

      // html 引号
      'vue/html-quotes': [
        'warn',
        'double',
        {
          avoidEscape: true,
        },
      ],

      // v-for 分隔符
      'vue/v-for-delimiter-style': ['error', 'in'],
      // 组件 name 属性
      'vue/require-name-property': 'warn',
      // 属性简写
      'vue/prefer-true-attribute-shorthand': 'warn',
      // prop 类型
      'vue/require-prop-types': 'off',
      // 单词汇组件
      'vue/multi-word-component-names': 'off',
    },
  },

  skipFormatting,
)
