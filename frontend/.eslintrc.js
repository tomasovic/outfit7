/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
        'cypress/support/**/*.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    },
    {
      files: ['src/components/__tests__/*.spec.{j,t}s?(x)'],
      globals: {
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        it: 'readonly'
      }
    }
  ],

  parserOptions: {
    ecmaVersion: 'latest'
  }
}
