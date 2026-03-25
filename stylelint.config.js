/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-prettier/recommended',
    'stylelint-config-recess-order',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss'
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,

    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,

    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['em']
      }
    ],

    'custom-property-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9*]+)*$',

    'number-max-precision': 6,

    'no-empty-source': null,
    'block-no-empty': null,
    'selector-class-pattern': null
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss'
    },
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ]
}
