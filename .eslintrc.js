module.exports = {
    env: {
        es6: true,
        node: true,
        protractor: true // allow protractor globals: browser, by, element, etc..
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        'semi': [2, 'always'],
        'quotes': [
          'error', 'single',
          {
            'allowTemplateLiterals': true
          }
        ],
        'indent': [
          2,
          2,
           {
            'SwitchCase': 1
          }
        ],
        'no-multi-spaces': [
          'error',
          {
            'ignoreEOLComments': true
          }
        ],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-empty': 2,
        'no-implicit-globals': 2,
        'no-unused-expressions': 1,
        'no-unused-labels': 1,
        'no-shadow': 1,
        'no-undef': 2,
        'no-undefined': 2,
        'no-unused-vars': 1,
        'no-use-before-define': [
            2,
            {
                functions: false,
                classes: true
            }
        ],
        'no-var': 1,
        'space-before-function-paren': [
            2,
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always'
            }
        ],
        'block-spacing': 2,
        'func-call-spacing': 2,
        'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
        'spaced-comment': ['error', 'always'],
        'function-paren-newline': ['error', 'never'],
        'semi-spacing': ['error', { before: false, after: true }],
    }
};
